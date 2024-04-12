export interface BeneficiaryAttribute {
  id: number;
  name: string;
  type: string;
  usedForDeduplication: boolean;
}

export interface BeneficiaryAttributePatchPayload {
  id: number;
  usedForDeduplication: boolean;
}
