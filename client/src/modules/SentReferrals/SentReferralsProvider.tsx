import { createContext, useMemo, ReactNode, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { PaginationContext, usePagination } from '@/helpers/pagination';

interface SentReferralsContextInterface {
  pagination: PaginationContext;
  viewOnlyEnabled: boolean;
  setViewOnlyEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const SentReferralsContext = createContext<SentReferralsContextInterface>(
  undefined!,
);

export const SentReferralsProvider = ({ children = <Outlet /> }: Props) => {
  const pagination = usePagination();
  const [viewOnlyEnabled, setViewOnlyEnabled] = useState<boolean>(true);

  const value = useMemo(
    () => ({ pagination, viewOnlyEnabled, setViewOnlyEnabled }),
    [pagination, viewOnlyEnabled, setViewOnlyEnabled],
  );

  return (
    <SentReferralsContext.Provider value={value}>
      {children}
    </SentReferralsContext.Provider>
  );
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
