import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => ({
      totalPatients: 128,
      todayAppointments: 12,
      pendingPayments: 8,
      monthlyRevenue: 52400,
    }),
  });
}

export function useWeeklyAppointments() {
  return useQuery({
    queryKey: ["weekly-appointments"],
    queryFn: async () => [
      { day: "Mon", count: 8 },
      { day: "Tue", count: 12 },
      { day: "Wed", count: 6 },
      { day: "Thu", count: 10 },
      { day: "Fri", count: 14 },
      { day: "Sat", count: 4 },
      { day: "Sun", count: 0 },
    ],
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ["revenue-data"],
    queryFn: async () => [
      { month: "Jan", revenue: 42000 },
      { month: "Feb", revenue: 48000 },
      { month: "Mar", revenue: 52000 },
      { month: "Apr", revenue: 47000 },
      { month: "May", revenue: 55000 },
      { month: "Jun", revenue: 52400 },
    ],
  });
}

export function useTodaySchedule() {
  return useQuery({
    queryKey: ["today-schedule"],
    queryFn: async () => [
      { id: "1", time: "09:00", patientName: "John Smith", dentist: "Dr. Adams", chair: "Chair 1", treatment: "Cleaning", status: "confirmed" },
      { id: "2", time: "10:30", patientName: "Jane Doe", dentist: "Dr. Adams", chair: "Chair 2", treatment: "Root Canal", status: "in-progress" },
      { id: "3", time: "14:00", patientName: "Bob Wilson", dentist: "Dr. Chen", chair: "Chair 1", treatment: "Check-up", status: "pending" },
    ],
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => [
      { id: "1", event_type: "patient_registered", description: "New patient registered: Sarah Johnson", created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: "2", event_type: "payment_received", description: "Invoice #1042 paid - KES 15,000", created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: "3", event_type: "appointment_completed", description: "Appointment completed: John Smith", created_at: new Date(Date.now() - 14400000).toISOString() },
    ],
  });
}

export function useCurrentUserName() {
  return useQuery({
    queryKey: ["current-user-name"],
    queryFn: async () => "Admin User",
  });
}
