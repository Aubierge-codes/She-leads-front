'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { RECYCLING_SVG, RECYCLING_CSS } from '@/components/mission-recycling-svg';

export function MissionIllustration({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: RECYCLING_CSS }} />
      <motion.div
        ref={containerRef}
        className={className}
        onViewportEnter={() => {
          containerRef.current?.querySelector('svg')?.classList.add('animated');
        }}
        viewport={{ once: true, amount: 0.4 }}
        animate={{ y: [0, -10, 0], rotate: [0, 1, 0, -1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        dangerouslySetInnerHTML={{ __html: RECYCLING_SVG }}
      />
    </>
  );
}
