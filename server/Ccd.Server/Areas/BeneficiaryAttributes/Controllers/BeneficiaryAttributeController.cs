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
    private readonly BeneficiaryAttributeGroupService _beneficiaryAttributeGroupService;

    public BeneficiaryAttributeController(IMapper mapper, BeneficiaryAttributeService beneficiaryAttributeService, BeneficiaryAttributeGroupService beneficiaryAttributeGroupService)
    {
        _mapper = mapper;
        _beneficiaryAttributeService = beneficiaryAttributeService;
        _beneficiaryAttributeGroupService = beneficiaryAttributeGroupService;
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

    [HttpGet("groups")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<PagedApiResponse<BeneficiaryAttributeGroupResponse>>> GetBeneficiaryAttributesGroups([FromQuery] RequestParameters requestParameters)
    {
        var beneficiaryAttributes = await _beneficiaryAttributeGroupService.GetBeneficiaryAttributeGroupsApi(requestParameters);
        return Ok(beneficiaryAttributes);
    }

    [HttpGet("groups/{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<BeneficiaryAttributeGroupResponse>> GetBeneficiaryAttributesGroup(Guid id, [FromQuery] RequestParameters requestParameters)
    {
        var beneficiaryAttribute = await _beneficiaryAttributeGroupService.GetBeneficiaryAttributeGroupApi(id);
        return Ok(beneficiaryAttribute);
    }

    [HttpPost("groups")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<PagedApiResponse<BeneficiaryAttributeGroupResponse>>> CreateBeneficiaryAttributesGroup([FromBody] BeneficiaryAttributeGroupCreateRequest model)
    {
        var beneficiaryAttributes = await _beneficiaryAttributeGroupService.CreateBeneficiaryAttributeGroups(model);
        return Ok(beneficiaryAttributes);
    }

    [HttpPatch("groups/{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<BeneficiaryAttributeGroupResponse>> PatchBeneficiaryAttributesGroup(Guid id, [FromBody] BeneficiaryAttributeGroupPatchRequest model)
    {
        var beneficiaryAttributes = await _beneficiaryAttributeGroupService.PatchBeneficiaryAttributeGroups(id, model);
        return Ok(beneficiaryAttributes);
    }

    [HttpDelete("groups/{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult> DeleteBeneficiaryAttributesGroup(Guid id)
    {
        await _beneficiaryAttributeGroupService.DeleteBeneficiaryAttributeGroup(id);
        return NoContent();
    }

    [HttpPost("groups/reorder")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<PagedApiResponse<BeneficiaryAttributeGroupResponse>>> CreateBeneficiaryAttributesGroup([FromBody] BeneficiaryAttributeGroupReorderRequest model)
    {
        var beneficiaryAttributes = await _beneficiaryAttributeGroupService.ReorderBeneficiaryAttributeGroups(model);
        return Ok(beneficiaryAttributes);
    }
}
