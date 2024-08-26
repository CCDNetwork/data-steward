import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface OrganizationsContextInterface {
  pagination: PaginationContext;
}

const OrganizationsContext = createContext<OrganizationsContextInterface>(
  undefined!,
);

export const OrganizationsProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();

  const value = useMemo(() => ({ pagination }), [pagination]);

  return (
    <OrganizationsContext.Provider value={value}>
      {children}
    </OrganizationsContext.Provider>
  );
};

export const useOrganizationsProvider = () => {
  return useContext(OrganizationsContext);
};

export const useOrganizationsPagination = () => {
  const { pagination } = useOrganizationsProvider();
  return pagination;
};

interface Props {
  children?: ReactNode;
}
