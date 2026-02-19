import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users, CalendarDays, CreditCard, TrendingUp, UserPlus, CalendarPlus, FileText,
  Clock, Activity, ArrowUpRight, ArrowDownRight, Zap, ChevronRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, PieChart, Pie, Cell,
} from "recharts";
import {
  useDashboardStats, useWeeklyAppointments, useRevenueData,
  useTodaySchedule, useRecentActivity, useCurrentUserName,
} from "@/hooks/useDashboardData";
import { format } from "date-fns";
import { useOrg } from "@/hooks/useOrg";
import { hasPageAccess } from "@/config/roleAccess";
import { AnimatedCounter } from "@/components/dashboard/AnimatedCounter";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* ─── Colour maps ────────────────────────────────────────────── */
const statusColors: Record<string, string> = {
  scheduled:    "bg-primary/10 text-primary border-primary/20",
  "in-progress": "bg-amber-500/10 text-amber-700 border-amber-500/20",
  completed:    "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  cancelled:    "bg-red-500/10 text-red-700 border-red-500/20",
};
const statusDots: Record<string, string> = {
  scheduled:    "bg-primary",
  "in-progress": "bg-amber-500",
  completed:    "bg-emerald-500",
  cancelled:    "bg-red-500",
};
const activityColors: Record<string, string> = {
  appointment:  "bg-primary/10 text-primary",
  payment:      "bg-emerald-500/10 text-emerald-600",
  patient:      "bg-primary/10 text-primary",
  lab:          "bg-amber-500/10 text-amber-600",
  prescription: "bg-rose-500/10 text-rose-600",
};
const activityIcons: Record<string, typeof Activity> = {
  appointment:  CalendarDays,
  payment:      CreditCard,
  patient:      Users,
  lab:          FileText,
  prescription: FileText,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 0,
  }).format(amount);
}

/* ─── Mini sparkline ─────────────────────────────────────────── */
const sparkData = {
  patients:     [{ v: 40 }, { v: 55 }, { v: 48 }, { v: 62 }, { v: 58 }, { v: 72 }, { v: 80 }],
  appointments: [{ v: 12 }, { v: 18 }, { v: 14 }, { v: 22 }, { v: 16 }, { v: 20 }, { v: 18 }],
  payments:     [{ v: 38 }, { v: 32 }, { v: 35 }, { v: 30 }, { v: 28 }, { v: 32 }, { v: 32 }],
  revenue:      [{ v: 3.2 }, { v: 3.8 }, { v: 4.1 }, { v: 3.6 }, { v: 4.5 }, { v: 4.85 }],
};

function MiniSparkline({ data, color, height = 40 }: { data: { v: number }[]; color: string; height?: number }) {
  const id = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${id})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── Animation variants ─────────────────────────────────────── */
const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } },
  item: {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] as const } },
  },
};

/* ─── Tooltip style ──────────────────────────────────────────── */
const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0 8px 24px -4px hsl(var(--foreground) / 0.08)",
};

const PIE_COLORS = [
  "hsl(185, 72%, 32%)",
  "hsl(185, 60%, 44%)",
  "hsl(38, 88%, 50%)",
  "hsl(220, 60%, 52%)",
  "hsl(152, 62%, 40%)",
  "hsl(0, 84%, 56%)",
];

