'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  drift?: number;
  rotate?: number;
}

export function FloatingElement({
  children,
  className,
  delay = 0,
  duration = 6,
  drift = 12,
  rotate = 6,
}: FloatingElementProps) {
  return (
    <motion.div
      className={cn('pointer-events-none', className)}
      animate={{ y: [0, -drift, 0], rotate: [0, rotate, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
