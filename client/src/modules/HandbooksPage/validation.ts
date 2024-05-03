import * as z from 'zod';

export const HandbookFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
});

export type HandbookForm = z.infer<typeof HandbookFormSchema>;
