using System;
using Ccd.Server.Helpers;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeGroup
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public string Name { get; set; }
    public int Order { get; set; }
    public bool IsActive { get; set; }
    public bool UseFuzzyMatch { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
