using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using System.Collections.Generic;
using System.Linq;

namespace Ccd.Server.Referrals;

[ApiController]
[Route("/api/v1/referrals")]
public class ReferralController : ControllerBaseExtended
{
    private readonly ReferralService _referralService;
    private readonly UserService _userService;
    private readonly IMapper _mapper;

    public ReferralController(ReferralService referralService, UserService userService, IMapper mapper)
    {
        _referralService = referralService;
        _userService = userService;
        _mapper = mapper;
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

    [HttpGet("{caseNumber}/case-number")]
    public async Task<ActionResult<ReferralCaseNumberResponse>> GetReferralByCaseNumber(string caseNumber)
    {
        var result = await _referralService.GetReferralByCaseNumberApi(caseNumber);
        return Ok(result);
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
        Guid id,
        [FromBody] ReferralPatchRequest model
    )
    {
        var referral = await _referralService.GetReferralById(this.OrganizationId, id) ?? throw new NotFoundException("Referral not found.");
        if (model.Status != null && !ReferralStatus.IsValid(model.Status)) throw new BadRequestException("Invalid status.");
        if (referral.IsDraft)
            model.Status = ReferralStatus.Submission;

        var updatedFieldsText = await _referralService.GetUpdatedFieldText(model, referral);
        model.Patch(referral);

        await _referralService.UpdateReferral(referral);

        var result = await _referralService.GetReferralApi(this.OrganizationId, id);

        var userUpdated = await _userService.GetUserById(this.UserId);
        await _referralService.AddDiscussionBot(id, new DiscussionAddRequest
        {
            Text = @$"
                Referral has been updated by {userUpdated.FirstName} {userUpdated.LastName}.<br>
                Changes:<br>
                {updatedFieldsText}
            ",
        });

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

    [HttpPatch("{id}/withdraw")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<ReferralResponse>> RefferalWithdraw(Guid id, [FromBody] DiscussionAddRequest model)
    {
        var referral = await _referralService.GetReferralById(this.OrganizationId, id) ?? throw new NotFoundException();

        // Since we removed the Withdrawn status and the client wants all "withdrawn" referrals to go into draft, this is the change that reflects on that
        if (referral.IsDraft)
            throw new BadRequestException("Referral is already withdrawn.");

        referral.IsDraft = true;

        await _referralService.UpdateReferral(referral);

        var result = await _referralService.GetReferralApi(this.OrganizationId, id);

        var userUpdated = await _userService.GetUserById(this.UserId);
        await _referralService.AddDiscussionBot(id, new DiscussionAddRequest
        {
            Text = @$"
                Referral has been withdrawn by {userUpdated.FirstName} {userUpdated.LastName}.<br>
                Reason: {model.Text}
            ",
        });

        return Ok(result);
    }

    [HttpPatch("{id}/reject")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<ReferralResponse>> RefferalReject(Guid id, [FromBody] DiscussionAddRequest model)
    {
        var referral = await _referralService.GetReferralById(this.OrganizationId, id) ?? throw new NotFoundException();

        // Same here, we dont have "rejected" status anymore but a new flag "isRejected" which we check for instead of that previous status
        if (referral.IsRejected)
            throw new BadRequestException("Referral is already rejected.");

        referral.IsRejected = true;

        await _referralService.UpdateReferral(referral);

        var result = await _referralService.GetReferralApi(this.OrganizationId, id);

        var userUpdated = await _userService.GetUserById(this.UserId);
        await _referralService.AddDiscussionBot(id, new DiscussionAddRequest
        {
            Text = @$"
                Referral has been rejected by {userUpdated.FirstName} {userUpdated.LastName}.<br>
                Reason: {model.Text}
            ",
        });

        return Ok(result);
    }

    [HttpGet("{id}/discussions")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<List<DiscussionResponse>>> GetDiscussions(Guid id)
    {
        var result = await _referralService.GetDiscussionsApi(id);
        return Ok(result);
    }

    [HttpPost("{id}/discussions")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<DiscussionResponse>> AddDiscussion(Guid id, [FromBody] DiscussionAddRequest model)
    {
        var newDiscussion = await _referralService.AddDiscussion(id, model);
        var result = await _referralService.GetDiscussionApi(newDiscussion.Id);

        return Ok(result);
    }

    [HttpGet("focal-point/users")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<PagedApiResponse<FocalPointUsersResponse>>> GetFocalPointUsers([FromQuery] RequestParameters requestParams, [FromQuery] string permission)
    {
        var userResponse = await _userService.GetUsersApi(this.OrganizationId, requestParams, permission);
        var data = _mapper.Map<List<UserResponse>, List<FocalPointUsersResponse>>(userResponse.Data);

        return Ok(new PagedApiResponse<FocalPointUsersResponse>
        {
            Data = data,
            Meta = userResponse.Meta,
        });
    }
}
