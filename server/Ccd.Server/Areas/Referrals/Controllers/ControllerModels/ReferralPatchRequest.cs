using System;
using System.Collections.Generic;
using Ccd.Server.Helpers;

namespace Ccd.Server.Referrals;

public class ReferralPatchRequest : PatchRequest
{
    // Priority
    public bool? IsUrgent { get; set; }

    // Receiving organization details
    public Guid? OrganizationReferredToId { get; set; }
    public string ServiceCategory { get; set; }
    public List<Guid> SubactivitiesIds { get; set; }
    public string FundingSource { get; set; }


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

    public Guid? AdministrativeRegion1Id { get; set; }
    public Guid? AdministrativeRegion2Id { get; set; }
    public Guid? AdministrativeRegion3Id { get; set; }
    public Guid? AdministrativeRegion4Id { get; set; }

    public string Email { get; set; }
    public string Phone { get; set; }
    public string ContactPreference { get; set; }
    public string Restrictions { get; set; }
    public bool? Consent { get; set; }

    // Reason for refferal
    public string Required { get; set; }
    public string NeedForService { get; set; }
    public List<Guid> FileIds { get; set; }

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
    public string Status { get; set; }
    public bool? IsDraft { get; set; }
    public bool? IsRejected { get; set; }
}