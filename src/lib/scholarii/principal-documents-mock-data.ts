export interface SchoolDocument {
  id: string;
  name: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  lastUpdated: string;
  status: "draft" | "active" | "archived";
  department: string;
}

export interface StudentDocument {
  id: string;
  studentName: string;
  class: string;
  documentType: string;
  uploadDate: string;
  status: "complete" | "pending" | "missing";
}

export interface StaffDocument {
  id: string;
  staffName: string;
  department: string;
  documentType: string;
  uploadDate: string;
  status: "verified" | "pending" | "expired";
}

export interface ComplianceDocument {
  id: string;
  name: string;
  expiryDate: string;
  renewalStatus: "valid" | "expiring-soon" | "expired";
  issuedBy: string;
  lastVerified: string;
}

export interface SharedDocument {
  id: string;
  name: string;
  audience: string;
  sharedDate: string;
  viewsCount: number;
  sharedBy: string;
}

export interface DocAIInsight {
  id: string;
  text: string;
  type: "warning" | "success" | "info" | "danger";
  icon: string;
}

export interface DocAction {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
}

export const SCHOOL_DOCUMENTS: SchoolDocument[] = [
  { id: "sd1", name: "Student Code of Conduct 2026-27", category: "Policy", uploadedBy: "Principal Mehta", uploadDate: "2026-04-01", lastUpdated: "2026-06-10", status: "active", department: "Administration" },
  { id: "sd2", name: "Annual Academic Calendar 2026-27", category: "Academic", uploadedBy: "Vice Principal", uploadDate: "2026-03-15", lastUpdated: "2026-05-20", status: "active", department: "Academics" },
  { id: "sd3", name: "Sports Day Circular", category: "Circular", uploadedBy: "Sports Dept", uploadDate: "2026-06-01", lastUpdated: "2026-06-01", status: "active", department: "Sports" },
  { id: "sd4", name: "PTM Meeting Minutes - May", category: "Meeting", uploadedBy: "Principal Mehta", uploadDate: "2026-05-28", lastUpdated: "2026-05-28", status: "active", department: "Administration" },
  { id: "sd5", name: "Fee Structure 2026-27", category: "Finance", uploadedBy: "Accounts Dept", uploadDate: "2026-03-10", lastUpdated: "2026-06-05", status: "active", department: "Finance" },
  { id: "sd6", name: "Anti-Ragging Policy", category: "Policy", uploadedBy: "Principal Mehta", uploadDate: "2026-04-01", lastUpdated: "2026-04-01", status: "active", department: "Administration" },
  { id: "sd7", name: "Staff Handbook 2026-27", category: "Policy", uploadedBy: "HR Dept", uploadDate: "2026-03-20", lastUpdated: "2026-05-15", status: "active", department: "HR" },
  { id: "sd8", name: "Science Fair Guidelines", category: "Event", uploadedBy: "Science HOD", uploadDate: "2026-06-10", lastUpdated: "2026-06-10", status: "draft", department: "Academics" },
  { id: "sd9", name: "Old Library Policy", category: "Policy", uploadedBy: "Former Principal", uploadDate: "2024-01-15", lastUpdated: "2024-01-15", status: "archived", department: "Library" },
  { id: "sd10", name: "PTM Minutes - March", category: "Meeting", uploadedBy: "Principal Mehta", uploadDate: "2026-03-25", lastUpdated: "2026-03-25", status: "archived", department: "Administration" },
];

export const STUDENT_DOCUMENTS: StudentDocument[] = [
  { id: "std1", studentName: "Aarav Sharma", class: "9A", documentType: "Admission Form", uploadDate: "2026-04-01", status: "complete" },
  { id: "std2", studentName: "Priya Patel", class: "9A", documentType: "Transfer Certificate", uploadDate: "2026-04-05", status: "complete" },
  { id: "std3", studentName: "Rohan Gupta", class: "8B", documentType: "Medical Record", uploadDate: "2026-05-10", status: "pending" },
  { id: "std4", studentName: "Sneha Deshmukh", class: "10A", documentType: "Bonafide Certificate", uploadDate: "2026-06-01", status: "complete" },
  { id: "std5", studentName: "Karan Singh", class: "7B", documentType: "ID Card", uploadDate: "2026-04-15", status: "complete" },
  { id: "std6", studentName: "Ananya Joshi", class: "8A", documentType: "Admission Form", uploadDate: "2026-04-01", status: "missing" },
  { id: "std7", studentName: "Vivek Kumar", class: "9B", documentType: "Medical Record", uploadDate: "2026-05-20", status: "pending" },
  { id: "std8", studentName: "Meera Reddy", class: "7A", documentType: "Transfer Certificate", uploadDate: "2026-06-05", status: "complete" },
  { id: "std9", studentName: "Arjun Mehta", class: "10B", documentType: "Bonafide Certificate", uploadDate: "2026-06-10", status: "complete" },
  { id: "std10", studentName: "Nisha Verma", class: "6A", documentType: "ID Card", uploadDate: "2026-04-20", status: "missing" },
];

