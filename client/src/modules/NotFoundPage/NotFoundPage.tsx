import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <main className="grid h-[100svh] sm:h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center animate-appear">
        <p className="font-semibold text-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    </main>
  );
};
