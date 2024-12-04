using System;
using Ccd.Server.Helpers;

namespace Ccd.Server.Commcare;

public class CommcareData
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public string FirstName { get; set; }
    public string FamilyName { get; set; }
    public string TaxId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
