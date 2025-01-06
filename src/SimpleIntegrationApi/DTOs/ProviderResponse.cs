/// <summary>
/// Represents a provider's response information.
/// </summary>
public class ProviderResponse
{
    /// <summary>
    /// National Provider Identifier (10-digit numeric).
    /// </summary>
    public required string npi { get; set; }
    /// <summary>
    /// Full name of the provider.
    /// </summary>
    public required string name { get; set; }
    /// <summary>
    /// Full address of the provider (e.g., street address).
    /// </summary>
    public required string address { get; set; }
    /// <summary>
    /// The city of the provider's address.
    /// </summary>
    public required string city { get; set; }
    /// <summary>
    /// State abbreviation of the provider's location (e.g., NY, CA).
    /// </summary>
    public required string state { get; set; }
    /// <summary>
    /// ZIP code of the provider's address.
    /// </summary>
    public required string zip { get; set; }
}