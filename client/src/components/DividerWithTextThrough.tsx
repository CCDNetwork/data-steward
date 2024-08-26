import { cn } from '@/helpers/utils';

interface Props {
  dividerText: string;
  containerClassName?: string;
}

export const DividerWithTextThrough = ({
  dividerText,
  containerClassName,
}: Props) => {
  return (
    <div className={cn('relative', containerClassName)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-background px-2 text-muted-foreground">
          {dividerText}
        </span>
      </div>
    </div>
  );
};
