'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: string;
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
        className="flex w-max items-center gap-8"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: durationSeconds, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((s, i) => (
          <span key={i} className="flex shrink-0 items-center gap-8 whitespace-nowrap">
            <span className="flex items-baseline gap-2">
              {s.icon && (
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${s.color ?? '#35502E'}1A`, color: s.color ?? '#35502E' }}
                >
                  <s.icon className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="font-heading text-lg font-bold text-foreground">{s.value}</span>
              <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{s.label}</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
