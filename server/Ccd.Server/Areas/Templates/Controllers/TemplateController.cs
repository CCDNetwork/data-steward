using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using Ccd.Server.Users;

namespace Ccd.Server.Templates;

[ApiController]
[Route("/api/v1/templates")]
public class TemplateController : ControllerBaseExtended
{
    private readonly TemplateService _templateService;

    public TemplateController(TemplateService templateService, IMapper mapper)
    {
        _templateService = templateService;
    }

    [HttpGet]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<PagedApiResponse<TemplateResponse>>> GetAll(
        [FromQuery] RequestParameters requestParams
    )
    {
        var templates = await _templateService.GetTemplatesApi(this.OrganizationId, requestParams);
        return Ok(templates);
    }

    [HttpGet("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<TemplateResponse>> GetTemplate(Guid id)
    {
        var template = await _templateService.GetTemplateApi(this.OrganizationId, id);

        if (template == null)
            throw new NotFoundException();

        return Ok(template);
    }


    [HttpPost]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<TemplateResponse>> Add([FromBody] TemplateAddRequest model)
    {
        var newTemplate = await _templateService.AddTemplate(this.OrganizationId, model);
        var result = await _templateService.GetTemplateApi(this.OrganizationId, newTemplate.Id);

        return Ok(result);
    }

    [HttpPatch("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<TemplateResponse>> Update(
        [FromBody] TemplatePatchRequest model,
        Guid id
    )
    {
        var template = await _templateService.GetTemplateById(this.OrganizationId, id) ?? throw new NotFoundException("Template not found.");
        model.Patch(template);

        await _templateService.UpdateTemplate(template);
        var result = await _templateService.GetTemplateApi(this.OrganizationId, id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<TemplateResponse>> Delete(Guid id)
    {
        var template = await _templateService.GetTemplateById(this.OrganizationId, id) ?? throw new NotFoundException("Template not found.");

        var result = await _templateService.GetTemplateApi(this.OrganizationId, template.Id);

        await _templateService.DeleteTemplate(template);

        return Ok(result);
    }
}
