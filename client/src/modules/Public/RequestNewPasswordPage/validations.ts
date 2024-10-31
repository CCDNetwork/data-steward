import * as z from 'zod';

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordFormSchema>;
