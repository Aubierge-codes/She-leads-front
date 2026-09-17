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
        dangerouslySetInnerHTML={{ __html: RECYCLING_SVG }}
      />
    </>
  );
}
