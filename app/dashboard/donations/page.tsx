'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, HeartHandshake, Users, CircleDollarSign, Clock, Loader2 } from 'lucide-react';
import { Modal } from '@/components/modal';
import { donationsApi, apiErrorMessage, type Donation, type DonationStats, type DonationStatus } from '@/lib/api';
import { toast } from 'sonner';

const STATUS_STYLES: Record<DonationStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  COMPLETED: 'bg-primary/10 text-primary',
  FAILED: 'bg-destructive/10 text-destructive',
  REFUNDED: 'bg-muted text-muted-foreground',
};

const STATUS_OPTIONS: DonationStatus[] = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [editing, setEditing] = useState<Donation | null>(null);
  const [statusValue, setStatusValue] = useState<DonationStatus>('PENDING');
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    setIsLoading(true);
    Promise.all([donationsApi.list(), donationsApi.stats()])
      .then(([list, s]) => {
        setDonations(list);
        setStats(s);
      })
      .catch(() => toast.error('Failed to load donations'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = donations.filter((d) => {
    const term = searchTerm.toLowerCase();
    return d.donor?.name.toLowerCase().includes(term) || d.donor?.email.toLowerCase().includes(term);
  });

  const openEdit = (donation: Donation) => {
    setEditing(donation);
    setStatusValue(donation.status);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setIsSaving(true);
    try {
      await donationsApi.updateStatus(editing.id, statusValue);
      toast.success('Donation status updated');
      setEditing(null);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <HeartHandshake className="w-8 h-8 text-primary" />
          Donations
        </h1>
        <p className="text-muted-foreground">Track pledges and supporter contributions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Raised</p>
              <h3 className="text-2xl font-bold text-foreground">${(stats?.totalRaised ?? 0).toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CircleDollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Supporters</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.supportersCount ?? 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.completedCount ?? 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <HeartHandshake className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card border-l-4 border-l-yellow-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
              <h3 className="text-2xl font-bold text-foreground">{stats?.pendingCount ?? 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by donor name or email..."
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
                    <th className="px-4 py-3 rounded-tl-md">Donor</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Frequency</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 rounded-tr-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((donation) => (
                    <tr key={donation.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{donation.donor?.name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{donation.donor?.email}</p>
                      </td>
                      <td className="px-4 py-4 font-semibold text-foreground">
                        ${donation.amount.toLocaleString()} {donation.currency}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {donation.frequency === 'MONTHLY' ? 'Monthly' : 'One-time'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[donation.status]}`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-primary hover:text-primary/80" onClick={() => openEdit(donation)}>
                          Update Status
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No donations recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Update Status: ${editing?.donor?.name ?? ''}`}>
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <SelectNative id="status" value={statusValue} onChange={(e) => setStatusValue(e.target.value as DonationStatus)}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
