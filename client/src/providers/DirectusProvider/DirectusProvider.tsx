const { VITE_DIRECTUS_URL, VITE_DIRECTUS_TOKEN } = import.meta.env;
import { createContext, ReactNode, useContext } from 'react';
import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import {
  DirectusSchema,
  HomepageData,
} from '@/providers/DirectusProvider/types.ts';
import { useLanguage } from '@/providers/LanguageProvider.tsx';

type DirectusProviderProps = {
  children: ReactNode;
};

type DirectusProviderState = {
  useHomepageData: UseQueryResult<HomepageData>;
};

const DirectusProviderContext = createContext<DirectusProviderState>(
  undefined!
);

export const DirectusProvider = ({
  children = <Outlet />,
}: DirectusProviderProps) => {
  const { language } = useLanguage();

  const directusClient = createDirectus<DirectusSchema>(VITE_DIRECTUS_URL)
    .with(staticToken(VITE_DIRECTUS_TOKEN))
    .with(rest());

  const getHomepageData = async () => {
    const data = await directusClient.request(
      readItems('homepage_translations', {
        filter: {
          languages_code: {
            _eq: language,
          },
        },
      })
    );
    return data[0];
  };

  const useHomepageData = useQuery([language], getHomepageData);

  const value = {
    useHomepageData,
  };

  return (
    <DirectusProviderContext.Provider value={value}>
      {children}
    </DirectusProviderContext.Provider>
  );
};

export const useDirectus = () => {
  const context = useContext(DirectusProviderContext);

  if (context === undefined)
    throw new Error('useDirectus must be used within a DirectusProvider');

  return context;
};
