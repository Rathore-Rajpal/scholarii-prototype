// ============================================================
// TEACHER ATTENDANCE MOCK DATA
// ============================================================

export interface AttendanceStudent {
  id: string;
  name: string;
  roll: number;
  className: string;
  gender: "Male" | "Female";
  attendance: number;
  status: "present" | "absent" | "late" | "leave" | null;
  parentName: string;
  parentContact: string;
  consecutiveAbsences: number;
}

export interface DailyAttendance {
  date: string;
  day: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  total: number;
}

export interface RiskStudent {
  id: string;
  name: string;
  roll: number;
  className: string;
  attendance: number;
  reason: string;
  riskLevel: "high" | "medium" | "low";
  consecutiveAbsences: number;
  parentName: string;
  parentContact: string;
}

export interface MonthlyTrend {
  month: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percentage: number;
}

export interface WeeklyTrend {
  week: string;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface HeatmapDay {
  day: string;
 Mon: number; Tue: number; Wed: number; Thu: number; Fri: number; Sat: number;
}

export const TEACHER_CLASSES = ["8-A", "7-B", "9-A", "10-A"];
export const TEACHER_SUBJECTS = ["Mathematics", "Computer Science"];
export const TEACHER_LECTURES = [
  { id: "L1", time: "08:00 - 08:45", class: "8-A", subject: "Mathematics" },
  { id: "L2", time: "09:00 - 09:45", class: "9-B", subject: "Mathematics" },
  { id: "L3", time: "10:00 - 10:45", class: "8-A", subject: "Mathematics" },
  { id: "L4", time: "11:00 - 11:45", class: "7-B", subject: "Mathematics" },
  { id: "L5", time: "12:00 - 12:45", class: "9-A", subject: "Mathematics" },
];

export const ATTENDANCE_STUDENTS: AttendanceStudent[] = [
  { id: "s1", name: "Aarav Sharma", roll: 1, className: "8-A", gender: "Male", attendance: 96, status: "present", parentName: "Rajesh Sharma", parentContact: "+91 98765 43210", consecutiveAbsences: 0 },
  { id: "s2", name: "Priya Patel", roll: 2, className: "8-A", gender: "Female", attendance: 94, status: "present", parentName: "Suresh Patel", parentContact: "+91 98765 43212", consecutiveAbsences: 0 },
  { id: "s3", name: "Rohan Gupta", roll: 3, className: "8-A", gender: "Male", attendance: 78, status: "absent", parentName: "Anil Gupta", parentContact: "+91 98765 43214", consecutiveAbsences: 3 },
  { id: "s4", name: "Sneha Reddy", roll: 4, className: "8-A", gender: "Female", attendance: 92, status: "present", parentName: "Venkat Reddy", parentContact: "+91 98765 43216", consecutiveAbsences: 0 },
  { id: "s5", name: "Vikram Singh", roll: 5, className: "8-A", gender: "Male", attendance: 88, status: "late", parentName: "Manoj Singh", parentContact: "+91 98765 43218", consecutiveAbsences: 0 },
  { id: "s6", name: "Ananya Nair", roll: 6, className: "8-A", gender: "Female", attendance: 98, status: "present", parentName: "Krishna Nair", parentContact: "+91 98765 43220", consecutiveAbsences: 0 },
  { id: "s7", name: "Karthik Menon", roll: 7, className: "8-A", gender: "Male", attendance: 85, status: "present", parentName: "Ravi Menon", parentContact: "+91 98765 43222", consecutiveAbsences: 0 },
  { id: "s8", name: "Divya Joshi", roll: 8, className: "8-A", gender: "Female", attendance: 76, status: "absent", parentName: "Suresh Joshi", parentContact: "+91 98765 43224", consecutiveAbsences: 4 },
  { id: "s9", name: "Arjun Das", roll: 9, className: "8-A", gender: "Male", attendance: 91, status: "present", parentName: "Prakash Das", parentContact: "+91 98765 43226", consecutiveAbsences: 0 },
  { id: "s10", name: "Neha Kapoor", roll: 10, className: "8-A", gender: "Female", attendance: 97, status: "present", parentName: "Amit Kapoor", parentContact: "+91 98765 43228", consecutiveAbsences: 0 },
  { id: "s11", name: "Rahul Verma", roll: 11, className: "8-A", gender: "Male", attendance: 89, status: "leave", parentName: "Deepak Verma", parentContact: "+91 98765 43230", consecutiveAbsences: 0 },
  { id: "s12", name: "Simran Kaur", roll: 12, className: "8-A", gender: "Female", attendance: 82, status: "present", parentName: "Harpreet Kaur", parentContact: "+91 98765 43232", consecutiveAbsences: 0 },
];

export const DAILY_ATTENDANCE_HISTORY: DailyAttendance[] = [
  { date: "16 Jun 2026", day: "Monday", present: 39, absent: 3, late: 1, leave: 1, total: 44 },
  { date: "15 Jun 2026", day: "Sunday", present: 0, absent: 0, late: 0, leave: 0, total: 0 },
  { date: "14 Jun 2026", day: "Saturday", present: 40, absent: 2, late: 1, leave: 1, total: 44 },
  { date: "13 Jun 2026", day: "Friday", present: 41, absent: 2, late: 0, leave: 1, total: 44 },
  { date: "12 Jun 2026", day: "Thursday", present: 38, absent: 4, late: 1, leave: 1, total: 44 },
  { date: "11 Jun 2026", day: "Wednesday", present: 40, absent: 3, late: 0, leave: 1, total: 44 },
  { date: "10 Jun 2026", day: "Tuesday", present: 42, absent: 1, late: 0, leave: 1, total: 44 },
  { date: "09 Jun 2026", day: "Monday", present: 37, absent: 5, late: 1, leave: 1, total: 44 },
  { date: "08 Jun 2026", day: "Sunday", present: 0, absent: 0, late: 0, leave: 0, total: 0 },
  { date: "07 Jun 2026", day: "Saturday", present: 39, absent: 3, late: 1, leave: 1, total: 44 },
  { date: "06 Jun 2026", day: "Friday", present: 41, absent: 2, late: 0, leave: 1, total: 44 },
  { date: "05 Jun 2026", day: "Thursday", present: 40, absent: 3, late: 0, leave: 1, total: 44 },
  { date: "04 Jun 2026", day: "Wednesday", present: 38, absent: 4, late: 1, leave: 1, total: 44 },
  { date: "03 Jun 2026", day: "Tuesday", present: 42, absent: 1, late: 0, leave: 1, total: 44 },
];

export const RISK_STUDENTS: RiskStudent[] = [
  { id: "s3", name: "Rohan Gupta", roll: 3, className: "8-A", attendance: 78, reason: "Attendance below 80%", riskLevel: "high", consecutiveAbsences: 3, parentName: "Anil Gupta", parentContact: "+91 98765 43214" },
  { id: "s8", name: "Divya Joshi", roll: 8, className: "8-A", attendance: 76, reason: "4 consecutive absences", riskLevel: "high", consecutiveAbsences: 4, parentName: "Suresh Joshi", parentContact: "+91 98765 43224" },
  { id: "s12", name: "Simran Kaur", roll: 12, className: "8-A", attendance: 82, reason: "Attendance dropping consistently", riskLevel: "medium", consecutiveAbsences: 1, parentName: "Harpreet Kaur", parentContact: "+91 98765 43232" },
  { id: "s5", name: "Vikram Singh", roll: 5, className: "8-A", attendance: 88, reason: "2 late arrivals this week", riskLevel: "low", consecutiveAbsences: 0, parentName: "Manoj Singh", parentContact: "+91 98765 43218" },
];

export const MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: "Jan", present: 880, absent: 80, late: 25, leave: 15, percentage: 88 },
  { month: "Feb", present: 900, absent: 65, late: 20, leave: 15, percentage: 90 },
  { month: "Mar", present: 920, absent: 55, late: 15, leave: 10, percentage: 92 },
  { month: "Apr", present: 890, absent: 70, late: 25, leave: 15, percentage: 89 },
  { month: "May", present: 910, absent: 60, late: 20, leave: 10, percentage: 91 },
  { month: "Jun", present: 940, absent: 40, late: 15, leave: 5, percentage: 94 },
];

