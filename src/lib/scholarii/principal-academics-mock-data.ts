export type ExamStatus = "conducted" | "ongoing" | "upcoming";

export interface Exam {
  id: string;
  name: string;
  shortName: string;
  status: ExamStatus;
  dateRange: string;
  duration: string;
  subjectsCount: number;
  classesCovered: string[];
  timetableReady: boolean;
  resultStatus: string;
}

export interface TimetableEntry {
  subject: string;
  date: string;
  time: string;
  duration: string;
  syllabus: string;
}

export interface SubjectPerformance {
  subject: string;
  average: number;
  highest: number;
  lowest: number;
  passRate: number;
}

export interface ClassPerformance {
  className: string;
  average: number;
  passRate: number;
  failRate: number;
  atRisk: number;
  totalStudents: number;
  passed: number;
  failed: number;
}

export interface StudentRank {
  rank: number;
  name: string;
  className: string;
  percentage: number;
  attendance: number;
  marks: Record<string, number>;
}

export interface AIInsight {
  id: string;
  text: string;
  type: "warning" | "success" | "info" | "danger";
  icon: string;
}

export const EXAMS: Exam[] = [
  {
    id: "unit1",
    name: "Unit Test - 1",
    shortName: "Unit-1",
    status: "conducted",
    dateRange: "15 May — 18 May 2026",
    duration: "2 Hours",
    subjectsCount: 6,
    classesCovered: ["6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"],
    timetableReady: true,
    resultStatus: "Result Declared",
  },
  {
    id: "midsem",
    name: "Mid-Semester Exam",
    shortName: "Mid Sem",
    status: "conducted",
    dateRange: "10 June — 18 June 2026",
    duration: "3 Hours",
    subjectsCount: 6,
    classesCovered: ["6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"],
    timetableReady: true,
    resultStatus: "Result Declared",
  },
  {
    id: "unit2",
    name: "Unit Test - 2",
    shortName: "Unit-2",
    status: "ongoing",
    dateRange: "1 July — 4 July 2026",
    duration: "2 Hours",
    subjectsCount: 6,
    classesCovered: ["6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"],
    timetableReady: true,
    resultStatus: "Awaiting Results",
  },
  {
    id: "final",
    name: "Final Examination",
    shortName: "Final",
    status: "upcoming",
    dateRange: "15 Nov — 28 Nov 2026",
    duration: "3 Hours",
    subjectsCount: 6,
    classesCovered: ["6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"],
    timetableReady: false,
    resultStatus: "Awaiting Results",
  },
];

export const TIMETABLES: Record<string, TimetableEntry[]> = {
  unit1: [
    { subject: "English", date: "2026-05-10", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "Chapters 1-4, Poetry Section" },
    { subject: "Mathematics", date: "2026-05-12", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "Algebra, Linear Equations" },
    { subject: "Science", date: "2026-05-14", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "Physics: Motion, Chemistry: Atoms" },
    { subject: "Social Science", date: "2026-05-16", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "History: Nationalism, Geography: Climate" },
    { subject: "Hindi", date: "2026-05-18", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "गद्य खंड, पद्य खंड" },
    { subject: "Computer", date: "2026-05-20", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "HTML Basics, MS Office" },
  ],
  midsem: [
    { subject: "English", date: "2026-06-02", time: "09:00 - 12:00", duration: "3 hrs", syllabus: "Full Syllabus (Chapters 1-8)" },
    { subject: "Mathematics", date: "2026-06-04", time: "09:00 - 12:00", duration: "3 hrs", syllabus: "Full Syllabus (Algebra + Geometry)" },
    { subject: "Science", date: "2026-06-06", time: "09:00 - 12:00", duration: "3 hrs", syllabus: "Full Syllabus (Physics + Chemistry + Bio)" },
    { subject: "Social Science", date: "2026-06-08", time: "09:00 - 12:00", duration: "3 hrs", syllabus: "Full Syllabus (History + Geography + Civics)" },
    { subject: "Hindi", date: "2026-06-10", time: "09:00 - 12:00", duration: "3 hrs", syllabus: "Full Syllabus (गद्य + पद्य + व्याकरण)" },
    { subject: "Computer", date: "2026-06-12", time: "09:00 - 12:00", duration: "3 hrs", syllabus: "Full Syllabus (HTML + CSS + Programming)" },
  ],
  unit2: [
    { subject: "English", date: "2026-07-15", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "Chapters 9-12, Literature Section" },
    { subject: "Mathematics", date: "2026-07-17", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "Geometry, Mensuration" },
    { subject: "Science", date: "2026-07-19", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "Biology: Life Processes, Chemistry: Acids" },
    { subject: "Social Science", date: "2026-07-21", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "History: Freedom Struggle, Geography: Resources" },
    { subject: "Hindi", date: "2026-07-23", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "नाटक, कहानी" },
    { subject: "Computer", date: "2026-07-25", time: "09:00 - 11:00", duration: "2 hrs", syllabus: "Python Basics, Database Concepts" },
  ],
};

