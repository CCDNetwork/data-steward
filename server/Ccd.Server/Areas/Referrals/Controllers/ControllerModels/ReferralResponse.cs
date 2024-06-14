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

    // Priority
    public bool? IsUrgent { get; set; }

    // Receiving organization details
    public string ServiceCategory { get; set; }
    public List<Guid> Subactivities { get; set; }
    public Guid OrganizationReferredToId { get; set; }
    public OrganizationResponse OrganizationReferredTo { get; set; }

    // MPCA info
    public string DisplacementStatus { get; set; }
    public string HouseholdSize { get; set; }
    public string HouseholdMonthlyIncome { get; set; }
    public List<string> HouseholdsVulnerabilityCriteria { get; set; }

    // Beneficiary general data
    public string FirstName { get; set; }
    public string PatronymicName { get; set; }
    public string Surname { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string Gender { get; set; }
    public string TaxId { get; set; }
    public string Address { get; set; }
    public string Oblast { get; set; }
    public string Ryon { get; set; }
    public string Hromada { get; set; }
    public string Settlement { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string ContactPreference { get; set; }
    public string Restrictions { get; set; }
    public bool? Consent { get; set; }

    // Reason for refferal
    public string Required { get; set; }
    public string NeedForService { get; set; }

    // Child under 18 years old
    public bool? IsSeparated { get; set; }
    public string Caregiver { get; set; }
    public string RelationshipToChild { get; set; }
    public string CaregiverEmail { get; set; }
    public string CaregiverPhone { get; set; }
    public string CaregiverContactPreference { get; set; }
    public bool? IsCaregiverInformed { get; set; }
    public string CaregiverExplanation { get; set; }
    public string CaregiverNote { get; set; }

    // Internal
    public Guid? FocalPointId { get; set; }
    public UserResponse FocalPoint { get; set; }
    public string Status { get; set; }
    public bool IsDraft { get; set; }
    public List<Guid> FileIds { get; set; }
    [JsonIgnore] public Guid OrganizationCreatedId { get; set; }
    public OrganizationResponse OrganizationCreated { get; set; }
    [JsonIgnore] public Guid UserCreatedId { get; set; }
    public UserResponse UserCreated { get; set; }
    public List<FileShortResponse> Files { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
