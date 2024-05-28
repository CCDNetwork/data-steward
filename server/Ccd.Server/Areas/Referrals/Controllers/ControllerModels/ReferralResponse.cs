using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Ccd.Server.Organizations;
using Ccd.Server.Storage;
using Ccd.Server.Users;

namespace Ccd.Server.Referrals;

public class ReferralResponse
{
    public Guid Id { get; set; }

    public string FocalPoint { get; set; }
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

    [JsonIgnore] public Guid OrganizationReferredToId { get; set; }
    public OrganizationResponse OrganizationReferredTo { get; set; }
    [JsonIgnore] public Guid UserCreatedId { get; set; }
    public UserResponse UserCreated { get; set; }
    public string Status { get; set; }
    public bool IsDraft { get; set; }
    [JsonIgnore] public List<Guid> FileIds { get; set; }
    public List<FileShortResponse> Files { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
