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
        description: 'Organisation successfully deleted!',
      });
    } catch (error: any) {
      toast({
        title: 'Something went wrong!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Failed to delete organisation.',
      });
    }
    setOrganizationToDelete(null);
  };

  const onOrganizationTableRowClick = (organizationRow: Organization) =>
    navigate(`${APP_ROUTE.Organizations}/${organizationRow.id}`);

  return (
    <PageContainer
      pageTitle="Organisations"
      pageSubtitle="On this page you can create and edit profiles for the organisations using the platform."
      headerNode={<AddOrganizationModal />}
      breadcrumbs={[{ href: `${APP_ROUTE.Organizations}`, name: 'Organisations' }]}
    >
      <DataTable
        data={organizations?.data ?? []}
        pagination={organizations?.meta}
        isQueryLoading={queryLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns(setOrganizationToDelete, onOrganizationTableRowClick)}
      />
      <ConfirmationDialog
        open={!!organizationToDelete}
        title="Delete Organisation"
        body={`Are you sure you want to delete organisation "${organizationToDelete?.name}"?`}
        onAction={handleDeleteOrganization}
        confirmButtonLoading={deleteOrganization.isLoading}
        actionButtonVariant="destructive"
        onCancel={() => setOrganizationToDelete(null)}
      />
    </PageContainer>
  );
};
