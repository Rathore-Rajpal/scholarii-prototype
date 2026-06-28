import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  Wallet,
  Clock,
  BookOpen,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  FileText,
  MessageCircle,
  UserCircle,
  BookMarked,
  Library,
  Activity,
  Zap,
  ChevronRight,
  Bell,
  Target,
  BarChart3,
  ListTodo,
  Brain,
  CalendarDays,
  Megaphone,
  LayoutGrid,
} from "lucide-react";
import { getStudentDashboardData, type StudentDashboardData } from "@/lib/scholarii/student-mock-data";
import { useAuth } from "@/lib/scholarii/auth";

const performanceChartConfig = {
  score: {
    label: "Score",
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig;

const subjectChartConfig = {
  score: {
    label: "Score",
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig;

const attendanceLineConfig = {
  present: {
    label: "Present",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig;

const attendancePieConfig = {
  Present: { label: "Present", color: "hsl(142, 76%, 36%)" },
  Absent: { label: "Absent", color: "hsl(0, 84%, 60%)" },
  Leave: { label: "Leave", color: "hsl(38, 92%, 50%)" },
} satisfies ChartConfig;

function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  trendLabel: string;
  tone: "success" | "warning" | "info" | "default";
}) {
  const toneStyles = {
    success: "from-emerald-500/10 to-emerald-600/5 text-emerald-600",
    warning: "from-amber-500/10 to-amber-600/5 text-amber-600",
    info: "from-violet-500/10 to-violet-600/5 text-violet-600",
    default: "from-slate-500/10 to-slate-600/5 text-slate-600",
  };

  const iconBg = {
    success: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
    info: "bg-violet-500/10",
    default: "bg-slate-500/10",
  };

  return (
    <Card className="relative overflow-hidden p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between min-h-[130px] md:min-h-[120px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneStyles[tone]} opacity-50`} />
      <div className="relative flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground leading-tight max-w-[70%]">{label}</p>
        <div className={`rounded-xl p-2 ${iconBg[tone]} flex-shrink-0 ml-2`}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="relative mt-2">
        <p className="text-3xl font-bold text-foreground leading-tight break-words">{value}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {trend === "up" && <TrendingUp className="size-3 text-emerald-500 shrink-0" />}
          {trend === "down" && <TrendingDown className="size-3 text-red-500 shrink-0" />}
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-emerald-600"
                : trend === "down"
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {trendLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-2xl bg-muted p-4 mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

function AcademicHealthOverview({ data }: { data: StudentDashboardData }) {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          icon={ClipboardCheck}
          label="Attendance"
          value={`${data.attendance}%`}
          trend={data.attendanceTrend >= 0 ? "up" : "down"}
          trendLabel={`${data.attendanceTrend >= 0 ? "+" : ""}${data.attendanceTrend}% this month`}
          tone="success"
        />
        <MetricCard
          icon={Target}
          label="Academic Score"
          value={`${data.overallScore}%`}
          trend="up"
          trendLabel={`+${data.overallScore - data.previousScore}% improvement`}
          tone="info"
        />
        <MetricCard
          icon={ClipboardList}
          label="Assignments"
          value={`${data.pendingCount} Pending`}
          trend="stable"
          trendLabel={`${data.submittedCount} submitted recently`}
          tone="warning"
        />
        <MetricCard
          icon={GraduationCap}
          label="Upcoming Exams"
          value={`${data.upcomingExamCount} Upcoming`}
          trend="stable"
          trendLabel={`Next in ${data.nextExamDays} Days`}
          tone="default"
        />
      </div>
    </section>
  );
}

function PerformanceAnalytics({ data }: { data: StudentDashboardData }) {
  return (
    <section>
      <SectionHeader title="Performance Analytics" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 w-full">
          <h3 className="font-semibold mb-1">Academic Performance Trend</h3>
          <p className="text-sm text-muted-foreground mb-4">Average marks over the last 6 months</p>
          <ChartContainer config={performanceChartConfig} className="h-[200px] sm:h-[240px] w-full">
            <LineChart data={data.monthlyPerformance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--color-score)"
                strokeWidth={2.5}
                dot={{ fill: "var(--color-score)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        </Card>

        <Card className="p-5 w-full">
          <h3 className="font-semibold mb-1">Subject Performance</h3>
          <p className="text-sm text-muted-foreground mb-4">Marks percentage by subject</p>
          <ChartContainer config={subjectChartConfig} className="h-[200px] sm:h-[240px] w-full">
            <BarChart data={data.subjectScores} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="var(--color-score)" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>
    </section>
  );
}

function TodaysSchedule({ data }: { data: StudentDashboardData }) {
  const navigate = useNavigate();

  return (
    <section>
      <SectionHeader
        title="Today's Classes"
        action={
          <Button size="sm" variant="ghost" onClick={() => navigate({ to: "/app/timetable" as never })} className="gap-1.5">
            View Timetable <ChevronRight className="size-3.5" />
          </Button>
        }
      />
      <Card className="p-5">
        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-1">
            {data.todaySchedule.map((cls, i) => (
              <div
                key={i}
                className={`relative flex items-center gap-4 p-3 rounded-xl transition-colors ${
                  cls.status === "current"
                    ? "bg-violet-500/5 border border-violet-500/20"
                    : cls.status === "completed"
                      ? "opacity-60"
                      : "hover:bg-muted/50"
                }`}
              >
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`size-3 rounded-full border-2 ${
                      cls.status === "current"
                        ? "border-violet-500 bg-violet-500"
                        : cls.status === "completed"
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-muted-foreground/30 bg-background"
                    }`}
                  />
                </div>
                <div className="w-16 text-xs text-muted-foreground font-medium">{cls.time}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${cls.status === "current" ? "text-violet-600" : ""}`}>
                      {cls.subject}
                    </span>
                    {cls.status === "current" && (
                      <Badge className="bg-violet-500/10 text-violet-600 border-0 text-xs">Now</Badge>
                    )}
                    {cls.status === "completed" && <CheckCircle2 className="size-3.5 text-emerald-500" />}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cls.teacher} · {cls.room}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{cls.endTime}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}

function AssignmentsAndTasks({ data }: { data: StudentDashboardData }) {
  const navigate = useNavigate();

  const priorityStyles = {
    high: "bg-red-500/10 text-red-600 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  const statusStyles = {
    submitted: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    reviewed: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    graded: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  return (
    <section>
      <SectionHeader
        title="Assignments & Tasks"
        action={
          <Button size="sm" variant="ghost" onClick={() => navigate({ to: "/app/assignments" })} className="gap-1.5">
            View All <ChevronRight className="size-3.5" />
          </Button>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-lg bg-amber-500/10 p-1.5">
              <Clock className="size-4 text-amber-600" />
            </div>
            <h3 className="font-semibold">Pending Assignments</h3>
          </div>
          <div className="space-y-3">
            {data.pendingAssignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.subject}</p>
                </div>
                <Badge variant="outline" className={`text-xs border ${priorityStyles[a.priority]}`}>
                  {a.dueDate}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-lg bg-emerald-500/10 p-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <h3 className="font-semibold">Recent Submissions</h3>
          </div>
          <div className="space-y-3">
            {data.recentSubmissions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.subject} · {s.submittedDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {s.grade && (
                    <div className="size-8 rounded-lg bg-violet-500/10 text-violet-600 font-bold text-xs grid place-items-center">
                      {s.grade}
                    </div>
                  )}
                  <Badge variant="outline" className={`text-xs border ${statusStyles[s.status]}`}>
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function AIInsights({ data }: { data: StudentDashboardData }) {
  const iconMap = {
    improvement: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" },
    positive: { icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-500/10" },
    suggestion: { icon: Lightbulb, color: "text-blue-600", bg: "bg-blue-500/10" },
  };

  return (
    <section>
      <SectionHeader title="AI Study Insights" />
      <Card className="relative overflow-hidden p-5 border-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-violet-600/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 p-2">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AI Study Insights</h3>
              <p className="text-xs text-muted-foreground">Personalized recommendations based on your performance</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.aiInsights.map((insight) => {
              const { icon: InsightIcon, color, bg } = iconMap[insight.type];
              return (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-background/80 border border-border/50"
                >
                  <div className={`rounded-lg p-1.5 ${bg} shrink-0`}>
                    <InsightIcon className={`size-3.5 ${color}`} />
                  </div>
                  <p className="text-sm leading-relaxed">{insight.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </section>
  );
}

function AttendanceAnalytics({ data }: { data: StudentDashboardData }) {
  return (
    <section>
      <SectionHeader title="Attendance Analytics" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-1">Weekly Attendance Trend</h3>
          <p className="text-sm text-muted-foreground mb-4">Classes attended per week</p>
          <ChartContainer config={attendanceLineConfig} className="h-[220px] w-full">
            <LineChart data={data.weeklyAttendance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis domain={[0, 6]} tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="present"
                stroke="var(--color-present)"
                strokeWidth={2.5}
                dot={{ fill: "var(--color-present)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-1">Attendance Breakdown</h3>
          <p className="text-sm text-muted-foreground mb-4">Last {data.totalDays} working days</p>
          <div className="flex items-center gap-6">
            <ChartContainer config={attendancePieConfig} className="h-[180px] w-[180px]">
              <PieChart>
                <Pie
                  data={data.attendanceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.attendanceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex-1 space-y-3">
              {data.attendanceBreakdown.map((item) => {
                const pct = Math.round((item.value / data.totalDays) * 100);
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.value} days</span>
                      <span className="text-sm font-semibold w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function UpcomingExams({ data }: { data: StudentDashboardData }) {
  const getDaysLabel = (days: number) => {
    if (days <= 3) return "destructive";
    if (days <= 7) return "secondary";
    return "outline";
  };

  return (
    <section>
      <SectionHeader
        title="Upcoming Exams"
        action={
          <Button size="sm" variant="ghost" onClick={() => {}} className="gap-1.5">
            View All <ChevronRight className="size-3.5" />
          </Button>
        }
      />
      <Card className="p-5">
        <div className="space-y-3">
          {data.upcomingExams.map((exam) => (
            <div
              key={exam.id}
              className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="rounded-xl bg-violet-500/10 p-2.5">
                <GraduationCap className="size-4 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{exam.name}</p>
                <p className="text-xs text-muted-foreground">{exam.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{new Date(exam.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                <Badge variant={getDaysLabel(exam.daysLeft) as "destructive" | "secondary" | "outline"} className="text-xs mt-1">
                  {exam.daysLeft} Days
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function Announcements({ data }: { data: StudentDashboardData }) {
  const priorityStyles = {
    normal: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    important: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    urgent: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <section>
      <SectionHeader
        title="Announcements & Notices"
        action={
          <Button size="sm" variant="ghost" className="gap-1.5">
            View All <ChevronRight className="size-3.5" />
          </Button>
        }
      />
      <Card className="p-5">
        <div className="space-y-3">
          {data.announcements.map((a) => (
            <div
              key={a.id}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                a.unread ? "border-violet-500/20 bg-violet-500/5" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className={`rounded-xl p-2 ${a.unread ? "bg-violet-500/10" : "bg-muted"}`}>
                <Bell className={`size-4 ${a.unread ? "text-violet-600" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-sm ${a.unread ? "" : "text-muted-foreground"}`}>{a.title}</p>
                  {a.unread && <div className="size-2 rounded-full bg-violet-500" />}
                </div>
                <p className="text-xs text-muted-foreground">{a.date}</p>
              </div>
              <Badge variant="outline" className={`text-xs border ${priorityStyles[a.priority]}`}>
                {a.priority.charAt(0).toUpperCase() + a.priority.slice(1)}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: "View Timetable", icon: Calendar, path: "/app/timetable", color: "bg-blue-500/10 text-blue-600" },
    { label: "Assignments", icon: ClipboardList, path: "/app/assignments", color: "bg-amber-500/10 text-amber-600" },
    { label: "Check Results", icon: GraduationCap, path: "/app/exams", color: "bg-violet-500/10 text-violet-600" },
    { label: "Attendance", icon: ClipboardCheck, path: "/app/attendance", color: "bg-emerald-500/10 text-emerald-600" },
    { label: "AI Assistant", icon: Sparkles, path: "/app/ai", color: "bg-pink-500/10 text-pink-600" },
    { label: "Documents", icon: FileText, path: "/app/documents", color: "bg-slate-500/10 text-slate-600" },
  ];

  return (
    <section>
      <SectionHeader title="Quick Actions" />
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map((a) => (
          <button
            key={a.path}
            onClick={() => navigate({ to: a.path })}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/50 hover:border-border/80 transition-all duration-200 group"
          >
            <div className={`rounded-xl p-2.5 ${a.color} transition-transform group-hover:scale-110`}>
              <a.icon className="size-5" />
            </div>
            <span className="text-xs font-medium text-center leading-tight">{a.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

const TABS = [
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "schedule", label: "Today's Classes", icon: CalendarDays },
  { id: "assignments", label: "Assignments", icon: ListTodo },
  { id: "ai", label: "AI Insights", icon: Brain },
  { id: "attendance", label: "Attendance", icon: ClipboardCheck },
  { id: "exams", label: "Exams", icon: GraduationCap },
  { id: "announcements", label: "Notices", icon: Megaphone },
  { id: "actions", label: "Quick Actions", icon: LayoutGrid },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function StudentDashboard() {
  const { user } = useAuth();
  const data = useMemo(() => getStudentDashboardData(user?.email), [user?.email]);
  const [activeTab, setActiveTab] = useState<TabId>("performance");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = data.student.name.split(" ")[0];
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground">Ready for another productive day?</p>
          <p className="text-xs text-muted-foreground mt-1">
            {dateStr} · Grade {data.student.grade} · Section {data.student.section} · Roll {data.student.roll}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">{dateStr}</p>
            <p className="text-xs text-muted-foreground">
              Grade {data.student.grade} · Section {data.student.section} · Roll {data.student.roll}
            </p>
          </div>
          <Avatar className="size-10 border-2 border-background shadow-md">
            <AvatarFallback className="bg-violet-500/10 text-violet-600 font-semibold text-sm">
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <AcademicHealthOverview data={data} />

      <div className="sticky top-0 z-30 -mx-1 px-1 pt-1 pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-2xl" />
          <div className="relative flex gap-1 overflow-x-auto scrollbar-none flex-nowrap -mx-4 px-4 md:mx-0 md:px-0 rounded-2xl border border-border/60 bg-card p-1.5 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? "bg-violet-500/10 text-violet-600 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "performance" && <PerformanceAnalytics data={data} />}
        {activeTab === "schedule" && <TodaysSchedule data={data} />}
        {activeTab === "assignments" && <AssignmentsAndTasks data={data} />}
        {activeTab === "ai" && <AIInsights data={data} />}
        {activeTab === "attendance" && <AttendanceAnalytics data={data} />}
        {activeTab === "exams" && <UpcomingExams data={data} />}
        {activeTab === "announcements" && <Announcements data={data} />}
        {activeTab === "actions" && <QuickActions />}
      </div>
    </div>
  );
}
