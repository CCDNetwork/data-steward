import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageContainer } from '@/components/PageContainer';
import { useIdFromParams } from '@/helpers/common';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTemplate, useTemplateMutation } from '@/services/templates/api';

import { defaultTemplateFormValues } from './const';
import { dataToTemplateEditForm } from './form-transformation';
import { TemplateForm, TemplateFormSchema } from '../validation';
import { STANDARDIZED_TEMPLATE_FIELDS } from '../const';
import { Card, CardContent } from '@/components/ui/card';
import { APP_ROUTE } from '@/helpers/constants';

export const TemplatePage = () => {
  const uniqueId = useId();
  const { id: templateId } = useIdFromParams();

  const { data: templateData, isLoading: queryLoading } = useTemplate({ id: templateId, isCreate: false });
  const { editTemplate } = useTemplateMutation();

  const form = useForm<TemplateForm>({
    defaultValues: defaultTemplateFormValues,
    resolver: zodResolver(TemplateFormSchema),
  });

  const { control, formState, handleSubmit, reset } = form;

  useEffect(() => {
    if (templateData) {
      reset(dataToTemplateEditForm(templateData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await editTemplate.mutateAsync({ data: values, templateId });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Template successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Error updating template.',
      });
    }
  });

  return (
    <PageContainer
      pageTitle="Template"
      pageSubtitle="Template Details"
      isLoading={queryLoading}
      headerNode={
        <Button
          type="submit"
          onClick={onSubmit}
          isLoading={editTemplate.isLoading}
          disabled={formState.isSubmitting || editTemplate.isLoading || !formState.isDirty}
        >
          Save
        </Button>
      }
      breadcrumbs={[{ href: `${APP_ROUTE.Templates}`, name: 'Templates' }, { name: `${templateData?.name}` }]}
    >
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="space-y-8 max-w-2xl">
            <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none">
              <CardContent className="space-y-2 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="pb-4 max-w-[400px]">
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input id="name" placeholder="Template name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <p className="text-center text-lg font-semibold py-2">Mappings</p>
                    {Object.entries(STANDARDIZED_TEMPLATE_FIELDS).map(([fieldName, fieldType]) => (
                      <div className="flex justify-between items-center gap-4" key={`${fieldName}-${uniqueId}`}>
                        <span className="capitalize text-sm w-44">{`${fieldName} (${fieldType})`}</span>
                        <p className="text-xl font-light">&rarr;</p>
                        <FormField
                          control={control}
                          name={`${fieldName}` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input id={fieldName} placeholder="Column name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </PageContainer>
  );
};
