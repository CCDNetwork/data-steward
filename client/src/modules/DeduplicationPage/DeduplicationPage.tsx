import { useState } from 'react';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { useDeduplicationListings } from '@/services/deduplication';
import { SortDirection, usePagination } from '@/helpers/pagination';

import { columns } from './columns';
import { UploadModal } from './components/UploadModal';
import { APP_ROUTE } from '@/helpers/constants';

export const DeduplicationPage = () => {
  const pagination = usePagination({ initialPagination: { sortBy: 'createdAt', sortDirection: SortDirection.Desc } });
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [deduplicationType, setDeduplicationType] = useState<'single' | 'multiple'>('single');

  const { data: listings, isLoading: queryLoading } = useDeduplicationListings(pagination);

  const handleDeduplicationButtonClick = (type: 'single' | 'multiple') => {
    setUploadModalOpen(true);
    setDeduplicationType(type);
  };

  return (
    <PageContainer
      pageTitle="Manage cases"
      pageSubtitle="Manage deduplication cases"
      headerNode={
        <div className="flex sm:flex-row flex-col gap-3">
          <Button type="button" onClick={() => handleDeduplicationButtonClick('single')}>
            Internal deduplication
          </Button>
          <Button type="button" onClick={() => handleDeduplicationButtonClick('multiple')}>
            Registry deduplication
          </Button>
        </div>
      }
      breadcrumbs={[{ href: `${APP_ROUTE.Deduplication}`, name: 'Manage cases' }]}
    >
      <DataTable
        data={listings?.data ?? []}
        pagination={listings?.meta}
        isQueryLoading={queryLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns}
      />

      <UploadModal isOpen={uploadModalOpen} setIsOpen={setUploadModalOpen} deduplicationType={deduplicationType} />
    </PageContainer>
  );
};
