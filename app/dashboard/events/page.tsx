'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  Users,
  Recycle,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Modal } from '@/components/modal';
import {
  cleanupApi,
  communitiesApi,
  participantsApi,
  apiErrorMessage,
  CleanupEvent,
  Community,
  Participant,
  CleanupEventStatus,
  WasteType,
} from '@/lib/api';
import { toast } from 'sonner';

const emptyForm = { title: '', eventDate: '', eventTime: '', leader: '', communityId: '', status: 'PLANNED' as CleanupEventStatus };
const emptyWasteForm = { type: 'PLASTIC' as WasteType, weightKg: '', bags: '' };

const STATUS_STYLES: Record<CleanupEventStatus, string> = {
  PLANNED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  ONGOING: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  COMPLETED: 'bg-primary/10 text-primary',
  CANCELLED: 'bg-destructive/10 text-destructive',
};

export default function EventsPage() {
  const [events, setEvents] = useState<CleanupEvent[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const [manageEvent, setManageEvent] = useState<CleanupEvent | null>(null);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<Set<string>>(new Set());
  const [wasteForm, setWasteForm] = useState(emptyWasteForm);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [isSavingWaste, setIsSavingWaste] = useState(false);

  const load = () => {
    setIsLoading(true);
    Promise.all([cleanupApi.list(), communitiesApi.list(), participantsApi.list()])
      .then(([e, c, p]) => {
        setEvents(e);
        setCommunities(c);
        setParticipants(p);
      })
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.community?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openCreate = () => {
    setForm(emptyForm);
    setCreateOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await cleanupApi.create({ ...form, communityId: form.communityId || undefined });
      toast.success('Event scheduled');
      setCreateOpen(false);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const openManage = async (event: CleanupEvent) => {
    try {
      const full = await cleanupApi.get(event.id);
      setManageEvent(full);
      setSelectedParticipantIds(new Set(full.attendances?.map((a) => a.participantId) ?? []));
      setWasteForm(emptyWasteForm);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipantIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const saveAttendance = async () => {
    if (!manageEvent) return;
    setIsSavingAttendance(true);
    try {
      await cleanupApi.markAttendance(manageEvent.id, Array.from(selectedParticipantIds), true);
      toast.success('Attendance saved');
      const full = await cleanupApi.get(manageEvent.id);
      setManageEvent(full);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const addWasteRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageEvent) return;
    setIsSavingWaste(true);
    try {
      await cleanupApi.addWasteRecord(manageEvent.id, {
        type: wasteForm.type,
        weightKg: Number(wasteForm.weightKg),
        bags: Number(wasteForm.bags),
      });
      toast.success('Waste record logged');
      const full = await cleanupApi.get(manageEvent.id);
      setManageEvent(full);
      setWasteForm(emptyWasteForm);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSavingWaste(false);
    }
  };

  const changeStatus = async (status: CleanupEventStatus) => {
    if (!manageEvent) return;
    try {
      await cleanupApi.update(manageEvent.id, { status });
      const full = await cleanupApi.get(manageEvent.id);
      setManageEvent(full);
      load();
      toast.success('Status updated');
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const deleteEvent = async () => {
    if (!manageEvent) return;
    if (!confirm(`Delete event "${manageEvent.title}"?`)) return;
    try {
      await cleanupApi.remove(manageEvent.id);
      toast.success('Event deleted');
      setManageEvent(null);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Cleanup Events
          </h1>
          <p className="text-muted-foreground">Manage events, attendance, and waste collection reports.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Schedule Event
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title or community..."
          className="pl-9 w-full bg-card"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((event) => (
            <Card key={event.id} className="border-none shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-3 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[event.status]}`}>
                    {event.status}
                  </span>
                </div>
                <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 mr-2" /> {new Date(event.eventDate).toLocaleDateString()}
                  {event.eventTime ? ` · ${event.eventTime}` : ''}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" /> {event._count?.attendances ?? 0} attended · Led by {event.leader}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Recycle className="w-4 h-4 mr-2" /> {event._count?.wasteRecords ?? 0} waste records
                </div>

                <div className="pt-4 mt-4 border-t border-border flex justify-end">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openManage(event)}>
                    Manage Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border-dashed border-2 border-border">
              No events found. Try a different search.
            </div>
          )}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Schedule Event">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                required
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTime">Time</Label>
              <Input
                id="eventTime"
                type="time"
                value={form.eventTime}
                onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="leader">Leader</Label>
            <Input id="leader" required value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="communityId">Community</Label>
            <SelectNative
              id="communityId"
              value={form.communityId}
              onChange={(e) => setForm({ ...form, communityId: e.target.value })}
            >
              <option value="">None</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Schedule Event'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!manageEvent}
        onClose={() => setManageEvent(null)}
        title={manageEvent?.title ?? ''}
        description={manageEvent ? new Date(manageEvent.eventDate).toLocaleDateString() : undefined}
      >
        {manageEvent && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Status</Label>
              <SelectNative value={manageEvent.status} onChange={(e) => changeStatus(e.target.value as CleanupEventStatus)}>
                <option value="PLANNED">Planned</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </SelectNative>
            </div>

            <div className="space-y-2">
              <Label>Attendance</Label>
              <div className="max-h-40 overflow-y-auto border border-border rounded-md divide-y divide-border">
                {participants.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-muted/30">
                    <input
                      type="checkbox"
                      checked={selectedParticipantIds.has(p.id)}
                      onChange={() => toggleParticipant(p.id)}
                    />
                    {p.name}
                  </label>
                ))}
                {participants.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">No participants yet.</p>
                )}
              </div>
              <Button size="sm" onClick={saveAttendance} disabled={isSavingAttendance}>
                {isSavingAttendance ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Attendance'}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Log Waste Collection</Label>
              <form onSubmit={addWasteRecord} className="grid grid-cols-3 gap-2 items-end">
                <SelectNative
                  value={wasteForm.type}
                  onChange={(e) => setWasteForm({ ...wasteForm, type: e.target.value as WasteType })}
                >
                  <option value="PLASTIC">Plastic</option>
                  <option value="PAPER">Paper</option>
                  <option value="METAL">Metal</option>
                  <option value="GLASS">Glass</option>
                  <option value="ORGANIC">Organic</option>
                  <option value="OTHER">Other</option>
                </SelectNative>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  placeholder="Weight (kg)"
                  required
                  value={wasteForm.weightKg}
                  onChange={(e) => setWasteForm({ ...wasteForm, weightKg: e.target.value })}
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Bags"
                  required
                  value={wasteForm.bags}
                  onChange={(e) => setWasteForm({ ...wasteForm, bags: e.target.value })}
                />
                <div className="col-span-3">
                  <Button type="submit" size="sm" disabled={isSavingWaste}>
                    {isSavingWaste ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Record'}
                  </Button>
                </div>
              </form>
              {(manageEvent.wasteRecords?.length ?? 0) > 0 && (
                <ul className="text-sm text-muted-foreground space-y-1 pt-2">
                  {manageEvent.wasteRecords?.map((w) => (
                    <li key={w.id}>
                      {w.type}: {w.weightKg}kg, {w.bags} bags
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button variant="destructive" size="sm" onClick={deleteEvent}>
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Event
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
