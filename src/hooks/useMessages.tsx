import { useQuery } from "@tanstack/react-query";

export interface MessageWithDetails {
  id: string;
  sender_id: string;
  content: string;
  is_broadcast: boolean;
  broadcast_role: string | null;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
  attachments?: any[];
  recipients?: { recipient_id: string; read: boolean }[];
}

export interface ConversationPartner {
  user_id: string;
  full_name: string;
  role: string;
  last_message_at: string;
  unread_count: number;
}

export interface MessageAttachment {
  id: string;
  entity_type: string;
  entity_id: string;
  entity_label: string;
}

export function getAllowedRecipientRoles(senderRoles: string[]): string[] {
  return ["admin", "dentist", "receptionist", "accountant", "hygienist", "assistant", "lab_technician"];
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => [] as ConversationPartner[],
  });
}

export function useMessageThread(partnerId: string | null) {
  return useQuery({
    queryKey: ["message-thread", partnerId],
    enabled: !!partnerId,
    queryFn: async () => [] as MessageWithDetails[],
  });
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: ["unread-message-count"],
    queryFn: async () => 0,
  });
}

export function useSendMessage() {
  return { mutate: () => {}, mutateAsync: async () => ({}) } as any;
}

export function useMarkMessagesRead() {
  return { mutate: () => {}, mutateAsync: async () => {} } as any;
}

export function useRealtimeMessages() {
  // No-op without Supabase
}
