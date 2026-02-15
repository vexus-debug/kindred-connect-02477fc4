type AppRole = "admin" | "dentist" | "receptionist" | "hygienist" | "assistant" | "accountant" | "lab_technician";

// Maps each dashboard path to the roles that can access it
export const PAGE_ROLE_ACCESS: Record<string, AppRole[]> = {
  "/dashboard": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/patients": ["admin", "dentist", "receptionist", "hygienist", "assistant"],
  "/dashboard/appointments": ["admin", "dentist", "receptionist", "hygienist", "assistant"],
  "/dashboard/dental-charts": ["admin", "dentist", "hygienist"],
  "/dashboard/treatments": ["admin", "dentist"],
  "/dashboard/prescriptions": ["admin", "dentist"],
  "/dashboard/billing": ["admin", "dentist", "receptionist", "accountant"],
  "/dashboard/reports": ["admin", "accountant"],
  "/dashboard/revenue-allocation": ["admin"],
  "/dashboard/lab-work": ["admin", "dentist", "hygienist", "assistant"],
  "/dashboard/lab": ["admin", "lab_technician"],
  "/dashboard/lab/cases": ["admin", "lab_technician"],
  "/dashboard/lab/technicians": ["admin", "lab_technician"],
  "/dashboard/lab/billing": ["admin", "lab_technician"],
  "/dashboard/lab/settings": ["admin"],
  "/dashboard/staff": ["admin"],
  "/dashboard/inventory": ["admin", "accountant"],
  "/dashboard/notifications": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/settings": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/profile": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/tutorials": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant"],
  "/dashboard/messages": ["admin", "dentist", "receptionist", "hygienist", "assistant", "accountant", "lab_technician"],
  "/dashboard/reviews": ["admin", "receptionist"],
  "/dashboard/expenses": ["admin", "accountant"],
  "/dashboard/audit-log": ["admin"],
  "/dashboard/consent-forms": ["admin", "dentist"],
  "/dashboard/documents": ["admin"],
};

export function hasPageAccess(roles: string[], path: string): boolean {
  if (roles.includes("admin")) return true;
  if (path.startsWith("/dashboard/patients/")) {
    return PAGE_ROLE_ACCESS["/dashboard/patients"]?.some((r) => roles.includes(r)) ?? false;
  }
  const allowed = PAGE_ROLE_ACCESS[path];
  if (!allowed) return true;
  return allowed.some((r) => roles.includes(r));
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Admin",
    dentist: "Dentist",
    receptionist: "Receptionist",
    hygienist: "Hygienist",
    assistant: "Assistant",
    accountant: "Accountant",
    lab_technician: "Lab Technician",
  };
  return labels[role] || role;
}
