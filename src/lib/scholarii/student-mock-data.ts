import { loadData } from "./mock";

const STUDENT_EMAIL = "aarav.sharma@scholarii.edu";

export function getStudentByEmail(email: string) {
  const data = loadData();
  return data.students.find((s) => s.parentPhone === email || s.name.toLowerCase().includes("aarav")) ?? data.students[0];
}

export function getStudentDashboardData(studentEmail?: string) {
  const data = loadData();
  const student = studentEmail
    ? data.students.find((s) => s.parentPhone === studentEmail || s.name.toLowerCase().includes("aarav")) ?? data.students[0]
    : data.students[0];

  const subjects = ["Mathematics", "English", "Science", "Social Studies", "Hindi"];
  const testScores = student.testScores ?? {};
  const subjectScores = subjects.map((s) => ({
    subject: s,
    score: testScores[s] ?? 75,
  }));

  const overallScore = Math.round(subjectScores.reduce((a, b) => a + b.score, 0) / subjectScores.length);

  const monthlyPerformance = [
    { month: "Jan", score: Math.max(55, overallScore - 18) },
    { month: "Feb", score: Math.max(58, overallScore - 14) },
    { month: "Mar", score: Math.max(60, overallScore - 11) },
    { month: "Apr", score: Math.max(63, overallScore - 8) },
    { month: "May", score: Math.max(65, overallScore - 5) },
    { month: "Jun", score: overallScore },
  ];

  const attendance = student.attendance;
  const prevMonthAttendance = Math.max(60, attendance - 4);
  const attendanceTrend = attendance - prevMonthAttendance;

  const weeklyAttendance = [
    { week: "W1", present: 5, absent: 0, leave: 0 },
    { week: "W2", present: 4, absent: 1, leave: 0 },
    { week: "W3", present: 5, absent: 0, leave: 0 },
    { week: "W4", present: 4, absent: 0, leave: 1 },
    { week: "W5", present: 5, absent: 0, leave: 0 },
    { week: "W6", present: 3, absent: 1, leave: 1 },
  ];

  const totalDays = weeklyAttendance.reduce((a, w) => a + w.present + w.absent + w.leave, 0);
  const presentDays = weeklyAttendance.reduce((a, w) => a + w.present, 0);
  const absentDays = weeklyAttendance.reduce((a, w) => a + w.absent, 0);
  const leaveDays = weeklyAttendance.reduce((a, w) => a + w.leave, 0);

  const attendanceBreakdown = [
    { name: "Present", value: presentDays, color: "hsl(142, 76%, 36%)" },
    { name: "Absent", value: absentDays, color: "hsl(0, 84%, 60%)" },
    { name: "Leave", value: leaveDays, color: "hsl(38, 92%, 50%)" },
  ];

  const pendingAssignments = [
    {
      id: "PA1",
      title: "Algebra Worksheet — Quadratic Equations",
      subject: "Mathematics",
      dueDate: "Tomorrow",
      priority: "high" as const,
      daysLeft: 1,
    },
    {
      id: "PA2",
      title: "Science Project — Electric Circuits",
      subject: "Science",
      dueDate: "Friday",
      priority: "medium" as const,
      daysLeft: 3,
    },
    {
      id: "PA3",
      title: "Essay: Environmental Awareness",
      subject: "English",
      dueDate: "Next Monday",
      priority: "low" as const,
      daysLeft: 5,
    },
  ];

  const recentSubmissions = [
    {
      id: "RS1",
      title: "History Chapter Notes",
      subject: "Social Studies",
      submittedDate: "Yesterday",
      status: "graded" as const,
      grade: "A",
    },
    {
      id: "RS2",
      title: "Hindi Poem Recitation",
      subject: "Hindi",
      submittedDate: "2 days ago",
      status: "reviewed" as const,
      grade: null,
    },
    {
      id: "RS3",
      title: "Mathematics Unit Test",
      subject: "Mathematics",
      submittedDate: "3 days ago",
      status: "submitted" as const,
      grade: null,
    },
  ];

  const todaySchedule = [
    { time: "08:00", endTime: "08:45", subject: "Mathematics", teacher: "Mr. Kumar", room: "201", status: "completed" as const },
    { time: "08:50", endTime: "09:35", subject: "Science", teacher: "Ms. Priya", room: "Lab 2", status: "completed" as const },
    { time: "09:45", endTime: "10:30", subject: "English", teacher: "Ms. Iyer", room: "105", status: "current" as const },
    { time: "10:40", endTime: "11:25", subject: "Social Studies", teacher: "Mr. Rao", room: "302", status: "upcoming" as const },
    { time: "11:35", endTime: "12:20", subject: "Hindi", teacher: "Mrs. Verma", room: "108", status: "upcoming" as const },
    { time: "12:30", endTime: "13:15", subject: "Computer Science", teacher: "Mr. Sen", room: "Lab 3", status: "upcoming" as const },
  ];

  const upcomingExams = [
    { id: "EX1", name: "Unit Test 2", subject: "Mathematics", date: "2026-06-19", daysLeft: 5 },
    { id: "EX2", name: "Unit Test 2", subject: "Science", date: "2026-06-21", daysLeft: 7 },
    { id: "EX3", name: "Unit Test 2", subject: "English", date: "2026-06-23", daysLeft: 9 },
    { id: "EX4", name: "Mid-Term Examination", subject: "All Subjects", date: "2026-07-10", daysLeft: 26 },
    { id: "EX5", name: "Practical Exam", subject: "Computer Science", date: "2026-07-12", daysLeft: 28 },
  ];

  const announcements = [
    {
      id: "AN1",
      title: "Sports Day Registration Open",
      date: "Jun 12, 2026",
      priority: "normal" as const,
      unread: true,
    },
    {
      id: "AN2",
      title: "Holiday Notice — June 15",
      date: "Jun 10, 2026",
      priority: "important" as const,
      unread: true,
    },
    {
      id: "AN3",
      title: "Science Exhibition — Call for Projects",
      date: "Jun 8, 2026",
      priority: "normal" as const,
      unread: false,
    },
    {
      id: "AN4",
      title: "Parent-Teacher Meeting — June 20",
      date: "Jun 7, 2026",
      priority: "important" as const,
      unread: false,
    },
  ];

  const aiInsights = [
    {
      id: "AI1",
      type: "improvement" as const,
      text: `Your Mathematics score improved by ${Math.max(5, overallScore - (monthlyPerformance[0]?.score ?? 60))}% over the last 6 months. Keep it up!`,
    },
    {
      id: "AI2",
      type: "warning" as const,
      text: "Science attendance dropped by 8% this month. Consider attending all lab sessions.",
    },
    {
      id: "AI3",
      type: "positive" as const,
      text: "You are performing above class average in English. Great work!",
    },
    {
      id: "AI4",
      type: "suggestion" as const,
      text: "Focus on Algebra and Trigonometry before the upcoming Mathematics test.",
    },
  ];

  return {
    student,
    overallScore,
    previousScore: Math.max(60, overallScore - 5),
    attendance,
    attendanceTrend,
    pendingCount: pendingAssignments.length,
    submittedCount: recentSubmissions.length,
    upcomingExamCount: upcomingExams.length,
    nextExamDays: upcomingExams[0]?.daysLeft ?? 0,
    monthlyPerformance,
    subjectScores,
    weeklyAttendance,
    attendanceBreakdown,
    totalDays,
    pendingAssignments,
    recentSubmissions,
    todaySchedule,
    upcomingExams,
    announcements,
    aiInsights,
    subjects,
  };
}

export type StudentDashboardData = ReturnType<typeof getStudentDashboardData>;
