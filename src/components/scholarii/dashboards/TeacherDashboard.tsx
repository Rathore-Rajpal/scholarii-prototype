import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  User,
  FileCheck,
  FilePlus,
  ClipboardList,
  Edit,
  CalendarDays,
  PartyPopper,
  Sun,
  BookMarked,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import {
  getTeacherDashboardData,
  type TeacherDashboardData,
} from "@/lib/scholarii/teacher-mock-data";
import { useAuth } from "@/lib/scholarii/auth";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "schedule", label: "Today's Schedule", icon: Clock },
  { id: "chapters", label: "Ongoing Chapters", icon: BookOpen },
  { id: "events", label: "Upcoming Events", icon: Calendar },
  { id: "pending", label: "Pending Actions", icon: FileText },
  { id: "ai", label: "AI Insights", icon: Sparkles },
  { id: "actions", label: "Quick Actions", icon: Zap },
] as const;

type TabId = (typeof TABS)[number]["id"];

function TodayScheduleTab({ data }: { data: TeacherDashboardData }) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold">Today&apos;s Schedule</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your classes for the day, in order.
          </p>
        </div>
        <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px]">
          Teaching workspace
        </Badge>
      </div>
      <div className="divide-y divide-border/50">
        {data.todaySchedule.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-4 px-5 py-4 transition-colors",
              item.status === "ongoing" && "bg-sky-500/5",
            )}
          >
            <div className="flex min-w-[140px] items-center gap-2">
              <div
                className={cn(
                  "size-2 rounded-full",
                  item.status === "completed"
                    ? "bg-emerald-500"
                    : item.status === "ongoing"
                      ? "bg-sky-500 animate-pulse"
                      : item.isProxy
                        ? "bg-amber-500"
                        : "bg-muted-foreground/30",
                )}
              />
              <span className="text-sm font-medium text-muted-foreground">
                {item.time} - {item.endTime}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{item.className}</span>
                <span className="text-xs text-muted-foreground">{item.subject}</span>
                <span className="text-xs text-muted-foreground">Room {item.room}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.isProxy && (
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-500/10 text-[10px] text-amber-700"
                >
                  Proxy
                </Badge>
              )}
              {item.status === "completed" && (
                <Badge
                  variant="outline"
                  className="border-emerald-200 bg-emerald-500/10 text-[10px] text-emerald-700"
                >
                  Completed
                </Badge>
              )}
              {item.status === "ongoing" && (
                <Badge
                  variant="outline"
                  className="border-sky-200 bg-sky-500/10 text-[10px] text-sky-700"
                >
                  Ongoing
                </Badge>
              )}
              {item.status === "upcoming" && !item.isProxy && (
                <Badge variant="outline" className="text-[10px]">
                  Upcoming
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function OngoingChaptersTab({ data }: { data: TeacherDashboardData }) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <h3 className="text-sm font-semibold">Ongoing Chapters</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Progress at a glance for each live class.
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {data.ongoingChapters.map((chapter) => (
          <div key={chapter.id} className="flex items-center gap-4 px-5 py-4">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-sky-500/10">
              <BookMarked className="size-4 text-sky-700" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{chapter.className}</span>
                <span className="text-xs text-muted-foreground">{chapter.subject}</span>
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{chapter.chapter}</div>
            </div>
            <div className="flex min-w-[120px] items-center gap-2">
              <Progress value={chapter.progress} className="h-1.5 flex-1" />
              <span className="text-xs font-medium">{chapter.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function UpcomingEventsTab({ data }: { data: TeacherDashboardData }) {
  const iconMap = { exam: GraduationCap, pta: Users, event: PartyPopper, holiday: Sun };
  const colorMap = {
    exam: "bg-sky-500/10 text-sky-700",
    pta: "bg-violet-500/10 text-violet-700",
    event: "bg-emerald-500/10 text-emerald-700",
    holiday: "bg-amber-500/10 text-amber-700",
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <h3 className="text-sm font-semibold">Upcoming Events</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Events that matter to your class and teaching day.
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {data.upcomingEvents.map((event) => {
          const Icon = iconMap[event.type];
          return (
            <div key={event.id} className="flex items-center gap-4 px-5 py-4">
              <div
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-xl",
                  colorMap[event.type],
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium">{event.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{event.date}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PendingActionsTab({ data }: { data: TeacherDashboardData }) {
  const iconMap = {
    documents: FileCheck,
    assignments: FileText,
    marks: Edit,
    attendance: ClipboardCheck,
    reports: ClipboardList,
  };
  const colorMap = {
    documents: "bg-amber-500/10 text-amber-700",
    assignments: "bg-violet-500/10 text-violet-700",
    marks: "bg-sky-500/10 text-sky-700",
    attendance: "bg-emerald-500/10 text-emerald-700",
    reports: "bg-rose-500/10 text-rose-700",
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <h3 className="text-sm font-semibold">Pending Actions</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          A clean queue of the work waiting on you.
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {data.pendingActions.map((action) => {
          const Icon = iconMap[action.type];
          return (
            <div key={action.id} className="flex items-center gap-4 px-5 py-4">
              <div
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-xl",
                  colorMap[action.type],
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium">{action.title}</span>
              </div>
              <Badge variant="outline" className="rounded-full text-[10px]">
                {action.count} Pending
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function AiInsightsTab({ data }: { data: TeacherDashboardData }) {
  const typeConfig = {
    warning: { icon: AlertTriangle, color: "border-amber-200 bg-amber-500/10 text-amber-700" },
    info: { icon: Sparkles, color: "border-sky-200 bg-sky-500/10 text-sky-700" },
    success: { icon: CheckCircle2, color: "border-emerald-200 bg-emerald-500/10 text-emerald-700" },
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <h3 className="text-sm font-semibold">AI Insights</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Focused insights for class teaching and follow-up.
        </p>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        {data.aiInsights.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <div
              key={insight.id}
              className={cn("flex items-start gap-3 rounded-xl border p-3", config.color)}
            >
              <Icon className="mt-0.5 size-4 shrink-0" />
              <p className="text-xs leading-relaxed text-muted-foreground">{insight.text}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function QuickActionsTab() {
  const nav = useNavigate();
  const actions = [
    {
      label: "Mark Attendance",
      icon: ClipboardCheck,
      action: () => nav({ to: "/app/attendance" as never }),
    },
    { label: "Enter Marks", icon: Edit, action: () => {} },
    { label: "Verify Documents", icon: FileCheck, action: () => {} },
    { label: "Create Assignment", icon: FilePlus, action: () => {} },
    { label: "Generate Question Paper", icon: FileText, action: () => {} },
    { label: "Create Daily Report", icon: ClipboardList, action: () => {} },
    { label: "Open My Class", icon: Users, action: () => nav({ to: "/app/classes" as never }) },
    { label: "Open AI Assistant", icon: Sparkles, action: () => nav({ to: "/app/ai" as never }) },
  ];

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <div className="border-b border-border/60 px-5 py-4">
        <h3 className="text-sm font-semibold">Quick Actions</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Everything you use most often, kept within reach.
        </p>
      </div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={a.action}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm hover:border-border"
            >
              <div className="grid size-9 place-items-center rounded-xl bg-muted/60">
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium">{a.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const data = useMemo(() => getTeacherDashboardData(), []);
  const [activeTab, setActiveTab] = useState<TabId>("schedule");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const teacherName = user?.name?.split(" ")[0] ?? "Mr. Kumar";
  const heroStats = [
    { label: "Today's Classes", value: data.totalClasses, icon: Calendar },
    { label: "My Class Attendance", value: `${data.myClassAttendance}%`, icon: Users },
    { label: "Pending Verifications", value: data.pendingDocVerifications, icon: FileCheck },
    { label: "Proxy Classes", value: data.proxyClasses, icon: User },
    { label: "Upcoming Events", value: data.upcomingEvents.length, icon: CalendarDays },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Dashboard"
        subtitle="A focused workspace for your class, schedule, and day-to-day teaching flow."
      />

      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border/60 px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {getGreeting()}, {teacherName}
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Your teaching workspace for today
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Track your class schedule, manage follow-ups, and keep attendance and student actions
              in one calm dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
            <Avatar className="size-10 border border-background shadow-sm">
              <AvatarFallback className="bg-sky-500/10 text-sky-700 font-medium">
                {user?.name?.charAt(0) ?? "T"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold text-foreground">{teacherName}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 px-5 py-5 sm:grid-cols-2 xl:grid-cols-5">
          {heroStats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-9 place-items-center rounded-xl bg-sky-500/10">
                    <Icon className="size-4 text-sky-700" />
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight">{item.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{item.label}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10">
              <ClipboardCheck className="size-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Class Attendance</div>
              <div className="text-lg font-semibold">{data.myClassAttendance}%</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Your class is performing above the target band this week.
          </div>
        </Card>
        <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-amber-500/10">
              <FileCheck className="size-4 text-amber-700" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pending Verifications</div>
              <div className="text-lg font-semibold">{data.pendingDocVerifications}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Documents that still need attention from your class workflow.
          </div>
        </Card>
        <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-sky-500/10">
              <Zap className="size-4 text-sky-700" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Proxy Classes</div>
              <div className="text-lg font-semibold">{data.proxyClasses}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Classes requiring coverage or quick substitution.
          </div>
        </Card>
      </div>

      <div className="sticky top-16 z-10 rounded-2xl border border-border/60 bg-background/80 p-2 shadow-sm backdrop-blur-xl">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[300px]">
        {activeTab === "schedule" && <TodayScheduleTab data={data} />}
        {activeTab === "chapters" && <OngoingChaptersTab data={data} />}
        {activeTab === "events" && <UpcomingEventsTab data={data} />}
        {activeTab === "pending" && <PendingActionsTab data={data} />}
        {activeTab === "ai" && <AiInsightsTab data={data} />}
        {activeTab === "actions" && <QuickActionsTab />}
      </div>
    </div>
  );
}
