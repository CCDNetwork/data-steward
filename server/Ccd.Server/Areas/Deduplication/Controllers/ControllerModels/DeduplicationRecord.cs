namespace Ccd.Server.Deduplication;

public class DeduplicationRecord
{
    public string TimestampOriginal { get; set; }
    public string RegistrationOrg { get; set; }
    public string RegistrationOrgId { get; set; }
    public string FamilyName { get; set; }
    public string FirstName { get; set; }
    public string Gender { get; set; }
    public string DateOfBirth { get; set; }
    public string MobilePhone { get; set; }
    public string GovIdType { get; set; }
    public string GovIdNumber { get; set; }
    public string AssistanceOrd { get; set; }
    public string AssistanceCategory { get; set; }
    public string AssistanceAmount { get; set; }
    public string AssistanceStart { get; set; }
    public string AssistanceEnd { get; set; }
}