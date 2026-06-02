import type { Student, Teacher, Alert, Recommendation, RiskMetrics } from "./types";

/**
 * Intelligence Engine: Rule-based alert, recommendation, and risk metric generators
 * All functions are pure (no side effects) and fully testable
 */

// ============================================================================
// ALERT GENERATORS
// ============================================================================

export function generateAttendanceAlerts(students: Student[]): Alert[] {
  const alerts: Alert[] = [];

  if (students.length === 0) return alerts;

  // Calculate school average attendance
  const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;

  // School average below 85%
  if (avgAttendance < 85) {
    alerts.push({
      id: "attendance-school-low",
      severity: "critical",
      title: "School attendance below threshold",
      description: `Average attendance is ${avgAttendance.toFixed(1)}%. Target is 85%.`,
      context: { type: "attendance", value: avgAttendance },
      icon: "AlertCircle",
      action: { label: "View Details", target: "attendance-kpi" },
    });
  }

  // Class-wise analysis
  const classByKey: Record<string, number[]> = {};
  students.forEach((s) => {
    const key = `${s.grade}-${s.section}`;
    if (!classByKey[key]) classByKey[key] = [];
    classByKey[key].push(s.attendance);
  });

  Object.entries(classByKey).forEach(([classKey, attendances]) => {
    const classAvg = attendances.reduce((a, b) => a + b, 0) / attendances.length;
    if (classAvg < 75) {
      alerts.push({
        id: `attendance-class-${classKey}`,
        severity: "warning",
        title: `Class ${classKey} attendance critical`,
        description: `${classKey} has ${classAvg.toFixed(1)}% attendance. Below 75% target.`,
        context: { type: "attendance", value: classKey },
        icon: "AlertTriangle",
        action: { label: "View Class", target: "attendance-kpi" },
      });
    }
  });

  // Chronic absentees
  const chronicCount = students.filter((s) => s.isChronicAbsentee).length;
  const chronicPercent = (chronicCount / students.length) * 100;
  if (chronicPercent > 15) {
    alerts.push({
      id: "attendance-chronic",
      severity: "warning",
      title: "High chronic absenteeism",
      description: `${chronicCount} students (${chronicPercent.toFixed(1)}%) are chronic absentees.`,
      context: { type: "attendance", value: chronicCount },
      icon: "AlertTriangle",
      action: { label: "View Details", target: "attendance-kpi" },
    });
  }

  return alerts;
}

export function generateFeeAlerts(students: Student[], feeTarget: number): Alert[] {
  const alerts: Alert[] = [];

  if (students.length === 0) return alerts;

  // Count fee statuses
  const overdue = students.filter((s) => s.feeStatus === "Overdue").length;
  const pending = students.filter((s) => s.feeStatus === "Pending").length;
  const paid = students.filter((s) => s.feeStatus === "Paid").length;

  const overduePercent = (overdue / students.length) * 100;
  const paidPercent = (paid / students.length) * 100;

  // Critical: Too many overdue
  if (overduePercent > 20) {
    alerts.push({
      id: "fees-overdue-high",
      severity: "critical",
      title: "Fee collection at critical risk",
      description: `${overdue} students (${overduePercent.toFixed(1)}%) have overdue fees.`,
      context: { type: "fees", value: overdue },
      icon: "AlertCircle",
      action: { label: "View Details", target: "fee-collection-kpi" },
    });
  }

  // Warning: Growing defaults
  if (overdue > 10) {
    alerts.push({
      id: "fees-defaults-growing",
      severity: "warning",
      title: "Growing fee defaults",
      description: `${overdue} students have outstanding fees. Follow-up required.`,
      context: { type: "fees", value: overdue },
      icon: "AlertTriangle",
      action: { label: "View Defaulters", target: "fee-collection-kpi" },
    });
  }

  // Warning: Collection below forecast
  const averageFeePerStudent = feeTarget / students.length;
  const collectedAmount = paid * averageFeePerStudent;
  const collectionPercent = (collectedAmount / feeTarget) * 100;

  if (collectionPercent < 70) {
    alerts.push({
      id: "fees-collection-low",
      severity: "warning",
      title: "Fee collection behind target",
      description: `Current collection is ${collectionPercent.toFixed(1)}% of monthly target. May miss deadline.`,
      context: { type: "fees", value: collectionPercent },
      icon: "AlertTriangle",
      action: { label: "View Trends", target: "fee-collection-kpi" },
    });
  }

  return alerts;
}

