import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Activity, TrendingUp, TrendingDown, Trophy, Target, Star,
  Award, BookOpen, Clock, Sparkles, ArrowUpRight, CheckCircle2,
  Zap, Brain, Target as TargetIcon, Medal, PieChart,
  BarChart3 as BarChart3Icon,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { EXAMS, CLASS_PERFORMANCE, SUBJECT_COLORS } from "@/lib/scholarii/exams-mock-data";
import { KpiCard } from "@/components/scholarii/KpiCard";

export const Route = createFileRoute("/app/performance")({ component: PerformancePage });

const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Computer Science"];

const conductedExams = EXAMS.filter((e) => e.result);
const latestExam = conductedExams[conductedExams.length - 1];
const latestResult = latestExam?.result;

const overallScore = latestResult?.percentage ?? 0;
const prevScore = conductedExams.length > 1 ? conductedExams[conductedExams.length - 2].result!.percentage : 0;
const scoreChange = overallScore - prevScore;
const overallRank = latestResult?.rank ?? 0;
const totalStudents = latestResult?.classStats.totalStudents ?? 42;
const rankPercentile = Math.round(((totalStudents - overallRank) / totalStudents) * 100);
const attendance = 92;

const journeyData = conductedExams.map((e) => ({
  exam: e.name.replace("Exam", "").replace("Test", "Test ").trim(),
  percentage: e.result!.percentage,
  average: Math.round(e.result!.subjects.reduce((a, s) => a + s.classAverage, 0) / e.result!.subjects.length),
}));

const subjectPerformance = SUBJECTS.map((s) => {
  const scores = conductedExams.map((e) => {
    const sub = e.result!.subjects.find((rs) => rs.subject === s);
    return sub?.percentage ?? 0;
  });
  const current = scores[scores.length - 1] ?? 0;
  const prev = scores.length > 1 ? scores[scores.length - 2] : current;
  return { subject: s, current, prev, change: current - prev, color: SUBJECT_COLORS[s] };
});

const sortedByPerformance = [...subjectPerformance].sort((a, b) => b.current - a.current);
const strengths = sortedByPerformance.slice(0, 3);
const focusAreas = sortedByPerformance.slice(-2).reverse();

const radarData = SUBJECTS.map((s) => {
  const sub = latestResult?.subjects.find((rs) => rs.subject === s);
  return { subject: s.replace("Social Studies", "Social Sci.").replace("Computer Science", "Comp. Sci."), score: sub?.percentage ?? 0, average: sub?.classAverage ?? 0 };
});

const examComparison = conductedExams.map((e) => ({
  exam: e.name.replace("Exam", "").replace("Test", "Test ").trim(),
  you: e.result!.percentage,
  classAvg: Math.round(e.result!.subjects.reduce((a, s) => a + s.classAverage, 0) / e.result!.subjects.length),
}));

const classComparison = SUBJECTS.map((s) => {
  const sub = latestResult?.subjects.find((rs) => rs.subject === s);
  const perf = CLASS_PERFORMANCE.find((p) => p.examId === latestExam?.id);
  const subjectPerf = perf?.subjects.find((ps) => ps.name === s);
  const topScore = subjectPerf?.toppers[0]?.marks ?? 0;
  return { subject: s, you: sub?.percentage ?? 0, average: sub?.classAverage ?? 0, top: topScore, color: SUBJECT_COLORS[s] };
});

const achievements = [
  { label: "90%+ Attendance", icon: <Clock className="h-5 w-5" />, color: "from-emerald-500 to-green-600", earned: attendance >= 90 },
  { label: "Science Star", icon: <Trophy className="h-5 w-5" />, color: "from-amber-500 to-orange-600", earned: (latestResult?.subjects.find((s) => s.subject === "Science")?.percentage ?? 0) >= 90 },
  { label: "Most Improved", icon: <TrendingUp className="h-5 w-5" />, color: "from-blue-500 to-indigo-600", earned: scoreChange >= 5 },
  { label: "Assignment Champion", icon: <Award className="h-5 w-5" />, color: "from-violet-500 to-purple-600", earned: true },
  { label: "Top 10 Rank", icon: <Medal className="h-5 w-5" />, color: "from-rose-500 to-pink-600", earned: overallRank <= 10 },
  { label: "Consistent Performer", icon: <Zap className="h-5 w-5" />, color: "from-cyan-500 to-teal-600", earned: conductedExams.every((e) => e.result!.percentage >= 75) },
];

const aiInsights = [
  `Your academic performance improved by ${scoreChange}% since ${conductedExams[0]?.name.replace("Exam", "").trim()}.`,
  `${strengths[0]?.subject} is currently your strongest subject at ${strengths[0]?.current}%.`,
  `Mathematics improved significantly after Mid-Sem, showing consistent growth.`,
  `Attendance consistency (${attendance}%) is positively impacting your results.`,
  `Focus on ${focusAreas[0]?.subject} before the upcoming examination.`,
];

