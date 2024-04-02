using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using System.IO;
using ClosedXML.Excel;

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

    [HttpPost("lists")]
    // [PermissionLevel(UserRole.User)]
    public async Task<ActionResult> AddList(DeduplicationListAddRequest model)
    {
        var file = model.File;

        if (file == null)
            throw new BadRequestException("File is required");
        
        using var workbook = new XLWorkbook(file.OpenReadStream());
        
        var worksheet = workbook.Worksheet(1);
        var lastColumnIndex = worksheet.LastColumnUsed().ColumnNumber();
        
        var duplicateColumn = worksheet.Cell(1, lastColumnIndex + 1);
        duplicateColumn.Value = "Duplicate";

        using var memoryStream = new MemoryStream();
        
        workbook.SaveAs(memoryStream);
        var fileBytes = memoryStream.ToArray();

        return File(fileBytes, "application/octet-stream", file.FileName);
    }
}
