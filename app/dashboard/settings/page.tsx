'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Settings, Save, DownloadCloud, Database, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Project Settings
        </h1>
        <p className="text-muted-foreground">Manage project details, data backups, and administrator preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Update the primary details for the SHE Leads initiative.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" defaultValue="SHE Leads - Girl in Bloom 2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Primary Admin Email</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@girlinbloom.org" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => toast.success('Settings saved successfully!')}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm bg-card border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions related to the project data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">Archive Project</p>
                  <p className="text-sm text-muted-foreground">Make the project read-only. Cannot be undone easily.</p>
                </div>
                <Button variant="destructive">Archive Project</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export and backup your dashboard data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <DownloadCloud className="w-5 h-5 text-primary" />
                  <p className="font-medium text-foreground">Export Full Data</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Download a complete CSV/JSON dump of all participants, events, and reports.
                </p>
                <Button variant="outline" className="w-full">Download Data</Button>
              </div>

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-primary" />
                  <p className="font-medium text-foreground">Manual Backup</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Trigger an immediate snapshot of the database to secure storage.
                </p>
                <Button variant="outline" className="w-full" onClick={() => toast.success('Database backup initiated.')}>Create Backup</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
