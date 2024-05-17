import { RulesForm } from '@/modules/Rules/validation';
import { AttributeGroup } from '@/services/attributeGroups';

export const dataToRuleFormValues = (data: AttributeGroup): RulesForm => {
  return {
    name: data.name,
    beneficiaryAttributeIds: data.beneficiaryAttributes.map((i) => i.id),
    isActive: data.isActive,
    useFuzzyMatch: data.useFuzzyMatch,
  };
};
