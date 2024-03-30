using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ccd.Server.Data;
using Ccd.Server.Helpers;
using Ccd.Server.Notifications;

namespace Ccd.Tests.Mocks;

public class MockNotificationService : INotificationService
{
    private readonly CcdContext _context;
    private readonly DateTimeProvider _dateTimeProvider;
    private readonly IServiceProvider _serviceProvider;

    public MockNotificationService(CcdContext context, DateTimeProvider dateTimeProvider,
        IServiceProvider serviceProvider)
    {
        _context = context;
        _dateTimeProvider = dateTimeProvider;
        _serviceProvider = serviceProvider;
    }

    public static List<MockEmail> Emails = new();
    public static List<MockInternalNotification> InternalNotifications = new();
    public static List<MockPushNotification> PushNotifications = new();

    public class MockEmail
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
        public string From { get; set; }
        public Dictionary<string, string> FilesBase64 { get; set; }
    }

    public class MockInternalNotification
    {
        public string To { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string From { get; set; }
    }

    public class MockPushNotification
    {
        public string UserToken { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string LaunchUrl { get; set; }
        public CustomContent Content { get; set; }
    }

    public static MockEmail GetLastEmailTo(string emailAddress)
    {
        return Emails.LastOrDefault(e => e.To == emailAddress);
    }

    public static void ClearEmailsTo(string emailAddress)
    {
        Emails.RemoveAll(e => e.To == emailAddress);
    }

    public Task SendEmail(
        string to,
        string subject,
        string message,
        Dictionary<string, string> filesBase64 = null
    )
    {
        if (string.IsNullOrEmpty(to))
            return Task.CompletedTask;

        Emails.Add(
            new MockEmail
            {
                To = to,
                Subject = subject,
                Text = message,
                From = StaticConfiguration.EmailSender,
                FilesBase64 = filesBase64
            }
        );

        return Task.CompletedTask;
    }
}
