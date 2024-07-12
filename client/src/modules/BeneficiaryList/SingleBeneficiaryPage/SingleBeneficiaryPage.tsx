import { useMemo } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { APP_ROUTE } from '@/helpers/constants';
import { useBeneficiary } from '@/services/beneficiaryList';
import { useIdFromParams } from '@/helpers/common';
import { BeneficiaryStatus } from '@/components/BeneficiaryStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const SingleBeneficiaryPage = () => {
  const { id: beneficiaryId } = useIdFromParams();
  const { data: beneficiaryData, isLoading } = useBeneficiary({ id: beneficiaryId });

  const beneficiary = useMemo(
    () => ({
      status: beneficiaryData?.status || '',

      firstName: beneficiaryData?.firstName || 'N/A',
      surname: beneficiaryData?.familyName || 'N/A',
      dateOfBirth: beneficiaryData?.dateOfBirth || 'N/A',
      gender: beneficiaryData?.gender || 'N/A',
      hhId: beneficiaryData?.hhId || 'N/A',
      mobilePhoneId: beneficiaryData?.mobilePhoneId || 'N/A',
      govIdType: beneficiaryData?.govIdType || 'N/A',
      govIdNumber: beneficiaryData?.govIdNumber || 'N/A',
      otherIdType: beneficiaryData?.otherIdType || 'N/A',
      otherIdNumber: beneficiaryData?.otherIdNumber || 'N/A',

      adminLevel1: beneficiaryData?.adminLevel1 || 'N/A',
      adminLevel2: beneficiaryData?.adminLevel2 || 'N/A',
      adminLevel3: beneficiaryData?.adminLevel3 || 'N/A',
      adminLevel4: beneficiaryData?.adminLevel4 || 'N/A',

      assistanceDetails: beneficiaryData?.assistanceDetails || 'N/A',
      activity: beneficiaryData?.activity || 'N/A',
      currency: beneficiaryData?.activity || 'N/A',
      currencyAmount: beneficiaryData?.currencyAmount || 'N/A',
      startDate: beneficiaryData?.startDate || 'N/A',
      endDate: beneficiaryData?.endDate || 'N/A',
      frequency: beneficiaryData?.frequency || 'N/A',
    }),
    [beneficiaryData],
  );

  return (
    <PageContainer
      pageTitle="Beneficiary Preview"
      pageSubtitle="Duplicate beneficiary details"
      isLoading={isLoading}
      breadcrumbs={[
        { href: `${APP_ROUTE.BeneficiaryList}`, name: 'Beneficiary List' },
        { name: 'Beneficiary Preview' },
      ]}
    >
      <div className="space-y-8 max-w-2xl">
        <Card className="sm:bg-secondary/10 border-0 sm:border sm:dark:bg-secondary/10 shadow-none relative">
          <div className="px-6 pb-6 flex items-center justify-center mt-3">
            <BeneficiaryStatus currentStatus={beneficiary.status} />
          </div>
          <Separator />
          <CardHeader>
            <CardTitle>Personal Data</CardTitle>
          </CardHeader>
          <CardContent className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">First name</dt>
                <dd className="mt-1 text-sm leading sm:mt-2">{beneficiary.firstName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">Family name</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.surname}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-bold tracking-tight leading-6">Date of birth</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.dateOfBirth}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-bold tracking-tight leading-6">Gender</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2 capitalize">{beneficiary.gender}</dd>
              </div>
              <div className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <dt className="text-sm font-bold tracking-tight leading-6">Household ID</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.hhId}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-bold tracking-tight leading-6">Mobile phone ID</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.mobilePhoneId}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">Gov ID type</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.govIdType}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">Gov ID number</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.govIdNumber}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">Other ID type</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.otherIdType}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">Other ID number</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.otherIdNumber}</dd>
              </div>
            </dl>
          </CardContent>

          <div className="sm:bg-muted/40">
            <Separator />
            <CardHeader>
              <CardTitle>Geographical Data</CardTitle>
            </CardHeader>
            <CardContent className="mt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">AdminLevel1</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.adminLevel1}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">AdminLevel2</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.adminLevel2}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">AdminLevel3</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.adminLevel3}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-bold tracking-tight leading-6">AdminLevel4</dt>
                  <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.adminLevel4}</dd>
                </div>
              </dl>
            </CardContent>
          </div>

          <Separator />
          <CardHeader>
            <CardTitle>Assistance</CardTitle>
          </CardHeader>
          <CardContent className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <dt className="text-sm font-bold tracking-tight leading-6">Assistance details</dt>
                <dd className="mt-1 text-sm leading sm:mt-2">{beneficiary.assistanceDetails}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-bold tracking-tight leading-6">Activity</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.activity}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">Currency</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2 capitalize">{beneficiary.currency}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">Currency amount</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.currencyAmount}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">Start date</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.startDate}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-bold tracking-tight leading-6">End date</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.endDate}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-bold tracking-tight leading-6">Frequency</dt>
                <dd className="mt-1 text-sm leading-6 sm:mt-2">{beneficiary.frequency}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
