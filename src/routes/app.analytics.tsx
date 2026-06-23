import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowDownRight, ArrowUpRight, BarChart3, BrainCircuit, Briefcase, DollarSign,
  Download, GraduationCap, LineChart, FileText, MessageSquareMore, Sparkles,
  TrendingUp, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

type TimeRange = "Last 7 Days" | "Last 30 Days" | "Current Term" | "Current Academic Year";
type TrendDirection = "up" | "down" | "stable";

const attendanceTrend = [
  { month: "Apr", value: 90 }, { month: "May", value: 91 }, { month: "Jun", value: 89 },
  { month: "Jul", value: 92 }, { month: "Aug", value: 93 }, { month: "Sep", value: 94 }, { month: "Oct", value: 95 },
];
const attendanceByDay = [
  { day: "Mon", value: 88 }, { day: "Tue", value: 91 }, { day: "Wed", value: 93 },
  { day: "Thu", value: 94 }, { day: "Fri", value: 92 }, { day: "Sat", value: 89 },
];
const subjectSummary = [
  { subject: "Mathematics", score: 72, status: "Needs Improvement" },
  { subject: "Science", score: 84, status: "Strong" },
  { subject: "English", score: 81, status: "Healthy" },
  { subject: "Computer Science", score: 88, status: "Strong" },
  { subject: "Social Studies", score: 76, status: "Moderate" },
  { subject: "Hindi", score: 79, status: "Stable" },
];
const adoptionGrowth = [
  { label: "Teacher AI Queries", value: 12458 },
  { label: "Student AI Queries", value: 29840 },
  { label: "Hours Saved", value: 1284 },
  { label: "Documents in School Brain", value: 4820 },
  { label: "Automations Executed", value: 860 },
];
const analyticsInsights = [
  { title: "Attendance improved by 2% this month.", detail: "Monday remains the weakest day, so late-week intervention is paying off." },
  { title: "Grade 8 continues to have the highest fee default rate.", detail: "The pattern is stable, which makes targeted reminders more effective." },
  { title: "Mathematics remains the weakest subject.", detail: "The gap is narrow, but it still needs focused academic support." },
  { title: "Parent engagement increased by 8%.", detail: "PTM reminders and WhatsApp communication are driving the lift." },
  { title: "Staff workload imbalance detected in the Science department.", detail: "Five teachers currently have limited free periods." },
  { title: "School compliance readiness remains above 90%.", detail: "This supports a strong operational outlook across the year." },
];
const timeRanges: TimeRange[] = ["Last 7 Days", "Last 30 Days", "Current Term", "Current Academic Year"];

