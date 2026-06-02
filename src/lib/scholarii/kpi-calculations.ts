import type { Student, Teacher, KPICard, SchoolPulseSector, OperationalSummary, ActivityEvent } from "./types";
import { feeCollection, getSeededRandom } from "./mock";

/**
 * Calculate Student Attendance KPI
 */
export function calculateStudentAttendanceKPI(students: Student[]): KPICard {
  const today = new Date().toDateString();
  const presentStudents = students.filter((s) => s.attendance >= 75).length;
  const totalStudents = students.length;
  const percentage = Math.round((presentStudents / totalStudents) * 100);

  // Simulate comparison with previous day/week
  const yesterdayPercentage = Math.round((presentStudents / totalStudents) * 100 - 1.2);
  const trend = {
    direction: percentage > yesterdayPercentage ? ("up" as const) : ("down" as const),
    isPositive: true,
    percentage: Math.abs(percentage - yesterdayPercentage),
  };

  return {
    id: "attendance-kpi",
    title: "Student Attendance",
    value: `${presentStudents} / ${totalStudents}`,
    percentage,
    percentageLabel: `${percentage}%`,
    trend,
    status: percentage >= 90 ? "healthy" : percentage >= 80 ? "moderate" : "attention",
    sparklineData: Array.from({ length: 7 }, (_, i) => ({
      x: i,
      y: 85 + getSeededRandom().next() * 10,
    })),
    icon: "users",
  };
}

/**
 * Calculate Teacher Attendance KPI
 */
export function calculateTeacherAttendanceKPI(teachers: Teacher[]): KPICard {
  const activeTeachers = teachers.filter((t) => t.status === "Active").length;
  const onLeave = teachers.filter((t) => t.status === "On Leave").length;
  const late = teachers.filter((t) => t.status === "Late").length;
  const totalTeachers = teachers.length;
  const percentage = Math.round((activeTeachers / totalTeachers) * 100);

  const trend = {
    direction: "stable" as const,
    isPositive: true,
    percentage: 0,
  };

  return {
    id: "teacher-attendance-kpi",
    title: "Teacher Attendance",
    value: `${activeTeachers} / ${totalTeachers}`,
    percentage,
    percentageLabel: `${activeTeachers} Present, ${onLeave} On Leave, ${late} Late`,
    trend,
    status: activeTeachers >= totalTeachers - 2 ? "healthy" : "moderate",
    sparklineData: Array.from({ length: 7 }, (_, i) => ({
      x: i,
      y: 90 + getSeededRandom().next() * 8,
    })),
    icon: "briefcase",
  };
}

/**
 * Calculate Fee Collection KPI
 */
export function calculateFeeCollectionKPI(students: Student[], feeTarget: number): KPICard {
  const paidStudents = students.filter((s) => s.feeStatus === "Paid").length;
  const totalStudents = students.length;
  const averageFeePerStudent = feeTarget / totalStudents;
  const collectedAmount = paidStudents * averageFeePerStudent;
  const percentOfTarget = Math.round((collectedAmount / feeTarget) * 100);
  const pendingAmount = feeTarget - collectedAmount;
  const defaulters = students.filter((s) => s.feeStatus === "Overdue").length;

  const trend = {
    direction: percentOfTarget >= 80 ? ("up" as const) : ("down" as const),
    isPositive: percentOfTarget >= 80,
    percentage: percentOfTarget >= 80 ? 5 : 8,
  };

  return {
    id: "fee-collection-kpi",
    title: "Fee Collection",
    value: `₹${(collectedAmount / 100000).toFixed(1)}L`,
    percentage: percentOfTarget,
    percentageLabel: `${percentOfTarget}% of target`,
    trend,
    status: percentOfTarget >= 85 ? "healthy" : percentOfTarget >= 70 ? "moderate" : "attention",
    sparklineData: feeCollection.map((item, i) => ({
      x: i,
      y: item.v / 100000,
    })),
    icon: "dollar-sign",
  };
}

/**
 * Calculate Academic Performance KPI
 */
