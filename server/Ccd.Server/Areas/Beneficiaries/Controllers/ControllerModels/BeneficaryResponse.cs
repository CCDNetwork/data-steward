using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Ccd.Server.Organizations;
using Ccd.Server.Users;

namespace Ccd.Server.Beneficiaries;

public class BeneficaryResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string FamilyName { get; set; }
    public string Gender { get; set; }
    public string DateOfBirth { get; set; }
    public string CommunityId { get; set; }
    public string HhId { get; set; }
    public string MobilePhoneId { get; set; }
    public string GovIdType { get; set; }
    public string GovIdNumber { get; set; }
    public string OtherIdType { get; set; }
    public string OtherIdNumber { get; set; }
    public string AssistanceDetails { get; set; }
    public string Activity { get; set; }
    public string Currency { get; set; }
    public string CurrencyAmount { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
    public string Frequency { get; set; }
    public bool IsPrimary { get; set; }
    public string Status { get; set; }
    public List<string> MatchedFields { get; set; }
    public OrganizationResponse Organization { get; set; }
    public UserResponse PointOfContact { get; set; }
    [JsonIgnore] public List<Guid> DuplicateOfIds { get; set; }
    public List<BeneficaryResponse> Duplicates { get; set; }
    [JsonIgnore] public Guid UploadedById { get; set; }
    public UserResponse UploadedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