export function generateAcademicAlerts(students: Student[]): Alert[] {
  const alerts: Alert[] = [];

  if (students.length === 0) return alerts;

  // Analyze test scores by subject
  const subjectScores: Record<string, number[]> = {};
  students.forEach((s) => {
    if (s.testScores) {
      Object.entries(s.testScores).forEach(([subject, score]) => {
        if (!subjectScores[subject]) subjectScores[subject] = [];
        subjectScores[subject].push(score);
      });
    }
  });

  // Check for weak subjects
  let weakSubjectCount = 0;
  Object.entries(subjectScores).forEach(([subject, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg < 60) {
      weakSubjectCount++;
      alerts.push({
        id: `academic-weak-${subject}`,
        severity: "warning",
        title: `${subject} performance declining`,
        description: `Average score is ${avg.toFixed(1)}%. Below 60% target.`,
        context: { type: "academics", value: subject },
        icon: "AlertTriangle",
        action: { label: "View Analytics", target: "academic-performance-kpi" },
      });
    }
  });

  // Check for failing students
  let failingCount = 0;
  students.forEach((s) => {
    if (s.testScores) {
      const failedSubjects = Object.values(s.testScores).filter((score) => score < 50).length;
      if (failedSubjects > 0) failingCount++;
    }
  });

  const failingPercent = (failingCount / students.length) * 100;
  if (failingPercent > 10) {
    alerts.push({
      id: "academic-failing-high",
      severity: "critical",
      title: "Academic performance critical",
      description: `${failingCount} students (${failingPercent.toFixed(1)}%) are failing multiple subjects.`,
      context: { type: "academics", value: failingCount },
      icon: "AlertCircle",
      action: { label: "View Performance", target: "academic-performance-kpi" },
    });
  }

  return alerts;
}

export function generateEngagementAlerts(students: Student[]): Alert[] {
  const alerts: Alert[] = [];

  if (students.length === 0) return alerts;

  // Parent engagement analysis
  const engagementScores = students
    .filter((s) => s.parentEngagementScore !== undefined)
    .map((s) => s.parentEngagementScore!);

  if (engagementScores.length === 0) return alerts;

  const avgEngagement = engagementScores.reduce((a, b) => a + b, 0) / engagementScores.length;

  if (avgEngagement < 50) {
    alerts.push({
      id: "engagement-low",
      severity: "warning",
      title: "Parent engagement declining",
      description: `Average parent engagement score is ${avgEngagement.toFixed(1)}. Below 50 target.`,
      context: { type: "engagement", value: avgEngagement },
      icon: "AlertTriangle",
      action: { label: "View Details", target: "parent-engagement-kpi" },
    });
  }

  // Low engagement students
  const lowEngagementCount = engagementScores.filter((score) => score < 40).length;
  const lowEngagementPercent = (lowEngagementCount / students.length) * 100;

  if (lowEngagementPercent > 20) {
    alerts.push({
      id: "engagement-families-inactive",
      severity: "info",
      title: "Many families not engaged",
      description: `${lowEngagementCount} families show low engagement. Consider outreach.`,
      context: { type: "engagement", value: lowEngagementCount },
      icon: "Info",
      action: { label: "View Families", target: "parent-engagement-kpi" },
    });
  }

  return alerts;
}

