import * as z from 'zod';

export const RegisterFormSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email(),
    password: z.string().min(8, {
      message: 'Password is required',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof RegisterFormSchema>;
