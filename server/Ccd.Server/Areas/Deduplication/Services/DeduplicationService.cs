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
using FuzzySharp;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Beneficiaries;
using Ccd.Server.Storage;
using DocumentFormat.OpenXml.Office.Drawing;

namespace Ccd.Server.Deduplication;

public class DeduplicationService
{
    private readonly CcdContext _context;
    private readonly IMapper _mapper;
    private readonly BeneficiaryAttributeGroupService _beneficiaryAttributeGroupService;

    private readonly IStorageService _storageService;

    public DeduplicationService(CcdContext context, IMapper mapper, BeneficiaryAttributeGroupService beneficiaryAttributeGroupService, IStorageService storageService)
    {
        _context = context;
        _mapper = mapper;
        _beneficiaryAttributeGroupService = beneficiaryAttributeGroupService;
        _storageService = storageService;
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
        var beneficiaryAttributesGroupsApi = await _beneficiaryAttributeGroupService.GetBeneficiaryAttributeGroupsApi(new RequestParameters { PageSize = 1000, Page = 1 });
        var beneficiaryAttributesGroups = beneficiaryAttributesGroupsApi.Data.Where(e => e.IsActive).ToList();

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
                DateOfBirth = worksheet.Cell(i, GetHeaderIndex(template.DateOfBirth, worksheet)).Value.ToString(),
                AdminLevel1 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel1, worksheet)).Value.ToString(),
                AdminLevel2 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel2, worksheet)).Value.ToString(),
                AdminLevel3 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel3, worksheet)).Value.ToString(),
                AdminLevel4 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel4, worksheet)).Value.ToString(),
                HhId = worksheet.Cell(i, GetHeaderIndex(template.HHID, worksheet)).Value.ToString(),
                MobilePhoneId = worksheet.Cell(i, GetHeaderIndex(template.MobilePhoneID, worksheet)).Value.ToString(),
                GovIdType = worksheet.Cell(i, GetHeaderIndex(template.GovIDType, worksheet)).Value.ToString(),
                GovIdNumber = worksheet.Cell(i, GetHeaderIndex(template.GovIDNumber, worksheet)).Value.ToString(),
                OtherIdType = worksheet.Cell(i, GetHeaderIndex(template.OtherIDType, worksheet)).Value.ToString(),
                OtherIdNumber = worksheet.Cell(i, GetHeaderIndex(template.OtherIDNumber, worksheet)).Value.ToString(),
                AssistanceDetails = worksheet.Cell(i, GetHeaderIndex(template.AssistanceDetails, worksheet)).Value.ToString(),
                Activity = worksheet.Cell(i, GetHeaderIndex(template.Activity, worksheet)).Value.ToString(),
                Currency = worksheet.Cell(i, GetHeaderIndex(template.Currency, worksheet)).Value.ToString(),
                CurrencyAmount = worksheet.Cell(i, GetHeaderIndex(template.CurrencyAmount, worksheet)).Value.ToString(),
                StartDate = worksheet.Cell(i, GetHeaderIndex(template.StartDate, worksheet)).Value.ToString(),
                EndDate = worksheet.Cell(i, GetHeaderIndex(template.EndDate, worksheet)).Value.ToString(),
                Frequency = worksheet.Cell(i, GetHeaderIndex(template.Frequency, worksheet)).Value.ToString(),
            };

            // worksheet.Cell(i, lastColumnIndex).Value =
            //     deduplicationRecords.Any((e) => AreRecordsEqual(e, record, beneficiaryAttributesGroups)) ? "YES" : "NO";

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
        var beneficaries = _context.Beneficaries.Include(e => e.Organization).ToList();
        var beneficiaryAttributesGroupsApi = await _beneficiaryAttributeGroupService.GetBeneficiaryAttributeGroupsApi(new RequestParameters { PageSize = 1000, Page = 1 });
        var beneficiaryAttributesGroups = beneficiaryAttributesGroupsApi.Data.Where(e => e.IsActive).ToList();
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

        var newBeneficaries = new List<Beneficary>();

        for (var i = 2; i <= worksheet.LastRowUsed().RowNumber(); i++)
        {
            var record = new DeduplicationRecord
            {
                FamilyName = worksheet.Cell(i, GetHeaderIndex(template.FamilyName, worksheet)).Value.ToString(),
                FirstName = worksheet.Cell(i, GetHeaderIndex(template.FirstName, worksheet)).Value.ToString(),
                Gender = worksheet.Cell(i, GetHeaderIndex(template.Gender, worksheet)).Value.ToString(),
                DateOfBirth = worksheet.Cell(i, GetHeaderIndex(template.DateOfBirth, worksheet)).Value.ToString(),
                AdminLevel1 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel1, worksheet)).Value.ToString(),
                AdminLevel2 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel2, worksheet)).Value.ToString(),
                AdminLevel3 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel3, worksheet)).Value.ToString(),
                AdminLevel4 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel4, worksheet)).Value.ToString(),
                HhId = worksheet.Cell(i, GetHeaderIndex(template.HHID, worksheet)).Value.ToString(),
                MobilePhoneId = worksheet.Cell(i, GetHeaderIndex(template.MobilePhoneID, worksheet)).Value.ToString(),
                GovIdType = worksheet.Cell(i, GetHeaderIndex(template.GovIDType, worksheet)).Value.ToString(),
                GovIdNumber = worksheet.Cell(i, GetHeaderIndex(template.GovIDNumber, worksheet)).Value.ToString(),
                OtherIdType = worksheet.Cell(i, GetHeaderIndex(template.OtherIDType, worksheet)).Value.ToString(),
                OtherIdNumber = worksheet.Cell(i, GetHeaderIndex(template.OtherIDNumber, worksheet)).Value.ToString(),
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
            var isPrimary = true;
            foreach (var e in beneficaries)
            {
                var (exists, matchedFields) = AreRecordsEqual(e, record, beneficiaryAttributesGroups);
                if (exists)
                {
                    duplicates++;
                    isPrimary = false;
                    worksheet.Cell(i, lastColumnIndex).Value = "YES";
                    worksheet.Cell(i, lastColumnIndex + 1).Value = e.Organization.Name;
                }
            }

            var beneficary = _mapper.Map<Beneficary>(record);
            beneficary.ListId = list.Id;
            beneficary.OrganizationId = organizationId;
            beneficary.IsPrimary = isPrimary;
            totalDuplicates += duplicates;

            newBeneficaries.Add(beneficary);
        }

        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);
        var fileBytes = memoryStream.ToArray();

        list.Duplicates = totalDuplicates;

        await _context.AddRangeAsync(newBeneficaries);
        await _context.SaveChangesAsync();

        return fileBytes;
    }

    public async Task<DatasetDeduplicationResponse> DatasetDeduplication(Guid organizationId, Guid userId, DatasetDeduplicationRequest model)
    {
        var file = model.File ?? throw new BadRequestException("File is required");
        using var workbook = new XLWorkbook(file.OpenReadStream());

        var template = await _context.Templates.FirstOrDefaultAsync(e => e.Id == model.TemplateId && e.OrganizationId == organizationId) ?? throw new BadRequestException("Template not found.");
        var beneficiaryAttributesGroupsApi = await _beneficiaryAttributeGroupService.GetBeneficiaryAttributeGroupsApi(new RequestParameters { PageSize = 1000, Page = 1 });
        var beneficiaryAttributesGroups = beneficiaryAttributesGroupsApi.Data.Where(e => e.IsActive).ToList();

        var worksheet = workbook.Worksheet(1);
        var lastColumnIndex = worksheet.LastColumnUsed().ColumnNumber() + 1;

        worksheet.Cell(1, lastColumnIndex).Style.Fill.BackgroundColor = XLColor.Gainsboro;
        worksheet.Cell(1, lastColumnIndex).Style.Font.Bold = true;
        worksheet.Cell(1, lastColumnIndex).Value = "duplicate";

        var deduplicationRecords = new List<DeduplicationRecord>();
        var duplicates = 0;

        for (var i = 2; i <= worksheet.LastRowUsed().RowNumber(); i++)
        {
            var fileRecord = new DeduplicationRecord
            {
                FirstName = worksheet.Cell(i, GetHeaderIndex(template.FirstName, worksheet)).Value.ToString(),
                FamilyName = worksheet.Cell(i, GetHeaderIndex(template.FamilyName, worksheet)).Value.ToString(),
                Gender = worksheet.Cell(i, GetHeaderIndex(template.Gender, worksheet)).Value.ToString(),
                DateOfBirth = worksheet.Cell(i, GetHeaderIndex(template.DateOfBirth, worksheet)).Value.ToString(),
                AdminLevel1 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel1, worksheet)).Value.ToString(),
                AdminLevel2 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel2, worksheet)).Value.ToString(),
                AdminLevel3 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel3, worksheet)).Value.ToString(),
                AdminLevel4 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel4, worksheet)).Value.ToString(),
                HhId = worksheet.Cell(i, GetHeaderIndex(template.HHID, worksheet)).Value.ToString(),
                MobilePhoneId = worksheet.Cell(i, GetHeaderIndex(template.MobilePhoneID, worksheet)).Value.ToString(),
                GovIdType = worksheet.Cell(i, GetHeaderIndex(template.GovIDType, worksheet)).Value.ToString(),
                GovIdNumber = worksheet.Cell(i, GetHeaderIndex(template.GovIDNumber, worksheet)).Value.ToString(),
                OtherIdType = worksheet.Cell(i, GetHeaderIndex(template.OtherIDType, worksheet)).Value.ToString(),
                OtherIdNumber = worksheet.Cell(i, GetHeaderIndex(template.OtherIDNumber, worksheet)).Value.ToString(),
                AssistanceDetails = worksheet.Cell(i, GetHeaderIndex(template.AssistanceDetails, worksheet)).Value.ToString(),
                Activity = worksheet.Cell(i, GetHeaderIndex(template.Activity, worksheet)).Value.ToString(),
                Currency = worksheet.Cell(i, GetHeaderIndex(template.Currency, worksheet)).Value.ToString(),
                CurrencyAmount = worksheet.Cell(i, GetHeaderIndex(template.CurrencyAmount, worksheet)).Value.ToString(),
                StartDate = worksheet.Cell(i, GetHeaderIndex(template.StartDate, worksheet)).Value.ToString(),
                EndDate = worksheet.Cell(i, GetHeaderIndex(template.EndDate, worksheet)).Value.ToString(),
                Frequency = worksheet.Cell(i, GetHeaderIndex(template.Frequency, worksheet)).Value.ToString(),
            };

            deduplicationRecords.Add(fileRecord);
        }


        for (var i = 2; i <= worksheet.LastRowUsed().RowNumber(); i++)
        {
            var fileRecord = new DeduplicationRecord
            {
                FirstName = worksheet.Cell(i, GetHeaderIndex(template.FirstName, worksheet)).Value.ToString(),
                FamilyName = worksheet.Cell(i, GetHeaderIndex(template.FamilyName, worksheet)).Value.ToString(),
                Gender = worksheet.Cell(i, GetHeaderIndex(template.Gender, worksheet)).Value.ToString(),
                DateOfBirth = worksheet.Cell(i, GetHeaderIndex(template.DateOfBirth, worksheet)).Value.ToString(),
                AdminLevel1 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel1, worksheet)).Value.ToString(),
                AdminLevel2 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel2, worksheet)).Value.ToString(),
                AdminLevel3 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel3, worksheet)).Value.ToString(),
                AdminLevel4 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel4, worksheet)).Value.ToString(),
                HhId = worksheet.Cell(i, GetHeaderIndex(template.HHID, worksheet)).Value.ToString(),
                MobilePhoneId = worksheet.Cell(i, GetHeaderIndex(template.MobilePhoneID, worksheet)).Value.ToString(),
                GovIdType = worksheet.Cell(i, GetHeaderIndex(template.GovIDType, worksheet)).Value.ToString(),
                GovIdNumber = worksheet.Cell(i, GetHeaderIndex(template.GovIDNumber, worksheet)).Value.ToString(),
                OtherIdType = worksheet.Cell(i, GetHeaderIndex(template.OtherIDType, worksheet)).Value.ToString(),
                OtherIdNumber = worksheet.Cell(i, GetHeaderIndex(template.OtherIDNumber, worksheet)).Value.ToString(),
                AssistanceDetails = worksheet.Cell(i, GetHeaderIndex(template.AssistanceDetails, worksheet)).Value.ToString(),
                Activity = worksheet.Cell(i, GetHeaderIndex(template.Activity, worksheet)).Value.ToString(),
                Currency = worksheet.Cell(i, GetHeaderIndex(template.Currency, worksheet)).Value.ToString(),
                CurrencyAmount = worksheet.Cell(i, GetHeaderIndex(template.CurrencyAmount, worksheet)).Value.ToString(),
                StartDate = worksheet.Cell(i, GetHeaderIndex(template.StartDate, worksheet)).Value.ToString(),
                EndDate = worksheet.Cell(i, GetHeaderIndex(template.EndDate, worksheet)).Value.ToString(),
                Frequency = worksheet.Cell(i, GetHeaderIndex(template.Frequency, worksheet)).Value.ToString(),
            };

            var hasDuplicates = false;
            worksheet.Cell(i, lastColumnIndex).Value = "NO";
            for (var k = 2; k <= worksheet.LastRowUsed().RowNumber(); k++)
            {
                // Skip the same record
                if (i == k) continue;

                var deduplicationRecord = deduplicationRecords[k - 2];
                var (equal, matchedFields) = AreRecordsEqual(deduplicationRecord, fileRecord, beneficiaryAttributesGroups);
                if (equal)
                {
                    hasDuplicates = true;
                    worksheet.Cell(i, lastColumnIndex).Value = "YES";

                    foreach (var field in matchedFields)
                    {
                        var fieldName = template.GetType().GetProperty(field)?.GetValue(template).ToString();
                        var columnIndex = GetHeaderIndex(fieldName, worksheet);
                        worksheet.Cell(i, columnIndex).Style.Fill.BackgroundColor = XLColor.Red;
                    }
                };
            }

            if (hasDuplicates) duplicates++;
        }

        await _context.SaveChangesAsync();

        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);

        var savedFile = await _storageService.SaveFile(StorageType.GetById(StorageType.Assets.Id), memoryStream, userId, model.File.FileName);
        var fileResponse = await _storageService.GetFileApiById(savedFile.Id);

        return new DatasetDeduplicationResponse
        {
            File = fileResponse,
            TemplateId = model.TemplateId,
            Duplicates = duplicates
        };
    }

    public async Task<SameOrganizationDeduplicationResponse> SameOrganizationDeduplication(Guid organizationId, Guid userId, SameOrganizationDeduplicationRequest model)
    {
        var file = await _storageService.GetFileById(model.FileId);
        using var workbook = new XLWorkbook(_storageService.GetFileStream(file));

        var template = await _context.Templates.FirstOrDefaultAsync(e => e.Id == model.TemplateId && e.OrganizationId == organizationId) ?? throw new BadRequestException("Template not found.");
        var beneficaries = _context.Beneficaries.Include(e => e.Organization).Where(e => e.OrganizationId == organizationId).ToList();
        var beneficiaryAttributesGroupsApi = await _beneficiaryAttributeGroupService.GetBeneficiaryAttributeGroupsApi(new RequestParameters { PageSize = 1000, Page = 1 });
        var beneficiaryAttributesGroups = beneficiaryAttributesGroupsApi.Data.Where(e => e.IsActive).ToList();
        var totalDuplicates = 0;

        var worksheet = workbook.Worksheet(1);
        var lastColumnIndex = worksheet.LastColumnUsed().ColumnNumber() + 1;

        var newDeduplicationBeneficaries = new List<BeneficaryDeduplication>();

        for (var i = 2; i <= worksheet.LastRowUsed().RowNumber(); i++)
        {
            var record = new DeduplicationRecord
            {
                FamilyName = worksheet.Cell(i, GetHeaderIndex(template.FamilyName, worksheet)).Value.ToString(),
                FirstName = worksheet.Cell(i, GetHeaderIndex(template.FirstName, worksheet)).Value.ToString(),
                Gender = worksheet.Cell(i, GetHeaderIndex(template.Gender, worksheet)).Value.ToString(),
                DateOfBirth = worksheet.Cell(i, GetHeaderIndex(template.DateOfBirth, worksheet)).Value.ToString(),
                AdminLevel1 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel1, worksheet)).Value.ToString(),
                AdminLevel2 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel2, worksheet)).Value.ToString(),
                AdminLevel3 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel3, worksheet)).Value.ToString(),
                AdminLevel4 = worksheet.Cell(i, GetHeaderIndex(template.AdminLevel4, worksheet)).Value.ToString(),
                HhId = worksheet.Cell(i, GetHeaderIndex(template.HHID, worksheet)).Value.ToString(),
                MobilePhoneId = worksheet.Cell(i, GetHeaderIndex(template.MobilePhoneID, worksheet)).Value.ToString(),
                GovIdType = worksheet.Cell(i, GetHeaderIndex(template.GovIDType, worksheet)).Value.ToString(),
                GovIdNumber = worksheet.Cell(i, GetHeaderIndex(template.GovIDNumber, worksheet)).Value.ToString(),
                OtherIdType = worksheet.Cell(i, GetHeaderIndex(template.OtherIDType, worksheet)).Value.ToString(),
                OtherIdNumber = worksheet.Cell(i, GetHeaderIndex(template.OtherIDNumber, worksheet)).Value.ToString(),
                AssistanceDetails = worksheet.Cell(i, GetHeaderIndex(template.AssistanceDetails, worksheet)).Value.ToString(),
                Activity = worksheet.Cell(i, GetHeaderIndex(template.Activity, worksheet)).Value.ToString(),
                Currency = worksheet.Cell(i, GetHeaderIndex(template.Currency, worksheet)).Value.ToString(),
                CurrencyAmount = worksheet.Cell(i, GetHeaderIndex(template.CurrencyAmount, worksheet)).Value.ToString(),
                StartDate = worksheet.Cell(i, GetHeaderIndex(template.StartDate, worksheet)).Value.ToString(),
                EndDate = worksheet.Cell(i, GetHeaderIndex(template.EndDate, worksheet)).Value.ToString(),
                Frequency = worksheet.Cell(i, GetHeaderIndex(template.Frequency, worksheet)).Value.ToString(),
            };

            var duplicates = 0;
            var newBeneficary = _mapper.Map<BeneficaryDeduplication>(record);
            var markedForImport = true;
            var duplicateOfIds = new List<Guid>();

            foreach (var e in beneficaries)
            {
                var (exists, matchedFields) = AreRecordsEqual(e, record, beneficiaryAttributesGroups);
                if (exists)
                {
                    duplicates++;
                    newBeneficary.IsOrganizationDuplicate = true;
                    markedForImport = false;
                    duplicateOfIds.Add(e.Id);
                    newBeneficary.MatchedFields = matchedFields;
                }
            }

            newBeneficary.OrganizationId = organizationId;
            newBeneficary.FileId = file.Id;
            newBeneficary.UploadedById = userId;
            newBeneficary.MarkedForImport = markedForImport;
            newBeneficary.DuplicateOfIds = duplicateOfIds;
            newDeduplicationBeneficaries.Add(newBeneficary);

            totalDuplicates += duplicates;
        }


        await _context.AddRangeAsync(newDeduplicationBeneficaries);
        await _context.SaveChangesAsync();

        using var memoryStream = new MemoryStream();
        workbook.SaveAs(memoryStream);

        var fileResponse = await _storageService.GetFileApiById(file.Id);
        var duplicateBeneficiaries = _context.BeneficaryDeduplications.Where(e => e.FileId == file.Id && e.IsOrganizationDuplicate).ToList();

        return new SameOrganizationDeduplicationResponse
        {
            File = fileResponse,
            TemplateId = model.TemplateId,
            Duplicates = totalDuplicates,
            DuplicateBeneficiaries = duplicateBeneficiaries
        };
    }

    public async Task<SameOrganizationDeduplicationResponse> SystemOrganizationsDeduplication(Guid organizationId, Guid userId, SystemOrganizationsDeduplicationRequest model)
    {
        var file = await _storageService.GetFileById(model.FileId);

        var beneficaryMarkedForImport = _context.BeneficaryDeduplications.Where(e => model.KeepDuplicatesIds.Contains(e.Id) && e.FileId == file.Id).ToList();
        beneficaryMarkedForImport.ForEach(e => e.MarkedForImport = true);
        _context.UpdateRange(beneficaryMarkedForImport);
        await _context.SaveChangesAsync();


        var beneficaries = _context.Beneficaries.Include(e => e.Organization).Where(e => e.OrganizationId != organizationId).ToList();
        var beneficiaryDeduplications = _context.BeneficaryDeduplications.Include(e => e.Organization).Where(e => e.FileId == model.FileId).ToList();
        var beneficiaryAttributesGroupsApi = await _beneficiaryAttributeGroupService.GetBeneficiaryAttributeGroupsApi(new RequestParameters { PageSize = 1000, Page = 1 });
        var beneficiaryAttributesGroups = beneficiaryAttributesGroupsApi.Data.Where(e => e.IsActive).ToList();
        var totalDuplicates = 0;

        foreach (var record in beneficiaryDeduplications)
        {
            var duplicates = 0;
            foreach (var e in beneficaries)
            {
                var (exists, matchedFields) = AreRecordsEqual(e, record, beneficiaryAttributesGroups);
                if (exists)
                {
                    duplicates++;
                    record.IsSystemDuplicate = true;
                    record.DuplicateOfIds.Add(e.Id);
                    record.MatchedFields = matchedFields;
                }
            }

            totalDuplicates += duplicates;
        }

        _context.UpdateRange(beneficiaryDeduplications);
        await _context.SaveChangesAsync();

        var fileResponse = await _storageService.GetFileApiById(file.Id);
        var duplicateBeneficiaries = _context.BeneficaryDeduplications.Where(e => e.FileId == model.FileId && e.IsSystemDuplicate).ToList();

        return new SameOrganizationDeduplicationResponse
        {
            File = fileResponse,
            TemplateId = model.TemplateId,
            Duplicates = totalDuplicates,
            DuplicateBeneficiaries = duplicateBeneficiaries
        };
    }

    public async Task<SameOrganizationDeduplicationResponse> FinishDeduplication(Guid organizationId, Guid userId, SystemOrganizationsDeduplicationRequest model)
    {
        var file = await _storageService.GetFileById(model.FileId);

        var beneficaryMarkedForImport = _context.BeneficaryDeduplications.Where(e => model.KeepDuplicatesIds.Contains(e.Id) && e.FileId == file.Id).ToList();
        beneficaryMarkedForImport.ForEach(e => e.MarkedForImport = true);
        _context.UpdateRange(beneficaryMarkedForImport);

        var template = await _context.Templates.FirstOrDefaultAsync(e => e.Id == model.TemplateId && e.OrganizationId == organizationId) ?? throw new BadRequestException("Template not found.");
        var beneficiaryDeduplications = _context.BeneficaryDeduplications.Include(e => e.Organization).Where(e => e.FileId == model.FileId && e.MarkedForImport).ToList();
        var list = (await _context.Lists.AddAsync(new List { FileName = file.Name, UserCreatedId = userId, OrganizationId = organizationId })).Entity;

        var newBeneficaries = new List<Beneficary>();
        foreach (var record in beneficiaryDeduplications)
        {
            var beneficary = _mapper.Map<Beneficary>(record);
            beneficary.ListId = list.Id;
            beneficary.OrganizationId = organizationId;
            beneficary.IsPrimary = !record.IsSystemDuplicate && !record.IsOrganizationDuplicate;
            beneficary.Status = (record.IsSystemDuplicate || record.IsOrganizationDuplicate) ? BeneficaryStatus.AcceptedDuplicate : BeneficaryStatus.NotDuplicate;
            newBeneficaries.Add(beneficary);

            // Sync duplicates to old beneficaries
            if (record.DuplicateOfIds.Count != 0)
            {
                var existingBeneficiaries = _context.Beneficaries.Where(e => record.DuplicateOfIds.Contains(e.Id)).ToList();
                foreach (var existingBeneficiary in existingBeneficiaries)
                {
                    existingBeneficiary.DuplicateOfIds.Add(beneficary.Id);
                }

                _context.UpdateRange(existingBeneficiaries);
            }
        }

        await _context.AddRangeAsync(newBeneficaries);

        var currentBeneficaryDeduplicationsToRemove = _context.BeneficaryDeduplications.Where(e => e.FileId == model.FileId).ToList();
        _context.RemoveRange(currentBeneficaryDeduplicationsToRemove);

        var oldBeneficaryDeduplicationsToRemove = _context.BeneficaryDeduplications.Where(e => e.CreatedAt.Date < DateTime.UtcNow.Date.AddDays(-3)).ToList();
        _context.RemoveRange(oldBeneficaryDeduplicationsToRemove);

        await _context.SaveChangesAsync();

        var fileResponse = await _storageService.GetFileApiById(file.Id);

        return new SameOrganizationDeduplicationResponse
        {
            File = fileResponse,
            TemplateId = model.TemplateId,
        };
    }

    public async Task DeleteListings()
    {
        await _context.Database.ExecuteSqlRawAsync("DELETE FROM beneficary");
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

    private static (bool, List<string>) AreRecordsEqual(DeduplicationRecord existingRecord, DeduplicationRecord newRecord, List<BeneficiaryAttributeGroupResponse> beneficiaryAttributesGroups)
    {
        foreach (var group in beneficiaryAttributesGroups)
        {
            var matchedFields = new List<string>();

            foreach (var attribute in group.BeneficiaryAttributes)
            {
                var attributeName = attribute.AttributeName;
                var existingValue = existingRecord.GetType().GetProperty(attributeName)?.GetValue(existingRecord, null).ToString();
                var newValue = newRecord.GetType().GetProperty(attributeName)?.GetValue(newRecord, null).ToString();

                if (string.IsNullOrEmpty(existingValue) || string.IsNullOrEmpty(newValue)) continue;
                if (group.UseFuzzyMatch)
                {
                    var firstString = Regex.Replace(existingValue, @"\s+", "").ToLower();
                    var secondString = Regex.Replace(newValue, @"\s+", "").ToLower();
                    var ratio = Fuzz.Ratio(firstString, secondString);
                    if (ratio < 85) continue;
                }
                else if (existingValue != newValue) continue;

                matchedFields.Add(attributeName);
            }

            return (matchedFields.Count >= group.BeneficiaryAttributes.Count, matchedFields);
        }

        return (false, []);
    }

    private static (bool, List<string>) AreRecordsEqual(Beneficary existingRecord, DeduplicationRecord newRecord, List<BeneficiaryAttributeGroupResponse> beneficiaryAttributesGroups)
    {
        foreach (var group in beneficiaryAttributesGroups)
        {
            var matchedFields = new List<string>();

            foreach (var attribute in group.BeneficiaryAttributes)
            {
                var attributeName = attribute.AttributeName;
                var existingValue = existingRecord.GetType().GetProperty(attributeName)?.GetValue(existingRecord, null).ToString();
                var newValue = newRecord.GetType().GetProperty(attributeName)?.GetValue(newRecord, null).ToString();

                if (string.IsNullOrEmpty(existingValue) || string.IsNullOrEmpty(newValue)) continue;
                if (group.UseFuzzyMatch)
                {
                    var firstString = Regex.Replace(existingValue, @"\s+", "").ToLower();
                    var secondString = Regex.Replace(newValue, @"\s+", "").ToLower();
                    var ratio = Fuzz.Ratio(firstString, secondString);
                    if (ratio < 85) continue;
                }
                else if (existingValue != newValue) continue;

                matchedFields.Add(attributeName);
            }

            return (matchedFields.Count >= group.BeneficiaryAttributes.Count, matchedFields);
        }

        return (false, []);
    }

    private static (bool, List<string>) AreRecordsEqual(Beneficary existingRecord, BeneficaryDeduplication newRecord, List<BeneficiaryAttributeGroupResponse> beneficiaryAttributesGroups)
    {
        foreach (var group in beneficiaryAttributesGroups)
        {
            var matchedFields = new List<string>();

            foreach (var attribute in group.BeneficiaryAttributes)
            {
                var attributeName = attribute.AttributeName;
                var existingValue = existingRecord.GetType().GetProperty(attributeName)?.GetValue(existingRecord, null).ToString();
                var newValue = newRecord.GetType().GetProperty(attributeName)?.GetValue(newRecord, null).ToString();

                if (string.IsNullOrEmpty(existingValue) || string.IsNullOrEmpty(newValue)) continue;
                if (group.UseFuzzyMatch)
                {
                    var firstString = Regex.Replace(existingValue, @"\s+", "").ToLower();
                    var secondString = Regex.Replace(newValue, @"\s+", "").ToLower();
                    var ratio = Fuzz.Ratio(firstString, secondString);
                    if (ratio < 85) continue;
                }
                else if (existingValue != newValue) continue;

                matchedFields.Add(attributeName);
            }

            return (matchedFields.Count >= group.BeneficiaryAttributes.Count, matchedFields);
        }

        return (false, []);
    }
}
