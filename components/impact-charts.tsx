'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { analyticsApi } from '@/lib/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CHART_COLORS = ['#35502E', '#7C8A4C', '#A98F4B', '#C9A66B', '#E4D9C3', '#8B5E34'];

const WASTE_TYPE_LABELS: Record<string, string> = {
  PLASTIC: 'Plastic',
  PAPER: 'Paper',
  METAL: 'Metal',
  GLASS: 'Glass',
  ORGANIC: 'Organic',
  OTHER: 'Other',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  GRADUATED: 'Graduated',
};

export function ImpactCharts() {
  const [wasteByType, setWasteByType] = useState<{ type: string; totalWeightKg: number }[]>([]);
  const [participantsByStatus, setParticipantsByStatus] = useState<{ status: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.wasteByType(), analyticsApi.participantsByStatus()])
      .then(([waste, participants]) => {
        setWasteByType(waste);
        setParticipantsByStatus(participants);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return null;
  }

  const wasteData = {
    labels: wasteByType.map((w) => WASTE_TYPE_LABELS[w.type] ?? w.type),
    datasets: [
      {
        label: 'Waste collected (kg)',
        data: wasteByType.map((w) => w.totalWeightKg),
        backgroundColor: '#35502E',
        borderRadius: 4,
      },
    ],
  };

  const participantsData = {
    labels: participantsByStatus.map((p) => STATUS_LABELS[p.status] ?? p.status),
    datasets: [
      {
        data: participantsByStatus.map((p) => p.count),
        backgroundColor: CHART_COLORS,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Waste by type</h3>
        <div className="h-[280px]">
          {wasteByType.length > 0 ? (
            <Bar
              data={wasteData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No waste data recorded yet.</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Participants by status</h3>
        <div className="h-[280px] flex items-center justify-center">
          {participantsByStatus.length > 0 ? (
            <Doughnut
              data={participantsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } },
                cutout: '70%',
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No participant data recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
