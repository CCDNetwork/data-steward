import { Link, Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/providers/GlobalProvider';

import { ModeToggle } from '@/components/ModeToggle';
import { cn } from '@/helpers/utils';

interface Props {
  title: string;
  subtitle: string;
  titleClassName?: string;
  subtitleClassName?: string;
  showLink?: boolean;
  linkLabel?: string;
  linkNavigateTo?: string;
  children?: React.ReactNode;
  boxClassName?: string;
  shouldRedirect?: boolean;
  isLoading?: boolean;
  isError?: boolean;
}

export const PublicPage = ({
  children = <Outlet />,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  showLink,
  linkNavigateTo,
  linkLabel,
  boxClassName,
  shouldRedirect = true,
  isLoading = false,
  isError = false,
}: Props) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn && shouldRedirect) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center">
        <Loader2 className="w-28 h-28 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <main className="grid min-h-[100svh] place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-destructive">Error</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Oops, something went wrong</h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            An unexpected error has occured, please try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="sm:container px-2 flex min-h-[100svh] w-screen flex-col items-center justify-center">
      <div
        className={cn(
          'mx-auto flex w-full my-4 h-full flex-col items-center justify-center space-y-6 sm:px-0 px-6',
          boxClassName,
        )}
      >
        <div className="flex flex-col space-y-2 text-center">
          <img
            src="https://placehold.co/400"
            alt="company-logo"
            loading="lazy"
            className="mx-auto mb-2 w-14 h-14 object-contain"
          />
          <h1 className={cn('text-2xl font-semibold tracking-tight', titleClassName)}>{title}</h1>
          <p className={cn('text-sm text-muted-foreground whitespace-pre-line', subtitleClassName)}>{subtitle}</p>
        </div>
        {children}
        {showLink && (
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link to={linkNavigateTo ?? '/'} className="underline underline-offset-4">
              {linkLabel}
            </Link>
          </p>
        )}
      </div>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
};
