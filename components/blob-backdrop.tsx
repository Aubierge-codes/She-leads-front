'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlobBackdropProps {
  className?: string;
  /** Degrees the blob slowly rotates back and forth. */
  rotate?: number;
  duration?: number;
}

/** Soft organic color shape sitting behind an illustration, like a hand-drawn blob. */
export function BlobBackdrop({ className, rotate = 6, duration = 10 }: BlobBackdropProps) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ rotate: [0, rotate, 0, -rotate, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'pointer-events-none rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-primary/10',
        className,
      )}
    />
  );
}
