using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributePatchRequest
{
    [Required]
    public bool UsedForDeduplication { get; set; }
}
