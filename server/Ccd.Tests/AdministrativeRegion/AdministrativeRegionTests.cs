using System;
using System.Net;
using System.Net.Http;
using Ccd.Server.AdministrativeRegions;
using Ccd.Server.Helpers;
using Xunit;

namespace Ccd.Tests.AdministrativeRegion;

[Collection("Api")]
public class AdministrativeRegionTests
{
    private readonly ApiFixture _api;

    public AdministrativeRegionTests(ApiFixture api)
    {
        _api = api;
    }

    [Fact]
    public async void AdministrativeRegions_CRUD_Success()
    {
        var (organization, _, headers) = await _api.CreateOrganization();

        var admin1 = await _api.AddAdministrativeRegion(1, "Region" + Guid.NewGuid(), null);
        var admin2 = await _api.AddAdministrativeRegion(2, "Region" + Guid.NewGuid(), admin1.Id);
        var admin3 = await _api.AddAdministrativeRegion(3, "Region" + Guid.NewGuid(), admin2.Id);
        var admin4 = await _api.AddAdministrativeRegion(4, "Region" + Guid.NewGuid(), admin3.Id);

        // any user can get administrative regions by id
        var result =
            await _api.Request<PagedApiResponse<AdministrativeRegionResponse>>(
                $"/api/v1/admin-regions?level=1&filter=id={admin1.Id}",
                HttpMethod.Get,
                headers,
                null,
                HttpStatusCode.OK);


        Assert.NotNull(result);
        Assert.NotEmpty(result.Data);
        Assert.Equal(admin1.Id, result.Data[0].Id);
        Assert.Equal(admin1.Name, result.Data[0].Name);
        Assert.Equal(admin1.ParentId, result.Data[0].ParentId);

        // any user can get administrative regions by parent id
        var result3 =
            await _api.Request<PagedApiResponse<AdministrativeRegionResponse>>(
                $"/api/v1/admin-regions?level=3&filter=parentId={admin2.Id}",
                HttpMethod.Get,
                headers,
                null,
                HttpStatusCode.OK);


        Assert.NotNull(result3);
        Assert.NotEmpty(result3.Data);
        Assert.Equal(admin3.Id, result3.Data[0].Id);
        Assert.Equal(admin3.Name, result3.Data[0].Name);
        Assert.Equal(admin3.ParentId, result3.Data[0].ParentId);

        // any user can get administrative regions by name
        var result2 =
            await _api.Request<PagedApiResponse<AdministrativeRegionResponse>>(
                $"/api/v1/admin-regions?level=2&filter=name[like]={admin2.Name}",
                HttpMethod.Get,
                headers,
                null,
                HttpStatusCode.OK);


        Assert.NotNull(result2);
        Assert.NotEmpty(result2.Data);
        Assert.Equal(admin2.Id, result2.Data[0].Id);
        Assert.Equal(admin2.Name, result2.Data[0].Name);
        Assert.Equal(admin2.ParentId, result2.Data[0].ParentId);

        // get administrative region by id
        var result4 =
            await _api.Request<AdministrativeRegionResponse>(
                $"/api/v1/admin-regions/{admin1.Id}",
                HttpMethod.Get,
                headers,
                null,
                HttpStatusCode.OK);

        Assert.NotNull(result4);
        Assert.Equal(admin1.Id, result4.Id);
    }
}