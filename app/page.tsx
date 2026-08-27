'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Globe, Users, ArrowRight, Calendar, Recycle, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Leaf className="w-6 h-6" />
            <span>ECO GIRLS COLLECTIVE</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link href="#mission" className="text-muted-foreground hover:text-primary transition-colors">Mission</Link>
            <Link href="#timeline" className="text-muted-foreground hover:text-primary transition-colors">Timeline</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-muted py-24 md:py-32">
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div initial="initial" animate="animate" variants={fadeIn}>
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                Girl in Bloom Global Ambassadors 2026
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
                Empowering the Next Generation of <br className="hidden md:block" />
                <span className="text-primary">Environmental Leaders</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Track, manage, and scale the impact of your "ECO GIRLS COLLECTIVE" environmental projects.
                Monitor waste reduction, track community events, and visualize our global footprint.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                    Explore Dashboard <BarChart3 className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="#mission">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-2">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Core Mission</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ECO GIRLS COLLECTIVE is dedicated to fostering environmental stewardship through community action, education, and measurable impact.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <Card className="h-full border-none shadow-lg bg-card hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                      <Recycle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">Waste Reduction</h3>
                    <p className="text-muted-foreground">
                      Organizing cleanup events and implementing recycling programs in schools and communities across the region.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <Card className="h-full border-none shadow-lg bg-card hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6 text-secondary">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">Community Engagement</h3>
                    <p className="text-muted-foreground">
                      Empowering young women to lead environmental clubs, educate peers, and drive sustainable changes locally.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <Card className="h-full border-none shadow-lg bg-card hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                      <Globe className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">Global Impact</h3>
                    <p className="text-muted-foreground">
                      Tracking CO2 savings, waste diverted from landfills, and expanding the footprint of the Girl in Bloom initiative.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to see the impact?</h2>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Access the dashboard to view real-time metrics, upcoming cleanup events, and our growing network of schools and communities.
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-primary hover:bg-white/90 h-14 px-8 text-lg font-semibold">
                Open Dashboard <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background py-8 border-t border-border">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4 text-primary font-bold">
            <Leaf className="w-5 h-5" />
            <span>ECO GIRLS COLLECTIVE Project</span>
          </div>
          <p>© 2026 Girl in Bloom Global Ambassadors. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
