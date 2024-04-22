using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;

namespace Ccd.Server.Referrals;

public class Referral : UserChangeTracked
{
    public Guid Id { get; set; } = IdProvider.NewId();

    public string FirstName { get; set; }

    public string LastName { get; set; }

    [ForeignKey("Organization"), Required]
    public Guid OrganizationCreatedId { get; set; }
    public Organization OrganizationCreated { get; set; }

    [ForeignKey("Organization"), Required]
    public Guid OrganizationReferredToId { get; set; }
    public Organization OrganizationReferredTo { get; set; }

    public string Status { get; set; }
    public DateTime DateOfBirth { get; set; }
}

public class ReferralStatus
{
    public const string Pending = "pending";
    public const string Accepted = "accepted";

    public static bool IsValid(string status)
    {
        return status == Pending || status == Accepted;
    }
}