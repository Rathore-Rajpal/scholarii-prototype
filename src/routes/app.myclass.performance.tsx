import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { TeacherPageLayout, TabButton, KpiCard } from "@/components/scholarii/TeacherPageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  PieChart as PieChartIcon,
  Search,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  AlertTriangle,
  CheckCircle2,
  Target,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  FileCheck,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CLASS_PERFORMANCE_STUDENTS,
  SUBJECT_PERFORMANCE,
  INTERVENTION_STUDENTS,
  PERFORMANCE_AI_INSIGHTS,
  PERFORMANCE_AI_SUGGESTIONS,
  STRENGTH_AREAS,
  FOCUS_AREAS,
  type PerformanceStudent,
} from "@/lib/scholarii/performance-mock-data";
import { EXAM_ANALYTICS } from "@/lib/scholarii/myclass-exams-students";

export const Route = createFileRoute("/app/myclass/performance")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PerformancePage />
    </RoleGuard>
  ),
});

type TabId = "overview" | "students" | "subjects" | "intervention" | "ai";
type SortOption = "rank" | "highest" | "lowest" | "recent";
type PerformanceFilter = "all" | "top" | "stable" | "at-risk";

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "students", label: "Student Performance", icon: Users },
  { id: "subjects", label: "Subject Performance", icon: BookOpen },
  { id: "intervention", label: "Intervention Center", icon: Shield },
  { id: "ai", label: "AI Insights", icon: Sparkles },
];

