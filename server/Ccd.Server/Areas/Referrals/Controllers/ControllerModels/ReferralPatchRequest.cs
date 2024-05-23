﻿using System;
using Ccd.Server.Helpers;

namespace Ccd.Server.Referrals;

public class ReferralPatchRequest : PatchRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public Guid? OrganizationId { get; set; }
    public Guid? FileId { get; set; }
    public bool? IsDraft { get; set; }
}