export const STAFF_DOCUMENTS: StaffDocument[] = [
  { id: "sf1", staffName: "Mrs. Kavita Sharma", department: "Mathematics", documentType: "Appointment Letter", uploadDate: "2024-06-01", status: "verified" },
  { id: "sf2", staffName: "Mr. Rajesh Kumar", department: "Science", documentType: "Experience Certificate", uploadDate: "2023-07-15", status: "verified" },
  { id: "sf3", staffName: "Mrs. Priya Verma", department: "English", documentType: "Qualification Certificate", uploadDate: "2025-01-10", status: "verified" },
  { id: "sf4", staffName: "Mr. Amit Deshmukh", department: "Hindi", documentType: "Contract", uploadDate: "2025-04-01", status: "pending" },
  { id: "sf5", staffName: "Mrs. Sunita Patil", department: "Social Studies", documentType: "ID Proof", uploadDate: "2024-08-20", status: "verified" },
  { id: "sf6", staffName: "Mr. Sunil Jadhav", department: "Administration", documentType: "Appointment Letter", uploadDate: "2023-03-01", status: "verified" },
  { id: "sf7", staffName: "Mrs. Rekha More", department: "Accounts", documentType: "Qualification Certificate", uploadDate: "2024-11-15", status: "expired" },
  { id: "sf8", staffName: "Mr. Ganesh Koli", department: "Transport", documentType: "License Copy", uploadDate: "2025-02-01", status: "pending" },
];

export const COMPLIANCE_DOCUMENTS: ComplianceDocument[] = [
  { id: "cd1", name: "Building Safety Certificate", expiryDate: "2026-08-15", renewalStatus: "valid", issuedBy: "Municipal Corporation", lastVerified: "2026-02-10" },
  { id: "cd2", name: "Fire Safety NOC", expiryDate: "2026-07-20", renewalStatus: "expiring-soon", issuedBy: "Fire Department", lastVerified: "2026-01-15" },
  { id: "cd3", name: "Affiliation Certificate (CBSE)", expiryDate: "2027-03-31", renewalStatus: "valid", issuedBy: "CBSE", lastVerified: "2026-03-01" },
  { id: "cd4", name: "Water Quality Test Report", expiryDate: "2026-07-01", renewalStatus: "expiring-soon", issuedBy: "Health Department", lastVerified: "2026-01-05" },
  { id: "cd5", name: "Environmental Clearance", expiryDate: "2027-06-30", renewalStatus: "valid", issuedBy: "Environment Ministry", lastVerified: "2026-04-20" },
  { id: "cd6", name: "Trade License", expiryDate: "2026-03-31", renewalStatus: "expired", issuedBy: "Municipal Corporation", lastVerified: "2025-12-15" },
  { id: "cd7", name: "Staff Police Verification", expiryDate: "2026-12-31", renewalStatus: "valid", issuedBy: "Police Department", lastVerified: "2026-05-10" },
  { id: "cd8", name: "First Aid Certification", expiryDate: "2026-09-15", renewalStatus: "valid", issuedBy: "Red Cross", lastVerified: "2026-03-20" },
];

export const SHARED_DOCUMENTS: SharedDocument[] = [
  { id: "sh1", name: "Annual Report 2025-26", audience: "Parents", sharedDate: "2026-06-01", viewsCount: 342, sharedBy: "Principal Mehta" },
  { id: "sh2", name: "Academic Calendar 2026-27", audience: "Parents, Teachers", sharedDate: "2026-03-15", viewsCount: 890, sharedBy: "Vice Principal" },
  { id: "sh3", name: "Fee Structure 2026-27", audience: "Parents", sharedDate: "2026-03-10", viewsCount: 567, sharedBy: "Accounts Dept" },
  { id: "sh4", name: "Sports Day Schedule", audience: "Students, Parents", sharedDate: "2026-06-05", viewsCount: 234, sharedBy: "Sports Dept" },
  { id: "sh5", name: "Exam Timetable - Unit 1", audience: "Students, Teachers", sharedDate: "2026-05-01", viewsCount: 1200, sharedBy: "Academics Dept" },
  { id: "sh6", name: "PTM Feedback Form", audience: "Parents", sharedDate: "2026-05-25", viewsCount: 189, sharedBy: "Principal Mehta" },
  { id: "sh7", name: "Staff Directory", audience: "Teachers", sharedDate: "2026-04-01", viewsCount: 456, sharedBy: "HR Dept" },
  { id: "sh8", name: "Student Handbook", audience: "Students", sharedDate: "2026-04-10", viewsCount: 678, sharedBy: "Vice Principal" },
];

export const DOC_AI_INSIGHTS: DocAIInsight[] = [
  { id: "dai1", text: "2 compliance documents are expiring within 30 days — Fire Safety NOC and Water Quality Test.", type: "danger", icon: "alert-triangle" },
  { id: "dai2", text: "12 student records are incomplete — missing admission forms or medical records.", type: "warning", icon: "alert-triangle" },
  { id: "dai3", text: "3 school policies were last updated over 12 months ago and may need review.", type: "warning", icon: "info" },
  { id: "dai4", text: "18 documents have not been accessed in 6 months — consider archiving.", type: "info", icon: "info" },
  { id: "dai5", text: "Staff contract for Mr. Amit Deshmukh is pending verification.", type: "warning", icon: "alert-triangle" },
  { id: "dai6", text: "Trade License has expired — immediate renewal required.", type: "danger", icon: "alert-triangle" },
];

export const DOC_ACTIONS: DocAction[] = [
  { id: "da1", text: "Renew Fire Safety NOC and Water Quality Test before expiry.", priority: "high" },
  { id: "da2", text: "Renew expired Trade License immediately.", priority: "high" },
  { id: "da3", text: "Follow up on 12 incomplete student records.", priority: "high" },
  { id: "da4", text: "Review and update 3 outdated school policies.", priority: "medium" },
  { id: "da5", text: "Archive 18 inactive documents to declutter workspace.", priority: "low" },
  { id: "da6", text: "Complete pending staff contract verification.", priority: "medium" },
];

export const DOC_CATEGORIES = ["Policy", "Academic", "Circular", "Meeting", "Finance", "Event", "Compliance", "Certificate"];
export const DOC_DEPARTMENTS = ["Administration", "Academics", "Finance", "HR", "Sports", "Library", "Science", "Transport"];
export const DOC_CLASSES = ["6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"];
