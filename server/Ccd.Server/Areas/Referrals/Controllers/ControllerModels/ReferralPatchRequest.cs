using System;
using System.Collections.Generic;
using Ccd.Server.Helpers;

namespace Ccd.Server.Referrals;

public class ReferralPatchRequest : PatchRequest
{

    public Guid? FocalPointId { get; set; }
    public bool Consent { get; set; }
    public string FamilyName { get; set; }
    public string FirstName { get; set; }
    public string MethodOfContact { get; set; }
    public string ContactDetails { get; set; }
    public string Oblast { get; set; }
    public string Raion { get; set; }
    public string Hromada { get; set; }
    public string Settlement { get; set; }
    public string Note { get; set; }

    public string Status { get; set; }
    public Guid? OrganizationId { get; set; }
    public List<Guid> FileIds { get; set; }
    public bool? IsDraft { get; set; }
}
