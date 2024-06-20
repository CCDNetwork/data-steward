import { cn } from '@/helpers/utils';
import { useRef, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  shouldTrigger: boolean;
  containerClassName?: string;
}

export const BottomScrolledContainer = ({ shouldTrigger, children, containerClassName }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && shouldTrigger) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [children, shouldTrigger]);

  return (
    <div ref={containerRef} className={cn('overflow-y-auto', containerClassName)}>
      {children}
    </div>
  );
};
