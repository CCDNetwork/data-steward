import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ReactNode } from 'react';

interface Props {
  label: ReactNode;
  isLoading: boolean;
  skeletonClassName?: string;
}
export const LabelWithLoading = ({
  label,
  isLoading,
  skeletonClassName,
}: Props) => {
  return isLoading ? <Skeleton className={skeletonClassName} /> : label;
};
