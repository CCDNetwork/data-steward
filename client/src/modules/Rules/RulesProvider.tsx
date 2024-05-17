import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface RulesContextInterface {
  pagination: PaginationContext;
}

const RulesContext = createContext<RulesContextInterface>(undefined!);

export const RulesProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();

  const value = useMemo(() => ({ pagination }), [pagination]);

  return <RulesContext.Provider value={value}>{children}</RulesContext.Provider>;
};

export const useRulesProvider = () => {
  return useContext(RulesContext);
};

export const useRulesPagination = () => {
  const { pagination } = useRulesProvider();
  return pagination;
};

interface Props {
  children?: ReactNode;
}
