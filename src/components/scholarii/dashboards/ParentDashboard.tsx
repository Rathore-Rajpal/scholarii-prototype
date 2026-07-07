import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
  TrendingUp,
  Wallet,
  CalendarDays,
  BarChart3,
  Brain,
  Megaphone,
  LayoutGrid,
  GraduationCap,
  Target,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  FileText,
  MessageCircle,
  UserCircle,
  Award,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Trophy,
  Download,
  PartyPopper,
  Sun,
  Timer,
  DollarSign,
  Send,
  FolderOpen,
  Eye,
} from "lucide-react";
import { useAuth } from "@/lib/scholarii/auth";
import { KpiCard } from "@/components/scholarii/KpiCard";

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

const attendancePieConfig = {
  Present: { label: "Present", color: "hsl(142, 76%, 36%)" },
  Absent: { label: "Absent", color: "hsl(0, 84%, 60%)" },
  Leave: { label: "Leave", color: "hsl(38, 92%, 50%)" },
} satisfies ChartConfig;

const TABS = [
  { id: "progress", label: "Child Progress", icon: TrendingUp },
  { id: "events", label: "Upcoming Events", icon: CalendarDays },
  { id: "fees", label: "Fees Overview", icon: Wallet },
  { id: "ai", label: "AI Insights", icon: Brain },
  { id: "notices", label: "Notices", icon: Megaphone },
  { id: "actions", label: "Quick Actions", icon: LayoutGrid },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface ChildData {
  name: string;
  class: string;
  section: string;
  roll: string;
  attendance: number;
  overallScore: number;
  previousScore: number;
  feeStatus: string;
  nextDueDays: number;
  upcomingEvents: number;
  nextEventDays: number;
  monthlyPerformance: { month: string; score: number }[];
  subjectScores: { subject: string; score: number }[];
  attendanceBreakdown: { name: string; value: number; color: string }[];
  strengths: { subject: string; score: number }[];
  focusAreas: { subject: string; reason: string }[];
  upcomingExams: { id: string; name: string; subject: string; date: string; daysLeft: number }[];
  events: { id: string; title: string; date: string; type: string; icon: typeof Megaphone; color: string }[];
  feeSummary: { total: number; paid: number; pending: number; nextDue: string; nextDueDate: string };
  paymentHistory: { id: string; description: string; amount: number; date: string; status: string }[];
  aiInsights: { id: string; type: "improvement" | "warning" | "positive" | "suggestion"; text: string }[];
  notices: { id: string; title: string; date: string; priority: "normal" | "important" | "urgent"; unread: boolean }[];
}

function getChildData(): ChildData {
  return {
    name: "Aarav Sharma",
    class: "8",
    section: "A",
    roll: "8A07",
    attendance: 92,
    overallScore: 84,
    previousScore: 79,
    feeStatus: "Paid",
    nextDueDays: 25,
    upcomingEvents: 3,
    nextEventDays: 2,
    monthlyPerformance: [
      { month: "Jan", score: 66 },
      { month: "Feb", score: 70 },
      { month: "Mar", score: 73 },
      { month: "Apr", score: 76 },
      { month: "May", score: 79 },
      { month: "Jun", score: 84 },
    ],
    subjectScores: [
      { subject: "Math", score: 78 },
      { subject: "English", score: 88 },
      { subject: "Science", score: 92 },
      { subject: "Social", score: 80 },
      { subject: "Hindi", score: 82 },
      { subject: "CS", score: 90 },
    ],
    attendanceBreakdown: [
      { name: "Present", value: 46, color: "hsl(142, 76%, 36%)" },
      { name: "Absent", value: 3, color: "hsl(0, 84%, 60%)" },
      { name: "Leave", value: 1, color: "hsl(38, 92%, 50%)" },
    ],
    strengths: [
      { subject: "Science", score: 92 },
      { subject: "Computer Science", score: 90 },
      { subject: "English", score: 88 },
    ],
    focusAreas: [
      { subject: "Mathematics", reason: "Needs Algebra practice" },
      { subject: "Social Studies", reason: "Needs revision consistency" },
    ],
    upcomingExams: [
      { id: "ex1", name: "Unit Test 2", subject: "Mathematics", date: "2026-06-20", daysLeft: 5 },
      { id: "ex2", name: "Unit Test 2", subject: "Science", date: "2026-06-22", daysLeft: 7 },
      { id: "ex3", name: "Unit Test 2", subject: "English", date: "2026-06-24", daysLeft: 9 },
    ],
    events: [
      { id: "ev1", title: "Science Fair", date: "Jun 20", type: "competition", icon: Trophy, color: "text-orange-500" },
      { id: "ev2", title: "Parent-Teacher Meeting", date: "Jun 25", type: "ptm", icon: MessageCircle, color: "text-blue-500" },
      { id: "ev3", title: "Mathematics Unit Test", date: "Jun 28", type: "exam", icon: GraduationCap, color: "text-violet-500" },
      { id: "ev4", title: "Summer Break Begins", date: "Jul 15", type: "holiday", icon: Sun, color: "text-amber-500" },
    ],
    feeSummary: {
      total: 120000,
      paid: 90000,
      pending: 30000,
      nextDue: "Term 3",
      nextDueDate: "Sep 10, 2026",
    },
    paymentHistory: [
      { id: "ph1", description: "Term 1 Fees", amount: 40000, date: "Apr 5, 2026", status: "paid" },
      { id: "ph2", description: "Term 2 Fees", amount: 40000, date: "Jun 5, 2026", status: "paid" },
      { id: "ph3", description: "Term 2 Lab Fees", amount: 10000, date: "Jun 10, 2026", status: "paid" },
    ],
    aiInsights: [
      { id: "ai1", type: "improvement", text: "Aarav's Mathematics performance improved by 8% over the last 3 months." },
      { id: "ai2", type: "positive", text: "Attendance consistency is positively affecting overall performance." },
      { id: "ai3", type: "positive", text: "Science is currently the strongest subject at 92%." },
      { id: "ai4", type: "suggestion", text: "Focus on Algebra before the next Unit Test on June 20." },
      { id: "ai5", type: "improvement", text: "No action required regarding attendance — consistently above 90%." },
    ],
    notices: [
      { id: "n1", title: "Sports Day Registration Open", date: "Jun 12, 2026", priority: "normal", unread: true },
      { id: "n2", title: "Holiday Notice — June 15", date: "Jun 10, 2026", priority: "important", unread: true },
      { id: "n3", title: "Science Exhibition — Call for Projects", date: "Jun 8, 2026", priority: "normal", unread: false },
      { id: "n4", title: "Parent-Teacher Meeting — June 25", date: "Jun 7, 2026", priority: "important", unread: false },
      { id: "n5", title: "Fee Deadline Extended to June 30", date: "Jun 5, 2026", priority: "urgent", unread: false },
    ],
  };
}

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
    <Card className="relative overflow-hidden p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneStyles[tone]} opacity-50`} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <div className="flex items-center gap-1.5">
            {trend === "up" && <TrendingUp className="size-3.5 text-emerald-500" />}
            {trend === "down" && <AlertTriangle className="size-3.5 text-red-500" />}
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
        <div className={`rounded-xl p-2.5 ${iconBg[tone]}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
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

function ChildProgressTab({ data }: { data: ChildData }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Academic Performance" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-1">Performance Trend</h3>
          <p className="text-sm text-muted-foreground mb-4">Average marks over the last 6 months</p>
          <ChartContainer config={performanceChartConfig} className="h-[240px] w-full">
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

        <Card className="p-5">
          <h3 className="font-semibold mb-1">Subject Performance</h3>
          <p className="text-sm text-muted-foreground mb-4">Marks percentage by subject</p>
          <ChartContainer config={subjectChartConfig} className="h-[240px] w-full">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Attendance Summary</h3>
          <ChartContainer config={attendancePieConfig} className="h-[200px] w-full">
            <PieChart>
              <Pie
                data={data.attendanceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.attendanceBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
          <div className="flex justify-center gap-4 mt-2">
            {data.attendanceBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-2 rounded-full" style={{ background: entry.color }} />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Strength Areas</h3>
          <div className="space-y-3">
            {data.strengths.map((s) => (
              <div key={s.subject} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-500/10 p-1.5">
                    <Trophy className="size-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium">{s.subject}</span>
                </div>
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  {s.score}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Focus Areas</h3>
          <div className="space-y-3">
            {data.focusAreas.map((f) => (
              <div key={f.subject} className="flex items-start gap-3">
                <div className="rounded-lg bg-amber-500/10 p-1.5 mt-0.5">
                  <Target className="size-3.5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.subject}</p>
                  <p className="text-xs text-muted-foreground">{f.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function UpcomingEventsTab({ data }: { data: ChildData }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Upcoming Events" />
      <div className="space-y-3">
        {data.events.map((event) => {
          const Icon = event.icon;
          return (
            <Card key={event.id} className="p-4 transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className={`rounded-xl bg-muted p-2.5`}>
                  <Icon className={`size-5 ${event.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">{event.type}</Badge>
              </div>
            </Card>
          );
        })}
      </div>

      <SectionHeader title="Upcoming Exams" />
      <div className="space-y-3">
        {data.upcomingExams.map((exam) => (
          <Card key={exam.id} className="p-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-violet-500/10 p-2.5">
                <GraduationCap className="size-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{exam.name}</p>
                <p className="text-sm text-muted-foreground">{exam.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{exam.date}</p>
                <Badge variant={exam.daysLeft <= 3 ? "destructive" : "secondary"} className="text-xs mt-1">
                  {exam.daysLeft} days left
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function FeesOverviewTab({ data }: { data: ChildData }) {
  const fee = data.feeSummary;
  const paidPercent = Math.round((fee.paid / fee.total) * 100);

  return (
    <div className="space-y-6">
      <SectionHeader title="Fee Overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Total Annual Fees</p>
          <p className="text-2xl font-bold mt-1">₹{fee.total.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Paid Amount</p>
          <p className="text-2xl font-bold mt-1 text-emerald-600">₹{fee.paid.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Pending Amount</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">₹{fee.pending.toLocaleString()}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Next Due Date</p>
          <p className="text-2xl font-bold mt-1">{fee.nextDueDate}</p>
          <p className="text-xs text-muted-foreground mt-1">{fee.nextDue}</p>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Payment Progress</h3>
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
            style={{ width: `${paidPercent}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{paidPercent}% of annual fees paid</p>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Payment History</h3>
        <div className="space-y-3">
          {data.paymentHistory.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{p.description}</p>
                  <p className="text-xs text-muted-foreground">{p.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">₹{p.amount.toLocaleString()}</p>
                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Paid
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AIInsightsTab({ data }: { data: ChildData }) {
  const iconMap = {
    improvement: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" },
    positive: { icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-500/10" },
    suggestion: { icon: Lightbulb, color: "text-blue-600", bg: "bg-blue-500/10" },
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Insights" />
      <Card className="relative overflow-hidden p-5 border-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-violet-600/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 p-2">
              <Sparkles className="size-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AI Study Insights</h3>
              <p className="text-xs text-muted-foreground">Personalized recommendations for {data.name}</p>
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
    </div>
  );
}

function NoticesTab({ data }: { data: ChildData }) {
  const priorityStyles = {
    normal: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    important: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    urgent: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="School Notices" />
      <div className="space-y-3">
        {data.notices.map((notice) => (
          <Card
            key={notice.id}
            className={`p-4 transition-all hover:shadow-md ${
              notice.unread ? "border-violet-500/20 bg-violet-500/5" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`rounded-xl p-2 ${notice.unread ? "bg-violet-500/10" : "bg-muted"}`}>
                <Megaphone className={`size-4 ${notice.unread ? "text-violet-600" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium ${notice.unread ? "" : "text-muted-foreground"}`}>
                    {notice.title}
                  </p>
                  {notice.unread && <div className="size-2 rounded-full bg-violet-500" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{notice.date}</p>
              </div>
              <Badge
                variant="outline"
                className={`text-xs border ${priorityStyles[notice.priority]}`}
              >
                {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function QuickActionsTab() {
  const navigate = useNavigate();
  const actions = [
    { label: "View Child Profile", icon: UserCircle, action: () => navigate({ to: "/app/children" }) },
    { label: "Attendance Report", icon: ClipboardCheck, action: () => navigate({ to: "/app/attendance" as never }) },
    { label: "Performance Report", icon: BarChart3, action: () => navigate({ to: "/app/performance" as never }) },
    { label: "Fee Details", icon: Wallet, action: () => navigate({ to: "/app/fees" as never }) },
    { label: "Documents", icon: FolderOpen, action: () => navigate({ to: "/app/documents" as never }) },
    { label: "Open AI Assistant", icon: Sparkles, action: () => navigate({ to: "/app/ai" as never }) },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Quick Actions" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={a.action}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border/60 bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="rounded-xl bg-violet-500/10 p-3">
                <Icon className="size-5 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-center">{a.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ParentDashboard() {
  const { user } = useAuth();
  const data = useMemo(() => getChildData(), []);
  const [activeTab, setActiveTab] = useState<TabId>("progress");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const parentName = user?.name?.split(" ")[0] ?? "Mr. Rathore";
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {getGreeting()}, {parentName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's how {data.name.split(" ")[0]} is doing today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{dateStr}</p>
            <p className="text-xs text-muted-foreground">
              {data.name} · Class {data.class}-{data.section} · Roll {data.roll}
            </p>
          </div>
          <Avatar className="size-10 border-2 border-background shadow-md">
            <AvatarFallback className="bg-emerald-500/10 text-emerald-600 font-semibold text-sm">
              {data.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr content-start">
        <KpiCard
          icon={ClipboardCheck}
          label="Attendance"
          value={`${data.attendance}%`}
          trend={data.attendance >= 90 ? "up" : "down"}
          trendLabel="+3% this month"
          tone="success"
        />
        <KpiCard
          icon={Target}
          label="Academic Score"
          value={`${data.overallScore}%`}
          trend="up"
          trendLabel={`+${data.overallScore - data.previousScore}% improvement`}
          tone="info"
        />
        <KpiCard
          icon={Wallet}
          label="Fee Status"
          value={data.feeStatus}
          trend="stable"
          trendLabel={`Next installment in ${data.nextDueDays} days`}
          tone="default"
        />
        <KpiCard
          icon={CalendarDays}
          label="Upcoming Events"
          value={`${data.upcomingEvents} Upcoming`}
          trend="stable"
          trendLabel={`Next in ${data.nextEventDays} days`}
          tone="warning"
        />
      </div>

      {/* Tab Bar */}
      <div className="sticky top-0 z-30 -mx-1 px-1 pt-1 pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-2xl" />
          <div className="relative flex gap-1 overflow-x-auto scrollbar-none rounded-2xl border border-border/60 bg-card p-1.5 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
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

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "progress" && <ChildProgressTab data={data} />}
        {activeTab === "events" && <UpcomingEventsTab data={data} />}
        {activeTab === "fees" && <FeesOverviewTab data={data} />}
        {activeTab === "ai" && <AIInsightsTab data={data} />}
        {activeTab === "notices" && <NoticesTab data={data} />}
        {activeTab === "actions" && <QuickActionsTab />}
      </div>
    </div>
  );
}
