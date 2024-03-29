import * as z from 'zod';

export const SignInFormSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8, {
    message: 'Password should contain at least 8 characters',
  }),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;
