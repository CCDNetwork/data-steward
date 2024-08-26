import { createContext, useMemo, ReactNode, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

interface DeduplicationContextInterface {
  deduplicationWizardError: any;
  setDeduplicationWizardError: React.Dispatch<React.SetStateAction<any>>;
}

const DeduplicationContext = createContext<DeduplicationContextInterface>(
  undefined!,
);

export const DeduplicationProvider = ({ children = <Outlet /> }: Props) => {
  const [deduplicationWizardError, setDeduplicationWizardError] =
    useState<any>(undefined);

  const value = useMemo(
    () => ({ deduplicationWizardError, setDeduplicationWizardError }),
    [deduplicationWizardError, setDeduplicationWizardError],
  );

  return (
    <DeduplicationContext.Provider value={value}>
      {children}
    </DeduplicationContext.Provider>
  );
};

export const useDeduplicationProvider = () => {
  return useContext(DeduplicationContext);
};

interface Props {
  children?: ReactNode;
}
