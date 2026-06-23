import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Calendar, Clock, Users, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, FileText, ChevronDown, ChevronUp, Sparkles, Info,
  Trophy, Target, GraduationCap, BarChart3, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EXAMS, TIMETABLES, OVERALL_STATS, SUBJECT_PERFORMANCE,
  CLASS_PERFORMANCE, TOP_STUDENTS, AT_RISK_STUDENTS,
  AI_INSIGHTS, RECOMMENDED_ACTIONS, ALL_CLASSES,
} from "@/lib/scholarii/principal-academics-mock-data";
import type { ExamStatus } from "@/lib/scholarii/principal-academics-mock-data";

export const Route = createFileRoute("/app/academics")({
  component: () => (
    <RoleGuard allowedRoles={["principal"]}>
      <AcademicsPage />
    </RoleGuard>
  ),
});

const STATUS_META: Record<ExamStatus, { label: string; color: string; bg: string; iconBg: string; iconColor: string; lineColor: string }> = {
  conducted: { label: "Conducted", color: "text-teal-700", bg: "bg-teal-500/10", iconBg: "bg-teal-500", iconColor: "text-white", lineColor: "bg-teal-300" },
  ongoing: { label: "Ongoing", color: "text-amber-700", bg: "bg-amber-500/10", iconBg: "bg-amber-500", iconColor: "text-white", lineColor: "bg-gray-200" },
  upcoming: { label: "Upcoming", color: "text-blue-700", bg: "bg-blue-500/10", iconBg: "bg-blue-400", iconColor: "text-white", lineColor: "bg-gray-200" },
};

const CHART_COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

