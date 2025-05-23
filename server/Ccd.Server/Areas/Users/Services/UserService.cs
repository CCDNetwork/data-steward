﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.Data;
using Ccd.Server.Email;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;
using Dapper;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.Users;

public class UserService
{
    private readonly CcdContext _context;
    private readonly EmailManagerService _emailManagerService;
    private readonly IMapper _mapper;

    private readonly string _selectSql =
        @"
             SELECT DISTINCT ON (u.id)
                 u.*,
                 uo.role,
                 uo.permissions
             FROM
                 ""user"" u
             LEFT JOIN
                 user_organization uo ON u.id = uo.user_id and (@organizationId is null or uo.organization_id = @organizationId)
             WHERE
                 (@id is null OR u.id = @id)
                 AND (@email is null OR lower(u.email) = lower(@email))
                 AND (@organizationId is null OR uo.organization_id = @organizationId)
                 AND (@permission is null OR uo.permissions ? @permission)
                 AND (is_deleted = false)";

    private readonly SendGridService _sendGridService;

    public UserService(
        CcdContext context,
        DateTimeProvider dateTimeProvider,
        EmailManagerService emailManagerService,
        IMapper mapper,
        SendGridService sendGridService
    )
    {
        _context = context;
        _emailManagerService = emailManagerService;
        _mapper = mapper;
        _sendGridService = sendGridService;
    }

    private object getSelectSqlParams(
        Guid? id = null,
        string email = null,
        Guid? organizationId = null,
        string permission = null
    )
    {
        return new
        {
            id,
            email,
            organizationId,
            permission
        };
    }

    public async Task<User> GetUserById(Guid id)
    {
        var user = await _context
            .Database.GetDbConnection()
            .QueryFirstOrDefaultAsync<User>(_selectSql, getSelectSqlParams(id));

        return user;
    }

    public async Task<User> GetUserByEmail(string email)
    {
        var user = await _context
            .Database.GetDbConnection()
            .QueryFirstOrDefaultAsync<User>(_selectSql, getSelectSqlParams(email: email));

        return user;
    }

    public async Task<User> AddUser(
        User user,
        string unhashedUserPassword,
        Guid userOrganizationId,
        Guid adminId
    )
    {
        var existingUser = await GetUserByEmail(user.Email);

        if (existingUser != null)
            return existingUser;

        user.ActivationCode = Guid.NewGuid().ToString();

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var newUser = _context.Users.Add(user).Entity;
            await _context.SaveChangesAsync();

            var userAdministrator = await GetUserById(adminId);
            var createdUserOrganization = _context.Organizations.FirstOrDefault(o =>
                o.Id == userOrganizationId
            );

            var templateData = new Dictionary<string, string>
            {
                { "firstName", user.FirstName },
                { "lastName", user.LastName },
                { "userEmail", user.Email },
                { "userPassword", unhashedUserPassword },
                { "userOrganisationName", createdUserOrganization.Name },
                { "websiteUrl", StaticConfiguration.WebAppUrl },
                { "administratorEmail", userAdministrator.Email }
            };

            await _sendGridService.SendEmail(
                user.Email,
                StaticConfiguration.SendgridInvitationEmailTemplateId,
                templateData
            );

            // var activationLink =
            //     StaticConfiguration.WebAppUrl
            //     + $"/activation?email={WebUtility.UrlEncode(user.Email)}&code={user.ActivationCode}";

            // await _emailManagerService.SendWelcomeMail(user.Email, user.FirstName, activationLink);

            await transaction.CommitAsync();
            return newUser;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<User> UpdateUser(User user)
    {
        var newUser = _context.Users.Update(user).Entity;
        await _context.SaveChangesAsync();

        return newUser;
    }

    public async Task DeleteUser(User user)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task SetOrganizationRole(
        Guid userId,
        Guid organizationId,
        string role,
        List<string> permissions
    )
    {
        var userOrganization = await _context.UserOrganizations.FirstOrDefaultAsync(e =>
            e.UserId == userId && e.OrganizationId == organizationId
        );

        if (userOrganization == null)
        {
            userOrganization = new UserOrganization
            {
                UserId = userId,
                OrganizationId = organizationId,
                Role = role,
                Permissions = permissions
            };

            _context.UserOrganizations.Add(userOrganization);
        }
        else
        {
            userOrganization.Role = role;
            userOrganization.Permissions = permissions;
            _context.UserOrganizations.Update(userOrganization);
        }

        await _context.SaveChangesAsync();
    }

    public async Task<string> GetOrganizationRole(Guid userId, Guid organizationId)
    {
        var userOrganization = await _context.UserOrganizations.FirstOrDefaultAsync(e =>
            e.UserId == userId && e.OrganizationId == organizationId
        );

        return userOrganization?.Role;
    }

    public async Task RemoveFromOrganization(User user, Guid organizationId)
    {
        var userOrganization = await _context.UserOrganizations.FirstOrDefaultAsync(e =>
            e.UserId == user.Id && e.OrganizationId == organizationId
        );

        if (userOrganization != null)
        {
            _context.UserOrganizations.Remove(userOrganization);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<List<Organization>> GetOrganizationsForUser(Guid userId)
    {
        return await _context
            .UserOrganizations.Include(e => e.Organization)
            .Where(e => e.UserId == userId)
            .Select(e => e.Organization)
            .ToListAsync();
    }

    private async Task resolveDependencies(UserResponse user)
    {
        var userOrganizations = await GetOrganizationsForUser(user.Id);

        user.Organizations = _mapper.Map<List<OrganizationResponse>>(userOrganizations);
    }

    public async Task<UserResponse> GetUserApi(
        Guid? organizationId = null,
        Guid? id = null,
        string email = null,
        bool resolveDependenciesBool = true
    )
    {
        var selectParams =
            id == User.SYSTEM_USER.Id
                ? getSelectSqlParams(id)
                : getSelectSqlParams(id, email, organizationId);

        var user = await _context
            .Database.GetDbConnection()
            .QueryFirstOrDefaultAsync<UserResponse>(_selectSql, selectParams);

        if (user != null && resolveDependenciesBool)
            await resolveDependencies(user);

        return user;
    }

    public async Task<PagedApiResponse<UserResponse>> GetUsersApi(
        Guid? organizationId,
        RequestParameters requestParameters = null,
        string permission = null
    )
    {
        return await PagedApiResponse<UserResponse>.GetFromSql(
            _context,
            _selectSql,
            getSelectSqlParams(organizationId: organizationId, permission: permission),
            requestParameters,
            resolveDependencies
        );
    }
}
