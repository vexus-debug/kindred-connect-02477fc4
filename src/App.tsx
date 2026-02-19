import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { OrgProvider } from "@/hooks/useOrg";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
import PaymentPlansPage from "./pages/dashboard/PaymentPlansPage";
import EstimatesPage from "./pages/dashboard/EstimatesPage";
import CommissionPayoutsPage from "./pages/dashboard/CommissionPayoutsPage";
import ProfitabilityPage from "./pages/dashboard/ProfitabilityPage";
import InventoryCostsPage from "./pages/dashboard/InventoryCostsPage";
import AuditLogPage from "./pages/dashboard/AuditLogPage";
import ConsentFormsPage from "./pages/dashboard/ConsentFormsPage";
import DocumentsPage from "./pages/dashboard/DocumentsPage";
import AutomationPage from "./pages/dashboard/AutomationPage";
import WebsiteSettingsPage from "./pages/dashboard/WebsiteSettingsPage";
import PatientProfilePage from "./pages/dashboard/PatientProfilePage";
import LabDashboardPage from "./pages/dashboard/LabDashboardPage";
import LabCasesPage from "./pages/dashboard/LabCasesPage";
import LabTechniciansPage from "./pages/dashboard/LabTechniciansPage";
import LabBillingPage from "./pages/dashboard/LabBillingPage";
import LabSettingsPage from "./pages/dashboard/LabSettingsPage";
import PublicClinicSite from "./pages/PublicClinicSite";
import PublicShopPage from "./pages/PublicShopPage";
import PublicProductPage from "./pages/PublicProductPage";
import WaitingListPage from "./pages/dashboard/WaitingListPage";
import SchedulesPage from "./pages/dashboard/SchedulesPage";
import SuppliersPage from "./pages/dashboard/SuppliersPage";
import PurchaseOrdersPage from "./pages/dashboard/PurchaseOrdersPage";
import TreatmentMaterialsPage from "./pages/dashboard/TreatmentMaterialsPage";
import AdvancedAnalyticsPage from "./pages/dashboard/AdvancedAnalyticsPage";
import ShopManagementPage from "./pages/dashboard/ShopManagementPage";

// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminClinics from "./pages/admin/AdminClinics";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import PlatformAuditLogPage from "./pages/admin/PlatformAuditLogPage";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminClinicDetail from "./pages/admin/AdminClinicDetail";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminSupportTickets from "./pages/admin/AdminSupportTickets";
import AdminFeatureFlags from "./pages/admin/AdminFeatureFlags";
import AdminPlatformSettings from "./pages/admin/AdminPlatformSettings";
import AdminDataExport from "./pages/admin/AdminDataExport";
import AdminOnboardingFunnel from "./pages/admin/AdminOnboardingFunnel";
import AdminStorageMonitoring from "./pages/admin/AdminStorageMonitoring";
import AdminNotificationLogs from "./pages/admin/AdminNotificationLogs";
import AdminHealthMonitoring from "./pages/admin/AdminHealthMonitoring";
import AdminWhiteLabel from "./pages/admin/AdminWhiteLabel";

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

function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedAdminRoute>
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
            <Route path="/site/:slug" element={<PublicClinicSite />} />
            <Route path="/site/:slug/shop" element={<PublicShopPage />} />
            <Route path="/site/:slug/shop/:productId" element={<PublicProductPage />} />
            <Route path="/select-clinic" element={<SelectClinic />} />

            {/* Legacy redirect */}
            <Route path="/dashboard" element={<Navigate to="/select-clinic" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/select-clinic" replace />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
            <Route path="/admin/clinics" element={<AdminRoute><AdminClinics /></AdminRoute>} />
            <Route path="/admin/clinics/:slug" element={<AdminRoute><AdminClinicDetail /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptions /></AdminRoute>} />
            <Route path="/admin/revenue" element={<AdminRoute><AdminRevenue /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="/admin/onboarding" element={<AdminRoute><AdminOnboardingFunnel /></AdminRoute>} />
            <Route path="/admin/announcements" element={<AdminRoute><AdminAnnouncements /></AdminRoute>} />
            <Route path="/admin/support" element={<AdminRoute><AdminSupportTickets /></AdminRoute>} />
            <Route path="/admin/notification-logs" element={<AdminRoute><AdminNotificationLogs /></AdminRoute>} />
            <Route path="/admin/feature-flags" element={<AdminRoute><AdminFeatureFlags /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminPlatformSettings /></AdminRoute>} />
            <Route path="/admin/audit-log" element={<AdminRoute><PlatformAuditLogPage /></AdminRoute>} />
            <Route path="/admin/health" element={<AdminRoute><AdminHealthMonitoring /></AdminRoute>} />
            <Route path="/admin/storage" element={<AdminRoute><AdminStorageMonitoring /></AdminRoute>} />
            <Route path="/admin/data-export" element={<AdminRoute><AdminDataExport /></AdminRoute>} />
            <Route path="/admin/white-label" element={<AdminRoute><AdminWhiteLabel /></AdminRoute>} />

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
            <Route path="/clinic/:slug/payment-plans" element={<ClinicRoute><PaymentPlansPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/estimates" element={<ClinicRoute><EstimatesPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/commissions" element={<ClinicRoute><CommissionPayoutsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/profitability" element={<ClinicRoute><ProfitabilityPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/inventory-costs" element={<ClinicRoute><InventoryCostsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/audit-log" element={<ClinicRoute><AuditLogPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/consent-forms" element={<ClinicRoute><ConsentFormsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/documents" element={<ClinicRoute><DocumentsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/automation" element={<ClinicRoute><AutomationPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/website-settings" element={<ClinicRoute><WebsiteSettingsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/waiting-list" element={<ClinicRoute><WaitingListPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/schedules" element={<ClinicRoute><SchedulesPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/suppliers" element={<ClinicRoute><SuppliersPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/purchase-orders" element={<ClinicRoute><PurchaseOrdersPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/treatment-materials" element={<ClinicRoute><TreatmentMaterialsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/analytics" element={<ClinicRoute><AdvancedAnalyticsPage /></ClinicRoute>} />
            <Route path="/clinic/:slug/shop-management" element={<ClinicRoute><ShopManagementPage /></ClinicRoute>} />
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
