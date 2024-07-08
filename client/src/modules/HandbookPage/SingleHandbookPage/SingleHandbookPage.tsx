import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageContainer } from '@/components/PageContainer';
import { useIdFromParams } from '@/helpers/common';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useHandbook, useHandbookMutation } from '@/services/handbooks/api';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Card, CardContent } from '@/components/ui/card';
import { APP_ROUTE } from '@/helpers/constants';

import { dataToHandbookForm } from './form-transformation';
import { HandbookForm, HandbookFormSchema } from '../validation';
import { defaultHandbookFormValues } from '../const';

export const SingleHandbookPage = () => {
  const navigate = useNavigate();
  const { id: handbookId, isCreate } = useIdFromParams();

  const { data: handbookData, isLoading: queryLoading } = useHandbook({ id: handbookId, isCreate });
  const { editHandbook, createHandbook } = useHandbookMutation();

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
    if (isCreate) {
      try {
        await createHandbook.mutateAsync(values);
        navigate(APP_ROUTE.Handbook);
        toast({
          title: 'Success!',
          variant: 'default',
          description: 'Handbook successfully created.',
        });
      } catch (error: any) {
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
          description: error.response?.data?.errorMessage || 'An error occured while creating handbook.',
        });
      }
      return;
    }

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
      pageTitle="Handbook"
      pageSubtitle="Handbook Details"
      isLoading={queryLoading && !isCreate}
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
      breadcrumbs={[{ href: `${APP_ROUTE.Handbook}`, name: 'Handbook entries' }, { name: `${handbookData?.title}` }]}
    >
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="space-y-8 max-w-5xl">
            <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none">
              <CardContent className="space-y-4 pt-6">
                <div className="grid sm:grid-cols-2 grid-cols-1">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel requiredField>Handbook title</FormLabel>
                        <FormControl>
                          <Input id="title" placeholder="Handbook title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <MarkdownEditor label="Content" name="content" control={control} height={0} />
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </PageContainer>
  );
};