/* ─── Greeting helper ────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ═══════════════════════════════════════════════════════════════
   Dashboard Home
═══════════════════════════════════════════════════════════════ */
export default function DashboardHome() {
  const [revPeriod, setRevPeriod] = useState<"6M" | "1Y">("6M");

  const { data: stats } = useDashboardStats();
  const { data: weeklyData } = useWeeklyAppointments();
  const { data: revenueData } = useRevenueData();
  const { data: todayAppointments } = useTodaySchedule();
  const { data: activities } = useRecentActivity();
  const { data: userName } = useCurrentUserName();
  const { currentOrg, basePath } = useOrg();
  const orgRole = currentOrg?.role || "receptionist";

  const s = stats || { totalPatients: 0, todayAppointments: 0, pendingPayments: 0, monthlyRevenue: 0 };
  const schedule = todayAppointments || [];
  const recentActivities = activities || [];
  const currentMonth = format(new Date(), "MMM");

  const canSeePatients     = hasPageAccess(orgRole, "patients");
  const canSeeBilling      = hasPageAccess(orgRole, "billing");
  const canSeeAppointments = hasPageAccess(orgRole, "appointments");

  /* KPI stat card definitions */
  const statCards = [
    canSeePatients && {
      label: "Total Patients", value: s.totalPatients, icon: Users,
      trend: "+12%", trendUp: true,
      color: "hsl(220,80%,52%)",
      bar: "linear-gradient(90deg, hsl(220,80%,52%), hsl(220,70%,70%))",
      iconBg: "bg-blue-500/10", iconColor: "text-blue-600",
      spark: sparkData.patients,
    },
    canSeeAppointments && {
      label: "Today's Appointments", value: s.todayAppointments, icon: CalendarDays,
      trend: `${schedule.filter((a) => a.status === "completed").length} done`, trendUp: true,
      color: "hsl(152,62%,40%)",
      bar: "linear-gradient(90deg, hsl(152,62%,40%), hsl(152,55%,58%))",
      iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600",
      spark: sparkData.appointments,
    },
    canSeeBilling && {
      label: "Pending Payments", value: s.pendingPayments, icon: CreditCard,
      trend: "-5%", trendUp: false,
      color: "hsl(38,88%,50%)",
      bar: "linear-gradient(90deg, hsl(38,88%,50%), hsl(38,82%,68%))",
      iconBg: "bg-amber-500/10", iconColor: "text-amber-600",
      spark: sparkData.payments,
    },
    canSeeBilling && {
      label: `Revenue (${currentMonth})`, value: s.monthlyRevenue, icon: TrendingUp,
      formatter: formatCurrency, trend: "+8.2%", trendUp: true,
      color: "hsl(185,72%,32%)",
      bar: "linear-gradient(90deg, hsl(185,72%,32%), hsl(185,60%,50%))",
      iconBg: "bg-primary/10", iconColor: "text-primary",
      spark: sparkData.revenue,
    },
  ].filter(Boolean) as any[];

  /* Quick actions */
  const quickActions = [
    canSeePatients    && { to: `${basePath}/patients`,     icon: UserPlus,    title: "Register Patient",  desc: "Add new patient record", color: "bg-blue-500/10 text-blue-600" },
    canSeeAppointments && { to: `${basePath}/appointments`, icon: CalendarPlus, title: "Book Appointment",  desc: "Schedule a visit",       color: "bg-emerald-500/10 text-emerald-600" },
    canSeeBilling     && { to: `${basePath}/billing`,      icon: FileText,    title: "Create Invoice",    desc: "Generate a bill",        color: "bg-primary/10 text-primary" },
  ].filter(Boolean) as any[];

  /* Treatment distribution placeholder (pie) */
  const treatmentPie = [
    { name: "Check-up", value: 30 },
    { name: "Filling",  value: 22 },
    { name: "Cleaning", value: 18 },
    { name: "Extraction", value: 14 },
    { name: "Other",    value: 16 },
  ];

  return (
    <div className="space-y-5">

      {/* ── Row 1: Hero Welcome Banner ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/8 via-card to-dental-teal-pale/30 p-6 shadow-sm">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/6 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-dental-teal-light/8 blur-2xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  {format(new Date(), "EEEE, MMMM d")}
                </span>
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                {getGreeting()}, {userName || "Doctor"} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {schedule.length > 0
                  ? `${schedule.length} appointment${schedule.length !== 1 ? "s" : ""} today — ${schedule.filter((a) => a.status === "completed").length} completed, ${schedule.filter((a) => a.status === "scheduled").length} upcoming`
                  : "No appointments scheduled for today. A fresh start!"}
              </p>
            </div>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {quickActions.map((action: any) => (
                <Button key={action.to} size="sm" className="bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20 text-primary-foreground gap-1.5 rounded-lg" asChild>
                  <Link to={action.to}>
                    <action.icon className="h-3.5 w-3.5" />
                    {action.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Row 2: KPI Stat Cards ──────────────────────────────── */}
      <motion.div
        className={cn("grid gap-4", statCards.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : `sm:grid-cols-${Math.min(statCards.length, 3)}`)}
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((card: any, i: number) => (
          <motion.div key={i} variants={stagger.item}>
            <Card
              className="stat-card relative overflow-hidden bg-card"
              style={{ "--stat-card-bar": card.bar } as any}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center ring-1 ring-border/30", card.iconBg)}>
                    <card.icon className={cn("h-5 w-5", card.iconColor)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full",
                    card.trendUp
                      ? "bg-emerald-500/10 text-emerald-700"
                      : "bg-red-500/10 text-red-700"
                  )}>
                    {card.trendUp
                      ? <ArrowUpRight className="h-3 w-3" />
                      : <ArrowDownRight className="h-3 w-3" />}
                    {card.trend}
                  </div>
                </div>

                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                  <AnimatedCounter value={card.value} formatter={card.formatter} />
                </p>

                <div className="mt-3 -mx-1 -mb-1">
                  <MiniSparkline data={card.spark} color={card.color} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Row 3: Schedule (2/3) + Activity Feed (1/3) ────────── */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Today's Schedule */}
        {canSeeAppointments && (
          <Card className="lg:col-span-2 border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[15px] font-semibold">Today's Schedule</CardTitle>
                  <CardDescription className="text-xs mt-0.5 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {schedule.filter((a) => a.status === "completed").length} done
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {schedule.filter((a) => a.status === "in-progress").length} in progress
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {schedule.filter((a) => a.status === "scheduled").length} upcoming
                    </span>
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary text-xs gap-1" asChild>
                  <Link to={`${basePath}/appointments`}>
                    View all <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {schedule.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">No appointments today</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">Schedule one to get started</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`${basePath}/appointments`}>Book Appointment</Link>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border/40">
                        <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Time</th>
                        <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Patient</th>
                        <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-[11px] uppercase tracking-wider hidden md:table-cell">Dentist</th>
                        <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-[11px] uppercase tracking-wider hidden lg:table-cell">Chair</th>
                        <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Treatment</th>
                        <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.slice(0, 8).map((apt, i) => {
                        const initials = apt.patientName.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
                        return (
                          <motion.tr
                            key={apt.id}
                            className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {apt.time}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-7 w-7 shrink-0">
                                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground text-sm">{apt.patientName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell text-muted-foreground text-sm">{apt.dentist}</td>
                            <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground text-sm">{apt.chair}</td>
                            <td className="py-3 px-4 text-muted-foreground text-sm">{apt.treatment}</td>
                            <td className="py-3 px-4">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border",
                                statusColors[apt.status] || ""
                              )}>
                                <span className={cn("h-1.5 w-1.5 rounded-full", statusDots[apt.status] || "")} />
                                {apt.status.replace("-", " ")}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Activity Feed */}
        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[15px] font-semibold">Recent Activity</CardTitle>
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <CardDescription className="text-xs">Latest clinic updates</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pt-3 pb-2">
            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {recentActivities.map((activity) => {
                  const Icon = activityIcons[activity.event_type] || Activity;
                  const colorClass = activityColors[activity.event_type] || "bg-muted text-muted-foreground";
                  return (
                    <div key={activity.id} className="timeline-item flex gap-3 pb-4">
                      <div className={cn("h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ring-2 ring-card", colorClass)}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug">{activity.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {format(new Date(activity.created_at), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: Charts Grid ──────────────────────────────────── */}
      {(canSeeAppointments || canSeeBilling) && (
        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          variants={stagger.container}
          initial="hidden"
          animate="visible"
        >
          {/* Revenue trend (area chart) */}
          {canSeeBilling && (
            <motion.div variants={stagger.item} className="lg:col-span-2">
              <Card className="border-border bg-card shadow-sm h-full">
                <CardHeader className="pb-2 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-[15px] font-semibold">Revenue Overview</CardTitle>
                      <CardDescription className="text-xs">Monthly revenue trend (₦)</CardDescription>
                    </div>
                    <div className="flex gap-0.5 bg-muted/60 rounded-lg p-0.5">
                      {(["6M", "1Y"] as const).map((label) => (
                        <button
                          key={label}
                          onClick={() => setRevPeriod(label)}
                          className={cn(
                            "px-3 py-1 text-[11px] font-semibold rounded-md transition-all",
                            revPeriod === label
                              ? "bg-card text-primary shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={revenueData || []}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        axisLine={false} tickLine={false} width={44}
                        tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatCurrency(v), "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Treatment distribution (donut) */}
          <motion.div variants={stagger.item}>
            <Card className="border-border bg-card shadow-sm h-full">
              <CardHeader className="pb-2 border-b border-border/40">
                <CardTitle className="text-[15px] font-semibold">Treatments</CardTitle>
                <CardDescription className="text-xs">Distribution by type</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col items-center">
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={treatmentPie}
                      cx="50%" cy="50%"
                      innerRadius={48} outerRadius={72}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {treatmentPie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-1">
                  {treatmentPie.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-[11px] text-muted-foreground truncate">{item.name}</span>
                      <span className="text-[11px] font-semibold text-foreground ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* ── Row 5: Weekly Appointments bar chart ────────────────── */}
      {canSeeAppointments && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="pb-2 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[15px] font-semibold">Weekly Appointments</CardTitle>
                  <CardDescription className="text-xs">Appointment trends this week</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary text-xs gap-1" asChild>
                  <Link to={`${basePath}/appointments`}>
                    Full calendar <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyData || []} barCategoryGap="28%">
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

    </div>
  );
}
