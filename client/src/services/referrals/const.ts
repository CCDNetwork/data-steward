export const ReferralStatus = {
  Submission: 'submission',
  Evaluation: 'evaluation',
  Acceptance: 'acceptance',
  Enrolment: 'enrolment',
};

export enum OrgServiceCategory {
  IsMpcaActive = 'isMpcaActive',
  IsShelterActive = 'isShelterActive',
  IsWashActive = 'isWashActive',
}

export enum ReferralTab {
  Referral = 'referral',
  Discussion = 'discussion',
}

export const HOUSEHOLDS_VULNERABILITY_CRITERIA: {
  id: string;
  label: string;
}[] = [
  {
    id: 'householdWithPregnantPersons',
    label: 'Households with pregnant persons',
  },
  {
    id: 'householdOfElderly',
    label: 'Households of elderly, including single elderly people',
  },
  {
    id: 'householdAffectedByConflict',
    label:
      'Households highly affected by conflict (members who were injured or died and/or whose dwelling was either fully or partially destroyed due to conflict)',
  },
  {
    id: 'householdWithGroupDisability',
    label: 'Households with memebers with 1st or 2nd group disability',
  },
  {
    id: 'householdWithSeriousHealthIssues',
    label: 'Households with members with serious health issues',
  },
  {
    id: 'householdWith3OrMoreChildren',
    label: 'Households with 3 or more children',
  },
  {
    id: 'highlyVulnerableIDPHouseholds',
    label:
      'Highly vulnerable IDP households (recently evacuated, non-registered or non-eligible for cash assistence from government)',
  },
  {
    id: 'householdsWithChildrenUpTo2Years',
    label: 'Households with children up to 2 years',
  },
  {
    id: 'singleHeadedHouseholdsIncludingWomanHeaded',
    label: 'Single-headed households, including woman-headed households',
  },
  {
    id: 'singleParentHouseholds',
    label: 'Single parent households',
  },
];
