// ============================================================
// MY CLASS EXAMS & RESULTS MOCK DATA
// ============================================================

export interface ExamEntry {
  id: string;
  name: string;
  status: "completed" | "ongoing" | "upcoming";
  date: string;
  type: "Unit Test" | "Mid Term" | "Final Exam";
  timetable: { date: string; time: string; subject: string; room: string }[];
  syllabus: { subject: string; chapters: string[]; completion: number }[];
  results: { subject: string; avgMarks: number; maxMarks: number; passRate: number }[];
  questionPaper: {
    subject: string;
    files: { type: "question-paper" | "answer-key" | "marking-scheme"; name: string; size: string }[];
  }[];
}

export interface StudentResult {
  id: string;
  name: string;
  roll: number;
  gender: "Male" | "Female";
  total: number;
  maxTotal: number;
  percentage: number;
  rank: number;
  attendance: number;
  status: "top" | "at-risk" | "stable";
  subjects: { name: string; marks: number; max: number; grade: string }[];
  examHistory: { exam: string; percentage: number; rank: number }[];
  strengths: string[];
  weaknesses: string[];
}

export interface AnalyticsData {
  monthlyTrend: { exam: string; avg: number }[];
  subjectPerf: { subject: string; avg: number; highest: number; lowest: number }[];
  rankDistribution: { range: string; count: number }[];
  attendanceVsMarks: { name: string; attendance: number; marks: number }[];
  examReadiness: { subject: string; readiness: number }[];
  passFail: { pass: number; fail: number };
}

