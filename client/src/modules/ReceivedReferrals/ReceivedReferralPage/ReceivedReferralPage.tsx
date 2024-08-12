import { useMemo, useState } from 'react';
import { PaperclipIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsersInfinite } from '@/services/users/api';
import { PageContainer } from '@/components/PageContainer';
import { createDownloadLink, isImageUrl, useIdFromParams } from '@/helpers/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_ROUTE } from '@/helpers/constants';
import { useReferral, useReferralMutation } from '@/services/referrals/api';
import { StatusTimeline } from '@/components/StatusTimeline';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/helpers/utils';
import { toast } from '@/components/ui/use-toast';
import { HOUSEHOLDS_VULNERABILITY_CRITERIA, ReferralStatus, ReferralTab } from '@/services/referrals/const';
import { AsyncSelect } from '@/components/AsyncSelect';
import { User } from '@/services/users';
import { formatDate } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferralDiscussions } from '@/components/ReferralDiscussions';
import { serviceCategoryToLabel } from './helpers';
import { referralStatuses } from './const';
import { useNavigate } from 'react-router-dom';
import { StatusReasonModal } from '@/components/StatusReasonModal';

export const ReceivedReferralPage = () => {
  const navigate = useNavigate();
  const { id: receivedReferralId } = useIdFromParams();
  const [referralAction, setReferralAction] = useState<'rejected' | 'enrolled' | 'inEvaluation' | undefined>(undefined);
  const [isUserAssigning, setIsUserAssigning] = useState<boolean>(false);
  const [isStatusReasonModal, setOpenStatusReasonModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ReferralTab.Discussion | ReferralTab.Referral>(ReferralTab.Referral);

  const { data: receivedReferralData, isLoading: queryLoading } = useReferral({
    id: receivedReferralId,
    isCreate: false,
  });

  const { control, handleSubmit } = useForm<{ focalPoint: User | null }>({
    defaultValues: {
      focalPoint: null,
    },
  });

  const { patchReferral, updateReferralReason } = useReferralMutation();

  const onReferralActionClick = async () => {
    try {
      await patchReferral.mutateAsync({ data: { status: referralAction }, referralId: receivedReferralId });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Referral successfully edited.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description:
          error.response?.data?.errorMessage ||
          `An error has occured while ${referralAction === 'rejected' ? 'rejecting' : 'accepting'} referral.`,
      });
    }
  };

  const onRejectConfirmClick = async (reasonText: string) => {
    try {
      await updateReferralReason.mutateAsync({
        referralId: receivedReferralId,
        referralType: 'reject',
        text: reasonText,
      });

      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Referral successfully rejected.',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || `An error has occured while rejecting referral.`,
      });
    }
    setReferralAction(undefined);
    setOpenStatusReasonModal(false);
  };

  const openStatusReasonModal = () => {
    setOpenStatusReasonModal(true);
  };

  const onCancelRejectActionClick = () => {
    setOpenStatusReasonModal(false);
  };

  const onStatusSelect = ({ action }: { action: typeof referralAction }) => {
    setReferralAction(action);
  };

  const onAssignFocalPointClick = handleSubmit(async ({ focalPoint }) => {
    if (!focalPoint) {
      return;
    }

    setIsUserAssigning(true);
    try {
      await patchReferral.mutateAsync({
        data: { focalPoint, status: ReferralStatus.InEvaluation },
        referralId: receivedReferralId,
      });
      toast({
        title: 'Success!',
        variant: 'default',
        description: `${focalPoint.firstName ?? ''} ${focalPoint?.lastName ?? ''} successfully assigned as focal point.`,
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || `An error has occured while assigning focal point.`,
      });
    }
    setIsUserAssigning(false);
  });

  const receivingReferral = useMemo(
    () => ({
      caseNumber: receivedReferralData?.caseNumber ?? 'N/A',
      isUrgent: receivedReferralData?.isUrgent || false,
      serviceCategory: receivedReferralData?.serviceCategory || 'N/A',
      subactivities: receivedReferralData?.subactivities || [],
      sendingOrganizationName: receivedReferralData?.organizationCreated?.name || 'N/A',
      displacementStatus: receivedReferralData?.displacementStatus || 'N/A',
      householdSize: receivedReferralData?.householdSize || 'N/A',
      householdMonthlyIncome: receivedReferralData?.householdMonthlyIncome || 'N/A',
      householdVulnerabilityCriteria: receivedReferralData?.householdsVulnerabilityCriteria || [],
      firstName: receivedReferralData?.firstName || 'N/A',
      patronymicName: receivedReferralData?.patronymicName || 'N/A',
      surname: receivedReferralData?.surname || 'N/A',
      dateOfBirth: receivedReferralData?.dateOfBirth
        ? formatDate(receivedReferralData.dateOfBirth, 'dd/MM/yyyy')
        : 'N/A',
      gender: receivedReferralData?.gender || 'N/A',
      taxId: receivedReferralData?.taxId || 'N/A',
      address: receivedReferralData?.address || 'N/A',
      oblast: receivedReferralData?.oblast || 'N/A',
      ryon: receivedReferralData?.ryon || 'N/A',
      hromada: receivedReferralData?.hromada || 'N/A',
      settlement: receivedReferralData?.settlement || 'N/A',
      email: receivedReferralData?.email || 'N/A',
      phone: receivedReferralData?.phone || 'N/A',
      contactPreference: receivedReferralData?.contactPreference || 'N/A',
      restrictions: receivedReferralData?.restrictions || 'N/A',
      consent: receivedReferralData?.consent || false,
      required: receivedReferralData?.required || 'N/A',
      needForService: receivedReferralData?.needForService || 'N/A',
      isSeparated: receivedReferralData?.isSeparated || false,
      caregiver: receivedReferralData?.caregiver || 'N/A',
      relationshipToChild: receivedReferralData?.relationshipToChild || 'N/A',
      caregiverEmail: receivedReferralData?.caregiverEmail || 'N/A',
      caregiverPhone: receivedReferralData?.caregiverPhone || 'N/A',
      caregiverContactPreference: receivedReferralData?.caregiverContactPreference || 'N/A',
      isCaregiverInformed: receivedReferralData?.isCaregiverInformed || 'false',
      caregiverExplanation: receivedReferralData?.caregiverExplanation || 'N/A',
      caregiverNote: receivedReferralData?.caregiverNote || 'N/A',
      focalPoint: receivedReferralData?.focalPoint || null,
      status: receivedReferralData?.status || ReferralStatus.Open,
      isDraft: receivedReferralData?.isDraft || false,
      organizationCreated: receivedReferralData?.organizationCreated?.name || 'N/A',
      userCreated:
        `${receivedReferralData?.userCreated?.firstName} ${receivedReferralData?.userCreated?.lastName}` || 'N/A',
      files: receivedReferralData?.files || [],
    }),
    [receivedReferralData],
  );

  return (
    <PageContainer
      pageTitle={`Case ${receivingReferral.caseNumber}`}
      isLoading={queryLoading}
      breadcrumbs={[
        { href: `${APP_ROUTE.ReceivedReferrals}`, name: 'Received Referrals' },
        { name: `Case ${receivingReferral.caseNumber}` },
      ]}
      headerNode={
        (receivingReferral.status === ReferralStatus.InEvaluation ||
          receivingReferral.status === ReferralStatus.Open) && (
          <div className="flex sm:flex-row flex-col sm:gap-4 gap-2">
            <Select
              onValueChange={(val: string) => onStatusSelect({ action: val as typeof referralAction })}
              value={referralAction}
            >
              <SelectTrigger>
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                {referralStatuses.map((el) => (
                  <SelectItem key={el.value} value={el.value}>
                    {el.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={() => (referralAction === 'rejected' ? openStatusReasonModal() : onReferralActionClick())}
              isLoading={patchReferral.isLoading}
              disabled={patchReferral.isLoading || !referralAction}
            >
              Submit
            </Button>
            <Button type="button" variant="destructive" onClick={() => navigate(APP_ROUTE.ReceivedReferrals)}>
              Cancel
            </Button>
          </div>
        )
      }
    >
      <Tabs defaultValue="referral">
        <TabsList>
          <TabsTrigger value="referral" onClick={() => setActiveTab(ReferralTab.Referral)}>
            Referral
          </TabsTrigger>
          <TabsTrigger
            value="discussion"
            onClick={() => {
              setActiveTab(ReferralTab.Discussion);
            }}
          >
            Discussion
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {activeTab === ReferralTab.Referral ? (
        <div className="space-y-8 max-w-2xl">
          <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none relative">
            {receivingReferral?.isUrgent && (
              <div className="w-full text-center bg-destructive text-white rounded-tl-lg rounded-tr-lg text-xs leading-6 font-semibold">
                Urgent
              </div>
            )}
            <div
              className={cn('px-6 pb-6 mt-3 flex items-center justify-center', {
                'mt-5': receivingReferral?.isUrgent,
              })}
            >
              <StatusTimeline currentStatus={receivingReferral.status} />
            </div>
            <Separator />
            <CardContent className="pt-6">
              {receivingReferral.focalPoint ? (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Focal Point</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">
                    {`${receivingReferral.focalPoint.firstName} ${receivingReferral?.focalPoint?.lastName}`}
                  </dd>
                </div>
              ) : (
                <dl className="sm:w-[80%] w-full">
                  <div className="flex items-end gap-4">
                    <AsyncSelect
                      name="focalPoint"
                      control={control}
                      useInfiniteQueryFunction={useUsersInfinite}
                      customEndpoint="/referrals/focal-point/users"
                      labelKey="firstName"
                      getOptionLabel={(o) => `${o.firstName} ${o.lastName}`}
                      valueKey="id"
                      label="Focal Point"
                      labelClassName="font-bold tracking-tight"
                    />
                    <Button
                      variant="outline"
                      isLoading={isUserAssigning}
                      disabled={isUserAssigning}
                      onClick={onAssignFocalPointClick}
                    >
                      Assign
                    </Button>
                  </div>
                </dl>
              )}
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle>Sending Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Sending organisation</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.sendingOrganizationName}</dd>
                </div>
                {receivingReferral?.serviceCategory && (
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-bold tracking-tight leading-6">Service category</dt>
                    <dd className="mt-1 text-sm leading-6 sm:mt-2">
                      {serviceCategoryToLabel(receivingReferral.serviceCategory)}
                    </dd>
                  </div>
                )}
                {receivingReferral?.subactivities && receivingReferral?.subactivities.length > 0 && (
                  <div className="col-span-1">
                    <dt className="text-sm font-bold tracking-tightleading-6">Subactivites</dt>
                    <dd className="mt-1 text-sm leading-6 capitalize sm:mt-2">
                      {receivingReferral.subactivities.map((i) => i.title).join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
            {receivingReferral?.serviceCategory === 'mpca' && (
              <div className="sm:bg-muted/40">
                <Separator />
                <CardHeader>
                  <CardTitle>MPCA Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-bold tracking-tight leading-6">Displacement status</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2 uppercase">{receivingReferral.displacementStatus}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-bold tracking-tight leading-6">Household size</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2 capitalize">{receivingReferral.householdSize}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-bold tracking-tight leading-6">Household monthly income</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                        {receivingReferral.householdMonthlyIncome}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-bold tracking-tight leading-6">Household vulnerability criteria</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2 whitespace-pre-line">
                        <ul className="list-disc px-4">
                          {HOUSEHOLDS_VULNERABILITY_CRITERIA.filter((i) =>
                            receivingReferral.householdVulnerabilityCriteria.some((j) => i.id === j),
                          ).map((k) => (
                            <li key={k.id}>{k.label}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </div>
            )}
            <Separator />
            <CardHeader>
              <CardTitle>Beneficiary Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">First name</dt>
                  <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.firstName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Surname</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.surname}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Patronymic name</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.patronymicName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Gender</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2 capitalize">{receivingReferral.gender}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Date of birth</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.dateOfBirth}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Tax ID</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.taxId}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">Address</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.address}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Oblast</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.oblast}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Raion</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.ryon}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Hromada</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.hromada}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Settlement</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.settlement}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Email</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Phone</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.phone}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Contact preference</dt>
                  <dd className="mt-1 text-sm leading sm:mt-2 capitalize">{receivingReferral.contactPreference}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">Consent given?</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">
                    <Badge
                      className={cn(
                        { 'bg-green-600 hover:bg-green-600': receivingReferral.consent },
                        { 'bg-red-600 hover:bg-red-600': !receivingReferral.consent },
                      )}
                    >
                      {receivingReferral.consent ? 'Yes' : 'No'}
                    </Badge>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">Restrictions</dt>
                  <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.restrictions}</dd>
                </div>
              </dl>
            </CardContent>
            {receivingReferral?.caregiver && receivingReferral.caregiver !== 'N/A' && (
              <div className="sm:bg-muted/40">
                <Separator />
                <CardHeader>
                  <CardTitle>Minor Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-bold tracking-tight leading-6">
                        Is child separated or unaccompanied?
                      </dt>
                      <dd className="mt-1 text-sm leading-6 sm:mt-2">
                        <Badge
                          className={cn(
                            { 'bg-green-600 hover:bg-green-600': receivingReferral.isSeparated },
                            { 'bg-red-600 hover:bg-red-600': !receivingReferral.isSeparated },
                          )}
                        >
                          {receivingReferral.isSeparated ? 'Yes' : 'No'}
                        </Badge>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-bold tracking-tight leading-6">Caregiver name</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.caregiver}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-bold tracking-tight leading-6">Relationship to child</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.relationshipToChild}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-bold tracking-tight leading-6">Caregiver email</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.caregiverEmail}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-bold tracking-tight leading-6">Caregiver phone</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2 capitalize">{receivingReferral.caregiverPhone}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-bold tracking-tight leading-6">Caregiver contact preference</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                        {receivingReferral.caregiverContactPreference}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-bold tracking-tight leading-6">Is caregiver informed of referral?</dt>
                      <dd className="mt-1 text-sm leading-6 sm:mt-2">
                        <Badge
                          className={cn(
                            { 'bg-green-600 hover:bg-green-600': receivingReferral.isCaregiverInformed === 'true' },
                            { 'bg-red-600 hover:bg-red-600': receivingReferral.isCaregiverInformed === 'false' },
                          )}
                        >
                          {receivingReferral.isCaregiverInformed === 'true' ? 'Yes' : 'No'}
                        </Badge>
                      </dd>
                    </div>
                    {receivingReferral.isCaregiverInformed === 'false' && (
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-bold tracking-tight leading-6">Caregiver explanation</dt>
                        <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.caregiverExplanation}</dd>
                      </div>
                    )}
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-bold tracking-tight leading-6">Special note or need</dt>
                      <dd className="mt-1 text-sm leading sm:mt-2 capitalize">{receivingReferral.caregiverNote}</dd>
                    </div>
                  </dl>
                </CardContent>
              </div>
            )}
            <Separator />
            <CardHeader>
              <CardTitle>Other Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">Reason</dt>
                  <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.required}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">Service explanation</dt>
                  <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.needForService}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">Attachments</dt>
                  <dd className="text-sm">
                    <ul
                      role="list"
                      className={cn('rounded-md divide-y divide-border mt-2', {
                        'border border-border': receivingReferral.files.length > 0,
                      })}
                    >
                      {receivingReferral.files.length > 0 ? (
                        receivingReferral.files.map((file) => (
                          <li
                            key={file.id}
                            className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                          >
                            <div className="flex w-0 flex-1 items-center">
                              {isImageUrl(file.url) ? (
                                <img src={file.url} className="rounded-md h-10 w-10 object-cover" />
                              ) : (
                                <PaperclipIcon
                                  className="h-6 w-10 flex-shrink-0 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              )}

                              <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                <span className="truncate font-medium">{file.name}</span>
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <Button variant="outline" onClick={() => createDownloadLink(file.url, file.name)}>
                                Download
                              </Button>
                            </div>
                          </li>
                        ))
                      ) : (
                        <div className="text-muted-foreground italic leading-6">No attachments</div>
                      )}
                    </ul>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      ) : (
        <ReferralDiscussions referralId={receivedReferralId} />
      )}

      <StatusReasonModal
        open={!!isStatusReasonModal}
        title="Reject Referral"
        body={`Please provide a reason for rejecting referral "${receivingReferral.caseNumber}".`}
        confirmButtonLoading={patchReferral.isLoading}
        actionButtonVariant="destructive"
        onCancel={onCancelRejectActionClick}
        onAction={onRejectConfirmClick}
      />
    </PageContainer>
  );
};
