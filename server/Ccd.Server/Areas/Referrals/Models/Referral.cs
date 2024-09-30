using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ccd.Server.AdministrativeRegions;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;
using Ccd.Server.Users;

namespace Ccd.Server.Referrals;

public class Referral : UserChangeTracked
{
    public Guid Id { get; set; } = IdProvider.NewId();

    // Priority
    public bool? IsUrgent { get; set; }

    // Receiving organization details
    public string ServiceCategory { get; set; }
    [Column(TypeName = "jsonb")] public List<Guid> SubactivitiesIds { get; set; }
    [ForeignKey("Organization")] public Guid? OrganizationReferredToId { get; set; }
    public Organization OrganizationReferredTo { get; set; }

    // MPCA info
    public string DisplacementStatus { get; set; }
    public string HouseholdSize { get; set; }
    public string HouseholdMonthlyIncome { get; set; }
    [Column(TypeName = "jsonb")] public List<string> HouseholdsVulnerabilityCriteria { get; set; }

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

    public AdministrativeRegion AdministrativeRegion1 { get; set; }
    public Guid? AdministrativeRegion1Id { get; set; }

    public AdministrativeRegion AdministrativeRegion2 { get; set; }
    public Guid? AdministrativeRegion2Id { get; set; }

    public AdministrativeRegion AdministrativeRegion3 { get; set; }
    public Guid? AdministrativeRegion3Id { get; set; }

    public AdministrativeRegion AdministrativeRegion4 { get; set; }
    public Guid? AdministrativeRegion4Id { get; set; }

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
    [ForeignKey("User")] public Guid? FocalPointId { get; set; }

    public User FocalPoint { get; set; }
    public string Status { get; set; }
    public bool IsDraft { get; set; }
    public bool IsRejected { get; set; }
    [Column(TypeName = "jsonb")] public List<Guid> FileIds { get; set; }

    [ForeignKey("Organization")]
    [Required]
    public Guid OrganizationCreatedId { get; set; }

    public Organization OrganizationCreated { get; set; }
    public string CaseNumber { get; set; }
    public bool? IsBatchUploaded { get; set; }
}

public class ReferralStatus
{
    public const string UnderReview = "underReview";
    public const string Delivered = "delivered";
    public const string InAssessment = "inAssessment";
    public const string Registered = "registered";

    public static bool IsValid(string status)
    {
        return status == UnderReview || status == Delivered || status == InAssessment || status == Registered;
    }
}