'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceholderImage } from '@/components/placeholder-image';
import { StatTile } from '@/components/stat-tile';
import { ProgramCard } from '@/components/program-card';
import { StoryCard } from '@/components/story-card';
import { ReachSection } from '@/components/reach-section';
import { ImpactCharts } from '@/components/impact-charts';
import {
  Leaf,
  Globe,
  Users,
  ArrowRight,
  Recycle,
  BookOpen,
  Target,
  Trash2,
  HandCoins,
  Award,
  Package,
  Handshake,
  UserPlus,
} from 'lucide-react';
import { dashboardApi, type DashboardSummary } from '@/lib/api';

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
  },
  {
    icon: Users,
    title: "Girls' Leadership",
    description: 'Building confidence, leadership, teamwork and problem-solving skills.',
    photoLabel: 'Add photo: girls leading a session',
  },
  {
    icon: Target,
    title: 'Community Action',
    description: 'Turning ideas into projects that respond to local environmental challenges.',
    photoLabel: 'Add photo: community project in progress',
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

  useEffect(() => {
    dashboardApi.summary().then(setSummary).catch(() => {});
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-4 md:top-6 inset-x-4 md:inset-x-8 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 rounded-full border border-border bg-card/95 backdrop-blur-md shadow-sm px-4 py-2.5 md:px-6">
          <div className="flex items-center gap-2 text-primary font-bold text-base font-heading whitespace-nowrap">
            <Leaf className="w-5 h-5" />
            <span>ECO GIRLS COLLECTIVE</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard" className="hidden sm:block">
              <Button variant="outline" size="sm" className="rounded-full">
                Dashboard
              </Button>
            </Link>
            <Link href="/donate">
              <Button size="sm" className="rounded-full">
                Support Us
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden pb-20 md:pb-28">
          <div className="container mx-auto px-6 grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div initial="initial" animate="animate" variants={fadeIn}>
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">
                Girl in Bloom Global Ambassadors 2026
              </span>
              <h1 className="font-heading mt-4 text-4xl md:text-6xl font-extrabold text-foreground leading-[1.02] tracking-tight">
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
            </motion.div>
            <PlaceholderImage
              label="Add photo: girls leading a community cleanup"
              aspect="portrait"
              variant="leaf"
              className="lg:justify-self-end lg:max-w-md w-full"
            />
          </div>
        </section>

        {/* Impact strip */}
        <section id="impact-strip" className="border-y border-border bg-muted/40 py-10">
          <div className="container mx-auto px-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            <StatTile value={`${summary?.participantsCount ?? '—'}`} label="Girls engaged" />
            <StatTile value={`${summary?.schoolsCount ?? '—'}`} label="Schools" />
            <StatTile value={`${summary?.communitiesCount ?? '—'}`} label="Communities" />
            <StatTile value={`${summary?.cleanupEventsCount ?? '—'}`} label="Cleanup events" />
            <StatTile
              value={summary ? `${summary.totalWasteWeightKg.toLocaleString()} kg` : '—'}
              label="Waste collected"
            />
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <PlaceholderImage label="Add photo: girls in discussion" aspect="wide" variant="leaf" />
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
        <section id="programs" className="py-24 bg-muted/40">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-14">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">What We Do</span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Six ways girls are taking the lead.
              </h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {PROGRAMS.map((program) => (
                <ProgramCard key={program.title} {...program} />
              ))}
            </div>
          </div>
        </section>

        {/* Our Impact */}
        <section id="impact" className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-14">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Our Impact</span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                The work behind the numbers.
              </h2>
            </div>
            <ImpactCharts />
          </div>
        </section>

        {/* Stories */}
        <section id="stories" className="py-24 bg-muted/40">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-14">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Stories</span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Meet the girls behind the movement.
              </h2>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <StoryCard
                name="[Replace with participant name]"
                affiliation="[Replace with school/community] · Example placeholder"
                quote="Before joining the club, I knew pollution was a problem. Now I feel like I can actually do something about it."
              />
              <StoryCard
                name="[Replace with participant name]"
                affiliation="[Replace with school/community]"
                quote="[Replace with a real quote from a participant]"
              />
              <StoryCard
                name="[Replace with participant name]"
                affiliation="[Replace with school/community]"
                quote="[Replace with a real quote from a participant]"
              />
            </div>
          </div>
        </section>

        {/* Reach */}
        <section id="reach" className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-10">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Where We Work</span>
              <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Our growing reach.
              </h2>
            </div>
            <ReachSection />
          </div>
        </section>

        {/* Support */}
        <section id="support" className="py-24 bg-primary text-primary-foreground">
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
                onClick={() => toast.info('Partnership inquiries form coming soon — reach out and we will follow up.')}
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4 text-primary font-bold font-heading">
            <Leaf className="w-5 h-5" />
            <span>ECO GIRLS COLLECTIVE</span>
          </div>
          <p className="text-sm">© 2026 Girl in Bloom Global Ambassadors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
