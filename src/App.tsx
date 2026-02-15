import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import PatientsPage from "./pages/dashboard/PatientsPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import DentalChartsPage from "./pages/dashboard/DentalChartsPage";
import TreatmentsPage from "./pages/dashboard/TreatmentsPage";
import PrescriptionsPage from "./pages/dashboard/PrescriptionsPage";
import BillingPage from "./pages/dashboard/BillingPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import RevenueAllocationPage from "./pages/dashboard/RevenueAllocationPage";
import LabWorkPage from "./pages/dashboard/LabWorkPage";
import StaffPage from "./pages/dashboard/StaffPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import MyProfilePage from "./pages/dashboard/MyProfilePage";
import TutorialsPage from "./pages/dashboard/TutorialsPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import ReviewsPage from "./pages/dashboard/ReviewsPage";
import ExpensesPage from "./pages/dashboard/ExpensesPage";
import AuditLogPage from "./pages/dashboard/AuditLogPage";
import ConsentFormsPage from "./pages/dashboard/ConsentFormsPage";
import DocumentsPage from "./pages/dashboard/DocumentsPage";
import PatientProfilePage from "./pages/dashboard/PatientProfilePage";
import LabDashboardPage from "./pages/dashboard/LabDashboardPage";
import LabCasesPage from "./pages/dashboard/LabCasesPage";
import LabTechniciansPage from "./pages/dashboard/LabTechniciansPage";
import LabBillingPage from "./pages/dashboard/LabBillingPage";
import LabSettingsPage from "./pages/dashboard/LabSettingsPage";

const queryClient = new QueryClient();

function DashboardRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardRoute><DashboardHome /></DashboardRoute>} />
            <Route path="/dashboard/patients" element={<DashboardRoute><PatientsPage /></DashboardRoute>} />
            <Route path="/dashboard/patients/:id" element={<DashboardRoute><PatientProfilePage /></DashboardRoute>} />
            <Route path="/dashboard/appointments" element={<DashboardRoute><AppointmentsPage /></DashboardRoute>} />
            <Route path="/dashboard/dental-charts" element={<DashboardRoute><DentalChartsPage /></DashboardRoute>} />
            <Route path="/dashboard/treatments" element={<DashboardRoute><TreatmentsPage /></DashboardRoute>} />
            <Route path="/dashboard/prescriptions" element={<DashboardRoute><PrescriptionsPage /></DashboardRoute>} />
            <Route path="/dashboard/billing" element={<DashboardRoute><BillingPage /></DashboardRoute>} />
            <Route path="/dashboard/reports" element={<DashboardRoute><ReportsPage /></DashboardRoute>} />
            <Route path="/dashboard/revenue-allocation" element={<DashboardRoute><RevenueAllocationPage /></DashboardRoute>} />
            <Route path="/dashboard/lab-work" element={<DashboardRoute><LabWorkPage /></DashboardRoute>} />
            <Route path="/dashboard/staff" element={<DashboardRoute><StaffPage /></DashboardRoute>} />
            <Route path="/dashboard/inventory" element={<DashboardRoute><InventoryPage /></DashboardRoute>} />
            <Route path="/dashboard/notifications" element={<DashboardRoute><NotificationsPage /></DashboardRoute>} />
            <Route path="/dashboard/settings" element={<DashboardRoute><SettingsPage /></DashboardRoute>} />
            <Route path="/dashboard/profile" element={<DashboardRoute><MyProfilePage /></DashboardRoute>} />
            <Route path="/dashboard/tutorials" element={<DashboardRoute><TutorialsPage /></DashboardRoute>} />
            <Route path="/dashboard/messages" element={<DashboardRoute><MessagesPage /></DashboardRoute>} />
            <Route path="/dashboard/reviews" element={<DashboardRoute><ReviewsPage /></DashboardRoute>} />
            <Route path="/dashboard/expenses" element={<DashboardRoute><ExpensesPage /></DashboardRoute>} />
            <Route path="/dashboard/audit-log" element={<DashboardRoute><AuditLogPage /></DashboardRoute>} />
            <Route path="/dashboard/consent-forms" element={<DashboardRoute><ConsentFormsPage /></DashboardRoute>} />
            <Route path="/dashboard/documents" element={<DashboardRoute><DocumentsPage /></DashboardRoute>} />
            <Route path="/dashboard/lab" element={<DashboardRoute><LabDashboardPage /></DashboardRoute>} />
            <Route path="/dashboard/lab/cases" element={<DashboardRoute><LabCasesPage /></DashboardRoute>} />
            <Route path="/dashboard/lab/technicians" element={<DashboardRoute><LabTechniciansPage /></DashboardRoute>} />
            <Route path="/dashboard/lab/billing" element={<DashboardRoute><LabBillingPage /></DashboardRoute>} />
            <Route path="/dashboard/lab/settings" element={<DashboardRoute><LabSettingsPage /></DashboardRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
