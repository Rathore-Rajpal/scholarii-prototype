import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
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
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Search,
  Sparkles,
  Target,
  Trophy,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  BookOpen,
  Users,
  MessageSquare,
  Brain,
  FileCheck,
  CalendarDays,
  ClipboardList,
  Mail,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ExamEntry, type StudentResult } from "@/lib/scholarii/myclass-exams-mock-data";
import { getClassExamBundle } from "@/lib/scholarii/myclass-exams-class-data";
import {
  TEACHER_EXAM_SCOPES,
  getScopeById,
  getScopeLabel,
  filterSubjects,
  filterSubjectNames,
  type TeacherClassScope,
} from "@/lib/scholarii/myclass-exams-teacher-context";

export const Route = createFileRoute("/app/myclass/exams")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <ExamsPage />
    </RoleGuard>
  ),
});

type TabId = "timeline" | "results" | "performance" | "analytics" | "ai";
type ExamTab = "timetable" | "syllabus" | "results" | "paper";
type ResultPerformanceFilter = "all" | "top" | "stable" | "at-risk";

type ExamResultRow = {
  examId: string;
  examName: string;
  roll: number;
  studentName: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  rank: number;
  status: StudentResult["status"];
};

const EXAM_TABS: { id: ExamTab; label: string }[] = [
  { id: "timetable", label: "Timetable" },
  { id: "syllabus", label: "Syllabus" },
  { id: "paper", label: "Question Paper" },
  { id: "results", label: "Results" },
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

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "timeline", label: "Exams Timeline", icon: Calendar },
  { id: "results", label: "Results", icon: FileText },
  { id: "performance", label: "Student Performance", icon: TrendingUp },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "ai", label: "AI Insights", icon: Sparkles },
];

