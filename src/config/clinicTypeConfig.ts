import {
  LayoutDashboard, Users, CalendarDays, Stethoscope, CreditCard, FlaskConical,
  UserCog, Package, BarChart3, Bell, Settings, GraduationCap, Microscope,
  ClipboardList, DollarSign, Wrench, MessageSquare, Star, Receipt, Shield,
  FileCheck, FolderOpen,
} from "lucide-react";

export interface NavItem {
  title: string;
  path: string; // relative path after /clinic/:slug/
  icon: any;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface ClinicTypeConfig {
  label: string;
  navGroups: NavGroup[];
}

const dentalNav: NavGroup[] = [
  {
    label: "General",
    items: [
      { title: "Dashboard", path: "dashboard", icon: LayoutDashboard },
      { title: "Patients", path: "patients", icon: Users },
      { title: "Appointments", path: "appointments", icon: CalendarDays },
      { title: "Reviews", path: "reviews", icon: Star },
    ],
  },
  {
    label: "Clinical",
    items: [
      { title: "Dental Charts", path: "dental-charts", icon: Stethoscope },
      { title: "Treatments", path: "treatments", icon: Stethoscope },
      { title: "Prescriptions", path: "prescriptions", icon: Stethoscope },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Billing", path: "billing", icon: CreditCard },
      { title: "Expenses", path: "expenses", icon: Receipt },
      { title: "Reports", path: "reports", icon: BarChart3 },
      { title: "Revenue Allocation", path: "revenue-allocation", icon: DollarSign },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Lab Work", path: "lab-work", icon: FlaskConical },
      { title: "Staff", path: "staff", icon: UserCog },
      { title: "Inventory", path: "inventory", icon: Package },
    ],
  },
  {
    label: "Compliance",
    items: [
      { title: "Consent Forms", path: "consent-forms", icon: FileCheck },
      { title: "Documents", path: "documents", icon: FolderOpen },
      { title: "Audit Log", path: "audit-log", icon: Shield },
    ],
  },
  {
    label: "Lab Management",
    items: [
      { title: "Lab Dashboard", path: "lab", icon: Microscope },
      { title: "Lab Cases", path: "lab/cases", icon: ClipboardList },
      { title: "Technicians", path: "lab/technicians", icon: Users },
      { title: "Lab Billing", path: "lab/billing", icon: DollarSign },
      { title: "Lab Settings", path: "lab/settings", icon: Wrench },
    ],
  },
];

const extraItems: NavItem[] = [
  { title: "Messages", path: "messages", icon: MessageSquare },
  { title: "Notifications", path: "notifications", icon: Bell },
  { title: "Tutorials", path: "tutorials", icon: GraduationCap },
  { title: "Settings", path: "settings", icon: Settings },
];

export const clinicTypeConfig: Record<string, ClinicTypeConfig> = {
  dental: {
    label: "Dental Clinic",
    navGroups: dentalNav,
  },
};

export const sharedNavItems = extraItems;

// Get config for a clinic type, falling back to dental
export function getClinicConfig(clinicType: string): ClinicTypeConfig {
  return clinicTypeConfig[clinicType] || clinicTypeConfig.dental;
}
