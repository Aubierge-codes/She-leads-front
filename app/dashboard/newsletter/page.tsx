'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Mail, Copy, Loader2 } from 'lucide-react';
import { newsletterApi, type NewsletterSubscriber } from '@/lib/api';
import { toast } from 'sonner';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const load = () => {
    newsletterApi
      .list()
      .then(setSubscribers)
      .catch(() => toast.error('Failed to load subscribers'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const copyAllEmails = async () => {
    try {
      await navigator.clipboard.writeText(subscribers.map((s) => s.email).join(', '));
      toast.success(`Copied ${subscribers.length} email addresses`);
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Mail className="w-8 h-8 text-primary" />
            Newsletter
          </h1>
          <p className="text-muted-foreground">People who signed up through the footer form on the public site.</p>
        </div>
        <Button variant="outline" onClick={copyAllEmails} disabled={subscribers.length === 0}>
          <Copy className="mr-2 h-4 w-4" /> Copy all emails
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-card md:max-w-xs">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Subscribers</p>
            <h3 className="text-2xl font-bold text-foreground">{subscribers.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Mail className="w-6 h-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by email..."
              className="pl-9 w-full md:max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-md">Email</th>
                    <th className="px-4 py-3 rounded-tr-md">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-foreground">{subscriber.email}</td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center py-8 text-muted-foreground">
                        No subscribers yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
