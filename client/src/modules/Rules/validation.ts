import * as z from 'zod';

export const RulesFormSchema = z.object({
  name: z.string().min(1, { message: 'Rule name is required' }),
  beneficiaryAttributeIds: z.number().array().min(1, { message: 'At least one attribute is required' }),
  isActive: z.boolean(),
  useFuzzyMatch: z.boolean(),
});

export type RulesForm = z.infer<typeof RulesFormSchema>;
