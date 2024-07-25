using System;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Referrals
{
    public class DiscussionAddRequest
    {
        [Required] public string Text { get; set; }
    }
}