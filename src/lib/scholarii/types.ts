export type Role = "principal" | "teacher" | "student" | "admin";

export interface User {
  email: string;
  name: string;
  role: Role;
  avatarColor: string;
}

export interface Student {
  id: string;
  name: string;
  roll: string;
  grade: number;
  section: string;
  attendance: number;
  feeStatus: "Paid" | "Pending" | "Overdue";
  parent: string;
  parentPhone: string;
  gender: "M" | "F";
  avatarColor: string;
  testScores?: Record<string, number>; // subject -> percentage
  isChronicAbsentee?: boolean;
  parentEngagementScore?: number; // 0-100
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  email: string;
  phone: string;
  rating: number;
  status: "Active" | "On Leave" | "Late";
  avatarColor: string;
  department?: string;
  classesPerDay?: number;
  pendingTasks?: number;
  isOverloaded?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: "All" | "Students" | "Teachers" | "Parents";
  priority: "Normal" | "Important" | "Urgent";
  date: string;
  reads: number;
  recipients: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  submitted: number;
  total: number;
  graded: number;
}

// Dashboard KPI & Analytics Types
export interface KPICard {
  id: string;
  title: string;
  value: string;
  percentage: number;
  percentageLabel: string;
  trend: { direction: "up" | "down" | "stable"; isPositive: boolean; percentage: number };
  status: "healthy" | "moderate" | "attention";
  sparklineData: Array<{ x: number; y: number }>;
  icon: string;
}

export interface SchoolPulseSector {
  name: string;
  status: "healthy" | "moderate" | "attention";
  value?: string;
  description?: string;
}

export interface ActivityEvent {
  id: string;
  type: "fee_payment" | "admission" | "attendance" | "leave" | "announcement" | "homework" | "exam" | "ptm";
  title: string;
  description: string;
  timestamp: Date;
  severity: "info" | "success" | "warning" | "critical";
  icon: string;
  relatedId?: string;
}

export interface OperationalSummary {
  text: string;
  keyIssues: string[];
  timestamp: Date;
}

export interface AdmissionFunnel {
  inquiries: number;
  applications: number;
  shortlisted: number;
  admitted: number;
  conversions: {
    inquiryToApp: number; // percentage
    appToShortlist: number;
    shortlistToAdmit: number;
  };
}

export interface FeeMetrics {
  collected: number;
  target: number;
  pending: number;
  defaulters: number;
  percentOfTarget: number;
  trend: Array<{ month: string; collected: number }>;
}

// ============================================================================
// AI Intelligence & Alert Types
// ============================================================================

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  context: { type: string; value: number | string };
  icon: string; // lucide-react icon name
  action?: { label: string; target: string }; // drilldown target (KPI id, etc)
}

export interface Recommendation {
  id: string;
  priority: 1 | 2 | 3; // 1 = highest priority
  title: string;
  description: string;
  actionLabel: string; // e.g., "Send Reminders", "Review Class"
  actionTarget?: string; // navigation target
  reason: string; // explains why this matters
}

export interface RiskMetrics {
  atRiskStudents: number;
  chronicAbsentees: number;
  feeDefaulters: number;
  overloadedTeachers: number;
}

export interface Notification {
  id: string;
  type: "communication" | "academic" | "operational" | "compliance";
  title: string;
  count?: number;
  timestamp: Date;
  expires?: Date;
  priority: "low" | "medium" | "high";
  action?: { label: string; target: string };
}
