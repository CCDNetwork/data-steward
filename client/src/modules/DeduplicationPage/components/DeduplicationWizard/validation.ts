import * as z from 'zod';

export const DeduplicationUploadFormSchema = z.object({
  template: z.object(
    {
      id: z.string().min(1),
      name: z.string(),
    },
    {
      invalid_type_error: 'Template is required',
      required_error: 'Template is required',
    },
  ),
});

export type DeduplicationUploadForm = z.infer<
  typeof DeduplicationUploadFormSchema
>;
