'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, Recycle, Calendar, Loader2 } from 'lucide-react';
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
import { dashboardApi, analyticsApi, DashboardSummary, ActivityItem } from '@/lib/api';
import { toast } from 'sonner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WASTE_TYPE_LABELS: Record<string, string> = {
  PLASTIC: 'Plastic',
  PAPER: 'Paper',
  METAL: 'Metal',
  GLASS: 'Glass',
  ORGANIC: 'Organic',
  OTHER: 'Other',
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardHome() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [wasteByType, setWasteByType] = useState<{ type: string; totalWeightKg: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([dashboardApi.summary(), dashboardApi.recentActivity(), analyticsApi.wasteByType()])
      .then(([summaryData, activityData, wasteData]) => {
        if (!active) return;
        setSummary(summaryData);
        setActivity(activityData);
        setWasteByType(wasteData);
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { name: 'Total Participants', value: summary?.participantsCount ?? 0, icon: Users },
    { name: 'Active Schools', value: summary?.schoolsCount ?? 0, icon: GraduationCap },
    { name: 'Waste Collected (kg)', value: (summary?.totalWasteWeightKg ?? 0).toLocaleString(), icon: Recycle },
    { name: 'Upcoming Events', value: summary?.upcomingEventsCount ?? 0, icon: Calendar },
  ];

  const chartData = {
    labels: wasteByType.map((w) => WASTE_TYPE_LABELS[w.type] ?? w.type),
    datasets: [
      {
        label: 'Waste Collected (kg)',
        data: wasteByType.map((w) => w.totalWeightKg),
        backgroundColor: '#7C8A4C',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
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
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with ECO GIRLS COLLECTIVE today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Waste Collection by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {wasteByType.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No waste records yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm bg-card">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {activity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity yet.</p>
              )}
              {activity.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium leading-none text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                    {timeAgo(item.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
