using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;

namespace Ccd.Server.Deduplication;

[ApiController]
[Route("/api/v1/deduplication")]
public class DeduplicationController : ControllerBaseExtended
{
    private readonly IMapper _mapper;
    private readonly DeduplicationService _deduplicationService;

    public DeduplicationController(IMapper mapper, DeduplicationService deduplicationService)
    {
        _mapper = mapper;
        _deduplicationService = deduplicationService;
    }

    [HttpPost("lists")]
    // [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> AddList(DeduplicationListAddRequest model)
    {
        var fileBytes = await _deduplicationService.AddList(model);
        return File(fileBytes, "application/octet-stream", model.File.FileName);
    }

    [HttpPost("deduplicate")]
    // [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> Deduplicate(DeduplicationListAddRequest model)
    {
        var fileBytes = await _deduplicationService.Deduplicate(this.OrganizationId, model);
        return File(fileBytes, "application/octet-stream", model.File.FileName);
    }
}