export const OVERALL_STATS: Record<string, { average: number; totalStudents: number; passed: number; failed: number; passRate: number; failRate: number; atRiskRate: number; bestClass: string; bestSubject: string }> = {
  unit1: {
    average: 74.5,
    totalStudents: 320,
    passed: 288,
    failed: 32,
    passRate: 90,
    failRate: 10,
    atRiskRate: 12,
    bestClass: "9A",
    bestSubject: "Science",
  },
  midsem: {
    average: 72.8,
    totalStudents: 320,
    passed: 280,
    failed: 40,
    passRate: 87.5,
    failRate: 12.5,
    atRiskRate: 15,
    bestClass: "10A",
    bestSubject: "Mathematics",
  },
};

export const SUBJECT_PERFORMANCE: Record<string, SubjectPerformance[]> = {
  unit1: [
    { subject: "English", average: 76.2, highest: 98, lowest: 32, passRate: 92 },
    { subject: "Mathematics", average: 68.5, highest: 100, lowest: 18, passRate: 84 },
    { subject: "Science", average: 78.3, highest: 100, lowest: 28, passRate: 94 },
    { subject: "Social Science", average: 72.1, highest: 96, lowest: 24, passRate: 88 },
    { subject: "Hindi", average: 74.8, highest: 98, lowest: 30, passRate: 90 },
    { subject: "Computer", average: 80.5, highest: 100, lowest: 42, passRate: 96 },
  ],
  midsem: [
    { subject: "English", average: 74.0, highest: 96, lowest: 28, passRate: 90 },
    { subject: "Mathematics", average: 66.2, highest: 100, lowest: 14, passRate: 82 },
    { subject: "Science", average: 76.8, highest: 100, lowest: 22, passRate: 92 },
    { subject: "Social Science", average: 70.5, highest: 94, lowest: 20, passRate: 86 },
    { subject: "Hindi", average: 73.2, highest: 98, lowest: 26, passRate: 88 },
    { subject: "Computer", average: 78.0, highest: 100, lowest: 38, passRate: 94 },
  ],
};

