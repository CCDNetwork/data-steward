import { createContext, useMemo, ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

interface DeduplicationContextInterface {
  x: number;
}

const DeduplicationContext = createContext<DeduplicationContextInterface>(undefined!);

export const DeduplicationProvider = ({ children = <Outlet /> }: Props) => {
  const x = 0;

  const value = useMemo(() => ({ x }), [x]);

  return <DeduplicationContext.Provider value={value}>{children}</DeduplicationContext.Provider>;
};

export const useDeduplicationProvider = () => {
  return useContext(DeduplicationContext);
};

interface Props {
  children?: ReactNode;
}
