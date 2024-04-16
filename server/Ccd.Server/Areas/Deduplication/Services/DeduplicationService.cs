using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.BeneficiaryAttributes;
using Ccd.Server.Data;
using Ccd.Server.Deduplication.Controllers.ControllerModels;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;

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

    private readonly string _selectSql =
    $@"SELECT DISTINCT ON (l.id)
                 l.*
            FROM
                 list as l
            WHERE
                (@organizationId is null OR l.organization_id = @organizationId)";

    private object getSelectSqlParams(Guid? organizationId = null)
    {
        return new { organizationId };
    }

    private async Task resolveDependencies(DeduplicationListResponse listing)
    {
        if (listing.UserCreatedId != null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(e => e.Id == listing.UserCreatedId);
            listing.UserCreated = _mapper.Map<UserResponse>(user);
        }
    }

    public async Task<PagedApiResponse<DeduplicationListResponse>> GetAllListings(Guid organizationId, RequestParameters requestParameters)
    {
        return await PagedApiResponse<DeduplicationListResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(organizationId),
            requestParameters,
            resolveDependencies
        );
    }

    public async Task<byte[]> AddList(DeduplicationListAddRequest model)
    {
        var file = model.File ?? throw new BadRequestException("File is required");
        using var workbook = new XLWorkbook(file.OpenReadStream());
        var beneficiaryAttributes = _context.BeneficiaryAttributes.Where(e => e.UsedForDeduplication).ToList();

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
                deduplicationRecords.Any((e) => AreRecordsEqual(e, record, beneficiaryAttributes)) ? "YES" : "NO";

            deduplicationRecords.Add(record);
        }

        await _context.SaveChangesAsync();

        using var memoryStream = new MemoryStream();

        workbook.SaveAs(memoryStream);
        var fileBytes = memoryStream.ToArray();

        return fileBytes;
    }

    public async Task<byte[]> Deduplicate(Guid organizationId, Guid userId, DeduplicationListAddRequest model)
    {
        var file = model.File ?? throw new BadRequestException("File is required");
        using var workbook = new XLWorkbook(file.OpenReadStream());

        var beneficionaries = _context.Beneficionary.Include(e => e.Organization).ToList();
        var beneficiaryAttributes = _context.BeneficiaryAttributes.Where(e => e.UsedForDeduplication).ToList();
        var list = (await _context.Lists.AddAsync(new List { FileName = file.FileName, UserCreatedId = userId, OrganizationId = organizationId })).Entity;
        var totalDuplicates = 0;

        var worksheet = workbook.Worksheet(1);
        var lastColumnIndex = worksheet.LastColumnUsed().ColumnNumber() + 1;

        var deduplicationRecords = new List<DeduplicationRecord>();
        var newBeneficionaries = new List<Beneficionary>();

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

            worksheet.Cell(i, lastColumnIndex).Value = "NO";
            worksheet.Cell(i, lastColumnIndex + 1).Value = "";

            var duplicates = 0;
            foreach (var e in beneficionaries)
            {
                var exists = AreRecordsEqual(e, record, beneficiaryAttributes);
                if (exists)
                {
                    duplicates++;
                    worksheet.Cell(i, lastColumnIndex).Value = "YES";
                    worksheet.Cell(i, lastColumnIndex + 1).Value = e.Organization.Name;
                }
            }

            var beneficionary = _mapper.Map<Beneficionary>(record);
            beneficionary.ListId = list.Id;
            beneficionary.OrganizationId = organizationId;
            totalDuplicates += duplicates;

            newBeneficionaries.Add(beneficionary);
            deduplicationRecords.Add(record);
        }

        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);
        var fileBytes = memoryStream.ToArray();

        list.Duplicates = totalDuplicates;

        await _context.AddRangeAsync(newBeneficionaries);
        await _context.SaveChangesAsync();

        return fileBytes;
    }

    public bool AreRecordsEqual(DeduplicationRecord existingRecord, DeduplicationRecord newRecord, List<BeneficiaryAttribute> beneficiaryAttributes)
    {
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

    public bool AreRecordsEqual(Beneficionary existingRecord, DeduplicationRecord newRecord, List<BeneficiaryAttribute> beneficiaryAttributes)
    {
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
