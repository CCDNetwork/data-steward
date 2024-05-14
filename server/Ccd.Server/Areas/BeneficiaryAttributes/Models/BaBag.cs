using System;
using Ccd.Server.Organizations;

namespace Ccd.Server.BeneficiaryAttributes;

public class BaBag
{
    public int Id { get; set; }
    public Guid BeneficiaryAttributeGroupId { get; set; }
    public BeneficiaryAttributeGroup BeneficiaryAttributeGroup { get; set; }
    public int BeneficiaryAttributeId { get; set; }
    public BeneficiaryAttribute BeneficiaryAttribute { get; set; }
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