export function generateWorkloadAlerts(teachers: Teacher[]): Alert[] {
  const alerts: Alert[] = [];

  if (teachers.length === 0) return alerts;

  // Overloaded teachers
  const overloadedTeachers = teachers.filter((t) => t.isOverloaded).length;
  const overloadedPercent = (overloadedTeachers / teachers.length) * 100;

  if (overloadedPercent > 20) {
    alerts.push({
      id: "workload-overload-high",
      severity: "warning",
      title: "Teacher workload imbalance detected",
      description: `${overloadedTeachers} teachers (${overloadedPercent.toFixed(1)}%) are overloaded.`,
      context: { type: "workload", value: overloadedTeachers },
      icon: "AlertTriangle",
      action: { label: "View Workload", target: "workload-kpi" },
    });
  }

  // Extreme cases (> 10 classes/day)
  const extremeWorkload = teachers.filter((t) => (t.classesPerDay || 0) > 10).length;
  if (extremeWorkload > 0) {
    alerts.push({
      id: "workload-extreme",
      severity: "critical",
      title: "Unsustainable teacher workload",
      description: `${extremeWorkload} teacher(s) have more than 10 classes per day.`,
      context: { type: "workload", value: extremeWorkload },
      icon: "AlertCircle",
      action: { label: "View Distribution", target: "workload-kpi" },
    });
  }

  // High pending tasks
  const heavyTaskLoad = teachers.filter((t) => (t.pendingTasks || 0) > 8).length;
  if (heavyTaskLoad > 0) {
    alerts.push({
      id: "workload-tasks-backlog",
      severity: "warning",
      title: "High task backlog in staff",
      description: `${heavyTaskLoad} teacher(s) have significant pending task backlogs.`,
      context: { type: "workload", value: heavyTaskLoad },
      icon: "AlertTriangle",
      action: { label: "View Tasks", target: "workload-kpi" },
    });
  }

  return alerts;
}

// ============================================================================
// RECOMMENDATION GENERATOR
// ============================================================================

export function generateRecommendations(
  students: Student[],
  teachers: Teacher[],
  feeTarget: number,
  alerts: Alert[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const usedAlerts = new Set<string>();

  if (students.length === 0 || teachers.length === 0) return recommendations;

  // Recommendation 1: Fee reminders
  const overdue = students.filter((s) => s.feeStatus === "Overdue");
  if (overdue.length > 0 && !usedAlerts.has("fees-overdue-high")) {
    recommendations.push({
      id: "rec-fee-reminders",
      priority: 1,
      title: "Send fee payment reminders",
      description: `Contact ${overdue.length} families with overdue fees to collect outstanding payments.`,
      actionLabel: "Send Reminders",
      actionTarget: "fee-collection-kpi",
      reason: "Overdue collections impact school cash flow and operations.",
    });
    usedAlerts.add("fees-overdue-high");
  }

  // Recommendation 2: Attendance follow-up
  const chronicAbsentees = students.filter((s) => s.isChronicAbsentee);
  if (chronicAbsentees.length > 0 && !usedAlerts.has("attendance-chronic")) {
    recommendations.push({
      id: "rec-attendance-followup",
      priority: 1,
      title: "Conduct attendance follow-up",
      description: `Schedule parent meetings for ${chronicAbsentees.length} chronic absentees to understand barriers.`,
      actionLabel: "Schedule Meetings",
      actionTarget: "attendance-kpi",
      reason: "Early intervention can prevent long-term attendance issues and academic decline.",
    });
    usedAlerts.add("attendance-chronic");
  }

  // Recommendation 3: Academic support
  let failingStudents = 0;
  students.forEach((s) => {
    if (s.testScores) {
      const failedSubjects = Object.values(s.testScores).filter((score) => score < 50).length;
      if (failedSubjects > 0) failingStudents++;
    }
  });

  if (failingStudents > 0 && !usedAlerts.has("academic-failing-high")) {
    recommendations.push({
      id: "rec-academic-support",
      priority: 2,
      title: "Schedule academic support sessions",
      description: `Organize tutoring or remedial classes for ${failingStudents} struggling students.`,
      actionLabel: "Plan Sessions",
      actionTarget: "academic-performance-kpi",
      reason: "Targeted support can improve performance before exam season.",
    });
    usedAlerts.add("academic-failing-high");
  }

  // Recommendation 4: Engagement outreach
  const lowEngagement = students.filter((s) => (s.parentEngagementScore || 0) < 40);
  if (lowEngagement.length > 0 && !usedAlerts.has("engagement-families-inactive")) {
    recommendations.push({
      id: "rec-engagement-outreach",
      priority: 2,
      title: "Launch parent engagement campaign",
      description: `Conduct outreach to ${lowEngagement.length} families to increase involvement in school activities.`,
      actionLabel: "Launch Campaign",
      actionTarget: "parent-engagement-kpi",
      reason: "Engaged parents are more likely to support student learning and school initiatives.",
    });
    usedAlerts.add("engagement-families-inactive");
  }

  // Recommendation 5: Workload redistribution
  const overloadedCount = teachers.filter((t) => t.isOverloaded).length;
  if (overloadedCount > 0 && !usedAlerts.has("workload-overload-high")) {
    recommendations.push({
      id: "rec-workload-balance",
      priority: 1,
      title: "Redistribute teacher workload",
      description: `Review and rebalance class assignments to reduce burden on ${overloadedCount} teachers.`,
      actionLabel: "Review Distribution",
      actionTarget: "workload-kpi",
      reason: "Overworked teachers face burnout and may reduce effectiveness.",
    });
    usedAlerts.add("workload-overload-high");
  }

  // Recommendation 6: Class-specific review
  const classByKey: Record<string, number[]> = {};
  students.forEach((s) => {
    const key = `${s.grade}-${s.section}`;
    if (!classByKey[key]) classByKey[key] = [];
    classByKey[key].push(s.attendance);
  });

  const lowestAttendanceClass = Object.entries(classByKey).reduce((prev, [classKey, attendances]) => {
    const avg = attendances.reduce((a, b) => a + b, 0) / attendances.length;
    return avg < (prev.avg || 100) ? { classKey, avg } : prev;
  }, { classKey: "", avg: 100 });

  if (lowestAttendanceClass.avg < 75 && !usedAlerts.has(`attendance-class-${lowestAttendanceClass.classKey}`)) {
    recommendations.push({
      id: "rec-class-review",
      priority: 2,
      title: `Review Class ${lowestAttendanceClass.classKey} attendance`,
      description: `Investigate factors affecting attendance in ${lowestAttendanceClass.classKey} (${lowestAttendanceClass.avg.toFixed(1)}%).`,
      actionLabel: "Review Class",
      actionTarget: "attendance-kpi",
      reason: "Class-specific issues need targeted solutions.",
    });
  }

  // Sort by priority and return top 3
  return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 3);
}