export const CLASS_PERFORMANCE: Record<string, ClassPerformance[]> = {
  unit1: [
    { className: "6A", average: 76.2, passRate: 92, failRate: 8, atRisk: 2, totalStudents: 32, passed: 29, failed: 3 },
    { className: "6B", average: 72.8, passRate: 88, failRate: 12, atRisk: 3, totalStudents: 30, passed: 26, failed: 4 },
    { className: "7A", average: 78.5, passRate: 94, failRate: 6, atRisk: 1, totalStudents: 32, passed: 30, failed: 2 },
    { className: "7B", average: 70.3, passRate: 86, failRate: 14, atRisk: 4, totalStudents: 30, passed: 26, failed: 4 },
    { className: "8A", average: 74.5, passRate: 90, failRate: 10, atRisk: 3, totalStudents: 32, passed: 29, failed: 3 },
    { className: "8B", average: 71.2, passRate: 87, failRate: 13, atRisk: 4, totalStudents: 30, passed: 26, failed: 4 },
    { className: "9A", average: 80.1, passRate: 96, failRate: 4, atRisk: 1, totalStudents: 32, passed: 31, failed: 1 },
    { className: "9B", average: 73.6, passRate: 89, failRate: 11, atRisk: 3, totalStudents: 30, passed: 27, failed: 3 },
    { className: "10A", average: 78.9, passRate: 94, failRate: 6, atRisk: 2, totalStudents: 32, passed: 30, failed: 2 },
    { className: "10B", average: 69.8, passRate: 85, failRate: 15, atRisk: 5, totalStudents: 30, passed: 25, failed: 5 },
  ],
  midsem: [
    { className: "6A", average: 74.0, passRate: 90, failRate: 10, atRisk: 3, totalStudents: 32, passed: 29, failed: 3 },
    { className: "6B", average: 70.5, passRate: 85, failRate: 15, atRisk: 4, totalStudents: 30, passed: 25, failed: 5 },
    { className: "7A", average: 76.2, passRate: 92, failRate: 8, atRisk: 2, totalStudents: 32, passed: 29, failed: 3 },
    { className: "7B", average: 68.8, passRate: 84, failRate: 16, atRisk: 5, totalStudents: 30, passed: 25, failed: 5 },
    { className: "8A", average: 72.5, passRate: 88, failRate: 12, atRisk: 4, totalStudents: 32, passed: 28, failed: 4 },
    { className: "8B", average: 69.0, passRate: 85, failRate: 15, atRisk: 4, totalStudents: 30, passed: 25, failed: 5 },
    { className: "9A", average: 78.5, passRate: 94, failRate: 6, atRisk: 2, totalStudents: 32, passed: 30, failed: 2 },
    { className: "9B", average: 71.8, passRate: 87, failRate: 13, atRisk: 4, totalStudents: 30, passed: 26, failed: 4 },
    { className: "10A", average: 80.2, passRate: 96, failRate: 4, atRisk: 1, totalStudents: 32, passed: 31, failed: 1 },
    { className: "10B", average: 67.5, passRate: 82, failRate: 18, atRisk: 6, totalStudents: 30, passed: 24, failed: 6 },
  ],
};

