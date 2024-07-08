import { Loader2 } from 'lucide-react';

import { cn } from '@/helpers/utils';
import { IBreadcrumb } from '@/helpers/types';

import { Breadcrumb } from './BreadCrumb';

export const PageContainer = ({
  children,
  pageTitle,
  isLoading,
  headerNode,
  containerClassName,
  headerClassName,
  pageSubtitle,
  breadcrumbs,
}: {
  children: React.ReactNode;
  pageTitle: string;
  isLoading?: boolean;
  headerNode?: React.ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  pageSubtitle?: string;
  breadcrumbs?: IBreadcrumb[];
}) => {
  return isLoading ? (
    <div className="flex h-full justify-center items-center">
      <Loader2 className="w-10 h-10 lg:w-20 lg:h-20 animate-spin" />
    </div>
  ) : (
    <div className={cn('space-y-4', containerClassName)}>
      {breadcrumbs && (
        <div className="pt-2">
          <Breadcrumb breadcrumbs={breadcrumbs} />
        </div>
      )}
      <div className={cn('flex items-start justify-between space-y-2', headerClassName)}>
        <div className="flex">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-2xl font-bold tracking-tight">{pageTitle}</h2>
            {pageSubtitle && <h2 className="max-w-2xl leading-6 text-muted-foreground">{pageSubtitle}</h2>}
          </div>
        </div>
        {headerNode}
      </div>
      {children}
    </div>
  );
};
