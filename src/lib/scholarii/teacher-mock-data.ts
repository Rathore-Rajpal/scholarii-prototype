// ============================================================
// TEACHER DASHBOARD MOCK DATA
// ============================================================

export interface TeacherSchedule {
  id: string;
  time: string;
  endTime: string;
  className: string;
  subject: string;
  room: string;
  status: "completed" | "ongoing" | "upcoming";
}

export interface TeacherClass {
  id: string;
  name: string;
  isClassTeacher: boolean;
  students: number;
  attendance: number;
  upcomingExam: string;
  subject: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  pending: number;
  submitted: number;
  verified: number;
}

export interface ExamActivity {
  id: string;
  name: string;
  subject: string;
  daysLeft: number;
  status: "upcoming" | "preparation" | "results-pending";
}

export interface Announcement {
  id: string;
  title: string;
  type: "school" | "pta" | "holiday";
  date: string;
  priority: "normal" | "important" | "urgent";
}

// Today's Schedule
export const todaySchedule: TeacherSchedule[] = [
  { id: "S1", time: "08:00", endTime: "08:45", className: "8-A", subject: "Mathematics", room: "203", status: "completed" },
  { id: "S2", time: "09:00", endTime: "09:45", className: "9-B", subject: "Mathematics", room: "205", status: "completed" },
  { id: "S3", time: "10:00", endTime: "10:45", className: "8-A", subject: "Mathematics", room: "203", status: "ongoing" },
  { id: "S4", time: "11:00", endTime: "11:45", className: "10-A", subject: "Mathematics", room: "301", status: "upcoming" },
  { id: "S5", time: "12:00", endTime: "12:45", className: "9-A", subject: "Mathematics", room: "205", status: "upcoming" },
];

// My Classes
export const myClasses: TeacherClass[] = [
  { id: "C1", name: "8-A", isClassTeacher: true, students: 42, attendance: 94, upcomingExam: "Math Test Friday", subject: "Mathematics" },
  { id: "C2", name: "9-B", isClassTeacher: false, students: 38, attendance: 91, upcomingExam: "Unit Test Next Week", subject: "Mathematics" },
  { id: "C3", name: "10-A", isClassTeacher: false, students: 35, attendance: 88, upcomingExam: "Board Prep Started", subject: "Mathematics" },
  { id: "C4", name: "9-A", isClassTeacher: false, students: 40, attendance: 92, upcomingExam: "Science Fair 20th", subject: "Mathematics" },
];

// Assignments
export const assignments: Assignment[] = [
  { id: "A1", title: "Algebra Worksheet", subject: "Mathematics", pending: 18, submitted: 24, verified: 18 },
  { id: "A2", title: "Science Project", subject: "Science", pending: 12, submitted: 26, verified: 12 },
  { id: "A3", title: "English Essay", subject: "English", pending: 6, submitted: 32, verified: 26 },
];

// Exam Activity
export const examActivities: ExamActivity[] = [
  { id: "E1", name: "Unit Test", subject: "Mathematics", daysLeft: 2, status: "upcoming" },
  { id: "E2", name: "Science Practical", subject: "Science", daysLeft: 5, status: "preparation" },
  { id: "E3", name: "Mid-Term Results", subject: "All", daysLeft: 10, status: "results-pending" },
];

// Announcements
export const announcements: Announcement[] = [
  { id: "AN1", title: "Science Fair - Call for Projects", type: "school", date: "Jun 20", priority: "important" },
  { id: "AN2", title: "PTA Meeting - June 25", type: "pta", date: "Jun 25", priority: "normal" },
  { id: "AN3", title: "Holiday Notice - June 15", type: "holiday", date: "Jun 15", priority: "urgent" },
  { id: "AN4", title: "Sports Day Registration", type: "school", date: "Jun 30", priority: "normal" },
  { id: "AN5", title: "Staff Meeting - 4 PM", type: "school", date: "Today", priority: "important" },
];

// Quick Actions
export const quickActions = [
  { id: "QA1", label: "Mark Attendance", icon: "clipboard" },
  { id: "QA2", label: "Open My Classes", icon: "users" },
  { id: "QA3", label: "Create Assignment", icon: "file" },
  { id: "QA4", label: "Create Exam", icon: "graduation" },
  { id: "QA5", label: "Generate Question Paper", icon: "file-text" },
  { id: "QA6", label: "Upload Resource", icon: "upload" },
  { id: "QA7", label: "Open AI Assistant", icon: "sparkles" },
];

// Helper function
export function getTeacherDashboardData() {
  const completedClasses = todaySchedule.filter(s => s.status === "completed").length;
  const pendingReviews = assignments.reduce((acc, a) => acc + a.pending, 0);
  const upcomingExams = examActivities.filter(e => e.status === "upcoming").length;
  const attendancePending = todaySchedule.filter(s => s.status === "upcoming").length;

  return {
    todaySchedule,
    myClasses,
    assignments,
    examActivities,
    announcements,
    quickActions,
    completedClasses,
    pendingReviews,
    upcomingExams,
    attendancePending,
    totalClasses: todaySchedule.length,
  };
}

export type TeacherDashboardData = ReturnType<typeof getTeacherDashboardData>;
