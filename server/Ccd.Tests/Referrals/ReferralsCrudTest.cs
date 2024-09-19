using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using Ccd.Server.Helpers;
using Ccd.Server.Referrals;
using Ccd.Server.Users;
using Xunit;

namespace Ccd.Tests.Referrals;

[Collection("Api")]
public class ReferralsCrudTest
{
    private readonly ApiFixture _api;

    public ReferralsCrudTest(ApiFixture api)
    {
        _api = api;
    }

    [Fact]
    public async void Referrals_Crud_Success()
    {
        var (organization, user, headers) = await _api.CreateOrganization(role: UserRole.Admin);

        var admin1 = await _api.AddAdministrativeRegion(1, "Region" + Guid.NewGuid(), null);
        var admin2 = await _api.AddAdministrativeRegion(2, "Region" + Guid.NewGuid(), admin1.Id);
        var admin3 = await _api.AddAdministrativeRegion(3, "Region" + Guid.NewGuid(), admin2.Id);
        var admin4 = await _api.AddAdministrativeRegion(4, "Region" + Guid.NewGuid(), admin3.Id);

        var referralAddRequest = new ReferralAddRequest
        {
            OrganizationReferredToId = organization.Id,
            FirstName = $"John {Guid.NewGuid()}",
            PatronymicName = "Smith",
            Surname = "Doe",
            Gender = "male",
            Required = "Required explanation",
            AdministrativeRegion1Id = admin1.Id,
            AdministrativeRegion2Id = admin2.Id,
            AdministrativeRegion3Id = admin3.Id,
            AdministrativeRegion4Id = admin4.Id
        };

        var response = await _api.Request<ReferralResponse>(
            "api/v1/referrals",
            HttpMethod.Post,
            headers,
            referralAddRequest,
            HttpStatusCode.OK
        );

        Assert.Equal(referralAddRequest.OrganizationReferredToId, response.OrganizationReferredToId);
        Assert.Equal(referralAddRequest.FirstName, response.FirstName);
        Assert.Equal(referralAddRequest.PatronymicName, response.PatronymicName);
        Assert.Equal(referralAddRequest.Surname, response.Surname);
        Assert.Equal(referralAddRequest.Gender, response.Gender);
        Assert.Equal(referralAddRequest.Required, response.Required);

        Assert.Equal(admin1.Id, response.AdministrativeRegion1.Id);
        Assert.Equal(admin1.Name, response.AdministrativeRegion1.Name);
        Assert.Equal(admin2.Id, response.AdministrativeRegion2.Id);
        Assert.Equal(admin2.Name, response.AdministrativeRegion2.Name);
        Assert.Equal(admin3.Id, response.AdministrativeRegion3.Id);
        Assert.Equal(admin3.Name, response.AdministrativeRegion3.Name);
        Assert.Equal(admin4.Id, response.AdministrativeRegion4.Id);
        Assert.Equal(admin4.Name, response.AdministrativeRegion4.Name);

        //get referral:
        var referral = await _api.Request<ReferralResponse>(
            $"api/v1/referrals/{response.Id}",
            HttpMethod.Get,
            headers,
            null,
            HttpStatusCode.OK
        );

        Assert.Equal(referralAddRequest.OrganizationReferredToId, response.OrganizationReferredToId);
        Assert.Equal(referralAddRequest.FirstName, response.FirstName);
        Assert.Equal(referralAddRequest.PatronymicName, response.PatronymicName);
        Assert.Equal(referralAddRequest.Surname, response.Surname);
        Assert.Equal(referralAddRequest.Gender, response.Gender);
        Assert.Equal(referralAddRequest.Required, response.Required);

        //get referrals list:
        var referrals = await _api.Request<PagedApiResponse<ReferralResponse>>(
            "api/v1/referrals?pageSize=999999",
            HttpMethod.Get,
            headers,
            null,
            HttpStatusCode.OK
        );

        Assert.NotEmpty(referrals.Data);
        Assert.NotNull(referrals.Data.FirstOrDefault(e => e.Id == response.Id));
        Assert.Equal(referralAddRequest.OrganizationReferredToId,
            referrals.Data.First(e => e.Id == response.Id).OrganizationReferredToId);
        Assert.Equal(referralAddRequest.FirstName, referrals.Data.First(e => e.Id == response.Id).FirstName);
        Assert.Equal(referralAddRequest.PatronymicName, referrals.Data.First(e => e.Id == response.Id).PatronymicName);
        Assert.Equal(referralAddRequest.Surname, referrals.Data.First(e => e.Id == response.Id).Surname);
        Assert.Equal(referralAddRequest.Gender, referrals.Data.First(e => e.Id == response.Id).Gender);
        Assert.Equal(referralAddRequest.Required, referrals.Data.First(e => e.Id == response.Id).Required);

        //patch referral:
        var admin1Patch = await _api.AddAdministrativeRegion(1, "Region" + Guid.NewGuid(), null);
        var admin2Patch = await _api.AddAdministrativeRegion(2, "Region" + Guid.NewGuid(), admin1Patch.Id);
        var admin3Patch = await _api.AddAdministrativeRegion(3, "Region" + Guid.NewGuid(), admin2Patch.Id);
        var admin4Patch = await _api.AddAdministrativeRegion(4, "Region" + Guid.NewGuid(), admin3Patch.Id);

        var referralPatchRequest = new ReferralPatchRequest
        {
            PatronymicName = "Markson",
            AdministrativeRegion1Id = admin1Patch.Id,
            AdministrativeRegion2Id = admin2Patch.Id,
            AdministrativeRegion3Id = admin3Patch.Id,
            AdministrativeRegion4Id = admin4Patch.Id
        };

        var referralPatched = await _api.Request<ReferralResponse>(
            $"api/v1/referrals/{response.Id}",
            HttpMethod.Patch,
            headers,
            referralPatchRequest,
            HttpStatusCode.OK
        );

        Assert.Equal(referralPatchRequest.PatronymicName, referralPatched.PatronymicName);

        //delete referral:
        await _api.Request<ReferralResponse>(
            $"api/v1/referrals/{response.Id}",
            HttpMethod.Delete,
            headers,
            null,
            HttpStatusCode.OK
        );

        await _api.Request<ReferralResponse>(
            $"api/v1/referrals/{response.Id}",
            HttpMethod.Get,
            headers,
            null,
            HttpStatusCode.NotFound
        );
    }
}