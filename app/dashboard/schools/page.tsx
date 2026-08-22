'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Plus, MoreHorizontal, GraduationCap, Loader2, Trash2, Pencil } from 'lucide-react';
import { Modal } from '@/components/modal';
import { schoolsApi, communitiesApi, apiErrorMessage, School, Community } from '@/lib/api';
import { toast } from 'sonner';

const emptyForm = { name: '', location: '', teacherCoordinator: '', communityId: '' };

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<School | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    Promise.all([schoolsApi.list(), communitiesApi.list()])
      .then(([s, c]) => {
        setSchools(s);
        setCommunities(c);
      })
      .catch(() => toast.error('Failed to load schools'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (s: School) => {
    setEditing(s);
    setForm({
      name: s.name,
      location: s.location,
      teacherCoordinator: s.teacherCoordinator,
      communityId: s.communityId ?? '',
    });
    setModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const payload = { ...form, communityId: form.communityId || undefined };
    try {
      if (editing) {
        await schoolsApi.update(editing.id, payload);
        toast.success('School updated');
      } else {
        await schoolsApi.create(payload);
        toast.success('School created');
      }
      setModalOpen(false);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (s: School) => {
    setOpenMenuId(null);
    if (!confirm(`Delete school "${s.name}"? This cannot be undone.`)) return;
    try {
      await schoolsApi.remove(s.id);
      toast.success('School deleted');
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
            <GraduationCap className="w-8 h-8 text-primary" />
            Schools
          </h1>
          <p className="text-muted-foreground">Track participating schools, locations, and enrolled girls.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add School
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by school name or location..."
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
                    <th className="px-4 py-3 rounded-tl-md">School Name</th>
                    <th className="px-4 py-3">Location / Community</th>
                    <th className="px-4 py-3">Coordinator</th>
                    <th className="px-4 py-3">Participants</th>
                    <th className="px-4 py-3 rounded-tr-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-4">
                        {s.location}
                        <div className="text-xs text-muted-foreground font-normal">{s.community?.name ?? '—'}</div>
                      </td>
                      <td className="px-4 py-4">{s.teacherCoordinator}</td>
                      <td className="px-4 py-4">{s._count?.participants ?? 0}</td>
                      <td className="px-4 py-4 text-right relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {openMenuId === s.id && (
                          <div className="absolute right-4 top-10 z-20 bg-card border border-border rounded-md shadow-md w-36 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                              onClick={() => openEdit(s)}
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted text-destructive flex items-center gap-2"
                              onClick={() => handleDelete(s)}
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
                        No schools found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit School' : 'Add School'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="teacherCoordinator">Teacher Coordinator</Label>
            <Input
              id="teacherCoordinator"
              required
              value={form.teacherCoordinator}
              onChange={(e) => setForm({ ...form, teacherCoordinator: e.target.value })}
            />
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
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Save Changes' : 'Create School'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
