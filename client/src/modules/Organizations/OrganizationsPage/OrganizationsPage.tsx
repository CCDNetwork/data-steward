import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { usePagination } from '@/helpers/pagination';
import { Organization } from '@/services/organizations';
import { AddOrganizationModal } from '@/modules/Organizations/OrganizationsPage/components';
import { useOrganizationMutation, useOrganizations } from '@/services/organizations/api';
import { APP_ROUTE } from '@/helpers/constants';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { toast } from '@/components/ui/use-toast';

import { columns } from './columns';

export const OrganizationsPage = () => {
  const navigate = useNavigate();
  const pagination = usePagination();
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);

  const { data: organizations, isLoading: queryLoading } = useOrganizations(pagination);

  const { deleteOrganization } = useOrganizationMutation();

  const handleDeleteOrganization = async () => {
    if (!organizationToDelete) return;

    try {
      await deleteOrganization.mutateAsync(organizationToDelete.id);
      toast({
        title: 'Success!',
        variant: 'default',
        description: 'Organization successfully deleted!',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Failed to delete organization.',
      });
    }
    setOrganizationToDelete(null);
  };

  const onOrganizationTableRowClick = (organizationRow: Organization) =>
    navigate(`${APP_ROUTE.Organizations}/${organizationRow.id}`);

  return (
    <PageContainer pageTitle="Organizations" headerNode={<AddOrganizationModal />}>
      <DataTable
        data={organizations?.data ?? []}
        pagination={organizations?.meta}
        isQueryLoading={queryLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns(setOrganizationToDelete)}
        onRowClick={onOrganizationTableRowClick}
      />
      <ConfirmationDialog
        open={!!organizationToDelete}
        title="Delete Organization"
        body={`Are you sure you want to delete "${organizationToDelete?.name}" organization?`}
        onAction={handleDeleteOrganization}
        confirmButtonLoading={deleteOrganization.isLoading}
        actionButtonVariant="destructive"
      />
    </PageContainer>
  );
};
