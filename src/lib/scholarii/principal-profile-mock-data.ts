export type PrincipalProfileTab = "personal" | "professional" | "school" | "settings";

export interface PrincipalProfile {
  fullName: string;
  firstName: string;
  role: string;
  employeeId: string;
  designation: string;
  department: string;
  joiningDate: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  yearsOfExperience: number;
  qualification: string;
  previousSchool: string;
  responsibilities: string[];
  reportsTo: string;
  directReports: string[];
}

export const PRINCIPAL_PROFILE: PrincipalProfile = {
  fullName: "Dr. Ananya Mehta",
  firstName: "Ananya",
  role: "Principal",
  employeeId: "EMP-2020-0001",
  designation: "Principal",
  department: "Administration",
  joiningDate: "2020-04-01",
  email: "ananya.mehta@scholarii.edu",
  phone: "+91 98765 43200",
  gender: "Female",
  dateOfBirth: "1978-09-12",
  address: "45 Residency Road, Bangalore, Karnataka 560025",
  emergencyContact: "+91 98765 43201",
  bloodGroup: "A+",
  yearsOfExperience: 22,
  qualification: "Ph.D. Education, M.Ed., B.Ed.",
  previousSchool: "Delhi Public School, Bangalore",
  responsibilities: [
    "Overall school administration and leadership",
    "Academic curriculum oversight and quality assurance",
    "Staff recruitment, evaluation, and development",
    "Parent and community engagement",
    "Regulatory compliance and accreditation",
    "Budget planning and financial oversight",
  ],
  reportsTo: "School Management Board",
  directReports: [
    "Vice Principal",
    "Head of Academics",
    "Head of Administration",
    "Examination Controller",
    "Student Welfare Officer",
  ],
};

export const PRINCIPAL_SCHOOL_STATS = {
  totalStudents: 1320,
  totalStaff: 68,
  totalTeachers: 48,
  classesCount: 42,
  sectionsCount: 21,
  attendanceRate: 94,
  academicScore: 84,
  complianceScore: 92,
  parentEngagement: 78,
};

export const DEFAULT_PRINCIPAL_NOTIFICATIONS = {
  emailNotifications: true,
  pushNotifications: true,
  staffAlerts: true,
  complianceAlerts: true,
  parentMessages: true,
  examNotifications: true,
  feeNotifications: true,
};

export const DEFAULT_PRINCIPAL_SECURITY = {
  lastPasswordChange: "2026-03-15",
  twoFactorEnabled: true,
  activeSessions: 2,
};

export const DEFAULT_PRINCIPAL_APPEARANCE = {
  theme: "light" as "light" | "dark" | "system",
  language: "English",
};
