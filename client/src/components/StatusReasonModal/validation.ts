import * as z from 'zod';

export const StatusReasonModalFormSchema = z.object({
  text: z.string().min(1, { message: 'Reason is required' }),
});

export type StatusReasonModalForm = z.infer<typeof StatusReasonModalFormSchema>;
