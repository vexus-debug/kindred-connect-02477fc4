import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

interface OrgContextType {
  currentOrg: {
    org_id: string;
    org_name: string;
    org_slug: string;
    clinic_type: string;
    role: string;
  } | null;
  setCurrentOrgBySlug: (slug: string) => void;
  basePath: string; // e.g. "/clinic/my-clinic"
}

const OrgContext = createContext<OrgContextType>({
  currentOrg: null,
  setCurrentOrgBySlug: () => {},
  basePath: "",
});

export function OrgProvider({ children }: { children: ReactNode }) {
  const { orgMemberships, loading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentOrg, setCurrentOrg] = useState<OrgContextType["currentOrg"]>(null);

  const setCurrentOrgBySlug = (targetSlug: string) => {
    const membership = orgMemberships.find((m) => m.org_slug === targetSlug);
    if (membership) {
      setCurrentOrg({
        org_id: membership.org_id,
        org_name: membership.org_name,
        org_slug: membership.org_slug,
        clinic_type: membership.clinic_type,
        role: membership.role,
      });
    }
  };

  // Sync from URL slug
  useEffect(() => {
    if (loading || orgMemberships.length === 0) return;

    if (slug) {
      const membership = orgMemberships.find((m) => m.org_slug === slug);
      if (membership) {
        setCurrentOrg({
          org_id: membership.org_id,
          org_name: membership.org_name,
          org_slug: membership.org_slug,
          clinic_type: membership.clinic_type,
          role: membership.role,
        });
      } else {
        // User doesn't have access to this org
        navigate("/select-clinic", { replace: true });
      }
    }
  }, [slug, orgMemberships, loading, navigate]);

  const basePath = currentOrg ? `/clinic/${currentOrg.org_slug}` : "";

  return (
    <OrgContext.Provider value={{ currentOrg, setCurrentOrgBySlug, basePath }}>
      {children}
    </OrgContext.Provider>
  );
}

export const useOrg = () => useContext(OrgContext);
