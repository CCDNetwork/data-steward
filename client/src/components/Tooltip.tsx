import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as BaseTooltip,
} from '@/components/ui/tooltip';
import { cn } from '@/helpers/utils';

interface TooltipProps {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  className?: string;
}
export const Tooltip = ({
  children,
  tooltipContent,
  className,
}: TooltipProps) => {
  return (
    <TooltipProvider>
      <BaseTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={cn('bg-popover text-popover-foreground border', className)}
        >
          {tooltipContent}
        </TooltipContent>
      </BaseTooltip>
    </TooltipProvider>
  );
};
