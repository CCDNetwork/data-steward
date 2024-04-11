using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using System;
using Ccd.Server.Users;

namespace Ccd.Server.BeneficiaryAttributes;

[ApiController]
[Route("/api/v1/beneficiary-attribute")]
public class BeneficiaryAttributeController : ControllerBaseExtended
{
    private readonly IMapper _mapper;
    private readonly BeneficiaryAttributeService _beneficiaryAttributeService;

    public BeneficiaryAttributeController(IMapper mapper, BeneficiaryAttributeService beneficiaryAttributeService)
    {
        _mapper = mapper;
        _beneficiaryAttributeService = beneficiaryAttributeService;
    }

    [HttpGet]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<List<BeneficiaryAttributeResponse>>> GetBeneficiaryAttributes()
    {
        var beneficiaryAttributes = await _beneficiaryAttributeService.GetBeneficiaryAttributes();
        var response = _mapper.Map<List<BeneficiaryAttributeResponse>>(beneficiaryAttributes);
        return Ok(response);
    }

    [HttpPatch("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<BeneficiaryAttributeResponse>> UpdateBeneficiaryAttributes(int id, BeneficiaryAttributePatchRequest model)
    {
        var beneficiaryAttribute = await _beneficiaryAttributeService.PatchBeneficiaryAttribute(id, model);
        var response = _mapper.Map<BeneficiaryAttributeResponse>(beneficiaryAttribute);
        return Ok(response);
    }
}
