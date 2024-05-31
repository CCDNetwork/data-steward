import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface SentReferralsContextInterface {
  pagination: PaginationContext;
}

const SentReferralsContext = createContext<SentReferralsContextInterface>(undefined!);

export const SentReferralsProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();

  const value = useMemo(() => ({ pagination }), [pagination]);

  return <SentReferralsContext.Provider value={value}>{children}</SentReferralsContext.Provider>;
};

export const useSentReferralsProvider = () => {
  return useContext(SentReferralsContext);
};

export const useSentReferralsPagination = () => {
  const { pagination } = useSentReferralsProvider();
  return pagination;
};

interface Props {
  children?: ReactNode;
}