const TAB_LIST = [
  { id: "journey", label: "Academic Journey", icon: <TrendingUp className="h-4 w-4" /> },
  { id: "subjects", label: "Subject Performance", icon: <BookOpen className="h-4 w-4" /> },
  { id: "attendance", label: "Attendance Impact", icon: <Clock className="h-4 w-4" /> },
  { id: "exams", label: "Exam Comparison", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "class", label: "Class Comparison", icon: <Users className="h-4 w-4" /> },
  { id: "ai", label: "AI Insights", icon: <Sparkles className="h-4 w-4" /> },
  { id: "achievements", label: "Achievements", icon: <Award className="h-4 w-4" /> },
] as const;

type TabId = typeof TAB_LIST[number]["id"];

function PerformancePage() {
  const [activeTab, setActiveTab] = useState<TabId>("journey");

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="mb-4 space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Performance</h1>
            <p className="text-sm text-muted-foreground">Track your academic growth, strengths, attendance, and progress over time.</p>
          </div>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 auto-rows-fr content-start">
        <KpiCard
          icon={BarChart3Icon}
          label="Overall Score"
          value={`${overallScore}%`}
          tone="info"
          trend={scoreChange >= 0 ? "up" : "down"}
          trendLabel={scoreChange >= 0 ? `+${scoreChange}% from previous` : `${scoreChange}% from previous`}
        />
        <KpiCard
          icon={Trophy}
          label="Class Rank"
          value={`${overallRank} / ${totalStudents}`}
          tone="warning"
          trend="up"
          trendLabel={`Top ${rankPercentile}%`}
        />
        <KpiCard
          icon={Clock}
          label="Attendance"
          value={`${attendance}%`}
          tone="success"
          trend={attendance >= 90 ? "up" : "down"}
          trendLabel={attendance >= 90 ? "Excellent" : "Good"}
        />
        <KpiCard
          icon={TrendingUp}
          label="Academic Growth"
          value={`+${scoreChange}%`}
          tone="info"
          trend={scoreChange >= 0 ? "up" : "down"}
          trendLabel={`Since ${conductedExams[0]?.name.replace("Exam", "").trim()}`}
        />
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 -mx-6 bg-background/80 px-6 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex gap-1 overflow-x-auto border-b border-border/40 py-2 scrollbar-none">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-5 space-y-6">
        {activeTab === "journey" && <JourneyTab />}
        {activeTab === "subjects" && <SubjectsTab />}
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "exams" && <ExamsTab />}
        {activeTab === "class" && <ClassTab />}
        {activeTab === "ai" && <AiTab />}
        {activeTab === "achievements" && <AchievementsTab />}
      </div>
    </div>
  );
}

function JourneyTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-semibold text-foreground">Academic Journey</p>
          </div>
          <ChartContainer config={{}} className="h-[280px] w-full">
            <LineChart data={journeyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="exam" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="percentage" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6, fill: "#8b5cf6" }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="average" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> Your Score</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-400" /> Class Average</span>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">First Exam</p>
            <p className="text-3xl font-bold text-foreground">{journeyData[0]?.percentage ?? 0}%</p>
            <p className="text-xs text-muted-foreground">{journeyData[0]?.exam}</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Latest Exam</p>
            <p className="text-3xl font-bold text-violet-400">{journeyData[journeyData.length - 1]?.percentage ?? 0}%</p>
            <p className="text-xs text-muted-foreground">{journeyData[journeyData.length - 1]?.exam}</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Improvement</p>
            <p className="text-3xl font-bold text-emerald-400">+{scoreChange}%</p>
            <p className="text-xs text-muted-foreground">Across {conductedExams.length} exams</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SubjectsTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-400" />
            <p className="text-sm font-semibold text-foreground">Subject Performance</p>
          </div>
          <div className="space-y-4">
            {subjectPerformance.map((s) => (
              <div key={s.subject} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{s.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: s.color }}>{s.current}%</span>
                    {s.change !== 0 && (
                      <span className={`flex items-center gap-0.5 text-[10px] font-medium ${s.change > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {s.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {s.change > 0 ? "+" : ""}{s.change}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-3 w-full rounded-full bg-muted/50">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.current}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-semibold text-foreground">Strengths</p>
            </div>
            <div className="space-y-3">
              {strengths.map((s) => (
                <div key={s.subject} className="flex items-center gap-3 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-400"><Trophy className="h-4 w-4" /></div>
                  <div className="flex-1"><p className="text-sm font-medium text-foreground">{s.subject}</p><p className="text-xs text-muted-foreground">Strong performance</p></div>
                  <span className="text-lg font-bold" style={{ color: s.color }}>{s.current}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-400" />
              <p className="text-sm font-semibold text-foreground">Focus Areas</p>
            </div>
            <div className="space-y-3">
              {focusAreas.map((s) => (
                <div key={s.subject} className="flex items-center gap-3 rounded-xl bg-blue-500/5 border border-blue-500/10 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-400"><Target className="h-4 w-4" /></div>
                  <div className="flex-1"><p className="text-sm font-medium text-foreground">{s.subject}</p><p className="text-xs text-muted-foreground">Needs improvement</p></div>
                  <span className="text-lg font-bold" style={{ color: s.color }}>{s.current}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-semibold text-foreground">Academic Profile</p>
          </div>
          <div className="flex justify-center">
            <ChartContainer config={{}} className="h-[300px] w-full max-w-[400px]">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                <Radar name="You" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Class Avg" dataKey="average" stroke="#6b7280" fill="#6b7280" fillOpacity={0.05} strokeWidth={1} strokeDasharray="4 4" />
                <Tooltip />
              </RadarChart>
            </ChartContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> Your Score</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-400" /> Class Average</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AttendanceTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-semibold text-foreground">Attendance Impact</p>
          </div>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-500/30 bg-emerald-500/10">
                    <span className="text-2xl font-bold text-emerald-400">{attendance}%</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Attendance</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-4 border-violet-500/30 bg-violet-500/10">
                    <span className="text-2xl font-bold text-violet-400">{overallScore}%</span>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Performance</p>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Students with <span className="font-semibold text-emerald-400">90%+ attendance</span> typically perform better in exams.
                </p>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Correlation Insight</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Consistent attendance correlates with higher scores</p>
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Your attendance ({attendance}%) is above the 90% threshold</p>
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Your performance trend is positive and consistent</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExamsTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-400" />
            <p className="text-sm font-semibold text-foreground">Exam Comparison</p>
          </div>
          <ChartContainer config={{}} className="h-[280px] w-full">
            <BarChart data={examComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="exam" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="you" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="classAvg" fill="#6b7280" radius={[4, 4, 0, 0]} opacity={0.5} />
            </BarChart>
          </ChartContainer>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> You</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-400" /> Class Average</span>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {conductedExams.map((e, i) => {
          const prev = i > 0 ? conductedExams[i - 1].result!.percentage : 0;
          const change = e.result!.percentage - prev;
          return (
            <Card key={e.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{e.name.replace("Exam", "").trim()}</p>
                <p className="text-3xl font-bold text-foreground">{e.result!.percentage}%</p>
                {i > 0 && (
                  <p className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {change >= 0 ? "+" : ""}{change}% from previous
                  </p>
                )}
                {i === 0 && <p className="text-xs text-muted-foreground">Baseline exam</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ClassTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-semibold text-foreground">Class Comparison</p>
          </div>
          <ChartContainer config={{}} className="h-[280px] w-full">
            <BarChart data={classComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="subject" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="you" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="average" fill="#6b7280" radius={[4, 4, 0, 0]} opacity={0.5} />
              <Bar dataKey="top" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.4} />
            </BarChart>
          </ChartContainer>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> You</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-400" /> Class Average</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Top Performer</span>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {classComparison.map((s) => (
          <Card key={s.subject} className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ background: s.color }} />
                <p className="text-sm font-semibold text-foreground">{s.subject}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">You</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.you}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Class Avg</span>
                  <span className="font-medium text-foreground">{s.average}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Top</span>
                  <span className="font-medium text-amber-400">{s.top}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {s.you >= s.average ? (
                  <span className="flex items-center gap-1 text-emerald-400"><ArrowUpRight className="h-3 w-3" /> +{s.you - s.average}% above avg</span>
                ) : (
                  <span className="flex items-center gap-1 text-red-400"><TrendingDown className="h-3 w-3" /> {s.you - s.average}% below avg</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AiTab() {
  return (
    <div className="space-y-6">
      <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-600/5 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-semibold text-foreground">AI Performance Insights</p>
          </div>
          <div className="space-y-2.5">
            {aiInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl bg-background/50 p-3">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                <p className="text-sm text-muted-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-400" />
              <p className="text-sm font-semibold text-foreground">Strength Analysis</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> {strengths[0]?.subject} leads with {strengths[0]?.current}%</p>
              <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Consistent performance above class average in most subjects</p>
              <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> Strong foundation in Science and English</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-semibold text-foreground">Improvement Areas</p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2"><TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" /> {focusAreas[0]?.subject} needs focused practice</p>
              <p className="flex items-start gap-2"><TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" /> Consider additional revision for weaker chapters</p>
              <p className="flex items-start gap-2"><TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" /> Regular practice can boost overall percentage by 5-8%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AchievementsTab() {
  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-semibold text-foreground">Achievements</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                  a.earned ? "border-border/40 bg-card/50 shadow-md" : "border-border/20 bg-muted/20 opacity-40"
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} ${a.earned ? "shadow-lg" : "grayscale"}`}>
                  <span className={a.earned ? "text-white" : "text-white/50"}>{a.icon}</span>
                </div>
                <p className={`text-xs font-medium ${a.earned ? "text-foreground" : "text-muted-foreground"}`}>{a.label}</p>
                {a.earned && <Badge variant="outline" className="text-[9px]">Earned</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HeroMetric({ icon, label, value, sub, positive, accent }: {
  icon: React.ReactNode; label: string; value: string; sub: string; positive: boolean; accent: string;
}) {
  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-xl`} />
        <div className="relative space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${accent} shadow-md`}>{icon}</div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          <p className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {sub}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function BarChart3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
