'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recycle, FileText, Loader2 } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { analyticsApi, cleanupApi, WasteRecord } from '@/lib/api';
import { toast } from 'sonner';

ChartJS.register(ArcElement, Tooltip, Legend);

const WASTE_TYPE_LABELS: Record<string, string> = {
  PLASTIC: 'Plastic',
  PAPER: 'Paper',
  METAL: 'Metal',
  GLASS: 'Glass',
  ORGANIC: 'Organic',
  OTHER: 'Other',
};

const CHART_COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#66BB6A'];

export default function WasteTrackingPage() {
  const [wasteByType, setWasteByType] = useState<{ type: string; totalWeightKg: number; totalBags: number }[]>([]);
  const [recentRecords, setRecentRecords] = useState<WasteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.wasteByType(), cleanupApi.recentWasteRecords()])
      .then(([byType, recent]) => {
        setWasteByType(byType);
        setRecentRecords(recent);
      })
      .catch(() => toast.error('Failed to load waste data'))
      .finally(() => setIsLoading(false));
  }, []);

  const totalWeight = wasteByType.reduce((sum, w) => sum + w.totalWeightKg, 0);
  const totalEvents = new Set(recentRecords.map((r) => r.eventId)).size;

  const wasteData = {
    labels: wasteByType.map((w) => WASTE_TYPE_LABELS[w.type] ?? w.type),
    datasets: [
      {
        data: wasteByType.map((w) => w.totalWeightKg),
        backgroundColor: CHART_COLORS,
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
    },
    cutout: '70%',
  };

  const summaryStats = [
    { name: 'Total Waste Collected', value: `${totalWeight.toLocaleString()} kg`, icon: Recycle, color: 'text-primary' },
    { name: 'Total Waste Records', value: String(recentRecords.length), icon: FileText, color: 'text-blue-600' },
    { name: 'Events with Waste Logged', value: String(totalEvents), icon: FileText, color: 'text-blue-600' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Recycle className="w-8 h-8 text-primary" />
          Waste Tracking
        </h1>
        <p className="text-muted-foreground">Monitor categorized waste collection across all cleanup events.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryStats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3 border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Waste Composition</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {wasteByType.length > 0 ? (
              <Doughnut data={wasteData} options={chartOptions} />
            ) : (
              <p className="text-sm text-muted-foreground">No waste records yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 border-none shadow-sm bg-card flex flex-col">
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Event</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 rounded-tr-md">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((entry) => (
                  <tr key={entry.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">{entry.event?.title ?? '—'}</td>
                    <td className="px-4 py-4 text-muted-foreground">{WASTE_TYPE_LABELS[entry.type] ?? entry.type}</td>
                    <td className="px-4 py-4 font-semibold text-foreground">{entry.weightKg} kg · {entry.bags} bags</td>
                    <td className="px-4 py-4 text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No waste records logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
