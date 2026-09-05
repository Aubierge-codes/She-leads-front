import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000',
});

export function apiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) return data.message.join(', ');
    if (typeof data?.message === 'string') return data.message;
  }
  return fallback;
}

// ---------- Enums ----------

export type ParticipantStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
export type CleanupEventStatus = 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type WasteType = 'PLASTIC' | 'PAPER' | 'METAL' | 'GLASS' | 'ORGANIC' | 'OTHER';
export type InventoryTransactionType = 'RESTOCK' | 'USAGE' | 'ADJUSTMENT';
export type MeetingFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
export type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type DonationFrequency = 'ONE_TIME' | 'MONTHLY';
export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// ---------- Entities ----------

export interface Community {
  id: string;
  name: string;
  state: string;
  notes?: string | null;
  createdAt: string;
  _count?: { cleanupEvents: number; participants: number; schools: number };
}

export interface School {
  id: string;
  name: string;
  location: string;
  teacherCoordinator: string;
  communityId?: string | null;
  community?: Community | null;
  createdAt: string;
  _count?: { participants: number; environmentalClubs: number };
}

export interface Participant {
  id: string;
  name: string;
  age: number;
  schoolId?: string | null;
  communityId?: string | null;
  status: ParticipantStatus;
  school?: School | null;
  community?: Community | null;
  createdAt: string;
}

export interface WasteRecord {
  id: string;
  eventId: string;
  type: WasteType;
  weightKg: number;
  bags: number;
  createdAt: string;
  event?: CleanupEvent;
}

export interface CleanupAttendance {
  id: string;
  participantId: string;
  eventId: string;
  attended: boolean;
  participant?: Participant;
}

export interface CleanupEvent {
  id: string;
  title: string;
  eventDate: string;
  eventTime?: string | null;
  leader: string;
  status: CleanupEventStatus;
  communityId?: string | null;
  community?: Community | null;
  attendances?: CleanupAttendance[];
  wasteRecords?: WasteRecord[];
  _count?: { attendances: number; wasteRecords: number };
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minimumStock: number;
  transactions?: InventoryTransaction[];
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: InventoryTransactionType;
  quantity: number;
  note?: string | null;
  createdAt: string;
}

export interface EnvironmentalClub {
  id: string;
  schoolId: string;
  president: string;
  meetingFrequency: MeetingFrequency;
  memberCount: number;
  school?: School;
}

export interface WeeklyReport {
  id: string;
  weekNumber: number;
  year: number;
  activities: string;
  photos: string[];
  status: ReportStatus;
  schoolId?: string | null;
  school?: School | null;
  createdAt: string;
}

export interface DashboardSummary {
  participantsCount: number;
  schoolsCount: number;
  communitiesCount: number;
  cleanupEventsCount: number;
  upcomingEventsCount: number;
  clubsCount: number;
  pendingReportsCount: number;
  totalWasteWeightKg: number;
  totalWasteBags: number;
  lowStockItemsCount: number;
  donationsRaised: number;
}

export interface ActivityItem {
  type: 'school' | 'participant' | 'event' | 'report';
  title: string;
  description: string;
  timestamp: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  amount: number;
  currency: string;
  frequency: DonationFrequency;
  status: DonationStatus;
  message?: string | null;
  createdAt: string;
  donor?: Donor;
}

export interface DonationStats {
  totalRaised: number;
  supportersCount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
  refundedCount: number;
}

// ---------- API modules ----------

export const communitiesApi = {
  list: () => api.get<Community[]>('/communities').then((r) => r.data),
  get: (id: string) => api.get<Community>(`/communities/${id}`).then((r) => r.data),
  create: (data: Partial<Community>) => api.post<Community>('/communities', data).then((r) => r.data),
  update: (id: string, data: Partial<Community>) =>
    api.patch<Community>(`/communities/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/communities/${id}`).then((r) => r.data),
};

export const schoolsApi = {
  list: () => api.get<School[]>('/schools').then((r) => r.data),
  get: (id: string) => api.get<School>(`/schools/${id}`).then((r) => r.data),
  create: (data: Partial<School>) => api.post<School>('/schools', data).then((r) => r.data),
  update: (id: string, data: Partial<School>) => api.patch<School>(`/schools/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/schools/${id}`).then((r) => r.data),
};

export const participantsApi = {
  list: () => api.get<Participant[]>('/participants').then((r) => r.data),
  get: (id: string) => api.get<Participant>(`/participants/${id}`).then((r) => r.data),
  create: (data: Partial<Participant>) => api.post<Participant>('/participants', data).then((r) => r.data),
  update: (id: string, data: Partial<Participant>) =>
    api.patch<Participant>(`/participants/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/participants/${id}`).then((r) => r.data),
};

