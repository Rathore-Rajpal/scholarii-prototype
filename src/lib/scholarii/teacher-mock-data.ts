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
  isProxy: boolean;
}

export interface OngoingChapter {
  id: string;
  className: string;
  subject: string;
  chapter: string;
  progress: number;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: "exam" | "pta" | "event" | "holiday";
}

export interface PendingAction {
  id: string;
  title: string;
  count: number;
  type: "documents" | "assignments" | "marks" | "attendance" | "reports";
}

export interface AiInsight {
  id: string;
  text: string;
  type: "warning" | "info" | "success";
}

// Today's Schedule
export const todaySchedule: TeacherSchedule[] = [
  { id: "S1", time: "08:00", endTime: "08:45", className: "8-A", subject: "Mathematics", room: "203", status: "completed", isProxy: false },
  { id: "S2", time: "09:00", endTime: "09:45", className: "9-B", subject: "Mathematics", room: "205", status: "completed", isProxy: false },
  { id: "S3", time: "10:00", endTime: "10:45", className: "8-A", subject: "Mathematics", room: "203", status: "ongoing", isProxy: false },
  { id: "S4", time: "11:00", endTime: "11:45", className: "7-B", subject: "Mathematics", room: "105", status: "upcoming", isProxy: false },
  { id: "S5", time: "12:00", endTime: "12:45", className: "9-A", subject: "Mathematics", room: "205", status: "upcoming", isProxy: true },
];

// Ongoing Chapters
export const ongoingChapters: OngoingChapter[] = [
  { id: "OC1", className: "8-A", subject: "Mathematics", chapter: "Quadratic Equations", progress: 78 },
  { id: "OC2", className: "9-A", subject: "Mathematics", chapter: "Polynomials", progress: 62 },
  { id: "OC3", className: "10-A", subject: "Computer Science", chapter: "Data Structures", progress: 54 },
  { id: "OC4", className: "7-B", subject: "Mathematics", chapter: "Data Handling", progress: 45 },
];

// Upcoming Events
export const upcomingEvents: UpcomingEvent[] = [
  { id: "UE1", title: "Science Fair", date: "20 June", type: "event" },
  { id: "UE2", title: "PTA Meeting", date: "25 June", type: "pta" },
  { id: "UE3", title: "Mathematics Unit Test", date: "28 June", type: "exam" },
  { id: "UE4", title: "Summer Break", date: "15 July", type: "holiday" },
];

// Pending Actions
export const pendingActions: PendingAction[] = [
  { id: "PA1", title: "Student Documents", count: 4, type: "documents" },
  { id: "PA2", title: "Assignment Reviews", count: 12, type: "assignments" },
  { id: "PA3", title: "Marks Entry", count: 2, type: "marks" },
  { id: "PA4", title: "Attendance", count: 1, type: "attendance" },
  { id: "PA5", title: "Report Submission", count: 1, type: "reports" },
];

// AI Insights
export const aiInsights: AiInsight[] = [
  { id: "AI1", text: "5 students need additional Mathematics support in Class 8-A.", type: "warning" },
  { id: "AI2", text: "Attendance dropped by 3% this week across all classes.", type: "warning" },
  { id: "AI3", text: "Class 8-A is exam ready with 82% average score.", type: "success" },
  { id: "AI4", text: "Quadratic Equations may need one extra revision session.", type: "info" },
  { id: "AI5", text: "4 documents are awaiting verification.", type: "warning" },
];

// Quick Actions
export const quickActions = [
  { id: "QA1", label: "Mark Attendance", icon: "clipboard" },
  { id: "QA2", label: "Enter Marks", icon: "edit" },
  { id: "QA3", label: "Verify Documents", icon: "file-check" },
  { id: "QA4", label: "Create Assignment", icon: "file-plus" },
  { id: "QA5", label: "Generate Question Paper", icon: "file-text" },
  { id: "QA6", label: "Create Daily Report", icon: "clipboard-list" },
  { id: "QA7", label: "Open My Class", icon: "users" },
  { id: "QA8", label: "Open AI Assistant", icon: "sparkles" },
];

// Helper function
export function getTeacherDashboardData() {
  const completedClasses = todaySchedule.filter(s => s.status === "completed").length;
  const pendingDocVerifications = pendingActions.find(a => a.type === "documents")?.count || 0;
  const proxyClasses = todaySchedule.filter(s => s.isProxy).length;

  return {
    todaySchedule,
    ongoingChapters,
    upcomingEvents,
    pendingActions,
    aiInsights,
    quickActions,
    totalClasses: todaySchedule.length,
    completedClasses,
    pendingDocVerifications,
    proxyClasses,
    myClassAttendance: 94,
    personalAttendance: { present: 22, total: 24 },
  };
}

export type TeacherDashboardData = ReturnType<typeof getTeacherDashboardData>;
