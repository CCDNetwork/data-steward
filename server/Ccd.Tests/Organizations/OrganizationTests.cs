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
    public async void Organization_Create_Success()
    {
        var (organization, _, headers) = await _api.CreateOrganization();

        var result = await _api.Request<OrganizationResponse>("/api/v1/organizations/me", HttpMethod.Get, headers, null, HttpStatusCode.OK);

        Assert.Equal(organization.Id, result.Id);
        Assert.Equal(organization.Name, result.Name);
    }
}
