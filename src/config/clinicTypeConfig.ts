import {
  LayoutDashboard, Users, CalendarDays, Stethoscope, CreditCard, FlaskConical,
  UserCog, Package, BarChart3, Bell, Settings, GraduationCap, Microscope,
  ClipboardList, DollarSign, Wrench, MessageSquare, Star, Receipt, Shield,
  FileCheck, FolderOpen, Eye, Heart, Baby, Bone, Ear, Wallet, FileText,
  PiggyBank, TrendingUp, Calculator, Bot, Clock, CalendarClock, Truck,
  ShoppingCart, Link2, Brain, Globe,
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

export interface ClinicTypeOption {
  value: string;
  label: string;
  description: string;
  icon: any;
  comingSoon: boolean;
}

// All supported clinic types for selection UI
export const clinicTypeOptions: ClinicTypeOption[] = [
  { value: "dental", label: "Dental Clinic", description: "General & specialized dentistry", icon: Stethoscope, comingSoon: false },
  { value: "eye", label: "Eye Clinic", description: "Ophthalmology & optometry", icon: Eye, comingSoon: true },
  { value: "dermatology", label: "Dermatology Clinic", description: "Skin care & cosmetic dermatology", icon: Heart, comingSoon: true },
  { value: "orthopedic", label: "Orthopedic Clinic", description: "Bone, joint & musculoskeletal care", icon: Bone, comingSoon: true },
  { value: "pediatric", label: "Pediatric Clinic", description: "Children's healthcare", icon: Baby, comingSoon: true },
  { value: "cardiology", label: "Cardiology Clinic", description: "Heart & cardiovascular care", icon: Heart, comingSoon: true },
  { value: "ent", label: "ENT Clinic", description: "Ear, nose & throat specialist", icon: Ear, comingSoon: true },
  { value: "general", label: "General Practice", description: "Primary care & family medicine", icon: Stethoscope, comingSoon: true },
];

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
      { title: "Estimates", path: "estimates", icon: FileText },
      { title: "Payment Plans", path: "payment-plans", icon: Wallet },
      { title: "Expenses", path: "expenses", icon: Receipt },
      { title: "Commissions", path: "commissions", icon: Calculator },
      { title: "Profitability", path: "profitability", icon: TrendingUp },
      { title: "Reports", path: "reports", icon: BarChart3 },
      { title: "Advanced Analytics", path: "analytics", icon: Brain },
      { title: "Revenue Allocation", path: "revenue-allocation", icon: DollarSign },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Website Settings", path: "website-settings", icon: Globe },
      { title: "Lab Work", path: "lab-work", icon: FlaskConical },
      { title: "Staff", path: "staff", icon: UserCog },
      { title: "Schedules", path: "schedules", icon: CalendarClock },
      { title: "Inventory", path: "inventory", icon: Package },
      { title: "Inventory Costs", path: "inventory-costs", icon: PiggyBank },
      { title: "Suppliers", path: "suppliers", icon: Truck },
      { title: "Purchase Orders", path: "purchase-orders", icon: ShoppingCart },
      { title: "Treatment Materials", path: "treatment-materials", icon: Link2 },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Waiting List", path: "waiting-list", icon: Clock },
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
    label: "Automation",
    items: [
      { title: "Automation", path: "automation", icon: Bot },
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
  // Future clinic types will be added here with their own navGroups
};

export const sharedNavItems = extraItems;

// Get config for a clinic type, falling back to dental
export function getClinicConfig(clinicType: string): ClinicTypeConfig {
  return clinicTypeConfig[clinicType] || clinicTypeConfig.dental;
}

// Check if a clinic type is available (not coming soon)
export function isClinicTypeAvailable(clinicType: string): boolean {
  const option = clinicTypeOptions.find((o) => o.value === clinicType);
  return option ? !option.comingSoon : false;
}
