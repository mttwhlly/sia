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
        public List<NPPESResult> results { get; set; }
        public int result_count { get; set; }
    }

    public class NPPESResult
    {
        public string number { get; set; }
        public Basic basic { get; set; }
        public List<Address> addresses { get; set; }
    }

    public class Basic
    {
        public string first_name { get; set; }
        public string last_name { get; set; }
    }

    public class Address
    {
        public string address_1 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string postal_code { get; set; }
    }
    public class ProviderResponse
{
    public string npi { get; set; }
    public string name { get; set; }
    public string address { get; set; }
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
            _logger.LogInformation("API Response: {Content}", content);
            
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
                name = $"{x.basic.first_name} {x.basic.last_name}",
                address = $"{x.addresses[0].address_1}, {x.addresses[0].city}, {x.addresses[0].state} {x.addresses[0].postal_code}",
            }).ToList();

            _logger.LogInformation("Providers: {Providers}", providers);
            
            return Ok(providers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching from NPPES API");
            return StatusCode(500, new { error = "Failed to fetch provider data" });
        }
    }
}
