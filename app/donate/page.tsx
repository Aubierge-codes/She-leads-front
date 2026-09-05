'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, Leaf, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { donationsApi, apiErrorMessage, type Donation, type DonationFrequency } from '@/lib/api';

const PRESET_AMOUNTS = [10, 25, 50, 100];

type Step = 'amount' | 'details' | 'confirmation';

export default function DonatePage() {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<DonationFrequency>('ONE_TIME');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<Donation | null>(null);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handleSelectPreset = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleContinueToDetails = () => {
    if (!effectiveAmount || effectiveAmount <= 0) {
      toast.error('Please choose or enter a valid amount');
      return;
    }
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const donation = await donationsApi.create({
        amount: effectiveAmount,
        frequency,
        donorName,
        donorEmail,
        donorPhone: donorPhone || undefined,
        message: message || undefined,
      });
      setResult(donation);
      setStep('confirmation');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold font-heading">
            <Leaf className="w-5 h-5" />
            <span>ECO GIRLS COLLECTIVE</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-lg">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium">Support the Movement</span>
          <h1 className="font-heading mt-3 text-3xl font-semibold text-foreground tracking-tight">
            Your support creates opportunities for action.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Donations can help support environmental education, cleanup activities, environmental clubs, community
            projects, and waste-management activities.
          </p>
        </div>

        {step === 'amount' && (
          <Card className="border-none shadow-sm bg-card">
            <CardContent className="p-6 space-y-6">
              <div>
                <Label className="mb-3 block">Choose your contribution</Label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESET_AMOUNTS.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant={!customAmount && amount === value ? 'default' : 'outline'}
                      onClick={() => handleSelectPreset(value)}
                    >
                      ${value}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  min={1}
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>

              <div>
                <Label className="mb-3 block">Frequency</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={frequency === 'ONE_TIME' ? 'default' : 'outline'}
                    onClick={() => setFrequency('ONE_TIME')}
                  >
                    One-time
                  </Button>
                  <Button
                    type="button"
                    variant={frequency === 'MONTHLY' ? 'default' : 'outline'}
                    onClick={() => setFrequency('MONTHLY')}
                  >
                    Monthly
                  </Button>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleContinueToDetails}>
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'details' && (
          <Card className="border-none shadow-sm bg-card">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Contributing <span className="font-semibold text-foreground">${effectiveAmount}</span>{' '}
                  {frequency === 'MONTHLY' ? 'monthly' : 'one-time'}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="donorName">Name</Label>
                  <Input id="donorName" required value={donorName} onChange={(e) => setDonorName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donorEmail">Email</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="donorPhone">Phone (optional)</Label>
                  <Input id="donorPhone" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep('amount')}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue to secure payment'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'confirmation' && result && (
          <Card className="border-none shadow-sm bg-card">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                Thank you for supporting the movement.
              </h2>
              <div className="inline-flex flex-col items-center gap-1 rounded-lg border border-border bg-muted/60 px-6 py-4">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Reference</span>
                <span className="font-mono font-semibold text-foreground">
                  DON-{result.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="mt-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  {result.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Secure payment processing is coming soon. We&apos;ve recorded your pledge and our team will follow
                up to complete your contribution.
              </p>
              <Link href="/">
                <Button variant="outline" className="mt-2">
                  Back to site
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
