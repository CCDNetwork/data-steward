import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisibilityState } from '@tanstack/react-table';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { APP_ROUTE } from '@/helpers/constants';
import { usePagination } from '@/helpers/pagination';
import { Beneficiary, useBeneficiariesMutation, useBeneficiaryList } from '@/services/beneficiaryList';
import { toast } from '@/components/ui/use-toast';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { columns } from './columns';

export const BeneficiaryListPage = () => {
  const navigate = useNavigate();
  const pagination = usePagination();
  const { currentPage, onPageChange, onSortChange, onPageSizeChange } = pagination;

  const [beneficiaryFilters, setBeneficiaryFilters] = useState<Record<string, string>>({
    isPrimary: 'false',
    status: '$null',
  });
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState<Beneficiary | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<VisibilityState | undefined>({ status: false });

  const { data: beneficiaryList, isLoading } = useBeneficiaryList({ ...pagination, filters: beneficiaryFilters });

  const { changeBeneficiaryStatus, removeBeneficiary } = useBeneficiariesMutation();

  const handleStatusChange = async ({
    beneficiaryId,
    status,
  }: {
    beneficiaryId: string;
    status: 'notDuplicate' | 'acceptedDuplicate' | 'rejectedDuplicate';
  }) => {
    try {
      await changeBeneficiaryStatus.mutateAsync({ beneficiaryId, status });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Status successfully changed!',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Failed to change status.',
      });
    }
  };

  const handleDeleteBeneficiary = async () => {
    if (!beneficiaryToDelete) return;

    try {
      await removeBeneficiary.mutateAsync({ beneficiaryId: beneficiaryToDelete.id });
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Beneficiary successfully deleted!',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Failed to delete beneficiary.',
      });
    }
    setBeneficiaryToDelete(null);
  };

  const onBeneficiaryRowClick = (beneficiaryRow: Beneficiary) =>
    navigate(`${APP_ROUTE.BeneficiaryList}/${beneficiaryRow.id}`);

  return (
    <PageContainer
      pageTitle="Beneficiary List"
      pageSubtitle="Manage beneficiaries"
      breadcrumbs={[{ href: `${APP_ROUTE.BeneficiaryList}`, name: 'Beneficiary List' }]}
    >
      <Tabs defaultValue="unresolved">
        <TabsList>
          <TabsTrigger
            value="unresolved"
            onClick={() => {
              setHiddenColumns({ status: false });
              setBeneficiaryFilters(() => ({
                isPrimary: 'false',
                status: '$null',
              }));
            }}
          >
            Unresolved
          </TabsTrigger>
          <TabsTrigger
            value="resolved"
            onClick={() => {
              setHiddenColumns(undefined);
              setBeneficiaryFilters(() => ({
                isPrimary: 'false',
                'status[not]': 'null',
              }));
            }}
          >
            Resolved
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <DataTable
        data={beneficiaryList?.data ?? []}
        pagination={beneficiaryList?.meta}
        isQueryLoading={isLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onRowClick={onBeneficiaryRowClick}
        columns={columns(handleStatusChange, setBeneficiaryToDelete)}
        hiddenColumns={hiddenColumns}
      />
      <ConfirmationDialog
        open={!!beneficiaryToDelete}
        title="Delete Beneficiary"
        body={`Are you sure you want to delete the benficiary "${beneficiaryToDelete?.firstName} ${beneficiaryToDelete?.familyName}"?`}
        onAction={handleDeleteBeneficiary}
        confirmButtonLoading={removeBeneficiary.isLoading}
        actionButtonVariant="destructive"
        onCancel={() => setBeneficiaryToDelete(null)}
      />
    </PageContainer>
  );
};
