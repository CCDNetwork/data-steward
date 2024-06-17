using System;
using Ccd.Server.Data;
using Ccd.Server.Helpers;

namespace Ccd.Server.Referrals;

public class Discussion : UserChangeTracked
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public Guid ReferralId { get; set; }
    public Referral Referral { get; set; }
    public string Text { get; set; }
    public bool IsBot { get; set; }
}
