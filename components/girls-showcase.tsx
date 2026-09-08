'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Leaf, Sparkles, Sprout } from 'lucide-react';
import { PlaceholderImage } from '@/components/placeholder-image';
import { FloatingElement } from '@/components/floating-element';
import { cn } from '@/lib/utils';
import { girlsData, CATEGORY_LABELS, type GirlCategory, type GirlStory } from '@/data/girls';

const CATEGORIES: GirlCategory[] = ['school', 'community', 'environment'];
const AUTOPLAY_MS = 6000;
const CATEGORY_VARIANTS: Record<GirlCategory, 'camera' | 'users' | 'leaf'> = {
  school: 'camera',
  community: 'users',
  environment: 'leaf',
};

interface GirlsShowcaseProps {
  girls?: GirlStory[];
}

export function GirlsShowcase({ girls = girlsData }: GirlsShowcaseProps) {
  const [category, setCategory] = useState<GirlCategory>('school');
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  const slides = useMemo(() => girls.filter((g) => g.category === category), [girls, category]);
  const slide = slides[index] ?? slides[0];

  const goTo = (i: number) => {
    if (slides.length === 0) return;
    setIndex(((i % slides.length) + slides.length) % slides.length);
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const selectCategory = (c: GirlCategory) => {
    setCategory(c);
    setIndex(0);
  };

  // Track whether the section is in view, to scope keyboard nav and autoplay.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay.
  useEffect(() => {
    if (paused || !inView || slides.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, inView, slides.length, category]);

  // Keyboard navigation, only while the section is in view.
  useEffect(() => {
    if (!inView) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, index, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (!slide) return null;

  return (
    <section
      id="girls-in-action"
      ref={sectionRef}
      className="relative overflow-hidden py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <FloatingElement
        delay={0}
        duration={7}
        drift={10}
        className="hidden md:block absolute top-16 left-8 w-9 h-9 rounded-full bg-primary/10 items-center justify-center text-primary flex"
      >
        <Leaf className="w-4 h-4" />
      </FloatingElement>
      <FloatingElement
        delay={1.5}
        duration={5.5}
        drift={8}
        rotate={10}
        className="hidden md:flex absolute bottom-24 right-10 w-8 h-8 rounded-full bg-secondary/15 items-center justify-center text-secondary"
      >
        <Sprout className="w-4 h-4" />
      </FloatingElement>
      <FloatingElement
        delay={0.8}
        duration={4.5}
        drift={6}
        rotate={14}
        className="hidden md:flex absolute top-1/2 right-1/4 w-6 h-6 rounded-full bg-accent items-center justify-center text-primary/70"
      >
        <Sparkles className="w-3 h-3" />
      </FloatingElement>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-3xl px-6"
      >
        <div className="max-w-2xl mb-8">
          <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Girls in Action</span>
          <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            80 girls. Different communities. One movement.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Eco Girls Collective brings girls together through school-based learning, community engagement, and
            environmental action — 80 girls making an impact across every part of the program.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-6 overflow-x-auto pb-2 mb-8 border-b border-border">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => selectCategory(c)}
              className={cn(
                'relative pb-3 text-sm font-semibold whitespace-nowrap transition-colors',
                category === c ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {CATEGORY_LABELS[c]}
              {category === c && (
                <motion.span
                  layoutId="girls-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Slideshow */}
        <div
          className="grid gap-8 lg:grid-cols-5 lg:items-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${slide.id}`}
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.98 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <div className="relative">
                  <PlaceholderImage
                    label={slide.photoLabel}
                    variant={CATEGORY_VARIANTS[category]}
                    className="rounded-2xl h-36 md:h-44"
                  />
                  <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-linear-to-t from-black/55 to-transparent px-5 py-4">
                    <p className="font-heading text-lg font-bold text-white">{slide.title}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-card/90 border border-border shadow-sm hover:bg-card transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full bg-card/90 border border-border shadow-sm hover:bg-card transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                key={`${category}-${slide.id}-progress`}
                className="h-full bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: paused || !inView ? '0%' : '100%' }}
                transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${slide.id}-text`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {String(index + 1).padStart(2, '0')} — {slides.length} {CATEGORY_LABELS[category]} stories
                </span>
                <h3 className="font-heading mt-2 text-xl font-bold text-foreground">{slide.title}</h3>
                {slide.name && <p className="mt-1 text-sm text-primary font-medium">{slide.name}</p>}
                <p className="mt-3 text-muted-foreground">{slide.description}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index ? 'w-6 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/40',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