export function calculateAcademicPerformanceKPI(students: Student[]): KPICard {
  const allScores: number[] = [];
  students.forEach((s) => {
    if (s.testScores) {
      allScores.push(...Object.values(s.testScores));
    }
  });

  const schoolAverage = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  // Calculate subject-wise averages
  const subjectAverages: Record<string, number[]> = {};
  students.forEach((s) => {
    if (s.testScores) {
      Object.entries(s.testScores).forEach(([subject, score]) => {
        if (!subjectAverages[subject]) subjectAverages[subject] = [];
        subjectAverages[subject].push(score);
      });
    }
  });

  const subjectAvgs = Object.entries(subjectAverages).map(([subject, scores]) => ({
    subject,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));

  subjectAvgs.sort((a, b) => b.avg - a.avg);
  const strongest = subjectAvgs[0]?.subject || "N/A";
  const weakest = subjectAvgs[subjectAvgs.length - 1]?.subject || "N/A";

  const trend = {
    direction: "up" as const,
    isPositive: true,
    percentage: 3,
  };

  return {
    id: "academic-performance-kpi",
    title: "Academic Performance",
    value: `${schoolAverage}%`,
    percentage: schoolAverage,
    percentageLabel: `${strongest} ↑ | ${weakest} ↓`,
    trend,
    status: schoolAverage >= 80 ? "healthy" : schoolAverage >= 70 ? "moderate" : "attention",
    sparklineData: Array.from({ length: 7 }, (_, i) => ({
      x: i,
      y: 75 + getSeededRandom().next() * 8,
    })),
    icon: "book",
  };
}

/**
 * Calculate Parent Engagement KPI
 */
export function calculateParentEngagementKPI(students: Student[]): KPICard {
  const engagedParents = students.filter((s) => (s.parentEngagementScore || 0) >= 70).length;
  const totalStudents = students.length;
  const engagementPercentage = Math.round((engagedParents / totalStudents) * 100);
  const averageEngagement = Math.round(
    students.reduce((sum, s) => sum + (s.parentEngagementScore || 0), 0) / totalStudents
  );

  const trend = {
    direction: averageEngagement >= 70 ? ("up" as const) : ("down" as const),
    isPositive: true,
    percentage: 2,
  };

  return {
    id: "parent-engagement-kpi",
    title: "Parent Engagement",
    value: `${averageEngagement}%`,
    percentage: averageEngagement,
    percentageLabel: `${engagedParents} engaged families`,
    trend,
    status: averageEngagement >= 75 ? "healthy" : averageEngagement >= 60 ? "moderate" : "attention",
    sparklineData: Array.from({ length: 7 }, (_, i) => ({
      x: i,
      y: 60 + getSeededRandom().next() * 20,
    })),
    icon: "users",
  };
}

/**
 * Calculate Teacher Workload KPI
 */
export function calculateTeacherWorkloadKPI(teachers: Teacher[]): KPICard {
  const overloadedTeachers = teachers.filter((t) => t.isOverloaded).length;
  const avgClassesPerDay = Math.round(teachers.reduce((sum, t) => sum + (t.classesPerDay || 0), 0) / teachers.length);
  const avgPendingTasks = Math.round(teachers.reduce((sum, t) => sum + (t.pendingTasks || 0), 0) / teachers.length);

  const trend = {
    direction: overloadedTeachers > 3 ? ("up" as const) : ("down" as const),
    isPositive: overloadedTeachers <= 2,
    percentage: overloadedTeachers > 3 ? 8 : 2,
  };

  return {
    id: "teacher-workload-kpi",
    title: "Teacher Workload",
    value: `${overloadedTeachers}`,
    percentage: Math.round((overloadedTeachers / teachers.length) * 100),
    percentageLabel: `${overloadedTeachers} overloaded teachers`,
    trend,
    status: overloadedTeachers === 0 ? "healthy" : overloadedTeachers <= 2 ? "moderate" : "attention",
    sparklineData: Array.from({ length: 7 }, (_, i) => ({
      x: i,
      y: 4 + getSeededRandom().next() * 4,
    })),
    icon: "briefcase",
  };
}

/**
 * Calculate School Pulse - Operational Health
 */
export function calculateSchoolPulse(
  students: Student[],
  teachers: Teacher[],
  feeTarget: number
): SchoolPulseSector[] {
  const attendanceKPI = calculateStudentAttendanceKPI(students);
  const feeKPI = calculateFeeCollectionKPI(students, feeTarget);
  const workloadKPI = calculateTeacherWorkloadKPI(teachers);
  const engagementKPI = calculateParentEngagementKPI(students);
  const academicKPI = calculateAcademicPerformanceKPI(students);

  return [
    {
      name: "Attendance",
      status: attendanceKPI.status,
      value: attendanceKPI.percentageLabel,
      description: `${attendanceKPI.percentage}% present today`,
    },
    {
      name: "Fee Collection",
      status: feeKPI.status,
      value: `${feeKPI.percentage}% target`,
      description: `₹${(parseFloat(feeKPI.value) * 100000).toLocaleString('en-IN')}`,
    },
    {
      name: "Teacher Workload",
      status: workloadKPI.status,
      value: `${workloadKPI.value} overloaded`,
      description: `Avg ${Math.round(teachers.reduce((s, t) => s + (t.classesPerDay || 0), 0) / teachers.length)} classes/day`,
    },
    {
      name: "Parent Engagement",
      status: engagementKPI.status,
      value: `${engagementKPI.percentage}%`,
      description: "Overall engagement score",
    },
    {
      name: "Academic Performance",
      status: academicKPI.status,
      value: `${academicKPI.percentage}%`,
      description: "School-wide academic average",
    },
    {
      name: "Compliance",
      status: "healthy",
      value: "Good",
      description: "All policies on track",
    },
  ];
}

/**
 * Generate Operational Summary
 */
export function generateOperationalSummary(
  students: Student[],
  teachers: Teacher[],
  feeTarget: number
): OperationalSummary {
  const attendanceKPI = calculateStudentAttendanceKPI(students);
  const feeKPI = calculateFeeCollectionKPI(students, feeTarget);
  const workloadKPI = calculateTeacherWorkloadKPI(teachers);

  const issues: string[] = [];
  const summaryParts: string[] = ["School operations are stable."];

  if (feeKPI.status === "attention") {
    issues.push("Fee collection below target");
    summaryParts.push("Fee collection for multiple classes is below target.");
  } else if (feeKPI.status === "moderate") {
    issues.push("Fee collection needs attention");
    summaryParts.push("Fee collection is approaching target.");
  }

  if (workloadKPI.status === "attention") {
    issues.push("High teacher workload detected");
    summaryParts.push("Several teachers are overloaded, particularly during exam periods.");
  }

  if (attendanceKPI.status === "attention") {
    issues.push("Student attendance declining");
    summaryParts.push("Student attendance has dropped below target.");
  }

  return {
    text: summaryParts.join(" "),
    keyIssues: issues,
    timestamp: new Date(),
  };
}

/**
 * Generate Mock Activity Events with Real-time Feel
 */
export function generateLiveActivityEvent(): ActivityEvent {
  const eventTypes = [
    { type: "fee_payment" as const, title: "Fee Payment Received", descriptions: ["₹25,000 from Class 9-A", "₹15,000 from Class 8-B"] },
    { type: "admission" as const, title: "New Admission Received", descriptions: ["Class 6-A admission inquiry", "Class 7-B application submitted"] },
    { type: "attendance" as const, title: "Attendance Marked", descriptions: ["Attendance recorded for Grade 9", "Class 10 morning attendance marked"] },
    { type: "homework" as const, title: "Homework Uploaded", descriptions: ["Math assignment for Class 8-A", "Science project submission for Class 9-B"] },
    { type: "announcement" as const, title: "Announcement Published", descriptions: ["Parent circular sent to 450 recipients", "Student notice posted on dashboard"] },
    { type: "ptm" as const, title: "PTM Scheduled", descriptions: ["PTA meeting confirmed for Class 10", "Parent-teacher conference for Class 6-A"] },
  ];

  const selected = eventTypes[Math.floor(getSeededRandom().next() * eventTypes.length)];
  const description = selected.descriptions[Math.floor(getSeededRandom().next() * selected.descriptions.length)];

  return {
    id: `event-${Date.now()}`,
    type: selected.type,
    title: selected.title,
    description,
    timestamp: new Date(),
    severity: selected.type === "fee_payment" ? "success" : selected.type === "admission" ? "info" : "info",
    icon: selected.type,
  };
}
