import { useMemo } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { APP_ROUTE } from '@/helpers/constants';
import { useBeneficiary } from '@/services/beneficiaryList';
import { useIdFromParams } from '@/helpers/common';
import { BeneficiaryStatus } from '@/components/BeneficiaryStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { beneficiaryDataToSingleBeneficiary } from '../helpers';
import { DuplicateCard } from './DuplicateCard';

export const SingleBeneficiaryPage = () => {
  const { id: beneficiaryId } = useIdFromParams();
  const { data: beneficiaryData, isLoading } = useBeneficiary({ id: beneficiaryId });

  const beneficiary = useMemo(() => beneficiaryDataToSingleBeneficiary(beneficiaryData), [beneficiaryData]);
  const isPrimaryDuplicate = useMemo(() => beneficiary.duplicates.find((el) => el.isPrimary), [beneficiary]);
  const notPrimaryDuplicates = useMemo(() => beneficiary.duplicates.filter((el) => !el.isPrimary), [beneficiary]);

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
          {beneficiary.duplicates.length > 0 && (
            <>
              <CardHeader>
                <CardTitle>Duplicates</CardTitle>
              </CardHeader>

              {isPrimaryDuplicate && (
                <CardContent className="mt-6">
                  <div className="mb-4 space-y-1">
                    <p>Primary record</p>
                    <p className="text-muted-foreground text-sm">
                      Primary record is the oldest record in the registry that might be a duplicate of this beneficiary.
                    </p>
                  </div>
                  <DuplicateCard
                    key={isPrimaryDuplicate.id}
                    item={isPrimaryDuplicate}
                    beneficiaryMatchedFields={beneficiary.matchedFields}
                  />
                </CardContent>
              )}

              {notPrimaryDuplicates.length > 0 && (
                <CardContent className="mt-6">
                  <div className="mb-4 space-y-1">
                    <p>Secondary records</p>
                    <p className="text-muted-foreground text-sm">
                      Secondary records are other records in the registry that might be a duplicate of this beneficiary.
                      All secondary records should have resolved their Duplication Status.
                    </p>
                  </div>
                  {notPrimaryDuplicates.map((item, index) => {
                    return <DuplicateCard key={item.id} item={item} evenItem={index % 2 === 0} />;
                  })}
                </CardContent>
              )}
            </>
          )}
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
