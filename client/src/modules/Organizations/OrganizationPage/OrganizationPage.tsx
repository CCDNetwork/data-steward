import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageContainer } from '@/components/PageContainer';
import { useIdFromParams } from '@/helpers/common';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useOrganization, useOrganizationMutation } from '@/services/organizations/api';

import { dataToOrganizationEditFormData } from './form-transformation';
import { OrganizationEditFormSchema, OrganizationEditFormData } from './validations';
import { defaultOrganizationEditFormFormValues } from './const';

export const OrganizationPage = () => {
  const { id: organizationId } = useIdFromParams();

  const { data: organizationData, isLoading: queryLoading } = useOrganization({ id: organizationId, isCreate: false });

  const { editOrganization } = useOrganizationMutation();

  const form = useForm<OrganizationEditFormData>({
    defaultValues: defaultOrganizationEditFormFormValues,
    resolver: zodResolver(OrganizationEditFormSchema),
  });

  const { control, formState, handleSubmit, reset } = form;

  useEffect(() => {
    if (organizationData) {
      reset(dataToOrganizationEditFormData(organizationData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationData]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await editOrganization.mutateAsync({ payload: values, organizationId });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Organization successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Error updating organization.',
      });
    }
  });

  return (
    <PageContainer
      pageTitle="Organization Information"
      pageSubtitle="Details about organization"
      isLoading={queryLoading}
      headerNode={
        <Button
          type="submit"
          onClick={onSubmit}
          isLoading={editOrganization.isLoading}
          disabled={formState.isSubmitting || editOrganization.isLoading || !formState.isDirty}
        >
          Save
        </Button>
      }
    >
      <Form {...form}>
        <div className="mt-6 border-t border-border/80">
          <dl className="divide-y divide-border/80">
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4 px-0">
              <dt className="text-sm font-medium leading-6">Organization Name</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id="name" className="sm:max-w-sm" placeholder="Organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </dd>
            </div>
          </dl>
        </div>
      </Form>
    </PageContainer>
  );
};
