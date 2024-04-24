import { useState } from 'react';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { useDeduplicationListings } from '@/services/deduplication';
import { usePagination } from '@/helpers/pagination';

import { columns } from './columns';
import { UploadModal } from './components/UploadModal';

export const DeduplicationPage = () => {
  const pagination = usePagination();
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
      pageTitle="Deduplication"
      pageSubtitle="Deduplication list"
      headerNode={
        <div className="flex gap-3">
          <Button type="button" onClick={() => handleDeduplicationButtonClick('single')}>
            Internal deduplication
          </Button>
          <Button type="button" onClick={() => handleDeduplicationButtonClick('multiple')}>
            Registry deduplication
          </Button>
        </div>
      }
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
