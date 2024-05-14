using System;
using System.Collections.Generic;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeGroupResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Order { get; set; }
    public bool IsActive { get; set; }
    public List<BeneficiaryAttributeResponse> BeneficiaryAttributes { get; set; }
    public Guid OrganizationId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
