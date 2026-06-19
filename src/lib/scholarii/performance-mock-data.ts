// ============================================================
// CLASS PERFORMANCE MOCK DATA — scoped to Class Teacher 8-A
// ============================================================

import { STUDENT_RESULTS, EXAM_ANALYTICS } from "./myclass-exams-students";

export interface PerformanceStudent {
  id: string;
  name: string;
  roll: number;
  gender: "Male" | "Female";
  average: number;
  attendance: number;
  rank: number;
  badge: "top" | "at-risk" | "stable";
  subjects: { name: string; marks: number; max: number; grade: string }[];
  examHistory: { exam: string; percentage: number; rank: number }[];
  strengths: string[];
  weaknesses: string[];
}

export interface SubjectPerformance {
  name: string;
  emoji: string;
  average: number;
  highest: number;
  lowest: number;
  atRisk: number;
  upcomingExam: string;
  passRate: number;
}

export interface InterventionStudent {
  id: string;
  name: string;
  roll: number;
  attendance: number;
  average: number;
  reason: string;
  suggestedAction: string;
  severity: "high" | "medium" | "low";
}

export interface AIInsight {
  text: string;
  type: "warning" | "success" | "info";
}

export const CLASS_PERFORMANCE_STUDENTS: PerformanceStudent[] = STUDENT_RESULTS.map((s) => ({
  id: s.id,
  name: s.name,
  roll: s.roll,
  gender: s.gender,
  average: s.percentage,
  attendance: s.attendance,
  rank: s.rank,
  badge: s.status,
  subjects: s.subjects,
  examHistory: s.examHistory,
  strengths: s.strengths,
  weaknesses: s.weaknesses,
}));

export const SUBJECT_PERFORMANCE: SubjectPerformance[] = [
  { name: "Mathematics", emoji: "📐", average: 76, highest: 95, lowest: 48, atRisk: 5, upcomingExam: "Friday", passRate: 92 },
  { name: "Science", emoji: "🔬", average: 79, highest: 92, lowest: 55, atRisk: 2, upcomingExam: "Monday", passRate: 96 },
  { name: "English", emoji: "📖", average: 82, highest: 94, lowest: 62, atRisk: 1, upcomingExam: "Wednesday", passRate: 100 },
  { name: "Hindi", emoji: "📝", average: 77, highest: 90, lowest: 60, atRisk: 3, upcomingExam: "Thursday", passRate: 96 },
  { name: "Social Science", emoji: "🌍", average: 79, highest: 89, lowest: 65, atRisk: 2, upcomingExam: "Next Week", passRate: 92 },
];

export const INTERVENTION_STUDENTS: InterventionStudent[] = [
  { id: "s3", name: "Rohan Gupta", roll: 3, attendance: 78, average: 62, reason: "Average below 65% + low attendance", suggestedAction: "Schedule parent meeting & assign extra practice", severity: "high" },
  { id: "s8", name: "Divya Joshi", roll: 8, attendance: 76, average: 58, reason: "Average below 60% + attendance < 80%", suggestedAction: "Generate study plan & contact parent", severity: "high" },
  { id: "s12", name: "Simran Kaur", roll: 12, attendance: 82, average: 68, reason: "Continuous score drop from UT-1", suggestedAction: "Assign extra work & schedule PTA", severity: "medium" },
  { id: "s7", name: "Karthik Menon", roll: 7, attendance: 85, average: 73, reason: "Multiple subjects below 75%", suggestedAction: "Assign practice worksheets", severity: "low" },
];

export const PERFORMANCE_AI_INSIGHTS: AIInsight[] = [
  { text: "5 students need Mathematics support.", type: "warning" },
  { text: "Attendance is affecting performance for 3 students.", type: "info" },
  { text: "Science performance improved by 8% since Unit Test 1.", type: "success" },
  { text: "3 students may need additional revision before Unit Test 2.", type: "warning" },
  { text: "Class readiness for Final Exam: 82%.", type: "success" },
  { text: "English is the strongest subject with 100% pass rate.", type: "success" },
];

export const PERFORMANCE_AI_SUGGESTIONS = [
  "Conduct Algebra revision session this week.",
  "Schedule one practice test for Mathematics.",
  "Provide additional worksheets for at-risk students.",
  "Recommend parent intervention for 2 students.",
];

export const QUICK_ACTIONS = [
  { label: "Generate Performance Report", icon: "FileText", color: "text-violet-600 bg-violet-500/10" },
  { label: "Contact Parent", icon: "Phone", color: "text-sky-600 bg-sky-500/10" },
  { label: "Schedule PTA", icon: "Calendar", color: "text-emerald-600 bg-emerald-500/10" },
  { label: "Assign Extra Work", icon: "BookOpen", color: "text-amber-600 bg-amber-500/10" },
  { label: "Generate Study Plan", icon: "Brain", color: "text-violet-600 bg-violet-500/10" },
  { label: "Open AI Assistant", icon: "Sparkles", color: "text-violet-600 bg-violet-500/10" },
];

export const STRENGTH_AREAS = ["Science", "English", "Computer Science"];
export const FOCUS_AREAS = ["Mathematics", "Social Science"];