export const TOP_STUDENTS: Record<string, Record<string, StudentRank[]>> = {
  unit1: {
    "6A": [
      { rank: 1, name: "Aarav Sharma", className: "6A", percentage: 95.2, attendance: 98, marks: { English: 92, Mathematics: 98, Science: 96, "Social Science": 94, Hindi: 90, Computer: 98 } },
      { rank: 2, name: "Diya Patel", className: "6A", percentage: 93.8, attendance: 96, marks: { English: 90, Mathematics: 96, Science: 94, "Social Science": 92, Hindi: 94, Computer: 96 } },
      { rank: 3, name: "Rohan Gupta", className: "6A", percentage: 91.5, attendance: 94, marks: { English: 88, Mathematics: 94, Science: 92, "Social Science": 90, Hindi: 92, Computer: 94 } },
      { rank: 4, name: "Sneha Reddy", className: "6A", percentage: 89.2, attendance: 92, marks: { English: 86, Mathematics: 90, Science: 88, "Social Science": 88, Hindi: 90, Computer: 92 } },
      { rank: 5, name: "Aditya Singh", className: "6A", percentage: 87.8, attendance: 90, marks: { English: 84, Mathematics: 88, Science: 86, "Social Science": 86, Hindi: 88, Computer: 90 } },
    ],
    "8A": [
      { rank: 1, name: "Kavya Nair", className: "8A", percentage: 96.5, attendance: 99, marks: { English: 94, Mathematics: 98, Science: 97, "Social Science": 96, Hindi: 94, Computer: 100 } },
      { rank: 2, name: "Arjun Mehta", className: "8A", percentage: 94.2, attendance: 97, marks: { English: 92, Mathematics: 96, Science: 94, "Social Science": 92, Hindi: 96, Computer: 98 } },
      { rank: 3, name: "Ananya Das", className: "8A", percentage: 92.8, attendance: 95, marks: { English: 90, Mathematics: 94, Science: 92, "Social Science": 90, Hindi: 94, Computer: 96 } },
      { rank: 4, name: "Vikram Rao", className: "8A", percentage: 90.5, attendance: 93, marks: { English: 88, Mathematics: 92, Science: 90, "Social Science": 88, Hindi: 90, Computer: 94 } },
      { rank: 5, name: "Meera Joshi", className: "8A", percentage: 88.2, attendance: 91, marks: { English: 86, Mathematics: 88, Science: 86, "Social Science": 86, Hindi: 88, Computer: 92 } },
    ],
    "10A": [
      { rank: 1, name: "Priya Verma", className: "10A", percentage: 97.8, attendance: 100, marks: { English: 96, Mathematics: 100, Science: 98, "Social Science": 96, Hindi: 96, Computer: 100 } },
      { rank: 2, name: "Karthik Iyer", className: "10A", percentage: 95.5, attendance: 98, marks: { English: 94, Mathematics: 98, Science: 96, "Social Science": 94, Hindi: 94, Computer: 98 } },
      { rank: 3, name: "Nisha Chopra", className: "10A", percentage: 93.2, attendance: 96, marks: { English: 92, Mathematics: 96, Science: 94, "Social Science": 92, Hindi: 92, Computer: 96 } },
      { rank: 4, name: "Rahul Bose", className: "10A", percentage: 91.8, attendance: 94, marks: { English: 90, Mathematics: 94, Science: 92, "Social Science": 90, Hindi: 90, Computer: 94 } },
      { rank: 5, name: "Tanvi Malhotra", className: "10A", percentage: 89.5, attendance: 92, marks: { English: 88, Mathematics: 90, Science: 88, "Social Science": 88, Hindi: 88, Computer: 92 } },
    ],
  },
  midsem: {
    "6A": [
      { rank: 1, name: "Aarav Sharma", className: "6A", percentage: 94.0, attendance: 98, marks: { English: 90, Mathematics: 96, Science: 94, "Social Science": 92, Hindi: 92, Computer: 96 } },
      { rank: 2, name: "Diya Patel", className: "6A", percentage: 92.5, attendance: 96, marks: { English: 88, Mathematics: 94, Science: 92, "Social Science": 90, Hindi: 94, Computer: 94 } },
      { rank: 3, name: "Rohan Gupta", className: "6A", percentage: 90.2, attendance: 94, marks: { English: 86, Mathematics: 92, Science: 90, "Social Science": 88, Hindi: 90, Computer: 92 } },
      { rank: 4, name: "Sneha Reddy", className: "6A", percentage: 88.0, attendance: 92, marks: { English: 84, Mathematics: 88, Science: 86, "Social Science": 86, Hindi: 88, Computer: 90 } },
      { rank: 5, name: "Aditya Singh", className: "6A", percentage: 86.5, attendance: 90, marks: { English: 82, Mathematics: 86, Science: 84, "Social Science": 84, Hindi: 86, Computer: 88 } },
    ],
    "8A": [
      { rank: 1, name: "Kavya Nair", className: "8A", percentage: 95.0, attendance: 99, marks: { English: 92, Mathematics: 96, Science: 95, "Social Science": 94, Hindi: 94, Computer: 98 } },
      { rank: 2, name: "Arjun Mehta", className: "8A", percentage: 93.0, attendance: 97, marks: { English: 90, Mathematics: 94, Science: 92, "Social Science": 90, Hindi: 94, Computer: 96 } },
      { rank: 3, name: "Ananya Das", className: "8A", percentage: 91.5, attendance: 95, marks: { English: 88, Mathematics: 92, Science: 90, "Social Science": 88, Hindi: 92, Computer: 94 } },
      { rank: 4, name: "Vikram Rao", className: "8A", percentage: 89.2, attendance: 93, marks: { English: 86, Mathematics: 90, Science: 88, "Social Science": 86, Hindi: 88, Computer: 92 } },
      { rank: 5, name: "Meera Joshi", className: "8A", percentage: 87.0, attendance: 91, marks: { English: 84, Mathematics: 86, Science: 84, "Social Science": 84, Hindi: 86, Computer: 90 } },
    ],
    "10A": [
      { rank: 1, name: "Priya Verma", className: "10A", percentage: 96.5, attendance: 100, marks: { English: 94, Mathematics: 98, Science: 96, "Social Science": 94, Hindi: 96, Computer: 98 } },
      { rank: 2, name: "Karthik Iyer", className: "10A", percentage: 94.2, attendance: 98, marks: { English: 92, Mathematics: 96, Science: 94, "Social Science": 92, Hindi: 92, Computer: 96 } },
      { rank: 3, name: "Nisha Chopra", className: "10A", percentage: 92.0, attendance: 96, marks: { English: 90, Mathematics: 94, Science: 92, "Social Science": 90, Hindi: 90, Computer: 94 } },
      { rank: 4, name: "Rahul Bose", className: "10A", percentage: 90.5, attendance: 94, marks: { English: 88, Mathematics: 92, Science: 90, "Social Science": 88, Hindi: 88, Computer: 92 } },
      { rank: 5, name: "Tanvi Malhotra", className: "10A", percentage: 88.2, attendance: 92, marks: { English: 86, Mathematics: 88, Science: 86, "Social Science": 86, Hindi: 86, Computer: 90 } },
    ],
  },
};

