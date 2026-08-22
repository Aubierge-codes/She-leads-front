'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search, Plus, MoreHorizontal, Map, Loader2, Trash2, Pencil } from 'lucide-react';
import { Modal } from '@/components/modal';
import { communitiesApi, apiErrorMessage, Community } from '@/lib/api';
import { toast } from 'sonner';

const emptyForm = { name: '', state: '', notes: '' };

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Community | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    communitiesApi
      .list()
      .then(setCommunities)
      .catch(() => toast.error('Failed to load communities'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const filtered = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.state.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (c: Community) => {
    setEditing(c);
    setForm({ name: c.name, state: c.state, notes: c.notes ?? '' });
    setModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editing) {
        await communitiesApi.update(editing.id, form);
        toast.success('Community updated');
      } else {
        await communitiesApi.create(form);
        toast.success('Community created');
      }
      setModalOpen(false);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (c: Community) => {
    setOpenMenuId(null);
    if (!confirm(`Delete community "${c.name}"? This cannot be undone.`)) return;
    try {
      await communitiesApi.remove(c.id);
      toast.success('Community deleted');
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
            <Map className="w-8 h-8 text-primary" />
            Communities
          </h1>
          <p className="text-muted-foreground">Track local communities, state distribution, and event counts.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="w-full sm:w-auto" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Community
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by community name or state..."
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
                    <th className="px-4 py-3 rounded-tl-md">Community Name</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Schools</th>
                    <th className="px-4 py-3">Participants</th>
                    <th className="px-4 py-3">Events Hosted</th>
                    <th className="px-4 py-3 rounded-tr-md text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-foreground">
                        {c.name}
                        {c.notes && <div className="text-xs text-muted-foreground font-normal">{c.notes}</div>}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{c.state}</td>
                      <td className="px-4 py-4">{c._count?.schools ?? 0}</td>
                      <td className="px-4 py-4">{c._count?.participants ?? 0}</td>
                      <td className="px-4 py-4 font-semibold">{c._count?.cleanupEvents ?? 0}</td>
                      <td className="px-4 py-4 text-right relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        {openMenuId === c.id && (
                          <div className="absolute right-4 top-10 z-20 bg-card border border-border rounded-md shadow-md w-36 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                              onClick={() => openEdit(c)}
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted text-destructive flex items-center gap-2"
                              onClick={() => handleDelete(c)}
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
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No communities found.
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
        title={editing ? 'Edit Community' : 'Add Community'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? 'Save Changes' : 'Create Community'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
