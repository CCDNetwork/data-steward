import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BadgeCheckIcon } from 'lucide-react';

const variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'backIn',
      duration: 0.4,
    },
  },
};

interface Props {
  onOpenChange: () => void;
}

export const DeduplicationSuccess = ({ onOpenChange }: Props) => {
  return (
    <motion.section
      className="min-h-[520px] w-full h-full flex flex-col items-center justify-center gap-4 md:gap-2 text-center"
      initial="hidden"
      variants={variants}
      animate="visible"
    >
      <BadgeCheckIcon fill="#028493" stroke="white" strokeWidth={1} className="w-40 h-40" />
      <h4 className="text-2xl font-semibold tracking-tight md:text-3xl">Deduplication successful!</h4>
      <p className="text-muted-foreground">You can now close the wizard.</p>
      <div className="flex items-center mt-6">
        <Button onClick={onOpenChange}>Close</Button>
      </div>
    </motion.section>
  );
};
