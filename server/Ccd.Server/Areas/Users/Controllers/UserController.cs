using System;
using System.Threading.Tasks;
using AutoMapper;
using Ccd.Server.Helpers;
using Microsoft.AspNetCore.Mvc;
using Ccd.Server.Data;
using Ccd.Server.Areas.Users.Controllers.ControllerModels;
using Microsoft.EntityFrameworkCore;

namespace Ccd.Server.Users;

[ApiController]
[Route("/api/v1/users")]
public class UserController : ControllerBaseExtended
{
    private readonly UserService _userService;
    private readonly IMapper _mapper;
    private readonly CcdContext _context;
    private readonly DateTimeProvider _dateTimeProvider;

    public UserController(
        UserService userService,
        IMapper mapper,
        CcdContext context,
        DateTimeProvider dateTimeProvider
    )
    {
        _userService = userService;
        _mapper = mapper;
        _context = context;
        _dateTimeProvider = dateTimeProvider;
    }

    [HttpGet]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<PagedApiResponse<UserResponse>>> GetAll(
        [FromQuery] RequestParameters requestParams,
        [FromQuery] Guid? organizationId
    )
    {
        var users = await _userService.GetUsersApi(organizationId, requestParams);
        return Ok(users);
    }

    [HttpGet("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<UserResponse>> GetUser(Guid id)
    {
        var user =
            await _userService.GetUserApi(null, id) ?? throw new NotFoundException();

        return Ok(user);
    }

    [HttpPost]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<UserResponse>> Add([FromBody] UserAddRequest model)
    {
        if (model.OrganizationId == Guid.Empty)
            throw new BadRequestException("OrganizationId is required.");

        var existingUser = await _userService.GetUserByEmail(model.Email);
        if (existingUser != null)
            throw new BadRequestException("User with this email already exists");

        var user = _mapper.Map<User>(model);
        user.Password = AuthenticationHelper.HashPassword(user, model.Password);
        user.ActivatedAt = _dateTimeProvider.UtcNow;

        user = await _userService.AddUser(user);
        await _userService.SetOrganizationRole(user.Id, model.OrganizationId, UserRole.User, model.Permissions);

        var result = await _userService.GetUserApi(model.OrganizationId, user.Id);

        return Created("", result);
    }

    [HttpPut("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<UserResponse>> Update(
        [FromBody] UserUpdateRequest model,
        Guid id
    )
    {
        var user = await _userService.GetUserById(id) ?? throw new NotFoundException();
        var userOrganization = await _context.UserOrganizations.FirstOrDefaultAsync(
            e => e.UserId == user.Id && e.OrganizationId == this.OrganizationId
        ) ?? throw new NotFoundException();
        userOrganization.Permissions = model.Permissions;

        _mapper.Map(model, user);

        if (model.Password != null)
        {
            user.Password = AuthenticationHelper.HashPassword(user, model.Password);
        }

        user = await _userService.UpdateUser(user);

        var result = await _userService.GetUserApi(this.OrganizationId, user.Id);

        return Ok(result);
    }

    [HttpPatch("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<UserResponse>> Patch(Guid id, [FromBody] UserPatchRequest model)
    {
        var user = await _userService.GetUserById(id) ?? throw new NotFoundException();
        model.Patch(user);

        if (model.Permissions != null)
        {
            var userTenant = await _context.UserOrganizations.FirstOrDefaultAsync(
                e => e.UserId == user.Id
            ) ?? throw new NotFoundException();
            userTenant.Permissions = model.Permissions;
            _context.UserOrganizations.Update(userTenant);
        }

        if (model.Password != null)
        {
            user.Password = AuthenticationHelper.HashPassword(user, model.Password);
        }
        user.ActivatedAt = _dateTimeProvider.UtcNow;

        var newUser = await _userService.UpdateUser(user);
        var response = await _userService.GetUserApi(id: newUser.Id);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [PermissionLevel(UserRole.Admin)]
    public async Task<ActionResult<UserResponse>> Delete(Guid id)
    {
        var user = await _userService.GetUserById(id) ?? throw new NotFoundException();

        var result = await _userService.GetUserApi(this.OrganizationId, user.Id);

        await _userService.DeleteUser(user);

        return Ok(result);
    }

    [HttpGet("me")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<UserMeResponse>> GetCurrentUser()
    {
        var result = await _userService.GetUserApi(this.OrganizationId, this.UserId);
        var user = _mapper.Map<UserMeResponse>(result);

        return Ok(user);
    }

    [HttpPut("me")]
    [PermissionLevel(UserRole.User)]
    public async Task<ActionResult<UserMeResponse>> UpdateCurrentUser(UserUpdateMeRequest model)
    {
        var user =
            await _userService.GetUserById(this.UserId)
            ?? throw new NotFoundException();

        if (model.Password != null)
        {
            user.Password = AuthenticationHelper.HashPassword(user, model.Password);
        }

        _mapper.Map(model, user);
        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return await GetCurrentUser();
    }

    [HttpGet("email")]
    public async Task<ActionResult<UserEmailResponse>> CheckUserEmail([FromQuery] string email)
    {
        var user = await _userService.GetUserByEmail(email);

        return Ok(new UserEmailResponse { Exists = user != null });
    }
}
