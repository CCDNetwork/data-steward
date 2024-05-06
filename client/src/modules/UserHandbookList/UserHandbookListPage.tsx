import { PageContainer } from '@/components/PageContainer';
import { useHandbooks } from '@/services/handbooks/api';

import { SortDirection, usePagination } from '@/helpers/pagination';
import { HandbookItem } from './components';

export const UserHandbookListPage = () => {
  const pagination = usePagination();

  const { data: handbooksData, isLoading } = useHandbooks({
    ...pagination,
    pageSize: 999,
    sortBy: 'createdAt',
    sortDirection: SortDirection.Asc,
  });

  return (
    <PageContainer pageTitle="Handbook" isLoading={isLoading} pageSubtitle="Handbook List">
      <div className="flex flex-col gap-4 pb-8">
        {handbooksData?.data.map((handbook) => <HandbookItem key={handbook.id} {...handbook} />)}
      </div>
    </PageContainer>
  );
};
