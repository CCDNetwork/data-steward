using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Referrals;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.BeneficiaryData;

public class BeneficaryDataService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;


    public BeneficaryDataService(CcdContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Referral> GetBeneficiaryData(string taxId)
    {
        return await _context.Referrals.FirstOrDefaultAsync(r => r.TaxId == taxId) ??
               throw new NotFoundException("No data associated with provided tax id.");
    }

    public async Task<BeneficaryDataResponse> GetBeneficiaryDataApi(string taxId)
    {
        var beneficiaryReferral = await GetBeneficiaryData(taxId);
        var beneficiaryReferralResponse = _mapper.Map<ReferralResponse>(beneficiaryReferral);
        var beneficiaryDataResponse = _mapper.Map<BeneficaryDataResponse>(beneficiaryReferralResponse);

        return beneficiaryDataResponse;
    }
}