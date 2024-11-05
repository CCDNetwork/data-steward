namespace Ccd.Server.Areas.Referrals.Helpers;

public enum GeneralReferralsWorksheetColumns
{
    FirstName = 1,
    Surname,
    PatronymicName,
    DateOfBirth,
    Gender,
    TaxId,
    Address,
    AdministrativeRegion1,
    AdministrativeRegion2,
    AdministrativeRegion3,
    AdministrativeRegion4,
    Email,
    Phone,
    ContactPreference,
    Restrictions,
    Consent,
    Required,
    NeedForService
}

public enum MinorReferralsWorksheetColumns
{
    IsSeparated = 19,
    Caregiver,
    RelationshipToChild,
    CaregiverEmail,
    CaregiverPhone,
    CaregiverContactPreference,
    IsCaregiverInformed,
    CaregiverExplanation,
    CaregiverNote
}

public enum MpcaReferralsWorksheetColumns
{
    DisplacementStatus = 19,
    HouseholdSize,
    HouseholdMonthlyIncome,
    VulnerabilityCriteria1,
    VulnerabilityCriteria2,
    VulnerabilityCriteria3,
    VulnerabilityCriteria4,
    VulnerabilityCriteria5,
    VulnerabilityCriteria6,
    VulnerabilityCriteria7,
    VulnerabilityCriteria8,
    VulnerabilityCriteria9,
    VulnerabilityCriteria10,
}



// "householdWithPregnantPersons"
// "householdOfElderly"
// "householdAffectedByConflict"
// "householdWithGroupDisability"
// "householdWithSeriousHealthIssues"
// "householdWith3OrMoreChildren"
// "highlyVulnerableIDPHouseholds"
// "householdsWithChildrenUpTo2Years"
// "singleHeadedHouseholdsIncludingWomanHeaded"
// "singleParentHouseholds"
