import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface StaffMember {
  id: string;
  full_name: string;
  role: string;
  phone: string;
  email: string;
  specialty: string;
  status: string;
  [key: string]: any;
}

export function useStaff() {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("staff")
        .select("*")
        .order("full_name");
      if (error) throw error;
      return (data || []) as StaffMember[];
    },
  });
}

export function useDentists() {
  return useQuery({
    queryKey: ["staff", "dentists"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("staff")
        .select("*")
        .eq("role", "dentist")
        .eq("status", "active")
        .order("full_name");
      if (error) throw error;
      return (data || []) as StaffMember[];
    },
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (staff: any) => {
      const { data, error } = await (supabase as any).from("staff").insert(staff).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Staff added", description: `${data.full_name} has been added.` });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await (supabase as any).from("staff").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Staff updated", description: `${data.full_name} has been updated.` });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
