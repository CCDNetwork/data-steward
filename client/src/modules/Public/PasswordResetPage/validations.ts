import * as z from 'zod';

export const PasswordResetFormSchema = z
  .object({
    email: z.string().email(),
    passwordResetCode: z.string().min(1),
    password: z.string().min(8, {
      message: 'Password is required',
    }),
    passwordConfirmation: z.string().min(8, {
      message: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  });

export type PasswordResetForm = z.infer<typeof PasswordResetFormSchema>;
