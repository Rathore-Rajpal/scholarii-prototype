export type ExamStatus = "conducted" | "ongoing" | "upcoming";
export type ExamTab = "overview" | "timetable" | "syllabus" | "results" | "ai";

export interface ExamSubject {
  name: string;
  chapters: string[];
  syllabus: string[];
  totalMarks: number;
}

export interface TimetableEntry {
  date: string;
  subject: string;
  time: string;
  duration: string;
  room: string;
}

export interface ExamResult {
  subject: string;
  score: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  classAverage: number;
}

export interface StudentResult {
  examId: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  rank: number;
  grade: string;
  passed: boolean;
  subjects: ExamResult[];
  classStats: {
    totalStudents: number;
    passed: number;
    failed: number;
    passPercentage: number;
    failPercentage: number;
  };
}

export interface Exam {
  id: string;
  name: string;
  status: ExamStatus;
  dateRange: string;
  startDate: string;
  endDate: string;
  subjects: ExamSubject[];
  timetable: TimetableEntry[];
  totalMarks: number;
  passingPercentage: number;
  daysRemaining?: number;
  upcomingPapers?: number;
  result?: StudentResult;
}

export interface ClassSubjectPerf {
  name: string;
  average: number;
  toppers: { name: string; marks: number }[];
  bottomers: { name: string; marks: number }[];
}

export interface ClassPerformance {
  examId: string;
  subjects: ClassSubjectPerf[];
}

export const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Computer Science"];

export const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#6366f1",
  Science: "#10b981",
  English: "#f59e0b",
  "Social Studies": "#ef4444",
  "Computer Science": "#8b5cf6",
};

