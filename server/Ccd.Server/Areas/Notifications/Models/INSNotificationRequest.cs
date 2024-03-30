using System.Collections.Generic;

namespace Ccd.Server.Notifications;

public class INSNotificationRequest
{
    public string Type { get; set; }
    public string From { get; set; }
    public string To { get; set; }
    public string Subject { get; set; }
    public string Message { get; set; }
    public string UserToken { get; set; }
    public string Title { get; set; }
    public string UserId { get; set; }
    public string Url { get; set; }
    public Dictionary<string, string> AdditionalData { get; set; }
    public List<string> PhoneNumbers { get; set; }
    public INSNotificationSettings Settings { get; set; }
    public Dictionary<string, string> FilesBase64 { get; set; }
}
