'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Stat {
  value: string;
  label: string;
}

interface StatSlideshowProps {
  stats: Stat[];
  intervalMs?: number;
}

export function StatSlideshow({ stats, intervalMs = 2800 }: StatSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || stats.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % stats.length), intervalMs);
    return () => clearInterval(timer);
  }, [paused, stats.length, intervalMs]);

  const stat = stats[index];
  if (!stat) return null;

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="flex flex-col items-center"
        >
          <span className="font-heading text-3xl font-bold text-foreground">{stat.value}</span>
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{stat.label}</span>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-1.5">
        {stats.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show stat ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-4 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/40',
            )}
          />
        ))}
      </div>
    </div>
  );
}
