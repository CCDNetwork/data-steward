using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Referrals;

public class ReferralAddRequest
{
    [Required, MinLength(1)] public string FocalPoint { get; set; }
    [Required] public bool Consent { get; set; }
    [Required, MinLength(1)] public string FamilyName { get; set; }
    [Required, MinLength(1)] public string FirstName { get; set; }
    [Required, MinLength(1)] public string MethodOfContact { get; set; }
    [Required, MinLength(1)] public string ContactDetails { get; set; }
    public string Oblast { get; set; }
    public string Raion { get; set; }
    public string Hromada { get; set; }
    [Required, MinLength(1)] public string Settlement { get; set; }
    public string Note { get; set; }
    [Required] public Guid OrganizationId { get; set; }
    public List<Guid> FileIds { get; set; }
    public bool IsDraft { get; set; }
}