export const WEEKLY_TRENDS: WeeklyTrend[] = [
  { week: "Week 1", present: 210, absent: 15, late: 8, percentage: 90 },
  { week: "Week 2", present: 218, absent: 10, late: 5, percentage: 93 },
  { week: "Week 3", present: 215, absent: 12, late: 6, percentage: 92 },
  { week: "Week 4", present: 220, absent: 8, late: 4, percentage: 95 },
  { week: "Week 5", present: 216, absent: 11, late: 5, percentage: 93 },
  { week: "Week 6", present: 222, absent: 7, late: 3, percentage: 96 },
];

export const HEATMAP_DATA: HeatmapDay[] = [
  { day: "Week 1", Mon: 95, Tue: 93, Wed: 91, Thu: 94, Fri: 92, Sat: 88 },
  { day: "Week 2", Mon: 90, Tue: 94, Wed: 95, Thu: 93, Fri: 96, Sat: 91 },
  { day: "Week 3", Mon: 88, Tue: 92, Wed: 93, Thu: 90, Fri: 94, Sat: 89 },
  { day: "Week 4", Mon: 93, Tue: 96, Wed: 97, Thu: 95, Fri: 98, Sat: 94 },
  { day: "Week 5", Mon: 91, Tue: 94, Wed: 92, Thu: 93, Fri: 95, Sat: 90 },
  { day: "Week 6", Mon: 96, Tue: 97, Wed: 98, Thu: 96, Fri: 99, Sat: 95 },
];

