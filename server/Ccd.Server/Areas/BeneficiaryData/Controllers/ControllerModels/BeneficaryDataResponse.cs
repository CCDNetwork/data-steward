using System;

namespace Ccd.Server.BeneficiaryData;

public class BeneficaryDataResponse
{
    public string FirstName { get; set; }
    public string PatronymicName { get; set; }
    public string Surname { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string Gender { get; set; }
    public string TaxId { get; set; }
    public string Address { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
}