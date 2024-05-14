using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeGroupCreateRequest
{
    [Required] public string Name { get; set; }
    [Required, Range(1, int.MaxValue)] public int Order { get; set; }
    [Required] public bool IsActive { get; set; }
    [Required][MinLength(1)] public List<int> BeneficiaryAttributeIds { get; set; }
}
