using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using Ccd.Server.Users;

namespace Ccd.Server.Referrals;

[ApiController]
[Route("/api/v1/referrals")]
public class ReferralController : ControllerBaseExtended
{
    private readonly ReferralService _referralService;

    public ReferralController(ReferralService referralService, IMapper mapper)
    {
        _referralService = referralService;
    }

    [HttpGet]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<PagedApiResponse<ReferralResponse>>> GetAll(
        [FromQuery] RequestParameters requestParams,
        [FromQuery] bool received = false
    )
    {
        var referrals = await _referralService.GetReferralsApi(this.OrganizationId, requestParams, received);
        return Ok(referrals);
    }

    [HttpGet("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<ReferralResponse>> GetReferral(Guid id)
    {
        var referral = await _referralService.GetReferralApi(this.OrganizationId, id);

        if (referral == null)
            throw new NotFoundException();

        return Ok(referral);
    }


    [HttpPost]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<ReferralResponse>> Add([FromBody] ReferralAddRequest model)
    {
        var newReferral = await _referralService.AddReferral(this.OrganizationId, model);
        var result = await _referralService.GetReferralApi(this.OrganizationId, newReferral.Id);

        return Ok(result);
    }

    [HttpPatch("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<ReferralResponse>> Update(
        [FromBody] ReferralPatchRequest model,
        Guid id
    )
    {
        var referral = await _referralService.GetReferralById(this.OrganizationId, id) ?? throw new NotFoundException("Referral not found.");
        if (model.Status != null && !ReferralStatus.IsValid(model.Status)) throw new BadRequestException("Invalid status.");

        model.Patch(referral);

        await _referralService.UpdateReferral(referral);

        var result = await _referralService.GetReferralApi(this.OrganizationId, id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<ReferralResponse>> Delete(Guid id)
    {
        var referral = await _referralService.GetReferralById(this.OrganizationId, id) ?? throw new NotFoundException();

        var result = await _referralService.GetReferralApi(this.OrganizationId, referral.Id);

        await _referralService.DeleteReferral(referral);

        return Ok(result);
    }
}
