import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface HandbookContextInterface {
  pagination: PaginationContext;
}

const HandbookContext = createContext<HandbookContextInterface>(undefined!);

export const HandbookProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();

  const value = useMemo(() => ({ pagination }), [pagination]);

  return <HandbookContext.Provider value={value}>{children}</HandbookContext.Provider>;
};

export const useHandbookProvider = () => {
  return useContext(HandbookContext);
};

export const useHandbookPagination = () => {
  const { pagination } = useHandbookProvider();
  return pagination;
};

interface Props {
  children?: ReactNode;
}
