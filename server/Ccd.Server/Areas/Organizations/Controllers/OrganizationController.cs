using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using Ccd.Server.Users;

namespace Ccd.Server.Organizations;

[ApiController]
[Route("/api/v1/organizations")]
public class OrganizationController : ControllerBaseExtended
{
    private readonly IMapper _mapper;
    private readonly OrganizationService _organizationService;

    public OrganizationController(OrganizationService organizationService, IMapper mapper)
    {
        _organizationService = organizationService;
        _mapper = mapper;
    }

    [HttpGet]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<PagedApiResponse<OrganizationResponse>>> GetAll(
        [FromQuery] RequestParameters requestParams
    )
    {
        var organizations = await _organizationService.GetOrganizationsApi(requestParams);
        return Ok(organizations);
    }

    [HttpGet("me")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<OrganizationResponse>> GetCurrentOrganization()
    {
        return await _organizationService.GetOrganizationApi(this.OrganizationId);
    }

    [HttpPut("me")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<OrganizationResponse>> UpdateCurrentOrganization(OrganizationUpdateRequest model)
    {
        return await Update(model, this.OrganizationId);
    }

    [HttpGet("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<OrganizationResponse>> GetOrganization(Guid id)
    {
        var organization = await _organizationService.GetOrganizationApi(id);

        if (organization == null)
            throw new NotFoundException();

        return Ok(organization);
    }

    [HttpPut("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<OrganizationResponse>> Update(
        [FromBody] OrganizationUpdateRequest model,
        Guid id
    )
    {
        var organization = await _organizationService.GetOrganizationById(id) ?? throw new NotFoundException();

        if (model.Name == null)
            model.Name = organization.Name;

        _mapper.Map(model, organization);

        await _organizationService.UpdateOrganization(organization);

        var result = await _organizationService.GetOrganizationApi(id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<OrganizationResponse>> Delete(Guid id)
    {
        var organization = await _organizationService.GetOrganizationById(id) ?? throw new NotFoundException();

        var result = await _organizationService.GetOrganizationApi(organization.Id);

        await _organizationService.DeleteOrganization(organization);

        return Ok(result);
    }
}
