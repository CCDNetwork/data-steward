using System;

namespace Ccd.Server.Organizations;

public class ActivityUpdateRequest : ActivityAddRequest
{
    public Guid? Id { get; set; }
}
