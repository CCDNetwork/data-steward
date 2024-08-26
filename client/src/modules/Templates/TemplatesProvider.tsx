import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface TemplatesContextInterface {
  pagination: PaginationContext;
}

const TemplatesContext = createContext<TemplatesContextInterface>(undefined!);

export const TemplatesProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();

  const value = useMemo(() => ({ pagination }), [pagination]);

  return (
    <TemplatesContext.Provider value={value}>
      {children}
    </TemplatesContext.Provider>
  );
};

export const useTemplatesProvider = () => {
  return useContext(TemplatesContext);
};

export const useTemplatesPagination = () => {
  const { pagination } = useTemplatesProvider();
  return pagination;
};

interface Props {
  children?: ReactNode;
}
