'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Plus, MoreHorizontal, Loader2, Trash2, Pencil } from 'lucide-react';
import { Modal } from '@/components/modal';
import {
  participantsApi,
  schoolsApi,
  communitiesApi,
  apiErrorMessage,
  Participant,
  School,
  Community,
  ParticipantStatus,
} from '@/lib/api';
import { toast } from 'sonner';

const emptyForm = { name: '', age: '', schoolId: '', communityId: '', status: 'ACTIVE' as ParticipantStatus };

const STATUS_STYLES: Record<ParticipantStatus, string> = {
  ACTIVE: 'bg-primary/10 text-primary',
  INACTIVE: 'bg-muted text-muted-foreground',
  GRADUATED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
};

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Participant | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    Promise.all([participantsApi.list(), schoolsApi.list(), communitiesApi.list()])
      .then(([p, s, c]) => {
        setParticipants(p);
        setSchools(s);
        setCommunities(c);
      })
      .catch(() => toast.error('Failed to load participants'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.school?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Participant) => {
    setEditing(p);
    setForm({
      name: p.name,
      age: String(p.age),
      schoolId: p.schoolId ?? '',
      communityId: p.communityId ?? '',
      status: p.status,
    });
    setModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = {
      name: form.name,
      age: Number(form.age),
      schoolId: form.schoolId || undefined,
      communityId: form.communityId || undefined,
      status: form.status,
    };
    try {
      if (editing) {
        await participantsApi.update(editing.id, payload);
        toast.success('Participant updated');
      } else {
        await participantsApi.create(payload);
        toast.success('Participant added');
      }
      setModalOpen(false);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (p: Participant) => {
    setOpenMenuId(null);
    if (!confirm(`Remove participant "${p.name}"?`)) return;
    try {
      await participantsApi.remove(p.id);
      toast.success('Participant removed');
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Participants</h1>
          <p className="text-muted-foreground">Manage the girls in the program.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Participant
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or school..."
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
                    <th className="px-4 py-3 rounded-tl-md">Name</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">School / Community</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-foreground">{p.name}</td>
                      <td className="px-4 py-4">{p.age}</td>
                      <td className="px-4 py-4">
                        {p.school?.name ?? '—'}
                        <div className="text-xs text-muted-foreground font-normal">{p.community?.name ?? ''}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {openMenuId === p.id && (
                          <div className="absolute right-4 top-10 z-20 bg-card border border-border rounded-md shadow-md w-36 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                              onClick={() => openEdit(p)}
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted text-destructive flex items-center gap-2"
                              onClick={() => handleDelete(p)}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        No participants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Participant' : 'Add Participant'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={0}
              required
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schoolId">School</Label>
            <SelectNative
              id="schoolId"
              value={form.schoolId}
              onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
            >
              <option value="">None</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectNative>
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
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <SelectNative
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ParticipantStatus })}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="GRADUATED">Graduated</option>
            </SelectNative>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Save Changes' : 'Add Participant'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
