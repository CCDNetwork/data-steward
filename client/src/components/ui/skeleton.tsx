import { cn } from '@/helpers/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted-foreground/10',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
