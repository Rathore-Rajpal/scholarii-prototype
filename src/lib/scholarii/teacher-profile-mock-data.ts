export type TeacherProfileTab = "personal" | "professional" | "settings";

export interface TeacherProfile {
  fullName: string;
  firstName: string;
  role: string;
  employeeId: string;
  designation: string;
  department: string;
  subjects: string[];
  isClassTeacher: boolean;
  classTeacherOf?: string;
  joiningDate: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  assignedClasses: string[];
  yearsOfExperience: number;
  qualification: string;
}

export const TEACHER_PROFILE: TeacherProfile = {
  fullName: "Mr. Rajesh Kumar",
  firstName: "Rajesh",
  role: "Teacher",
  employeeId: "EMP-2023-0042",
  designation: "Senior Teacher",
  department: "Mathematics",
  subjects: ["Mathematics", "Physics"],
  isClassTeacher: true,
  classTeacherOf: "Class 8-A",
  joiningDate: "2023-06-15",
  email: "rajesh.kumar@scholarii.edu",
  phone: "+91 98765 43210",
  gender: "Male",
  dateOfBirth: "1990-05-15",
  address: "123 School Road, Bangalore, Karnataka 560001",
  emergencyContact: "+91 98765 43211",
  bloodGroup: "O+",
  assignedClasses: ["Class 8-A", "Class 8-B", "Class 9-A"],
  yearsOfExperience: 8,
  qualification: "M.Sc. Mathematics, B.Ed.",
};

export const DEFAULT_TEACHER_NOTIFICATIONS = {
  emailNotifications: true,
  pushNotifications: true,
  assignmentReminders: true,
  examReminders: true,
  parentMessages: true,
};

export const DEFAULT_TEACHER_SECURITY = {
  lastPasswordChange: "2026-04-10",
  activeSessions: 2,
};

export const DEFAULT_TEACHER_APPEARANCE = {
  theme: "system" as "light" | "dark" | "system",
  language: "English",
};
