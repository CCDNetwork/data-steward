using System;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Ccd.Server.Data;
using Ccd.Server.Email;
using Ccd.Server.Helpers;
using System.Linq;
using System.Collections.Generic;
using AutoMapper;

namespace Ccd.Server.Organizations;

public class OrganizationService
{
    private readonly CcdContext _context;
    private readonly DateTimeProvider _dateTimeProvider;
    private readonly EmailManagerService _emailManagerService;
    private readonly IMapper _mapper;

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
        IMapper mapper,
        DateTimeProvider dateTimeProvider,
        EmailManagerService emailManagerService
    )
    {
        _context = context;
        _dateTimeProvider = dateTimeProvider;
        _emailManagerService = emailManagerService;
        _mapper = mapper;
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
        await DeleteActivitiesFromOrganization(organization);

        _context.Organizations.Remove(organization);
        await _context.SaveChangesAsync();
    }

    public async Task<OrganizationResponse> GetOrganizationApi(Guid id)
    {
        var organization = await GetOrganizationById(id);
        var organizationResponse = _mapper.Map<OrganizationResponse>(organization);

        if (organizationResponse != null)
            await resolveDependencies(organizationResponse);

        return organizationResponse;
    }

    public async Task<PagedApiResponse<OrganizationResponse>> GetOrganizationsApi(
        RequestParameters requestParameters = null
    )
    {
        return await PagedApiResponse<OrganizationResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(),
            requestParameters,
            resolveDependencies
        );
    }

    public async Task AddActivities(List<Activity> activities)
    {
        await _context.Activities.AddRangeAsync(activities);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateActivities(List<Activity> activities)
    {
        _context.Activities.UpdateRange(activities);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteActivities(List<Activity> activities)
    {
        _context.Activities.RemoveRange(activities);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Activity>> GetActivitiesToDelete(Guid organizationId, List<Activity> activitiesToUpdate)
    {
        var activitiesToDelete = await _context.Activities
            .Where(e => e.OrganizationId == organizationId && !activitiesToUpdate.Select(a => a.Id).Contains(e.Id))
            .ToListAsync();

        return activitiesToDelete;
    }

    private async Task resolveDependencies(OrganizationResponse response)
    {
        response.Activities = await _context.Activities
            .Where(e => e.OrganizationId == response.Id)
            .ToListAsync();
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

    private async Task DeleteActivitiesFromOrganization(Organization organization)
    {
        var activities = await _context.Activities.Where(e => e.OrganizationId == organization.Id).ToListAsync();
        _context.Activities.RemoveRange(activities);
    }
}
