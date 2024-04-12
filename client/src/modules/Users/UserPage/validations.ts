import * as z from 'zod';

export const UserEditFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email(),
});

export type UserEditFormData = z.infer<typeof UserEditFormSchema>;
