using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using ClosedXML.Excel;

namespace Ccd.Server.Deduplication;

public class DeduplicationService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;

    public DeduplicationService(CcdContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<byte[]> AddList(DeduplicationListAddRequest model)
    {
        var file = model.File ?? throw new BadRequestException("File is required");
        using var workbook = new XLWorkbook(file.OpenReadStream());

        var worksheet = workbook.Worksheet(1);
        var lastColumnIndex = worksheet.LastColumnUsed().ColumnNumber() + 1;

        worksheet.Cell(1, lastColumnIndex).Style.Fill.BackgroundColor = XLColor.Gainsboro;
        worksheet.Cell(1, lastColumnIndex).Style.Font.Bold = true;
        worksheet.Cell(1, lastColumnIndex).Value = "duplicate";

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

            worksheet.Cell(i, lastColumnIndex).Value =
                deduplicationRecords.Any((e) => AreRecordsEqual(e, record)) ? "YES" : "NO";

            _context.Beneficionary.Add(_mapper.Map<Beneficionary>(record));

            deduplicationRecords.Add(record);
        }

        await _context.SaveChangesAsync();

        using var memoryStream = new MemoryStream();

        workbook.SaveAs(memoryStream);
        var fileBytes = memoryStream.ToArray();

        return fileBytes;
    }

    public async Task<byte[]> Deduplicate(Guid organizationId, DeduplicationListAddRequest model)
    {
        var file = model.File ?? throw new BadRequestException("File is required");
        using var workbook = new XLWorkbook(file.OpenReadStream());

        var list = (await _context.Lists.AddAsync(new List { FileName = file.FileName, OrganizationId = organizationId })).Entity;

        var worksheet = workbook.Worksheet(1);
        var lastColumnIndex = worksheet.LastColumnUsed().ColumnNumber() + 1;

        var deduplicationRecords = new List<DeduplicationRecord>();
        var beneficionaries = new List<Beneficionary>();

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

            worksheet.Cell(i, lastColumnIndex).Value =
                deduplicationRecords.Any((e) => AreRecordsEqual(e, record)) ? "YES" : "NO";

            var beneficionary = _mapper.Map<Beneficionary>(record);
            beneficionary.ListId = list.Id;
            beneficionary.OrganizationId = organizationId;

            beneficionaries.Add(beneficionary);
            deduplicationRecords.Add(record);
        }

        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);
        var fileBytes = memoryStream.ToArray();

        await _context.AddRangeAsync(beneficionaries);
        await _context.SaveChangesAsync();

        return fileBytes;
    }

    public bool AreRecordsEqual(DeduplicationRecord existingRecord, DeduplicationRecord newRecord)
    {
        var beneficiaryAttributes = _context.BeneficiaryAttributes.Where(e => e.UsedForDeduplication).ToList();
        foreach (var attribute in beneficiaryAttributes)
        {
            var attributeName = Regex.Replace(attribute.Name, @"\s+", "");
            var existingValue = existingRecord.GetType().GetProperty(attributeName)?.GetValue(existingRecord, null);
            var newValue = newRecord.GetType().GetProperty(attributeName)?.GetValue(newRecord, null);

            if (existingValue == null || newValue == null)
            {
                return false;
            }

            if (existingValue.ToString() != newValue.ToString())
            {
                return false;
            }
        }

        return true;
    }
}
