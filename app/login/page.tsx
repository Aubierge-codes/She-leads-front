'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi, apiErrorMessage } from '@/lib/api';
import { setSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { accessToken, user } = await authApi.login(email, password);
      setSession(accessToken, user);
      router.push('/dashboard');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Invalid email or password'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold font-heading">
            <span className="relative w-5 h-5 shrink-0">
              <Image src="/images/eco-girls-logo-icon.png" alt="Eco Girls Collective logo" fill className="object-contain" />
            </span>
            <span>ECO GIRLS COLLECTIVE</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-sm">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Dashboard</span>
          <h1 className="font-heading mt-3 text-3xl font-bold text-foreground tracking-tight">Sign in</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This dashboard is for Eco Girls Collective staff only.
          </p>
        </div>

        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
