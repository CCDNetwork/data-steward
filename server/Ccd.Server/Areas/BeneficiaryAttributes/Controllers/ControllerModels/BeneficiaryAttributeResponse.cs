namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeResponse
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string AttributeName { get; set; }
    public bool UsedForDeduplication { get; set; }
}