const readinessChartConfig = {
  readiness: { label: "Readiness", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const scatterConfig = {
  marks: { label: "Marks", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const PAPER_FILE_LABELS: Record<string, string> = {
  "question-paper": "Question Paper",
  "answer-key": "Answer Key",
  "marking-scheme": "Marking Scheme",
};

const RESULT_PERFORMANCE_OPTIONS: { value: ResultPerformanceFilter; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "top", label: "Top Performers" },
  { value: "stable", label: "Stable" },
  { value: "at-risk", label: "At Risk" },
];

function getExamStatusClass(status: ExamEntry["status"]) {
  if (status === "completed") return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
  if (status === "ongoing") return "bg-violet-500/10 text-violet-700 border-violet-200";
  return "bg-muted text-muted-foreground border-border";
}

function getStudentBadgeClass(status: StudentResult["status"]) {
  if (status === "top") return "bg-emerald-500 text-white border-0";
  if (status === "at-risk") return "bg-red-500 text-white border-0";
  return "bg-slate-500 text-white border-0";
}

function getStudentAvatarClass(status: StudentResult["status"]) {
  if (status === "top") return "bg-emerald-500";
  if (status === "at-risk") return "bg-red-500";
  return "bg-violet-500";
}

function getStudentRankBadge(status: StudentResult["status"]) {
  if (status === "top") {
    return <Badge className="border-0 bg-emerald-500/10 text-emerald-700">Top Performer</Badge>;
  }
  if (status === "at-risk") {
    return <Badge className="border-0 bg-red-500/10 text-red-700">At Risk</Badge>;
  }
  return <Badge variant="outline">Stable</Badge>;
}

function filterExamForScope(exam: ExamEntry, scope: TeacherClassScope): ExamEntry {
  return {
    ...exam,
    timetable: filterSubjects(
      exam.timetable.map((slot) => ({ ...slot, subject: slot.subject })),
      scope,
    ),
    syllabus: filterSubjects(exam.syllabus, scope),
    results: filterSubjects(exam.results, scope),
    questionPaper: filterSubjects(exam.questionPaper, scope),
  };
}

function filterStudentForScope(student: StudentResult, scope: TeacherClassScope): StudentResult {
  const visibleSubjects = filterSubjectNames(
    student.subjects.map((s) => s.name),
    scope,
  );
  const subjects = student.subjects.filter((s) => visibleSubjects.includes(s.name));
  const total = subjects.reduce((sum, s) => sum + s.marks, 0);
  const maxTotal = subjects.reduce((sum, s) => sum + s.max, 0);
  const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : student.percentage;

  return {
    ...student,
    subjects,
    total,
    maxTotal,
    percentage,
    strengths: student.strengths.filter((s) => visibleSubjects.includes(s)),
    weaknesses: student.weaknesses.filter((s) => visibleSubjects.includes(s)),
  };
}

function ExamsPage() {
  const [selectedScopeId, setSelectedScopeId] = useState("8-a");
  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const [selectedExamId, setSelectedExamId] = useState<string>("e2");
  const [examTab, setExamTab] = useState<ExamTab>("results");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [drawerWidth, setDrawerWidth] = useState(760);
  const [isResizing, setIsResizing] = useState(false);
  const [resultFilterExam, setResultFilterExam] = useState<string>("e2");
  const [resultFilterClass, setResultFilterClass] = useState<string>("8-a");
  const [resultFilterSubject, setResultFilterSubject] = useState("all");
  const [resultFilterPerformance, setResultFilterPerformance] =
    useState<ResultPerformanceFilter>("all");
  const [resultSortBy, setResultSortBy] = useState("rank");
  const [perfSearch, setPerfSearch] = useState("");
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
    const el = tabScrollRef.current;
    if (!el) return;
    checkTabScroll();
    el.addEventListener("scroll", checkTabScroll, { passive: true });
    window.addEventListener("resize", checkTabScroll);
    return () => {
      el.removeEventListener("scroll", checkTabScroll);
      window.removeEventListener("resize", checkTabScroll);
    };
  }, [checkTabScroll]);

  useEffect(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector("[data-active-tab]");
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeTab]);

  const scrollTabs = (direction: "left" | "right") => {
    const el = tabScrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth - 80;
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const selectedScope = useMemo(() => getScopeById(selectedScopeId), [selectedScopeId]);
  const classBundle = useMemo(() => getClassExamBundle(selectedScopeId), [selectedScopeId]);

  const resultScope = useMemo(() => getScopeById(resultFilterClass), [resultFilterClass]);
  const resultBundle = useMemo(() => getClassExamBundle(resultFilterClass), [resultFilterClass]);

  const scopedExams = useMemo(
    () => classBundle.exams.map((exam) => filterExamForScope(exam, selectedScope)),
    [classBundle.exams, selectedScope],
  );

  const resultSubjects = useMemo(
    () =>
      filterSubjectNames(
        Array.from(
          new Set(
            resultBundle.students.flatMap((student) => student.subjects.map((sub) => sub.name)),
          ),
        ),
        resultScope,
      ),
    [resultBundle.students, resultScope],
  );

  const selectedExam = useMemo(
    () => scopedExams.find((exam) => exam.id === selectedExamId) ?? null,
    [scopedExams, selectedExamId],
  );

  const selectedResultExam = useMemo(() => {
    const exams = resultBundle.exams.map((exam) => filterExamForScope(exam, resultScope));
    if (resultFilterExam === "all") {
      return exams.find((exam) => exam.status === "completed") ?? exams[0] ?? null;
    }
    return exams.find((exam) => exam.id === resultFilterExam) ?? null;
  }, [resultBundle.exams, resultFilterExam, resultScope]);

  const selectedStudent = useMemo(
    () => classBundle.students.find((student) => student.id === selectedStudentId) ?? null,
    [classBundle.students, selectedStudentId],
  );

  const selectedStudentScoped = useMemo(
    () => (selectedStudent ? filterStudentForScope(selectedStudent, selectedScope) : null),
    [selectedStudent, selectedScope],
  );

  const visibleStudents = useMemo(
    () => classBundle.students.map((student) => filterStudentForScope(student, selectedScope)),
    [classBundle.students, selectedScope],
  );

  const scopedAnalytics = useMemo(() => {
    const analytics = classBundle.analytics;
    return {
      ...analytics,
      subjectPerf: filterSubjects(analytics.subjectPerf, selectedScope),
      examReadiness: filterSubjects(analytics.examReadiness, selectedScope),
    };
  }, [classBundle.analytics, selectedScope]);

  const resultRows = useMemo<ExamResultRow[]>(() => {
    const exam = selectedResultExam;
    if (!exam || exam.status !== "completed") return [];

    const resultStudents = resultBundle.students.map((student) =>
      filterStudentForScope(student, resultScope),
    );

    let rows = resultStudents.flatMap((student) =>
      student.subjects.map((subject) => ({
        examId: exam.id,
        examName: exam.name,
        roll: student.roll,
        studentName: student.name,
        subject: subject.name,
        score: subject.marks,
        maxScore: subject.max,
        percentage: Math.round((subject.marks / subject.max) * 100),
        rank: student.rank,
        status: student.status,
      })),
    );

    if (resultFilterSubject !== "all") {
      rows = rows.filter((row) => row.subject === resultFilterSubject);
    }

    if (resultFilterPerformance !== "all") {
      rows = rows.filter((row) => row.status === resultFilterPerformance);
    }

    switch (resultSortBy) {
      case "marks":
        rows.sort((a, b) => b.score - a.score);
        break;
      case "lowest":
        rows.sort((a, b) => a.score - b.score);
        break;
      case "name":
        rows.sort((a, b) => a.studentName.localeCompare(b.studentName));
        break;
      case "recent":
        rows.sort((a, b) => a.roll - b.roll);
        break;
      default:
        rows.sort((a, b) => a.rank - b.rank);
        break;
    }

    return rows;
  }, [
    selectedResultExam,
    resultBundle.students,
    resultScope,
    resultFilterSubject,
    resultFilterPerformance,
    resultSortBy,
  ]);

  const filteredPerf = useMemo(() => {
    const query = perfSearch.trim().toLowerCase();
    if (!query) return visibleStudents;
    return visibleStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        String(student.roll).includes(query) ||
        student.subjects.some((subject) => subject.name.toLowerCase().includes(query)),
    );
  }, [perfSearch, visibleStudents]);

  const upcomingCount = scopedExams.filter((exam) => exam.status === "upcoming").length;
  const completedCount = scopedExams.filter((exam) => exam.status === "completed").length;
  const avgScore =
    visibleStudents.length > 0
      ? Math.round(
          visibleStudents.reduce((sum, student) => sum + student.percentage, 0) /
            visibleStudents.length,
        )
      : 0;
  const topCount = visibleStudents.filter((student) => student.status === "top").length;
  const atRiskCount = visibleStudents.filter((student) => student.status === "at-risk").length;

  const passCount = scopedAnalytics.passFail.pass;
  const failCount = scopedAnalytics.passFail.fail;

  const resultExamLabel = selectedResultExam?.name ?? "Select an exam";

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (event: MouseEvent) => {
      const nextWidth = Math.max(440, Math.min(980, window.innerWidth - event.clientX));
      setDrawerWidth(nextWidth);
    };

    const handleUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isResizing]);

  const renderStudentInsight = (student: StudentResult) => {
    const aiNotes = [
      student.attendance < 80
        ? "Attendance needs a quick follow-up."
        : "Attendance is strong and consistent.",
      student.status === "at-risk"
        ? "Intervention plan should stay active."
        : "Performance remains within the expected band.",
      student.strengths.length > 0
        ? `Strong subjects: ${student.strengths.join(", ")}.`
        : "No clear strengths flagged yet.",
    ];

    return aiNotes;
  };

  const handleScopeChange = (scopeId: string) => {
    setSelectedScopeId(scopeId);
    setResultFilterClass(scopeId);
    setSelectedStudentId(null);
    setResultFilterSubject("all");
  };

  return (
    <div>
      <PageHeader
        title="Exams & Results"
        subtitle="Class-focused exam workspace with role-based visibility — class teacher or subject teacher."
        action={
          <Button size="sm" className="bg-brand-gradient text-white border-0">
            <FileText className="size-4 mr-1" />
            Create Exam
          </Button>
        }
      />

      <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 mb-4 sm:mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium">Class Scope</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {selectedScope.role === "class-teacher"
                ? "Full exam and result data for all subjects."
                : `Subject-only view: ${selectedScope.teachingSubjects?.join(", ")}.`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Select value={selectedScopeId} onValueChange={handleScopeChange}>
              <SelectTrigger className="h-9 w-full sm:w-52">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {TEACHER_EXAM_SCOPES.map((scope) => (
                  <SelectItem key={scope.id} value={scope.id}>
                    {getScopeLabel(scope)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[10px]",
                selectedScope.role === "class-teacher"
                  ? "border-violet-200 bg-violet-500/10 text-violet-700"
                  : "border-sky-200 bg-sky-500/10 text-sky-700",
              )}
            >
              {selectedScope.role === "class-teacher" ? "Class Teacher" : "Subject Teacher"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center">
              <Calendar className="size-5 text-violet-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Upcoming Exams</div>
              <div className="text-xl font-semibold">{upcomingCount}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Completed Exams</div>
              <div className="text-xl font-semibold">{completedCount}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-sky-500/10 grid place-items-center">
              <TrendingUp className="size-5 text-sky-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Average Class Score</div>
              <div className="text-xl font-semibold">{avgScore}%</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 grid place-items-center">
              <Trophy className="size-5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Top Performers</div>
              <div className="text-xl font-semibold">{topCount}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-2 border-red-200/70 dark:border-red-900/40">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center">
              <AlertTriangle className="size-5 text-red-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Students At Risk</div>
              <div className="text-xl font-semibold">{atRiskCount}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-4 overflow-hidden sm:mb-6">
        <div className="relative flex items-center">
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs("left")}
              className="absolute left-0 z-20 flex h-full w-8 items-center justify-center bg-gradient-to-r from-background via-background/90 to-transparent"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
            </button>
          )}
          <div ref={tabScrollRef} className="tabs-mobile-scroll flex gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                data-active-tab={activeTab === tab.id || undefined}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-violet-500/10 text-violet-600 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </div>
          {canScrollRight && (
            <button
              onClick={() => scrollTabs("right")}
              className="absolute right-0 z-20 flex h-full w-8 items-center justify-center bg-gradient-to-l from-background via-background/90 to-transparent"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </Card>

      <div className="space-y-4 pb-4">
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Exam Journey — {selectedScope.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedScope.role === "class-teacher"
                      ? "Complete exam timeline with all subjects."
                      : `Showing ${selectedScope.teachingSubjects?.join(", ")} only — other subjects are hidden.`}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px]">
                  {getScopeLabel(selectedScope)}
                </Badge>
              </div>
            </Card>

            <div className="space-y-2">
              {scopedExams.map((exam) => {
                const isSelected = selectedExamId === exam.id;
                return (
                  <button
                    key={exam.id}
                    onClick={() => {
                      setSelectedExamId(exam.id);
                      setExamTab("results");
                    }}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-violet-500 bg-violet-500/5 shadow-sm"
                        : "border-border/60 bg-background hover:border-border hover:bg-muted/30",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "size-3 rounded-full shrink-0",
                          exam.status === "completed"
                            ? "bg-emerald-500"
                            : exam.status === "ongoing"
                              ? "bg-violet-500"
                              : "bg-muted",
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">{exam.name}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full text-[10px]",
                              getExamStatusClass(exam.status),
                            )}
                          >
                            {exam.status}
                          </Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {exam.date} - {exam.type}
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-4 text-muted-foreground transition-transform",
                          isSelected && "rotate-180",
                        )}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedExam && (
              <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
                <div className="border-b border-border/60 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{selectedExam.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedExam.date} · {selectedScope.label}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full text-[10px]",
                        getExamStatusClass(selectedExam.status),
                      )}
                    >
                      {selectedExam.status}
                    </Badge>
                  </div>
                </div>

                <div className="px-5 pt-4">
                  <div className="flex flex-wrap gap-2 rounded-2xl bg-muted/30 p-1">
                    {EXAM_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setExamTab(tab.id)}
                        className={cn(
                          "rounded-xl px-3 py-2 text-xs font-medium transition-all",
                          examTab === tab.id
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  {examTab === "timetable" && (
                    <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                      {selectedExam.timetable.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                          No timetable has been published yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {selectedExam.timetable.map((slot) => (
                            <div
                              key={`${slot.date}-${slot.subject}`}
                              className="grid gap-2 rounded-xl border border-border/60 px-3 py-3 text-sm md:grid-cols-[110px_160px_1fr_120px]"
                            >
                              <div className="font-medium">{slot.date}</div>
                              <div className="text-muted-foreground">{slot.time}</div>
                              <div className="font-medium">{slot.subject}</div>
                              <div className="text-muted-foreground md:text-right">{slot.room}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}

                  {examTab === "syllabus" && (
                    <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                      <div className="space-y-4">
                        {selectedExam.syllabus.map((subject) => (
                          <div key={subject.subject} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{subject.subject}</span>
                              <span className="text-muted-foreground">{subject.completion}%</span>
                            </div>
                            <Progress value={subject.completion} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {subject.chapters.join(", ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {examTab === "results" && (
                    <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                      {selectedExam.results.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                          Results are not available yet.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {selectedExam.results.map((result) => (
                            <div
                              key={result.subject}
                              className="space-y-2 rounded-xl border border-border/60 p-3"
                            >
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{result.subject}</span>
                                <span className="font-semibold">
                                  {result.avgMarks}/{result.maxMarks}
                                </span>
                              </div>
                              <Progress value={result.avgMarks} className="h-2" />
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{result.passRate}% pass rate</span>
                                <span>{selectedScope.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}

                  {examTab === "paper" && (
                    <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                      {selectedExam.questionPaper.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                          Question papers have not been uploaded yet.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {selectedExam.questionPaper.map((entry) => (
                            <div key={entry.subject} className="space-y-2">
                              <h4 className="text-sm font-semibold">{entry.subject}</h4>
                              {entry.files.map((paper) => (
                                <div
                                  key={paper.name}
                                  className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-3 text-sm"
                                >
                                  <FileText className="size-4 text-muted-foreground" />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium">
                                      {PAPER_FILE_LABELS[paper.type] ?? paper.type}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {paper.name} · {paper.size}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 px-3">
                                    <Download className="mr-1 size-3.5" />
                                    Download
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "results" && (
          <div className="space-y-4">
            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <div className="tabs-mobile-scroll flex items-center gap-3 overflow-x-auto scrollbar-none">
                <Select value={resultFilterExam} onValueChange={setResultFilterExam}>
                  <SelectTrigger className="h-9 w-44">
                    <SelectValue placeholder="Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Latest Completed Exam</SelectItem>
                    {resultBundle.exams.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={resultFilterClass} onValueChange={setResultFilterClass}>
                  <SelectTrigger className="h-9 w-44">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEACHER_EXAM_SCOPES.map((scope) => (
                      <SelectItem key={scope.id} value={scope.id}>
                        {getScopeLabel(scope)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={resultFilterSubject} onValueChange={setResultFilterSubject}>
                  <SelectTrigger className="h-9 w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {resultSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={resultFilterPerformance}
                  onValueChange={(value) =>
                    setResultFilterPerformance(value as ResultPerformanceFilter)
                  }
                >
                  <SelectTrigger className="h-9 w-40">
                    <SelectValue placeholder="Performance" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESULT_PERFORMANCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={resultSortBy} onValueChange={setResultSortBy}>
                  <SelectTrigger className="h-9 w-40">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rank">Rank</SelectItem>
                    <SelectItem value="marks">Highest Marks</SelectItem>
                    <SelectItem value="lowest">Lowest Marks</SelectItem>
                    <SelectItem value="name">Student Name</SelectItem>
                    <SelectItem value="recent">Recently Updated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px]">
                    {resultScope.role === "class-teacher"
                      ? `${resultScope.label} · All subjects`
                      : `${resultScope.label} · ${resultScope.teachingSubjects?.join(", ")}`}
                  </Badge>
                  <Button variant="outline" size="sm" className="h-9">
                    <Download className="mr-1.5 size-3.5" />
                    Export
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
              <div className="border-b border-border/60 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold">Results List</h3>
                  <Badge variant="outline" className="rounded-full text-[10px]">
                    {resultExamLabel}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {resultScope.role === "class-teacher"
                    ? "All subjects visible for your class teacher class."
                    : `Only ${resultScope.teachingSubjects?.join(", ")} results are visible for this class.`}
                </p>
              </div>

              {resultRows.length === 0 ? (
                <div className="px-5 py-14 text-center text-sm text-muted-foreground">
                  No result data is available for the selected exam.
                </div>
              ) : (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr className="text-left">
                          <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Roll Number
                          </th>
                          <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Student Name
                          </th>
                          <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Subject
                          </th>
                          <th className="px-4 py-3 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Score
                          </th>
                          <th className="px-4 py-3 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Percentage
                          </th>
                          <th className="px-4 py-3 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Rank
                          </th>
                          <th className="px-4 py-3 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultRows.map((row) => (
                          <tr
                            key={`${row.examId}-${row.roll}-${row.subject}`}
                            className="border-t border-border/50"
                          >
                            <td className="px-4 py-3 text-xs font-medium">{row.roll}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="size-7">
                                  <AvatarFallback
                                    className={cn(
                                      "text-[10px] text-white",
                                      getStudentAvatarClass(row.status),
                                    )}
                                  >
                                    {row.studentName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{row.studentName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">
                              {row.subject}
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-medium">
                              {row.score}/{row.maxScore}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={cn(
                                  "text-xs font-semibold",
                                  row.percentage >= 85
                                    ? "text-emerald-700"
                                    : row.percentage >= 70
                                      ? "text-violet-700"
                                      : "text-amber-700",
                                )}
                              >
                                {row.percentage}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-medium">
                              #{row.rank}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge
                                className={cn(
                                  "rounded-full text-[10px]",
                                  getStudentBadgeClass(row.status),
                                )}
                              >
                                {row.status === "top"
                                  ? "Top"
                                  : row.status === "at-risk"
                                    ? "At Risk"
                                    : "Stable"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden">
                    <div className="divide-y divide-border/50">
                      {resultRows.map((row) => (
                        <div key={`${row.examId}-${row.roll}-${row.subject}`} className="p-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-7 shrink-0">
                              <AvatarFallback
                                className={cn(
                                  "text-[10px] text-white",
                                  getStudentAvatarClass(row.status),
                                )}
                              >
                                {row.studentName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-xs font-medium">
                                  {row.studentName}
                                </span>
                                <Badge
                                  className={cn(
                                    "shrink-0 rounded-full text-[10px]",
                                    getStudentBadgeClass(row.status),
                                  )}
                                >
                                  {row.status === "top"
                                    ? "Top"
                                    : row.status === "at-risk"
                                      ? "At Risk"
                                      : "Stable"}
                                </Badge>
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                #{row.roll} · {row.subject}
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={cn(
                                  "text-xs font-semibold",
                                  row.percentage >= 85
                                    ? "text-emerald-700"
                                    : row.percentage >= 70
                                      ? "text-violet-700"
                                      : "text-amber-700",
                                )}
                              >
                                {row.percentage}%
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {row.score}/{row.maxScore} · #{row.rank}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-4">
            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search student or subject..."
                    value={perfSearch}
                    onChange={(event) => setPerfSearch(event.target.value)}
                    className="h-9 pl-9"
                  />
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px]">
                  {selectedScope.label}
                </Badge>
              </div>
            </Card>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredPerf.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className="rounded-2xl border border-border/60 bg-background p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback
                        className={cn("text-xs text-white", getStudentAvatarClass(student.status))}
                      >
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">{student.name}</span>
                        {getStudentRankBadge(student.status)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Roll #{student.roll} - Rank #{student.rank}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={cn(
                          "text-lg font-semibold",
                          student.percentage >= 85
                            ? "text-emerald-700"
                            : student.percentage >= 70
                              ? "text-violet-700"
                              : "text-amber-700",
                        )}
                      >
                        {student.percentage}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Attendance {student.attendance}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Exam Trend</span>
                      <span className="font-medium">
                        {student.examHistory[student.examHistory.length - 1]?.percentage ?? 0}%
                      </span>
                    </div>
                    <Progress value={student.percentage} className="h-2" />
                    <div className="flex flex-wrap gap-1.5">
                      {student.strengths.slice(0, 2).map((strength) => (
                        <Badge
                          key={strength}
                          variant="outline"
                          className="rounded-full border-emerald-200 bg-emerald-500/10 text-[10px] text-emerald-700"
                        >
                          {strength}
                        </Badge>
                      ))}
                      {student.weaknesses.slice(0, 1).map((weakness) => (
                        <Badge
                          key={weakness}
                          variant="outline"
                          className="rounded-full border-amber-200 bg-amber-500/10 text-[10px] text-amber-700"
                        >
                          Needs support in {weakness}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Average Marks Trend</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Trend across completed exams in this class.
                </p>
                <ChartContainer config={chartConfig} className="h-[220px] w-full">
                  <BarChart
                    data={scopedAnalytics.monthlyTrend}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/50"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="exam"
                      tick={{ fontSize: 10 }}
                      className="text-muted-foreground"
                    />
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
                    data={scopedAnalytics.subjectPerf}
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

            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Pass vs Fail</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedScope.role === "class-teacher"
                    ? "Class-wide pass and fail counts."
                    : `Based on ${selectedScope.teachingSubjects?.join(", ")} performance only.`}
                </p>
                <div className="mt-4 flex items-center gap-6">
                  <ChartContainer
                    config={{
                      pass: { label: "Pass", color: "hsl(142, 76%, 36%)" },
                      fail: { label: "Fail", color: "hsl(0, 84%, 60%)" },
                    }}
                    className="h-[180px] w-[180px]"
                  >
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Pass", value: passCount, fill: "hsl(142, 76%, 36%)" },
                          { name: "Fail", value: failCount, fill: "hsl(0, 84%, 60%)" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={68}
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
                <h3 className="text-sm font-semibold">Exam Readiness</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Subject-wise readiness for the upcoming final exam.
                </p>
                <ChartContainer config={readinessChartConfig} className="h-[180px] w-full">
                  <BarChart
                    data={scopedAnalytics.examReadiness}
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

            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                <h3 className="text-sm font-semibold">Rank Distribution</h3>
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <BarChart
                    data={scopedAnalytics.rankDistribution}
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/50"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="range"
                      tick={{ fontSize: 10 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="var(--color-percentage)"
                      radius={[6, 6, 0, 0]}
                      barSize={34}
                    />
                  </BarChart>
                </ChartContainer>
              </Card>
            </div>

            <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Attendance vs Marks Correlation</h3>
              <ChartContainer config={scatterConfig} className="h-[240px] w-full">
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
                  <Scatter data={scopedAnalytics.attendanceVsMarks} fill="var(--color-marks)" />
                </ScatterChart>
              </ChartContainer>
            </Card>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Trophy className="size-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold">Top 5 Performers</h3>
                </div>
                <div className="space-y-2">
                  {[...visibleStudents]
                    .sort((a, b) => a.rank - b.rank)
                    .slice(0, 5)
                    .map((student, index) => (
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
                          {student.percentage}%
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
                  {[...visibleStudents]
                    .sort((a, b) => b.rank - a.rank)
                    .slice(0, 5)
                    .map((student, index) => (
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
                          {student.percentage}%
                        </span>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        )}

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
                    Focused suggestions for {selectedScope.label} only — no school-wide data.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {classBundle.aiInsights.map((insight, index) => (
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
              <h3 className="text-sm font-semibold">Suggestions</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {classBundle.aiSuggestions.map((item) => (
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
                  {
                    label: "Create Exam",
                    icon: Calendar,
                    color: "text-violet-600 bg-violet-500/10",
                  },
                  { label: "Enter Marks", icon: Target, color: "text-sky-600 bg-sky-500/10" },
                  {
                    label: "Upload Results",
                    icon: FileCheck,
                    color: "text-emerald-600 bg-emerald-500/10",
                  },
                  {
                    label: "Generate Question Paper",
                    icon: FileText,
                    color: "text-violet-600 bg-violet-500/10",
                  },
                  {
                    label: "Export Report Card",
                    icon: Download,
                    color: "text-emerald-600 bg-emerald-500/10",
                  },
                  {
                    label: "Open AI Assistant",
                    icon: Sparkles,
                    color: "text-violet-600 bg-violet-500/10",
                  },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      className="flex items-center gap-3 rounded-xl border border-border/60 px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      <div
                        className={cn("grid size-9 place-items-center rounded-xl", action.color)}
                      >
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

        <Sheet
          open={!!selectedStudentId}
          onOpenChange={(open) => !open && setSelectedStudentId(null)}
        >
          <SheetContent
            side="right"
            className="w-full min-w-0 max-w-full sm:min-w-[420px] sm:max-w-[980px] overflow-hidden"
            style={{ width: undefined }}
          >
            <div
              className="absolute left-0 top-0 hidden h-full w-1.5 cursor-col-resize bg-transparent hover:bg-muted/60 sm:block"
              onMouseDown={() => setIsResizing(true)}
            />

            {selectedStudentScoped && (
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
                              getStudentAvatarClass(selectedStudentScoped.status),
                            )}
                          >
                            {selectedStudentScoped.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="text-lg font-semibold">{selectedStudentScoped.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Roll #{selectedStudentScoped.roll} · {selectedScope.label}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {getStudentRankBadge(selectedStudentScoped.status)}
                            <Badge variant="outline" className="rounded-full text-[10px]">
                              Attendance {selectedStudentScoped.attendance}%
                            </Badge>
                            <Badge variant="outline" className="rounded-full text-[10px]">
                              Average {selectedStudentScoped.percentage}%
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
                        {renderStudentInsight(selectedStudentScoped).map((note) => (
                          <div key={note} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-amber-500" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="academics">Academics</TabsTrigger>
                        <TabsTrigger value="fees">Fees</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="communication">Communication</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="mt-4">
                        <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                          <div className="grid gap-3 text-sm sm:grid-cols-2">
                            <ProfileItem label="Student" value={selectedStudentScoped.name} />
                            <ProfileItem label="Class" value={selectedScope.label} />
                            <ProfileItem
                              label="Roll Number"
                              value={String(selectedStudentScoped.roll)}
                            />
                            <ProfileItem label="Gender" value={selectedStudentScoped.gender} />
                            <ProfileItem
                              label="Attendance"
                              value={`${selectedStudentScoped.attendance}%`}
                            />
                            <ProfileItem
                              label="Average Score"
                              value={`${selectedStudentScoped.percentage}%`}
                            />
                            <ProfileItem label="Rank" value={`#${selectedStudentScoped.rank}`} />
                            <ProfileItem
                              label="Visible Subjects"
                              value={
                                selectedScope.role === "class-teacher"
                                  ? "All subjects"
                                  : (selectedScope.teachingSubjects?.join(", ") ?? "")
                              }
                            />
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="attendance" className="mt-4">
                        <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <ProfileItem
                              label="Attendance Rate"
                              value={`${selectedStudentScoped.attendance}%`}
                            />
                            <ProfileItem
                              label="Days Present"
                              value={`${Math.round((180 * selectedStudentScoped.attendance) / 100)}`}
                            />
                            <ProfileItem
                              label="Days Absent"
                              value={`${180 - Math.round((180 * selectedStudentScoped.attendance) / 100)}`}
                            />
                          </div>

                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground">Attendance Status</p>
                            <Badge
                              className={cn(
                                "mt-2 rounded-full border-0 text-[10px]",
                                selectedStudentScoped.attendance >= 90
                                  ? "bg-emerald-500/10 text-emerald-700"
                                  : selectedStudentScoped.attendance >= 75
                                    ? "bg-amber-500/10 text-amber-700"
                                    : "bg-red-500/10 text-red-700",
                              )}
                            >
                              {selectedStudentScoped.attendance >= 90
                                ? "Excellent"
                                : selectedStudentScoped.attendance >= 75
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
                            {selectedStudentScoped.subjects.map((subject) => (
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
                              data={selectedStudentScoped.examHistory}
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

                      <TabsContent value="fees" className="mt-4">
                        <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <ProfileItem label="Fee Status" value="Paid" />
                            <ProfileItem label="Last Payment" value="15 May 2026" />
                            <ProfileItem label="Outstanding" value="₹0" />
                            <ProfileItem label="Next Due" value="10 Jul 2026" />
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="documents" className="mt-4">
                        <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                          <div className="space-y-3">
                            {[
                              "Result sheet verified",
                              "Parent acknowledgement pending",
                              "Report card ready for download",
                              "Progress note archived",
                            ].map((item) => (
                              <div key={item} className="flex items-center gap-2 text-sm">
                                <FileCheck className="size-4 text-emerald-600" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="communication" className="mt-4">
                        <Card className="rounded-2xl border border-border/60 p-4 shadow-sm">
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="size-4 text-muted-foreground" />
                              <span>Parent email follow-up recommended</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="size-4 text-muted-foreground" />
                              <span>Contact parent for performance review if needed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="size-4 text-muted-foreground" />
                              <span>Add a remark before the next exam cycle</span>
                            </div>
                          </div>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </ScrollArea>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
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
