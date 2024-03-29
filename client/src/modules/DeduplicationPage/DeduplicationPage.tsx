import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { usePagination } from '@/helpers/pagination';
import { DUMMY_DATA } from '@/modules/DeduplicationPage/constants';

import { columns } from './columns';
import { Button } from '@/components/ui/button';

export const DeduplicationPage = () => {
  const pagination = usePagination();

  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  return (
    <PageContainer
      pageTitle="Deduplication"
      headerNode={
        <div className="flex gap-3">
          <Button type="button">Upload list</Button>
          <Button type="button">Upload revised list</Button>
        </div>
      }
    >
      <DataTable
        data={DUMMY_DATA.data}
        pagination={DUMMY_DATA.meta}
        isQueryLoading={false}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns}
      />
    </PageContainer>
  );
};
