import * as z from 'zod';

export const SignInFormSchema = z.object({
  username: z
    .string()
    .refine(
      (val) =>
        val === 'superadmin' || z.string().email().safeParse(val).success,
      {
        message: 'Invalid email address',
      }
    ),
  password: z.string().min(8, {
    message: 'Password should contain at least 8 characters',
  }),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;
