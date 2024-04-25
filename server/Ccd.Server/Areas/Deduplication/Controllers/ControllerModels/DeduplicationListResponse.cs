using System;
using System.Text.Json.Serialization;
using Ccd.Server.Helpers;
using Ccd.Server.Users;

namespace Ccd.Server.Deduplication.Controllers.ControllerModels;

public class DeduplicationListResponse
{
    public Guid Id { get; set; }
    [QuickSearchable]
    public string FileName { get; set; }
    public int Duplicates { get; set; }

    [JsonIgnore]
    public Guid? UserCreatedId { get; set; }
    public UserResponse UserCreated { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
