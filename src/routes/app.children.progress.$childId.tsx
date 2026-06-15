import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
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
  ArrowLeft,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Target,
  Trophy,
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Brain,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/scholarii/auth";

export const Route = createFileRoute("/app/children/progress/$childId")({
  component: StudentProgressPage,
});

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

interface ChildProgressData {
  name: string;
  class: string;
  section: string;
  roll: string;
  age: number;
  bloodGroup: string;
  emergencyContact: string;
  photo: string;
  monthlyPerformance: { month: string; score: number }[];
  subjectScores: { subject: string; score: number }[];
  attendanceBreakdown: { name: string; value: number; color: string }[];
  strengths: { subject: string; score: number; teacher: string }[];
  focusAreas: { subject: string; reason: string; teacher: string }[];
  recentGrades: { subject: string; grade: string; score: number; date: string }[];
  upcomingExams: { name: string; subject: string; date: string; daysLeft: number }[];
  aiInsights: { type: "improvement" | "warning" | "positive" | "suggestion"; text: string }[];
}

function getChildProgressData(childId: string): ChildProgressData {
  const children: Record<string, ChildProgressData> = {
    child1: {
      name: "Aarav Sharma",
      class: "8",
      section: "A",
      roll: "8A07",
      age: 13,
      bloodGroup: "B+",
      emergencyContact: "+91 98765 43211",
      photo: "",
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
        { subject: "Science", score: 92, teacher: "Ms. Kavita" },
        { subject: "Computer Science", score: 90, teacher: "Mr. Rohan" },
        { subject: "English", score: 88, teacher: "Mrs. Priya" },
      ],
      focusAreas: [
        { subject: "Mathematics", reason: "Needs Algebra practice", teacher: "Mr. Suresh" },
        { subject: "Social Studies", reason: "Needs revision consistency", teacher: "Mrs. Meera" },
      ],
      recentGrades: [
        { subject: "Science", grade: "A+", score: 95, date: "Jun 10, 2026" },
        { subject: "English", grade: "A", score: 88, date: "Jun 8, 2026" },
        { subject: "Mathematics", grade: "B+", score: 78, date: "Jun 5, 2026" },
        { subject: "Hindi", grade: "A-", score: 82, date: "Jun 3, 2026" },
        { subject: "Social Studies", grade: "B+", score: 80, date: "Jun 1, 2026" },
      ],
      upcomingExams: [
        { name: "Unit Test 2", subject: "Mathematics", date: "2026-06-20", daysLeft: 5 },
        { name: "Unit Test 2", subject: "Science", date: "2026-06-22", daysLeft: 7 },
        { name: "Unit Test 2", subject: "English", date: "2026-06-24", daysLeft: 9 },
      ],
      aiInsights: [
        { type: "improvement", text: "Consistent improvement across all subjects over the past 3 months." },
        { type: "positive", text: "Science is the strongest subject with 92% — consider Science Olympiad participation." },
        { type: "suggestion", text: "Focus on Algebra fundamentals before the upcoming Unit Test." },
        { type: "warning", text: "Math score dropped from 82% to 78% — needs attention." },
      ],
    },
    child2: {
      name: "Diya Sharma",
      class: "5",
      section: "B",
      roll: "5B12",
      age: 10,
      bloodGroup: "O+",
      emergencyContact: "+91 98765 43212",
      photo: "",
      monthlyPerformance: [
        { month: "Jan", score: 72 },
        { month: "Feb", score: 75 },
        { month: "Mar", score: 78 },
        { month: "Apr", score: 80 },
        { month: "May", score: 83 },
        { month: "Jun", score: 85 },
      ],
      subjectScores: [
        { subject: "Math", score: 82 },
        { subject: "English", score: 85 },
        { subject: "Science", score: 88 },
        { subject: "Social", score: 80 },
        { subject: "Hindi", score: 86 },
        { subject: "Art", score: 92 },
      ],
      attendanceBreakdown: [
        { name: "Present", value: 48, color: "hsl(142, 76%, 36%)" },
        { name: "Absent", value: 1, color: "hsl(0, 84%, 60%)" },
        { name: "Leave", value: 1, color: "hsl(38, 92%, 50%)" },
      ],
      strengths: [
        { subject: "Art", score: 92, teacher: "Ms. Nisha" },
        { subject: "Science", score: 88, teacher: "Ms. Kavita" },
        { subject: "English", score: 85, teacher: "Mrs. Priya" },
      ],
      focusAreas: [
        { subject: "Mathematics", reason: "Needs more practice with word problems", teacher: "Mr. Suresh" },
        { subject: "Social Studies", reason: "Could improve map reading skills", teacher: "Mrs. Meera" },
      ],
      recentGrades: [
        { subject: "Art", grade: "A+", score: 92, date: "Jun 10, 2026" },
        { subject: "Science", grade: "A", score: 88, date: "Jun 8, 2026" },
        { subject: "English", grade: "A", score: 85, date: "Jun 5, 2026" },
        { subject: "Hindi", grade: "A", score: 86, date: "Jun 3, 2026" },
        { subject: "Mathematics", grade: "B+", score: 82, date: "Jun 1, 2026" },
      ],
      upcomingExams: [
        { name: "Unit Test 2", subject: "Mathematics", date: "2026-06-20", daysLeft: 5 },
        { name: "Unit Test 2", subject: "Science", date: "2026-06-22", daysLeft: 7 },
        { name: "Unit Test 2", subject: "English", date: "2026-06-24", daysLeft: 9 },
      ],
      aiInsights: [
        { type: "improvement", text: "Steady improvement in all subjects — great progress!" },
        { type: "positive", text: "Art is exceptionally strong — consider enrolling in Art Club." },
        { type: "suggestion", text: "Practice word problems in Mathematics daily for 15 minutes." },
        { type: "positive", text: "Attendance is excellent at 96% — keep it up!" },
      ],
    },
  };

  return children[childId] || children.child1;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
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

