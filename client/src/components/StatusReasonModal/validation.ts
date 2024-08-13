import * as z from 'zod';

import { requiredSafeHtmlString } from '@/helpers/common';

export const StatusReasonModalFormSchema = z.object({
  text: requiredSafeHtmlString('Reason is required'),
});

export type StatusReasonModalForm = z.infer<typeof StatusReasonModalFormSchema>;
