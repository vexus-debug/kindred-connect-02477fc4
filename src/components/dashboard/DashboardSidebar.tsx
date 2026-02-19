import { useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import { LogOut, Building2, Shield } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import clinexusLogoWhite from "@/assets/clinexus-logo-white.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useOrg } from "@/hooks/useOrg";
import { hasPageAccess, getRoleLabel } from "@/config/roleAccess";
import { getClinicConfig, sharedNavItems } from "@/config/clinicTypeConfig";
import { useUnreadCount, useRealtimeNotifications } from "@/hooks/useNotifications";
import { useUnreadMessageCount, useRealtimeMessages } from "@/hooks/useMessages";
import { motion } from "framer-motion";

export function DashboardSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, user, signOut, orgMemberships, roles } = useAuth();
  const { currentOrg, basePath } = useOrg();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: unreadMsgCount = 0 } = useUnreadMessageCount();
  useRealtimeNotifications();
  useRealtimeMessages();

  const orgRole = currentOrg?.role || "receptionist";
  const clinicType = currentOrg?.clinic_type || "dental";
  const config = getClinicConfig(clinicType);

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [location.pathname, isMobile, setOpenMobile]);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Staff";
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300">
      {/* Logo / Clinic Name */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-sidebar-border">
        <div className="relative shrink-0">
          <img src={clinexusLogoWhite} alt="Clinexus" className="h-8 w-auto object-contain" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-sidebar-primary-foreground truncate tracking-tight">
              {currentOrg?.org_name || "Clinexus"}
            </span>
            <span className="text-[10px] text-sidebar-foreground/60 font-medium capitalize">
              {config.label}
            </span>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2 px-2">
        {config.navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => hasPageAccess(orgRole, item.path));
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] text-sidebar-foreground/40 font-semibold px-2 mb-0.5 flex items-center gap-1.5">
                <span className="h-px flex-1 bg-sidebar-border/40" />
                {group.label}
                <span className="h-px flex-1 bg-sidebar-border/40" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const fullUrl = `${basePath}/${item.path}`;
                    const active = location.pathname === fullUrl;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                          <NavLink
                            to={fullUrl}
                            className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-sidebar-accent group"
                            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                          >
                            {active && (
                              <motion.div
                                layoutId="sidebar-active-pill"
                                className="absolute inset-0 rounded-lg bg-white/15 border border-white/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                              />
                            )}
                            <item.icon className={`h-4 w-4 shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110 ${active ? "text-sidebar-primary" : "text-sidebar-foreground/70"}`} />
                            <span className="relative z-10">{item.title}</span>
                            {item.path === "messages" && !collapsed && unreadMsgCount > 0 && (
                              <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-[10px] px-1.5 animate-pulse relative z-10">
                                {unreadMsgCount}
                              </Badge>
                            )}
                            {item.path === "notifications" && !collapsed && unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-[10px] px-1.5 animate-pulse relative z-10">
                                {unreadCount}
                              </Badge>
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}

        {/* Shared nav items (messages, notifications, tutorials, settings) */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sharedNavItems.filter((item) => hasPageAccess(orgRole, item.path)).map((item) => {
                const fullUrl = `${basePath}/${item.path}`;
                const active = location.pathname === fullUrl;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <NavLink
                        to={fullUrl}
                        className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-sidebar-accent group"
                        activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                      >
                        <item.icon className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-sidebar-primary" : "text-sidebar-foreground/70"}`} />
                        <span>{item.title}</span>
                        {item.path === "messages" && !collapsed && unreadMsgCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-[10px] px-1.5 animate-pulse">
                            {unreadMsgCount}
                          </Badge>
                        )}
                        {item.path === "notifications" && !collapsed && unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-[10px] px-1.5 animate-pulse">
                            {unreadCount}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`${basePath}/profile`)} className="shrink-0 group" title="My Profile">
            <Avatar className="h-8 w-8 ring-2 ring-sidebar-primary/20 transition-all duration-200 group-hover:ring-sidebar-primary/40">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-gradient-to-br from-sidebar-primary/30 to-sidebar-primary/10 text-sidebar-primary text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </button>
          {!collapsed && (
            <button onClick={() => navigate(`${basePath}/profile`)} className="flex flex-col overflow-hidden flex-1 text-left hover:opacity-80 transition-opacity">
              <span className="text-sm font-medium truncate text-sidebar-primary-foreground">{displayName}</span>
              <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 mt-0.5 border-sidebar-primary/30 text-sidebar-primary/80">
                {getRoleLabel(orgRole)}
              </Badge>
            </button>
          )}
          {!collapsed && (
            <div className="flex items-center gap-1">
              {roles.includes("super_admin") && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-md hover:bg-red-500/10"
                  title="Admin Panel"
                >
                  <Shield className="h-4 w-4" />
                </button>
              )}
              {orgMemberships.length > 1 && (
                <button
                  onClick={() => navigate("/select-clinic")}
                  className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-md hover:bg-primary/10"
                  title="Switch clinic"
                >
                  <Building2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-destructive/10"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
