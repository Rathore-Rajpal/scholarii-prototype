// ============================================================
// PER-CLASS EXAM DATA — scoped to teacher visibility rules
// ============================================================

import {
  CLASS_EXAMS,
  EXAM_AI_INSIGHTS,
  EXAM_AI_SUGGESTIONS,
  type AnalyticsData,
  type ExamEntry,
  type StudentResult,
} from "./myclass-exams-mock-data";
import { EXAM_ANALYTICS, STUDENT_RESULTS } from "./myclass-exams-students";

export interface ClassExamBundle {
  exams: ExamEntry[];
  students: StudentResult[];
  analytics: AnalyticsData;
  aiInsights: typeof EXAM_AI_INSIGHTS;
  aiSuggestions: typeof EXAM_AI_SUGGESTIONS;
}

function cloneExamsForRoom(exams: ExamEntry[], room: string): ExamEntry[] {
  return exams.map((exam) => ({
    ...exam,
    timetable: exam.timetable.map((slot) => ({ ...slot, room })),
  }));
}

function filterExamsBySubjects(exams: ExamEntry[], subjects: string[]): ExamEntry[] {
  return exams.map((exam) => ({
    ...exam,
    timetable: exam.timetable.filter((slot) => subjects.includes(slot.subject)),
    syllabus: exam.syllabus.filter((item) => subjects.includes(item.subject)),
    results: exam.results.filter((item) => subjects.includes(item.subject)),
    questionPaper: exam.questionPaper.filter((item) => subjects.includes(item.subject)),
  }));
}

function filterStudentsBySubjects(students: StudentResult[], subjects: string[]): StudentResult[] {
  return students.map((student) => {
    const visibleSubjects = student.subjects.filter((s) => subjects.includes(s.name));
    const total = visibleSubjects.reduce((sum, s) => sum + s.marks, 0);
    const maxTotal = visibleSubjects.reduce((sum, s) => sum + s.max, 0);
    const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
    return {
      ...student,
      subjects: visibleSubjects,
      total,
      maxTotal,
      percentage,
      strengths: student.strengths.filter((s) => subjects.includes(s)),
      weaknesses: student.weaknesses.filter((s) => subjects.includes(s)),
    };
  });
}

function filterAnalytics(analytics: AnalyticsData, subjects: string[]): AnalyticsData {
  return {
    ...analytics,
    subjectPerf: analytics.subjectPerf.filter((s) => subjects.includes(s.subject)),
    examReadiness: analytics.examReadiness.filter((s) => subjects.includes(s.subject)),
    monthlyTrend: analytics.monthlyTrend.map((item, index) => ({
      ...item,
      avg: Math.round(item.avg + index * 2 + subjects.length),
    })),
  };
}

const EXAMS_9A = cloneExamsForRoom(filterExamsBySubjects(CLASS_EXAMS, ["Mathematics"]), "9-A");
const EXAMS_10B = cloneExamsForRoom(filterExamsBySubjects(CLASS_EXAMS, ["Mathematics"]), "10-B");
const EXAMS_11A = cloneExamsForRoom(
  filterExamsBySubjects(
    CLASS_EXAMS.map((exam) => ({
      ...exam,
      timetable: exam.timetable.map((slot) =>
        slot.subject === "Mathematics"
          ? { ...slot, subject: "Computer Science" }
          : slot,
      ),
      syllabus: exam.syllabus.map((item) =>
        item.subject === "Mathematics"
          ? {
              ...item,
              subject: "Computer Science",
              chapters: ["Python Basics", "Control Flow", "Data Structures"],
            }
          : item,
      ),
      results: exam.results.map((item) =>
        item.subject === "Mathematics" ? { ...item, subject: "Computer Science" } : item,
      ),
      questionPaper: exam.questionPaper.map((item) =>
        item.subject === "Mathematics"
          ? {
              ...item,
              subject: "Computer Science",
              files: item.files.map((file) => ({
                ...file,
                name: file.name.replace("Mathematics", "Computer Science"),
              })),
            }
          : item,
      ),
    })),
    ["Computer Science"],
  ),
  "11-A",
);

const STUDENTS_9A = filterStudentsBySubjects(STUDENT_RESULTS, ["Mathematics"]).map((s, i) => ({
  ...s,
  id: `9a-${s.id}`,
  roll: i + 1,
  rank: i + 1,
}));

