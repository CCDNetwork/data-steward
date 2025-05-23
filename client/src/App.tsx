import { RouterProvider } from 'react-router-dom';
import {
  QueryClientConfig,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';

import { router } from './router';
import { LanguageProvider } from '@/providers/LanguageProvider.tsx';
import { DirectusProvider } from '@/providers/DirectusProvider';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      suspense: false,
    },
    mutations: {
      retry: false,
    },
  },
};

const queryClient = new QueryClient(queryClientConfig);

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <DirectusProvider>
            <Toaster />
            <RouterProvider router={router} />
          </DirectusProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
