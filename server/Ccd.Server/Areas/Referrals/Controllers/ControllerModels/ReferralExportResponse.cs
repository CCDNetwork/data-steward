using System;

namespace Ccd.Server.Referrals;

public class ReferralExportResponse
{
    [ImpexName("isUrgent;en")] public bool IsUrgent { get; set; }

    [ImpexName("organizationReferredTo;en")]
    public string OrganizationReferredTo { get; set; }

    [ImpexName("serviceCategory;en")] public string ServiceCategory { get; set; }
    [ImpexName("focalPoint;en")] public string FocalPoint { get; set; }
    [ImpexName("status;en")] public string Status { get; set; }
    [ImpexName("isDraft;en")] public bool IsDraft { get; set; }
    [ImpexName("isRejected;en")] public bool IsRejected { get; set; }
    [ImpexName("organizationCreated;en")] public string OrganizationCreated { get; set; }
    [ImpexName("caseNumber;en")] public string CaseNumber { get; set; }


    [ImpexName("firstName;en")] public string FirstName { get; set; }
    [ImpexName("surname;en")] public string Surname { get; set; }
    [ImpexName("patronymicName;en")] public string PatronymicName { get; set; }
    [ImpexName("dateOfBirth;en")] public DateTime? DateOfBirth { get; set; }
    [ImpexName("gender;en")] public string Gender { get; set; }
    [ImpexName("taxId;en")] public string TaxId { get; set; }
    [ImpexName("address;en")] public string Address { get; set; }
    [ImpexName("admin1;en")] public string AdministrationRegion1 { get; set; }
    [ImpexName("admin2;en")] public string AdministrationRegion2 { get; set; }
    [ImpexName("admin3;en")] public string AdministrationRegion3 { get; set; }
    [ImpexName("admin4;en")] public string AdministrationRegion4 { get; set; }
    [ImpexName("email;en")] public string Email { get; set; }
    [ImpexName("phone;en")] public string Phone { get; set; }
    [ImpexName("contactPreference;en")] public string ContactPreference { get; set; }
    [ImpexName("restrictions;en")] public string Restrictions { get; set; }
    [ImpexName("consent;en")] public string Consent { get; set; }
    [ImpexName("required;en")] public string Required { get; set; }
    [ImpexName("needForService;en")] public string NeedForService { get; set; }
    [ImpexName("isSeparated;en")] public string IsSeparated { get; set; }
    [ImpexName("caregiver;en")] public string Caregiver { get; set; }
    [ImpexName("relationShipToChild;en")] public string RelationShipToChild { get; set; }
    [ImpexName("caregiverEmail;en")] public string CaregiverEmail { get; set; }
    [ImpexName("caregiverPhone;en")] public string CaregiverPhone { get; set; }

    [ImpexName("caregiverContactPreference;en")]
    public string CaregiverContactPreference { get; set; }

    [ImpexName("isCaregiverInformed;en")] public string IsCaregiverInformed { get; set; }
    [ImpexName("caregiverExplanation;en")] public string CaregiverExplanation { get; set; }
    [ImpexName("caregiverNote;en")] public string CaregiverNote { get; set; }

    [ImpexName("displacementStatus;en")] public string DisplacementStatus { get; set; }
    [ImpexName("householdSize;en")] public string HouseholdSize { get; set; }

    [ImpexName("householdMonthlyIncome;en")]
    public string HouseholMonthlyIncome { get; set; }

    [ImpexName("householdsVulnerabilityCriteria;en")]
    public string HouseholdsVulnerabilityCriteria { get; set; }

    [ImpexName("isBatchUploaded;en")] public string IsBatchUploaded { get; set; }
}