const STUDENTS_10B = filterStudentsBySubjects(STUDENT_RESULTS, ["Mathematics"]).map((s, i) => ({
  ...s,
  id: `10b-${s.id}`,
  roll: i + 1,
  rank: i + 1,
  percentage: Math.max(55, s.percentage - 4 + (i % 3)),
}));

const STUDENTS_11A = filterStudentsBySubjects(STUDENT_RESULTS, ["Mathematics"]).map((s, i) => ({
  ...s,
  id: `11a-${s.id}`,
  roll: i + 1,
  rank: i + 1,
  subjects: s.subjects.map((sub) => ({ ...sub, name: "Computer Science" })),
  strengths: s.strengths.map((str) => (str === "Mathematics" ? "Computer Science" : str)),
  weaknesses: s.weaknesses.map((str) => (str === "Mathematics" ? "Computer Science" : str)),
  percentage: Math.min(96, s.percentage + 3 - (i % 2)),
}));

const ANALYTICS_9A = filterAnalytics(EXAM_ANALYTICS, ["Mathematics"]);
const ANALYTICS_10B = filterAnalytics(EXAM_ANALYTICS, ["Mathematics"]);
const ANALYTICS_11A = filterAnalytics(
  {
    ...EXAM_ANALYTICS,
    subjectPerf: EXAM_ANALYTICS.subjectPerf.map((s) =>
      s.subject === "Mathematics"
        ? { ...s, subject: "Computer Science", avg: s.avg + 4, highest: s.highest + 2 }
        : s,
    ),
    examReadiness: EXAM_ANALYTICS.examReadiness.map((s) =>
      s.subject === "Mathematics" ? { ...s, subject: "Computer Science", readiness: 84 } : s,
    ),
  },
  ["Computer Science"],
);

export const CLASS_EXAM_BUNDLES: Record<string, ClassExamBundle> = {
  "8-a": {
    exams: CLASS_EXAMS,
    students: STUDENT_RESULTS,
    analytics: EXAM_ANALYTICS,
    aiInsights: EXAM_AI_INSIGHTS,
    aiSuggestions: EXAM_AI_SUGGESTIONS,
  },
  "9-a": {
    exams: EXAMS_9A,
    students: STUDENTS_9A,
    analytics: ANALYTICS_9A,
    aiInsights: [
      { text: "4 students need Mathematics support in 9-A.", type: "warning" as const },
      { text: "Mathematics average improved by 6% since UT-1.", type: "success" as const },
      { text: "2 students are at risk in Mathematics.", type: "warning" as const },
      { text: "Attendance dips are affecting Mathematics scores.", type: "info" as const },
      { text: "Final exam readiness for Mathematics: 76%.", type: "success" as const },
    ],
    aiSuggestions: [
      "Schedule a Polynomials revision session.",
      "Focus on word problems in Algebra.",
      "Conduct one Mathematics mock test.",
    ],
  },
  "10-b": {
    exams: EXAMS_10B,
    students: STUDENTS_10B,
    analytics: ANALYTICS_10B,
    aiInsights: [
      { text: "3 students need Trigonometry support in 10-B.", type: "warning" as const },
      { text: "Mathematics performance is stable at 79%.", type: "success" as const },
      { text: "2 students are at risk in Mathematics.", type: "warning" as const },
      { text: "Low attendance correlates with lower Mathematics marks.", type: "info" as const },
      { text: "Board exam readiness for Mathematics: 81%.", type: "success" as const },
    ],
    aiSuggestions: [
      "Schedule a Trigonometry revision class.",
      "Focus on application-based questions.",
      "Run one full-length Mathematics practice test.",
    ],
  },
  "11-a": {
    exams: EXAMS_11A,
    students: STUDENTS_11A,
    analytics: ANALYTICS_11A,
    aiInsights: [
      { text: "3 students need Data Structures support in 11-A.", type: "warning" as const },
      { text: "Computer Science scores improved by 7%.", type: "success" as const },
      { text: "1 student is at risk in Computer Science.", type: "warning" as const },
      { text: "Practical lab attendance is impacting scores.", type: "info" as const },
      { text: "Final exam readiness for Computer Science: 85%.", type: "success" as const },
    ],
    aiSuggestions: [
      "Schedule a Python revision lab session.",
      "Focus on recursion and data structures.",
      "Conduct one programming mock test.",
    ],
  },
};

export function getClassExamBundle(scopeId: string): ClassExamBundle {
  return CLASS_EXAM_BUNDLES[scopeId] ?? CLASS_EXAM_BUNDLES["8-a"];
}