export const CLASS_COMPARISON = [
  { class: "8-A", percentage: 94, total: 44, present: 41 },
  { class: "7-B", percentage: 91, total: 42, present: 38 },
  { class: "9-A", percentage: 89, total: 40, present: 36 },
  { class: "10-A", percentage: 96, total: 38, present: 36 },
];

export const TOP_ATTENDEES = [
  { name: "Ananya Nair", roll: 6, className: "8-A", percentage: 98 },
  { name: "Neha Kapoor", roll: 10, className: "8-A", percentage: 97 },
  { name: "Aarav Sharma", roll: 1, className: "8-A", percentage: 96 },
  { name: "Sneha Reddy", roll: 4, className: "8-A", percentage: 92 },
  { name: "Arjun Das", roll: 9, className: "8-A", percentage: 91 },
];

export const MOST_ABSENT_STUDENTS = [
  { name: "Divya Joshi", roll: 8, className: "8-A", percentage: 76, absentDays: 14 },
  { name: "Rohan Gupta", roll: 3, className: "8-A", percentage: 78, absentDays: 12 },
  { name: "Simran Kaur", roll: 12, className: "8-A", percentage: 82, absentDays: 9 },
  { name: "Karthik Menon", roll: 7, className: "8-A", percentage: 85, absentDays: 7 },
  { name: "Vikram Singh", roll: 5, className: "8-A", percentage: 88, absentDays: 5 },
];

export const ATTENDANCE_AI_INSIGHTS = [
  { text: "Attendance dropped by 4% this month compared to last month.", type: "warning" as const },
  { text: "3 students require immediate intervention for low attendance.", type: "warning" as const },
  { text: "Monday attendance is consistently 5% lower than other days.", type: "info" as const },
  { text: "5 students have excellent attendance above 95%.", type: "success" as const },
  { text: "Class 8-A attendance improved by 2% after parent notifications.", type: "success" as const },
  { text: "Consider flexible scheduling for students with chronic absences.", type: "info" as const },
];

export function getStudentAttendanceHistory(studentId: string) {
  const histories: Record<string, { month: string; present: number; absent: number; late: number; leave: number }[]> = {
    s1: [
      { month: "Jan", present: 22, absent: 0, late: 1, leave: 1 },
      { month: "Feb", present: 20, absent: 1, late: 0, leave: 1 },
      { month: "Mar", present: 23, absent: 0, late: 0, leave: 0 },
      { month: "Apr", present: 21, absent: 1, late: 1, leave: 0 },
      { month: "May", present: 22, absent: 0, late: 0, leave: 1 },
      { month: "Jun", present: 18, absent: 0, late: 0, leave: 0 },
    ],
    s3: [
      { month: "Jan", present: 18, absent: 4, late: 2, leave: 0 },
      { month: "Feb", present: 16, absent: 5, late: 1, leave: 0 },
      { month: "Mar", present: 20, absent: 2, late: 1, leave: 0 },
      { month: "Apr", present: 17, absent: 4, late: 2, leave: 0 },
      { month: "May", present: 19, absent: 3, late: 1, leave: 0 },
      { month: "Jun", present: 14, absent: 3, late: 1, leave: 0 },
    ],
    s8: [
      { month: "Jan", present: 17, absent: 5, late: 1, leave: 1 },
      { month: "Feb", present: 16, absent: 5, late: 2, leave: 0 },
      { month: "Mar", present: 18, absent: 4, late: 1, leave: 0 },
      { month: "Apr", present: 16, absent: 5, late: 2, leave: 0 },
      { month: "May", present: 17, absent: 4, late: 2, leave: 0 },
      { month: "Jun", present: 12, absent: 5, late: 1, leave: 0 },
    ],
  };
  return histories[studentId] || histories.s1;
}
