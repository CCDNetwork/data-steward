using System;
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
    public string DateOfBirth { get; set; }
    public string AdminLevel1 { get; set; }
    public string AdminLevel2 { get; set; }
    public string AdminLevel3 { get; set; }
    public string AdminLevel4 { get; set; }
    public string HHID { get; set; }
    public string MobilePhoneID { get; set; }
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
    public Guid OrganizationId { get; set; }
    public Organization Organization { get; set; }

}
