'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectNative } from '@/components/ui/select-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, KeyRound, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { authApi, usersApi, apiErrorMessage, type Role, type User } from '@/lib/api';
import { getUser, type AuthUser } from '@/lib/auth';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [me] = useState<AuthUser | null>(() => getUser());
  const isAdmin = me?.role === 'ADMIN';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const [team, setTeam] = useState<User[]>([]);
  const [teamLoading, setTeamLoading] = useState(isAdmin);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newRole, setNewRole] = useState<Role>('MANAGER');
  const [isAdding, setIsAdding] = useState(false);

  const loadTeam = () => {
    usersApi
      .list()
      .then(setTeam)
      .catch(() => toast.error('Failed to load team members'))
      .finally(() => setTeamLoading(false));
  };

  useEffect(() => {
    if (isAdmin) loadTeam();
  }, [isAdmin]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsChanging(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast.success('Password updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not update password'));
    } finally {
      setIsChanging(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await usersApi.create({ name: newName, email: newEmail, password: newMemberPassword, role: newRole });
      toast.success(`${newName} can now sign in`);
      setNewName('');
      setNewEmail('');
      setNewMemberPassword('');
      setNewRole('MANAGER');
      loadTeam();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not add team member'));
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (member: User) => {
    if (!window.confirm(`Remove ${member.name}? They will no longer be able to sign in.`)) return;
    try {
      await usersApi.remove(member.id);
      toast.success(`${member.name} removed`);
      loadTeam();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not remove team member'));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground">Your account and, for administrators, who can access this dashboard.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Your account</CardTitle>
            <CardDescription>The account you are signed in with.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-3 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="col-span-2 text-foreground">{me?.name}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="col-span-2 text-foreground">{me?.email}</dd>
              <dt className="text-muted-foreground">Role</dt>
              <dd className="col-span-2 text-foreground">{me?.role}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> Change password
            </CardTitle>
            <CardDescription>Use at least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isChanging}>
                {isChanging ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {isAdmin && (
        <Card className="border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Team members</CardTitle>
            <CardDescription>
              Only people listed here can sign in. Administrators can manage this list; managers can use the dashboard
              but not change who has access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {teamLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-md">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 rounded-tr-md text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member) => (
                      <tr key={member.id} className="border-b border-border">
                        <td className="px-4 py-3 font-medium text-foreground">{member.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">{member.role}</td>
                        <td className="px-4 py-3 text-right">
                          {member.id === me?.id ? (
                            <span className="text-xs text-muted-foreground">You</span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveMember(member)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Remove
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <form onSubmit={handleAddMember} className="space-y-4 border-t border-border pt-6">
              <p className="font-medium text-foreground flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" /> Add a team member
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Name</Label>
                  <Input id="member-name" required value={newName} onChange={(e) => setNewName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email">Email</Label>
                  <Input
                    id="member-email"
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-password">Temporary password</Label>
                  <Input
                    id="member-password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={newMemberPassword}
                    onChange={(e) => setNewMemberPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-role">Role</Label>
                  <SelectNative id="member-role" value={newRole} onChange={(e) => setNewRole(e.target.value as Role)}>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </SelectNative>
                </div>
              </div>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add team member'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
