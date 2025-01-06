using SimpleIntegrationApi.Models.Nppes;

namespace SimpleIntegrationApi.Mappers;
public static class ProviderMapper
{
    public static List<ProviderResponse> MapToProviderResponses(NppesResponse response)
    {
        if (response == null || response.results == null)
        {
            // If the response or results are null, return an empty list
            return new List<ProviderResponse>();
        }
        return response.results.Select(result => new ProviderResponse
        {
            npi = result.number,
            name = $"{result.basic.last_name}, {result.basic.first_name}",
            address = result.addresses.FirstOrDefault()?.address_1 ?? string.Empty,
            city = result.addresses.FirstOrDefault()?.city ?? string.Empty,
            state = result.addresses.FirstOrDefault()?.state ?? string.Empty,
            zip = result.addresses.FirstOrDefault()?.postal_code ?? string.Empty
        }).ToList();
    }
}