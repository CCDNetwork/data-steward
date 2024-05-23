using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;
using Ccd.Server.Storage;

namespace Ccd.Server.Referrals;

public class Referral : UserChangeTracked
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public string Status { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsDraft { get; set; }

    [ForeignKey("File")] public Guid? FileId { get; set; }
    public File File { get; set; }

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

    public static bool IsValid(string status)
    {
        return status == Open || status == Enrolled || status == Accepted;
    }
}