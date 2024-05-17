import { BeneficiaryAttribute } from '../beneficiaryAttribute';

export interface AttributeGroup {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  useFuzzyMatch: boolean;
  beneficiaryAttributes: BeneficiaryAttribute[];
  organizationId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
