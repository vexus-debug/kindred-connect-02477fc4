import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop, FloatingBookButton } from "@/components/layout";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import BookAppointment from "./pages/BookAppointment";
import Contact from "./pages/Contact";
import Testimonials from "./pages/Testimonials";
import Gallery from "./pages/Gallery";
import Promotions from "./pages/Promotions";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
// Signup removed — admin-only account creation

// Service Pages
import GeneralPreventive from "./pages/services/GeneralPreventive";
import CosmeticDentistry from "./pages/services/CosmeticDentistry";
import Orthodontics from "./pages/services/Orthodontics";
import Restorative from "./pages/services/Restorative";
import DentalImplants from "./pages/services/DentalImplants";
import OralSurgery from "./pages/services/OralSurgery";
import Periodontics from "./pages/services/Periodontics";

// Dashboard Pages
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import PatientsPage from "./pages/dashboard/PatientsPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import DentalChartsPage from "./pages/dashboard/DentalChartsPage";
import TreatmentsPage from "./pages/dashboard/TreatmentsPage";
import PrescriptionsPage from "./pages/dashboard/PrescriptionsPage";
import BillingPage from "./pages/dashboard/BillingPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import LabWorkPage from "./pages/dashboard/LabWorkPage";
import LabDashboardPage from "./pages/dashboard/LabDashboardPage";
import LabCasesPage from "./pages/dashboard/LabCasesPage";
import LabTechniciansPage from "./pages/dashboard/LabTechniciansPage";
import LabBillingPage from "./pages/dashboard/LabBillingPage";
import LabSettingsPage from "./pages/dashboard/LabSettingsPage";
import StaffPage from "./pages/dashboard/StaffPage";
import InventoryPage from "./pages/dashboard/InventoryPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PatientProfilePage from "./pages/dashboard/PatientProfilePage";
import MyProfilePage from "./pages/dashboard/MyProfilePage";
import TutorialsPage from "./pages/dashboard/TutorialsPage";
import RevenueAllocationPage from "./pages/dashboard/RevenueAllocationPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import ReviewsPage from "./pages/dashboard/ReviewsPage";
import ExpensesPage from "./pages/dashboard/ExpensesPage";
import AuditLogPage from "./pages/dashboard/AuditLogPage";
import ConsentFormsPage from "./pages/dashboard/ConsentFormsPage";
import DocumentsPage from "./pages/dashboard/DocumentsPage";

const queryClient = new QueryClient();

const ProtectedDashboard = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <FloatingBookButton />
          <Routes>
            {/* Core Pages */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            
            {/* Service Sub-Pages */}
            <Route path="/services/general-preventive" element={<GeneralPreventive />} />
            <Route path="/services/cosmetic" element={<CosmeticDentistry />} />
            <Route path="/services/orthodontics" element={<Orthodontics />} />
            <Route path="/services/restorative" element={<Restorative />} />
            <Route path="/services/implants" element={<DentalImplants />} />
            <Route path="/services/oral-surgery" element={<OralSurgery />} />
            <Route path="/services/periodontics" element={<Periodontics />} />
            
            {/* Trust & Conversion Pages */}
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/promotions" element={<Promotions />} />
            
            {/* Utility Pages */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Dashboard Routes - Protected */}
            <Route path="/dashboard" element={<ProtectedDashboard><DashboardHome /></ProtectedDashboard>} />
            <Route path="/dashboard/patients" element={<ProtectedDashboard><PatientsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/patients/:patientId" element={<ProtectedDashboard><PatientProfilePage /></ProtectedDashboard>} />
            <Route path="/dashboard/appointments" element={<ProtectedDashboard><AppointmentsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/dental-charts" element={<ProtectedDashboard><DentalChartsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/treatments" element={<ProtectedDashboard><TreatmentsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/prescriptions" element={<ProtectedDashboard><PrescriptionsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/billing" element={<ProtectedDashboard><BillingPage /></ProtectedDashboard>} />
            <Route path="/dashboard/reports" element={<ProtectedDashboard><ReportsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab-work" element={<ProtectedDashboard><LabWorkPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab" element={<ProtectedDashboard><LabDashboardPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/cases" element={<ProtectedDashboard><LabCasesPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/technicians" element={<ProtectedDashboard><LabTechniciansPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/billing" element={<ProtectedDashboard><LabBillingPage /></ProtectedDashboard>} />
            <Route path="/dashboard/lab/settings" element={<ProtectedDashboard><LabSettingsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/staff" element={<ProtectedDashboard><StaffPage /></ProtectedDashboard>} />
            <Route path="/dashboard/inventory" element={<ProtectedDashboard><InventoryPage /></ProtectedDashboard>} />
            <Route path="/dashboard/notifications" element={<ProtectedDashboard><NotificationsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/settings" element={<ProtectedDashboard><SettingsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/profile" element={<ProtectedDashboard><MyProfilePage /></ProtectedDashboard>} />
            <Route path="/dashboard/tutorials" element={<ProtectedDashboard><TutorialsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/revenue-allocation" element={<ProtectedDashboard><RevenueAllocationPage /></ProtectedDashboard>} />
            <Route path="/dashboard/messages" element={<ProtectedDashboard><MessagesPage /></ProtectedDashboard>} />
            <Route path="/dashboard/reviews" element={<ProtectedDashboard><ReviewsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/expenses" element={<ProtectedDashboard><ExpensesPage /></ProtectedDashboard>} />
            <Route path="/dashboard/audit-log" element={<ProtectedDashboard><AuditLogPage /></ProtectedDashboard>} />
            <Route path="/dashboard/consent-forms" element={<ProtectedDashboard><ConsentFormsPage /></ProtectedDashboard>} />
            <Route path="/dashboard/documents" element={<ProtectedDashboard><DocumentsPage /></ProtectedDashboard>} />
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
