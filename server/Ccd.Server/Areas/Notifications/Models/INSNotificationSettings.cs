namespace Ccd.Server.Notifications;

public class INSNotificationSettings
{
    public string EmailProvider { get; set; }
    public string SendgridApiKey { get; set; }
    public string SendgridSenderEmail { get; set; }
    public string MailgunApiKey { get; set; }
    public string MailgunBaseUrl { get; set; }
    public string MailgunDomain { get; set; }
    public string MailgunSenderEmail { get; set; }
    public string PushProvider { get; set; }
    public string OnesignalAppId { get; set; }
    public string OnesignalAppKey { get; set; }
}
