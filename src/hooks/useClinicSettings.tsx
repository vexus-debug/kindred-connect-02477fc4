import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useOrg } from "@/hooks/useOrg";

export interface SiteSettings {
  welcome_text?: string;
  primary_color?: string;
  accent_color?: string;
}

export interface ClinicSettings {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  clinic_type: string;
  logo_url: string | null;
  settings: SiteSettings | null;
  slug: string;
}

export function useClinicSettings() {
  const { currentOrg } = useOrg();
  const orgId = currentOrg?.org_id;

  return useQuery({
    queryKey: ["clinic-settings", orgId],
    enabled: !!orgId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("id, name, address, phone, email, clinic_type, logo_url, settings, slug")
        .eq("id", orgId!)
        .maybeSingle();
      if (error) throw error;
      return data as ClinicSettings | null;
    },
  });
}

export function useUpdateClinicSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: { id: string; name?: string; address?: string; phone?: string; email?: string; logo_url?: string; settings?: SiteSettings }) => {
      const { id, settings: siteSettings, ...rest } = updates;
      const payload: Record<string, any> = { ...rest };
      if (siteSettings !== undefined) {
        payload.settings = siteSettings;
      }
      const { error } = await supabase.from("organizations").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-settings"] });
      toast({ title: "Clinic settings saved" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
