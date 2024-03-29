import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip as BaseTooltip } from '@/components/ui/tooltip';

interface TooltipProps {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
}
export const Tooltip = ({ children, tooltipContent }: TooltipProps) => {
  return (
    <TooltipProvider>
      <BaseTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-popover text-popover-foreground border">{tooltipContent}</TooltipContent>
      </BaseTooltip>
    </TooltipProvider>
  );
};
