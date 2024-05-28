using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;

namespace Ccd.Server.Referrals;

public class Referral : UserChangeTracked
{
    public Guid Id { get; set; } = IdProvider.NewId();

    // FROM EXCEL
    public string FocalPoint { get; set; }
    public bool Consent { get; set; }
    public string FamilyName { get; set; }
    public string FirstName { get; set; }
    public string MethodOfContact { get; set; }
    public string ContactDetails { get; set; }
    public string Oblast { get; set; }
    public string Raion { get; set; }
    public string Hromada { get; set; }
    public string Settlement { get; set; }
    public string Note { get; set; }

    // OTHER
    public string Status { get; set; }
    public bool IsDraft { get; set; }
    [Column(TypeName = "jsonb")] public List<Guid> FileIds { get; set; }
    [ForeignKey("Organization"), Required] public Guid OrganizationCreatedId { get; set; }
    public Organization OrganizationCreated { get; set; }
    [ForeignKey("Organization"), Required] public Guid OrganizationReferredToId { get; set; }
    public Organization OrganizationReferredTo { get; set; }
}

public class ReferralStatus
{
    public const string Open = "open";
    public const string Enrolled = "enrolled";
    public const string Accepted = "accepted";
    public const string Cancelled = "cancelled";
    public const string Rejected = "rejected";

    public static bool IsValid(string status)
    {
        return status == Open || status == Enrolled || status == Accepted || status == Cancelled || status == Rejected;
    }
}