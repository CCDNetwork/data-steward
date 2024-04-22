using System;
using Ccd.Server.Helpers;

namespace Ccd.Server.Referrals;

public class ReferralPatchRequest : PatchRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Status { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public Guid? OrganizationId { get; set; }
}