export const CLASS_EXAMS: ExamEntry[] = [
  {
    id: "e1", name: "Unit Test - 1", status: "completed", date: "15 May 2026", type: "Unit Test",
    timetable: [
      { date: "15 May", time: "09:00 - 10:30", subject: "Mathematics", room: "8-A" },
      { date: "16 May", time: "09:00 - 10:30", subject: "Science", room: "8-A" },
      { date: "17 May", time: "09:00 - 10:30", subject: "English", room: "8-A" },
    ],
    syllabus: [
      { subject: "Mathematics", chapters: ["Linear Equations", "Quadrilaterals"], completion: 100 },
      { subject: "Science", chapters: ["Crop Production", "Microorganisms"], completion: 100 },
      { subject: "English", chapters: ["The Best Seller", "The Ant and the Cricket"], completion: 100 },
    ],
    results: [
      { subject: "Mathematics", avgMarks: 78, maxMarks: 100, passRate: 92 },
      { subject: "Science", avgMarks: 82, maxMarks: 100, passRate: 96 },
      { subject: "English", avgMarks: 85, maxMarks: 100, passRate: 100 },
    ],
    questionPaper: [
      {
        subject: "Mathematics",
        files: [
          { type: "question-paper", name: "Mathematics UT-1", size: "345 KB" },
          { type: "answer-key", name: "Mathematics UT-1 — Answer Key", size: "128 KB" },
          { type: "marking-scheme", name: "Mathematics UT-1 — Marking Scheme", size: "96 KB" },
        ],
      },
      {
        subject: "Science",
        files: [
          { type: "question-paper", name: "Science UT-1", size: "289 KB" },
          { type: "answer-key", name: "Science UT-1 — Answer Key", size: "112 KB" },
          { type: "marking-scheme", name: "Science UT-1 — Marking Scheme", size: "88 KB" },
        ],
      },
      {
        subject: "English",
        files: [
          { type: "question-paper", name: "English UT-1", size: "256 KB" },
          { type: "answer-key", name: "English UT-1 — Answer Key", size: "104 KB" },
          { type: "marking-scheme", name: "English UT-1 — Marking Scheme", size: "82 KB" },
        ],
      },
    ],
  },
  {
    id: "e2", name: "Mid Term", status: "completed", date: "18 Jun 2026", type: "Mid Term",
    timetable: [
      { date: "18 Jun", time: "09:00 - 11:00", subject: "Mathematics", room: "8-A" },
      { date: "19 Jun", time: "09:00 - 11:00", subject: "Science", room: "8-A" },
      { date: "20 Jun", time: "09:00 - 11:00", subject: "English", room: "8-A" },
      { date: "21 Jun", time: "09:00 - 11:00", subject: "Hindi", room: "8-A" },
      { date: "22 Jun", time: "09:00 - 11:00", subject: "Social Science", room: "8-A" },
    ],
    syllabus: [
      { subject: "Mathematics", chapters: ["Linear Equations", "Quadrilaterals", "Square and Square Roots", "Cubes and Cube Roots"], completion: 100 },
      { subject: "Science", chapters: ["Crop Production", "Microorganisms", "Coal and Petroleum", "Combustion and Flame"], completion: 100 },
      { subject: "English", chapters: ["The Best Seller", "The Ant and the Cricket", "The Last Bargain", "The School Boy"], completion: 100 },
    ],
    results: [
      { subject: "Mathematics", avgMarks: 82, maxMarks: 100, passRate: 96 },
      { subject: "Science", avgMarks: 85, maxMarks: 100, passRate: 100 },
      { subject: "English", avgMarks: 88, maxMarks: 100, passRate: 100 },
      { subject: "Hindi", avgMarks: 80, maxMarks: 100, passRate: 96 },
      { subject: "Social Science", avgMarks: 79, maxMarks: 100, passRate: 92 },
    ],
    questionPaper: [
      {
        subject: "Mathematics",
        files: [
          { type: "question-paper", name: "Mathematics Mid Term", size: "412 KB" },
          { type: "answer-key", name: "Mathematics Mid Term — Answer Key", size: "156 KB" },
          { type: "marking-scheme", name: "Mathematics Mid Term — Marking Scheme", size: "118 KB" },
        ],
      },
      {
        subject: "Science",
        files: [
          { type: "question-paper", name: "Science Mid Term", size: "378 KB" },
          { type: "answer-key", name: "Science Mid Term — Answer Key", size: "142 KB" },
          { type: "marking-scheme", name: "Science Mid Term — Marking Scheme", size: "108 KB" },
        ],
      },
      {
        subject: "English",
        files: [
          { type: "question-paper", name: "English Mid Term", size: "298 KB" },
          { type: "answer-key", name: "English Mid Term — Answer Key", size: "118 KB" },
          { type: "marking-scheme", name: "English Mid Term — Marking Scheme", size: "92 KB" },
        ],
      },
      {
        subject: "Hindi",
        files: [
          { type: "question-paper", name: "Hindi Mid Term", size: "267 KB" },
          { type: "answer-key", name: "Hindi Mid Term — Answer Key", size: "98 KB" },
          { type: "marking-scheme", name: "Hindi Mid Term — Marking Scheme", size: "76 KB" },
        ],
      },
      {
        subject: "Social Science",
        files: [
          { type: "question-paper", name: "Social Science Mid Term", size: "312 KB" },
          { type: "answer-key", name: "Social Science Mid Term — Answer Key", size: "124 KB" },
          { type: "marking-scheme", name: "Social Science Mid Term — Marking Scheme", size: "94 KB" },
        ],
      },
    ],
  },
  {
    id: "e3", name: "Unit Test - 2", status: "ongoing", date: "25 Jul 2026", type: "Unit Test",
    timetable: [
      { date: "25 Jul", time: "09:00 - 10:30", subject: "Mathematics", room: "8-A" },
      { date: "26 Jul", time: "09:00 - 10:30", subject: "Science", room: "8-A" },
      { date: "27 Jul", time: "09:00 - 10:30", subject: "English", room: "8-A" },
    ],
    syllabus: [
      { subject: "Mathematics", chapters: ["Data Handling", "Direct and Inverse Proportions"], completion: 80 },
      { subject: "Science", chapters: ["Conservation of Plants and Animals", "Reproduction in Animals"], completion: 75 },
      { subject: "English", chapters: ["The Great Stone Face - I", "The Great Stone Face - II"], completion: 70 },
    ],
    results: [
      { subject: "Mathematics", avgMarks: 0, maxMarks: 100, passRate: 0 },
      { subject: "Science", avgMarks: 0, maxMarks: 100, passRate: 0 },
      { subject: "English", avgMarks: 0, maxMarks: 100, passRate: 0 },
    ],
    questionPaper: [
      {
        subject: "Mathematics",
        files: [
          { type: "question-paper", name: "Mathematics UT-2 (Draft)", size: "312 KB" },
          { type: "answer-key", name: "Mathematics UT-2 — Answer Key (Draft)", size: "118 KB" },
          { type: "marking-scheme", name: "Mathematics UT-2 — Marking Scheme (Draft)", size: "86 KB" },
        ],
      },
      {
        subject: "Science",
        files: [
          { type: "question-paper", name: "Science UT-2 (Draft)", size: "278 KB" },
          { type: "answer-key", name: "Science UT-2 — Answer Key (Draft)", size: "104 KB" },
          { type: "marking-scheme", name: "Science UT-2 — Marking Scheme (Draft)", size: "78 KB" },
        ],
      },
    ],
  },
  {
    id: "e4", name: "Final Exam", status: "upcoming", date: "10 Sep 2026", type: "Final Exam",
    timetable: [],
    syllabus: [
      { subject: "Mathematics", chapters: ["All chapters"], completion: 0 },
      { subject: "Science", chapters: ["All chapters"], completion: 0 },
      { subject: "English", chapters: ["All chapters"], completion: 0 },
      { subject: "Hindi", chapters: ["All chapters"], completion: 0 },
      { subject: "Social Science", chapters: ["All chapters"], completion: 0 },
    ],
    results: [],
    questionPaper: [],
  },
];

export const EXAM_AI_INSIGHTS = [
  { text: "5 students need Mathematics support.", type: "warning" as const },
  { text: "Science performance improved by 8%.", type: "success" as const },
  { text: "3 students are at risk.", type: "warning" as const },
  { text: "Attendance is impacting performance.", type: "info" as const },
  { text: "Final exam readiness: 82%.", type: "success" as const },
];

export const EXAM_AI_SUGGESTIONS = [
  "Schedule revision session.",
  "Focus on Algebra.",
  "Conduct one mock test.",
];
