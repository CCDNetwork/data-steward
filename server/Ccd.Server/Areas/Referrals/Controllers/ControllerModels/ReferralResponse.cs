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
    public string Title { get; set; }
    public string Description { get; set; }
    [JsonIgnore]
    public Guid OrganizationReferredToId { get; set; }
    public OrganizationResponse OrganizationReferredTo { get; set; }
    [JsonIgnore]
    public Guid UserCreatedId { get; set; }
    public UserResponse UserCreated { get; set; }
    public string Status { get; set; }
    public bool IsDraft { get; set; }
    [JsonIgnore] public List<Guid> FileIds { get; set; }
    public List<FileShortResponse> Files { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
