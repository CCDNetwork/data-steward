import { useMemo } from 'react';
import { PaperclipIcon } from 'lucide-react';
import { formatDate } from 'date-fns';

import { createDownloadLink, isImageUrl } from '@/helpers/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusTimeline } from '@/components/StatusTimeline';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/helpers/utils';
import {
  HOUSEHOLDS_VULNERABILITY_CRITERIA,
  ReferralStatus,
} from '@/services/referrals/const';
import { Referral } from '@/services/referrals';
import { serviceCategoryToLabel } from '@/modules/ReceivedReferrals';
import { useAuth } from '@/providers/GlobalProvider';

export const SentReferralPageViewOnly = ({ sentReferralData }: Props) => {
  const { deploymentSettings } = useAuth();
  const referralData = useMemo(
    () => ({
      caseNumber: sentReferralData?.caseNumber ?? 'N/A',
      isUrgent: sentReferralData?.isUrgent || false,
      serviceCategory: sentReferralData?.serviceCategory || 'N/A',
      subactivities: sentReferralData?.subactivities || [],
      sendingOrganizationName:
        sentReferralData?.organizationCreated?.name || 'N/A',
      displacementStatus: sentReferralData?.displacementStatus || 'N/A',
      householdSize: sentReferralData?.householdSize || 'N/A',
      householdMonthlyIncome: sentReferralData?.householdMonthlyIncome || 'N/A',
      householdVulnerabilityCriteria:
        sentReferralData?.householdsVulnerabilityCriteria || [],
      firstName: sentReferralData?.firstName || 'N/A',
      patronymicName: sentReferralData?.patronymicName || 'N/A',
      surname: sentReferralData?.surname || 'N/A',
      dateOfBirth: sentReferralData?.dateOfBirth
        ? formatDate(sentReferralData.dateOfBirth, 'dd/MM/yyyy')
        : 'N/A',
      gender: sentReferralData?.gender || 'N/A',
      taxId: sentReferralData?.taxId || 'N/A',
      address: sentReferralData?.address || 'N/A',
      oblast: sentReferralData?.oblast || 'N/A',
      ryon: sentReferralData?.ryon || 'N/A',
      hromada: sentReferralData?.hromada || 'N/A',
      settlement: sentReferralData?.settlement || 'N/A',
      email: sentReferralData?.email || 'N/A',
      phone: sentReferralData?.phone || 'N/A',
      contactPreference: sentReferralData?.contactPreference || 'N/A',
      restrictions: sentReferralData?.restrictions || 'N/A',
      consent: sentReferralData?.consent || false,
      required: sentReferralData?.required || 'N/A',
      needForService: sentReferralData?.needForService || 'N/A',
      isSeparated: sentReferralData?.isSeparated || false,
      caregiver: sentReferralData?.caregiver || 'N/A',
      relationshipToChild: sentReferralData?.relationshipToChild || 'N/A',
      caregiverEmail: sentReferralData?.caregiverEmail || 'N/A',
      caregiverPhone: sentReferralData?.caregiverPhone || 'N/A',
      caregiverContactPreference:
        sentReferralData?.caregiverContactPreference || 'N/A',
      isCaregiverInformed: sentReferralData?.isCaregiverInformed || 'false',
      caregiverExplanation: sentReferralData?.caregiverExplanation || 'N/A',
      caregiverNote: sentReferralData?.caregiverNote || 'N/A',
      focalPoint: sentReferralData?.focalPoint || null,
      status: sentReferralData?.status || ReferralStatus.UnderReview,
      isDraft: sentReferralData?.isDraft || false,
      isRejected: sentReferralData?.isRejected || false,
      organizationCreated: sentReferralData?.organizationCreated?.name || 'N/A',
      userCreated:
        `${sentReferralData?.userCreated?.firstName} ${sentReferralData?.userCreated?.lastName}` ||
        'N/A',
      files: sentReferralData?.files || [],
    }),
    [sentReferralData]
  );

  return (
    <div className="space-y-8 max-w-2xl">
      <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none relative">
        {referralData?.isUrgent && (
          <div className="w-full text-center bg-destructive text-white rounded-tl-lg rounded-tr-lg text-xs leading-6 font-semibold">
            Urgent
          </div>
        )}
        {!referralData.isDraft ? (
          <>
            <div
              className={cn('px-6 pb-6 mt-3 flex items-center justify-center', {
                'mt-5': referralData?.isUrgent,
              })}
            >
              <StatusTimeline
                currentStatus={referralData.status}
                isRejected={referralData.isRejected}
              />
            </div>
            <Separator />
          </>
        ) : (
          <div className="w-full text-center bg-primary text-white rounded-tl-lg rounded-tr-lg text-xs leading-6 font-semibold">
            Draft Referral
          </div>
        )}
        {referralData.focalPoint && (
          <>
            <CardContent className="pt-6">
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">
                  Focal Point
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">
                  {`${referralData.focalPoint.firstName} ${referralData?.focalPoint?.lastName}`}
                </dd>
              </div>
            </CardContent>
            <Separator />
          </>
        )}
        <CardHeader>
          <CardTitle>Sending Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Sending organisation
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.sendingOrganizationName}
              </dd>
            </div>
            {referralData?.serviceCategory && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">
                  Service category
                </dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">
                  {serviceCategoryToLabel(referralData.serviceCategory)}
                </dd>
              </div>
            )}
            {referralData?.subactivities &&
              referralData?.subactivities.length > 0 && (
                <div className="col-span-1">
                  <dt className="text-sm font-bold tracking-tightleading-6">
                    Subactivites
                  </dt>
                  <dd className="mt-1 text-sm leading-6 capitalize sm:mt-2">
                    {referralData.subactivities.map((i) => i.title).join(', ')}
                  </dd>
                </div>
              )}
          </dl>
        </CardContent>
        {referralData?.serviceCategory === 'mpca' && (
          <div className="sm:bg-muted/40">
            <Separator />
            <CardHeader>
              <CardTitle>MPCA Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Displacement status
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2 uppercase">
                    {referralData.displacementStatus}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Household size
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                    {referralData.householdSize}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Household monthly income
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                    {referralData.householdMonthlyIncome}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Household vulnerability criteria
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2 whitespace-pre-line">
                    <ul className="list-disc px-4">
                      {HOUSEHOLDS_VULNERABILITY_CRITERIA.filter((i) =>
                        referralData.householdVulnerabilityCriteria.some(
                          (j) => i.id === j
                        )
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
              <dt className="text-sm font-bold tracking-tight leading-6">
                First name
              </dt>
              <dd className="mt-1 text-sm leading sm:mt-2">
                {referralData.firstName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Surname
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.surname}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Patronymic name
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.patronymicName}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Gender
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2 capitalize">
                {referralData.gender}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Date of birth
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.dateOfBirth}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Tax ID
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.taxId}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Address
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.address}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                {deploymentSettings?.adminLevel1Name ?? 'Admin Level 1'}
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.oblast}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                {deploymentSettings?.adminLevel2Name ?? 'Admin Level 2'}
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.ryon}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                {deploymentSettings?.adminLevel3Name ?? 'Admin Level 3'}
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.hromada}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                {deploymentSettings?.adminLevel4Name ?? 'Admin Level 4'}
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.settlement}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Email
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.email}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Phone
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                {referralData.phone}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Contact preference
              </dt>
              <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                {referralData.contactPreference}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Consent given?
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:mt-2">
                <Badge
                  className={cn(
                    {
                      'bg-green-600 hover:bg-green-600': referralData.consent,
                    },
                    {
                      'bg-red-600 hover:bg-red-600': !referralData.consent,
                    }
                  )}
                >
                  {referralData.consent ? 'Yes' : 'No'}
                </Badge>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Restrictions
              </dt>
              <dd className="mt-1 text-sm leading sm:mt-2">
                {referralData.restrictions}
              </dd>
            </div>
          </dl>
        </CardContent>
        {referralData?.caregiver && referralData.caregiver !== 'N/A' && (
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
                        {
                          'bg-green-600 hover:bg-green-600':
                            referralData.isSeparated,
                        },
                        {
                          'bg-red-600 hover:bg-red-600':
                            !referralData.isSeparated,
                        }
                      )}
                    >
                      {referralData.isSeparated ? 'Yes' : 'No'}
                    </Badge>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Caregiver name
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2">
                    {referralData.caregiver}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Relationship to child
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2">
                    {referralData.relationshipToChild}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Caregiver email
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2">
                    {referralData.caregiverEmail}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Caregiver phone
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                    {referralData.caregiverPhone}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Caregiver contact preference
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                    {referralData.caregiverContactPreference}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Is caregiver informed of referral?
                  </dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">
                    <Badge
                      className={cn(
                        {
                          'bg-green-600 hover:bg-green-600':
                            referralData.isCaregiverInformed === 'true',
                        },
                        {
                          'bg-red-600 hover:bg-red-600':
                            referralData.isCaregiverInformed === 'false',
                        }
                      )}
                    >
                      {referralData.isCaregiverInformed === 'true'
                        ? 'Yes'
                        : 'No'}
                    </Badge>
                  </dd>
                </div>
                {referralData.isCaregiverInformed === 'false' && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-bold tracking-tight leading-6">
                      Caregiver explanation
                    </dt>
                    <dd className="mt-1 text-sm leading sm:mt-2">
                      {referralData.caregiverExplanation}
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">
                    Special note or need
                  </dt>
                  <dd className="mt-1 text-sm leading sm:mt-2 capitalize">
                    {referralData.caregiverNote}
                  </dd>
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
              <dt className="text-sm font-bold tracking-tight leading-6">
                Reason
              </dt>
              <dd className="mt-1 text-sm leading sm:mt-2">
                {referralData.required}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Service explanation
              </dt>
              <dd className="mt-1 text-sm leading sm:mt-2">
                {referralData.needForService}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold tracking-tight leading-6">
                Attachments
              </dt>
              <dd className="text-sm">
                <ul
                  role="list"
                  className={cn('rounded-md divide-y divide-border mt-2', {
                    'border border-border': referralData.files.length > 0,
                  })}
                >
                  {referralData.files.length > 0 ? (
                    referralData.files.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                      >
                        <div className="flex w-0 flex-1 items-center">
                          {isImageUrl(file.url) ? (
                            <img
                              src={file.url}
                              className="rounded-md h-10 w-10 object-cover"
                            />
                          ) : (
                            <PaperclipIcon
                              className="h-6 w-10 flex-shrink-0 text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {file.name}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Button
                            variant="outline"
                            onClick={() =>
                              createDownloadLink(file.url, file.name)
                            }
                          >
                            Download
                          </Button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-muted-foreground italic leading-6">
                      No attachments
                    </div>
                  )}
                </ul>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

interface Props {
  sentReferralData: Referral;
}
