using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using Ccd.Server.Authentication;
using Ccd.Server.Helpers;
using Ccd.Server.Users;
using Ccd.Tests.Mocks;
using Xunit;

namespace Ccd.Tests.Users;

[Collection("Api")]
public class UserTests
{
    private readonly ApiFixture _api;

    public UserTests(ApiFixture api)
    {
        _api = api;
    }
    
    [Fact]
    public async void User_Crud_Success()
    {
        var (organization, user, headers) = await _api.CreateOrganization(role: UserRole.Admin);

        // create a new user
        var userAddData = new UserAddRequest
        {
            Email = "user_" + Guid.NewGuid() + "@e2e.com",
            FirstName = "Test",
            LastName = $"Testsson {Guid.NewGuid().ToString()[..8]}",
            Password = _api.DEFAULT_PASSWORD,
            Role = UserRole.User,
            Language = "en"
        };

        var result = await _api.Request<UserResponse>(
            "/api/v1/users",
            HttpMethod.Post,
            headers,
            userAddData,
            HttpStatusCode.Created
        );

        Assert.Equal(userAddData.Email, result.Email);
        Assert.Equal(userAddData.FirstName, result.FirstName);
        Assert.Equal(userAddData.LastName, result.LastName);
        Assert.Equal(userAddData.Language, result.Language);

        // log in created user
        await _api.ActivateUser(result.Id);

        var loginData = new UserLoginRequest
        {
            Username = userAddData.Email,
            Password = userAddData.Password
        };
        var loginResult = await _api.Request<UserAuthenticationResponse>(
            "/api/v1/authentication/login",
            HttpMethod.Post,
            null,
            loginData,
            HttpStatusCode.OK
        );

        Assert.Equal(userAddData.Email, loginResult.User.Email);
        Assert.Equal(userAddData.FirstName, loginResult.User.FirstName);
        Assert.Equal(userAddData.LastName, loginResult.User.LastName);
        Assert.Equal(userAddData.Language, loginResult.User.Language);

        // find owner and new user in all users list
        var userList = await _api.Request<PagedApiResponse<UserResponse>>(
            $"/api/v1/users?organizationId={organization.Id}",
            HttpMethod.Get,
            headers,
            null,
            HttpStatusCode.OK
        );

        Assert.Equal(2, userList.Data.Count);
        Assert.NotNull(userList.Data.FirstOrDefault(e => e.Email == user.Email));
        Assert.NotNull(userList.Data.FirstOrDefault(e => e.Email == userAddData.Email));

        // update new user with owner credentials
        var userId = loginResult.User.Id;
        var newUserHeaders = new ApiFixture.Headers
        {
            OrganizationId = organization.Id,
            Token = loginResult.Token
        };

        var userUpdateData = new UserUpdateRequest
        {
            FirstName = "Some",
            LastName = "User",
            Language = "en",
            Role = UserRole.User
        };

        await _api.Request<UserAuthenticationResponse>(
            $"/api/v1/users/{userId}",
            HttpMethod.Put,
            headers,
            userUpdateData,
            HttpStatusCode.OK
        );

        // update new user with its credentials
        userUpdateData = new UserUpdateRequest
        {
            FirstName = "Other",
            LastName = "User",
            Language = "hr"
        };

        await _api.Request<UserResponse>(
            "/api/v1/users/me",
            HttpMethod.Put,
            newUserHeaders,
            userUpdateData,
            HttpStatusCode.OK
        );

        // check user data with owner credentials
        var newUser = await _api.Request<UserResponse>(
            $"/api/v1/users/{userId}",
            HttpMethod.Get,
            headers,
            null,
            HttpStatusCode.OK
        );

        Assert.Equal(userAddData.Email, newUser.Email);
        Assert.Equal(userUpdateData.FirstName, newUser.FirstName);
        Assert.Equal(userUpdateData.LastName, newUser.LastName);
        Assert.Equal(userUpdateData.Language, newUser.Language);

        // check user data with its credentials
        newUser = await _api.Request<UserResponse>(
            "/api/v1/users/me",
            HttpMethod.Get,
            newUserHeaders,
            null,
            HttpStatusCode.OK
        );

        Assert.Equal(userAddData.Email, newUser.Email);
        Assert.Equal(userUpdateData.FirstName, newUser.FirstName);
        Assert.Equal(userUpdateData.LastName, newUser.LastName);
        Assert.Equal(userUpdateData.Language, newUser.Language);

        // change password using its credentials
        userUpdateData = new UserUpdateRequest
        {
            FirstName = "Other",
            LastName = "User",
            Password = "something",
            Language = "hr"
        };

        await _api.Request<UserAuthenticationResponse>(
            "/api/v1/users/me",
            HttpMethod.Put,
            newUserHeaders,
            userUpdateData,
            HttpStatusCode.OK
        );

        // login using old password
        await _api.Request<UserAuthenticationResponse>(
            "/api/v1/authentication/login",
            HttpMethod.Post,
            null,
            loginData,
            HttpStatusCode.Unauthorized
        );

        // login using new password
        loginData.Password = userUpdateData.Password;

        var loginResponse = await _api.Request<UserAuthenticationResponse>(
            "/api/v1/authentication/login",
            HttpMethod.Post,
            null,
            loginData,
            HttpStatusCode.OK
        );
        
        // delete user
        await _api.Request<UserResponse>(
            $"/api/v1/users/{userId}",
            HttpMethod.Delete,
            headers,
            null,
            HttpStatusCode.OK
        );

        // fail to get user by id
        await _api.Request<UserResponse>(
            $"/api/v1/users/{userId}",
            HttpMethod.Get,
            headers,
            null,
            HttpStatusCode.NotFound
        );

        // user can't log in if it isn't a member of any organizations
        await _api.Request<UserAuthenticationResponse>(
            "/api/v1/authentication/login",
            HttpMethod.Post,
            null,
            loginData,
            HttpStatusCode.Unauthorized
        );
    }


