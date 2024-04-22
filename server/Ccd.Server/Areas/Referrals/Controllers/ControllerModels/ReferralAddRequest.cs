using System;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Referrals;

public class ReferralAddRequest
{
    [Required, MinLength(1)]
    public string FirstName { get; set; }
    [Required, MinLength(1)]
    public string LastName { get; set; }
    [Required]
    public DateTime DateOfBirth { get; set; }
    [Required]
    public Guid OrganizationId { get; set; }
}
