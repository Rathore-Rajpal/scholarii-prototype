import { useMemo, useState, useRef, useCallback, useEffect } from "react";
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
  ChevronLeft,
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
      <div className="flex items-center justify-between border-b border-border/60 px-3 py-3 sm:px-5 sm:py-4">
        <div>
          <h3 className="text-xs font-semibold sm:text-sm">Today&apos;s Schedule</h3>
          <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
            Your classes for the day, in order.
          </p>
        </div>
        <Badge
          variant="outline"
          className="rounded-full px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-[10px]"
        >
          Teaching workspace
        </Badge>
      </div>
      <div className="divide-y divide-border/50">
        {data.todaySchedule.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex flex-col gap-2 px-3 py-3 transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4",
              item.status === "ongoing" && "bg-sky-500/5",
            )}
          >
            <div className="flex items-center justify-between sm:flex-1 sm:justify-start">
              <div className="flex items-center gap-2">
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
                <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {item.time} - {item.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:hidden">
                {item.isProxy && (
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-500/10 text-[9px] text-amber-700"
                  >
                    Proxy
                  </Badge>
                )}
                {item.status === "completed" && (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-500/10 text-[9px] text-emerald-700"
                  >
                    Done
                  </Badge>
                )}
                {item.status === "ongoing" && (
                  <Badge
                    variant="outline"
                    className="border-sky-200 bg-sky-500/10 text-[9px] text-sky-700"
                  >
                    Live
                  </Badge>
                )}
                {item.status === "upcoming" && !item.isProxy && (
                  <Badge variant="outline" className="text-[9px]">
                    Upcoming
                  </Badge>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1 sm:flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-medium sm:text-sm">{item.className}</span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">{item.subject}</span>
                <span className="hidden text-[10px] text-muted-foreground sm:inline sm:text-xs">
                  Room {item.room}
                </span>
              </div>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
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
      <div className="border-b border-border/60 px-3 py-3 sm:px-5 sm:py-4">
        <h3 className="text-xs font-semibold sm:text-sm">Ongoing Chapters</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
          Progress at a glance for each live class.
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {data.ongoingChapters.map((chapter) => (
          <div
            key={chapter.id}
            className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-sky-500/10 sm:size-9">
                <BookMarked className="size-3.5 text-sky-700 sm:size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-medium sm:text-sm">{chapter.className}</span>
                  <span className="text-[10px] text-muted-foreground sm:text-xs">
                    {chapter.subject}
                  </span>
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                  {chapter.chapter}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-10 sm:min-w-[120px] sm:pl-0">
              <Progress value={chapter.progress} className="h-1.5 flex-1 sm:h-1.5" />
              <span className="text-[10px] font-medium sm:text-xs">{chapter.progress}%</span>
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
      <div className="border-b border-border/60 px-3 py-3 sm:px-5 sm:py-4">
        <h3 className="text-xs font-semibold sm:text-sm">Upcoming Events</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
          Events that matter to your class and teaching day.
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {data.upcomingEvents.map((event) => {
          const Icon = iconMap[event.type];
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4"
            >
              <div
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-xl sm:size-9",
                  colorMap[event.type],
                )}
              >
                <Icon className="size-3.5 sm:size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium sm:text-sm">{event.title}</span>
              </div>
              <span className="text-[10px] text-muted-foreground sm:text-xs">{event.date}</span>
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
      <div className="border-b border-border/60 px-3 py-3 sm:px-5 sm:py-4">
        <h3 className="text-xs font-semibold sm:text-sm">Pending Actions</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
          A clean queue of the work waiting on you.
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {data.pendingActions.map((action) => {
          const Icon = iconMap[action.type];
          return (
            <div
              key={action.id}
              className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4"
            >
              <div
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-xl sm:size-9",
                  colorMap[action.type],
                )}
              >
                <Icon className="size-3.5 sm:size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium sm:text-sm">{action.title}</span>
              </div>
              <Badge
                variant="outline"
                className="rounded-full px-1.5 py-0.5 text-[9px] sm:rounded-full sm:text-[10px]"
              >
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
      <div className="border-b border-border/60 px-3 py-3 sm:px-5 sm:py-4">
        <h3 className="text-xs font-semibold sm:text-sm">AI Insights</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
          Focused insights for class teaching and follow-up.
        </p>
      </div>
      <div className="grid gap-2 p-3 sm:gap-3 sm:p-5 sm:grid-cols-2">
        {data.aiInsights.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <div
              key={insight.id}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-2.5 sm:gap-3 sm:p-3",
                config.color,
              )}
            >
              <Icon className="mt-0.5 size-3.5 shrink-0 sm:size-4" />
              <p className="text-[10px] leading-4 text-muted-foreground sm:text-xs sm:leading-relaxed">
                {insight.text}
              </p>
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
      action: () => nav({ to: "/app/myclass/attendance" as never }),
    },
    { label: "Enter Marks", icon: Edit, action: () => {} },
    { label: "Verify Documents", icon: FileCheck, action: () => {} },
    { label: "Create Assignment", icon: FilePlus, action: () => {} },
    { label: "Generate Question Paper", icon: FileText, action: () => {} },
    { label: "Create Daily Report", icon: ClipboardList, action: () => {} },
    {
      label: "Open My Class",
      icon: Users,
      action: () => nav({ to: "/app/myclass/students" as never }),
    },
    { label: "Open AI Assistant", icon: Sparkles, action: () => nav({ to: "/app/ai" as never }) },
  ];

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
      <div className="border-b border-border/60 px-3 py-3 sm:px-5 sm:py-4">
        <h3 className="text-xs font-semibold sm:text-sm">Quick Actions</h3>
        <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
          Everything you use most often, kept within reach.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-5 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={a.action}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm hover:border-border sm:gap-3 sm:px-4 sm:py-3"
            >
              <div className="grid size-7 place-items-center rounded-xl bg-muted/60 sm:size-9">
                <Icon className="size-3.5 text-muted-foreground sm:size-4" />
              </div>
              <span className="text-[10px] font-medium sm:text-xs">{a.label}</span>
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
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Auto-scroll active tab into view
  useEffect(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector("[data-active-tab]");
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeTab]);

  const scrollTabs = (direction: "left" | "right") => {
    const el = tabScrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth - 80;
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

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
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Teacher Dashboard"
        subtitle="A focused workspace for your class, schedule, and day-to-day teaching flow."
      />

      <Card className="rounded-2xl border border-border/60 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/60 px-3 py-4 sm:gap-4 sm:px-5 sm:py-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="text-xs font-medium text-muted-foreground sm:text-sm">
              {getGreeting()}, {teacherName}
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Your teaching workspace for today
            </h2>
            <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              Track your class schedule, manage follow-ups, and keep attendance and student actions
              in one calm dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
            <Avatar className="size-8 border border-background shadow-sm sm:size-10">
              <AvatarFallback className="bg-sky-500/10 text-sky-700 font-medium text-xs sm:text-sm">
                {user?.name?.charAt(0) ?? "T"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs font-semibold text-foreground sm:text-sm">{teacherName}</div>
              <div className="text-[10px] text-muted-foreground sm:text-xs">{user?.email}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-3 py-3 sm:gap-3 sm:px-5 sm:py-5 lg:grid-cols-5">
          {heroStats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-border/60 bg-background p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-7 place-items-center rounded-xl bg-sky-500/10 sm:size-9">
                    <Icon className="size-3.5 text-sky-700 sm:size-4" />
                  </div>
                  <ChevronRight className="size-3.5 text-muted-foreground sm:size-4" />
                </div>
                <div className="mt-2.5 text-lg font-semibold tracking-tight sm:mt-4 sm:text-2xl">
                  {item.value}
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground sm:mt-1 sm:text-xs">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        <Card className="rounded-2xl border border-border/60 p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="grid size-8 place-items-center rounded-xl bg-emerald-500/10 sm:size-10">
              <ClipboardCheck className="size-3.5 text-emerald-700 sm:size-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground sm:text-xs">Class Attendance</div>
              <div className="text-base font-semibold sm:text-lg">{data.myClassAttendance}%</div>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-4 sm:text-xs">
            Your class is performing above the target band this week.
          </div>
        </Card>
        <Card className="rounded-2xl border border-border/60 p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="grid size-8 place-items-center rounded-xl bg-amber-500/10 sm:size-10">
              <FileCheck className="size-3.5 text-amber-700 sm:size-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground sm:text-xs">
                Pending Verifications
              </div>
              <div className="text-base font-semibold sm:text-lg">
                {data.pendingDocVerifications}
              </div>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-4 sm:text-xs">
            Documents that still need attention from your class workflow.
          </div>
        </Card>
        <Card className="col-span-2 rounded-2xl border border-border/60 p-3 shadow-sm sm:p-4 lg:col-span-1">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="grid size-8 place-items-center rounded-xl bg-sky-500/10 sm:size-10">
              <Zap className="size-3.5 text-sky-700 sm:size-4" />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground sm:text-xs">Proxy Classes</div>
              <div className="text-base font-semibold sm:text-lg">{data.proxyClasses}</div>
            </div>
          </div>
          <div className="mt-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-4 sm:text-xs">
            Classes requiring coverage or quick substitution.
          </div>
        </Card>
      </div>

      <div className="sticky top-14 z-10 rounded-2xl border border-border/60 bg-background/80 shadow-sm backdrop-blur-xl sm:top-16">
        <div className="relative flex items-center">
          {/* Left scroll indicator */}
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs("left")}
              className="absolute left-0 z-20 flex h-full w-8 items-center justify-center bg-gradient-to-r from-background via-background/90 to-transparent sm:w-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
            </button>
          )}

          {/* Tab scroll container */}
          <div
            ref={tabScrollRef}
            className="tabs-mobile-scroll flex gap-1 px-1.5 py-1.5 sm:px-2 sm:py-2"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  data-active-tab={active || undefined}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-[11px] font-medium transition-all sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                    active
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5 shrink-0 sm:size-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right scroll indicator */}
          {canScrollRight && (
            <button
              onClick={() => scrollTabs("right")}
              className="absolute right-0 z-20 flex h-full w-8 items-center justify-center bg-gradient-to-l from-background via-background/90 to-transparent sm:w-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[200px] sm:min-h-[300px]">
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
