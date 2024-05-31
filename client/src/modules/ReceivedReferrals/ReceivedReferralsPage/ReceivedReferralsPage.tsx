import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { usePagination } from '@/helpers/pagination';
import { APP_ROUTE } from '@/helpers/constants';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { toast } from '@/components/ui/use-toast';
import { useReferralMutation, useReferrals } from '@/services/referrals/api';
import { Referral } from '@/services/referrals';
import { FilterDropdown } from '@/components/DataTable/FilterDropdown';
import { ReferralStatus } from '@/services/referrals/const';
import { useOrganizations } from '@/services/organizations/api';
import { DateRangePickerFilter } from '@/components/DataTable/DateRangePickerFilter';

import { columns } from './columns';

export const ReceivedReferralsPage = () => {
  const navigate = useNavigate();
  const pagination = usePagination();
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const [receivedReferralToDelete, setReceivedReferralToDelete] = useState<Referral | null>(null);
  const [receivedReferralsFilters, setReceivedReferralsFilters] = useState<Record<string, string>>({
    isDraft: 'false',
  });

  const { data: receivedReferralsData, isLoading: queryLoading } = useReferrals({
    ...pagination,
    received: true,
    filters: receivedReferralsFilters,
  });
  const { data: organizations, isFetched } = useOrganizations({ currentPage: 1, pageSize: 999 });

  const { removeReferral } = useReferralMutation();

  const handleDeleteReferral = async () => {
    if (!receivedReferralToDelete) return;

    try {
      await removeReferral.mutateAsync(receivedReferralToDelete.id);
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
    setReceivedReferralToDelete(null);
  };

  const onReceivedReferralTableRowClick = (referralRow: Referral) =>
    navigate(`${APP_ROUTE.ReceivedReferrals}/${referralRow.id}`);

  return (
    <PageContainer
      pageTitle="Received Referrals"
      pageSubtitle="Manage received referrals"
      breadcrumbs={[{ href: `${APP_ROUTE.ReceivedReferrals}`, name: 'Received Referrals' }]}
    >
      <DataTable
        data={receivedReferralsData?.data ?? []}
        pagination={receivedReferralsData?.meta}
        isQueryLoading={queryLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns(setReceivedReferralToDelete)}
        onRowClick={onReceivedReferralTableRowClick}
        tableFilterNodes={
          <div className="flex flex-wrap gap-4">
            <FilterDropdown
              currentFilters={receivedReferralsFilters}
              filterName="status[in]"
              setCurrentFilters={setReceivedReferralsFilters}
              title="Status"
              options={Object.entries(ReferralStatus).map(([value, label]) => ({ label, value }))}
            />
            <FilterDropdown
              currentFilters={receivedReferralsFilters}
              filterName="organizationReferredToId[in]"
              setCurrentFilters={setReceivedReferralsFilters}
              title="Received from"
              options={isFetched ? organizations!.data.map((org) => ({ label: org.name, value: org.id })) : []}
            />
            <DateRangePickerFilter setCurrentFilters={setReceivedReferralsFilters} placeholder="Filter by date" />
          </div>
        }
      />
      <ConfirmationDialog
        open={!!receivedReferralToDelete}
        title="Delete Referral"
        body={`Are you sure you want to delete the referral for "${receivedReferralToDelete?.firstName} ${receivedReferralToDelete?.familyName}"?`}
        onAction={handleDeleteReferral}
        confirmButtonLoading={removeReferral.isLoading}
        actionButtonVariant="destructive"
        onCancel={() => setReceivedReferralToDelete(null)}
      />
    </PageContainer>
  );
};