function trendMeta(direction: TrendDirection) {
  if (direction === "up") return { icon: <ArrowUpRight className="size-3.5" />, className: "text-emerald-600 bg-emerald-500/10" };
  if (direction === "down") return { icon: <ArrowDownRight className="size-3.5" />, className: "text-red-600 bg-red-500/10" };
  return { icon: <LineChart className="size-3.5" />, className: "text-sky-600 bg-sky-500/10" };
}

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 30 Days");
  const [activeTab, setActiveTab] = useState("attendance");

  const kpis = [
    { label: "Attendance Health", value: "94%", change: "+2%", direction: "up" as TrendDirection, hint: "Attendance is steady across most grades.", icon: Users, tone: "emerald" as const },
    { label: "Academic Health", value: "84%", change: "+3%", direction: "up" as TrendDirection, hint: "Performance is improving, but Maths needs support.", icon: GraduationCap, tone: "sky" as const },
    { label: "Finance Health", value: "87%", change: "+4%", direction: "up" as TrendDirection, hint: "Collections are improving, especially with reminders.", icon: DollarSign, tone: "amber" as const },
    { label: "Parent Engagement", value: "78%", change: "+8%", direction: "up" as TrendDirection, hint: "PTM reminders continue to drive the best response.", icon: MessageSquareMore, tone: "violet" as const },
    { label: "Staff Health", value: "91%", change: "+1%", direction: "up" as TrendDirection, hint: "Workload balance is mostly healthy with a few exceptions.", icon: Briefcase, tone: "sky" as const },
    { label: "Scholarii Adoption", value: "86%", change: "+6%", direction: "up" as TrendDirection, hint: "Usage is growing across teachers and staff.", icon: Sparkles, tone: "violet" as const },
  ];

  const summaryByRange: Record<TimeRange, string> = {
    "Last 7 Days": "Attendance and academic performance continue to improve over the last 7 days, while fee collection remains stable. Parent engagement has also increased, and overall operations remain healthy.",
    "Last 30 Days": "Attendance and academic performance continue to improve, while fee collection remains stable. Parent engagement increased this month, and overall school operations remain healthy.",
    "Current Term": "This term shows steady gains across attendance, academics, and parent engagement. Fee collection is trending upward and staff health remains strong.",
    "Current Academic Year": "Year-to-date performance is healthy across the school, with strong attendance, improving academic outcomes, and rising adoption of Scholarii across departments.",
  };

  const attendanceMetrics = [
    { label: "Average Attendance", value: "94%", hint: "School-wide average" },
    { label: "Best Performing Class", value: "10A", hint: "98% attendance" },
    { label: "Lowest Attendance Class", value: "8B", hint: "74% attendance" },
    { label: "Students Below Threshold", value: "34", hint: "Below 75%" },
  ];
  const academicMetrics = [
    { label: "School Average", value: "78%", hint: "Across all subjects" },
    { label: "Top Class", value: "10A", hint: "89% average" },
    { label: "Weakest Class", value: "8B", hint: "71% average" },
    { label: "Students At Risk", value: "21", hint: "Need support" },
  ];
  const parentMetrics = [
    { label: "Parent Engagement", value: "78%", hint: "Healthy" },
    { label: "Circular Read Rate", value: "84%", hint: "Strong" },
    { label: "PTM Participation", value: "76%", hint: "Improving" },
    { label: "Active Parents", value: "92%", hint: "Connected" },
  ];
  const adoptionMetrics = [
    { label: "Teacher AI Queries", value: "12,458", hint: "This month" },
    { label: "Student AI Queries", value: "29,840", hint: "This month" },
    { label: "Hours Saved", value: "1,284", hint: "Through automation" },
    { label: "Documents in School Brain", value: "4,820", hint: "Indexed knowledge" },
    { label: "Staff Adoption Rate", value: "93%", hint: "Very strong" },
    { label: "Automations Executed", value: "860", hint: "Completed workflows" },
  ];

  const attendanceChart = useMemo(
    () => attendanceTrend.map((point, index) => ({
      ...point,
      value: point.value + (timeRange === "Last 7 Days" ? index % 2 : timeRange === "Current Academic Year" ? 1 : 0),
    })),
    [timeRange]
  );

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="School Intelligence Center — trends, explanations, comparisons, and actionable insights."
        action={
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-violet-600 hover:bg-violet-700">
              <Download className="size-3" /> Export Report
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <FileText className="size-3" /> Executive Summary
            </Button>
          </div>
        }
      />

      {/* Time Range Filter */}
      <Card className="p-3 sm:p-4 mb-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold">Time Range</p>
            <p className="text-[10px] text-muted-foreground">Select a period to review.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[200px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => <SelectItem key={range} value={range}>{range}</SelectItem>)}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-[9px]">{timeRange}</Badge>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="p-4 sm:p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center shrink-0">
            <BrainCircuit className="size-5 text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-semibold">School Intelligence Summary</p>
            <p className="mt-1 text-xs text-muted-foreground leading-5">{summaryByRange[timeRange]}</p>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const trend = trendMeta(kpi.direction);
          const tones = { emerald: "bg-emerald-500/10 text-emerald-500", sky: "bg-sky-500/10 text-sky-500", amber: "bg-amber-500/10 text-amber-500", violet: "bg-violet-500/10 text-violet-500" };
          return (
            <Card key={kpi.label} className="p-3 sm:p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", tones[kpi.tone])}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
                  <div className="text-lg font-semibold">{kpi.value}</div>
                </div>
              </div>
              <div className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", trend.className)}>
                {trend.icon} {kpi.change}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">{kpi.hint}</p>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="p-3 sm:p-4 mb-8">
          <TabsList className="h-11 overflow-x-auto scrollbar-hide">
            <TabsTrigger value="attendance" className="text-sm gap-2 px-5"><BarChart3 className="size-4" /> Attendance</TabsTrigger>
            <TabsTrigger value="academic" className="text-sm gap-2 px-5"><GraduationCap className="size-4" /> Academic</TabsTrigger>
            <TabsTrigger value="parent" className="text-sm gap-2 px-5"><Users className="size-4" /> Parent Engagement</TabsTrigger>
            <TabsTrigger value="adoption" className="text-sm gap-2 px-5"><TrendingUp className="size-4" /> Scholarii Adoption</TabsTrigger>
            <TabsTrigger value="insights" className="text-sm gap-2 px-5"><BrainCircuit className="size-4" /> AI Insights</TabsTrigger>
          </TabsList>
        </Card>

        {/* ═══ ATTENDANCE ═══ */}
        <TabsContent value="attendance">
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {attendanceMetrics.map((m) => (
                <Card key={m.label} className="p-3 sm:p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">{m.label}</div>
                  <div className="text-lg font-semibold">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m.hint}</div>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="lg:col-span-2 p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold mb-3">Attendance Trend</h4>
                <div className="w-full h-[200px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceChart} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="attendanceFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis domain={[85, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#attendanceFill)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold mb-3">Attendance by Weekday</h4>
                <div className="w-full h-[200px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceByDay} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                      <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {["Grade 9 attendance declined by 4% this month.", "Monday attendance remains the lowest across the school.", "34 students remain below the attendance threshold."].map((item) => (
                <Card key={item} className="p-3 sm:p-4"><p className="text-xs text-muted-foreground">{item}</p></Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ═══ ACADEMIC ═══ */}
        <TabsContent value="academic">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {academicMetrics.map((m) => (
                <Card key={m.label} className="p-3 sm:p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">{m.label}</div>
                  <div className="text-lg font-semibold">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m.hint}</div>
                </Card>
              ))}
            </div>
            <Card className="p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold mb-3">Subject Performance Summary</h4>
              <div className="space-y-3">
                {subjectSummary.map((s) => (
                  <div key={s.subject} className="rounded-xl border border-border/60 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-medium">{s.subject}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">{s.status}</span>
                      </div>
                      <span className="text-sm font-semibold">{s.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full", s.score >= 85 ? "bg-emerald-500" : s.score >= 75 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {["Mathematics remains the weakest subject.", "Class 8B requires intervention.", "Academic performance improved by 3% this term."].map((item) => (
                <Card key={item} className="p-3 sm:p-4"><p className="text-xs text-muted-foreground">{item}</p></Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ═══ PARENT ENGAGEMENT ═══ */}
        <TabsContent value="parent">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {parentMetrics.map((m) => (
                <Card key={m.label} className="p-3 sm:p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">{m.label}</div>
                  <div className="text-lg font-semibold">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m.hint}</div>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {["Grade 8 parent engagement is lowest.", "PTM participation improved by 9%.", "WhatsApp communication drives the highest engagement."].map((item) => (
                <Card key={item} className="p-3 sm:p-4"><p className="text-xs text-muted-foreground">{item}</p></Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ═══ SCHOLARII ADOPTION ═══ */}
        <TabsContent value="adoption">
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {adoptionMetrics.map((m) => (
                <Card key={m.label} className="p-3 sm:p-4">
                  <div className="text-[11px] text-muted-foreground mb-1">{m.label}</div>
                  <div className="text-lg font-semibold">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m.hint}</div>
                </Card>
              ))}
            </div>
            <Card className="p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold mb-3">Usage Trends</h4>
              <div className="space-y-2">
                {adoptionGrowth.map((item) => (
                  <div key={item.label} className="rounded-xl border border-border/60 p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.value.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-600" style={{ width: `${Math.min(100, Math.round(item.value / 300))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {["Teacher AI usage increased by 18%.", "Over 1,200 hours saved through automation.", "Staff adoption remains above 90%."].map((item) => (
                <Card key={item} className="p-3 sm:p-4"><p className="text-xs text-muted-foreground">{item}</p></Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ═══ AI INSIGHTS ═══ */}
        <TabsContent value="insights">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">AI Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {analyticsInsights.map((insight) => (
                <Card key={insight.title} className="p-3 sm:p-4">
                  <p className="text-xs font-medium">{insight.title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{insight.detail}</p>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
