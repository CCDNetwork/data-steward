﻿using System.Threading.Tasks;
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
    public async Task<ActionResult<DeduplicationListResponse>> GetAllListings(
        [FromQuery] RequestParameters requestParameters)
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

    [HttpPost("dataset")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<DatasetDeduplicationResponse>> DatasetDeduplicate(
        [FromForm] DatasetDeduplicationRequest model)
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

        var response =
            await _deduplicationService.SameOrganizationDeduplication(this.OrganizationId, this.UserId, model);
        return Ok(response);
    }

    [HttpPost("system-organizations")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> SystemOrganizationsDeduplication(
        [FromBody] SystemOrganizationsDeduplicationRequest model)
    {
        var result =
            await _deduplicationService.SystemOrganizationsDeduplication(this.OrganizationId, this.UserId, model);
        return Ok(result);
    }

    [HttpPost("commcare")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> CommcareDeduplication([FromBody] SystemOrganizationsDeduplicationRequest model)
    {
        var result = await _deduplicationService.CommcareDeduplication(this.OrganizationId, this.UserId, model);
        return Ok(result);
    }

    [HttpPost("lmms")]
    public async Task<ActionResult> LmmsDeduplication([FromQuery] Guid apiKey, [FromBody] LmmsDeduplicationRequest model)
    {
        if (Guid.Empty == apiKey) throw new UnauthorizedException("Provide a correct apiKey.");
        var isEnvApiKeyValid = Guid.TryParse(StaticConfiguration.LmmsApiKey, out var envApiKey);
        if (!isEnvApiKeyValid && envApiKey != apiKey) throw new UnauthorizedException("Provide a correct apiKey.");

        await _deduplicationService.LmmsDeduplication(model);
        return Ok();
    }

    [HttpPost("finish")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> FinishDeduplication([FromBody] SystemOrganizationsDeduplicationRequest model)
    {
        var result =
            await _deduplicationService.FinishDeduplication(this.OrganizationId, this.User, model);
        return Ok(result);
    }
}