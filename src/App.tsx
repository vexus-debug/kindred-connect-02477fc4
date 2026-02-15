import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OrgProvider } from "@/hooks/useOrg";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Login from "./pages/Login";
import SelectClinic from "./pages/SelectClinic";
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

function ClinicRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <OrgProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </OrgProvider>
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
            <Route path="/select-clinic" element={<SelectClinic />} />

            {/* Legacy redirect */}
            <Route path="/dashboard" element={<Navigate to="/select-clinic" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/select-clinic" replace />} />

            {/* Clinic routes */}
            <Route path="/clinic/:slug/dashboard" element={<ClinicRoute><DashboardHome /></ClinicRoute>} />
            <Route path="/clinic/:slug/patients" element={<ClinicRoute><PatientsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/patients/:id" element={<ClinicRoute><PatientProfilePage /></ClinicRoute>} />
            <Route path="/clinic/:slug/appointments" element={<ClinicRoute><AppointmentsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/dental-charts" element={<ClinicRoute><DentalChartsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/treatments" element={<ClinicRoute><TreatmentsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/prescriptions" element={<ClinicRoute><PrescriptionsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/billing" element={<ClinicRoute><BillingPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/reports" element={<ClinicRoute><ReportsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/revenue-allocation" element={<ClinicRoute><RevenueAllocationPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/lab-work" element={<ClinicRoute><LabWorkPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/staff" element={<ClinicRoute><StaffPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/inventory" element={<ClinicRoute><InventoryPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/notifications" element={<ClinicRoute><NotificationsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/settings" element={<ClinicRoute><SettingsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/profile" element={<ClinicRoute><MyProfilePage /></ClinicRoute>} />
            <Route path="/clinic/:slug/tutorials" element={<ClinicRoute><TutorialsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/messages" element={<ClinicRoute><MessagesPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/reviews" element={<ClinicRoute><ReviewsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/expenses" element={<ClinicRoute><ExpensesPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/audit-log" element={<ClinicRoute><AuditLogPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/consent-forms" element={<ClinicRoute><ConsentFormsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/documents" element={<ClinicRoute><DocumentsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/lab" element={<ClinicRoute><LabDashboardPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/lab/cases" element={<ClinicRoute><LabCasesPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/lab/technicians" element={<ClinicRoute><LabTechniciansPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/lab/billing" element={<ClinicRoute><LabBillingPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/lab/settings" element={<ClinicRoute><LabSettingsPage /></ClinicRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
