import { cn } from '@/helpers/utils';
import { Loader2 } from 'lucide-react';

export const PageContainer = ({
  children,
  pageTitle,
  isLoading,
  headerNode,
  containerClassName,
  headerClassName,
}: {
  children: React.ReactNode;
  pageTitle: string;
  isLoading?: boolean;
  headerNode?: React.ReactNode;
  containerClassName?: string;
  headerClassName?: string;
}) => {
  return isLoading ? (
    <div className="flex flex-1 justify-center items-center">
      <Loader2 className="w-14 h-14 lg:w-28 lg:h-28 animate-spin" />
    </div>
  ) : (
    <div className={cn('space-y-4 sm:p-4 md:p-6 p-2 items-center justify-center', containerClassName)}>
      <div className={cn('flex items-center justify-between space-y-2', headerClassName)}>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{pageTitle}</h2>
        {headerNode}
      </div>
      {children}
    </div>
  );
};
