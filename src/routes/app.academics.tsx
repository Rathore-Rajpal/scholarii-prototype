import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRightLeft,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Trophy,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/app/academics")({ component: AcademicsPage });

const exams = [
  { id: 1, name: "Unit-1 Exam", status: "Conducted", date: "Apr 15-20, 2026" },
  { id: 2, name: "Mid-Semester Exam", status: "Conducted", date: "May 10-15, 2026" },
  { id: 3, name: "Unit-2 Exam", status: "Conducted", date: "Jun 20-25, 2026" },
  { id: 4, name: "Final Exams", status: "Pending", date: "Jul 15-30, 2026" },
] as const;

const comparisonReference: Record<number, number | null> = {
  1: null,
  2: 1,
  3: 1,
  4: 2,
};

const subjects = ["Mathematics", "English", "Science", "Social Studies", "Hindi"] as const;

const classGroups = [
  { grade: 10, sections: ["A", "B"] },
  { grade: 9, sections: ["A", "B"] },
  { grade: 8, sections: ["A", "B"] },
] as const;

const examConfigsById: Record<number, ExamConfig> = {
  1: { label: "Unit", maxMarksPerSubject: 20, duration: "45 minutes" },
  2: { label: "Semester", maxMarksPerSubject: 50, duration: "90 minutes" },
  3: { label: "Unit", maxMarksPerSubject: 20, duration: "45 minutes" },
  4: { label: "Final", maxMarksPerSubject: 100, duration: "180 minutes" },
};

const firstNames = ["Aarav", "Maya", "Ishaan", "Diya", "Rohan", "Kavya", "Saanvi", "Aditya", "Priya", "Kabir"];
const lastNames = ["Singh", "Rao", "Patel", "Sharma", "Verma", "Nair", "Gupta", "Joshi", "Menon", "Khan"];

type ExamStatus = (typeof exams)[number]["status"];

type ExamConfig = {
  label: "Unit" | "Semester" | "Final";
  maxMarksPerSubject: number;
  duration: string;
};

type StudentSubject = {
  subject: string;
  marks: number;
  maxMarks: number;
  percentage: number;
};

type StudentPerformance = {
  id: string;
  name: string;
  className: string;
  section: string;
  percentage: number;
  totalMarks: number;
  maxMarks: number;
  rank: number;
  subjectMarks: StudentSubject[];
};

type SubjectBreakdown = {
  subject: string;
  totalStudents: number;
  passed: number;
  failed: number;
  goodMarks: number;
  justPassed: number;
  averageMarks: number;
  averageScore: number;
};

type PerformanceBand = "fail" | "justPass" | "average" | "good" | "excellent";

type ClassPerformance = {
  className: string;
  totalStudents: number;
  passCount: number;
  failCount: number;
  passRate: number;
  classAverage: number;
  highestSubject: string;
  highestSubjectPercent: number;
  lowestSubject: string;
  lowestSubjectPercent: number;
  subjectAverages: { subject: string; percentage: number }[];
  students: StudentPerformance[];
};

type ExamDataset = {
  school: {
    totalStudents: number;
    averagePercentage: number;
    passedStudents: number;
    failedStudents: number;
    passRate: number;
    highestSubject: string;
    highestSubjectPercent: number;
    lowestSubject: string;
    lowestSubjectPercent: number;
    subjectAverages: { subject: string; percentage: number }[];
  };
  classes: Record<string, ClassPerformance>;
  topStudents: StudentPerformance[];
  bottomStudents: StudentPerformance[];
};

const classRosterMap = buildClassRosters();

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function seededRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pickBand(grade: number, roll: number): PerformanceBand {
  const profile =
    grade === 10
      ? [
          { band: "fail" as const, limit: 0.02 },
          { band: "justPass" as const, limit: 0.10 },
          { band: "average" as const, limit: 0.45 },
          { band: "good" as const, limit: 0.80 },
          { band: "excellent" as const, limit: 1 },
        ]
      : grade === 9
        ? [
            { band: "fail" as const, limit: 0.10 },
            { band: "justPass" as const, limit: 0.22 },
            { band: "average" as const, limit: 0.57 },
            { band: "good" as const, limit: 0.85 },
            { band: "excellent" as const, limit: 1 },
          ]
        : [
            { band: "fail" as const, limit: 0.18 },
            { band: "justPass" as const, limit: 0.33 },
            { band: "average" as const, limit: 0.65 },
            { band: "good" as const, limit: 0.90 },
            { band: "excellent" as const, limit: 1 },
          ];

  return profile.find((item) => roll <= item.limit)?.band ?? "average";
}

function bandToBasePercent(band: PerformanceBand) {
  switch (band) {
    case "fail":
      return { min: 28, max: 39 };
    case "justPass":
      return { min: 40, max: 49 };
    case "average":
      return { min: 50, max: 69 };
    case "good":
      return { min: 70, max: 84 };
    case "excellent":
      return { min: 85, max: 94 };
  }
}

