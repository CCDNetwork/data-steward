﻿using System;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Organizations;

namespace Ccd.Server.Templates;

public class Template : UserChangeTracked
{
    public Guid Id { get; set; } = IdProvider.NewId();
    public string Name { get; set; }
    public string FirstName { get; set; }
    public string FamilyName { get; set; }
    public string Gender { get; set; }
    public string DateofBirth { get; set; }
    public string CommunityID { get; set; }
    public string HHID { get; set; }
    public string MobilePhoneID { get; set; }
    public string GovIDType { get; set; }
    public string GovIDNumber { get; set; }
    public string OtherIDType { get; set; }
    public string OtherIDNumber { get; set; }
    public string AssistanceDetails { get; set; }
    public string Activity { get; set; }
    public string Currency { get; set; }
    public string CurrencyAmount { get; set; }
    public string StartDate { get; set; }
    public string EndDate { get; set; }
    public string Frequency { get; set; }
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }

}
