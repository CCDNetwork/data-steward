import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VisibilityState } from '@tanstack/react-table';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { APP_ROUTE } from '@/helpers/constants';
import { usePagination } from '@/helpers/pagination';
import { Beneficiary, useBeneficiaryList } from '@/services/beneficiaryList';
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
  const [hiddenColumns, setHiddenColumns] = useState<VisibilityState | undefined>({ status: false });

  const { data: beneficiaryList, isLoading } = useBeneficiaryList({ ...pagination, filters: beneficiaryFilters });

  const onBeneficiaryRowClick = (beneficiaryRow: Beneficiary) =>
    navigate(`${APP_ROUTE.BeneficiaryList}/${beneficiaryRow.id}`);

  return (
    <PageContainer
      pageTitle="Manage Duplicates"
      pageSubtitle="On this page you can view and manage duplicates. The Unresolved tab will show you potential duplicates which you should check. The Resolved tab will show you potential duplicates which have already been resolved."
      breadcrumbs={[{ href: `${APP_ROUTE.BeneficiaryList}`, name: 'Manage Duplicates' }]}
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
        columns={columns}
        hiddenColumns={hiddenColumns}
      />
    </PageContainer>
  );
};
