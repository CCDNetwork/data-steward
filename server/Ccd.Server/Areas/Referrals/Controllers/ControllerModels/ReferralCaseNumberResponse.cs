using System;
using System.Text.Json.Serialization;
using Ccd.Server.Organizations;

namespace Ccd.Server.Referrals;

public class ReferralCaseNumberResponse
{
    public string Status { get; set; }
    [JsonIgnore] public Guid OrganizationReferredToId { get; set; }
    public OrganizationResponse OrganizationReferredTo { get; set; }
    [JsonIgnore] public Guid OrganizationCreatedId { get; set; }
    public OrganizationResponse OrganizationCreated { get; set; }
}

