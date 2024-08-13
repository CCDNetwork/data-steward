import * as z from 'zod';

import { requiredSafeHtmlString } from '@/helpers/common';

export const RulesFormSchema = z.object({
  name: requiredSafeHtmlString('Rule name is required'),
  beneficiaryAttributeIds: z.number().array().min(1, { message: 'At least one attribute is required' }),
  isActive: z.boolean(),
  useFuzzyMatch: z.boolean(),
});

export type RulesForm = z.infer<typeof RulesFormSchema>;
