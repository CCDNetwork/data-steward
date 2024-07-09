using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using Ccd.Server.Notifications;
using Ccd.Server.Users;
using Ccd.Server.Deduplication.Controllers.ControllerModels;
using System;

namespace Ccd.Server.Deduplication;

[ApiController]
[Route("/api/v1/deduplication")]
public class DeduplicationController : ControllerBaseExtended
{
    private readonly DeduplicationService _deduplicationService;

    public DeduplicationController(DeduplicationService deduplicationService)
    {
        _deduplicationService = deduplicationService;
    }

    [HttpGet("listings")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<DeduplicationListResponse>> GetAllListings([FromQuery] RequestParameters requestParameters)
    {
        var listings = await _deduplicationService.GetAllListings(this.OrganizationId, requestParameters);
        return Ok(listings);
    }

    [HttpDelete]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult> DeleteListings()
    {
        await _deduplicationService.DeleteListings();
        return NoContent();
    }

    [HttpPost("deduplicate")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> Deduplicate([FromForm] DeduplicationListAddRequest model)
    {
        if (!DeduplicationType.IsValid(model.Type)) throw new BadRequestException("Invalid deduplication type.");
        if (model.TemplateId == Guid.Empty) throw new BadRequestException("Template ID is required.");

        byte[] fileBytes;
        if (model.Type == DeduplicationType.Single)
        {
            fileBytes = await _deduplicationService.InternalDeduplication(this.OrganizationId, model);
        }
        else
        {
            fileBytes = await _deduplicationService.RegistryDeduplication(this.OrganizationId, this.UserId, model);
        }

        return File(fileBytes, "application/octet-stream", model.File.FileName);
    }

    [HttpPost("dataset")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<DatasetDeduplicationResponse>> DatasetDeduplicate([FromForm] DatasetDeduplicationRequest model)
    {
        if (model.TemplateId == Guid.Empty) throw new BadRequestException("Template ID is required.");

        var response = await _deduplicationService.DatasetDeduplication(this.OrganizationId, this.UserId, model);
        return Ok(response);
    }

    [HttpPost("same-organization")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> SameOrganizationDeduplication([FromBody] SameOrganizationDeduplicationRequest model)
    {
        if (model.TemplateId == Guid.Empty) throw new BadRequestException("Template ID is required.");

        var response = await _deduplicationService.SameOrganizationDeduplication(this.OrganizationId, this.UserId, model);
        return Ok(response);
    }

    [HttpPost("system-organizations")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> SystemOrganizationsDeduplication([FromBody] SystemOrganizationsDeduplicationRequest model)
    {
        var result = await _deduplicationService.SystemOrganizationsDeduplication(this.OrganizationId, this.UserId, model);
        return Ok(result);
    }
}
