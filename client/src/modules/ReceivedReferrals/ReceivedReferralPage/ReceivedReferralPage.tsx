import { useMemo, useState } from 'react';
import { PaperclipIcon } from 'lucide-react';

import { PageContainer } from '@/components/PageContainer';
import { createDownloadLink, shortenId, useIdFromParams } from '@/helpers/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_ROUTE } from '@/helpers/constants';
import { useReferral, useReferralMutation } from '@/services/referrals/api';
import { StatusTimeline } from '@/components/StatusTimeline';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/helpers/utils';
import { toast } from '@/components/ui/use-toast';
import { ReferralStatus } from '@/services/referrals/const';

export const ReceivedReferralPage = () => {
  const { id: receivedReferralId } = useIdFromParams();
  const [referralAction, setReferralAction] = useState<'rejected' | 'accepted' | undefined>(undefined);

  const { data: receivedReferralData, isLoading: queryLoading } = useReferral({
    id: receivedReferralId,
    isCreate: false,
  });

  const { patchReferral } = useReferralMutation();

  const onReferralActionClick = async ({ action }: { action: typeof referralAction }) => {
    setReferralAction(action);
    try {
      await patchReferral.mutateAsync({ data: { status: action }, referralId: receivedReferralId });
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
          `An error has occured while ${action === 'rejected' ? 'rejecting' : 'accepting'} referral.`,
      });
    }
    setReferralAction(undefined);
  };

  const receivingReferral = useMemo(
    () => ({
      focalPoint: receivedReferralData?.focalPoint || 'N/A',
      sendingOrganizationName: receivedReferralData?.organizationReferredTo?.name || 'N/A',
      beneficiaryFirstName: receivedReferralData?.firstName || 'N/A',
      beneficiaryFamilyName: receivedReferralData?.familyName || 'N/A',
      preferredMethodOfContact: receivedReferralData?.methodOfContact || 'N/A',
      beneficiaryConsent: receivedReferralData?.consent || false,
      contactDetails: receivedReferralData?.contactDetails || 'N/A',
      status: receivedReferralData?.status || ReferralStatus.Open,
      files: receivedReferralData?.files || [],
    }),
    [receivedReferralData],
  );

  const referralCaseNumberFromId = shortenId(receivedReferralData?.id);

  return (
    <PageContainer
      pageTitle={`Case #${referralCaseNumberFromId}`}
      pageSubtitle="Manage received case"
      isLoading={queryLoading}
      breadcrumbs={[
        { href: `${APP_ROUTE.ReceivedReferrals}`, name: 'Received Referrals' },
        { name: `Case #${referralCaseNumberFromId}` },
      ]}
      headerNode={
        <div className="flex sm:flex-row flex-col sm:gap-4 gap-2">
          <Button
            type="button"
            onClick={() => onReferralActionClick({ action: 'accepted' })}
            isLoading={patchReferral.isLoading && referralAction === 'accepted'}
            disabled={patchReferral.isLoading && referralAction === 'accepted'}
          >
            Accept
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onReferralActionClick({ action: 'rejected' })}
            isLoading={patchReferral.isLoading && referralAction === 'rejected'}
            disabled={patchReferral.isLoading && referralAction === 'rejected'}
          >
            Reject
          </Button>
        </div>
      }
    >
      <div className="space-y-8 max-w-2xl">
        <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none">
          <div className="px-6 pt-2 pb-6 flex items-center justify-center">
            <StatusTimeline currentStatus={receivingReferral.status} />
          </div>
          <Separator />
          <CardHeader>
            <CardTitle>Sending Organization Details</CardTitle>
            <CardDescription>Information about the sending organization</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Focal point</dt>
                <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.focalPoint}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Sending organization</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.sendingOrganizationName}</dd>
              </div>
            </dl>
          </CardContent>
          <Separator />
          <CardHeader>
            <CardTitle>Beneficiary Details</CardTitle>
            <CardDescription>Information about the beneficiary</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium leading-6">First name</dt>
                <dd className="mt-1 text-sm leading sm:mt-2">{receivingReferral.beneficiaryFirstName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Family name</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.beneficiaryFamilyName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Preferred method of contact</dt>
                <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                  {receivingReferral.preferredMethodOfContact}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium leading-6">Consent given?</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">
                  <Badge
                    className={cn(
                      { 'bg-green-600 hover:bg-green-600': receivingReferral.beneficiaryConsent },
                      { 'bg-red-600 hover:bg-red-600': !receivingReferral.beneficiaryConsent },
                    )}
                  >
                    {receivingReferral.beneficiaryConsent ? 'Yes' : 'No'}
                  </Badge>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium leading-6">Contact details</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{receivingReferral.contactDetails}</dd>
              </div>
            </dl>
          </CardContent>
          <Separator />
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>List of downloadable attachments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="sm:col-span-2">
              <dd className="text-sm">
                <ul
                  role="list"
                  className={cn('rounded-md divide-y divide-border', {
                    'border border-border': receivingReferral.files.length > 0,
                  })}
                >
                  {receivingReferral.files.length > 0 ? (
                    receivingReferral.files.map((file) => (
                      <li key={file.id} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <PaperclipIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
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
                    <div className="text-muted-foreground italic text-center">No attachements available</div>
                  )}
                </ul>
              </dd>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
