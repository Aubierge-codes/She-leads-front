'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Handshake, Inbox, PhoneCall, Loader2 } from 'lucide-react';
import { Modal } from '@/components/modal';
import {
  partnershipsApi,
  apiErrorMessage,
  type PartnershipInquiry,
  type PartnershipInquiryStatus,
} from '@/lib/api';
import { toast } from 'sonner';

const STATUS_STYLES: Record<PartnershipInquiryStatus, string> = {
  NEW: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  CONTACTED: 'bg-primary/10 text-primary',
  CLOSED: 'bg-muted text-muted-foreground',
};

const STATUS_OPTIONS: PartnershipInquiryStatus[] = ['NEW', 'CONTACTED', 'CLOSED'];

export default function PartnershipsPage() {
  const [inquiries, setInquiries] = useState<PartnershipInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [viewing, setViewing] = useState<PartnershipInquiry | null>(null);
  const [statusValue, setStatusValue] = useState<PartnershipInquiryStatus>('NEW');
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    partnershipsApi
      .list()
      .then(setInquiries)
      .catch(() => toast.error('Failed to load partnership inquiries'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = inquiries.filter((i) => {
    const term = searchTerm.toLowerCase();
    return (
      i.organizationName.toLowerCase().includes(term) ||
      i.contactName.toLowerCase().includes(term) ||
      i.email.toLowerCase().includes(term)
    );
  });

  const newCount = inquiries.filter((i) => i.status === 'NEW').length;
  const contactedCount = inquiries.filter((i) => i.status === 'CONTACTED').length;

  const openInquiry = (inquiry: PartnershipInquiry) => {
    setViewing(inquiry);
    setStatusValue(inquiry.status);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewing) return;
    setIsSaving(true);
    try {
      await partnershipsApi.updateStatus(viewing.id, statusValue);
      toast.success('Inquiry status updated');
      setViewing(null);
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
          <Handshake className="w-8 h-8 text-primary" />
          Partnerships
        </h1>
        <p className="text-muted-foreground">
          Inquiries sent through the &quot;Become a Partner&quot; form on the public site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Inquiries</p>
              <h3 className="text-2xl font-bold text-foreground">{inquiries.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Handshake className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card border-l-4 border-l-yellow-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Awaiting Reply</p>
              <h3 className="text-2xl font-bold text-foreground">{newCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
              <Inbox className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Contacted</p>
              <h3 className="text-2xl font-bold text-foreground">{contactedCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <PhoneCall className="w-6 h-6" />
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
              placeholder="Search by organization, contact, or email..."
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
                    <th className="px-4 py-3 rounded-tl-md">Organization</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Received</th>
                    <th className="px-4 py-3 rounded-tr-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-foreground">{inquiry.organizationName}</td>
                      <td className="px-4 py-4">
                        <p className="text-foreground">{inquiry.contactName}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[inquiry.status]}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary hover:text-primary/80"
                          onClick={() => openInquiry(inquiry)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        No partnership inquiries yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.organizationName ?? ''}>
        {viewing && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Contact</dt>
              <dd className="col-span-2 text-foreground">{viewing.contactName}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="col-span-2">
                <a href={`mailto:${viewing.email}`} className="text-primary hover:underline">
                  {viewing.email}
                </a>
              </dd>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="col-span-2 text-foreground">{viewing.phone || '—'}</dd>
              <dt className="text-muted-foreground">Received</dt>
              <dd className="col-span-2 text-foreground">{new Date(viewing.createdAt).toLocaleString()}</dd>
            </dl>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Message</p>
              <p className="text-sm text-foreground whitespace-pre-wrap rounded-md bg-muted/50 p-3">
                {viewing.message || 'No message provided.'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <SelectNative
                id="status"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value as PartnershipInquiryStatus)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </SelectNative>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setViewing(null)}>
                Close
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save status'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
