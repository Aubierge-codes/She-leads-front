'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SelectNative } from '@/components/ui/select-native';
import { BarChart, CheckCircle2, XCircle, FileText, Plus, Loader2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Modal } from '@/components/modal';
import { reportsApi, schoolsApi, apiErrorMessage, WeeklyReport, School, ReportStatus } from '@/lib/api';
import { toast } from 'sonner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const STATUS_LABELS: Record<ReportStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Pending Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const emptyForm = { weekNumber: '', year: String(new Date().getFullYear()), activities: '', schoolId: '' };

export default function ReportsPage() {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    setIsLoading(true);
    Promise.all([reportsApi.list(), schoolsApi.list()])
      .then(([r, s]) => {
        setReports(r);
        setSchools(s);
      })
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const pending = reports.filter((r) => r.status === 'SUBMITTED');
  const approvedCount = reports.filter((r) => r.status === 'APPROVED').length;
  const statusCounts: Record<ReportStatus, number> = { DRAFT: 0, SUBMITTED: 0, APPROVED: 0, REJECTED: 0 };
  reports.forEach((r) => statusCounts[r.status]++);

  const chartData = {
    labels: Object.values(STATUS_LABELS),
    datasets: [
      {
        label: 'Reports',
        data: Object.keys(STATUS_LABELS).map((key) => statusCounts[key as ReportStatus]),
        backgroundColor: '#35502E',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await reportsApi.create({
        weekNumber: Number(form.weekNumber),
        year: Number(form.year),
        activities: form.activities,
        schoolId: form.schoolId || undefined,
      });
      toast.success('Report submitted');
      setCreateOpen(false);
      setForm(emptyForm);
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (report: WeeklyReport, status: ReportStatus) => {
    try {
      await reportsApi.updateStatus(report.id, status);
      toast.success(status === 'APPROVED' ? 'Report approved' : 'Report rejected');
      load();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart className="w-8 h-8 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">Approve weekly reports and visualize submission status.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Weekly Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-5 border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Reports by Status</CardTitle>
            <CardDescription>Current distribution of all submitted weekly reports</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <Bar data={chartData} options={chartOptions} />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-primary-foreground/80 text-sm">Reports Approved</p>
                  <div className="text-3xl font-bold">{approvedCount}</div>
                </div>
                <div>
                  <p className="text-primary-foreground/80 text-sm">Pending Review</p>
                  <div className="text-3xl font-bold">{pending.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pending.map((report) => (
                <div key={report.id} className="p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-sm leading-tight text-foreground">
                        Week {report.weekNumber}, {report.year}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{report.school?.name ?? 'No school linked'}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-8 text-xs"
                      onClick={() => updateStatus(report, 'REJECTED')}
                    >
                      <XCircle className="w-3 h-3 mr-1" /> Reject
                    </Button>
                    <Button size="sm" className="w-full h-8 text-xs" onClick={() => updateStatus(report, 'APPROVED')}>
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))}
              {pending.length === 0 && <p className="text-sm text-muted-foreground">No reports pending review.</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card">
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Week</th>
                  <th className="px-4 py-3">School</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-md">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">Week {r.weekNumber}, {r.year}</td>
                    <td className="px-4 py-4 text-muted-foreground">{r.school?.name ?? '—'}</td>
                    <td className="px-4 py-4">{STATUS_LABELS[r.status]}</td>
                    <td className="px-4 py-4 text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No reports submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Weekly Report">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekNumber">Week Number</Label>
              <Input
                id="weekNumber"
                type="number"
                min={1}
                max={53}
                required
                value={form.weekNumber}
                onChange={(e) => setForm({ ...form, weekNumber: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                required
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="schoolId">School</Label>
            <SelectNative id="schoolId" value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })}>
              <option value="">None</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectNative>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activities">Activities</Label>
            <Textarea
              id="activities"
              rows={4}
              required
              value={form.activities}
              onChange={(e) => setForm({ ...form, activities: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Report'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
