using System;
using AutoMapper;
using Ccd.Server.Users;
using Ccd.Server.Organizations;
using Ccd.Server.BeneficiaryAttributes;
using Ccd.Server.Deduplication;
using System.Globalization;
using Ccd.Server.Referrals;
using Ccd.Server.Templates;

namespace Ccd.Server.Mappings;

public class Mappings : Profile
{
    public Mappings()
    {
        // Organization mappings
        CreateMap<Organization, OrganizationResponse>();
        CreateMap<Organization, OrganizationUserResponse>();
        CreateMap<OrganizationUpdateRequest, Organization>();
        CreateMap<OrganizationAddRequest, Organization>();

        // User mappings
        CreateMap<UserAddRequest, User>();
        CreateMap<UserUpdateRequest, User>();
        CreateMap<User, UserResponse>();
        CreateMap<UserResponse, UserMeResponse>();
        CreateMap<UserResponse, UserShortResponse>();
        CreateMap<User, UserShortResponse>();

        // BeneficiaryAttribute mappings
        CreateMap<BeneficiaryAttribute, BeneficiaryAttributeResponse>();
        CreateMap<DeduplicationRecord, Beneficionary>()
            .ForMember(
                dest => dest.DateOfBirth,
                opt => opt.MapFrom(src => ParseDate(src.DateofBirth))
            );

        // Referral mappings
        CreateMap<Referral, ReferralResponse>();
        CreateMap<ReferralAddRequest, Referral>().ForMember(
            dest => dest.OrganizationReferredToId,
            opt => opt.MapFrom(src => src.OrganizationId)
        );
        CreateMap<ReferralPatchRequest, Referral>().ForMember(
            dest => dest.OrganizationReferredToId,
            opt => opt.MapFrom(src => src.OrganizationId)
        );

        // Template mappings
        CreateMap<Template, TemplateResponse>();
        CreateMap<TemplateAddRequest, Template>();
    }

    private static DateTime ParseDate(string date)
    {
        if (DateTime.TryParseExact(date, "MM-dd-yyyy", null, DateTimeStyles.None, out var result))
        {
            return result.ToUniversalTime();
        }

        if (DateTime.TryParseExact(date, "yyyyMMdd", null, DateTimeStyles.None, out result))
        {
            return result.ToUniversalTime();
        }

        if (DateTime.TryParseExact(date, "MM/dd/yyyy", null, DateTimeStyles.None, out result))
        {
            return result.ToUniversalTime();
        }

        if (DateTime.TryParseExact(date, "MM.dd.yyyy", null, DateTimeStyles.None, out result))
        {
            return result.ToUniversalTime();
        }

        throw new Exception("Invalid date format");
    }
}
