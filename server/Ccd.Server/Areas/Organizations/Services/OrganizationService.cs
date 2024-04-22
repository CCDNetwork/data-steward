using System;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using Ccd.Server.Email;
using Ccd.Server.Helpers;
using System.Linq;

namespace Ccd.Server.Organizations;

public class OrganizationService
{
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
        CcdContext context,
        DateTimeProvider dateTimeProvider,
        EmailManagerService emailManagerService
    )
    {
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
        await DeleteUsersFromOrganization(organization);
        await DeleteReferralsFromOrganization(organization);

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

    private async Task DeleteUsersFromOrganization(Organization organization)
    {
        var userOrganizations = await _context.UserOrganizations.Where(e => e.OrganizationId == organization.Id).ToListAsync();
        foreach (var userOrganization in userOrganizations)
        {
            var user = await _context.Users.FirstOrDefaultAsync(e => e.Id == userOrganization.UserId);
            if (user.IsDeleted)
            {
                _context.UserOrganizations.Remove(userOrganization);
                _context.Users.Remove(user);
            }
            else
            {
                throw new BadRequestException("Cannot delete organization with active users.");
            }
        }
    }

    private async Task DeleteReferralsFromOrganization(Organization organization)
    {
        var refferals = await _context.Referrals.Where(e =>
            (e.OrganizationCreatedId == organization.Id) ||
            (e.OrganizationReferredToId == organization.Id)).ToListAsync();
        _context.Referrals.RemoveRange(refferals);
    }
}
