using System;
using System.Text.Json.Serialization;
using Ccd.Server.Helpers;
using Ccd.Server.Users;

namespace Ccd.Server.Templates;

public class TemplateResponse
{
    public Guid Id { get; set; }
    [QuickSearchable]
    public string Name { get; set; }
    public string FirstName { get; set; }
    public string FamilyName { get; set; }
    public string Gender { get; set; }
    public string DateofBirth { get; set; }
    public string AdminLevel1 { get; set; }
    public string AdminLevel2 { get; set; }
    public string AdminLevel3 { get; set; }
    public string AdminLevel4 { get; set; }
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

    [JsonIgnore]
    public Guid UserCreatedId { get; set; }
    public UserResponse UserCreated { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