    [Fact]
    public async void User_LoginAndActivation_Success()
    {
        var (_, _, adminHeaders) = await _api.CreateOrganization(role: UserRole.Admin);

        var userAddData = new UserAddRequest
        {
            Email = $"user_{Guid.NewGuid()}@e2e.com",
            Password = _api.DEFAULT_PASSWORD,
            FirstName = $"User {Guid.NewGuid()}",
            LastName = "Lastname",
            Role = UserRole.User
        };

        var user = await _api.Request<UserResponse>("/api/v1/users", HttpMethod.Post, adminHeaders, userAddData,
            HttpStatusCode.Created);

        // try to log in unactivated user
        var loginData = new UserLoginRequest { Username = user.Email, Password = _api.DEFAULT_PASSWORD };

        await _api.Request<UserAuthenticationResponse>("/api/v1/authentication/login", HttpMethod.Post,
            null, loginData, HttpStatusCode.Unauthorized);

        // check if activation email is sent
        var lastEmail = MockNotificationService.GetLastEmailTo(user.Email);
        Assert.NotNull(lastEmail);
        var match = Regex.Match(lastEmail.Text, @"(?<=code\=)(.*?)(?="")");
        Assert.NotNull(match);
        var code = match.Value;
        Assert.NotEmpty(code);

        // activate user
        var activationData = new UserActivationRequest { ActivationCode = code, Email = user.Email };

        await _api.Request<UserResponse>("/api/v1/authentication/activation", HttpMethod.Post, null, activationData,
            HttpStatusCode.OK);

        // check if confirmation email is sent
        lastEmail = MockNotificationService.GetLastEmailTo(user.Email);
        Assert.NotNull(lastEmail);
        Assert.Contains("Welcome to Ccd!", lastEmail.Subject);

        // log in user
        await _api.Request<UserAuthenticationResponse>("/api/v1/authentication/login", HttpMethod.Post,
            null, loginData, HttpStatusCode.OK);
    }

