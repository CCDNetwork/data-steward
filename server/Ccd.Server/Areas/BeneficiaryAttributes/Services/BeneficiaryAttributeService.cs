using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using System.Linq;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;

    public BeneficiaryAttributeService(CcdContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<BeneficiaryAttribute>> GetBeneficiaryAttributes()
    {
        var beneficiaryAttributes = await _context.BeneficiaryAttributes.OrderBy(e => e.Id).ToListAsync();
        return beneficiaryAttributes;
    }

    public async Task<BeneficiaryAttribute> GetBeneficiaryAttribute(int id)
    {
        var beneficiaryAttribute = await _context.BeneficiaryAttributes.FirstOrDefaultAsync(x => x.Id == id);
        return beneficiaryAttribute;
    }

    public async Task<BeneficiaryAttribute> PatchBeneficiaryAttribute(int id, BeneficiaryAttributePatchRequest model)
    {
        var beneficiaryAttribute = await GetBeneficiaryAttribute(id) ?? throw new Exception("Field setting not found");
        beneficiaryAttribute.UsedForDeduplication = model.UsedForDeduplication;

        var newBeneficiaryAttribute = _context.Update(beneficiaryAttribute).Entity;
        await _context.SaveChangesAsync();

        return newBeneficiaryAttribute;
    }

}