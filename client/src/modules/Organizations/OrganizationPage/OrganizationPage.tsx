import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PageContainer } from '@/components/PageContainer';
import { useIdFromParams } from '@/helpers/common';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useOrganization, useOrganizationMutation } from '@/services/organizations/api';
import { Card, CardContent } from '@/components/ui/card';

import { dataToOrganizationEditFormData } from './form-transformation';
import { OrganizationEditFormSchema, OrganizationEditFormData } from './validations';
import { defaultOrganizationEditFormFormValues } from './const';
import { APP_ROUTE } from '@/helpers/constants';

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
      pageTitle="Organization"
      pageSubtitle="Organization Details"
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
      breadcrumbs={[
        { href: `${APP_ROUTE.Organizations}`, name: 'Organizations' },
        { name: `${organizationData?.name}` },
      ]}
    >
      <Form {...form}>
        <div className="space-y-8 max-w-2xl">
          <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none">
            <CardContent className="space-y-2 pt-6">
              <div className="grid sm:grid-cols-2 grid-cols-1">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization name</FormLabel>
                      <FormControl>
                        <Input id="name" placeholder="Organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Form>
    </PageContainer>
  );
};
