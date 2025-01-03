using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace SimpleIntegrationApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ProvidersController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private const string NPPES_API_URL = "https://npiregistry.cms.hhs.gov/api/";
    private readonly ILogger<ProvidersController> _logger;

    public class NppesResponse
    {
        public JsonDocument Data { get; set; }
    }

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
                { "limit", "10" }
            };

            if (!string.IsNullOrEmpty(firstName))
                queryParams.Add("first_name", firstName);
            if (!string.IsNullOrEmpty(lastName))
                queryParams.Add("last_name", lastName);
            if (!string.IsNullOrEmpty(city))
                queryParams.Add("city", city);
            if (!string.IsNullOrEmpty(state))
                queryParams.Add("state", state);

            var queryString = string.Join("&", queryParams.Select(x => $"{x.Key}={Uri.EscapeDataString(x.Value)}"));
            var requestUrl = $"{NPPES_API_URL}?{queryString}";

            var httpClient = _httpClientFactory.CreateClient();
            var response = await httpClient.GetAsync(requestUrl);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to fetch from NPPES API. Status code: {StatusCode}", response.StatusCode);
                return StatusCode(500, new { error = "Failed to fetch provider data" });
            }

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(content);
            
            return Ok(jsonDoc.RootElement);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching from NPPES API");
            return StatusCode(500, new { error = "Failed to fetch provider data" });
        }
    }
}
