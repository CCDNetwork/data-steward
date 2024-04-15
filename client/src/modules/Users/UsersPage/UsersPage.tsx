import { useNavigate } from 'react-router-dom';

import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import { usePagination } from '@/helpers/pagination';
import { useUsers } from '@/services/users/api';
import { AddUserModal } from '@/modules/Users/UsersPage/components';
import { User } from '@/services/users';

import { columns } from './columns';
import { APP_ROUTE } from '@/helpers/constants';

export const UsersPage = () => {
  const navigate = useNavigate();
  const pagination = usePagination();
  const { currentPage, onPageChange, onPageSizeChange, onSortChange, onSearchChange } = pagination;

  const { data: users, isLoading: queryLoading } = useUsers(pagination);

  const onUserTableRowClick = (userRow: User) => navigate(`${APP_ROUTE.Users}/${userRow.id}`);

  return (
    <PageContainer pageTitle="Users" headerNode={<AddUserModal />}>
      <DataTable
        data={users?.data ?? []}
        pagination={users?.meta}
        isQueryLoading={queryLoading}
        currentPage={currentPage}
        pageClicked={onPageChange}
        pageSizeClicked={onPageSizeChange}
        headerClicked={onSortChange}
        onSearchChange={onSearchChange}
        columns={columns()}
        onRowClick={onUserTableRowClick}
      />
    </PageContainer>
  );
};
