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

    public async Task<byte[]> InternalDeduplication(Guid organizationId, DeduplicationListAddRequest model)
    {
        var file = model.File ?? throw new BadRequestException("File is required");
        using var workbook = new XLWorkbook(file.OpenReadStream());

        var template = await _context.Templates.FirstOrDefaultAsync(e => e.Id == model.TemplateId && e.OrganizationId == organizationId) ?? throw new BadRequestException("Template not found.");
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
                FirstName = worksheet.Cell(i, GetHeaderIndex(template.FirstName, worksheet)).Value.ToString(),
                FamilyName = worksheet.Cell(i, GetHeaderIndex(template.FamilyName, worksheet)).Value.ToString(),
                Gender = worksheet.Cell(i, GetHeaderIndex(template.Gender, worksheet)).Value.ToString(),
                DateofBirth = worksheet.Cell(i, GetHeaderIndex(template.DateofBirth, worksheet)).Value.ToString(),
                CommunityID = worksheet.Cell(i, GetHeaderIndex(template.CommunityID, worksheet)).Value.ToString(),
                HHID = worksheet.Cell(i, GetHeaderIndex(template.HHID, worksheet)).Value.ToString(),
                MobilePhoneID = worksheet.Cell(i, GetHeaderIndex(template.MobilePhoneID, worksheet)).Value.ToString(),
                GovIDType = worksheet.Cell(i, GetHeaderIndex(template.GovIDType, worksheet)).Value.ToString(),
                GovIDNumber = worksheet.Cell(i, GetHeaderIndex(template.GovIDNumber, worksheet)).Value.ToString(),
                OtherIDType = worksheet.Cell(i, GetHeaderIndex(template.OtherIDType, worksheet)).Value.ToString(),
                OtherIDNumber = worksheet.Cell(i, GetHeaderIndex(template.OtherIDNumber, worksheet)).Value.ToString(),
                AssistanceDetails = worksheet.Cell(i, GetHeaderIndex(template.AssistanceDetails, worksheet)).Value.ToString(),
                Activity = worksheet.Cell(i, GetHeaderIndex(template.Activity, worksheet)).Value.ToString(),
                Currency = worksheet.Cell(i, GetHeaderIndex(template.Currency, worksheet)).Value.ToString(),
                CurrencyAmount = worksheet.Cell(i, GetHeaderIndex(template.CurrencyAmount, worksheet)).Value.ToString(),
                StartDate = worksheet.Cell(i, GetHeaderIndex(template.StartDate, worksheet)).Value.ToString(),
                EndDate = worksheet.Cell(i, GetHeaderIndex(template.EndDate, worksheet)).Value.ToString(),
                Frequency = worksheet.Cell(i, GetHeaderIndex(template.Frequency, worksheet)).Value.ToString(),
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

    public async Task<byte[]> RegistryDeduplication(Guid organizationId, Guid userId, DeduplicationListAddRequest model)
    {
        var file = model.File ?? throw new BadRequestException("File is required");
        using var workbook = new XLWorkbook(file.OpenReadStream());

        var template = await _context.Templates.FirstOrDefaultAsync(e => e.Id == model.TemplateId && e.OrganizationId == organizationId) ?? throw new BadRequestException("Template not found.");
        var beneficionaries = _context.Beneficionary.Include(e => e.Organization).ToList();
        var beneficiaryAttributes = _context.BeneficiaryAttributes.Where(e => e.UsedForDeduplication).ToList();
        var list = (await _context.Lists.AddAsync(new List { FileName = file.FileName, UserCreatedId = userId, OrganizationId = organizationId })).Entity;
        var totalDuplicates = 0;

        var worksheet = workbook.Worksheet(1);
        var lastColumnIndex = worksheet.LastColumnUsed().ColumnNumber() + 1;

        // Add new duplicate header
        worksheet.Cell(1, lastColumnIndex).Style.Fill.BackgroundColor = XLColor.Gainsboro;
        worksheet.Cell(1, lastColumnIndex).Style.Font.Bold = true;
        worksheet.Cell(1, lastColumnIndex).Value = "duplicate";

        // Add new organization header
        worksheet.Cell(1, lastColumnIndex + 1).Style.Fill.BackgroundColor = XLColor.Gainsboro;
        worksheet.Cell(1, lastColumnIndex + 1).Style.Font.Bold = true;
        worksheet.Cell(1, lastColumnIndex + 1).Value = "organization";

        var newBeneficionaries = new List<Beneficionary>();

        for (var i = 2; i <= worksheet.LastRowUsed().RowNumber(); i++)
        {
            var record = new DeduplicationRecord
            {
                FamilyName = worksheet.Cell(i, GetHeaderIndex(template.FamilyName, worksheet)).Value.ToString(),
                FirstName = worksheet.Cell(i, GetHeaderIndex(template.FirstName, worksheet)).Value.ToString(),
                Gender = worksheet.Cell(i, GetHeaderIndex(template.Gender, worksheet)).Value.ToString(),
                DateofBirth = worksheet.Cell(i, GetHeaderIndex(template.DateofBirth, worksheet)).Value.ToString(),
                CommunityID = worksheet.Cell(i, GetHeaderIndex(template.CommunityID, worksheet)).Value.ToString(),
                HHID = worksheet.Cell(i, GetHeaderIndex(template.HHID, worksheet)).Value.ToString(),
                MobilePhoneID = worksheet.Cell(i, GetHeaderIndex(template.MobilePhoneID, worksheet)).Value.ToString(),
                GovIDType = worksheet.Cell(i, GetHeaderIndex(template.GovIDType, worksheet)).Value.ToString(),
                GovIDNumber = worksheet.Cell(i, GetHeaderIndex(template.GovIDNumber, worksheet)).Value.ToString(),
                OtherIDType = worksheet.Cell(i, GetHeaderIndex(template.OtherIDType, worksheet)).Value.ToString(),
                OtherIDNumber = worksheet.Cell(i, GetHeaderIndex(template.OtherIDNumber, worksheet)).Value.ToString(),
                AssistanceDetails = worksheet.Cell(i, GetHeaderIndex(template.AssistanceDetails, worksheet)).Value.ToString(),
                Activity = worksheet.Cell(i, GetHeaderIndex(template.Activity, worksheet)).Value.ToString(),
                Currency = worksheet.Cell(i, GetHeaderIndex(template.Currency, worksheet)).Value.ToString(),
                CurrencyAmount = worksheet.Cell(i, GetHeaderIndex(template.CurrencyAmount, worksheet)).Value.ToString(),
                StartDate = worksheet.Cell(i, GetHeaderIndex(template.StartDate, worksheet)).Value.ToString(),
                EndDate = worksheet.Cell(i, GetHeaderIndex(template.EndDate, worksheet)).Value.ToString(),
                Frequency = worksheet.Cell(i, GetHeaderIndex(template.Frequency, worksheet)).Value.ToString(),
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
        }

        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);
        var fileBytes = memoryStream.ToArray();

        list.Duplicates = totalDuplicates;

        await _context.AddRangeAsync(newBeneficionaries);
        await _context.SaveChangesAsync();

        return fileBytes;
    }

    public async Task DeleteListings()
    {
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM beneficionary");
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM list");
    }

    private static int GetHeaderIndex(string templateValue, IXLWorksheet worksheet)
    {
        foreach (var cell in worksheet.Row(1).Cells())
        {
            if (cell.Value.ToString() == templateValue)
            {
                return cell.WorksheetColumn().ColumnNumber();
            }
        }

        // TODO: find a better way to handle this
        // This is the last cell index
        return 16384;
    }

    private static bool AreRecordsEqual(DeduplicationRecord existingRecord, DeduplicationRecord newRecord, List<BeneficiaryAttribute> beneficiaryAttributes)
    {
        foreach (var attribute in beneficiaryAttributes)
        {
            var attributeName = attribute.AttributeName;
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

    private static bool AreRecordsEqual(Beneficionary existingRecord, DeduplicationRecord newRecord, List<BeneficiaryAttribute> beneficiaryAttributes)
    {
        foreach (var attribute in beneficiaryAttributes)
        {
            var attributeName = attribute.AttributeName;
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