function buildClassRosters() {
  const rosters: Record<string, { id: string; name: string }[]> = {};
  const classEntries = classGroups.flatMap((group) =>
    group.sections.map((section) => ({
      grade: group.grade,
      section,
    })),
  );
  const totalStudents = 430;
  const baseSize = Math.floor(totalStudents / classEntries.length);
  const remainder = totalStudents % classEntries.length;

  classEntries.forEach((entry, classIndex) => {
    const className = `Class ${entry.grade}${entry.section}`;
    const classSize = baseSize + (classIndex < remainder ? 1 : 0);

    rosters[className] = Array.from({ length: classSize }, (_, studentIndex) => {
      const first = firstNames[(classIndex * 3 + studentIndex) % firstNames.length];
      const last = lastNames[(classIndex * 2 + studentIndex * 3) % lastNames.length];
      return {
        id: `${className}-STU-${studentIndex + 1}`,
        name: `${first} ${last}`,
      };
    });
  });

  return rosters;
}

function buildExamDataset(examId: number): ExamDataset {
  const examConfig = examConfigsById[examId] ?? examConfigsById[1];
  const maxMarksPerSubject = examConfig.maxMarksPerSubject;
  const maxTotalMarks = maxMarksPerSubject * subjects.length;
  const classRecords: Record<string, ClassPerformance> = {};
  const schoolStudents: StudentPerformance[] = [];
  const schoolSubjectTotals = subjects.map(() => 0);

  const examBiasMap: Record<number, number> = {
    1: -0.5,
    2: 0.5,
    3: 1.5,
    4: 2.5,
  };

  Object.entries(classRosterMap).forEach(([className, roster]) => {
    const grade = Number(className.match(/\d+/)?.[0] ?? 0);
    const section = className.slice(-1);
    const rng = seededRandom(hashString(`${examId}-${className}`));
    const subjectTotals = subjects.map(() => 0);

    const students = roster
      .map((student, studentIndex) => {
        const roll = rng();
        const band = pickBand(grade, roll);
        const { min, max } = bandToBasePercent(band);
        const gradeBias = grade === 10 ? 3.5 : grade === 9 ? 0.75 : -2.5;
        const sectionBias = section === "A" ? 1.25 : 0.5;
        const examBias = examBiasMap[examId] ?? 0;
        const baseSubjectPercent = clamp(
          Math.round(min + rng() * (max - min) + gradeBias + sectionBias + examBias),
          18,
          98,
        );

        const subjectMarks = subjects.map((subject, subjectIndex) => {
          const subjectBias = [2.5, -1, 1.5, 0, -2][subjectIndex] ?? 0;
          const jitter = Math.round(rng() * 10 - 5);
          const finalPercent = clamp(
            Math.round(baseSubjectPercent + subjectBias + jitter - Math.floor(studentIndex / 22)),
            10,
            99,
          );
          const marks = clamp(Math.round((finalPercent / 100) * maxMarksPerSubject), 1, maxMarksPerSubject);
          subjectTotals[subjectIndex] += marks;
          schoolSubjectTotals[subjectIndex] += marks;
          return {
            subject,
            marks,
            maxMarks: maxMarksPerSubject,
            percentage: Math.round((marks / maxMarksPerSubject) * 100),
          };
        });

        const totalMarks = subjectMarks.reduce((sum, current) => sum + current.marks, 0);
        const percentage = Math.round((totalMarks / maxTotalMarks) * 100);

        return {
          id: student.id,
          name: student.name,
          className,
          section,
          percentage,
          totalMarks,
          maxMarks: maxTotalMarks,
          rank: 0,
          subjectMarks,
        };
      })
      .sort((a, b) => b.percentage - a.percentage)
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }));

    const totalStudents = students.length;
    const passCount = students.filter((student) => student.percentage >= 40).length;
    const failCount = totalStudents - passCount;
    const classAverage = Math.round(students.reduce((sum, student) => sum + student.percentage, 0) / totalStudents);
    const subjectAverages = subjects.map((subject, subjectIndex) => ({
      subject,
      percentage: Math.round((subjectTotals[subjectIndex] / totalStudents / maxMarksPerSubject) * 100),
    }));
    const highestSubject = subjectAverages.reduce((best, item) => (item.percentage > best.percentage ? item : best), subjectAverages[0]);
    const lowestSubject = subjectAverages.reduce((worst, item) => (item.percentage < worst.percentage ? item : worst), subjectAverages[0]);

    classRecords[className] = {
      className,
      totalStudents,
      passCount,
      failCount,
      passRate: Math.round((passCount / totalStudents) * 100),
      classAverage,
      highestSubject: highestSubject.subject,
      highestSubjectPercent: highestSubject.percentage,
      lowestSubject: lowestSubject.subject,
      lowestSubjectPercent: lowestSubject.percentage,
      subjectAverages,
      students,
    };

    schoolStudents.push(...students);
  });

  const totalStudents = schoolStudents.length;
  const passCount = schoolStudents.filter((student) => student.percentage >= 40).length;
  const failCount = totalStudents - passCount;
  const averagePercentage = Math.round(schoolStudents.reduce((sum, student) => sum + student.percentage, 0) / totalStudents);
  const schoolSubjectAverages = subjects.map((subject, subjectIndex) => ({
    subject,
    percentage: Math.round((schoolSubjectTotals[subjectIndex] / totalStudents / maxMarksPerSubject) * 100),
  }));
  const highestSubject = schoolSubjectAverages.reduce((best, item) => (item.percentage > best.percentage ? item : best), schoolSubjectAverages[0]);
  const lowestSubject = schoolSubjectAverages.reduce((worst, item) => (item.percentage < worst.percentage ? item : worst), schoolSubjectAverages[0]);
  const sortedStudents = [...schoolStudents].sort((a, b) => b.percentage - a.percentage);

  return {
    school: {
      totalStudents,
      averagePercentage,
      passedStudents: passCount,
      failedStudents: failCount,
      passRate: Math.round((passCount / totalStudents) * 100),
      highestSubject: highestSubject.subject,
      highestSubjectPercent: highestSubject.percentage,
      lowestSubject: lowestSubject.subject,
      lowestSubjectPercent: lowestSubject.percentage,
      subjectAverages: schoolSubjectAverages,
    },
    classes: classRecords,
    topStudents: sortedStudents.slice(0, 5),
    bottomStudents: sortedStudents.slice(-5).reverse(),
  };
}

