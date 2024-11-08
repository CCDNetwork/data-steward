using System;
using Ccd.Server.Beneficiaries;
using Ccd.Server.BeneficiaryAttributes;
using Ccd.Server.Referrals;

namespace Ccd.Server.BeneficiaryData;

public class BeneficaryDataResponse
{
    public ReferralResponse? Referral { get; set; }
    public BeneficaryResponse? Beneficiary { get; set; }
}