export const AT_RISK_STUDENTS: Record<string, Record<string, { name: string; className: string; percentage: number; attendance: number; riskLevel: "high" | "medium" | "low"; marks: Record<string, number> }[]>> = {
  unit1: {
    "6A": [
      { name: "Ravi Kumar", className: "6A", percentage: 38.5, attendance: 65, riskLevel: "high", marks: { English: 32, Mathematics: 28, Science: 42, "Social Science": 40, Hindi: 36, Computer: 48 } },
      { name: "Sita Devi", className: "6A", percentage: 42.2, attendance: 70, riskLevel: "high", marks: { English: 38, Mathematics: 34, Science: 44, "Social Science": 42, Hindi: 40, Computer: 50 } },
      { name: "Mohan Lal", className: "6A", percentage: 48.8, attendance: 75, riskLevel: "medium", marks: { English: 44, Mathematics: 42, Science: 50, "Social Science": 48, Hindi: 46, Computer: 54 } },
    ],
    "8A": [
      { name: "Rahul Verma", className: "8A", percentage: 35.2, attendance: 60, riskLevel: "high", marks: { English: 30, Mathematics: 26, Science: 38, "Social Science": 36, Hindi: 34, Computer: 44 } },
      { name: "Pooja Singh", className: "8A", percentage: 40.5, attendance: 68, riskLevel: "high", marks: { English: 36, Mathematics: 32, Science: 42, "Social Science": 40, Hindi: 38, Computer: 48 } },
      { name: "Amit Kumar", className: "8A", percentage: 46.8, attendance: 72, riskLevel: "medium", marks: { English: 42, Mathematics: 40, Science: 48, "Social Science": 46, Hindi: 44, Computer: 52 } },
    ],
    "10A": [
      { name: "Deepak Joshi", className: "10A", percentage: 32.0, attendance: 55, riskLevel: "high", marks: { English: 28, Mathematics: 24, Science: 34, "Social Science": 32, Hindi: 30, Computer: 40 } },
      { name: "Neha Gupta", className: "10A", percentage: 38.8, attendance: 62, riskLevel: "high", marks: { English: 34, Mathematics: 30, Science: 40, "Social Science": 38, Hindi: 36, Computer: 46 } },
      { name: "Sanjay Patel", className: "10A", percentage: 44.5, attendance: 70, riskLevel: "medium", marks: { English: 40, Mathematics: 38, Science: 46, "Social Science": 44, Hindi: 42, Computer: 50 } },
    ],
  },
  midsem: {
    "6A": [
      { name: "Ravi Kumar", className: "6A", percentage: 36.0, attendance: 62, riskLevel: "high", marks: { English: 30, Mathematics: 26, Science: 40, "Social Science": 38, Hindi: 34, Computer: 44 } },
      { name: "Sita Devi", className: "6A", percentage: 40.0, attendance: 68, riskLevel: "high", marks: { English: 36, Mathematics: 30, Science: 42, "Social Science": 40, Hindi: 38, Computer: 48 } },
      { name: "Mohan Lal", className: "6A", percentage: 46.0, attendance: 73, riskLevel: "medium", marks: { English: 42, Mathematics: 38, Science: 48, "Social Science": 46, Hindi: 44, Computer: 52 } },
    ],
    "8A": [
      { name: "Rahul Verma", className: "8A", percentage: 33.0, attendance: 58, riskLevel: "high", marks: { English: 28, Mathematics: 24, Science: 36, "Social Science": 34, Hindi: 32, Computer: 42 } },
      { name: "Pooja Singh", className: "8A", percentage: 38.0, attendance: 65, riskLevel: "high", marks: { English: 34, Mathematics: 28, Science: 40, "Social Science": 38, Hindi: 36, Computer: 46 } },
      { name: "Amit Kumar", className: "8A", percentage: 44.5, attendance: 70, riskLevel: "medium", marks: { English: 40, Mathematics: 36, Science: 46, "Social Science": 44, Hindi: 42, Computer: 50 } },
    ],
    "10A": [
      { name: "Deepak Joshi", className: "10A", percentage: 30.0, attendance: 52, riskLevel: "high", marks: { English: 26, Mathematics: 22, Science: 32, "Social Science": 30, Hindi: 28, Computer: 38 } },
      { name: "Neha Gupta", className: "10A", percentage: 36.5, attendance: 60, riskLevel: "high", marks: { English: 32, Mathematics: 28, Science: 38, "Social Science": 36, Hindi: 34, Computer: 44 } },
      { name: "Sanjay Patel", className: "10A", percentage: 42.0, attendance: 68, riskLevel: "medium", marks: { English: 38, Mathematics: 34, Science: 44, "Social Science": 42, Hindi: 40, Computer: 48 } },
    ],
  },
};

