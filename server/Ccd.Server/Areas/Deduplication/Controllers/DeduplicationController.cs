﻿using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using Ccd.Server.Notifications;
using Ccd.Server.Users;

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
    public async Task<ActionResult> GetAllListings([FromQuery] RequestParameters requestParameters)
    {
        var listings = await _deduplicationService.GetAllListings(this.OrganizationId, requestParameters);
        return Ok(listings);
    }

    [HttpPost("deduplicate")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> Deduplicate([FromForm] DeduplicationListAddRequest model)
    {
        if (!DeduplicationType.IsValid(model.Type))
        {
            throw new BadRequestException("Invalid deduplication type.");
        }

        byte[] fileBytes;
        if (model.Type == DeduplicationType.Single)
        {
            fileBytes = await _deduplicationService.AddList(model);
        }
        else
        {
            fileBytes = await _deduplicationService.Deduplicate(this.OrganizationId, model);
        }

        return File(fileBytes, "application/octet-stream", model.File.FileName);
    }
}
