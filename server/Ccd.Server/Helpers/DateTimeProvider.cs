using System;

namespace Ccd.Server.Helpers;

/// <summary>
/// Used for getting DateTime.UtcNow(), time is changeable for unit testing
/// </summary>
public class DateTimeProvider
{
    /// <summary>
    /// Normally this is a pass-through to DateTime.UtcNow, but it can be
    /// overridden with SetDateTime( .. ) for testing or debugging.
    /// </summary>
    private Func<DateTime> _utcNow = () => DateTime.UtcNow;

    public DateTime UtcNow
    {
        get => _utcNow();
    }

    /// <summary>
    /// Set time to return when DateTimeProvider.UtcNow() is called.
    /// </summary>
    public void SetDateTime(DateTime dateTimeUtcNow)
    {
        _utcNow = () => dateTimeUtcNow;
    }

    /// <summary>
    /// Resets DateTimeProvider.UtcNow() to return DateTime.UtcNow.
    /// </summary>
    public void ResetDateTime()
    {
        _utcNow = () => DateTime.UtcNow;
    }
}
