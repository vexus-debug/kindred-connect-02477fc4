type OrgRole = "owner" | "admin" | "dentist" | "receptionist" | "hygienist" | "assistant" | "accountant" | "lab_technician";

// Maps each relative dashboard path to the org roles that can access it
export const PAGE_ROLE_ACCESS: Record<string, OrgRole[]> = {
  "dashboard": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "patients": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant"],
  "appointments": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant"],
  "dental-charts": ["owner", "admin", "dentist", "hygienist"],
  "treatments": ["owner", "admin", "dentist"],
  "prescriptions": ["owner", "admin", "dentist"],
  "billing": ["owner", "admin", "dentist", "receptionist", "accountant"],
  "reports": ["owner", "admin", "accountant"],
  "revenue-allocation": ["owner", "admin"],
  "lab-work": ["owner", "admin", "dentist", "hygienist", "assistant"],
  "lab": ["owner", "admin", "lab_technician"],
  "lab/cases": ["owner", "admin", "lab_technician"],
  "lab/technicians": ["owner", "admin", "lab_technician"],
  "lab/billing": ["owner", "admin", "lab_technician"],
  "lab/settings": ["owner", "admin"],
  "staff": ["owner", "admin"],
  "inventory": ["owner", "admin", "accountant"],
  "notifications": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "settings": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "profile": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "tutorials": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "messages": ["owner", "admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "lab_technician"],
  "reviews": ["owner", "admin", "receptionist"],
  "expenses": ["owner", "admin", "accountant"],
  "audit-log": ["owner", "admin"],
  "consent-forms": ["owner", "admin", "dentist"],
  "documents": ["owner", "admin"],
};

/**
 * Check if a user's org role allows access to a relative page path.
 * orgRole is the user's role within the current organization.
 */
export function hasPageAccess(orgRole: string, relativePath: string): boolean {
  if (orgRole === "owner" || orgRole === "admin") return true;
  // Handle patient profile sub-routes
  if (relativePath.startsWith("patients/")) {
    return PAGE_ROLE_ACCESS["patients"]?.includes(orgRole as OrgRole) ?? false;
  }
  const allowed = PAGE_ROLE_ACCESS[relativePath];
  if (!allowed) return true; // unknown paths are accessible
  return allowed.includes(orgRole as OrgRole);
}

/**
 * Extract relative path from full pathname.
 * e.g. "/clinic/my-clinic/patients" -> "patients"
 */
export function extractRelativePath(pathname: string): string {
  const match = pathname.match(/^\/clinic\/[^/]+\/(.+)$/);
  return match ? match[1] : "dashboard";
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    owner: "Owner",
    admin: "Admin",
    dentist: "Dentist",
    receptionist: "Receptionist",
    hygienist: "Hygienist",
    assistant: "Assistant",
    accountant: "Accountant",
    lab_technician: "Lab Technician",
    super_admin: "Super Admin",
    user: "User",
  };
  return labels[role] || role;
}