const chartConfig = {
  avg: { label: "Average", color: "hsl(262, 83%, 58%)" },
  percentage: { label: "Percentage", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const subjectChartConfig = {
  avg: { label: "Avg", color: "hsl(262, 83%, 58%)" },
  highest: { label: "Highest", color: "hsl(142, 76%, 36%)" },
  lowest: { label: "Lowest", color: "hsl(0, 84%, 60%)" },
} satisfies ChartConfig;

const readinessChartConfig = {
  readiness: { label: "Readiness", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const scatterConfig = {
  marks: { label: "Marks", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rank", label: "Rank" },
  { value: "highest", label: "Highest Marks" },
  { value: "lowest", label: "Lowest Marks" },
  { value: "recent", label: "Recently Updated" },
];

const PERF_FILTER_OPTIONS: { value: PerformanceFilter; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "top", label: "Top Performers" },
  { value: "stable", label: "Stable" },
  { value: "at-risk", label: "At Risk" },
];

function getBadgeClass(badge: PerformanceStudent["badge"]) {
  if (badge === "top") return "bg-emerald-500 text-white border-0";
  if (badge === "at-risk") return "bg-red-500 text-white border-0";
  return "bg-slate-500 text-white border-0";
}

function getAvatarClass(badge: PerformanceStudent["badge"]) {
  if (badge === "top") return "bg-emerald-500";
  if (badge === "at-risk") return "bg-red-500";
  return "bg-violet-500";
}

function getPerformanceBadge(badge: PerformanceStudent["badge"]) {
  if (badge === "top") return <Badge className="border-0 bg-emerald-500/10 text-emerald-700">Top Performer</Badge>;
  if (badge === "at-risk") return <Badge className="border-0 bg-red-500/10 text-red-700">At Risk</Badge>;
  return <Badge variant="outline">Stable</Badge>;
}

function getSeverityClass(severity: "high" | "medium" | "low") {
  if (severity === "high") return "border-red-200 bg-red-500/5";
  if (severity === "medium") return "border-amber-200 bg-amber-500/5";
  return "border-sky-200 bg-sky-500/5";
}

function getSeverityDot(severity: "high" | "medium" | "low") {
  if (severity === "high") return "bg-red-500";
  if (severity === "medium") return "bg-amber-500";
  return "bg-sky-500";
}

function PerformancePage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [drawerWidth, setDrawerWidth] = useState(720);
  const [isResizing, setIsResizing] = useState(false);
  const [perfSearch, setPerfSearch] = useState("");
  const [perfFilter, setPerfFilter] = useState<PerformanceFilter>("all");
  const [perfSort, setPerfSort] = useState<SortOption>("rank");

  const students = useMemo(() => CLASS_PERFORMANCE_STUDENTS, []);

  const avgScore = useMemo(
    () => Math.round(students.reduce((sum, s) => sum + s.average, 0) / students.length),
    [students],
  );

  const topCount = students.filter((s) => s.badge === "top").length;
  const atRiskCount = students.filter((s) => s.badge === "at-risk").length;
  const upcomingExams = 2;
  const trend = "+6%";

  const analytics = useMemo(() => EXAM_ANALYTICS, []);

  const passCount = analytics.passFail.pass;
  const failCount = analytics.passFail.fail;

  const filteredStudents = useMemo(() => {
    let result = [...students];

    const query = perfSearch.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          String(s.roll).includes(query),
      );
    }

    if (perfFilter !== "all") {
      result = result.filter((s) => s.badge === perfFilter);
    }

    switch (perfSort) {
      case "highest":
        result.sort((a, b) => b.average - a.average);
        break;
      case "lowest":
        result.sort((a, b) => a.average - b.average);
        break;
      case "recent":
        result.sort((a, b) => a.roll - b.roll);
        break;
      default:
        result.sort((a, b) => a.rank - b.rank);
        break;
    }

    return result;
  }, [students, perfSearch, perfFilter, perfSort]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) ?? null,
    [students, selectedStudentId],
  );

  const top5 = useMemo(() => [...students].sort((a, b) => a.rank - b.rank).slice(0, 5), [students]);
  const bottom5 = useMemo(() => [...students].sort((a, b) => b.rank - a.rank).slice(0, 5), [students]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (event: MouseEvent) => {
      const nextWidth = Math.max(420, Math.min(980, window.innerWidth - event.clientX));
      setDrawerWidth(nextWidth);
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isResizing]);

  return (
    <TeacherPageLayout
      title="Class Performance"
      subtitle="Monitor and improve academic performance of 8-A students."
      kpiCards={
        <>
          <KpiCard
            label="Class Average"
            value={`${avgScore}%`}
            icon={BarChart3}
            color="text-sky-600 bg-sky-500/10"
          />
          <KpiCard
            label="Top Performers"
            value={`${topCount} Students`}
            icon={Trophy}
            color="text-emerald-600 bg-emerald-500/10"
          />
          <KpiCard
            label="At-Risk Students"
            value={`${atRiskCount} Students`}
            icon={AlertTriangle}
            color="text-red-600 bg-red-500/10"
          />
          <KpiCard
            label="Performance Trend"
            value={trend}
            icon={TrendingUp}
            color="text-violet-600 bg-violet-500/10"
          />
          <KpiCard
            label="Upcoming Exams"
            value={`${upcomingExams} Exams`}
            icon={Calendar}
            color="text-amber-600 bg-amber-500/10"
          />
        </>
      }
      tabs={
        <>
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </>
      }
    >
      {/* ═══════════════ TAB 1: OVERVIEW ═══════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Charts Row 1 */}
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Average Marks Trend</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Class average across completed exams.
              </p>
              <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <BarChart
                  data={analytics.monthlyTrend}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                    vertical={false}
                  />
                  <XAxis dataKey="exam" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis
                    domain={[60, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg" fill="var(--color-avg)" radius={[8, 8, 0, 0]} barSize={42} />
                </BarChart>
              </ChartContainer>
            </Card>

            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Subject Performance</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Average, highest, and lowest marks by subject.
              </p>
              <ChartContainer config={subjectChartConfig} className="h-[220px] w-full">
                <BarChart
                  data={analytics.subjectPerf}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="subject"
                    tick={{ fontSize: 9 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={[30, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg" fill="var(--color-avg)" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar
                    dataKey="highest"
                    fill="var(--color-highest)"
                    radius={[4, 4, 0, 0]}
                    barSize={14}
                  />
                  <Bar
                    dataKey="lowest"
                    fill="var(--color-lowest)"
                    radius={[4, 4, 0, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ChartContainer>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Attendance vs Performance</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Correlation between attendance and marks.
              </p>
              <ChartContainer config={scatterConfig} className="h-[220px] w-full">
                <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis
                    type="number"
                    dataKey="attendance"
                    name="Attendance"
                    domain={[70, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                    label={{ value: "Attendance %", position: "bottom", offset: -5, fontSize: 10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="marks"
                    name="Marks"
                    domain={[40, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                    label={{
                      value: "Marks %",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                      fontSize: 10,
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Scatter data={analytics.attendanceVsMarks} fill="var(--color-marks)" />
                </ScatterChart>
              </ChartContainer>
            </Card>

            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Exam Readiness</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Subject-wise readiness for the upcoming exams.
              </p>
              <ChartContainer config={readinessChartConfig} className="h-[220px] w-full">
                <BarChart
                  data={analytics.examReadiness}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="subject"
                    tick={{ fontSize: 9 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="readiness"
                    fill="var(--color-readiness)"
                    radius={[6, 6, 0, 0]}
                    barSize={34}
                  />
                </BarChart>
              </ChartContainer>
            </Card>
          </div>

          {/* Top 5 / Bottom 5 + Pass/Fail */}
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="size-4 text-emerald-600" />
                <h3 className="text-sm font-semibold">Top 5 Performers</h3>
              </div>
              <div className="space-y-2">
                {top5.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2"
                  >
                    <span className="w-4 text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px] text-white bg-emerald-500">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm font-medium">{student.name}</span>
                    <span className="text-sm font-semibold text-emerald-700">
                      {student.average}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-600" />
                <h3 className="text-sm font-semibold">Bottom 5 Performers</h3>
              </div>
              <div className="space-y-2">
                {bottom5.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2"
                  >
                    <span className="w-4 text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px] text-white bg-amber-500">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm font-medium">{student.name}</span>
                    <span className="text-sm font-semibold text-amber-700">
                      {student.average}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Pass/Fail + Strengths/Focus */}
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold">Pass vs Fail</h3>
              <div className="flex items-center gap-6">
                <ChartContainer
                  config={{
                    pass: { label: "Pass", color: "hsl(142, 76%, 36%)" },
                    fail: { label: "Fail", color: "hsl(0, 84%, 60%)" },
                  }}
                  className="h-[160px] w-[160px]"
                >
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Pass", value: passCount, fill: "hsl(142, 76%, 36%)" },
                        { name: "Fail", value: failCount, fill: "hsl(0, 84%, 60%)" },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>Pass: {passCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-500" />
                    <span>Fail: {failCount}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold">Strength Areas</h3>
                  </div>
                  <div className="space-y-1.5">
                    {STRENGTH_AREAS.map((area) => (
                      <div
                        key={area}
                        className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700"
                      >
                        <CheckCircle2 className="size-3.5" />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="size-4 text-amber-600" />
                    <h3 className="text-sm font-semibold">Focus Areas</h3>
                  </div>
                  <div className="space-y-1.5">
                    {FOCUS_AREAS.map((area) => (
                      <div
                        key={area}
                        className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-500/5 px-3 py-2 text-sm text-amber-700"
                      >
                        <Target className="size-3.5" />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ═══════════════ TAB 2: STUDENT PERFORMANCE ═══════════════ */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search Student"
                  value={perfSearch}
                  onChange={(e) => setPerfSearch(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>
              <Select
                value={perfFilter}
                onValueChange={(v) => setPerfFilter(v as PerformanceFilter)}
              >
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="Performance" />
                </SelectTrigger>
                <SelectContent>
                  {PERF_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={perfFilter}
                onValueChange={(v) => setPerfFilter(v as PerformanceFilter)}
              >
                <SelectTrigger className="h-9 w-36">
                  <SelectValue placeholder="Attendance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attendance</SelectItem>
                  <SelectItem value="top">90% and above</SelectItem>
                  <SelectItem value="stable">75% to 89%</SelectItem>
                  <SelectItem value="at-risk">Below 75%</SelectItem>
                </SelectContent>
              </Select>
              <Select value={perfSort} onValueChange={(v) => setPerfSort(v as SortOption)}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px]">
                Class 8-A
              </Badge>
            </div>
          </Card>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className="rounded-2xl border border-border/60 bg-background p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback
                      className={cn("text-xs text-white", getAvatarClass(student.badge))}
                    >
                      {student.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{student.name}</span>
                      {getPerformanceBadge(student.badge)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Roll #{student.roll} · Rank #{student.rank}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-lg font-semibold",
                        student.average >= 85
                          ? "text-emerald-700"
                          : student.average >= 70
                            ? "text-violet-700"
                            : "text-amber-700",
                      )}
                    >
                      {student.average}%
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Attendance {student.attendance}%
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Progress value={student.average} className="h-2" />
                  <div className="flex flex-wrap gap-1.5">
                    {student.strengths.slice(0, 2).map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="rounded-full border-emerald-200 bg-emerald-500/10 text-[10px] text-emerald-700"
                      >
                        {s}
                      </Badge>
                    ))}
                    {student.weaknesses.slice(0, 1).map((w) => (
                      <Badge
                        key={w}
                        variant="outline"
                        className="rounded-full border-amber-200 bg-amber-500/10 text-[10px] text-amber-700"
                      >
                        Needs support in {w}
                      </Badge>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB 3: SUBJECT PERFORMANCE ═══════════════ */}
      {activeTab === "subjects" && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {SUBJECT_PERFORMANCE.map((subject) => (
              <Card
                key={subject.name}
                className="rounded-2xl border border-border/60 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">{subject.emoji}</span>
                  <h3 className="text-sm font-semibold">{subject.name}</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Score</span>
                    <span
                      className={cn(
                        "font-semibold",
                        subject.average >= 80 ? "text-emerald-700" : subject.average >= 70 ? "text-violet-700" : "text-amber-700",
                      )}
                    >
                      {subject.average}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Highest</span>
                    <span className="font-semibold text-emerald-700">{subject.highest}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lowest</span>
                    <span className="font-semibold text-amber-700">{subject.lowest}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Students At Risk</span>
                    <span className="font-semibold text-red-600">{subject.atRisk}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pass Rate</span>
                    <span className="font-semibold">{subject.passRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Upcoming Exam</span>
                    <Badge variant="outline" className="rounded-full text-[10px]">
                      {subject.upcomingExam}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Subject Charts */}
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Subject Comparison</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Average marks across all subjects.
              </p>
              <ChartContainer config={subjectChartConfig} className="h-[220px] w-full">
                <BarChart
                  data={analytics.subjectPerf}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="subject"
                    tick={{ fontSize: 9 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={[30, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg" fill="var(--color-avg)" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar
                    dataKey="highest"
                    fill="var(--color-highest)"
                    radius={[4, 4, 0, 0]}
                    barSize={14}
                  />
                  <Bar
                    dataKey="lowest"
                    fill="var(--color-lowest)"
                    radius={[4, 4, 0, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ChartContainer>
            </Card>

            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Exam Readiness</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Subject-wise readiness for upcoming exams.
              </p>
              <ChartContainer config={readinessChartConfig} className="h-[220px] w-full">
                <BarChart
                  data={analytics.examReadiness}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="subject"
                    tick={{ fontSize: 9 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    className="text-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="readiness"
                    fill="var(--color-readiness)"
                    radius={[6, 6, 0, 0]}
                    barSize={34}
                  />
                </BarChart>
              </ChartContainer>
            </Card>
          </div>
        </div>
      )}

      {/* ═══════════════ TAB 4: INTERVENTION CENTER ═══════════════ */}
      {activeTab === "intervention" && (
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-xl bg-amber-500/10">
                <Shield className="size-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Intervention Center</h3>
                <p className="text-xs text-muted-foreground">
                  Students who need support — auto-identified by performance rules.
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border/60 px-2.5 py-1">Average &lt; 60%</span>
              <span className="rounded-full border border-border/60 px-2.5 py-1">Attendance &lt; 75%</span>
              <span className="rounded-full border border-border/60 px-2.5 py-1">Score Drop</span>
              <span className="rounded-full border border-border/60 px-2.5 py-1">Missing Assignments</span>
            </div>
          </Card>

          <div className="space-y-3">
            {INTERVENTION_STUDENTS.map((student) => (
              <Card
                key={student.id}
                className={cn(
                  "rounded-2xl border p-4 shadow-sm",
                  getSeverityClass(student.severity),
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <span className={cn("size-2.5 rounded-full", getSeverityDot(student.severity))} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{student.name}</span>
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        Roll #{student.roll}
                      </Badge>
                    </div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Attendance</span>
                        <span className={cn(
                          "ml-2 font-semibold",
                          student.attendance < 75 ? "text-red-600" : "text-amber-600",
                        )}>
                          {student.attendance}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Average</span>
                        <span className={cn(
                          "ml-2 font-semibold",
                          student.average < 60 ? "text-red-600" : "text-amber-600",
                        )}>
                          {student.average}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reason</span>
                        <span className="ml-2 font-medium">{student.reason}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">Suggested Action:</span> {student.suggestedAction}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
                      <MessageSquare className="mr-1 size-3" /> Add Note
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
                      <Phone className="mr-1 size-3" /> Contact Parent
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
                      <CalendarDays className="mr-1 size-3" /> Schedule PTA
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
                      <BookOpen className="mr-1 size-3" /> Assign Work
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] px-2">
                      <Brain className="mr-1 size-3" /> Study Plan
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ TAB 5: AI INSIGHTS ═══════════════ */}
      {activeTab === "ai" && (
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-xl bg-violet-500/10">
                <Brain className="size-4 text-violet-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Insights</h3>
                <p className="text-xs text-muted-foreground">
                  Focused suggestions for Class 8-A — no school-wide data.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {PERFORMANCE_AI_INSIGHTS.map((insight, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-xl border p-3 text-sm",
                    insight.type === "warning"
                      ? "border-amber-200 bg-amber-500/5"
                      : insight.type === "success"
                        ? "border-emerald-200 bg-emerald-500/5"
                        : "border-violet-200 bg-violet-500/5",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Sparkles
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        insight.type === "warning"
                          ? "text-amber-500"
                          : insight.type === "success"
                            ? "text-emerald-500"
                            : "text-violet-500",
                      )}
                    />
                    <span className="leading-relaxed text-muted-foreground">{insight.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
            <h3 className="text-sm font-semibold">AI Suggestions</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {PERFORMANCE_AI_SUGGESTIONS.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-violet-200 bg-violet-500/5 px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
            <h3 className="text-sm font-semibold">Quick Actions</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { label: "Generate Performance Report", icon: FileText, color: "text-violet-600 bg-violet-500/10" },
                { label: "Contact Parent", icon: Phone, color: "text-sky-600 bg-sky-500/10" },
                { label: "Schedule PTA", icon: CalendarDays, color: "text-emerald-600 bg-emerald-500/10" },
                { label: "Assign Extra Work", icon: BookOpen, color: "text-amber-600 bg-amber-500/10" },
                { label: "Generate Study Plan", icon: Brain, color: "text-violet-600 bg-violet-500/10" },
                { label: "Open AI Assistant", icon: Sparkles, color: "text-violet-600 bg-violet-500/10" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div className={cn("grid size-9 place-items-center rounded-xl", action.color)}>
                      <Icon className="size-4" />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════ STUDENT WORKSPACE DRAWER ═══════════════ */}
      <Sheet
        open={!!selectedStudentId}
        onOpenChange={(open) => !open && setSelectedStudentId(null)}
      >
        <SheetContent
          side="right"
          className="min-w-[420px] max-w-[980px] overflow-hidden"
          style={{ width: drawerWidth }}
        >
          <div
            className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-muted/60"
            onMouseDown={() => setIsResizing(true)}
          />

          {selectedStudent && (
            <div className="flex h-full flex-col">
              <SheetHeader>
                <SheetTitle>Student Profile</SheetTitle>
              </SheetHeader>

              <ScrollArea className="h-full pr-3">
                <div className="space-y-5 pb-4">
                  <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                    <div className="flex items-start gap-4">
                      <Avatar className="size-12">
                        <AvatarFallback
                          className={cn(
                            "text-sm text-white",
                            getAvatarClass(selectedStudent.badge),
                          )}
                        >
                          {selectedStudent.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="text-lg font-semibold">{selectedStudent.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Roll #{selectedStudent.roll} · Class 8-A
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {getPerformanceBadge(selectedStudent.badge)}
                          <Badge variant="outline" className="rounded-full text-[10px]">
                            Attendance {selectedStudent.attendance}%
                          </Badge>
                          <Badge variant="outline" className="rounded-full text-[10px]">
                            Average {selectedStudent.average}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="size-4 text-violet-600" />
                      <h4 className="text-sm font-semibold">AI Student Insights</h4>
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      {selectedStudent.attendance < 80
                        ? "Attendance needs a quick follow-up."
                        : "Attendance is strong and consistent."}
                      <div className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-amber-500" />
                        <span>
                          {selectedStudent.badge === "at-risk"
                            ? "Intervention plan should stay active."
                            : "Performance remains within the expected band."}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-emerald-500" />
                        <span>
                          {selectedStudent.strengths.length > 0
                            ? `Strong subjects: ${selectedStudent.strengths.join(", ")}.`
                            : "No clear strengths flagged yet."}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="attendance">Attendance</TabsTrigger>
                      <TabsTrigger value="academics">Academics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4">
                      <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                          <ProfileItem label="Student" value={selectedStudent.name} />
                          <ProfileItem label="Class" value="8-A" />
                          <ProfileItem label="Roll Number" value={String(selectedStudent.roll)} />
                          <ProfileItem label="Gender" value={selectedStudent.gender} />
                          <ProfileItem label="Attendance" value={`${selectedStudent.attendance}%`} />
                          <ProfileItem label="Average Score" value={`${selectedStudent.average}%`} />
                          <ProfileItem label="Rank" value={`#${selectedStudent.rank}`} />
                          <ProfileItem
                            label="Strengths"
                            value={selectedStudent.strengths.join(", ") || "None"}
                          />
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="attendance" className="mt-4">
                      <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                        <div className="grid gap-3 sm:grid-cols-3">
                          <ProfileItem
                            label="Attendance Rate"
                            value={`${selectedStudent.attendance}%`}
                          />
                          <ProfileItem
                            label="Days Present"
                            value={`${Math.round((180 * selectedStudent.attendance) / 100)}`}
                          />
                          <ProfileItem
                            label="Days Absent"
                            value={`${180 - Math.round((180 * selectedStudent.attendance) / 100)}`}
                          />
                        </div>
                        <div className="mt-4">
                          <p className="text-xs text-muted-foreground">Attendance Status</p>
                          <Badge
                            className={cn(
                              "mt-2 rounded-full border-0 text-[10px]",
                              selectedStudent.attendance >= 90
                                ? "bg-emerald-500/10 text-emerald-700"
                                : selectedStudent.attendance >= 75
                                  ? "bg-amber-500/10 text-amber-700"
                                  : "bg-red-500/10 text-red-700",
                            )}
                          >
                            {selectedStudent.attendance >= 90
                              ? "Excellent"
                              : selectedStudent.attendance >= 75
                                ? "Good"
                                : "Needs Attention"}
                          </Badge>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="academics" className="mt-4 space-y-4">
                      <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                        <h4 className="text-sm font-semibold">Subject Marks</h4>
                        <div className="mt-4 space-y-3">
                          {selectedStudent.subjects.map((subject) => (
                            <div key={subject.name} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium">{subject.name}</span>
                                <span className="text-muted-foreground">
                                  {subject.marks}/{subject.max} · {subject.grade}
                                </span>
                              </div>
                              <Progress value={subject.marks} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                        <h4 className="text-sm font-semibold">Exam Trend</h4>
                        <ChartContainer config={chartConfig} className="h-[180px] w-full">
                          <LineChart
                            data={selectedStudent.examHistory}
                            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                            <XAxis
                              dataKey="exam"
                              tick={{ fontSize: 10 }}
                              className="text-muted-foreground"
                            />
                            <YAxis
                              domain={[40, 100]}
                              tick={{ fontSize: 10 }}
                              className="text-muted-foreground"
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                              type="monotone"
                              dataKey="percentage"
                              stroke="var(--color-percentage)"
                              strokeWidth={2}
                              dot={{ r: 3 }}
                            />
                          </LineChart>
                        </ChartContainer>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h4 className="text-sm font-semibold">Teacher Actions</h4>
                        <p className="text-xs text-muted-foreground">Class-level actions only.</p>
                      </div>
                      <Badge variant="secondary">Allowed</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="justify-start">
                        <MessageSquare className="size-4 mr-2" /> Add Remark
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Phone className="size-4 mr-2" /> Contact Parent
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <CalendarDays className="size-4 mr-2" /> Schedule Meeting
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <BookOpen className="size-4 mr-2" /> Assign Work
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <TrendingUp className="size-4 mr-2" /> View Performance
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Brain className="size-4 mr-2" /> Generate AI Insights
                      </Button>
                    </div>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </TeacherPageLayout>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background px-3 py-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