function StudentProgressPage() {
  const { childId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const data = useMemo(() => getChildProgressData(childId), [childId]);

  const overallScore = Math.round(
    data.subjectScores.reduce((acc, s) => acc + s.score, 0) / data.subjectScores.length
  );
  const attendance = Math.round(
    (data.attendanceBreakdown[0].value /
      data.attendanceBreakdown.reduce((acc, a) => acc + a.value, 0)) *
      100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/app/children" })}
          className="shrink-0"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar className="size-14 border-2 border-background shadow-md">
            <AvatarFallback className="bg-violet-500/10 text-violet-600 font-bold text-lg">
              {data.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">{data.name}</h1>
            <p className="text-muted-foreground">
              Class {data.class}-{data.section} · Roll {data.roll}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/app/attendance" as never })}
        >
          View Full Attendance
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={TrendingUp} label="Overall Score" value={`${overallScore}%`} tone="info" />
        <MetricCard icon={CheckCircle2} label="Attendance" value={`${attendance}%`} tone="success" />
        <MetricCard
          icon={Trophy}
          label="Strongest Subject"
          value={data.strengths[0]?.subject || "N/A"}
          tone="success"
        />
        <MetricCard
          icon={Target}
          label="Focus Area"
          value={data.focusAreas[0]?.subject || "N/A"}
          tone="warning"
        />
      </div>

      {/* Performance Charts */}
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

      {/* Attendance & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Attendance Breakdown</h3>
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
                  <div>
                    <p className="text-sm font-medium">{s.subject}</p>
                    <p className="text-xs text-muted-foreground">{s.teacher}</p>
                  </div>
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
                  <p className="text-xs text-muted-foreground mt-0.5">Teacher: {f.teacher}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card className="p-5">
        <SectionHeader title="Recent Grades" />
        <div className="space-y-3">
          {data.recentGrades.map((grade, i) => (
            <div
              key={`${grade.subject}-${i}`}
              className="flex items-center justify-between p-3 rounded-xl border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <BookOpen className="size-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{grade.subject}</p>
                  <p className="text-xs text-muted-foreground">{grade.date}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="text-sm font-bold">
                  {grade.grade}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{grade.score}%</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming Exams */}
      <Card className="p-5">
        <SectionHeader title="Upcoming Exams" />
        <div className="space-y-3">
          {data.upcomingExams.map((exam, i) => (
            <div
              key={`${exam.subject}-${i}`}
              className="flex items-center justify-between p-3 rounded-xl border border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <GraduationCap className="size-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">{exam.subject}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{exam.date}</p>
                <Badge variant={exam.daysLeft <= 3 ? "destructive" : "secondary"} className="text-xs mt-1">
                  {exam.daysLeft} days left
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insights */}
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
            {data.aiInsights.map((insight, i) => {
              const iconMap = {
                improvement: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" },
                positive: { icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-500/10" },
                suggestion: { icon: Brain, color: "text-blue-600", bg: "bg-blue-500/10" },
              };
              const { icon: InsightIcon, color, bg } = iconMap[insight.type];
              return (
                <div
                  key={i}
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
