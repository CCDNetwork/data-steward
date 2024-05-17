using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Ccd.Server.BeneficiaryAttributes;

public class BeneficiaryAttributeGroupReorderRequest
{
    [Required] public List<GuidOrderPair> NewOrderList { get; set; }
}

public class GuidOrderPair
{
    public Guid Id { get; set; }
    public int Order { get; set; }
}
