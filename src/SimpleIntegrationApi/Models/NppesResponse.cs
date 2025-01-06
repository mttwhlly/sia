namespace SimpleIntegrationApi.Models.Nppes;
public class NppesResponse
{
    public required List<NPPESResult> results { get; set; }
    public int result_count { get; set; }
}

public class NPPESResult
{
    public required string number { get; set; }
    public required Basic basic { get; set; }
    public required List<Address> addresses { get; set; }
}

public class Basic
{
    public required string first_name { get; set; }
    public required string last_name { get; set; }
}

public class Address
{
    public required string address_1 { get; set; }
    public required string city { get; set; }
    public required string state { get; set; }
    public required string postal_code { get; set; }
}