using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using System.IO;
using System.Linq;
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

        worksheet.Cell(1, lastColumnIndex + 1).Style.Fill.BackgroundColor = XLColor.Gainsboro;
        worksheet.Cell(1, lastColumnIndex + 1).Style.Font.Bold = true;
        worksheet.Cell(1, lastColumnIndex + 1).Value = "duplicate";

        var deduplicationRecords = new List<DeduplicationRecord>();

        for (var i = 2; i <= worksheet.LastRowUsed().RowNumber(); i++)
        {
            var record = new DeduplicationRecord
            {
                TimestampOriginal = worksheet.Cell(i, 1).Value.ToString(),
                RegistrationOrg = worksheet.Cell(i, 2).Value.ToString(),
                RegistrationOrgId = worksheet.Cell(i, 3).Value.ToString(),
                FamilyName = worksheet.Cell(i, 4).Value.ToString(),
                FirstName = worksheet.Cell(i, 5).Value.ToString(),
                Gender = worksheet.Cell(i, 6).Value.ToString(),
                DateOfBirth = worksheet.Cell(i, 7).Value.ToString(),
                MobilePhone = worksheet.Cell(i, 8).Value.ToString(),
                GovIdType = worksheet.Cell(i, 9).Value.ToString(),
                GovIdNumber = worksheet.Cell(i, 10).Value.ToString(),
                AssistanceOrd = worksheet.Cell(i, 11).Value.ToString(),
                AssistanceCategory = worksheet.Cell(i, 12).Value.ToString(),
                AssistanceAmount = worksheet.Cell(i, 13).Value.ToString(),
                AssistanceStart = worksheet.Cell(i, 14).Value.ToString(),
                AssistanceEnd = worksheet.Cell(i, 15).Value.ToString()
            };

            worksheet.Cell(i, lastColumnIndex + 1).Value =
                deduplicationRecords.Any(e => e.GovIdNumber == record.GovIdNumber) ? "YES" : "NO";

            deduplicationRecords.Add(record);
        }

        using var memoryStream = new MemoryStream();

        workbook.SaveAs(memoryStream);
        var fileBytes = memoryStream.ToArray();

        return File(fileBytes, "application/octet-stream", file.FileName);
    }
}