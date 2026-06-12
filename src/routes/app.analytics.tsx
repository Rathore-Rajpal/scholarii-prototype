import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  Briefcase,
  DollarSign,
  Download,
  GraduationCap,
  LineChart,
  FileText,
  MessageSquareMore,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

type TimeRange = "Last 7 Days" | "Last 30 Days" | "Current Term" | "Current Academic Year";
type TrendDirection = "up" | "down" | "stable";

type KpiCard = {
  label: string;
  value: string;
  change: string;
  direction: TrendDirection;
  hint: string;
  icon: typeof Users;
  tone: string;
};

type MetricCard = {
  label: string;
  value: string;
  hint: string;
};

type InsightCard = {
  title: string;
  detail: string;
};

const attendanceTrend = [
  { month: "Apr", value: 90 },
  { month: "May", value: 91 },
  { month: "Jun", value: 89 },
  { month: "Jul", value: 92 },
  { month: "Aug", value: 93 },
  { month: "Sep", value: 94 },
  { month: "Oct", value: 95 },
];

const attendanceByDay = [
  { day: "Mon", value: 88 },
  { day: "Tue", value: 91 },
  { day: "Wed", value: 93 },
  { day: "Thu", value: 94 },
  { day: "Fri", value: 92 },
  { day: "Sat", value: 89 },
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

const analyticsInsights: InsightCard[] = [
  { title: "Attendance improved by 2% this month.", detail: "Monday remains the weakest day, so late-week intervention is paying off." },
  { title: "Grade 8 continues to have the highest fee default rate.", detail: "The pattern is stable, which makes targeted reminders more effective." },
  { title: "Mathematics remains the weakest subject.", detail: "The gap is narrow, but it still needs focused academic support." },
  { title: "Parent engagement increased by 8%.", detail: "PTM reminders and WhatsApp communication are driving the lift." },
  { title: "Staff workload imbalance detected in the Science department.", detail: "Five teachers currently have limited free periods." },
  { title: "School compliance readiness remains above 90%.", detail: "This supports a strong operational outlook across the year." },
];

const timeRanges: TimeRange[] = ["Last 7 Days", "Last 30 Days", "Current Term", "Current Academic Year"];

function trendMeta(direction: TrendDirection) {
  if (direction === "up") {
    return {
      icon: <ArrowUpRight className="size-3.5" />,
      className: "text-emerald-700 bg-emerald-50 border-emerald-200",
    };
  }
  if (direction === "down") {
    return {
      icon: <ArrowDownRight className="size-3.5" />,
      className: "text-rose-700 bg-rose-50 border-rose-200",
    };
  }
  return {
    icon: <LineChart className="size-3.5" />,
    className: "text-slate-700 bg-slate-50 border-slate-200",
  };
}

function miniTone(score: number) {
  if (score >= 85) return "bg-emerald-50 border-emerald-200 text-emerald-700";
  if (score >= 75) return "bg-amber-50 border-amber-200 text-amber-700";
  return "bg-rose-50 border-rose-200 text-rose-700";
}

function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 30 Days");
  const [activeTab, setActiveTab] = useState("attendance");

  const kpis: KpiCard[] = [
    { label: "Attendance Health", value: "94%", change: "+2% vs last month", direction: "up", hint: "Attendance is steady across most grades.", icon: Users, tone: "from-emerald-500 to-teal-500" },
    { label: "Academic Health", value: "84%", change: "+3% vs last term", direction: "up", hint: "Performance is improving, but Maths needs support.", icon: GraduationCap, tone: "from-sky-500 to-indigo-500" },
    { label: "Finance Health", value: "87%", change: "+4% vs last month", direction: "up", hint: "Collections are improving, especially with reminders.", icon: DollarSign, tone: "from-amber-500 to-orange-500" },
    { label: "Parent Engagement", value: "78%", change: "+8% vs last month", direction: "up", hint: "PTM reminders continue to drive the best response.", icon: MessageSquareMore, tone: "from-fuchsia-500 to-pink-500" },
    { label: "Staff Health", value: "91%", change: "+1% vs last month", direction: "up", hint: "Workload balance is mostly healthy with a few exceptions.", icon: Briefcase, tone: "from-violet-500 to-purple-500" },
    { label: "Scholarii Adoption", value: "86%", change: "+6% vs last month", direction: "up", hint: "Usage is growing across teachers and staff.", icon: Sparkles, tone: "from-cyan-500 to-sky-500" },
  ];

  const summaryByRange: Record<TimeRange, string> = {
    "Last 7 Days": "Attendance and academic performance continue to improve over the last 7 days, while fee collection remains stable. Parent engagement has also increased, and overall operations remain healthy.",
    "Last 30 Days": "Attendance and academic performance continue to improve, while fee collection remains stable. Parent engagement increased this month, and overall school operations remain healthy.",
    "Current Term": "This term shows steady gains across attendance, academics, and parent engagement. Fee collection is trending upward and staff health remains strong.",
    "Current Academic Year": "Year-to-date performance is healthy across the school, with strong attendance, improving academic outcomes, and rising adoption of Scholarii across departments.",
  };

  const attendanceMetrics: MetricCard[] = [
    { label: "Average Attendance", value: "94%", hint: "School-wide average" },
    { label: "Best Performing Class", value: "10A", hint: "98% attendance" },
    { label: "Lowest Attendance Class", value: "8B", hint: "74% attendance" },
    { label: "Students Below Threshold", value: "34", hint: "Below 75%" },
  ];

  const academicMetrics: MetricCard[] = [
    { label: "School Average", value: "78%", hint: "Across all subjects" },
    { label: "Top Class", value: "10A", hint: "89% average" },
    { label: "Weakest Class", value: "8B", hint: "71% average" },
    { label: "Students At Risk", value: "21", hint: "Need support" },
  ];

  const parentMetrics: MetricCard[] = [
    { label: "Parent Engagement", value: "78%", hint: "Healthy" },
    { label: "Circular Read Rate", value: "84%", hint: "Strong" },
    { label: "PTM Participation", value: "76%", hint: "Improving" },
    { label: "Active Parents", value: "92%", hint: "Connected" },
  ];

  const adoptionMetrics: MetricCard[] = [
    { label: "Teacher AI Queries", value: "12,458", hint: "This month" },
    { label: "Student AI Queries", value: "29,840", hint: "This month" },
    { label: "Hours Saved", value: "1,284", hint: "Through automation" },
    { label: "Documents in School Brain", value: "4,820", hint: "Indexed knowledge" },
    { label: "Staff Adoption Rate", value: "93%", hint: "Very strong" },
    { label: "Automations Executed", value: "860", hint: "Completed workflows" },
  ];

  const selectedSummary = summaryByRange[timeRange];

  const attendanceChart = useMemo(
    () =>
      attendanceTrend.map((point, index) => ({
        ...point,
        value: point.value + (timeRange === "Last 7 Days" ? index % 2 : timeRange === "Current Academic Year" ? 1 : 0),
      })),
    [timeRange]
  );

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="School Intelligence Center for the principal - trends, explanations, comparisons, and actionable insights."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="bg-brand-gradient text-white border-0">
              <Download className="mr-2 size-4" />
              Export Analytics Report
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="mr-2 size-4" />
              Generate Executive Summary
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <Card className="p-4 border-border/60">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Global Filters</p>
              <p className="text-sm text-muted-foreground">Use a simple time range to review the selected period.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline">{timeRange}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border/60 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <BrainCircuit className="size-3.5" />
                School Intelligence Summary
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{selectedSummary}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Why this page exists</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Dashboard tells the principal what is happening. Analytics explains why it is happening and where intervention is needed.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const trend = trendMeta(kpi.direction);
            return (
              <Card key={kpi.label} className="p-4 border-border/60">
                <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.tone} text-white mb-3`}>
                  <Icon className="size-5" />
                </div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <div className="mt-2 text-3xl font-semibold tracking-tight">{kpi.value}</div>
                <div className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${trend.className}`}>
                  {trend.icon}
                  {kpi.change}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{kpi.hint}</p>
              </Card>
            );
          })}
        </div>

        <Card className="overflow-hidden backdrop-blur bg-card/50 border-border/50">
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-emerald-200 p-1 rounded-full">
                <TabsTrigger value="attendance" className="rounded-full data-[state=active]:border data-[state=active]:border-emerald-300 data-[state=active]:bg-white data-[state=active]:text-emerald-600 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <BarChart3 className="mr-2 size-4" />
                  Attendance Analytics
                </TabsTrigger>
                <TabsTrigger value="academic" className="rounded-full data-[state=active]:border data-[state=active]:border-emerald-300 data-[state=active]:bg-white data-[state=active]:text-emerald-600 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <GraduationCap className="mr-2 size-4" />
                  Academic Analytics
                </TabsTrigger>
                <TabsTrigger value="parent" className="rounded-full data-[state=active]:border data-[state=active]:border-emerald-300 data-[state=active]:bg-white data-[state=active]:text-emerald-600 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <Users className="mr-2 size-4" />
                  Parent Engagement Analytics
                </TabsTrigger>
                <TabsTrigger value="adoption" className="rounded-full data-[state=active]:border data-[state=active]:border-emerald-300 data-[state=active]:bg-white data-[state=active]:text-emerald-600 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="mr-2 size-4" />
                  Scholarii Adoption Analytics
                </TabsTrigger>
                <TabsTrigger value="insights" className="rounded-full data-[state=active]:border data-[state=active]:border-emerald-300 data-[state=active]:bg-white data-[state=active]:text-emerald-600 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <BrainCircuit className="mr-2 size-4" />
                  AI Insights
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="p-5">
            {activeTab === "attendance" && (
              <Card className="p-5 border-border/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">Attendance Analytics</h3>
                      <p className="text-sm text-muted-foreground">Understand attendance trends and where intervention is needed.</p>
                    </div>
                    <Badge variant="outline">Trend focus</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    {attendanceMetrics.map((metric) => (
                      <Card key={metric.label} className="p-4 border-border/60">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
                        <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-5 rounded-2xl border border-border bg-background p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium">Attendance trend</p>
                      <Badge variant="outline">One chart only</Badge>
                    </div>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceChart} margin={{ top: 10, right: 12, left: -8, bottom: 20 }}>
                          <defs>
                            <linearGradient id="attendanceFill" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="month" stroke="var(--muted-foreground)" tickMargin={12} interval={0} />
                          <YAxis domain={[85, 100]} stroke="var(--muted-foreground)" width={34} />
                          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                          <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#attendanceFill)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-medium">Attendance by weekday</p>
                        <Badge variant="outline">Compact view</Badge>
                      </div>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={attendanceByDay} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                            <XAxis dataKey="day" stroke="var(--muted-foreground)" tickMargin={10} interval={0} />
                            <YAxis domain={[80, 100]} stroke="var(--muted-foreground)" width={30} />
                            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                            <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      "Grade 9 attendance declined by 4% this month.",
                      "Monday attendance remains the lowest across the school.",
                      "34 students remain below the attendance threshold.",
                    ].map((item) => (
                      <Card key={item} className="p-4 border-border/60 bg-slate-50/60">
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </Card>
                    ))}
                  </div>
                </Card>
            )}

            {activeTab === "academic" && (
              <Card className="p-5 border-border/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">Academic Analytics</h3>
                      <p className="text-sm text-muted-foreground">Understand academic performance and subject pressure points.</p>
                    </div>
                    <Badge variant="outline">Intervention ready</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {academicMetrics.map((metric) => (
                      <Card key={metric.label} className="p-4 border-border/60">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
                        <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-5 space-y-3">
                    <p className="text-sm font-medium">Subject Performance Summary</p>
                    <div className="grid grid-cols-1 gap-3">
                      {subjectSummary.map((subject) => (
                        <Card key={subject.subject} className="p-4 border-border/60">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium">{subject.subject}</p>
                              <p className="text-xs text-muted-foreground">{subject.status}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold">{subject.score}%</p>
                              <p className="text-xs text-muted-foreground">Average</p>
                            </div>
                          </div>
                          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                subject.score >= 85 ? "bg-emerald-500" : subject.score >= 75 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${subject.score}%` }}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      "Mathematics remains the weakest subject.",
                      "Class 8B requires intervention.",
                      "Academic performance improved by 3% this term.",
                    ].map((item) => (
                      <Card key={item} className="p-4 border-border/60 bg-slate-50/60">
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </Card>
                    ))}
                  </div>
                </Card>
            )}

            {activeTab === "parent" && (
              <Card className="p-5 border-border/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">Parent Engagement Analytics</h3>
                      <p className="text-sm text-muted-foreground">Understand communication effectiveness and parent response patterns.</p>
                    </div>
                    <Badge variant="outline">Communication</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parentMetrics.map((metric) => (
                      <Card key={metric.label} className="p-4 border-border/60">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
                        <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      "Grade 8 parent engagement is lowest.",
                      "PTM participation improved by 9%.",
                      "WhatsApp communication drives the highest engagement.",
                    ].map((item) => (
                      <Card key={item} className="p-4 border-border/60 bg-slate-50/60">
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </Card>
                    ))}
                  </div>
                </Card>
            )}

            {activeTab === "adoption" && (
              <Card className="p-5 border-border/60">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">Scholarii Adoption Analytics</h3>
                      <p className="text-sm text-muted-foreground">The school's usage of Scholarii across teachers, students, and staff.</p>
                    </div>
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">86 / 100</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {adoptionMetrics.map((metric) => (
                      <Card key={metric.label} className={`p-4 border ${miniTone(metric.label === "Hours Saved" ? 95 : metric.label === "Staff Adoption Rate" ? 93 : 88)}`}>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
                        <p className="mt-1 text-xs text-muted-foreground">{metric.hint}</p>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-5 space-y-3">
                    <p className="text-sm font-medium">Usage Trends</p>
                    <div className="space-y-2">
                      {adoptionGrowth.map((item) => (
                        <div key={item.label} className="rounded-xl border border-border p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.value.toLocaleString("en-IN")}</p>
                          </div>
                          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-600"
                              style={{ width: `${Math.min(100, Math.round(item.value / 300))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        "Teacher AI usage increased by 18%.",
                        "Over 1,200 hours saved through automation.",
                        "Staff adoption remains above 90%.",
                      ].map((item) => (
                        <Card key={item} className="p-4 border-border/60 bg-slate-50/60">
                          <p className="text-sm text-muted-foreground">{item}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>
            )}

            {activeTab === "insights" && (
              <Card className="p-5 border-border/60">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">AI Insights</h3>
                    <p className="text-sm text-muted-foreground">Concise intelligent observations across departments.</p>
                  </div>
                  <Badge variant="outline">7 insights</Badge>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {analyticsInsights.map((insight) => (
                    <Card key={insight.title} className="p-4 border-border/60 bg-slate-50/60">
                      <p className="font-medium">{insight.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{insight.detail}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
