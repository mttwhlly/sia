namespace SimpleIntegrationApi.Helpers;

using SimpleIntegrationApi.Models.Nppes;

public static class ProviderMapper
{
    public static List<ProviderResponse> MapToProviderResponses(NppesResponse response)
    {
        if (response == null || response.results == null)
            return new List<ProviderResponse>();

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