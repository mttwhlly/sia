namespace SimpleIntegrationApi.Tests.Models;

public class NppesResponse
{
    public List<NppesResult> results { get; set; } = new();
}

public class NppesResult
{
    public int Number { get; set; }
    public Basic Basic { get; set; } = new();
    public List<Address> Addresses { get; set; } = new();
}

public class Basic
{
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
}

public class Address
{
    public string City { get; set; } = "";
    public string State { get; set; } = "";
}

public class ProviderResponse
{
    public string Name { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
}