using System;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Ccd.Server.Deduplication;

public class Beneficionary
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public string FirstName { get; set; }
    public string FamilyName { get; set; }
    public string Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string CommunityId { get; set; }
    public string HhId { get; set; }
    public int? MobilePhoneId { get; set; }
    public string GovIdType { get; set; }
    public string GovIdNumber { get; set; }
    public string OtherIdType { get; set; }
    public string OtherIdNumber { get; set; }
    public string AssistanceDetails { get; set; }
    public string Activity { get; set; }
    public string Currency { get; set; }
    public int CurrencyAmount { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Frequency { get; set; }
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }
    public Guid ListId { get; set; }
    public List List { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
