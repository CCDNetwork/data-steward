import { ReactElement, useState, useEffect } from 'react';

import { useGlobalErrors } from '@/providers/GlobalProvider';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DynamicRouteProps = {
  component: ReactElement;
};

export const DynamicRoute = ({ component }: DynamicRouteProps) => {
  const navigate = useNavigate();
  const [is404Error, setIs404Error] = useState(false);
  const { collectionNotFound, onSetCollectionNotFound } = useGlobalErrors();

  useEffect(() => {
    if (collectionNotFound) {
      setIs404Error(true);
      onSetCollectionNotFound(false);
    }
  }, [collectionNotFound, onSetCollectionNotFound]);

  if (is404Error) {
    return (
      <main className="grid min-h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-destructive">Error</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Oops, something went wrong</h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">An unexpected error has occured.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return component;
};
