import * as z from 'zod';

export const AddUserModalFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email(),
});

export type AddUserModalForm = z.infer<typeof AddUserModalFormSchema>;