    [Fact]
    public async void User_ForgotPassword_Success()
    {
        var (_, _, adminHeaders) = await _api.CreateOrganization(role: UserRole.Admin);
        
        var userAddData = new UserAddRequest
        {
            Email = $"user_{Guid.NewGuid()}@e2e.com",
            Password = _api.DEFAULT_PASSWORD,
            FirstName = $"User {Guid.NewGuid()}",
            LastName = "Lastname",
            Role = UserRole.User
        };

        var user = await _api.Request<UserResponse>("/api/v1/users", HttpMethod.Post, adminHeaders, userAddData,
            HttpStatusCode.Created);

        await _api.ActivateUser(user.Id);

        var data = new ForgotPasswordRequest { Email = user.Email };

        MockNotificationService.ClearEmailsTo(user.Email);

        await _api.Request<object>("/api/v1/authentication/forgot-password", HttpMethod.Post, null, data,
            HttpStatusCode.OK);

        var lastEmail = MockNotificationService.GetLastEmailTo(user.Email);

        Assert.NotNull(lastEmail);
        var match = Regex.Match(lastEmail.Text, @"(?<=code\=)(.*?)(?="")");
        Assert.NotNull(match);
        var code = match.Value;
        Assert.NotEmpty(code);

        // call password reset endpoint
        var resetData = new ResetPasswordRequest
        {
            Email = user.Email,
            Password = "somepassword",
            PasswordResetCode = code
        };

        await _api.Request<object>("/api/v1/authentication/reset-password", HttpMethod.Post, null, resetData,
            HttpStatusCode.OK);

        // log in user
        var loginData = new UserLoginRequest { Username = user.Email, Password = "somepassword" };
        await _api.Request<UserAuthenticationResponse>("/api/v1/authentication/login", HttpMethod.Post, null,
            loginData, HttpStatusCode.OK);
    }
    
    [Fact]
    public async void User_Permissions_Success()
    {
        var (organization, adminUser, adminHeaders) = await _api.CreateOrganization(role: UserRole.Admin);

        // create a new user
        var userAddData = new UserAddRequest
        {
            Email = "user_" + Guid.NewGuid() + "@e2e.com",
            FirstName = "Test",
            LastName = $"Testsson {Guid.NewGuid().ToString()[..8]}",
            Password = _api.DEFAULT_PASSWORD,
            Role = UserRole.User
        };

        var userResult = await _api.Request<UserResponse>("/api/v1/users", HttpMethod.Post,
            adminHeaders, userAddData, HttpStatusCode.Created);

        await _api.ActivateUser(userResult.Id);

        var loginData = new UserLoginRequest { Username = userAddData.Email, Password = userAddData.Password };
        var loginResult = await _api.Request<UserAuthenticationResponse>("/api/v1/authentication/login",
            HttpMethod.Post,
            null, loginData, HttpStatusCode.OK);

        var user = loginResult.User;
        var userHeaders = new ApiFixture.Headers { Token = loginResult.Token, OrganizationId = organization.Id };

        var userUpdateData = new UserUpdateRequest { FirstName = "Some", LastName = "User", Language = "en" };

        // admin can update user
        await _api.Request<UserAuthenticationResponse>($"/api/v1/users/{user.Id}", HttpMethod.Put, adminHeaders,
            userUpdateData, HttpStatusCode.OK);

        // user can update himself
        await _api.Request<UserAuthenticationResponse>($"/api/v1/users/me", HttpMethod.Put, userHeaders,
            userUpdateData, HttpStatusCode.OK);

        // user can't update admin
        await _api.Request<UserAuthenticationResponse>($"/api/v1/users/{adminUser.Id}", HttpMethod.Put, userHeaders,
            userUpdateData, HttpStatusCode.Forbidden);
    }
}