// ============================================================================
// RISK METRICS CALCULATOR
// ============================================================================

export function calculateRiskMetrics(students: Student[], teachers: Teacher[]): RiskMetrics {
  if (students.length === 0 || teachers.length === 0) {
    return {
      atRiskStudents: 0,
      chronicAbsentees: 0,
      feeDefaulters: 0,
      overloadedTeachers: 0,
    };
  }

  // At-risk students: chronic absentee OR low engagement OR failing subjects
  const atRiskStudents = students.filter((s) => {
    const isChronicAbsentee = s.isChronicAbsentee || false;
    const lowEngagement = (s.parentEngagementScore || 0) < 45;
    const hasFailingSubjects =
      s.testScores && Object.values(s.testScores).some((score) => score < 50);
    return isChronicAbsentee || lowEngagement || hasFailingSubjects;
  }).length;

  // Chronic absentees
  const chronicAbsentees = students.filter((s) => s.isChronicAbsentee).length;

  // Fee defaulters
  const feeDefaulters = students.filter((s) => s.feeStatus === "Overdue").length;

  // Overloaded teachers
  const overloadedTeachers = teachers.filter((t) => t.isOverloaded).length;

  return {
    atRiskStudents,
    chronicAbsentees,
    feeDefaulters,
    overloadedTeachers,
  };
}

// ============================================================================
// HELPER: Is At-Risk Determination
// ============================================================================

export function isAtRiskStudent(student: Student): boolean {
  const isChronicAbsentee = student.isChronicAbsentee || false;
  const lowEngagement = (student.parentEngagementScore || 0) < 45;
  const hasFailingSubjects = !!(
    student.testScores && Object.values(student.testScores).some((score) => score < 50)
  );
  return isChronicAbsentee || lowEngagement || hasFailingSubjects;
}
