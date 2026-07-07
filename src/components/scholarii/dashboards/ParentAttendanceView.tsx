import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  TrendingDown,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Sparkles,
  Target,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { KpiCard } from "@/components/scholarii/KpiCard";
import {
  getAttendanceData,
  type AttendanceData,
} from "@/lib/scholarii/attendance-mock-data";

const monthlyChartConfig = {
  percentage: {
    label: "Attendance %",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig;

const breakdownChartConfig = {
  Present: { label: "Present", color: "hsl(142, 76%, 36%)" },
  Absent: { label: "Absent", color: "hsl(0, 84%, 60%)" },
  Leave: { label: "Leave", color: "hsl(38, 92%, 50%)" },
} satisfies ChartConfig;

const subjectChartConfig = {
  percentage: {
    label: "Attendance %",
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig;

const TABS = [
  { id: "overview", label: "Overview", icon: ClipboardCheck },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "trends", label: "Trends", icon: TrendingUp },
  { id: "insights", label: "AI Insights", icon: Sparkles },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <h2 className="text-base sm:text-lg font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

function OverviewTab({ data }: { data: AttendanceData }) {
  const recentDays = data.dailyAttendance.slice(-10);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-5">
          <h3 className="font-semibold mb-1">Monthly Attendance</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Child's attendance percentage by month</p>
          <ChartContainer config={monthlyChartConfig} className="h-[200px] sm:h-[240px] w-full">
            <LineChart data={data.monthlyAttendance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--color-percentage)"
                strokeWidth={2.5}
                dot={{ fill: "var(--color-percentage)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        </Card>

        <Card className="p-4 sm:p-5">
          <h3 className="font-semibold mb-1">Attendance Breakdown</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Overall distribution this term</p>
          <ChartContainer config={breakdownChartConfig} className="h-[180px] sm:h-[200px] w-full">
            <PieChart>
              <Pie
                data={data.attendanceBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
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
          <div className="flex justify-center gap-3 sm:gap-4 mt-2">
            {data.attendanceBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                <div className="size-2 rounded-full" style={{ background: entry.color }} />
                {entry.name} ({entry.value} days)
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <SectionHeader title="Recent Attendance" />
        <div className="space-y-2">
          {recentDays.map((day) => (
            <div key={day.date} className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-border/50">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className={`rounded-lg p-1.5 sm:p-2 ${
                  day.status === "present" ? "bg-emerald-500/10" :
                  day.status === "absent" ? "bg-red-500/10" :
                  day.status === "leave" ? "bg-amber-500/10" : "bg-slate-500/10"
                }`}>
                  {day.status === "present" && <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-600" />}
                  {day.status === "absent" && <XCircle className="size-3.5 sm:size-4 text-red-600" />}
                  {day.status === "leave" && <Clock className="size-3.5 sm:size-4 text-amber-600" />}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">{day.date}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{day.day}</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] sm:text-xs capitalize ${
                  day.status === "present" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                  day.status === "absent" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                  "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }`}
              >
                {day.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CalendarTab({ data }: { data: AttendanceData }) {
  const currentMonth = "June 2026";
  const daysInMonth = 30;
  const firstDayOffset = 1;

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const attendance = data.dailyAttendance.find((d) => d.date.endsWith(`-${String(dayNum).padStart(2, "0")}`));
    return {
      day: dayNum,
      status: attendance?.status || "holiday",
    };
  });

  const statusColors = {
    present: "bg-emerald-500",
    absent: "bg-red-500",
    leave: "bg-amber-500",
    holiday: "bg-muted",
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="font-semibold text-sm sm:text-base">{currentMonth}</h3>
          <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs">
            <span className="flex items-center gap-1 sm:gap-1.5"><div className="size-1.5 sm:size-2 rounded-full bg-emerald-500" />Present</span>
            <span className="flex items-center gap-1 sm:gap-1.5"><div className="size-1.5 sm:size-2 rounded-full bg-red-500" />Absent</span>
            <span className="flex items-center gap-1 sm:gap-1.5"><div className="size-1.5 sm:size-2 rounded-full bg-amber-500" />Leave</span>
            <span className="flex items-center gap-1 sm:gap-1.5"><div className="size-1.5 sm:size-2 rounded-full bg-muted" />Holiday</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="font-medium text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: firstDayOffset }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {calendarDays.map((d) => (
            <div
              key={d.day}
              className="aspect-square rounded-lg sm:rounded-xl border border-border/50 grid place-items-center relative hover:bg-muted/50 transition-colors"
            >
              <span className="text-[10px] sm:text-sm text-muted-foreground">{d.day}</span>
              <div className={`absolute bottom-1 sm:bottom-1.5 size-1 sm:size-1.5 rounded-full ${statusColors[d.status]}`} />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <Card className="p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">{data.presentDays}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Days Present</p>
        </Card>
        <Card className="p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-red-600">{data.absentDays}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Days Absent</p>
        </Card>
        <Card className="p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-amber-600">{data.leaveDays}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Days on Leave</p>
        </Card>
        <Card className="p-3 sm:p-4 text-center">
          <p className="text-xl sm:text-2xl font-bold text-violet-600">{data.streak}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Day Streak</p>
        </Card>
      </div>
    </div>
  );
}

function SubjectsTab({ data }: { data: AttendanceData }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <Card className="p-4 sm:p-5">
        <h3 className="font-semibold mb-1">Subject-wise Attendance</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Child's attendance percentage by subject</p>
        <ChartContainer config={subjectChartConfig} className="h-[240px] sm:h-[280px] w-full">
          <BarChart data={data.subjectAttendance} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
            <XAxis dataKey="subject" tick={{ fontSize: 10 }} className="text-muted-foreground" />
            <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="percentage" fill="var(--color-percentage)" radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ChartContainer>
      </Card>

      <div className="space-y-2.5 sm:space-y-3">
        {data.subjectAttendance.map((subject) => (
          <Card key={subject.subject} className="p-3 sm:p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className={`rounded-lg p-1.5 sm:p-2 ${
                  subject.percentage >= 95 ? "bg-emerald-500/10" :
                  subject.percentage >= 90 ? "bg-violet-500/10" :
                  subject.percentage >= 85 ? "bg-amber-500/10" : "bg-red-500/10"
                }`}>
                  <BookOpen className={`size-3.5 sm:size-4 ${
                    subject.percentage >= 95 ? "text-emerald-600" :
                    subject.percentage >= 90 ? "text-violet-600" :
                    subject.percentage >= 85 ? "text-amber-600" : "text-red-600"
                  }`} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium">{subject.subject}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{subject.teacher}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-bold">{subject.attended}/{subject.total} days</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{subject.percentage}%</p>
                </div>
                <div className={`rounded-lg p-1 sm:p-1.5 ${
                  subject.trend === "up" ? "bg-emerald-500/10" :
                  subject.trend === "down" ? "bg-red-500/10" : "bg-slate-500/10"
                }`}>
                  {subject.trend === "up" && <TrendingUp className="size-3 sm:size-3.5 text-emerald-600" />}
                  {subject.trend === "down" && <TrendingDown className="size-3 sm:size-3.5 text-red-600" />}
                  {subject.trend === "stable" && <Target className="size-3 sm:size-3.5 text-slate-600" />}
                </div>
              </div>
            </div>
            <div className="mt-2.5 sm:mt-3 h-1.5 sm:h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${subject.percentage}%`,
                  background: subject.percentage >= 95 ? "hsl(142, 76%, 36%)" :
                    subject.percentage >= 90 ? "hsl(262, 83%, 58%)" :
                    subject.percentage >= 85 ? "hsl(38, 92%, 50%)" : "hsl(0, 84%, 60%)",
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrendsTab({ data }: { data: AttendanceData }) {
  const weeklyData = data.weeklyTrends.map((w) => ({
    ...w,
    total: w.present + w.absent + w.leave,
  }));

  return (
    <div className="space-y-5 sm:space-y-6">
      <Card className="p-4 sm:p-5">
        <h3 className="font-semibold mb-1">Weekly Attendance Trend</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Present, absent, and leave days per week</p>
        <ChartContainer config={subjectChartConfig} className="h-[240px] sm:h-[280px] w-full">
          <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="present" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="absent" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar dataKey="leave" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ChartContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-5">
          <h3 className="font-semibold mb-3">Attendance Trend</h3>
          <div className="space-y-2.5 sm:space-y-3">
            {data.monthlyAttendance.map((m) => (
              <div key={m.m} className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">{m.m}</span>
                <div className="flex items-center gap-2 sm:gap-3 flex-1 ml-3 sm:ml-4">
                  <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${m.v}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium w-10 sm:w-12 text-right">{m.v}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <h3 className="font-semibold mb-3">Key Metrics</h3>
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-600" />
                <span className="text-xs sm:text-sm">Current Streak</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-emerald-600">{data.streak} days</span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
              <div className="flex items-center gap-2">
                <Target className="size-3.5 sm:size-4 text-violet-600" />
                <span className="text-xs sm:text-sm">Target</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-violet-600">{data.targetPercentage}%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-3.5 sm:size-4 text-amber-600" />
                <span className="text-xs sm:text-sm">vs Last Month</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-amber-600">+{data.percentage - data.lastMonthPercentage}%</span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-3.5 sm:size-4 text-blue-600" />
                <span className="text-xs sm:text-sm">Days Remaining</span>
              </div>
              <span className="text-base sm:text-lg font-bold text-blue-600">{data.totalDays - data.presentDays - data.absentDays - data.leaveDays}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InsightsTab({ data }: { data: AttendanceData }) {
  const iconMap = {
    improvement: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10" },
    positive: { icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-500/10" },
    suggestion: { icon: Zap, color: "text-blue-600", bg: "bg-blue-500/10" },
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <Card className="relative overflow-hidden p-4 sm:p-5 border-violet-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-violet-600/5" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 p-1.5 sm:p-2">
              <Sparkles className="size-3.5 sm:size-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">AI Attendance Insights</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Personalized recommendations for your child's attendance</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
            {data.attendanceInsights.map((insight) => {
              const { icon: InsightIcon, color, bg } = iconMap[insight.type];
              return (
                <div
                  key={insight.id}
                  className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-background/80 border border-border/50"
                >
                  <div className={`rounded-lg p-1.5 ${bg} shrink-0`}>
                    <InsightIcon className={`size-3 sm:size-3.5 ${color}`} />
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">{insight.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 sm:p-5">
          <h3 className="font-semibold mb-3">Attendance Goals</h3>
          <div className="space-y-2.5 sm:space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                <span className="text-muted-foreground">Target: {data.targetPercentage}%</span>
                <span className="font-medium">{data.percentage}%</span>
              </div>
              <div className="h-2.5 sm:h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${(data.percentage / data.targetPercentage) * 100}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {data.percentage >= data.targetPercentage
                ? "Your child has achieved the attendance target!"
                : `${data.targetPercentage - data.percentage}% more to reach the target.`}
            </p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <h3 className="font-semibold mb-3">Attendance Summary</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total School Days</span>
              <span className="font-medium">{data.totalDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days Present</span>
              <span className="font-medium text-emerald-600">{data.presentDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days Absent</span>
              <span className="font-medium text-red-600">{data.absentDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days on Leave</span>
              <span className="font-medium text-amber-600">{data.leaveDays}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/50">
              <span className="font-medium">Overall Attendance</span>
              <span className="font-bold text-emerald-600">{data.percentage}%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ParentAttendanceView() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const data = useMemo(() => getAttendanceData(), []);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Monitor your child's attendance and participation throughout the academic year.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <KpiCard
          icon={ClipboardCheck}
          label="Attendance"
          value={`${data.percentage}%`}
          tone={data.percentage >= 90 ? "success" : data.percentage >= 80 ? "warning" : "default"}
        />
        <KpiCard
          icon={CheckCircle2}
          label="Present Days"
          value={`${data.presentDays}`}
          tone="success"
        />
        <KpiCard
          icon={XCircle}
          label="Absent Days"
          value={`${data.absentDays}`}
          tone="warning"
        />
        <KpiCard
          icon={Clock}
          label="Leaves Taken"
          value={`${data.leaveDays}`}
          tone="info"
        />
      </div>

      {/* Tab Bar */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-1 px-4 sm:px-1 pt-1 pb-2 sm:pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-2xl" />
          <div className="relative flex gap-1 overflow-x-auto scrollbar-none rounded-2xl border border-border/60 bg-card p-1 sm:p-1.5 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="size-3.5 sm:size-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px] sm:min-h-[400px]">
        {activeTab === "overview" && <OverviewTab data={data} />}
        {activeTab === "calendar" && <CalendarTab data={data} />}
        {activeTab === "subjects" && <SubjectsTab data={data} />}
        {activeTab === "trends" && <TrendsTab data={data} />}
        {activeTab === "insights" && <InsightsTab data={data} />}
      </div>
    </div>
  );
}
