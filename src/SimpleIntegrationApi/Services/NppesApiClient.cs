using System.Text.Json;
using SimpleIntegrationApi.Models.Nppes;

namespace SimpleIntegrationApi.Services;

public interface INppesApiClient
{
    Task<NppesResponse> FetchProviders(string firstName, string lastName, string city, string state);
}
public class NppesApiClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<NppesApiClient> _logger;

    public NppesApiClient(HttpClient httpClient, ILogger<NppesApiClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<NppesResponse?> GetProvidersAsync(Dictionary<string, string> queryParams)
    {
        try
        {
            // Build query string from parameters
            var queryString = string.Join("&", queryParams.Select(x => $"{x.Key}={Uri.EscapeDataString(x.Value)}"));
            var requestUrl = $"/api/?{queryString}";

            _logger.LogInformation("Fetching from NPPES API: {Url}", _httpClient.BaseAddress + requestUrl);

            // Send GET request
            var response = await _httpClient.GetAsync(requestUrl);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("NPPES API call failed with StatusCode: {StatusCode}", response.StatusCode);
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();

            // Deserialize response to NppesResponse model
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return JsonSerializer.Deserialize<NppesResponse>(content, options);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "An HTTP request error occurred");
            return null;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize the NPPES API response");
            return null;
        }
    }
}