export const cleanupApi = {
  list: () => api.get<CleanupEvent[]>('/cleanup/events').then((r) => r.data),
  get: (id: string) => api.get<CleanupEvent>(`/cleanup/events/${id}`).then((r) => r.data),
  create: (data: Partial<CleanupEvent>) => api.post<CleanupEvent>('/cleanup/events', data).then((r) => r.data),
  update: (id: string, data: Partial<CleanupEvent>) =>
    api.patch<CleanupEvent>(`/cleanup/events/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/cleanup/events/${id}`).then((r) => r.data),
  markAttendance: (id: string, participantIds: string[], attended = true) =>
    api.post(`/cleanup/events/${id}/attendance`, { participantIds, attended }).then((r) => r.data),
  addWasteRecord: (id: string, data: { type: WasteType; weightKg: number; bags: number }) =>
    api.post<WasteRecord>(`/cleanup/events/${id}/waste-records`, data).then((r) => r.data),
  recentWasteRecords: () => api.get<WasteRecord[]>('/cleanup/events/recent-waste-records').then((r) => r.data),
};

export const inventoryApi = {
  list: () => api.get<InventoryItem[]>('/inventory').then((r) => r.data),
  get: (id: string) => api.get<InventoryItem>(`/inventory/${id}`).then((r) => r.data),
  lowStock: () => api.get<InventoryItem[]>('/inventory/low-stock').then((r) => r.data),
  create: (data: Partial<InventoryItem>) => api.post<InventoryItem>('/inventory', data).then((r) => r.data),
  update: (id: string, data: Partial<InventoryItem>) =>
    api.patch<InventoryItem>(`/inventory/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/inventory/${id}`).then((r) => r.data),
  recordTransaction: (id: string, data: { type: InventoryTransactionType; quantity: number; note?: string }) =>
    api.post<InventoryTransaction>(`/inventory/${id}/transactions`, data).then((r) => r.data),
};

export const clubsApi = {
  list: () => api.get<EnvironmentalClub[]>('/clubs').then((r) => r.data),
  get: (id: string) => api.get<EnvironmentalClub>(`/clubs/${id}`).then((r) => r.data),
  create: (data: Partial<EnvironmentalClub>) => api.post<EnvironmentalClub>('/clubs', data).then((r) => r.data),
  update: (id: string, data: Partial<EnvironmentalClub>) =>
    api.patch<EnvironmentalClub>(`/clubs/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/clubs/${id}`).then((r) => r.data),
};

export const reportsApi = {
  list: () => api.get<WeeklyReport[]>('/reports').then((r) => r.data),
  get: (id: string) => api.get<WeeklyReport>(`/reports/${id}`).then((r) => r.data),
  create: (data: Partial<WeeklyReport>) => api.post<WeeklyReport>('/reports', data).then((r) => r.data),
  update: (id: string, data: Partial<WeeklyReport>) =>
    api.patch<WeeklyReport>(`/reports/${id}`, data).then((r) => r.data),
  updateStatus: (id: string, status: ReportStatus) =>
    api.patch<WeeklyReport>(`/reports/${id}/status`, { status }).then((r) => r.data),
  remove: (id: string) => api.delete(`/reports/${id}`).then((r) => r.data),
};

export const analyticsApi = {
  wasteByType: () =>
    api.get<{ type: WasteType; totalWeightKg: number; totalBags: number }[]>('/analytics/waste-by-type').then((r) => r.data),
  participantsByStatus: () =>
    api.get<{ status: ParticipantStatus; count: number }[]>('/analytics/participants-by-status').then((r) => r.data),
  cleanupEventsByStatus: () =>
    api.get<{ status: CleanupEventStatus; count: number }[]>('/analytics/cleanup-events-by-status').then((r) => r.data),
  reportsByStatus: () =>
    api.get<{ status: ReportStatus; count: number }[]>('/analytics/reports-by-status').then((r) => r.data),
  donationsByStatus: () =>
    api
      .get<{ status: DonationStatus; totalAmount: number; count: number }[]>('/analytics/donations-by-status')
      .then((r) => r.data),
};

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>('/dashboard/summary').then((r) => r.data),
  recentActivity: () => api.get<ActivityItem[]>('/dashboard/recent-activity').then((r) => r.data),
};

export const donationsApi = {
  list: () => api.get<Donation[]>('/donations').then((r) => r.data),
  get: (id: string) => api.get<Donation>(`/donations/${id}`).then((r) => r.data),
  stats: () => api.get<DonationStats>('/donations/stats').then((r) => r.data),
  create: (data: {
    amount: number;
    frequency: DonationFrequency;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    message?: string;
  }) => api.post<Donation>('/donations', data).then((r) => r.data),
  updateStatus: (id: string, status: DonationStatus) =>
    api.patch<Donation>(`/donations/${id}/status`, { status }).then((r) => r.data),
};

