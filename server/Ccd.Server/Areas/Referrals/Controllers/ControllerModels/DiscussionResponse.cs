using System;
using System.Text.Json.Serialization;
using Ccd.Server.Users;

namespace Ccd.Server.Referrals
{
    public class DiscussionResponse
    {
        public Guid Id { get; set; }
        public Guid ReferralId { get; set; }
        [JsonIgnore] public Guid UserCreatedId { get; set; }
        public UserResponse UserCreated { get; set; }
        public string Text { get; set; }
        public bool IsBot { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}