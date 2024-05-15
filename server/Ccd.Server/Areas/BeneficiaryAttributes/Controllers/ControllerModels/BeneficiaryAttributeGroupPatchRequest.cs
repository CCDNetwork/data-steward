using System.Collections.Generic;
using Ccd.Server.Helpers;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeGroupPatchRequest : PatchRequest
{
    public string Name { get; set; }
    public int? Order { get; set; }
    public bool? IsActive { get; set; }
    public bool? UseFuzzyMatch { get; set; }
    public List<int> BeneficiaryAttributeIds { get; set; }
}
