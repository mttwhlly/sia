using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using SimpleIntegrationApi.Helpers;
using SimpleIntegrationApi.Models.Nppes;

namespace SimpleIntegrationApi.Controllers;

[ApiController]
[Route("[controller]")]

public class ProvidersController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ProvidersController> _logger;
    public ProvidersController(IHttpClientFactory httpClientFactory, ILogger<ProvidersController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }
    

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string? firstName,
        [FromQuery] string? lastName,
        [FromQuery] string? city,
        [FromQuery] string? state)
    {
        try
        {
            var queryParams = new Dictionary<string, string>
            {
                { "version", "2.1" },
                { "limit", "200" },
            };
            
            if (!string.IsNullOrEmpty(firstName))
                queryParams.Add("first_name", firstName);
            if (!string.IsNullOrEmpty(lastName))
                queryParams.Add("last_name", lastName);
            if (!string.IsNullOrEmpty(city))
                queryParams.Add("city", city);
            if (!string.IsNullOrEmpty(state))
                queryParams.Add("state", state);
            
            // return if only version and limit params present
            if (queryParams.Count == 2)
                return Ok(new List<object>());

            var queryString = string.Join("&", queryParams.Select(x => $"{x.Key}={Uri.EscapeDataString(x.Value)}"));
            var requestUrl = $"https://npiregistry.cms.hhs.gov/api/?{queryString}";
            
            _logger.LogInformation("Fetching from NPPES API: {Url}", requestUrl);

            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync(requestUrl);

            if (!response.IsSuccessStatusCode)
                return StatusCode(StatusCodes.Status500InternalServerError);

            var content = await response.Content.ReadAsStringAsync();
            
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            NppesResponse? nppesResponse = null;
            try
            {
                nppesResponse = JsonSerializer.Deserialize<NppesResponse>(content, options);
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Failed to deserialize NPPES response");
            }
            if (nppesResponse == null || nppesResponse.results == null || !nppesResponse.results.Any())
            {
                return Ok(new List<object>());
            }
            _logger.LogInformation("Found {Count} results", nppesResponse.results.Count);

            var providers = ProviderMapper.MapToProviderResponses(nppesResponse);
            
            return Ok(providers);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, $"An error occurred while fetching providers: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
