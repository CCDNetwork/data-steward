import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageContainer } from '@/components/PageContainer';
import { useIdFromParams } from '@/helpers/common';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useHandbook, useHandbookMutation } from '@/services/handbooks/api';
import { MarkdownEditor } from '@/components/MarkdownEditor';

import { dataToHandbookForm } from './form-transformation';
import { HandbookForm, HandbookFormSchema } from '../validation';
import { defaultHandbookFormValues } from '../const';

export const HandbookPage = () => {
  const { id: handbookId } = useIdFromParams();

  const { data: handbookData, isLoading: queryLoading } = useHandbook({ id: handbookId, isCreate: false });
  const { editHandbook } = useHandbookMutation();

  const form = useForm<HandbookForm>({
    defaultValues: defaultHandbookFormValues,
    resolver: zodResolver(HandbookFormSchema),
  });

  const { control, formState, handleSubmit, reset } = form;

  useEffect(() => {
    if (handbookData) {
      reset(dataToHandbookForm(handbookData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handbookData]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await editHandbook.mutateAsync({ data: values, handbookId });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Handbook successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Error updating handbook.',
      });
    }
  });

  return (
    <PageContainer
      pageTitle="Handbook Edit/Preview"
      pageSubtitle="Handbook details"
      containerClassName="p-6"
      headerClassName="pb-6"
      isLoading={queryLoading}
      withBackButton
      headerNode={
        <Button
          type="submit"
          onClick={onSubmit}
          isLoading={editHandbook.isLoading}
          disabled={formState.isSubmitting || editHandbook.isLoading || !formState.isDirty}
        >
          Save
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem className="pb-4 max-w-[400px]">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input id="title" placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pb-10">
            <MarkdownEditor
              label="Content"
              name="content"
              control={control}
              textareaProps={{ className: 'focus:border-0' }}
              height={700}
            />
          </div>
        </form>
      </Form>
    </PageContainer>
  );
};
