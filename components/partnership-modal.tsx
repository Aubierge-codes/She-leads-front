'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { partnershipsApi, apiErrorMessage } from '@/lib/api';

interface PartnershipModalProps {
  open: boolean;
  onClose: () => void;
}

export function PartnershipModal({ open, onClose }: PartnershipModalProps) {
  const [organizationName, setOrganizationName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await partnershipsApi.create({
        organizationName,
        contactName,
        email,
        phone: phone || undefined,
        message: message || undefined,
      });
      toast.success("Thanks for reaching out. We'll follow up soon.");
      setOrganizationName('');
      setContactName('');
      setEmail('');
      setPhone('');
      setMessage('');
      onClose();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not send your inquiry right now'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Become a Partner"
      description="Tell us about your organization and how you'd like to work with Eco Girls Collective."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="organizationName">Organization name</Label>
          <Input
            id="organizationName"
            required
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact name</Label>
          <Input id="contactName" required value={contactName} onChange={(e) => setContactName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partnerEmail">Email</Label>
          <Input
            id="partnerEmail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partnerPhone">Phone (optional)</Label>
          <Input id="partnerPhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="partnerMessage">How would you like to partner? (optional)</Label>
          <Textarea id="partnerMessage" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send inquiry'}
        </Button>
      </form>
    </Modal>
  );
}
