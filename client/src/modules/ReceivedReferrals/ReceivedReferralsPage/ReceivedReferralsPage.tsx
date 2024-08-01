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
import { OrgActivityFilterMap } from '@/services/organizations';
import { FilterBySelf } from '@/components/FilterBySelf';
import { useAuth } from '@/providers/GlobalProvider';

import { columns } from './columns';

export const ReceivedReferralsPage = () => {
  const { user } = useAuth();
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
      pageTitle="Manage Received Referrals"
      pageSubtitle="On this page you can view the referrals that you have received from other organisations. You should review each referral and decide whether to accept or reject it."
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
            <FilterBySelf
              currentFilters={receivedReferralsFilters}
              filterName="focalPointId"
              setCurrentFilters={setReceivedReferralsFilters}
              label="Assigned to me"
              value={user.id ?? ''}
            />
            <FilterDropdown
              currentFilters={receivedReferralsFilters}
              filterName="status[in]"
              setCurrentFilters={setReceivedReferralsFilters}
              title="Filter by Status"
              options={Object.entries(ReferralStatus).map(([label, value]) => ({
                value,
                label: label === 'InEvaluation' ? 'In Evaluation' : label,
              }))}
            />
            <FilterDropdown
              currentFilters={receivedReferralsFilters}
              filterName="organizationCreatedId[in]"
              setCurrentFilters={setReceivedReferralsFilters}
              title="Filter by Sender"
              options={isFetched ? organizations!.data.map((org) => ({ label: org.name, value: org.id })) : []}
            />
            <FilterDropdown
              currentFilters={receivedReferralsFilters}
              filterName="serviceCategory[in]"
              setCurrentFilters={setReceivedReferralsFilters}
              title="Filter by Activity"
              options={Object.entries(OrgActivityFilterMap).map(([label, value]) => ({ label, value }))}
            />
            <DateRangePickerFilter setCurrentFilters={setReceivedReferralsFilters} placeholder="Filter by Date" />
          </div>
        }
      />
      <ConfirmationDialog
        open={!!receivedReferralToDelete}
        title="Delete Referral"
        body={`Are you sure you want to delete the referral for "${receivedReferralToDelete?.firstName} ${receivedReferralToDelete?.surname}"?`}
        onAction={handleDeleteReferral}
        confirmButtonLoading={removeReferral.isLoading}
        actionButtonVariant="destructive"
        onCancel={() => setReceivedReferralToDelete(null)}
      />
    </PageContainer>
  );
};
