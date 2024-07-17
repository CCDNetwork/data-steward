using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Ccd.Server.Deduplication;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;

namespace Ccd.Server.Beneficiaries;

public class Beneficary
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public string FirstName { get; set; }
    public string FamilyName { get; set; }
    public string Gender { get; set; }
    public string DateOfBirth { get; set; }
    public string CommunityId { get; set; }
    public string HhId { get; set; }
    public string MobilePhoneId { get; set; }
    public string GovIdType { get; set; }
    public string GovIdNumber { get; set; }
    public string OtherIdType { get; set; }
    public string OtherIdNumber { get; set; }
    public string AssistanceDetails { get; set; }
    public string Activity { get; set; }
    public string Currency { get; set; }
    public string CurrencyAmount { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
    public string Frequency { get; set; }
    public bool IsPrimary { get; set; }
    [Column(TypeName = "jsonb")] public List<string> MatchedFields { get; set; }
    [Column(TypeName = "jsonb")] public List<Guid> DuplicateOfIds { get; set; }
    public string Status { get; set; }
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }
    public Guid ListId { get; set; }
    public List List { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class BeneficaryStatus
{
    public const string NotDuplicate = "notDuplicate";
    public const string AcceptedDuplicate = "acceptedDuplicate";
    public const string RejectedDuplicate = "rejectedDuplicate";

    public static bool IsValid(string status)
    {
        return status == NotDuplicate || status == AcceptedDuplicate || status == RejectedDuplicate;
    }
}
