using System;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using Ccd.Server.Authentication;
using Ccd.Server.Storage;
using Ccd.Server.Organizations;
using Ccd.Tests.Mocks;
using Xunit;

namespace Ccd.Tests.Organizations;

[Collection("Api")]
public class OrganizationTests
{
    private readonly ApiFixture _api;

    public OrganizationTests(ApiFixture api)
    {
        _api = api;
    }

    [Fact]
    public async void Organization_Crud_Success()
    {
        var (organization, _, headers) = await _api.CreateOrganization();

        var result = await _api.Request<OrganizationResponse>("/api/v1/organizations/me", HttpMethod.Get, headers, null, HttpStatusCode.OK);

        Assert.Equal(organization.Id, result.Id);
        Assert.Equal(organization.Name, result.Name);
        
        // update organization
        var organizationUpdateData = new OrganizationUpdateRequest
        {
            Name = "Some other name",
        };

        result = await _api.Request<OrganizationResponse>("/api/v1/organizations/me", HttpMethod.Put, headers, organizationUpdateData, HttpStatusCode.OK);

        Assert.Equal(organization.Id, result.Id);
        Assert.Equal(organizationUpdateData.Name, result.Name);
    }

    [Fact]
    public async void Organization_Registration_Success()
    {
        var email = $"organizationemail_{Guid.NewGuid()}@e2e.com";

        MockNotificationService.ClearEmailsTo(email);

        var (organization, user, _) = await _api.CreateOrganization(email: email);
        Assert.NotNull(organization);
        Assert.NotNull(user);

        // check if activation email is sent
        var lastEmail = MockNotificationService.GetLastEmailTo(email);
        Assert.NotNull(lastEmail);
        var match = Regex.Match(lastEmail.Text, @"(?<=code\=)(.*?)(?="")");
        Assert.NotNull(match);
        var code = match.Value;
        Assert.NotEmpty(code);

        // try to log in
        var data = new UserLoginRequest { Username = user.Email, Password = _api.DEFAULT_PASSWORD };

        var result = await _api.Request<UserAuthenticationResponse>("/api/v1/authentication/login",
            HttpMethod.Post, null, data, HttpStatusCode.OK);
        Assert.Equal(result.User.Email, user.Email);
    }
}