export const STATUS_CONFIG: Record<ExamStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  conducted: { label: "Conducted", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  ongoing: { label: "Ongoing", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
  upcoming: { label: "Upcoming", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
};

export const EXAMS: Exam[] = [
  {
    id: "unit1",
    name: "Unit Test - 1",
    status: "conducted",
    dateRange: "15 May \u2014 18 May 2026",
    startDate: "2026-05-15",
    endDate: "2026-05-18",
    subjects: [
      { name: "Mathematics", chapters: ["Algebra", "Linear Equations", "Polynomials"], syllabus: ["Chapter 1: Algebraic Expressions", "Chapter 2: Linear Equations in One Variable", "Chapter 3: Polynomials and Factorization"], totalMarks: 100 },
      { name: "Science", chapters: ["Cell Biology", "Tissues"], syllabus: ["Chapter 1: Structure and Function of Cell", "Chapter 2: Plant and Animal Tissues"], totalMarks: 100 },
      { name: "English", chapters: ["Prose", "Poetry", "Grammar"], syllabus: ["Prose: The Happy Prince", "Poetry: A Legend of the Northland", "Grammar: Tenses and Voice"], totalMarks: 100 },
      { name: "Social Studies", chapters: ["History", "Geography"], syllabus: ["History: The French Revolution", "Geography: Resources and Development"], totalMarks: 100 },
      { name: "Computer Science", chapters: ["HTML Basics", "CSS Fundamentals"], syllabus: ["Introduction to HTML", "HTML Elements and Attributes", "Basic CSS Styling"], totalMarks: 100 },
    ],
    timetable: [
      { date: "15 May 2026", subject: "Mathematics", time: "09:00 AM", duration: "2 Hours", room: "Room 204" },
      { date: "16 May 2026", subject: "Science", time: "09:00 AM", duration: "2 Hours", room: "Room 204" },
      { date: "17 May 2026", subject: "English", time: "09:00 AM", duration: "2 Hours", room: "Room 204" },
      { date: "17 May 2026", subject: "Social Studies", time: "02:00 PM", duration: "1.5 Hours", room: "Room 204" },
      { date: "18 May 2026", subject: "Computer Science", time: "09:00 AM", duration: "1.5 Hours", room: "Computer Lab" },
    ],
    totalMarks: 500,
    passingPercentage: 33,
    result: {
      examId: "unit1", totalMarks: 395, maxMarks: 500, percentage: 79, rank: 5, grade: "B+", passed: true,
      subjects: [
        { subject: "Mathematics", score: 72, maxMarks: 100, percentage: 72, grade: "B", classAverage: 68 },
        { subject: "Science", score: 88, maxMarks: 100, percentage: 88, grade: "A", classAverage: 72 },
        { subject: "English", score: 85, maxMarks: 100, percentage: 85, grade: "A", classAverage: 76 },
        { subject: "Social Studies", score: 78, maxMarks: 100, percentage: 78, grade: "B+", classAverage: 71 },
        { subject: "Computer Science", score: 72, maxMarks: 100, percentage: 72, grade: "B", classAverage: 65 },
      ],
      classStats: { totalStudents: 40, passed: 36, failed: 4, passPercentage: 90, failPercentage: 10 },
    },
  },
  {
    id: "midsem",
    name: "Mid-Semester Exam",
    status: "conducted",
    dateRange: "10 June \u2014 18 June 2026",
    startDate: "2026-06-10",
    endDate: "2026-06-18",
    subjects: [
      { name: "Mathematics", chapters: ["Algebra", "Linear Equations", "Polynomials", "Geometry"], syllabus: ["Chapter 1: Algebraic Expressions", "Chapter 2: Linear Equations in One Variable", "Chapter 3: Polynomials and Factorization", "Chapter 4: Introduction to Euclid's Geometry"], totalMarks: 100 },
      { name: "Science", chapters: ["Cell Biology", "Tissues", "Diversity in Living Organisms"], syllabus: ["Chapter 1: Structure and Function of Cell", "Chapter 2: Plant and Animal Tissues", "Chapter 3: Classification of Living Organisms"], totalMarks: 100 },
      { name: "English", chapters: ["Prose", "Poetry", "Grammar", "Writing"], syllabus: ["Prose: The Happy Prince, A Letter to God", "Poetry: A Legend of the Northland, Wind", "Grammar: Tenses, Voice, Reported Speech", "Writing: Letter Writing, Paragraph Writing"], totalMarks: 100 },
      { name: "Social Studies", chapters: ["History", "Geography", "Civics"], syllabus: ["History: The French Revolution, Socialism in Europe", "Geography: Resources and Development, Agriculture", "Civics: Democracy and Diversity"], totalMarks: 100 },
      { name: "Computer Science", chapters: ["HTML Basics", "CSS Fundamentals", "Introduction to JavaScript"], syllabus: ["HTML Elements and Attributes", "CSS Selectors and Properties", "JavaScript Basics and DOM"], totalMarks: 100 },
    ],
    timetable: [
      { date: "10 June 2026", subject: "Mathematics", time: "10:00 AM", duration: "3 Hours", room: "Hall A" },
      { date: "12 June 2026", subject: "Science", time: "10:00 AM", duration: "3 Hours", room: "Hall A" },
      { date: "14 June 2026", subject: "English", time: "10:00 AM", duration: "3 Hours", room: "Hall A" },
      { date: "16 June 2026", subject: "Social Studies", time: "10:00 AM", duration: "2 Hours", room: "Hall A" },
      { date: "18 June 2026", subject: "Computer Science", time: "10:00 AM", duration: "2 Hours", room: "Computer Lab" },
    ],
    totalMarks: 500,
    passingPercentage: 33,
    result: {
      examId: "midsem", totalMarks: 425, maxMarks: 500, percentage: 85, rank: 3, grade: "A", passed: true,
      subjects: [
        { subject: "Mathematics", score: 85, maxMarks: 100, percentage: 85, grade: "A", classAverage: 71 },
        { subject: "Science", score: 92, maxMarks: 100, percentage: 92, grade: "A+", classAverage: 75 },
        { subject: "English", score: 88, maxMarks: 100, percentage: 88, grade: "A", classAverage: 78 },
        { subject: "Social Studies", score: 82, maxMarks: 100, percentage: 82, grade: "A", classAverage: 73 },
        { subject: "Computer Science", score: 78, maxMarks: 100, percentage: 78, grade: "B+", classAverage: 68 },
      ],
      classStats: { totalStudents: 40, passed: 38, failed: 2, passPercentage: 95, failPercentage: 5 },
    },
  },
  {
    id: "unit2",
    name: "Unit Test - 2",
    status: "ongoing",
    dateRange: "1 July \u2014 4 July 2026",
    startDate: "2026-07-01",
    endDate: "2026-07-04",
    daysRemaining: 16,
    upcomingPapers: 3,
    subjects: [
      { name: "Mathematics", chapters: ["Geometry", "Mensuration", "Statistics"], syllabus: ["Chapter 4: Introduction to Euclid's Geometry", "Chapter 5: Lines and Angles", "Chapter 6: Mensuration", "Chapter 7: Statistics and Probability"], totalMarks: 100 },
      { name: "Science", chapters: ["Motion", "Force and Laws of Motion", "Gravitation"], syllabus: ["Chapter 4: Motion", "Chapter 5: Force and Laws of Motion", "Chapter 6: Gravitation"], totalMarks: 100 },
      { name: "English", chapters: ["Prose", "Poetry", "Grammar"], syllabus: ["Prose: His First Flight, Black Aeroplane", "Poetry: The Ball Poem, Amanda", "Grammar: Determiners, Active-Passive"], totalMarks: 100 },
      { name: "Social Studies", chapters: ["History", "Geography", "Civics"], syllabus: ["History: Nationalism in India", "Geography: Climate, Natural Vegetation", "Civics: Power Sharing"], totalMarks: 100 },
      { name: "Computer Science", chapters: ["JavaScript", "DOM Manipulation"], syllabus: ["JavaScript Functions and Events", "DOM Selection and Manipulation", "Event Handling and Listeners"], totalMarks: 100 },
    ],
    timetable: [
      { date: "1 July 2026", subject: "Mathematics", time: "09:00 AM", duration: "2 Hours", room: "Room 204" },
      { date: "2 July 2026", subject: "Science", time: "09:00 AM", duration: "2 Hours", room: "Room 204" },
      { date: "3 July 2026", subject: "English", time: "09:00 AM", duration: "2 Hours", room: "Room 204" },
      { date: "3 July 2026", subject: "Social Studies", time: "02:00 PM", duration: "1.5 Hours", room: "Room 204" },
      { date: "4 July 2026", subject: "Computer Science", time: "09:00 AM", duration: "1.5 Hours", room: "Computer Lab" },
    ],
    totalMarks: 500,
    passingPercentage: 33,
  },
  {
    id: "final",
    name: "Final Examination",
    status: "upcoming",
    dateRange: "15 Nov \u2014 28 Nov 2026",
    startDate: "2026-11-15",
    endDate: "2026-11-28",
    subjects: [
      { name: "Mathematics", chapters: ["All Chapters (Full Syllabus)"], syllabus: ["Algebra and Polynomials", "Linear Equations", "Geometry and Mensuration", "Statistics and Probability"], totalMarks: 100 },
      { name: "Science", chapters: ["All Chapters (Full Syllabus)"], syllabus: ["Cell Biology and Tissues", "Diversity in Living Organisms", "Motion, Force, and Gravitation", "Work and Energy"], totalMarks: 100 },
      { name: "English", chapters: ["All Chapters (Full Syllabus)"], syllabus: ["Prose: Complete Prescribed Text", "Poetry: Complete Prescribed Poems", "Grammar: Complete Syllabus", "Writing Skills"], totalMarks: 100 },
      { name: "Social Studies", chapters: ["All Chapters (Full Syllabus)"], syllabus: ["History: Full Year Coverage", "Geography: Full Year Coverage", "Civics: Full Year Coverage"], totalMarks: 100 },
      { name: "Computer Science", chapters: ["All Chapters (Full Syllabus)"], syllabus: ["HTML Complete", "CSS Complete", "JavaScript Complete", "Project Work"], totalMarks: 100 },
    ],
    timetable: [
      { date: "15 Nov 2026", subject: "Mathematics", time: "10:00 AM", duration: "3 Hours", room: "Hall A" },
      { date: "18 Nov 2026", subject: "Science", time: "10:00 AM", duration: "3 Hours", room: "Hall A" },
      { date: "21 Nov 2026", subject: "English", time: "10:00 AM", duration: "3 Hours", room: "Hall A" },
      { date: "24 Nov 2026", subject: "Social Studies", time: "10:00 AM", duration: "2 Hours", room: "Hall A" },
      { date: "28 Nov 2026", subject: "Computer Science", time: "10:00 AM", duration: "2 Hours", room: "Computer Lab" },
    ],
    totalMarks: 500,
    passingPercentage: 33,
  },
];

export const CLASS_PERFORMANCE: ClassPerformance[] = [
  {
    examId: "unit1",
    subjects: [
      { name: "Mathematics", average: 68, toppers: [{ name: "Aarav Sharma", marks: 95 }, { name: "Priya Gupta", marks: 92 }, { name: "Arjun Singh", marks: 88 }, { name: "Riya Patel", marks: 85 }, { name: "Mohit Kumar", marks: 82 }], bottomers: [{ name: "Rohan Mehta", marks: 28 }, { name: "Ananya Joshi", marks: 32 }, { name: "Vikram Reddy", marks: 35 }, { name: "Sneha Iyer", marks: 38 }, { name: "Karan Bhat", marks: 42 }] },
      { name: "Science", average: 72, toppers: [{ name: "Priya Gupta", marks: 98 }, { name: "Aarav Sharma", marks: 94 }, { name: "Riya Patel", marks: 91 }, { name: "Arjun Singh", marks: 89 }, { name: "Neha Desai", marks: 86 }], bottomers: [{ name: "Rohan Mehta", marks: 30 }, { name: "Karan Bhat", marks: 35 }, { name: "Vikram Reddy", marks: 38 }, { name: "Ananya Joshi", marks: 40 }, { name: "Sneha Iyer", marks: 44 }] },
      { name: "English", average: 76, toppers: [{ name: "Riya Patel", marks: 96 }, { name: "Neha Desai", marks: 93 }, { name: "Priya Gupta", marks: 90 }, { name: "Aarav Sharma", marks: 87 }, { name: "Arjun Singh", marks: 84 }], bottomers: [{ name: "Vikram Reddy", marks: 32 }, { name: "Rohan Mehta", marks: 36 }, { name: "Karan Bhat", marks: 40 }, { name: "Ananya Joshi", marks: 42 }, { name: "Sneha Iyer", marks: 45 }] },
      { name: "Social Studies", average: 71, toppers: [{ name: "Arjun Singh", marks: 94 }, { name: "Aarav Sharma", marks: 91 }, { name: "Priya Gupta", marks: 88 }, { name: "Riya Patel", marks: 85 }, { name: "Neha Desai", marks: 82 }], bottomers: [{ name: "Rohan Mehta", marks: 25 }, { name: "Karan Bhat", marks: 30 }, { name: "Vikram Reddy", marks: 34 }, { name: "Ananya Joshi", marks: 38 }, { name: "Sneha Iyer", marks: 42 }] },
      { name: "Computer Science", average: 65, toppers: [{ name: "Aarav Sharma", marks: 96 }, { name: "Priya Gupta", marks: 92 }, { name: "Arjun Singh", marks: 88 }, { name: "Neha Desai", marks: 84 }, { name: "Riya Patel", marks: 80 }], bottomers: [{ name: "Rohan Mehta", marks: 20 }, { name: "Ananya Joshi", marks: 28 }, { name: "Sneha Iyer", marks: 32 }, { name: "Karan Bhat", marks: 35 }, { name: "Vikram Reddy", marks: 38 }] },
    ],
  },
  {
    examId: "midsem",
    subjects: [
      { name: "Mathematics", average: 71, toppers: [{ name: "Aarav Sharma", marks: 98 }, { name: "Priya Gupta", marks: 95 }, { name: "Arjun Singh", marks: 91 }, { name: "Riya Patel", marks: 88 }, { name: "Mohit Kumar", marks: 85 }], bottomers: [{ name: "Rohan Mehta", marks: 32 }, { name: "Ananya Joshi", marks: 36 }, { name: "Vikram Reddy", marks: 40 }, { name: "Sneha Iyer", marks: 44 }, { name: "Karan Bhat", marks: 48 }] },
      { name: "Science", average: 75, toppers: [{ name: "Priya Gupta", marks: 98 }, { name: "Riya Patel", marks: 95 }, { name: "Aarav Sharma", marks: 93 }, { name: "Neha Desai", marks: 90 }, { name: "Arjun Singh", marks: 87 }], bottomers: [{ name: "Rohan Mehta", marks: 34 }, { name: "Karan Bhat", marks: 38 }, { name: "Vikram Reddy", marks: 42 }, { name: "Ananya Joshi", marks: 46 }, { name: "Sneha Iyer", marks: 50 }] },
      { name: "English", average: 78, toppers: [{ name: "Riya Patel", marks: 97 }, { name: "Neha Desai", marks: 94 }, { name: "Priya Gupta", marks: 91 }, { name: "Aarav Sharma", marks: 88 }, { name: "Arjun Singh", marks: 85 }], bottomers: [{ name: "Vikram Reddy", marks: 36 }, { name: "Rohan Mehta", marks: 40 }, { name: "Karan Bhat", marks: 44 }, { name: "Ananya Joshi", marks: 48 }, { name: "Sneha Iyer", marks: 52 }] },
      { name: "Social Studies", average: 73, toppers: [{ name: "Arjun Singh", marks: 96 }, { name: "Aarav Sharma", marks: 93 }, { name: "Priya Gupta", marks: 90 }, { name: "Riya Patel", marks: 87 }, { name: "Neha Desai", marks: 84 }], bottomers: [{ name: "Rohan Mehta", marks: 28 }, { name: "Karan Bhat", marks: 34 }, { name: "Vikram Reddy", marks: 38 }, { name: "Ananya Joshi", marks: 42 }, { name: "Sneha Iyer", marks: 46 }] },
      { name: "Computer Science", average: 68, toppers: [{ name: "Aarav Sharma", marks: 98 }, { name: "Priya Gupta", marks: 94 }, { name: "Arjun Singh", marks: 90 }, { name: "Neha Desai", marks: 86 }, { name: "Riya Patel", marks: 82 }], bottomers: [{ name: "Rohan Mehta", marks: 24 }, { name: "Ananya Joshi", marks: 32 }, { name: "Sneha Iyer", marks: 36 }, { name: "Karan Bhat", marks: 40 }, { name: "Vikram Reddy", marks: 44 }] },
    ],
  },
];
