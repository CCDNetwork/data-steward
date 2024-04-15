using System;
using System.Text.Json.Serialization;
using Ccd.Server.Users;

namespace Ccd.Server.Deduplication.Controllers.ControllerModels;

public class DeduplicationListResponse
{
    public Guid Id { get; set; }
    public string FileName { get; set; }

    [JsonIgnore]
    public Guid? UserCreatedId { get; set; }
    public UserResponse UserCreated { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
