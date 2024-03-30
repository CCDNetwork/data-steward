using System;
using System.Threading.Tasks;
using AutoMapper;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using Ccd.Server.Email;
using Ccd.Server.Helpers;
using Ccd.Server.Users;

namespace Ccd.Server.Organizations;

public class OrganizationService
{
    private readonly IMapper _mapperService;
    private readonly UserService _userService;
    private readonly CcdContext _context;
    private readonly DateTimeProvider _dateTimeProvider;
    private readonly EmailManagerService _emailManagerService;

    private readonly string _selectSql =
        $@"
             SELECT DISTINCT ON (t.id)
                 t.*
             FROM
                 organization t
             WHERE
                 (@id is null OR t.id = @id)";

    private object getSelectSqlParams(Guid? id = null)
    {
        return new { id };
    }

    public OrganizationService(
        IMapper mapperService,
        UserService userService,
        CcdContext context,
        DateTimeProvider dateTimeProvider,
        EmailManagerService emailManagerService
    )
    {
        _mapperService = mapperService;
        _userService = userService;
        _context = context;
        _dateTimeProvider = dateTimeProvider;
        _emailManagerService = emailManagerService;
    }

    public async Task<Organization> GetOrganizationById(Guid id)
    {
        return await _context.Organizations.FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Organization> GetOrganizationByName(string name)
    {
        return await _context.Organizations.FirstOrDefaultAsync(e => e.Name == name);
    }

    public async Task<Organization> AddOrganization(Organization organization)
    {
        var newOrganization = _context.Organizations.Add(organization).Entity;
        await _context.SaveChangesAsync();

        return newOrganization;
    }

    public async Task<Organization> UpdateOrganization(Organization organization)
    {
        var updatedOrganization = _context.Organizations.Update(organization).Entity;
        await _context.SaveChangesAsync();

        return updatedOrganization;
    }

    public async Task DeleteOrganization(Organization organization)
    {
        _context.Organizations.Remove(organization);
        await _context.SaveChangesAsync();
    }

    public async Task<OrganizationResponse> GetOrganizationApi(Guid id)
    {
        var organization = await _context.Database
            .GetDbConnection()
            .QueryFirstOrDefaultAsync<OrganizationResponse>(_selectSql, getSelectSqlParams(id));

        return organization;
    }

    public async Task<PagedApiResponse<OrganizationResponse>> GetOrganizationsApi(
        RequestParameters requestParameters = null
    )
    {
        return await PagedApiResponse<OrganizationResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(),
            requestParameters
        );
    }
}
