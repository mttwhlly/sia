using Microsoft.AspNetCore.Mvc;
using SimpleIntegrationApi.Mappers;
using SimpleIntegrationApi.Services;

namespace SimpleIntegrationApi.Controllers;

[ApiController]
[Route("[controller]")]
[EnableCors]

public class ProvidersController : ControllerBase
{
    private readonly NppesApiClient _nppesApiClient;
    private readonly ILogger<ProvidersController> _logger;

    public ProvidersController(NppesApiClient nppesApiClient, ILogger<ProvidersController> logger)
    {
        _nppesApiClient = nppesApiClient;
        _logger = logger;
    }
    
    [HttpOptions]
    public IActionResult PreflightRoute()
    {
        return NoContent();
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
            _logger.LogInformation($"Received provider search request: firstName={firstName}, lastName={lastName}, city={city}, state={state}");
            
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

            try
            {

                var nppesResponse = await _nppesApiClient.GetProvidersAsync(queryParams);

                if (nppesResponse?.results == null || !nppesResponse.results.Any())
                    return Ok(new List<ProviderResponse>());

                var providers = ProviderMapper.MapToProviderResponses(nppesResponse);

                return Ok(providers);
            }
            catch (HttpRequestException ex) // Handle network errors (e.g., server being unreachable)
            {
                _logger.LogError(ex, "Error occurred while fetching providers from the API.");
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "An error occurred while fetching providers.");
            }
        }
        catch (Exception ex) // Catch other unforeseen exceptions
        {
            _logger.LogError(ex, "An unexpected error occurred in the Get method.");
            return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
        }
    }
}
