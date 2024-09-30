using Ccd.Server.Storage;

namespace Ccd.Server.Referrals;

public class BatchCreateResponse
{
    public FileShortResponse File { get; set; }
    public bool MissingRequiredFields { get; set; }
}