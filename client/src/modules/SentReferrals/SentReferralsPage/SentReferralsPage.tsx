import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisibilityState } from '@tanstack/react-table';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { usePagination } from '@/helpers/pagination';
import { APP_ROUTE } from '@/helpers/constants';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { toast } from '@/components/ui/use-toast';
import { Referral } from '@/services/referrals';
import { useReferralMutation, useReferrals } from '@/services/referrals/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterDropdown } from '@/components/DataTable/FilterDropdown';
import { useOrganizations } from '@/services/organizations/api';
import { ReferralStatus } from '@/services/referrals/const';
import { DateRangePickerFilter } from '@/components/DataTable/DateRangePickerFilter';

import { columns } from './columns';

export const SentReferralsPage = () => {
  const navigate = useNavigate();
  const pagination = usePagination();
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const [sentReferralsFilters, setSentReferralsFilters] = useState<Record<string, string>>({
    isDraft: 'false',
  });
  const [hiddenColumns, setHiddenColumns] = useState<VisibilityState | undefined>({ status: true });
  const [sentReferralToDelete, setSentReferralToDelete] = useState<Referral | null>(null);

  const { data: sentReferralsData, isLoading: queryLoading } = useReferrals({
    ...pagination,
    filters: sentReferralsFilters,
  });

  const { data: organizations, isFetched: isOrganizationsFetched } = useOrganizations({
    currentPage: 1,
    pageSize: 999,
  });

  const { removeReferral } = useReferralMutation();

  const handleDeleteReferral = async () => {
    if (!sentReferralToDelete) return;

    try {
      await removeReferral.mutateAsync(sentReferralToDelete.id);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Referral successfully deleted!',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Failed to delete referral.',
      });
    }
    setSentReferralToDelete(null);
  };

  const onSentReferralTableRowClick = (referralRow: Referral) =>
    navigate(`${APP_ROUTE.SentReferrals}/${referralRow.id}`);

  const onNewCaseClick = () => navigate(`${APP_ROUTE.SentReferrals}/new`);

  return (
    <PageContainer
      pageTitle="Manage Sent Referrals"
      headerNode={<Button onClick={onNewCaseClick}>New Case</Button>}
      breadcrumbs={[{ href: `${APP_ROUTE.SentReferrals}`, name: 'Sent Referrals' }]}
    >
      <Tabs defaultValue="sent">
        <TabsList>
          <TabsTrigger
            value="sent"
            onClick={() => {
              setHiddenColumns({ status: true });
              setSentReferralsFilters(() => ({
                isDraft: 'false',
              }));
            }}
          >
            Sent
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            onClick={() => {
              setHiddenColumns({ status: false });
              setSentReferralsFilters(() => ({
                isDraft: 'true',
              }));
            }}
          >
            Drafts
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <DataTable
        data={sentReferralsData?.data ?? []}
        pagination={sentReferralsData?.meta}
        isQueryLoading={queryLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns(setSentReferralToDelete)}
        onRowClick={onSentReferralTableRowClick}
        hiddenColumns={hiddenColumns}
        tableFilterNodes={
          <div className="flex flex-wrap gap-4">
            <FilterDropdown
              currentFilters={sentReferralsFilters}
              filterName="status[in]"
              setCurrentFilters={setSentReferralsFilters}
              title="Filter by Status"
              options={Object.entries(ReferralStatus).map(([label, value]) => ({
                value,
                label: label === 'InEvaluation' ? 'In Evaluation' : label,
              }))}
            />
            <FilterDropdown
              currentFilters={sentReferralsFilters}
              filterName="organizationReferredToId[in]"
              setCurrentFilters={setSentReferralsFilters}
              title="Filter by Recipient"
              options={
                isOrganizationsFetched ? organizations!.data.map((org) => ({ label: org.name, value: org.id })) : []
              }
            />
            <DateRangePickerFilter setCurrentFilters={setSentReferralsFilters} placeholder="Filter by Date" />
          </div>
        }
      />
      <ConfirmationDialog
        open={!!sentReferralToDelete}
        title="Delete Referral"
        body={`Are you sure you want to delete the referral for "${sentReferralToDelete?.firstName} ${sentReferralToDelete?.surname}"?`}
        onAction={handleDeleteReferral}
        confirmButtonLoading={removeReferral.isLoading}
        actionButtonVariant="destructive"
        onCancel={() => setSentReferralToDelete(null)}
      />
    </PageContainer>
  );
};
