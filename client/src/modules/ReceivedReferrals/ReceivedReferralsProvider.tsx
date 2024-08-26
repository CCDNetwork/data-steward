import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface ReceivedReferralsContextInterface {
  pagination: PaginationContext;
}

const ReceivedReferralsContext =
  createContext<ReceivedReferralsContextInterface>(undefined!);

export const ReceivedReferralsProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();

  const value = useMemo(() => ({ pagination }), [pagination]);

  return (
    <ReceivedReferralsContext.Provider value={value}>
      {children}
    </ReceivedReferralsContext.Provider>
  );
};

export const useReceivedReferralsProvider = () => {
  return useContext(ReceivedReferralsContext);
};

export const useReceivedReferralsPagination = () => {
  const { pagination } = useReceivedReferralsProvider();
  return pagination;
};

interface Props {
  children?: ReactNode;
}
