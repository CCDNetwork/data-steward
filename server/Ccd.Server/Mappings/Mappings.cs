using System;
using AutoMapper;
using Ccd.Server.Users;
using Ccd.Server.Organizations;
using Ccd.Server.BeneficiaryAttributes;
using Ccd.Server.Deduplication;
using System.Globalization;
using Ccd.Server.Referrals;
using Ccd.Server.Templates;
using Ccd.Server.Handbooks;
using Ccd.Server.Beneficiaries;

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
        CreateMap<UserUpdateMeRequest, User>();
        CreateMap<User, UserResponse>();
        CreateMap<UserResponse, UserMeResponse>();
        CreateMap<UserResponse, UserShortResponse>();
        CreateMap<User, UserShortResponse>();

        // BeneficiaryAttribute mappings
        CreateMap<BeneficiaryAttribute, BeneficiaryAttributeResponse>();
        CreateMap<DeduplicationRecord, Beneficary>();
        CreateMap<DeduplicationRecord, BeneficaryDeduplication>();
        CreateMap<BeneficaryDeduplication, Beneficary>();

        // BeneficiaryGroupAttribute mappings
        CreateMap<BeneficiaryAttributeGroup, BeneficiaryAttributeGroupResponse>();
        CreateMap<BeneficiaryAttributeGroupCreateRequest, BeneficiaryAttributeGroup>();

        // Referral mappings
        CreateMap<Referral, ReferralResponse>();
        CreateMap<Referral, ReferralCaseNumberResponse>();
        CreateMap<ReferralAddRequest, Referral>();
        CreateMap<ReferralPatchRequest, Referral>();
        CreateMap<Discussion, DiscussionResponse>();
        CreateMap<DiscussionAddRequest, Discussion>();
        CreateMap<UserResponse, FocalPointUsersResponse>();

        // Handbook
        CreateMap<Handbook, HandbookResponse>();
        CreateMap<HandbookAddRequest, Handbook>();
        CreateMap<HandbookUpdateRequest, Handbook>();

        // Template mappings
        CreateMap<Template, TemplateResponse>();
        CreateMap<TemplateAddRequest, Template>();

        // Beneficiary mappings
        CreateMap<Beneficary, BeneficaryResponse>();
    }

    private static DateTime? ParseDate(string date)
    {
        if (string.IsNullOrEmpty(date))
        {
            return null;
        }

        var formats = new[] {
            "MM-dd-yyyy",
            "yyyyMMdd",
            "MM/dd/yyyy",
            "MM/dd/yyyy hh:mm:ss",
            "dd/MM/yyyy",
            "MM.dd.yyyy",
            "dd.MM.yyyy. hh:mm:ss",
            "dd/M/yyyy hh:mm:ss tt",
            "d/M/yyyy hh:mm:ss tt",
            "M/d/yyyy hh:mm:ss tt",
        };

        if (DateTime.TryParseExact(date, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result))
        {
            return result.ToUniversalTime();
        }

        Console.WriteLine($"Invalid date format: {date}");
        return null;
    }
}
