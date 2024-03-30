using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Data;
using Ccd.Server.Organizations;
using Ccd.Server.Users;

namespace Ccd.Server.Helpers;

public class ControllerBaseExtended : ControllerBase
{
    protected Guid OrganizationId
    {
        get => getOrganizationId();
    }
    protected Guid? OrganizationIdOrNull
    {
        get => getOrganizationIdOrNull();
    }
    protected Organization Organization
    {
        get => this.getCcdServerContext().Organizations.FirstOrDefault(e => e.Id == this.OrganizationId);
    }

    protected Guid UserId
    {
        get => getUserId();
    }
    protected bool IsSuperAdmin
    {
        get => getIsSuperAdmin();
    }
    protected Guid MemberId
    {
        get => getCurrentMemberId();
    }
    protected bool IsUser
    {
        get => getIsUser();
    }

    protected bool IsAdmin
    {
        get => getIsAdmin();
    }

    private Guid? getOrganizationIdOrNull()
    {
        return (Guid?)this.HttpContext.Items["OrganizationId"];
    }

    private Guid getOrganizationId()
    {
        var organizationId = this.getOrganizationIdOrNull();
        if (organizationId == null)
            throw new UnauthorizedException("Organization ID not found.");
        return organizationId.Value;
    }

    private bool getIsAdmin()
    {
        var organizationId = this.getOrganizationIdOrNull();

        if (organizationId == null)
            throw new UnauthorizedException("Organization ID not found.");

        var organizationRoles = (string)this.HttpContext.Items["OrganizationRoles"];

        var role = PermissionLevelAttribute.getOrganizationRole(organizationRoles, organizationId);

        return role == UserRole.Admin;
    }

    private CcdContext getCcdServerContext()
    {
        return (CcdContext)this.HttpContext.RequestServices.GetService(typeof(CcdContext));
    }

    private Guid getUserId()
    {
        var userId = (Guid?)this.HttpContext.Items["UserId"];
        if (userId == null)
            throw new UnauthorizedException("User ID not found.");
        return userId.Value;
    }

    private bool getIsSuperAdmin()
    {
        return (bool)this.HttpContext.Items["IsSuperAdmin"];
    }

    private Guid getCurrentMemberId()
    {
        var memberId = (Guid?)this.HttpContext.Items["MemberId"];
        if (memberId == null)
            throw new UnauthorizedException("Member ID not found.");
        return memberId.Value;
    }

    private bool getIsUser()
    {
        return this.HttpContext.Items["UserId"] != null;
    }
}
