import { cn } from '@/helpers/utils';
import { Loader2 } from 'lucide-react';

export const PageContainer = ({
  children,
  pageTitle,
  isLoading,
  headerNode,
  containerClassName,
  headerClassName,
  pageSubtitle,
}: {
  children: React.ReactNode;
  pageTitle: string;
  isLoading?: boolean;
  headerNode?: React.ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  pageSubtitle?: string;
}) => {
  return isLoading ? (
    <div className="flex h-full justify-center items-center">
      <Loader2 className="w-10 h-10 lg:w-20 lg:h-20 animate-spin" />
    </div>
  ) : (
    <div className={cn('space-y-4 sm:p-4 md:p-6 p-2 items-center justify-center', containerClassName)}>
      <div className={cn('flex items-center justify-between space-y-2', headerClassName)}>
        <div className="flex flex-col">
          <h2 className="text-2xl sm:text-2xl font-bold tracking-tight">{pageTitle}</h2>
          {pageSubtitle && <h2 className="max-w-2xl leading-6 text-muted-foreground">{pageSubtitle}</h2>}
        </div>
        {headerNode}
      </div>
      {children}
    </div>
  );
};
