using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeGroupCreateRequest
{
    [Required] public string Name { get; set; }
    [Required] public bool IsActive { get; set; }
    [Required] public bool UseFuzzyMatch { get; set; }
    [Required][MinLength(1)] public List<int> BeneficiaryAttributeIds { get; set; }
}
