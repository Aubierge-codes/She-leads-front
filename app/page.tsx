'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WorldMapBackdrop } from '@/components/world-map-backdrop';
import { MissionIllustration } from '@/components/mission-illustration';
import { GirlsShowcase } from '@/components/girls-showcase';
import { cn } from '@/lib/utils';
import { StatSlideshow } from '@/components/stat-slideshow';
import { ProgramCard } from '@/components/program-card';
import { StoryCard } from '@/components/story-card';
import { ReachSection } from '@/components/reach-section';
import { FaqAccordion } from '@/components/faq-accordion';
import { ImpactCharts } from '@/components/impact-charts';
import {
  Leaf,
  Globe,
  Users,
  ArrowRight,
  Recycle,
  GraduationCap,
  Map,
  Calendar,
  BookOpen,
  Target,
  Trash2,
  HandCoins,
  Award,
  Package,
  Handshake,
  UserPlus,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import { dashboardApi, newsletterApi, apiErrorMessage, type DashboardSummary } from '@/lib/api';
import { PartnershipModal } from '@/components/partnership-modal';

const NAV_LINKS = [
  { label: 'About', href: '#mission' },
  { label: 'Programs', href: '#programs' },
  { label: 'Our Impact', href: '#impact' },
  { label: 'Stories', href: '#stories' },
  { label: 'Get Involved', href: '#support' },
];

const PROGRAMS = [
  {
    icon: Leaf,
    title: 'Environmental Clubs',
    description: 'Supporting girls to create and lead environmental clubs in schools.',
    photoLabel: 'Add photo: environmental club meeting',
    illustrationSrc: '/images/illustrations/team-collaboration.svg',
  },
  {
    icon: Recycle,
    title: 'Community Cleanups',
    description: 'Organizing practical environmental action in local communities.',
    photoLabel: 'Add photo: community cleanup day',
  },
  {
    icon: BookOpen,
    title: 'Environmental Education',
    description: 'Helping girls understand climate, waste, sustainability and environmental responsibility.',
    photoLabel: 'Add photo: education session',
    illustrationSrc: '/images/illustrations/teaching.svg',
  },
  {
    icon: Users,
    title: "Girls' Leadership",
    description: 'Building confidence, leadership, teamwork and problem-solving skills.',
    photoLabel: 'Add photo: girls leading a session',
    illustrationSrc: '/images/illustrations/presentation.svg',
  },
  {
    icon: Target,
    title: 'Community Action',
    description: 'Turning ideas into projects that respond to local environmental challenges.',
    photoLabel: 'Add photo: community project in progress',
    illustrationSrc: '/images/illustrations/collaboration.svg',
  },
  {
    icon: Trash2,
    title: 'Waste Management',
    description: 'Tracking and reducing waste through practical community activities.',
    photoLabel: 'Add photo: sorting recyclable materials',
  },
];

const WAYS_TO_PARTICIPATE = [
  { icon: HandCoins, title: 'Give', description: 'Make a financial contribution.' },
  { icon: Award, title: 'Sponsor', description: 'Support an environmental activity or program.' },
  { icon: Package, title: 'Donate Supplies', description: 'Provide useful equipment or educational materials.' },
  { icon: Handshake, title: 'Partner', description: 'Work with Eco Girls Collective as an organization or company.' },
  { icon: UserPlus, title: 'Volunteer', description: 'Share your time and skills.' },
];

export default function LandingPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [partnershipModalOpen, setPartnershipModalOpen] = useState(false);

  useEffect(() => {
    dashboardApi.summary().then(setSummary).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSubmitting(true);
    try {
      await newsletterApi.subscribe(newsletterEmail);
      toast.success("You're subscribed — thanks for staying rooted with us.");
      setNewsletterEmail('');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not subscribe right now'));
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-4 md:top-6 inset-x-4 md:inset-x-6 lg:inset-x-8 z-50">
        <div
          className={cn(
            'mx-auto max-w-7xl flex items-center justify-between gap-3 rounded-full border border-border bg-card/95 px-4 py-3 transition-[box-shadow,backdrop-filter] duration-300 sm:px-5 lg:gap-4 lg:px-6 lg:py-3.5 xl:px-8 xl:py-4',
            scrolled ? 'shadow-xs backdrop-blur-sm' : 'shadow-none backdrop-blur-none',
          )}
        >
          <div className="flex items-center gap-2 lg:gap-2.5 text-foreground font-bold text-base sm:text-lg xl:text-xl font-heading min-w-0">
            <span className="relative w-8 h-8 lg:w-9 lg:h-9 shrink-0">
              <Image src="/images/eco-girls-logo-icon.png" alt="Eco Girls Collective logo" fill className="object-contain" />
            </span>
            <span className="truncate max-[380px]:hidden">ECO GIRLS COLLECTIVE</span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm xl:text-base font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <Link href="/dashboard" className="hidden lg:block">
              <Button variant="outline" className="rounded-full">
                Dashboard
              </Button>
            </Link>
            <Link href="/donate">
              <Button className="rounded-full">Support Us</Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-foreground hover:bg-muted transition-colors shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden mx-auto mt-2 max-w-7xl rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-sm p-3 flex flex-col gap-1"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-1 border-t border-border" />
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Dashboard
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden pb-20 md:pb-28">
          <WorldMapBackdrop className="pointer-events-none absolute inset-0 -z-20 h-full w-full" />
          <div className="container mx-auto px-6 pt-32">
            <motion.div initial="initial" animate="animate" variants={fadeIn} className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">
                Girl in Bloom Global Ambassadors 2026
              </span>
              <h1 className="font-heading mt-4 text-3xl md:text-5xl font-extrabold text-foreground leading-[1.02] tracking-tight">
                Girls Leading.
                <br />
                Communities Growing.
                <br />
                <span className="text-primary">A Greener Future.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                Eco Girls Collective equips girls with the knowledge, confidence and opportunities to create
                positive environmental change in their communities.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="#impact">
                  <Button size="lg" className="w-full sm:w-auto">
                    Explore Our Impact <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#support">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Support the Movement
                  </Button>
                </Link>
              </div>
              <div className="mt-8 grid max-w-sm grid-cols-3 gap-4">
                <div className="border-l-2 border-primary/30 pl-3">
                  <p className="font-heading text-xl font-bold text-foreground">80+</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Girls engaged</p>
                </div>
                <div className="border-l-2 border-primary/30 pl-3">
                  <p className="font-heading text-xl font-bold text-foreground">
                    {summary ? summary.totalWasteWeightKg.toLocaleString() : '—'}kg
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Waste collected</p>
                </div>
                <div className="border-l-2 border-primary/30 pl-3">
                  <p className="font-heading text-xl font-bold text-foreground">3+</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Schools</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Impact strip */}
        <section id="impact-strip" className="border-y border-border bg-muted/40 py-2.5">
          <div className="container mx-auto px-6">
            <StatSlideshow
              stats={[
                { value: '80+', label: 'Girls engaged', icon: Users, color: '#35502E' },
                { value: '3+', label: 'Schools', icon: GraduationCap, color: '#7C8A4C' },
                { value: '2+', label: 'Communities', icon: Map, color: '#A98F4B' },
                { value: '2', label: 'Cleanup events', icon: Calendar, color: '#C9A66B' },
                {
                  value: summary ? `${summary.totalWasteWeightKg.toLocaleString()} kg` : '—',
                  label: 'Waste collected',
                  icon: Recycle,
                  color: '#8B5E34',
                },
              ]}
            />
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="relative isolate mx-auto aspect-square w-full max-w-md">
                <MissionIllustration className="absolute inset-0 [&_svg]:w-full [&_svg]:h-full" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Our Mission</span>
                <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  When girls lead, communities move.
                </h2>
                <p className="mt-4 text-muted-foreground max-w-xl">
                  Eco Girls Collective creates opportunities for girls to learn about environmental challenges,
                  develop leadership skills, work together, and take action in their communities — turning
                  awareness into practical, measurable change.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-6">
                Our focus areas
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                  <Card className="h-full border-none shadow-sm bg-card">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                        <Recycle className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground font-heading">Waste Reduction</h3>
                      <p className="text-muted-foreground text-sm">
                        Organizing cleanup events and implementing recycling programs in schools and communities.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                  <Card className="h-full border-none shadow-sm bg-card">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6 text-secondary">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground font-heading">Community Engagement</h3>
                      <p className="text-muted-foreground text-sm">
                        Empowering girls to lead environmental clubs, educate peers, and drive sustainable change.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                  <Card className="h-full border-none shadow-sm bg-card">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                        <Globe className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-foreground font-heading">Growing Impact</h3>
                      <p className="text-muted-foreground text-sm">
                        Tracking waste diverted from landfills and expanding our footprint across schools.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <motion.section
          id="programs"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="py-24 bg-muted/40"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-14">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">What We Do</span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Six ways girls are taking the lead.
              </h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {PROGRAMS.map((program, i) => (
                <ProgramCard key={program.title} {...program} delay={(i % 3) * 0.1} />
              ))}
            </div>
          </div>
        </motion.section>

        <GirlsShowcase />

        {/* Our Impact */}
        <motion.section
          id="impact"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="py-24"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-14">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Our Impact</span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                The work behind the numbers.
              </h2>
            </div>
            <ImpactCharts />
          </div>
        </motion.section>

        {/* Stories */}
        <motion.section
          id="stories"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="py-24 bg-muted/40"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-14">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Stories</span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Meet the girls behind the movement.
              </h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <StoryCard
                name="Lois Akere"
                affiliation="[Add school/community]"
                quote="[Add a real quote from Lois]"
                image="/images/story-lois-akere.png"
                delay={0}
              />
              <StoryCard
                name="Olamiposi Olukolu"
                affiliation="[Add school/community]"
                quote="[Add a real quote from Olamiposi]"
                image="/images/story-olamiposi-olukolu.jpeg"
                delay={0.1}
              />
              <StoryCard
                name="UMURERWA Aubierge"
                affiliation="[Add school/community]"
                quote="[Add a real quote from Aubierge]"
                image="/images/story-umurerwa-aubierge.png"
                delay={0.2}
              />
            </div>
          </div>
        </motion.section>

        {/* Reach */}
        <motion.section
          id="reach"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="py-24"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Where We Work</span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Our growing reach.
              </h2>
            </div>
            <ReachSection />
          </div>
        </motion.section>

        {/* Support */}
        <motion.section
          id="support"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="py-24 bg-primary text-primary-foreground"
        >
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-14">
              <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70 font-medium">
                Support the Movement
              </span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold tracking-tight">
                Help girls turn ideas into action.
              </h2>
              <p className="mt-4 text-primary-foreground/80 max-w-xl">
                Your support can help create opportunities for girls to learn, lead and take environmental action
                in their schools and communities.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 mb-14">
              {WAYS_TO_PARTICIPATE.map((way) => (
                <div key={way.title}>
                  <way.icon className="w-6 h-6 mb-3 text-primary-foreground/90" />
                  <h3 className="font-heading font-bold mb-1">{way.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{way.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/donate">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Support Eco Girls Collective
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                onClick={() => setPartnershipModalOpen(true)}
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="py-24"
        >
          <div className="container mx-auto max-w-2xl px-6">
            <div className="mb-10 text-center">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">FAQ</span>
              <h2 className="font-heading mt-3 text-3xl font-bold text-foreground tracking-tight">
                Common questions about joining the collective.
              </h2>
            </div>
            <FaqAccordion
              items={[
                {
                  question: 'How does a secondary school start an Eco Girls chapter?',
                  answer:
                    'Reach out through the Get Involved section below — our team works with school staff and student leaders to set up an environmental club and connect it with the wider network.',
                },
                {
                  question: 'Where do collected materials go after cleanups?',
                  answer:
                    'Materials are sorted for recycling or safe disposal through local waste-management partners, and tracked in our inventory so we can report on real environmental impact.',
                },
                {
                  question: 'How can corporate partners or NGOs get involved?',
                  answer:
                    'Organizations can partner on funding, supplies, or joint programs — see the Partner option in Get Involved, or reach out directly and our team will follow up.',
                },
              ]}
            />
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 font-bold font-heading text-lg">
                <Leaf className="w-5 h-5" />
                <span>ECO GIRLS COLLECTIVE</span>
              </div>
              <p className="mt-3 text-sm text-primary-foreground/70 max-w-xs">
                Nurturing grassroots climate stewardship, environmental education, and regenerative ecological
                futures through collective community leadership and tactile action.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-primary-foreground/60 font-medium mb-4">
                Quick Links
              </p>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-primary-foreground/60 font-medium mb-4">
                Stay Rooted
              </p>
              <p className="text-sm text-primary-foreground/70 mb-4">
                Receive monthly field dispatches, seed-keeping tips, and community project spotlights.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="min-w-0 flex-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 outline-none focus-visible:border-primary-foreground/50"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  className="rounded-full shrink-0"
                  disabled={newsletterSubmitting}
                >
                  {newsletterSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-primary-foreground/15 text-center text-sm text-primary-foreground/60">
            © 2026 Girl in Bloom Global Ambassadors. All rights reserved.
          </div>
        </div>
      </footer>

      <PartnershipModal open={partnershipModalOpen} onClose={() => setPartnershipModalOpen(false)} />
    </div>
  );
}
