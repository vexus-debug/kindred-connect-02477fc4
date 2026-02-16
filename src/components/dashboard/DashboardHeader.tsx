import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, User, Settings, LogOut, ChevronDown, Command } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useOrg } from "@/hooks/useOrg";
import { useUnreadCount } from "@/hooks/useNotifications";
import { extractRelativePath } from "@/config/roleAccess";
import { motion } from "framer-motion";

const breadcrumbLabels: Record<string, string> = {
  "dashboard": "Dashboard",
  "patients": "Patients",
  "appointments": "Appointments",
  "dental-charts": "Dental Charts",
  "treatments": "Treatments",
  "prescriptions": "Prescriptions",
  "billing": "Billing",
  "reports": "Reports",
  "lab-work": "Lab Work",
  "staff": "Staff",
  "inventory": "Inventory",
  "notifications": "Notifications",
  "tutorials": "Tutorials",
  "settings": "Settings",
  "profile": "My Profile",
  "lab": "Lab Dashboard",
  "lab/cases": "Lab Cases",
  "lab/technicians": "Technicians",
  "lab/billing": "Lab Billing",
  "lab/settings": "Lab Settings",
  "messages": "Messages",
  "reviews": "Reviews",
  "expenses": "Expenses",
  "audit-log": "Audit Log",
  "consent-forms": "Consent Forms",
  "documents": "Documents",
  "revenue-allocation": "Revenue Allocation",
};

export function DashboardHeader() {
  const { profile, user, signOut } = useAuth();
  const { basePath, currentOrg } = useOrg();
  const { data: unreadCount = 0 } = useUnreadCount();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Staff";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const relativePath = extractRelativePath(location.pathname);
  const currentPage = breadcrumbLabels[relativePath] || "Dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border/40 bg-card/90 backdrop-blur-2xl px-4 lg:px-6 shadow-[0_1px_3px_hsl(var(--primary)/0.04)]">
      <SidebarTrigger className="-ml-1" />

      {/* Breadcrumb */}
      <div className="hidden md:flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">{currentOrg?.org_name || "Dashboard"}</span>
        {currentPage !== "Dashboard" && (
          <>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium text-foreground">{currentPage}</span>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-md ml-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients, appointments..."
          className="pl-9 pr-16 h-9 bg-muted/40 border-border/50 focus-visible:bg-card focus-visible:ring-1 focus-visible:ring-ring/50 rounded-lg"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border border-border/60 bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link to={`${basePath}/notifications`}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <motion.span
                className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center px-0.5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent/50">
              <Avatar className="h-7 w-7 ring-2 ring-border/50">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">{displayName}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 backdrop-blur-xl bg-popover/95 border-border/50">
            <DropdownMenuItem onClick={() => navigate(`${basePath}/profile`)}>
              <User className="mr-2 h-4 w-4" />Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`${basePath}/settings`)}>
              <Settings className="mr-2 h-4 w-4" />Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
