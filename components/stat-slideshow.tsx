'use client';

import { motion } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
}

interface StatSlideshowProps {
  stats: Stat[];
  durationSeconds?: number;
}

export function StatSlideshow({ stats, durationSeconds = 18 }: StatSlideshowProps) {
  const items = [...stats, ...stats];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max items-center gap-10"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: durationSeconds, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((s, i) => (
          <span key={i} className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
            <span className="font-heading text-lg font-bold text-foreground">{s.value}</span>
            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{s.label}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
