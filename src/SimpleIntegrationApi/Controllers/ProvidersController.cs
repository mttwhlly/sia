using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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
            
            // return if only version and limit parrams present
            if (queryParams.Count == 2)
                return Ok(new List<object>());

            var queryString = string.Join("&", queryParams.Select(x => $"{x.Key}={Uri.EscapeDataString(x.Value)}"));
            var requestUrl = $"https://npiregistry.cms.hhs.gov/api/?{queryString}";
            
            _logger.LogInformation("Fetching from NPPES API: {Url}", requestUrl);

            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync(requestUrl);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to fetch from NPPES API. Status code: {StatusCode}", response.StatusCode);
                return StatusCode(500, new { error = "Failed to fetch provider data" });
            }

            var content = await response.Content.ReadAsStringAsync();
            
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            
            var nppesResponse = JsonSerializer.Deserialize<NppesResponse>(content, options);

            if (nppesResponse?.results == null)
            {
                _logger.LogWarning("Deserialized response or results is null");
                return Ok(new List<object>());
            }
            _logger.LogInformation("Found {Count} results", nppesResponse.results.Count);

            var providers = nppesResponse.results.Select(x => new ProviderResponse
            {
                npi = x.number,
                name = $"{x.basic.last_name}, {x.basic.first_name}",
                address = x.addresses.FirstOrDefault()?.address_1 ?? "",
                city = x.addresses.FirstOrDefault()?.city ?? "", 
                state = x.addresses.FirstOrDefault()?.state ?? "", 
                zip = x.addresses.FirstOrDefault()?.postal_code ?? ""
            }).ToList();
            
            return Ok(providers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching from NPPES API");
            return StatusCode(500, new { error = "Failed to fetch provider data" });
        }
    }
}
