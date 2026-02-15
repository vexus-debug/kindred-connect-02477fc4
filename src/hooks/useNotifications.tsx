import { useQuery } from "@tanstack/react-query";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => [] as Notification[],
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => 0,
  });
}

export function useRealtimeNotifications() {
  // No-op without Supabase
}

export function useMarkNotificationRead() {
  return { mutate: () => {}, mutateAsync: async () => {} } as any;
}

export function useMarkAllNotificationsRead() {
  return { mutate: () => {}, mutateAsync: async () => {} } as any;
}
