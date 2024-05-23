using System;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Referrals;

public class ReferralAddRequest
{
    [Required, MinLength(1)] public string Title { get; set; }
    [Required] public Guid OrganizationId { get; set; }
    public string Description { get; set; }
    public Guid? FileId { get; set; }
    public bool IsDraft { get; set; }
}
