import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthProfile {
  full_name: string;
  phone?: string;
  avatar_url?: string;
}

interface OrgMembership {
  org_id: string;
  role: string;
  org_name: string;
  org_slug: string;
  clinic_type: string;
}

interface AuthContextType {
  user: User | null;
  profile: AuthProfile | null;
  session: Session | null;
  roles: string[]; // platform roles
  orgMemberships: OrgMembership[];
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  roles: [],
  orgMemberships: [],
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [orgMemberships, setOrgMemberships] = useState<OrgMembership[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, phone, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch platform roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      setRoles((rolesData || []).map((r) => r.role));

      // Fetch org memberships
      const { data: memberships } = await supabase
        .from("org_members")
        .select("org_id, role, organizations(name, slug, clinic_type)")
        .eq("user_id", userId);

      setOrgMemberships(
        (memberships || []).map((m: any) => ({
          org_id: m.org_id,
          role: m.role,
          org_name: m.organizations?.name || "",
          org_slug: m.organizations?.slug || "",
          clinic_type: m.organizations?.clinic_type || "dental",
        }))
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Use setTimeout to avoid Supabase deadlock
          setTimeout(() => fetchUserData(newSession.user.id), 0);
        } else {
          setProfile(null);
          setRoles([]);
          setOrgMemberships([]);
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      if (existingSession?.user) {
        fetchUserData(existingSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setOrgMemberships([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        roles,
        orgMemberships,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