function AcademicsPage() {
  const [selectedExamId, setSelectedExamId] = useState("unit1");
  const [selectedClass, setSelectedClass] = useState("8A");
  const [activeTab, setActiveTab] = useState("overview");

  const selectedExam = EXAMS.find((e) => e.id === selectedExamId);
  const hasResults = selectedExam?.status === "conducted";
  const stats = hasResults ? OVERALL_STATS[selectedExamId] : null;
  const subjectPerf = hasResults ? SUBJECT_PERFORMANCE[selectedExamId] : null;
  const classPerf = hasResults ? CLASS_PERFORMANCE[selectedExamId] : null;
  const selectedClassPerf = classPerf?.find((c) => c.className === selectedClass);
  const topStudents = hasResults ? TOP_STUDENTS[selectedExamId]?.[selectedClass] || [] : [];
  const atRiskStudents = hasResults ? AT_RISK_STUDENTS[selectedExamId]?.[selectedClass] || [] : [];

  return (
    <div>
      <PageHeader title="Academics" subtitle="Exams & Results Command Center — school-wide performance overview." />

      {/* Academic Year Progress Timeline */}
      <Card className="p-4 sm:p-6 mb-6">
        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-6">Academic Year Progress</h3>
        <div className="overflow-x-auto">
        <div className="flex items-start justify-between relative min-w-[600px]">
          {EXAMS.map((exam, idx) => {
            const meta = STATUS_META[exam.status];
            const isActive = selectedExamId === exam.id;
            const isLast = idx === EXAMS.length - 1;
            return (
              <button
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className="flex flex-col items-center text-center group relative z-10"
              >
                {/* Connector line */}
                {!isLast && (
                  <div className={cn("absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-[2px]", meta.lineColor)} />
                )}

                {/* Icon circle */}
                <div className={cn(
                  "relative size-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110",
                  isActive ? "ring-2 ring-offset-2 ring-violet-400" : "",
                  meta.iconBg
                )}>
                  {exam.status === "conducted" ? (
                    <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <div className="size-3 rounded-full bg-white/80" />
                  )}
                </div>

                {/* Label */}
                <span className={cn("text-xs font-semibold mb-1.5 whitespace-nowrap", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {exam.name}
                </span>

                {/* Status badge */}
                <Badge className={cn("border-0 text-[9px] mb-1.5", meta.bg, meta.color)}>
                  {meta.label}
                </Badge>

                {/* Date range */}
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{exam.dateRange}</span>
            </button>
          );
          })}
        </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="p-3 mb-6 overflow-x-auto scrollbar-hide">
          <TabsList className="h-9 min-w-max">
            <TabsTrigger value="overview" className="text-xs gap-1.5"><BarChart3 className="size-3" /> Overview</TabsTrigger>
            <TabsTrigger value="timetable" className="text-xs gap-1.5"><Calendar className="size-3" /> Timetable</TabsTrigger>
            <TabsTrigger value="results" className="text-xs gap-1.5"><Trophy className="size-3" /> Results</TabsTrigger>
            <TabsTrigger value="class-insights" className="text-xs gap-1.5"><GraduationCap className="size-3" /> Class Insights</TabsTrigger>
            <TabsTrigger value="ai" className="text-xs gap-1.5"><Sparkles className="size-3" /> AI Analysis</TabsTrigger>
          </TabsList>
        </Card>

        {/* ═══ OVERVIEW TAB ═══ */}
        <TabsContent value="overview">
          {hasResults && stats ? (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-violet-500/10 grid place-items-center"><TrendingUp className="size-4 text-violet-500" /></div>
                    <div><div className="text-[10px] text-muted-foreground">Average Marks</div><div className="text-lg font-semibold">{stats.average}%</div></div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-sky-500/10 grid place-items-center"><Users className="size-4 text-sky-500" /></div>
                    <div><div className="text-[10px] text-muted-foreground">Total Students</div><div className="text-lg font-semibold">{stats.totalStudents}</div></div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-emerald-500/10 grid place-items-center"><CheckCircle2 className="size-4 text-emerald-500" /></div>
                    <div><div className="text-[10px] text-muted-foreground">Passed ({stats.passRate}%)</div><div className="text-lg font-semibold">{stats.passed}</div></div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-red-500/10 grid place-items-center"><AlertTriangle className="size-4 text-red-500" /></div>
                    <div><div className="text-[10px] text-muted-foreground">Failed ({stats.failRate}%)</div><div className="text-lg font-semibold">{stats.failed}</div></div>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-amber-500/10 grid place-items-center"><Target className="size-4 text-amber-500" /></div>
                    <div><div className="text-[10px] text-muted-foreground">At-Risk</div><div className="text-lg font-semibold">{stats.atRiskRate}%</div></div>
                  </div>
                </Card>
              </div>

              {/* Best Class & Subject + Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <Card className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-emerald-500/10 grid place-items-center"><Trophy className="size-4 text-emerald-500" /></div>
                      <div><div className="text-[10px] text-muted-foreground">Best Class</div><div className="text-lg font-semibold">{stats.bestClass}</div></div>
                    </div>
                  </Card>
                  <Card className="p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-emerald-500/10 grid place-items-center"><GraduationCap className="size-4 text-emerald-500" /></div>
                      <div><div className="text-[10px] text-muted-foreground">Best Subject</div><div className="text-lg font-semibold">{stats.bestSubject}</div></div>
                    </div>
                  </Card>
                </div>

                {/* Subject Chart */}
                <Card className="p-3 sm:p-4">
                  <h4 className="text-xs font-semibold mb-3">Subject-wise Performance</h4>
                  <div className="min-h-[200px] sm:min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectPerf ?? undefined} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="subject" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="average" radius={[3, 3, 0, 0]}>
                          {subjectPerf?.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Class Chart */}
                <Card className="p-3 sm:p-4">
                  <h4 className="text-xs font-semibold mb-3">Class-wise Comparison</h4>
                  <div className="min-h-[200px] sm:min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classPerf ?? undefined} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="className" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="average" radius={[3, 3, 0, 0]}>
                          {classPerf?.map((e, i) => <Cell key={i} fill={e.className === selectedClass ? "#8b5cf6" : "#c4b5fd"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <BarChart3 className="size-10 mx-auto text-muted-foreground mb-3 opacity-40" />
              <p className="text-sm font-medium text-muted-foreground">No results available for {selectedExam?.name}.</p>
              <p className="text-xs text-muted-foreground mt-1">Results will appear once the exam is completed.</p>
            </Card>
          )}
        </TabsContent>

        {/* ═══ TIMETABLE TAB ═══ */}
        <TabsContent value="timetable">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="size-4 text-violet-500" />
              {selectedExam?.name} — Timetable
            </h3>
            {!selectedExam?.timetableReady ? (
              <div className="py-10 text-center">
                <Calendar className="size-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                <p className="text-sm font-medium text-muted-foreground">Final Exam timetable has not been finalized yet.</p>
                <p className="text-xs text-muted-foreground mt-1">The timetable for this exam is being prepared.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left p-2.5 text-[10px] font-medium text-muted-foreground uppercase">Subject</th>
                      <th className="text-left p-2.5 text-[10px] font-medium text-muted-foreground uppercase">Date</th>
                      <th className="text-left p-2.5 text-[10px] font-medium text-muted-foreground uppercase">Time</th>
                      <th className="text-left p-2.5 text-[10px] font-medium text-muted-foreground uppercase">Duration</th>
                      <th className="text-left p-2.5 text-[10px] font-medium text-muted-foreground uppercase">Syllabus Covered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TIMETABLES[selectedExamId]?.map((entry, i) => (
                      <tr key={i} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-2.5 font-medium">{entry.subject}</td>
                        <td className="p-2.5 text-muted-foreground">{new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="p-2.5 text-muted-foreground">{entry.time}</td>
                        <td className="p-2.5 text-muted-foreground">{entry.duration}</td>
                        <td className="p-2.5 text-muted-foreground text-xs">{entry.syllabus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* ═══ RESULTS TAB ═══ */}
        <TabsContent value="results">
          {hasResults && stats ? (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Average Marks</div><div className="text-lg font-semibold">{stats.average}%</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Total Students</div><div className="text-lg font-semibold">{stats.totalStudents}</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Passed</div><div className="text-lg font-semibold text-emerald-600">{stats.passed} ({stats.passRate}%)</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Failed</div><div className="text-lg font-semibold text-red-600">{stats.failed} ({stats.failRate}%)</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">At-Risk</div><div className="text-lg font-semibold text-amber-600">{stats.atRiskRate}%</div></Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-3 sm:p-4">
                  <h4 className="text-xs font-semibold mb-3">Subject-wise Performance</h4>
                  <div className="min-h-[200px] sm:min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectPerf ?? undefined} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="subject" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="average" radius={[3, 3, 0, 0]}>
                          {subjectPerf?.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4">
                  <h4 className="text-xs font-semibold mb-3">Class-wise Comparison</h4>
                  <div className="min-h-[200px] sm:min-h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classPerf ?? undefined} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="className" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="average" radius={[3, 3, 0, 0]}>
                          {classPerf?.map((e, i) => <Cell key={i} fill={e.className === selectedClass ? "#8b5cf6" : "#c4b5fd"} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Trophy className="size-10 mx-auto text-muted-foreground mb-3 opacity-40" />
              <p className="text-sm font-medium text-muted-foreground">No results available for {selectedExam?.name}.</p>
            </Card>
          )}
        </TabsContent>

        {/* ═══ CLASS INSIGHTS TAB ═══ */}
        <TabsContent value="class-insights">
          {hasResults && selectedClassPerf ? (
            <div className="space-y-6">
              {/* Class Selector */}
              <Card className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <h3 className="text-base sm:text-lg font-semibold">Class Wise Results</h3>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full sm:w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ALL_CLASSES.map((cls) => <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Class KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Class Average</div><div className="text-lg font-semibold">{selectedClassPerf.average}%</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Passing %</div><div className="text-lg font-semibold text-emerald-600">{selectedClassPerf.passRate}%</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Failing %</div><div className="text-lg font-semibold text-red-600">{selectedClassPerf.failRate}%</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">At-Risk</div><div className="text-lg font-semibold text-amber-600">{selectedClassPerf.atRisk}</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Passed</div><div className="text-lg font-semibold">{selectedClassPerf.passed}/{selectedClassPerf.totalStudents}</div></Card>
                <Card className="p-3 sm:p-4"><div className="text-[10px] text-muted-foreground mb-1">Failed</div><div className="text-lg font-semibold text-red-600">{selectedClassPerf.failed}</div></Card>
              </div>

              {/* Top & At-Risk */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TopStudentsList students={topStudents} />
                <AtRiskList students={atRiskStudents} />
              </div>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <GraduationCap className="size-10 mx-auto text-muted-foreground mb-3 opacity-40" />
              <p className="text-sm font-medium text-muted-foreground">Select a class with results to view insights.</p>
            </Card>
          )}
        </TabsContent>

        {/* ═══ AI ANALYSIS TAB ═══ */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Sparkles className="size-3.5 text-violet-500" /> AI Insights
              </h4>
              <div className="space-y-2">
                {AI_INSIGHTS.map((insight) => {
                  const iconMap: Record<string, typeof AlertTriangle> = { AlertTriangle, TrendingUp, Info };
                  const Icon = iconMap[insight.icon] || Info;
                  const tones: Record<string, string> = {
                    warning: "bg-amber-500/5 border-amber-200/50",
                    success: "bg-emerald-500/5 border-emerald-200/50",
                    danger: "bg-red-500/5 border-red-200/50",
                    info: "bg-sky-500/5 border-sky-200/50",
                  };
                  const iconColors: Record<string, string> = {
                    warning: "text-amber-500",
                    success: "text-emerald-500",
                    danger: "text-red-500",
                    info: "text-sky-500",
                  };
                  return (
                    <div key={insight.id} className={cn("flex items-start gap-3 rounded-xl border p-3", tones[insight.type])}>
                      <Icon className={cn("size-3.5 shrink-0 mt-0.5", iconColors[insight.type])} />
                      <span className="text-xs break-words">{insight.text}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                {RECOMMENDED_ACTIONS.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5">
                    <div className={cn(
                      "size-6 rounded-lg grid place-items-center shrink-0",
                      action.priority === "high" ? "bg-red-500/10" : action.priority === "medium" ? "bg-amber-500/10" : "bg-sky-500/10"
                    )}>
                      <span className={cn(
                        "text-[10px] font-bold",
                        action.priority === "high" ? "text-red-600" : action.priority === "medium" ? "text-amber-600" : "text-sky-600"
                      )}>
                        {action.priority === "high" ? "!" : action.priority === "medium" ? "•" : "i"}
                      </span>
                    </div>
                    <p className="text-xs flex-1 break-words">{action.text}</p>
                    <Badge variant="outline" className="text-[9px] capitalize">{action.priority}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── SUB COMPONENTS ─── */

function TopStudentsList({ students }: { students: { rank: number; name: string; percentage: number; attendance: number; marks: Record<string, number> }[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (students.length === 0) {
    return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2"><Trophy className="size-4 text-amber-500" /> Top 5 Students</h3>
        <p className="text-xs text-muted-foreground text-center py-6">No data available for this class.</p>
      </Card>
    );
  }

  return (
    <Card className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2"><Trophy className="size-4 text-amber-500" /> Top 5 Students</h3>
      <div className="space-y-2">
        {students.map((s) => (
          <div key={s.rank}>
            <button
              onClick={() => setExpandedId(expandedId === s.rank ? null : s.rank)}
              className="w-full flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 hover:bg-muted/20 transition-colors text-left"
            >
              <span className={cn("size-7 rounded-full grid place-items-center shrink-0 text-xs font-bold",
                s.rank === 1 ? "bg-amber-500/10 text-amber-600" : s.rank === 2 ? "bg-gray-400/10 text-gray-500" : s.rank === 3 ? "bg-orange-500/10 text-orange-600" : "bg-muted/50 text-muted-foreground"
              )}>{s.rank}</span>
              <Avatar className="size-8">
                <AvatarFallback className="bg-violet-500 text-white text-[10px] font-medium">{s.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{s.name}</div>
                <div className="text-[10px] text-muted-foreground">Attendance: {s.attendance}%</div>
              </div>
              <div className="text-sm font-semibold text-emerald-600">{s.percentage}%</div>
              {expandedId === s.rank ? <ChevronUp className="size-3 text-muted-foreground" /> : <ChevronDown className="size-3 text-muted-foreground" />}
            </button>
            {expandedId === s.rank && (
              <div className="mt-1 ml-10 mb-2 rounded-xl bg-muted/20 p-3">
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(s.marks).map(([subject, marks]) => (
                    <div key={subject} className="text-[10px]">
                      <span className="text-muted-foreground">{subject}: </span>
                      <span className="font-semibold">{marks}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function AtRiskList({ students }: { students: { name: string; percentage: number; attendance: number; riskLevel: "high" | "medium" | "low"; marks: Record<string, number> }[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const riskColors = { high: "text-red-600", medium: "text-amber-600", low: "text-sky-600" };
  const riskBg = { high: "bg-red-500/10", medium: "bg-amber-500/10", low: "bg-sky-500/10" };

  if (students.length === 0) {
      return (
      <Card className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="size-4 text-red-500" /> Students Needing Attention</h3>
        <p className="text-xs text-muted-foreground text-center py-6">No at-risk students in this class.</p>
      </Card>
    );
  }

  return (
    <Card className="p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="size-4 text-red-500" /> Students Needing Attention</h3>
      <div className="space-y-2">
        {students.map((s) => (
          <div key={s.name}>
            <button
              onClick={() => setExpandedId(expandedId === s.name ? null : s.name)}
              className="w-full flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 hover:bg-muted/20 transition-colors text-left"
            >
              <Avatar className="size-8">
                <AvatarFallback className={cn("text-[10px] font-medium text-white", s.riskLevel === "high" ? "bg-red-500" : "bg-amber-500")}>
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{s.name}</div>
                <div className="text-[10px] text-muted-foreground">Attendance: {s.attendance}%</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-red-600">{s.percentage}%</div>
                <Badge className={cn("border-0 text-[8px] capitalize", riskBg[s.riskLevel], riskColors[s.riskLevel])}>{s.riskLevel} risk</Badge>
              </div>
              {expandedId === s.name ? <ChevronUp className="size-3 text-muted-foreground" /> : <ChevronDown className="size-3 text-muted-foreground" />}
            </button>
            {expandedId === s.name && (
              <div className="mt-1 ml-10 mb-2 rounded-xl bg-muted/20 p-3">
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(s.marks).map(([subject, marks]) => (
                    <div key={subject} className="text-[10px]">
                      <span className="text-muted-foreground">{subject}: </span>
                      <span className={cn("font-semibold", marks < 35 ? "text-red-600" : marks < 50 ? "text-amber-600" : "text-emerald-600")}>{marks}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
