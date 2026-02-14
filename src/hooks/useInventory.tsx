import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type InventoryItem = Tables<"inventory">;

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as InventoryItem[];
    },
  });
}

export function useAddInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<InventoryItem, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("inventory").insert(item);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

export function useUpdateInventoryStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { error } = await supabase
        .from("inventory")
        .update({ quantity, last_restocked: new Date().toISOString().split("T")[0] })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; name?: string; category?: string; unit?: string; min_stock?: number; supplier?: string | null }) => {
      const { error } = await supabase.from("inventory").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inventory").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });
}
