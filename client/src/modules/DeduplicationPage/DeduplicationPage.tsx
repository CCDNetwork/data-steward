import { useState } from 'react';
import { Wand2Icon } from 'lucide-react';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { useDeduplicationListings } from '@/services/deduplication';
import { SortDirection, usePagination } from '@/helpers/pagination';
import { APP_ROUTE } from '@/helpers/constants';

import { columns } from './columns';
import { DeduplicationWizard } from './components';

export const DeduplicationPage = () => {
  const pagination = usePagination({ initialPagination: { sortBy: 'createdAt', sortDirection: SortDirection.Desc } });
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const [isDeduplicationWizardOpen, setIsDeduplicationWizardOpen] = useState<boolean>(false);

  const { data: listings, isLoading: queryLoading } = useDeduplicationListings(pagination);

  const handleDeduplicationWizardOpen = () => {
    setIsDeduplicationWizardOpen(true);
  };

  return (
    <PageContainer
      pageTitle="Manage cases"
      pageSubtitle="Manage deduplication cases"
      headerNode={
        <Button type="button" onClick={handleDeduplicationWizardOpen}>
          <Wand2Icon className="mr-2 w-4 h-4" />
          Deduplication Wizard
        </Button>
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

      <DeduplicationWizard isOpen={isDeduplicationWizardOpen} setIsOpen={setIsDeduplicationWizardOpen} />
    </PageContainer>
  );
};
