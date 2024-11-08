using System;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.Beneficiaries;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;
using Ccd.Server.Referrals;
using Ccd.Server.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Ccd.Server.BeneficiaryData;

public class BeneficaryDataService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;
    private readonly UserService _userService;

    public BeneficaryDataService(CcdContext context, IMapper mapper, UserService userService)
    {
        _context = context;
        _mapper = mapper;
        _userService = userService;
    }

    public async Task<(Referral ReferralData, Beneficary BeneficiaryData)> GetBeneficiaryAndReferralData(string taxId)
    {
        var beneficiary = await _context.Beneficaries.FirstOrDefaultAsync(b => b.GovIdNumber == taxId);
        var referral = await _context.Referrals.FirstOrDefaultAsync(r => r.TaxId == taxId);

        if (referral == null && beneficiary == null)
        {
            throw new BadRequestException("No data associated with given tax id has been found.");
        }

        return (referral, beneficiary);
    }

    public async Task<BeneficaryDataResponse> GetBeneficiaryDataApi(string taxId)
    {
        var (referral, beneficiary) = await GetBeneficiaryAndReferralData(taxId);

        var referralResponse = referral != null ? _mapper.Map<ReferralResponse>(referral) : null;

        if (referral != null && referral.OrganizationCreatedId != null)
        {
            var organization =
                await _context.Organizations.FirstOrDefaultAsync(u => u.Id == referral.OrganizationCreatedId);
            referralResponse.OrganizationCreated = _mapper.Map<OrganizationResponse>(organization);
        }

        var beneficiaryResponse = beneficiary != null ? _mapper.Map<BeneficaryResponse>(beneficiary) : null;

        if (beneficiaryResponse != null && beneficiary.UploadedById != null)
        {
            var user = await _userService.GetUserApi(null, beneficiary.UploadedById);
            beneficiaryResponse.UploadedBy = _mapper.Map<UserResponse>(user);
        }

        var beneficiaryDataResponse = new BeneficaryDataResponse
        {
            Referral = referralResponse,
            Beneficiary = beneficiaryResponse
        };

        return beneficiaryDataResponse;
    }
}