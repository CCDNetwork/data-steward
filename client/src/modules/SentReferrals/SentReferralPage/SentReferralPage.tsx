import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '@/components/PageContainer';
import { shortenId, useIdFromParams } from '@/helpers/common';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_ROUTE } from '@/helpers/constants';
import { useReferral, useReferralMutation } from '@/services/referrals/api';
import { Separator } from '@/components/ui/separator';
import { AsyncSelect } from '@/components/AsyncSelect';
import { useOrganizationsInfinite } from '@/services/organizations/api';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FilesDropzone } from '@/components/FilesDropzone';
import { StatusTimeline } from '@/components/StatusTimeline';
import { ReferralStatus } from '@/services/referrals/const';

import { CancelReferralModal } from './components/CancelReferralModal';
import { dataToSentReferralFormData } from './form-transformation';
import { SentReferralFormData, SentReferralFormSchema } from './validations';
import { defaultSentReferralFormFormValues } from './const';

export const SentReferralPage = () => {
  const navigate = useNavigate();
  const { id: sentReferralId, isCreate } = useIdFromParams();

  const { data: sentReferralData, isLoading: queryLoading } = useReferral({ id: sentReferralId, isCreate });

  const { createReferral, patchReferral } = useReferralMutation();

  const form = useForm<SentReferralFormData>({
    defaultValues: defaultSentReferralFormFormValues,
    resolver: zodResolver(SentReferralFormSchema),
  });

  const { control, formState, handleSubmit, reset, watch } = form;

  console.log(formState.errors);

  const referralAssignedFocalPoint = watch('focalPoint');

  useEffect(() => {
    if (sentReferralData) {
      reset(dataToSentReferralFormData(sentReferralData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentReferralData]);

  const onSubmit = async ({ values, isDraft = false }: { values: SentReferralFormData; isDraft?: boolean }) => {
    if (isCreate) {
      try {
        await createReferral.mutateAsync({ ...values, isDraft });
        toast({
          title: 'Success!',
          variant: 'default',
          description: 'Referral successfully created.',
        });
        navigate(APP_ROUTE.SentReferrals);
      } catch (error: any) {
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
          description: error.response?.data?.errorMessage || 'Error creating referral.',
        });
      }
      return;
    }

    try {
      await patchReferral.mutateAsync({ data: { ...values, isDraft }, referralId: sentReferralId });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Referral successfully edited.',
      });
      navigate(APP_ROUTE.SentReferrals);
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Error editing referral.',
      });
    }
  };

  const referralCaseNumberFromId = shortenId(sentReferralData?.id);

  return (
    <PageContainer
      pageTitle={isCreate ? 'New case' : `Case  #${referralCaseNumberFromId}`}
      pageSubtitle={isCreate ? 'Create a new case' : 'Manage case'}
      isLoading={queryLoading && !isCreate}
      breadcrumbs={[
        { href: `${APP_ROUTE.SentReferrals}`, name: 'Sent Referrals' },
        { name: isCreate ? 'New case' : `Case #${referralCaseNumberFromId}` },
      ]}
      headerNode={
        !isCreate &&
        !sentReferralData?.isDraft && (
          <div className="flex sm:flex-row flex-col gap-2 sm:gap-4">
            <Button
              type="submit"
              onClick={handleSubmit((values) => onSubmit({ values }))}
              isLoading={patchReferral.isLoading}
              disabled={formState.isSubmitting || patchReferral.isLoading || !formState.isDirty}
            >
              Edit case
            </Button>
            {sentReferralData?.status !== ReferralStatus.Withdrawn && <CancelReferralModal />}
          </div>
        )
      }
    >
      <Form {...form}>
        <form onSubmit={handleSubmit((values) => onSubmit({ values }))}>
          <div className="space-y-8 max-w-2xl">
            <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none">
              {!isCreate &&
                (sentReferralData?.isDraft ? (
                  <div className="w-full text-center bg-primary text-white rounded-tl-lg rounded-tr-lg text-xs leading-6 font-semibold">
                    Draft Referral
                  </div>
                ) : (
                  <>
                    <div className="px-6 pt-2 pb-6 flex items-center justify-center">
                      <StatusTimeline currentStatus={sentReferralData?.status ?? ReferralStatus.Open} />
                    </div>
                    <Separator />
                  </>
                ))}
              <CardHeader>
                <CardTitle>Receiving Organization Details</CardTitle>
                <CardDescription>Information about the receiving organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {!isCreate && !sentReferralData?.isDraft && (
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium leading-6">Focal point</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2">
                        {referralAssignedFocalPoint ? (
                          `${referralAssignedFocalPoint?.firstName ?? ''} ${referralAssignedFocalPoint.lastName ?? ''}`
                        ) : (
                          <p className="italic text-primary/80">Unassigned</p>
                        )}
                      </dd>
                    </div>
                  )}
                  <AsyncSelect
                    label="Receiving organization"
                    name="organizationReferredTo"
                    control={control}
                    useInfiniteQueryFunction={useOrganizationsInfinite}
                    labelKey="name"
                    valueKey="id"
                  />
                </div>
              </CardContent>
              <Separator />
              <CardHeader>
                <CardTitle>Beneficiary Details</CardTitle>
                <CardDescription>Information about the beneficiary that is being referred</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input id="firstName" placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="familyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Family name</FormLabel>
                        <FormControl>
                          <Input id="familyName" placeholder="Family name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={control}
                      name="methodOfContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred contact method</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred contact method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="visit">Visit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Beneficiary Consent</FormLabel>
                          <FormDescription>Enable if the beneficiary has given their consent.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={control}
                    name="contactDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact details</FormLabel>
                        <FormControl>
                          <Textarea
                            id="contactDetails"
                            placeholder="Contact details"
                            maxLength={200}
                            limitCounterEnabled
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <Separator />
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
                <CardDescription>Upload and/or manage the attachments for this referral</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <FilesDropzone control={control} name="files" />
                </div>
              </CardContent>
              {(isCreate || sentReferralData?.isDraft) && (
                <>
                  <Separator className="mb-6" />
                  <CardFooter className="gap-4 justify-between p-0 sm:px-6 sm:pb-6">
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="default"
                        onClick={handleSubmit((values) => onSubmit({ values, isDraft: true }))}
                        disabled={createReferral.isLoading}
                      >
                        Save as draft
                      </Button>
                      <Button
                        type="submit"
                        variant="default"
                        onClick={handleSubmit((values) => onSubmit({ values }))}
                        disabled={createReferral.isLoading}
                      >
                        Save and Submit
                      </Button>
                    </div>
                    <Button type="button" variant="outline" onClick={() => navigate(APP_ROUTE.SentReferrals)}>
                      Cancel
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        </form>
      </Form>
    </PageContainer>
  );
};
