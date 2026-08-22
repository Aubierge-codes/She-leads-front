'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Leaf, Users, Calendar, Trash2, Pencil, Loader2 } from 'lucide-react';
import { Modal } from '@/components/modal';
import { clubsApi, schoolsApi, apiErrorMessage, EnvironmentalClub, School, MeetingFrequency } from '@/lib/api';
import { toast } from 'sonner';

const emptyForm = { schoolId: '', president: '', meetingFrequency: 'MONTHLY' as MeetingFrequency, memberCount: '0' };

const FREQUENCY_LABELS: Record<MeetingFrequency, string> = {
  WEEKLY: 'Weekly',
  BIWEEKLY: 'Biweekly',
  MONTHLY: 'Monthly',
};

export default function EnvClubsPage() {
  const [clubs, setClubs] = useState<EnvironmentalClub[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EnvironmentalClub | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    setIsLoading(true);
    Promise.all([clubsApi.list(), schoolsApi.list()])
      .then(([c, s]) => {
        setClubs(c);
        setSchools(s);
      })
      .catch(() => toast.error('Failed to load clubs'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = clubs.filter(
    (c) =>
      c.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.school?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c: EnvironmentalClub) => {
    setEditing(c);
    setForm({
      schoolId: c.schoolId,
      president: c.president,
      meetingFrequency: c.meetingFrequency,
      memberCount: String(c.memberCount),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      schoolId: form.schoolId,
      president: form.president,
      meetingFrequency: form.meetingFrequency,
      memberCount: Number(form.memberCount),
    };
    try {
      if (editing) {
        await clubsApi.update(editing.id, payload);
        toast.success('Club updated');
      } else {
        await clubsApi.create(payload);
        toast.success('Club registered');
      }
      setModalOpen(false);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (c: EnvironmentalClub) => {
    if (!confirm(`Delete club led by "${c.president}"?`)) return;
    try {
      await clubsApi.remove(c.id);
      toast.success('Club deleted');
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
            <Leaf className="w-8 h-8 text-primary" />
            Environmental Clubs
          </h1>
          <p className="text-muted-foreground">Manage active school clubs, club leaders, and meeting cadence.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Register New Club
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by president or school..."
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
            <div className="grid gap-4">
              {filtered.map((club) => (
                <Card key={club.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{club.school?.name ?? 'Unassigned School'}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                          Led by {club.president} • Meets {FREQUENCY_LABELS[club.meetingFrequency]}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">{club.memberCount}</span> members
                        </div>
                        <Button variant="ghost" size="sm" className="h-8" onClick={() => openEdit(club)}>
                          <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-destructive" onClick={() => handleDelete(club)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className="py-12 text-center text-muted-foreground bg-card rounded-xl border-dashed border-2 border-border">
                  No clubs found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Meeting Cadence</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {clubs.map((club) => (
                  <li key={`meeting-${club.id}`} className="flex items-start gap-3 border-b border-primary-foreground/20 pb-3 last:border-0 last:pb-0">
                    <Calendar className="w-5 h-5 shrink-0 opacity-80" />
                    <div>
                      <p className="font-medium">{club.school?.name ?? 'Unassigned School'}</p>
                      <p className="text-sm opacity-80">{FREQUENCY_LABELS[club.meetingFrequency]}</p>
                    </div>
                  </li>
                ))}
                {clubs.length === 0 && <p className="text-sm opacity-80">No clubs yet.</p>}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Club' : 'Register New Club'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schoolId">School</Label>
            <SelectNative
              id="schoolId"
              required
              value={form.schoolId}
              onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
            >
              <option value="">Select a school</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="space-y-2">
            <Label htmlFor="president">President</Label>
            <Input
              id="president"
              required
              value={form.president}
              onChange={(e) => setForm({ ...form, president: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingFrequency">Meeting Frequency</Label>
              <SelectNative
                id="meetingFrequency"
                value={form.meetingFrequency}
                onChange={(e) => setForm({ ...form, meetingFrequency: e.target.value as MeetingFrequency })}
              >
                <option value="WEEKLY">Weekly</option>
                <option value="BIWEEKLY">Biweekly</option>
                <option value="MONTHLY">Monthly</option>
              </SelectNative>
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberCount">Members</Label>
              <Input
                id="memberCount"
                type="number"
                min={0}
                value={form.memberCount}
                onChange={(e) => setForm({ ...form, memberCount: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Save Changes' : 'Register Club'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
