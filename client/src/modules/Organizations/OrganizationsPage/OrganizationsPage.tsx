import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { usePagination } from '@/helpers/pagination';

import { Organization } from '@/services/organizations';
import { AddOrganizationModal } from '@/modules/Organizations/OrganizationsPage/components';

import { columns } from './columns';
import { useOrganizations } from '@/services/organizations/api';

export const OrganizationsPage = () => {
  const navigate = useNavigate();
  const pagination = usePagination();
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const { data: organizations, isLoading: queryLoading } = useOrganizations(pagination);

  const onOrganizationTableRowClick = (organizationRow: Organization) =>
    navigate(`/organizations/${organizationRow.id}`);

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
        columns={columns()}
        onRowClick={onOrganizationTableRowClick}
      />
    </PageContainer>
  );
};