function buildSubjectBreakdown(students: StudentPerformance[], subject: string): SubjectBreakdown {
  const subjectScores = students.map((student) => student.subjectMarks.find((item) => item.subject === subject)?.percentage ?? 0);
  const passed = subjectScores.filter((score) => score >= 40).length;
  const failed = subjectScores.length - passed;
  const goodMarks = subjectScores.filter((score) => score >= 70).length;
  const justPassed = subjectScores.filter((score) => score >= 40 && score <= 49).length;
  const averageMarks = subjectScores.filter((score) => score >= 50 && score <= 69).length;
  const averageScore = Math.round(subjectScores.reduce((sum, score) => sum + score, 0) / subjectScores.length);

  return {
    subject,
    totalStudents: subjectScores.length,
    passed,
    failed,
    goodMarks,
    justPassed,
    averageMarks,
    averageScore,
  };
}

function AcademicsPage() {
  const [selectedExam, setSelectedExam] = useState(1);
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [comparisonGrade, setComparisonGrade] = useState("9");
  const [comparisonSections, setComparisonSections] = useState<string[]>(["A"]);
  const [comparisonStudentId, setComparisonStudentId] = useState("");
  const [comparisonSubjects, setComparisonSubjects] = useState<string[]>([...subjects]);
  const [resourceSheet, setResourceSheet] = useState<{ examId: number; examName: string; subject: string; kind: "qp" | "answers" } | null>(null);

  const selectedExamMeta = exams.find((exam) => exam.id === selectedExam);
  const activeExamConfig = selectedExamMeta ? examConfigsById[selectedExamMeta.id] : null;
  const referenceExamId = selectedExamMeta ? comparisonReference[selectedExamMeta.id] : null;
  const referenceExamMeta = referenceExamId ? exams.find((exam) => exam.id === referenceExamId) : null;

  const currentExamData = useMemo(
    () => (selectedExamMeta?.status === "Conducted" ? buildExamDataset(selectedExamMeta.id) : null),
    [selectedExamMeta],
  );

  const referenceExamData = useMemo(
    () => (referenceExamMeta?.status === "Conducted" ? buildExamDataset(referenceExamMeta.id) : null),
    [referenceExamMeta],
  );

  const selectedClassData = currentExamData?.classes[selectedClass] ?? null;
  const selectedClassStudents = selectedClassData?.students ?? [];
  const topFiveStudents = selectedClassStudents.slice(0, 5);
  const bottomFiveStudents = selectedClassStudents.slice(-5).reverse();
  const subjectBreakdowns = selectedClassData ? subjects.map((subject) => buildSubjectBreakdown(selectedClassStudents, subject)) : [];
  const activeSubjectIndex = subjectBreakdowns.length ? selectedSubjectIndex % subjectBreakdowns.length : 0;
  const activeSubject = subjectBreakdowns[activeSubjectIndex] ?? null;
  const activeSubjectPieSegments = activeSubject
    ? [
        { label: "Failed", value: activeSubject.failed, color: "#ef4444" },
        { label: "Just passed", value: activeSubject.justPassed, color: "#f59e0b" },
        { label: "Average", value: activeSubject.averageMarks, color: "#38bdf8" },
        { label: "Good", value: activeSubject.goodMarks, color: "#22c55e" },
      ]
    : [];
  const activeSubjectPieTotal = activeSubjectPieSegments.reduce((sum, item) => sum + item.value, 0) || 1;
  const activeSubjectPieGradient = activeSubjectPieSegments.reduce((gradient, item, index) => {
    const start = activeSubjectPieSegments.slice(0, index).reduce((sum, segment) => sum + segment.value, 0);
    const end = start + item.value;
    const startPct = (start / activeSubjectPieTotal) * 100;
    const endPct = (end / activeSubjectPieTotal) * 100;
    const slice = `${item.color} ${startPct}% ${endPct}%`;
    return gradient ? `${gradient}, ${slice}` : slice;
  }, "");

  const comparisonClassNames = useMemo(
    () => comparisonSections.map((section) => `Class ${comparisonGrade}${section}`),
    [comparisonGrade, comparisonSections],
  );

  const comparisonStudentOptions = useMemo(() => {
    if (!currentExamData) return [];

    return comparisonClassNames.flatMap((className) => {
      const classData = currentExamData.classes[className];
      if (!classData) return [];

      return classData.students.map((student) => ({
        ...student,
        optionLabel: `${student.name} - ${className}`,
      }));
    });
  }, [comparisonClassNames, currentExamData]);

  useEffect(() => {
    if (!comparisonStudentOptions.length) {
      setComparisonStudentId("");
      return;
    }

    if (!comparisonStudentOptions.some((student) => student.id === comparisonStudentId)) {
      setComparisonStudentId(comparisonStudentOptions[0].id);
    }
  }, [comparisonStudentId, comparisonStudentOptions]);

  const comparisonSelectedStudent = comparisonStudentOptions.find((student) => student.id === comparisonStudentId) ?? comparisonStudentOptions[0] ?? null;
  const currentComparisonStudent = comparisonSelectedStudent && currentExamData
    ? currentExamData.classes[comparisonSelectedStudent.className]?.students.find((student) => student.id === comparisonSelectedStudent.id) ?? null
    : null;
  const previousComparisonStudent = comparisonSelectedStudent && referenceExamData
    ? referenceExamData.classes[comparisonSelectedStudent.className]?.students.find((student) => student.id === comparisonSelectedStudent.id) ?? null
    : null;

  const currentStats = currentExamData?.school ?? null;
  const hasConductedExam = exams.some((exam) => exam.status === "Conducted");
  const pendingExam = selectedExamMeta?.status === "Pending";
  const sheetExamConfig = resourceSheet ? examConfigsById[resourceSheet.examId] : null;

  const toggleComparisonSection = (section: string) => {
    setComparisonSections((current) => {
      if (current.includes(section)) {
        return current.length === 1 ? current : current.filter((item) => item !== section);
      }
      return [...current, section];
    });
  };

  const toggleComparisonSubject = (subject: string) => {
    setComparisonSubjects((current) => {
      if (current.includes(subject)) {
        return current.length === 1 ? current : current.filter((item) => item !== subject);
      }
      return [...current, subject];
    });
  };

  const openResourceSheet = (subject: string, kind: "qp" | "answers") => {
    if (!selectedExamMeta) return;
    setResourceSheet({ examId: selectedExamMeta.id, examName: selectedExamMeta.name, subject, kind });
  };

  const goToPrevSubject = () => {
    if (!subjectBreakdowns.length) return;
    setSelectedSubjectIndex((current) => (current - 1 + subjectBreakdowns.length) % subjectBreakdowns.length);
  };

  const goToNextSubject = () => {
    if (!subjectBreakdowns.length) return;
    setSelectedSubjectIndex((current) => (current + 1) % subjectBreakdowns.length);
  };

  return (
    <div>
      <PageHeader
        title="Exam Performance & Analytics"
        subtitle="Track exam results and student performance across classes."
      />

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">
          Overall School Performance - {selectedExamMeta?.name}
        </h2>
        {currentStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Total Students</p>
              <p className="text-3xl font-bold">{currentStats.totalStudents}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">School Average</p>
              <p className="text-3xl font-bold">{currentStats.averagePercentage}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Students Passed</p>
              <p className="text-3xl font-bold text-emerald-600">{currentStats.passedStudents}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Students Failed</p>
              <p className="text-3xl font-bold text-red-600">{currentStats.failedStudents}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Pass Rate</p>
              <p className="text-3xl font-bold text-blue-600">{currentStats.passRate}%</p>
            </Card>
          </div>
        ) : (
          <Card className="p-4 text-center bg-amber-50 border border-amber-200">
            <p className="text-amber-700 font-medium">
              Select a conducted exam to view overall school performance
            </p>
          </Card>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Exam Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {exams.map((exam) => (
            <Card
              key={exam.id}
              className={cn(
                "p-4 cursor-pointer transition-all border-2",
                selectedExam === exam.id ? "border-emerald-500 bg-emerald-50/70 shadow-sm" : "border-transparent hover:border-muted",
              )}
              onClick={() => setSelectedExam(exam.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">{exam.name}</h3>
                {exam.status === "Conducted" ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="size-5 text-amber-600" />
                )}
              </div>
              <Badge
                variant={exam.status === "Conducted" ? "secondary" : "outline"}
                className={
                  exam.status === "Conducted"
                    ? "bg-emerald-100 text-emerald-700 border-0"
                    : "bg-amber-100 text-amber-700 border-0"
                }
              >
                {exam.status}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">{exam.date}</p>
            </Card>
          ))}
        </div>
      </div>

      {!hasConductedExam ? (
        <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/20 bg-muted/20">
          <AlertCircle className="size-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No data available</h2>
          <p className="text-muted-foreground">
            Conduct an exam to unlock the overview, performance, and comparison tabs.
          </p>
        </Card>
      ) : pendingExam ? (
        <Card className="p-8 text-center border-2 border-dashed border-amber-200 bg-amber-50">
          <AlertCircle className="size-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-amber-900 mb-2">{selectedExamMeta?.name}</h2>
          <p className="text-amber-700">
            No data available yet. This exam is scheduled for {selectedExamMeta?.date}.
          </p>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="rounded-3xl border border-border/70 bg-white/70 p-3 shadow-sm backdrop-blur-xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Exam context</p>
                <h3 className="text-sm font-semibold">
                  {selectedExamMeta?.name} - Timeline: {selectedExamMeta?.date}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                  Main Class Filter: {selectedClass}
                </Badge>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[190px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(currentExamData.classes).map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TabsList className="flex h-auto flex-wrap gap-2 rounded-3xl border border-border/60 bg-white/70 p-2 shadow-sm backdrop-blur-xl">
            <TabsTrigger
              value="overview"
              className="rounded-2xl border border-transparent px-4 py-2.5 shadow-none transition-all data-[state=active]:border-emerald-400 data-[state=active]:bg-emerald-50 data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200/50 hover:-translate-y-0.5"
            >
              <BarChart3 className="mr-2 size-4" />
              Exam Overview
            </TabsTrigger>
            <TabsTrigger
              value="class-performance"
              className="rounded-2xl border border-transparent px-4 py-2.5 shadow-none transition-all data-[state=active]:border-emerald-400 data-[state=active]:bg-emerald-50 data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200/50 hover:-translate-y-0.5"
            >
              <Users className="mr-2 size-4" />
              Class Performance
            </TabsTrigger>
            <TabsTrigger
              value="top-students"
              className="rounded-2xl border border-transparent px-4 py-2.5 shadow-none transition-all data-[state=active]:border-emerald-400 data-[state=active]:bg-emerald-50 data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200/50 hover:-translate-y-0.5"
            >
              <Trophy className="mr-2 size-4" />
              Top 5 Performing Students
            </TabsTrigger>
            <TabsTrigger
              value="bottom-students"
              className="rounded-2xl border border-transparent px-4 py-2.5 shadow-none transition-all data-[state=active]:border-emerald-400 data-[state=active]:bg-emerald-50 data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200/50 hover:-translate-y-0.5"
            >
              <AlertCircle className="mr-2 size-4" />
              Bottom 5 Performing Students
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="rounded-2xl border border-transparent px-4 py-2.5 shadow-none transition-all data-[state=active]:border-emerald-400 data-[state=active]:bg-emerald-50 data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-200/50 hover:-translate-y-0.5"
            >
              <ArrowRightLeft className="mr-2 size-4" />
              Comparison with Last Exam
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-5 border-2 border-emerald-200 bg-emerald-50/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Exam overview</p>
                  <h2 className="text-lg font-semibold">{selectedExamMeta?.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeExamConfig?.label} exam - {activeExamConfig?.maxMarksPerSubject} marks per subject
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Timeline: {selectedExamMeta?.date}</p>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">
                  Conducted
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Total Marks</p>
                  <p className="text-2xl font-bold">
                    {(activeExamConfig?.maxMarksPerSubject ?? 0) * subjects.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Per Subject</p>
                  <p className="text-2xl font-bold">{activeExamConfig?.maxMarksPerSubject ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Subjects</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Duration</p>
                  <p className="text-2xl font-bold">{activeExamConfig?.duration ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">Classes</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
              </div>
            </Card>

            <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-4">
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">School-wide subject average</p>
                    <h3 className="text-lg font-semibold mt-1">Average score by subject</h3>
                    <p className="text-xs text-muted-foreground mt-1">Based on all 430 students</p>
                  </div>
                  <Badge variant="outline">All Classes</Badge>
                </div>
                <div className="mt-5 space-y-4">
                  {currentStats?.subjectAverages.map((item) => (
                    <div key={item.subject}>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>{item.subject}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Selected class context</p>
                    <h3 className="text-lg font-semibold mt-1">{selectedClass}</h3>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                    Live filter
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Class average</p>
                    <p className="text-2xl font-bold mt-1">{selectedClassData?.classAverage ?? 0}%</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Pass rate</p>
                    <p className="text-2xl font-bold mt-1">{selectedClassData?.passRate ?? 0}%</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Best subject</p>
                    <p className="text-sm font-semibold mt-1">{selectedClassData?.highestSubject ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">{selectedClassData?.highestSubjectPercent ?? 0}%</p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Weakest subject</p>
                    <p className="text-sm font-semibold mt-1">{selectedClassData?.lowestSubject ?? "-"}</p>
                    <p className="text-xs text-muted-foreground">{selectedClassData?.lowestSubjectPercent ?? 0}%</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="class-performance" className="space-y-4">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Class in view</p>
                  <h2 className="text-xl font-semibold mt-1">{selectedClass}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Filtered by the exam selection above. The numbers update across all exam tabs.
                  </p>
                </div>
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                  {selectedClassStudents.length} Students
                </Badge>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="rounded-2xl border bg-blue-50 p-3">
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{selectedClassData?.totalStudents ?? 0}</p>
                </div>
                <div className="rounded-2xl border bg-emerald-50 p-3">
                  <p className="text-xs text-muted-foreground">Passed</p>
                  <p className="text-2xl font-bold text-emerald-700 mt-1">{selectedClassData?.passCount ?? 0}</p>
                </div>
                <div className="rounded-2xl border bg-red-50 p-3">
                  <p className="text-xs text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-700 mt-1">{selectedClassData?.failCount ?? 0}</p>
                </div>
                <div className="rounded-2xl border bg-violet-50 p-3">
                  <p className="text-xs text-muted-foreground">Class Avg</p>
                  <p className="text-2xl font-bold text-violet-700 mt-1">{selectedClassData?.classAverage ?? 0}%</p>
                </div>
                <div className="rounded-2xl border bg-amber-50 p-3">
                  <p className="text-xs text-muted-foreground">Pass Rate</p>
                  <p className="text-2xl font-bold text-amber-700 mt-1">{selectedClassData?.passRate ?? 0}%</p>
                </div>
              </div>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-white/70 p-3 shadow-sm backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                  Subject-wise breakdown
                </Badge>
                <Select
                  value={activeSubject?.subject ?? subjects[0]}
                  onValueChange={(value) => {
                    const index = subjects.findIndex((subject) => subject === value);
                    if (index >= 0) setSelectedSubjectIndex(index);
                  }}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={goToPrevSubject}>
                  Previous
                </Button>
                <Button size="sm" variant="outline" onClick={goToNextSubject}>
                  Next
                </Button>
                <Badge variant="secondary" className="bg-muted/60">
                  {activeSubjectIndex + 1}/{subjects.length}
                </Badge>
              </div>
            </div>

            {activeSubject && (
              <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
                <Card className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Subject view</p>
                      <h3 className="text-lg font-semibold mt-1">{activeSubject.subject}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activeSubject.averageScore}% average across {activeSubject.totalStudents} students
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">
                      Updated for {selectedClass}
                    </Badge>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/80 border p-3">
                      <p className="text-xs text-muted-foreground">Passed</p>
                      <p className="text-2xl font-bold text-emerald-700 mt-1">{activeSubject.passed}</p>
                    </div>
                    <div className="rounded-2xl bg-white/80 border p-3">
                      <p className="text-xs text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-red-700 mt-1">{activeSubject.failed}</p>
                    </div>
                    <div className="rounded-2xl bg-white/80 border p-3">
                      <p className="text-xs text-muted-foreground">Good marks</p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">{activeSubject.goodMarks}</p>
                    </div>
                    <div className="rounded-2xl bg-white/80 border p-3">
                      <p className="text-xs text-muted-foreground">Just passed</p>
                      <p className="text-2xl font-bold text-amber-700 mt-1">{activeSubject.justPassed}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-muted/20 border p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average marks</span>
                      <span className="font-semibold">{activeSubject.averageMarks}</span>
                    </div>
                    <Progress value={activeSubject.averageScore} className="mt-2 h-2" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openResourceSheet(activeSubject.subject, "qp")}>
                      Open QP
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openResourceSheet(activeSubject.subject, "answers")}>
                      Open Answer Sheet
                    </Button>
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Subject distribution</p>
                      <h3 className="text-lg font-semibold mt-1">Results pie chart</h3>
                    </div>
                    <Badge variant="outline">Pass/Fail mix</Badge>
                  </div>

                  <div className="mt-5 flex justify-center">
                    <div
                      className="size-44 rounded-full shadow-inner"
                      style={{ background: `conic-gradient(${activeSubjectPieGradient})` }}
                      aria-label={`${activeSubject.subject} performance distribution chart`}
                    />
                  </div>

                  <div className="mt-5 space-y-2">
                    {activeSubjectPieSegments.map((segment) => (
                      <div key={segment.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="size-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                          <span>{segment.label}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {segment.value} ({Math.round((segment.value / activeSubjectPieTotal) * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="top-students" className="space-y-4">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Top performers</p>
                  <h2 className="text-xl font-semibold mt-1">Top 5 Performing Students</h2>
                  <p className="text-sm text-muted-foreground mt-1">Showing the top results for {selectedClass}.</p>
                </div>
                <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                  Ranked list
                </Badge>
              </div>

              <div className="mt-5 space-y-2">
                {topFiveStudents.map((student) => (
                  <div key={student.id} className="rounded-2xl border p-4 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{student.name}</p>
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">{student.percentage}%</Badge>
                          <Badge variant="outline">{student.rank}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {student.totalMarks} / {student.maxMarks} Marks - {student.className}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                      >
                        {expandedStudent === student.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </Button>
                    </div>

                    {expandedStudent === student.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        {student.subjectMarks.map((subject) => (
                          <div key={subject.subject} className="grid grid-cols-[1.2fr_1fr_90px] items-center gap-3 text-sm">
                            <span className="text-muted-foreground">{subject.subject}</span>
                            <Progress value={subject.percentage} className="h-2" />
                            <div className="text-right font-medium">
                              {subject.marks}/{subject.maxMarks}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bottom-students" className="space-y-4">
            <Card className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Low performers</p>
                  <h2 className="text-xl font-semibold mt-1">Bottom 5 Performing Students</h2>
                  <p className="text-sm text-muted-foreground mt-1">Showing the lowest results for {selectedClass}.</p>
                </div>
                <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700">
                  Attention list
                </Badge>
              </div>

              <div className="mt-5 space-y-2">
                {bottomFiveStudents.map((student) => (
                  <div key={student.id} className="rounded-2xl border border-red-200 bg-red-50/70 p-4 hover:bg-red-100/70 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{student.name}</p>
                          <Badge className="bg-red-200 text-red-700 border-0">{student.percentage}%</Badge>
                          <Badge variant="outline">{student.rank}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {student.totalMarks} / {student.maxMarks} Marks - {student.className}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                      >
                        {expandedStudent === student.id ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </Button>
                    </div>

                    {expandedStudent === student.id && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        {student.subjectMarks.map((subject) => (
                          <div key={subject.subject} className="grid grid-cols-[1.2fr_1fr_90px] items-center gap-3 text-sm">
                            <span className="text-muted-foreground">{subject.subject}</span>
                            <Progress value={subject.percentage} className="h-2" />
                            <div className="text-right font-medium">
                              {subject.marks}/{subject.maxMarks}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            {!referenceExamData ? (
              <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/20 bg-muted/20">
                <ArrowRightLeft className="size-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No comparison available</h2>
                <p className="text-muted-foreground">
                  {selectedExamMeta?.name} does not have a previous conducted exam to compare with.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Current exam</p>
                        <h3 className="text-lg font-semibold mt-1">{selectedExamMeta?.name}</h3>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">Current</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Average</p>
                        <p className="text-2xl font-bold mt-1">{currentStats?.averagePercentage ?? 0}%</p>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Pass rate</p>
                        <p className="text-2xl font-bold mt-1">{currentStats?.passRate ?? 0}%</p>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Top subject</p>
                        <p className="text-sm font-semibold mt-1">{currentStats?.highestSubject ?? "-"}</p>
                        <p className="text-xs text-muted-foreground">{currentStats?.highestSubjectPercent ?? 0}%</p>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Weak subject</p>
                        <p className="text-sm font-semibold mt-1">{currentStats?.lowestSubject ?? "-"}</p>
                        <p className="text-xs text-muted-foreground">{currentStats?.lowestSubjectPercent ?? 0}%</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Last exam</p>
                        <h3 className="text-lg font-semibold mt-1">{referenceExamMeta?.name}</h3>
                      </div>
                      <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700">
                        Reference
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Average</p>
                        <p className="text-2xl font-bold mt-1">{referenceExamData.school.averagePercentage}%</p>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Pass rate</p>
                        <p className="text-2xl font-bold mt-1">{referenceExamData.school.passRate}%</p>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Top subject</p>
                        <p className="text-sm font-semibold mt-1">{referenceExamData.school.highestSubject}</p>
                        <p className="text-xs text-muted-foreground">{referenceExamData.school.highestSubjectPercent}%</p>
                      </div>
                      <div className="rounded-2xl border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Weak subject</p>
                        <p className="text-sm font-semibold mt-1">{referenceExamData.school.lowestSubject}</p>
                        <p className="text-xs text-muted-foreground">{referenceExamData.school.lowestSubjectPercent}%</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Comparison controls</p>
                      <h3 className="text-lg font-semibold mt-1">Build a side by side comparison</h3>
                    </div>
                    <Badge variant="outline">Independent of the main class filter</Badge>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
                    <div className="space-y-4 rounded-2xl border bg-muted/20 p-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Class</Label>
                        <Select value={comparisonGrade} onValueChange={setComparisonGrade}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">Class 10</SelectItem>
                            <SelectItem value="9">Class 9</SelectItem>
                            <SelectItem value="8">Class 8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Section</Label>
                        <div className="mt-2 space-y-2">
                          {["A", "B"].map((section) => (
                            <div key={section} className="flex items-center gap-2">
                              <Checkbox
                                id={`section-${section}`}
                                checked={comparisonSections.includes(section)}
                                onCheckedChange={() => toggleComparisonSection(section)}
                              />
                              <Label htmlFor={`section-${section}`} className="text-sm font-normal">
                                Section {section}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Student</Label>
                        <Select
                          value={comparisonStudentId}
                          onValueChange={setComparisonStudentId}
                          disabled={!comparisonStudentOptions.length}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select student" />
                          </SelectTrigger>
                          <SelectContent>
                            {comparisonStudentOptions.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.optionLabel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Subjects</Label>
                        <div className="mt-2 space-y-2">
                          {subjects.map((subject) => (
                            <div key={subject} className="flex items-center gap-2">
                              <Checkbox
                                id={`subject-${subject}`}
                                checked={comparisonSubjects.includes(subject)}
                                onCheckedChange={() => toggleComparisonSubject(subject)}
                              />
                              <Label htmlFor={`subject-${subject}`} className="text-sm font-normal">
                                {subject}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {comparisonSelectedStudent && currentComparisonStudent && previousComparisonStudent ? (
                        <>
                          <Card className="p-5 border-2 border-emerald-200 bg-emerald-50/50">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Selected comparison</p>
                                <h4 className="text-lg font-semibold mt-1">
                                  {comparisonSelectedStudent.name} - {comparisonSelectedStudent.className}
                                </h4>
                              </div>
                              <Badge variant="outline">
                                {comparisonSubjects.length} subject{comparisonSubjects.length === 1 ? "" : "s"} selected
                              </Badge>
                            </div>
                          </Card>

                          <div className="grid lg:grid-cols-2 gap-4">
                            <Card className="p-5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-muted-foreground">Current exam</p>
                                  <h4 className="font-semibold mt-1">{selectedExamMeta?.name}</h4>
                                </div>
                                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                  {currentComparisonStudent.percentage}%
                                </Badge>
                              </div>
                              <div className="mt-4 space-y-3">
                                {comparisonSubjects.map((subject) => {
                                  const subjectData = currentComparisonStudent.subjectMarks.find((item) => item.subject === subject);
                                  if (!subjectData) return null;
                                  return (
                                    <div key={subject} className="rounded-2xl border bg-muted/20 p-3">
                                      <div className="flex items-center justify-between text-sm">
                                        <span>{subject}</span>
                                        <span className="font-medium">
                                          {subjectData.marks}/{subjectData.maxMarks}
                                        </span>
                                      </div>
                                      <Progress value={subjectData.percentage} className="mt-2 h-2" />
                                    </div>
                                  );
                                })}
                              </div>
                            </Card>

                            <Card className="p-5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-muted-foreground">Last exam</p>
                                  <h4 className="font-semibold mt-1">{referenceExamMeta?.name}</h4>
                                </div>
                                <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700">
                                  {previousComparisonStudent.percentage}%
                                </Badge>
                              </div>
                              <div className="mt-4 space-y-3">
                                {comparisonSubjects.map((subject) => {
                                  const subjectData = previousComparisonStudent.subjectMarks.find((item) => item.subject === subject);
                                  if (!subjectData) return null;
                                  return (
                                    <div key={subject} className="rounded-2xl border bg-muted/20 p-3">
                                      <div className="flex items-center justify-between text-sm">
                                        <span>{subject}</span>
                                        <span className="font-medium">
                                          {subjectData.marks}/{subjectData.maxMarks}
                                        </span>
                                      </div>
                                      <Progress value={subjectData.percentage} className="mt-2 h-2" />
                                    </div>
                                  );
                                })}
                              </div>
                            </Card>
                          </div>

                          <Card className="p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">Side by side subject delta</p>
                                <h4 className="font-semibold mt-1">Marks comparison</h4>
                              </div>
                              <Badge variant="secondary">Current vs last exam</Badge>
                            </div>

                            <div className="mt-5 space-y-3">
                              {comparisonSubjects.map((subject) => {
                                const currentSubject = currentComparisonStudent.subjectMarks.find((item) => item.subject === subject);
                                const previousSubject = previousComparisonStudent.subjectMarks.find((item) => item.subject === subject);
                                if (!currentSubject || !previousSubject) return null;

                                const delta = currentSubject.marks - previousSubject.marks;

                                return (
                                  <div
                                    key={subject}
                                    className="grid gap-3 rounded-2xl border bg-muted/20 p-3 lg:grid-cols-[1.2fr_1fr_1fr_120px]"
                                  >
                                    <div className="font-medium">{subject}</div>
                                    <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                                      <span className="text-xs text-muted-foreground">Current</span>
                                      <span className="font-semibold">{currentSubject.marks}/{currentSubject.maxMarks}</span>
                                    </div>
                                    <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2">
                                      <span className="text-xs text-muted-foreground">Last</span>
                                      <span className="font-semibold">{previousSubject.marks}/{previousSubject.maxMarks}</span>
                                    </div>
                                    <div
                                      className={cn(
                                        "rounded-xl px-3 py-2 text-center font-semibold",
                                        delta >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700",
                                      )}
                                    >
                                      {delta >= 0 ? "+" : ""}
                                      {delta}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </Card>
                        </>
                      ) : (
                        <Card className="p-8 text-center border-dashed bg-muted/20">
                          <AlertCircle className="size-10 text-muted-foreground mx-auto mb-3" />
                          <p className="font-medium">Select a student to start the comparison</p>
                        </Card>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Sheet open={!!resourceSheet} onOpenChange={(open) => !open && setResourceSheet(null)}>
        <SheetContent side="right" className="w-[min(96vw,640px)] overflow-hidden">
          {resourceSheet && (
            <div className="h-full flex flex-col pt-6">
              <SheetHeader className="mb-4 pr-6">
                <SheetTitle>
                  {resourceSheet.kind === "qp" ? "Question Paper" : "Answer Sheet"}
                </SheetTitle>
                <SheetDescription>
                  {resourceSheet.examName} - {resourceSheet.subject}
                </SheetDescription>
              </SheetHeader>

              <div className="h-full overflow-y-auto pr-3 space-y-4">
                <Card className="p-4 border-emerald-200 bg-emerald-50/40">
                  <p className="text-xs text-muted-foreground">Exam</p>
                  <p className="font-semibold mt-1">{resourceSheet.examName}</p>
                  <p className="text-xs text-muted-foreground mt-3">Subject</p>
                  <p className="font-semibold mt-1">{resourceSheet.subject}</p>
                </Card>

                {resourceSheet.kind === "qp" ? (
                  <>
                    <Card className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Paper details</p>
                        <Badge variant="outline">Mock preview</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl border bg-muted/20 p-3">
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold mt-1">{sheetExamConfig?.duration ?? "45 minutes"}</p>
                        </div>
                        <div className="rounded-xl border bg-muted/20 p-3">
                          <p className="text-xs text-muted-foreground">Max marks</p>
                          <p className="font-semibold mt-1">{sheetExamConfig?.maxMarksPerSubject ?? 20}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <p className="font-semibold">Sections</p>
                      <div className="space-y-2 text-sm">
                        <div className="rounded-xl border bg-muted/20 p-3">Section A - Objective questions</div>
                        <div className="rounded-xl border bg-muted/20 p-3">Section B - Short answers</div>
                        <div className="rounded-xl border bg-muted/20 p-3">Section C - Long answers</div>
                      </div>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <p className="font-semibold">Instructions</p>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        <li>Attempt all questions.</li>
                        <li>Write answers clearly and show working where needed.</li>
                        <li>Use the answer booklet for rough work only.</li>
                      </ul>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Marking scheme</p>
                        <Badge variant="outline">Reference</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="rounded-xl border bg-muted/20 p-3">Full marks for correct concept and working.</div>
                        <div className="rounded-xl border bg-muted/20 p-3">Partial credit for method with minor mistakes.</div>
                        <div className="rounded-xl border bg-muted/20 p-3">No credit for unsupported final answers.</div>
                      </div>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <p className="font-semibold">Model answers</p>
                      <div className="space-y-2 text-sm">
                        <div className="rounded-xl border bg-muted/20 p-3">Q1 - Key concept explanation and formula.</div>
                        <div className="rounded-xl border bg-muted/20 p-3">Q2 - Step-by-step working with final answer.</div>
                        <div className="rounded-xl border bg-muted/20 p-3">Q3 - Expected response with keywords highlighted.</div>
                      </div>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <p className="font-semibold">Evaluator notes</p>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        <li>Give credit for correct method even if arithmetic slips occur.</li>
                        <li>Keep marking consistent across all answer sheets.</li>
                      </ul>
                    </Card>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