export const AI_INSIGHTS: AIInsight[] = [
  { id: "ai1", text: "Mathematics performance is declining in Class 8 — consider scheduling remedial classes.", type: "warning", icon: "AlertTriangle" },
  { id: "ai2", text: "Class 9A has the highest average score across all subjects.", type: "success", icon: "TrendingUp" },
  { id: "ai3", text: "12% of students are academically at risk and need immediate attention.", type: "danger", icon: "AlertTriangle" },
  { id: "ai4", text: "Science is the best performing subject school-wide with 78.3% average.", type: "success", icon: "TrendingUp" },
  { id: "ai5", text: "Attendance strongly correlates with performance — students below 75% attendance average 40% marks.", type: "info", icon: "Info" },
];

export const RECOMMENDED_ACTIONS = [
  { id: "ra1", text: "Schedule remedial classes for Mathematics in Classes 7B, 8B, 10B", priority: "high" },
  { id: "ra2", text: "Conduct teacher intervention sessions for at-risk students", priority: "high" },
  { id: "ra3", text: "Arrange extra revision sessions before Final Exam", priority: "medium" },
  { id: "ra4", text: "Meet parents of students with attendance below 70%", priority: "medium" },
  { id: "ra5", text: "Implement peer tutoring program for Science and Computer", priority: "low" },
];

export const ALL_CLASSES = ["6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"];
