using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Referrals;

public class ReferralAddRequest
{
    [Required, MinLength(1)] public string Title { get; set; }
    [Required] public Guid OrganizationId { get; set; }
    public string Description { get; set; }
    public List<Guid> FileIds { get; set; }
    public bool IsDraft { get; set; }
}
