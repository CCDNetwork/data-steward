import * as z from 'zod';

import { requiredSafeHtmlString } from '@/helpers/common';

export const HandbookFormSchema = z.object({
  title: requiredSafeHtmlString('Title is required'),
  content: z.string().min(1, { message: 'Content is required' }),
});

export type HandbookForm = z.infer<typeof HandbookFormSchema>;
