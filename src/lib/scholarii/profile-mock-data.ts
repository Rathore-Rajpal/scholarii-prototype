export type ProfileTab = "personal" | "academic" | "settings";

export interface StudentProfile {
  fullName: string;
  firstName: string;
  role: string;
  studentId: string;
  class: string;
  section: string;
  profilePicture: string | null;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  email: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  admissionNumber: string;
  rollNumber: string;
  academicYear: string;
  board: string;
  schoolName: string;
  house: string;
}

export interface AcademicSnapshot {
  attendance: number;
  overallPercentage: number;
  assignmentsCompleted: number;
  upcomingExams: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  examReminders: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  language: string;
}

export const STUDENT_PROFILE: StudentProfile = {
  fullName: "Aarav Sharma",
  firstName: "Aarav",
  role: "Student",
  studentId: "STU-2026-0451",
  class: "Class 9",
  section: "Section A",
  profilePicture: null,
  dateOfBirth: "2012-03-15",
  gender: "Male",
  mobileNumber: "+91 98765 43210",
  email: "aarav.sharma@scholarii.edu",
  address: "42, Green Valley Apartments, MG Road, Bangalore, Karnataka - 560001",
  emergencyContact: "+91 98765 43211 (Mr. Vikram Sharma - Father)",
  bloodGroup: "B+",
  admissionNumber: "ADM-2024-0089",
  rollNumber: "12",
  academicYear: "2026-2027",
  board: "CBSE",
  schoolName: "Scholarii International School",
  house: "Everest House",
};

export const ACADEMIC_SNAPSHOT: AcademicSnapshot = {
  attendance: 92,
  overallPercentage: 82,
  assignmentsCompleted: 18,
  upcomingExams: 2,
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  assignmentReminders: true,
  examReminders: true,
};

export const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorEnabled: false,
  lastPasswordChange: "2026-04-10",
  activeSessions: 2,
};

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "system",
  language: "English",
};
