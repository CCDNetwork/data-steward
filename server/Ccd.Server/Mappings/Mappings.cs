using AutoMapper;
using Ccd.Server.Users;
using Ccd.Server.Organizations;

namespace Ccd.Server.Mappings;

public class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<Organization, OrganizationResponse>();
        CreateMap<Organization, OrganizationUserResponse>();
        CreateMap<OrganizationUpdateRequest, Organization>();

        CreateMap<UserAddRequest, User>();
        CreateMap<UserUpdateRequest, User>();
        CreateMap<User, UserResponse>();
        CreateMap<UserResponse, UserMeResponse>();
        CreateMap<UserResponse, UserShortResponse>();
        CreateMap<User, UserShortResponse>();
    }
}
