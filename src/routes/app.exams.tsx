import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Calendar,
  Award,
  Users,
  BarChart3,
  Sparkles,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  EXAMS,
  CLASS_PERFORMANCE,
  SUBJECTS,
  SUBJECT_COLORS,
  STATUS_CONFIG,
} from "@/lib/scholarii/exams-mock-data";
import type { Exam, ExamStatus, ExamTab, ClassPerformance } from "@/lib/scholarii/exams-mock-data";
import { useAuth } from "@/lib/scholarii/auth";
import { PlaceholderPage } from "@/components/scholarii/RoleGuard";

export const Route = createFileRoute("/app/exams")({ component: ExamsPage });

const TAB_LIST: { id: ExamTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "timetable", label: "Timetable", icon: <Calendar className="h-4 w-4" /> },
  { id: "syllabus", label: "Syllabus", icon: <BookOpen className="h-4 w-4" /> },
  { id: "results", label: "Results", icon: <Award className="h-4 w-4" /> },
  { id: "ai", label: "AI Analysis", icon: <Sparkles className="h-4 w-4" /> },
];

function ExamsPage() {
  const { user } = useAuth();
  if (user?.role === "teacher") {
    return (
      <PlaceholderPage
        title="Exams & Results"
        subtitle="Schedule exams and publish results."
        icon={GraduationCap}
      />
    );
  }

  const [selectedExamId, setSelectedExamId] = useState<string>(EXAMS[0].id);
  const [examTab, setExamTab] = useState<ExamTab>("overview");
  const [reportCardOpen, setReportCardOpen] = useState(false);

  const selectedExam = EXAMS.find((e) => e.id === selectedExamId) ?? EXAMS[0];

  return (
    <div className="space-y-6 p-6 pb-20 md:p-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Exams & Results</h1>
            <p className="text-sm text-muted-foreground">
              Track examinations, analyze performance, and gain AI-powered academic insights.
            </p>
          </div>
        </div>
      </div>

      <ExamTimeline
        exams={EXAMS}
        selectedId={selectedExamId}
        onSelect={(e) => {
          setSelectedExamId(e.id);
          setExamTab("overview");
        }}
      />

      <ExamWorkspace
        exam={selectedExam}
        activeTab={examTab}
        onTabChange={setExamTab}
        onViewReportCard={() => setReportCardOpen(true)}
      />

      <Sheet open={reportCardOpen} onOpenChange={setReportCardOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedExam?.result && <ReportCard exam={selectedExam} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ExamTimeline({
  exams,
  selectedId,
  onSelect,
}: {
  exams: Exam[];
  selectedId: string;
  onSelect: (e: Exam) => void;
}) {
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-5 md:p-6">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Academic Year Progress
        </p>
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {exams.map((exam, i) => {
              const st = STATUS_CONFIG[exam.status];
              const isSelected = exam.id === selectedId;
              return (
                <div key={exam.id} className="flex items-center">
                  <button
                    onClick={() => onSelect(exam)}
                    className="group flex flex-col items-center gap-2 transition-transform hover:scale-105"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110"
                          : `${st.bg} ${st.border} border-2 group-hover:shadow-lg`
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <div className={`h-3.5 w-3.5 rounded-full ${st.dot}`} />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-sm font-semibold transition-colors ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}
                      >
                        {exam.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-1 ${st.bg} ${st.color} ${st.border} border text-[10px]`}
                      >
                        {st.label}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">{exam.dateRange}</p>
                    </div>
                  </button>
                  {i < exams.length - 1 && (
                    <div
                      className={`mx-3 h-0.5 w-16 lg:w-24 ${
                        exams.findIndex((e) => e.id === exam.id) <
                        exams.findIndex((e) => e.id === selectedId)
                          ? "bg-primary/40"
                          : exam.status === "conducted"
                            ? "bg-emerald-500/40"
                            : "bg-border/60"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 md:hidden scrollbar-none">
          {exams.map((exam) => {
            const st = STATUS_CONFIG[exam.status];
            const isSelected = exam.id === selectedId;
            return (
              <button
                key={exam.id}
                onClick={() => onSelect(exam)}
                className={`flex min-w-[160px] flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-primary/50 bg-primary/5 shadow-md"
                    : "border-border/40 bg-muted/30 hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : `${st.bg} ${st.border} border-2`
                  }`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <div className={`h-3 w-3 rounded-full ${st.dot}`} />
                  )}
                </div>
                <p
                  className={`text-sm font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}
                >
                  {exam.name}
                </p>
                <Badge
                  variant="outline"
                  className={`${st.bg} ${st.color} ${st.border} border text-[10px]`}
                >
                  {st.label}
                </Badge>
                <p className="text-[11px] text-muted-foreground">{exam.dateRange}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ExamWorkspace({
  exam,
  activeTab,
  onTabChange,
  onViewReportCard,
}: {
  exam: Exam;
  activeTab: ExamTab;
  onTabChange: (t: ExamTab) => void;
  onViewReportCard: () => void;
}) {
  const st = STATUS_CONFIG[exam.status];
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkTabScroll = useCallback(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkTabScroll();
    const el = tabScrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkTabScroll);
    ro.observe(el);
    el.addEventListener("scroll", checkTabScroll, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", checkTabScroll);
    };
  }, [checkTabScroll]);

  const scrollTabs = useCallback((dir: "left" | "right") => {
    const el = tabScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
  }, []);
  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="border-b border-border/40 bg-muted/20 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">{exam.name}</h2>
            <p className="text-sm text-muted-foreground">{exam.dateRange}</p>
          </div>
          <Badge variant="outline" className={`${st.bg} ${st.color} ${st.border} border`}>
            {st.label}
          </Badge>
        </div>
        <div className="mt-4 relative">
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs("left")}
              className="absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md border border-border/40 sm:hidden"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollTabs("right")}
              className="absolute right-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md border border-border/40 sm:hidden"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <div
            ref={tabScrollRef}
            className="tabs-mobile-scroll flex gap-1 overflow-x-auto scrollbar-none px-0 sm:px-0"
          >
            {TAB_LIST.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                disabled={tab.id === "results" && !exam.result}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : tab.id === "results" && !exam.result
                      ? "text-muted-foreground/40 cursor-not-allowed"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {activeTab === "overview" && <OverviewTab exam={exam} />}
        {activeTab === "timetable" && <TimetableTab exam={exam} />}
        {activeTab === "syllabus" && <SyllabusTab exam={exam} />}
        {activeTab === "results" && exam.result && (
          <ResultsTab exam={exam} onViewReportCard={onViewReportCard} />
        )}
        {activeTab === "ai" && <AiAnalysisTab exam={exam} />}
      </div>
    </Card>
  );
}

function OverviewTab({ exam }: { exam: Exam }) {
  const st = STATUS_CONFIG[exam.status];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniMetric
          icon={<Calendar className="h-4 w-4 text-blue-400" />}
          label="Duration"
          value={exam.dateRange}
        />
        <MiniMetric
          icon={<BookOpen className="h-4 w-4 text-violet-400" />}
          label="Subjects"
          value={`${exam.subjects.length}`}
        />
        <MiniMetric
          icon={<BarChart3 className="h-4 w-4 text-emerald-400" />}
          label="Total Marks"
          value={`${exam.totalMarks}`}
        />
        <MiniMetric
          icon={<Target className="h-4 w-4 text-amber-400" />}
          label="Pass %"
          value={`${exam.passingPercentage}%`}
        />
      </div>
      {exam.status === "ongoing" && exam.daysRemaining && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {exam.daysRemaining} Days Remaining
              </p>
              <p className="text-xs text-muted-foreground">{exam.upcomingPapers} papers upcoming</p>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Subjects Included</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {exam.subjects.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-4 py-3"
            >
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: SUBJECT_COLORS[s.name] }}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.chapters.length} chapters</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {exam.status === "conducted" && (
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Exam Completed</p>
              <p className="text-xs text-muted-foreground">
                Results are available in the Results tab
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TimetableTab({ exam }: { exam: Exam }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Examination Timetable</h3>
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="pb-3 text-left font-medium text-muted-foreground">Date</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Subject</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Time</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Duration</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Room</th>
            </tr>
          </thead>
          <tbody>
            {exam.timetable.map((entry, i) => (
              <tr key={i} className="border-b border-border/20 transition-colors hover:bg-muted/30">
                <td className="py-3 font-medium text-foreground">{entry.date}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: SUBJECT_COLORS[entry.subject] }}
                    />
                    <span className="text-foreground">{entry.subject}</span>
                  </div>
                </td>
                <td className="py-3 text-muted-foreground">{entry.time}</td>
                <td className="py-3 text-muted-foreground">{entry.duration}</td>
                <td className="py-3 text-muted-foreground">{entry.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-2">
        {exam.timetable.map((entry, i) => (
          <div key={i} className="rounded-xl border border-border/40 bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: SUBJECT_COLORS[entry.subject] }}
                />
                <span className="text-sm font-semibold text-foreground">{entry.subject}</span>
              </div>
              <span className="text-xs text-muted-foreground">{entry.room}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{entry.date}</span>
              <span>{entry.time}</span>
              <span>{entry.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SyllabusTab({ exam }: { exam: Exam }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Subject-wise Syllabus</h3>
      {exam.subjects.map((subject) => (
        <Card key={subject.name} className="border-border/40 bg-card/50">
          <button
            onClick={() => setExpanded(expanded === subject.name ? null : subject.name)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ background: SUBJECT_COLORS[subject.name] }}
              />
              <div>
                <p className="text-sm font-semibold text-foreground">{subject.name}</p>
                <p className="text-xs text-muted-foreground">{subject.syllabus.length} topics</p>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === subject.name ? "rotate-180" : ""}`}
            />
          </button>
          {expanded === subject.name && (
            <div className="border-t border-border/40 px-4 pb-4 pt-3 space-y-2">
              {subject.syllabus.map((topic, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">{topic}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function ResultsTab({ exam, onViewReportCard }: { exam: Exam; onViewReportCard: () => void }) {
  const result = exam.result;
  if (!result) return <p className="text-sm text-muted-foreground">Results not available yet.</p>;

  const barData = result.subjects.map((s) => ({
    subject: s.subject,
    score: s.score,
    average: s.classAverage,
    fill: SUBJECT_COLORS[s.subject],
  }));

  const conductedExams = EXAMS.filter((e) => e.result);
  const trendData = conductedExams.map((e) => ({
    exam: e.name.replace("Exam", "").trim(),
    percentage: e.result!.percentage,
    average: Math.round(
      e.result!.subjects.reduce((a, s) => a + s.classAverage, 0) / e.result!.subjects.length,
    ),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <MiniMetric
          icon={<BarChart3 className="h-4 w-4 text-blue-400" />}
          label="Total"
          value={`${result.totalMarks}/${result.maxMarks}`}
        />
        <MiniMetric
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
          label="Percentage"
          value={`${result.percentage}%`}
        />
        <MiniMetric
          icon={<Trophy className="h-4 w-4 text-amber-400" />}
          label="Rank"
          value={`#${result.rank}`}
        />
        <MiniMetric
          icon={<Award className="h-4 w-4 text-violet-400" />}
          label="Grade"
          value={result.grade}
        />
        <MiniMetric
          icon={
            result.passed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )
          }
          label="Status"
          value={result.passed ? "Pass" : "Fail"}
        />
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="pb-3 text-left font-medium text-muted-foreground">Subject</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Score</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Max</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">%</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Grade</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Class Avg</th>
            </tr>
          </thead>
          <tbody>
            {result.subjects.map((s) => (
              <tr key={s.subject} className="border-b border-border/20">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ background: SUBJECT_COLORS[s.subject] }}
                    />
                    <span className="font-medium text-foreground">{s.subject}</span>
                  </div>
                </td>
                <td className="py-3 text-foreground">{s.score}</td>
                <td className="py-3 text-muted-foreground">{s.maxMarks}</td>
                <td className="py-3 text-foreground">{s.percentage}%</td>
                <td className="py-3">
                  <Badge variant="outline" className="text-xs">
                    {s.grade}
                  </Badge>
                </td>
                <td className="py-3 text-muted-foreground">{s.classAverage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-2">
        {result.subjects.map((s) => (
          <div key={s.subject} className="rounded-xl border border-border/40 bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: SUBJECT_COLORS[s.subject] }}
                />
                <span className="text-sm font-semibold text-foreground">{s.subject}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {s.grade}
              </Badge>
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                {s.score}/{s.maxMarks}
              </span>
              <span>{s.percentage}%</span>
              <span>Avg: {s.classAverage}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">Subject Performance</p>
            <ChartContainer config={{}} className="h-[220px] w-full">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50">
          <CardContent className="p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">Performance Trend</p>
            <ChartContainer config={{}} className="h-[220px] w-full">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="exam" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#6b7280"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={onViewReportCard}>
        <FileText className="h-4 w-4" /> View Full Report Card
      </Button>
    </div>
  );
}

function AiAnalysisTab({ exam }: { exam: Exam }) {
  const perf = CLASS_PERFORMANCE.find((p) => p.examId === exam.id);
  const result = exam.result;

  const insights = useMemo(() => {
    if (!result) {
      return {
        summary: `${exam.name} is currently ${STATUS_CONFIG[exam.status].label.toLowerCase()}. Prepare well using the syllabus and timetable provided.`,
        strengths: [
          "Review all chapters systematically",
          "Practice previous year questions",
          "Focus on conceptual understanding",
        ],
        weaknesses: [
          "Identify topics you find difficult early",
          "Allocate more time to challenging subjects",
        ],
        readiness: "Focus on completing the full syllabus and revision before the exam.",
        focus: exam.subjects.map((s) => s.name),
      };
    }
    const strongest = result.subjects.reduce((a, b) => (a.score > b.score ? a : b));
    const weakest = result.subjects.reduce((a, b) => (a.score < b.score ? a : b));
    const improved = result.subjects.filter((s) => s.score > s.classAverage);
    return {
      summary: `You scored ${result.totalMarks}/${result.maxMarks} (${result.percentage}%) and secured Rank #${result.rank} with grade ${result.grade}. Your performance was above class average in ${improved.length} subjects.`,
      strengths: [
        `${strongest.subject} is your strongest subject at ${strongest.percentage}%`,
        `Outperformed class average in ${improved.length} out of ${result.subjects.length} subjects`,
        `Consistent performance across all subjects with no failing grades`,
      ],
      weaknesses: [
        `${weakest.subject} needs improvement at ${weakest.percentage}%`,
        `Scored below 80% in ${result.subjects.filter((s) => s.percentage < 80).length} subjects`,
      ],
      readiness:
        result.percentage >= 80
          ? "Strong academic position. Maintain consistency and aim for top 3 in the final exam."
          : "Good foundation but needs focused improvement in weak areas to reach excellent standing.",
      focus: result.subjects.filter((s) => s.percentage < 80).map((s) => s.subject),
    };
  }, [exam, result]);

  return (
    <div className="space-y-5">
      <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-600/5">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h3 className="text-sm font-bold text-foreground">AI Academic Report</h3>
          </div>
          <div className="space-y-4">
            <AiSection
              title="Academic Summary"
              icon={<BarChart3 className="h-4 w-4 text-blue-400" />}
              content={insights.summary}
            />
            <AiSection
              title="Strength Areas"
              icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
              items={insights.strengths}
            />
            <AiSection
              title="Areas for Improvement"
              icon={<Target className="h-4 w-4 text-amber-400" />}
              items={insights.weaknesses}
            />
            <AiSection
              title="Exam Readiness"
              icon={<CheckCircle2 className="h-4 w-4 text-violet-400" />}
              content={insights.readiness}
            />
            {insights.focus.length > 0 && (
              <AiSection
                title="Suggested Focus Areas"
                icon={<AlertCircle className="h-4 w-4 text-red-400" />}
                items={insights.focus.map((f) => `Prioritize ${f} in your study plan`)}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {perf && (
        <>
          <ClassPerformanceSection subjects={perf.subjects} />
          <PassFailStats result={exam.result} />
        </>
      )}
    </div>
  );
}

function ClassPerformanceSection({ subjects }: { subjects: ClassPerformance["subjects"] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Class Performance Analytics</h3>
      {subjects.map((subject) => (
        <Card key={subject.name} className="border-border/40 bg-card/50">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ background: SUBJECT_COLORS[subject.name] }}
                />
                <p className="text-sm font-semibold text-foreground">{subject.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Class Average</span>
                <Badge variant="outline" className="text-xs">
                  {subject.average}%
                </Badge>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted/50">
              <div
                className="h-full rounded-full"
                style={{ width: `${subject.average}%`, background: SUBJECT_COLORS[subject.name] }}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Trophy className="h-3 w-3" /> Top 5
                </p>
                {subject.toppers.map((t: { name: string; marks: number }, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="flex items-center gap-2 text-foreground">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? "bg-amber-500/20 text-amber-400" : i === 1 ? "bg-gray-400/20 text-gray-400" : i === 2 ? "bg-orange-500/20 text-orange-400" : "bg-muted/50 text-muted-foreground"}`}
                      >
                        {i + 1}
                      </span>
                      {t.name}
                    </span>
                    <span className="font-medium text-foreground">{t.marks}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-red-400">
                  <AlertCircle className="h-3 w-3" /> Needs Support
                </p>
                {subject.bottomers.map((b: { name: string; marks: number }, i: number) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-foreground">{b.name}</span>
                    <span className="font-medium text-red-400">{b.marks}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PassFailStats({ result }: { result?: Exam["result"] }) {
  if (!result) return null;
  const cs = result.classStats;
  const passFailData = [
    { name: "Passed", value: cs.passed, fill: "#10b981" },
    { name: "Failed", value: cs.failed, fill: "#ef4444" },
  ];
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Pass / Fail Analysis</h3>
      <Card className="border-border/40 bg-card/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MiniMetric
              icon={<Users className="h-4 w-4 text-blue-400" />}
              label="Appeared"
              value={`${cs.totalStudents}`}
            />
            <MiniMetric
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              label="Passed"
              value={`${cs.passed}`}
            />
            <MiniMetric
              icon={<AlertCircle className="h-4 w-4 text-red-400" />}
              label="Failed"
              value={`${cs.failed}`}
            />
            <MiniMetric
              icon={<TrendingUp className="h-4 w-4 text-violet-400" />}
              label="Pass Rate"
              value={`${cs.passPercentage}%`}
            />
          </div>
          <div className="mt-4 flex gap-4">
            {passFailData.map((item) => (
              <div key={item.name} className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-medium text-foreground">
                    {item.value} ({item.name === "Passed" ? cs.passPercentage : cs.failPercentage}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted/50">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.name === "Passed" ? cs.passPercentage : cs.failPercentage}%`,
                      background: item.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportCard({ exam }: { exam: Exam }) {
  const result = exam.result;
  if (!result) return null;
  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle className="text-lg">Report Card</SheetTitle>
        <SheetDescription>
          {exam.name} \u2014 {exam.dateRange}
        </SheetDescription>
      </SheetHeader>
      <div className="rounded-xl border border-border/40 bg-gradient-to-br from-violet-500/5 to-purple-600/5 p-5 text-center space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Student Name
        </p>
        <p className="text-xl font-bold text-foreground">Rahul Kumar</p>
        <p className="text-sm text-muted-foreground">
          Class 10 \u2014 Section A &bull; Roll No. 15
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MiniMetric
          icon={<BarChart3 className="h-4 w-4 text-blue-400" />}
          label="Total Marks"
          value={`${result.totalMarks}/${result.maxMarks}`}
        />
        <MiniMetric
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
          label="Percentage"
          value={`${result.percentage}%`}
        />
        <MiniMetric
          icon={<Trophy className="h-4 w-4 text-amber-400" />}
          label="Rank"
          value={`#${result.rank}`}
        />
        <MiniMetric
          icon={<Award className="h-4 w-4 text-violet-400" />}
          label="Grade"
          value={result.grade}
        />
      </div>
      <Separator />
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Subject Marks</h4>
        {result.subjects.map((s) => (
          <div
            key={s.subject}
            className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: SUBJECT_COLORS[s.subject] }}
              />
              <span className="text-sm font-medium text-foreground">{s.subject}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {s.score}/{s.maxMarks}
              </span>
              <Badge variant="outline" className="text-xs">
                {s.grade}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="space-y-3">
        <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Teacher Remarks
          </p>
          <p className="text-sm text-foreground">
            Rahul is a diligent student who shows consistent improvement. Focus on strengthening
            weak areas for even better results.
          </p>
        </div>
        <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Principal Remarks
          </p>
          <p className="text-sm text-foreground">
            Good overall performance. Keep up the hard work and maintain consistency across all
            subjects.
          </p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
            AI Summary
          </p>
          <p className="text-sm text-foreground">
            Strong performance in Science and English. Mathematics and Computer Science show room
            for improvement. Rank improved from #5 to #{result.rank}. Projected to achieve Grade A+
            in final exam with focused preparation.
          </p>
        </div>
      </div>
      <Button variant="outline" className="w-full gap-2">
        <Download className="h-4 w-4" /> Download PDF (Coming Soon)
      </Button>
    </div>
  );
}

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-muted/30 p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="text-sm font-bold text-foreground truncate">{value}</p>
    </div>
  );
}

function AiSection({
  title,
  icon,
  content,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  content?: string;
  items?: string[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</p>
      </div>
      {content && <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>}
      {items && (
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
