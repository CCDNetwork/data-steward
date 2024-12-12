using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.Deduplication;

public class LmmsDeduplicationRequest
{
    [Required] public LmmsDeduplicationUserRequest User { get; set; }
    [Required, MinLength(1)] public LmmsDeduplicationBeneficiaryRequest[] BeneficiaryData { get; set; }
}

public class LmmsDeduplicationUserRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    [Required, EmailAddress] public string Email { get; set; }
}

public class LmmsDeduplicationBeneficiaryRequest
{
    [Required] public string FirstName { get; set; }
    [Required] public string LastName { get; set; }
    [Required] public string TaxId { get; set; }
}
