using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using System.IO;

namespace Ccd.Server.Deduplication;

[ApiController]
[Route("/api/v1/deduplication")]
public class OrganizationController : ControllerBaseExtended
{
    private readonly IMapper _mapper;

    public OrganizationController(IMapper mapper)
    {
        _mapper = mapper;
    }

    [HttpPost("list")]
    // [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> AddList(DeduplicationListAddRequest model)
    {
        var file = model.File;

        if (file == null)
            throw new BadRequestException("File is required");

        byte[] fileBytes;
        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            fileBytes = memoryStream.ToArray();
        }

        return File(fileBytes, "application/octet-stream", file.FileName);
    }
}
