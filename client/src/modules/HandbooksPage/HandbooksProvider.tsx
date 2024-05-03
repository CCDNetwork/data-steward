import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface HandbooksContextInterface {
  pagination: PaginationContext;
}

const HandbooksContext = createContext<HandbooksContextInterface>(undefined!);

export const HandbooksProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();

  const value = useMemo(() => ({ pagination }), [pagination]);

  return <HandbooksContext.Provider value={value}>{children}</HandbooksContext.Provider>;
};

export const useHandbooksProvider = () => {
  return useContext(HandbooksContext);
};

export const useHandbooksPagination = () => {
  const { pagination } = useHandbooksProvider();
  return pagination;
};

interface Props {
  children?: ReactNode;
}
