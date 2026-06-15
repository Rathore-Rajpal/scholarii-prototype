import type { StudentDashboardData } from "./student-mock-data";

// ============================================================
// ATTENDANCE MOCK DATA
// Reused by both Student and Parent Attendance pages
// ============================================================

export interface AttendanceDay {
  date: string;
  day: string;
  status: "present" | "absent" | "leave" | "holiday";
  subjects: {
    name: string;
    status: "present" | "absent" | "leave" | "holiday";
  }[];
}

export interface SubjectAttendance {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  teacher: string;
}

export interface AttendanceInsight {
  id: string;
  type: "improvement" | "warning" | "positive" | "suggestion";
  text: string;
}

export interface WeeklyTrend {
  week: string;
  present: number;
  absent: number;
  leave: number;
}

export const ATTENDANCE_PERCENTAGE = 94;
export const TOTAL_SCHOOL_DAYS = 150;
export const PRESENT_DAYS = 142;
export const ABSENT_DAYS = 6;
export const LEAVE_DAYS = 2;
export const HOLIDAY_DAYS = 0;

export const monthlyAttendance: { m: string; v: number }[] = [
  { m: "Apr", v: 92 },
  { m: "May", v: 94 },
  { m: "Jun", v: 91 },
  { m: "Jul", v: 95 },
  { m: "Aug", v: 93 },
  { m: "Sep", v: 96 },
  { m: "Oct", v: 94 },
  { m: "Nov", v: 97 },
];

export const weeklyTrends: WeeklyTrend[] = [
  { week: "Week 1", present: 5, absent: 0, leave: 0 },
  { week: "Week 2", present: 4, absent: 1, leave: 0 },
  { week: "Week 3", present: 5, absent: 0, leave: 0 },
  { week: "Week 4", present: 4, absent: 0, leave: 1 },
  { week: "Week 5", present: 5, absent: 0, leave: 0 },
  { week: "Week 6", present: 4, absent: 1, leave: 0 },
];

export const attendanceBreakdown = [
  { name: "Present", value: PRESENT_DAYS, color: "hsl(142, 76%, 36%)" },
  { name: "Absent", value: ABSENT_DAYS, color: "hsl(0, 84%, 60%)" },
  { name: "Leave", value: LEAVE_DAYS, color: "hsl(38, 92%, 50%)" },
];

export const subjectAttendance: SubjectAttendance[] = [
  { subject: "Mathematics", attended: 28, total: 30, percentage: 93, trend: "up", teacher: "Mr. Kumar" },
  { subject: "Science", attended: 27, total: 30, percentage: 90, trend: "stable", teacher: "Ms. Priya" },
  { subject: "English", attended: 29, total: 30, percentage: 97, trend: "up", teacher: "Ms. Iyer" },
  { subject: "Social Studies", attended: 26, total: 30, percentage: 87, trend: "down", teacher: "Mr. Rao" },
  { subject: "Hindi", attended: 28, total: 30, percentage: 93, trend: "stable", teacher: "Mrs. Verma" },
  { subject: "Computer Science", attended: 29, total: 30, percentage: 97, trend: "up", teacher: "Mr. Sen" },
];

// Daily attendance for current month (June 2026)
export const dailyAttendance: AttendanceDay[] = [
  { date: "2026-06-01", day: "Mon", status: "present", subjects: [{ name: "Math", status: "present" }, { name: "Science", status: "present" }, { name: "English", status: "present" }] },
  { date: "2026-06-02", day: "Tue", status: "present", subjects: [{ name: "Math", status: "present" }, { name: "Hindi", status: "present" }, { name: "Social", status: "present" }] },
  { date: "2026-06-03", day: "Wed", status: "present", subjects: [{ name: "Science", status: "present" }, { name: "English", status: "present" }, { name: "CS", status: "present" }] },
  { date: "2026-06-04", day: "Thu", status: "absent", subjects: [{ name: "Math", status: "absent" }, { name: "Hindi", status: "absent" }, { name: "Science", status: "absent" }] },
  { date: "2026-06-05", day: "Fri", status: "present", subjects: [{ name: "English", status: "present" }, { name: "Social", status: "present" }, { name: "Math", status: "present" }] },
  { date: "2026-06-06", day: "Sat", status: "present", subjects: [{ name: "CS", status: "present" }, { name: "Hindi", status: "present" }] },
  { date: "2026-06-09", day: "Mon", status: "present", subjects: [{ name: "Math", status: "present" }, { name: "Science", status: "present" }, { name: "English", status: "present" }] },
  { date: "2026-06-10", day: "Tue", status: "present", subjects: [{ name: "Hindi", status: "present" }, { name: "Social", status: "present" }, { name: "Math", status: "present" }] },
  { date: "2026-06-11", day: "Wed", status: "leave", subjects: [{ name: "Science", status: "leave" }, { name: "English", status: "leave" }, { name: "CS", status: "leave" }] },
  { date: "2026-06-12", day: "Thu", status: "present", subjects: [{ name: "Math", status: "present" }, { name: "Hindi", status: "present" }, { name: "Social", status: "present" }] },
  { date: "2026-06-13", day: "Fri", status: "present", subjects: [{ name: "English", status: "present" }, { name: "Science", status: "present" }, { name: "Math", status: "present" }] },
  { date: "2026-06-14", day: "Sat", status: "present", subjects: [{ name: "CS", status: "present" }, { name: "Hindi", status: "present" }] },
  { date: "2026-06-16", day: "Mon", status: "present", subjects: [{ name: "Math", status: "present" }, { name: "Science", status: "present" }, { name: "English", status: "present" }] },
  { date: "2026-06-17", day: "Tue", status: "present", subjects: [{ name: "Hindi", status: "present" }, { name: "Social", status: "present" }, { name: "Math", status: "present" }] },
  { date: "2026-06-18", day: "Wed", status: "present", subjects: [{ name: "Science", status: "present" }, { name: "English", status: "present" }, { name: "CS", status: "present" }] },
];

export const attendanceInsights: AttendanceInsight[] = [
  { id: "AI1", type: "positive", text: "Your child maintained excellent attendance this month with 94% attendance rate." },
  { id: "AI2", type: "improvement", text: "Attendance improved by 3% compared to last month — great progress!" },
  { id: "AI3", type: "suggestion", text: "Consider maintaining consistent attendance to achieve 95%+ target." },
  { id: "AI4", type: "warning", text: "2 days of leave taken this month. Monitor if this pattern continues." },
];

// Helper function to get attendance data (reused by both pages)
export function getAttendanceData() {
  return {
    percentage: ATTENDANCE_PERCENTAGE,
    totalDays: TOTAL_SCHOOL_DAYS,
    presentDays: PRESENT_DAYS,
    absentDays: ABSENT_DAYS,
    leaveDays: LEAVE_DAYS,
    monthlyAttendance,
    weeklyTrends,
    attendanceBreakdown,
    subjectAttendance,
    dailyAttendance,
    attendanceInsights,
    targetPercentage: 95,
    lastMonthPercentage: 91,
    streak: 8, // current consecutive present days
  };
}

export type AttendanceData = ReturnType<typeof getAttendanceData>;
