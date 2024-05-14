using System;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeGroup
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public string Name { get; set; }
    public int Order { get; set; }
    public bool IsActive { get; set; }
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
