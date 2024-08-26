import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface UsersContextInterface {
  pagination: PaginationContext;
}

const UsersContext = createContext<UsersContextInterface>(undefined!);

export const UsersProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();

  const value = useMemo(() => ({ pagination }), [pagination]);

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export const useUsersProvider = () => {
  return useContext(UsersContext);
};

export const useUsersPagination = () => {
  const { pagination } = useUsersProvider();
  return pagination;
};

interface Props {
  children?: ReactNode;
}
