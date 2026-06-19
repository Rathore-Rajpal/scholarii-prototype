// ============================================================
// TEACHER DOCUMENTS MOCK DATA
// ============================================================

export interface StudentDocument {
  id: string;
  name: string;
  uploadedDate: string;
  verifiedBy: string | null;
  status: "verified" | "pending" | "missing";
}

export interface StudentDocEntry {
  id: string;
  name: string;
  roll: number;
  className: string;
  gender: "Male" | "Female";
  verificationPct: number;
  pendingCount: number;
  requiredDocs: StudentDocument[];
  additionalDocs: StudentDocument[];
  verificationHistory: { date: string; action: string }[];
}

export interface ClassDocument {
  id: string;
  name: string;
  type: "notice" | "timetable" | "circular" | "guidelines" | "material";
  uploadedBy: string;
  uploadedDate: string;
  size: string;
}

export interface QuestionPaper {
  id: string;
  name: string;
  subject: string;
  className: string;
  examType: "Unit Test" | "Mid Term" | "Final Exam" | "Practice" | "Previous Year";
  createdDate: string;
  size: string;
}

export interface SchoolDocument {
  id: string;
  name: string;
  category: string;
  uploadedDate: string;
  size: string;
}

export interface PersonalDocument {
  id: string;
  name: string;
  category: string;
  uploadedDate: string;
  size: string;
  confidential: boolean;
}

export const STUDENT_DOCS: StudentDocEntry[] = [
  {
    id: "s1", name: "Aarav Sharma", roll: 1, className: "8-A", gender: "Male", verificationPct: 100, pendingCount: 0,
    requiredDocs: [
      { id: "d1", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d2", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d3", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d4", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d5", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [
      { id: "d6", name: "Competition Certificates", uploadedDate: "15 Mar 2026", verifiedBy: null, status: "verified" },
    ],
    verificationHistory: [
      { date: "05 Jan 2026", action: "Aadhaar Card verified" },
      { date: "05 Jan 2026", action: "Birth Certificate verified" },
      { date: "05 Jan 2026", action: "Transfer Certificate verified" },
      { date: "05 Jan 2026", action: "Report Card verified" },
      { date: "05 Jan 2026", action: "Passport Photograph verified" },
    ],
  },
  {
    id: "s2", name: "Priya Patel", roll: 2, className: "8-A", gender: "Female", verificationPct: 80, pendingCount: 1,
    requiredDocs: [
      { id: "d7", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d8", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d9", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d10", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d11", name: "Passport Photograph", uploadedDate: "12 Jan 2026", verifiedBy: null, status: "pending" },
    ],
    additionalDocs: [],
    verificationHistory: [
      { date: "05 Jan 2026", action: "Aadhaar Card verified" },
      { date: "05 Jan 2026", action: "Birth Certificate verified" },
      { date: "10 Jan 2026", action: "Passport Photograph uploaded" },
      { date: "10 Jan 2026", action: "Report Card requested again" },
    ],
  },
  {
    id: "s3", name: "Rohan Gupta", roll: 3, className: "8-A", gender: "Male", verificationPct: 60, pendingCount: 2,
    requiredDocs: [
      { id: "d12", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d13", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: null, status: "pending" },
      { id: "d14", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d15", name: "Previous Year Report Card", uploadedDate: "", verifiedBy: null, status: "missing" },
      { id: "d16", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [],
    verificationHistory: [
      { date: "05 Jan 2026", action: "Aadhaar Card verified" },
      { date: "08 Jan 2026", action: "Birth Certificate uploaded — pending review" },
      { date: "10 Jan 2026", action: "Report Card requested from parents" },
    ],
  },
  {
    id: "s4", name: "Sneha Reddy", roll: 4, className: "8-A", gender: "Female", verificationPct: 100, pendingCount: 0,
    requiredDocs: [
      { id: "d17", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d18", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d19", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d20", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d21", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [
      { id: "d22", name: "Sports Certificates", uploadedDate: "20 Feb 2026", verifiedBy: null, status: "verified" },
    ],
    verificationHistory: [
      { date: "05 Jan 2026", action: "All required documents verified" },
      { date: "20 Feb 2026", action: "Sports Certificates uploaded" },
    ],
  },
  {
    id: "s5", name: "Vikram Singh", roll: 5, className: "8-A", gender: "Male", verificationPct: 80, pendingCount: 1,
    requiredDocs: [
      { id: "d23", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d24", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d25", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: null, status: "pending" },
      { id: "d26", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d27", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [],
    verificationHistory: [
      { date: "05 Jan 2026", action: "Aadhaar Card verified" },
      { date: "05 Jan 2026", action: "Birth Certificate verified" },
      { date: "15 Jan 2026", action: "Transfer Certificate uploaded — pending review" },
    ],
  },
  {
    id: "s6", name: "Ananya Nair", roll: 6, className: "8-A", gender: "Female", verificationPct: 100, pendingCount: 0,
    requiredDocs: [
      { id: "d28", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d29", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d30", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d31", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d32", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [
      { id: "d33", name: "Olympiad Certificates", uploadedDate: "10 Mar 2026", verifiedBy: null, status: "verified" },
    ],
    verificationHistory: [
      { date: "05 Jan 2026", action: "All required documents verified" },
    ],
  },
  {
    id: "s7", name: "Karthik Menon", roll: 7, className: "8-A", gender: "Male", verificationPct: 80, pendingCount: 1,
    requiredDocs: [
      { id: "d34", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d35", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d36", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d37", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: null, status: "pending" },
      { id: "d38", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [],
    verificationHistory: [
      { date: "05 Jan 2026", action: "Aadhaar Card verified" },
      { date: "12 Jan 2026", action: "Report Card uploaded — pending review" },
    ],
  },
  {
    id: "s8", name: "Divya Joshi", roll: 8, className: "8-A", gender: "Female", verificationPct: 60, pendingCount: 2,
    requiredDocs: [
      { id: "d39", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d40", name: "Birth Certificate", uploadedDate: "", verifiedBy: null, status: "missing" },
      { id: "d41", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d42", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: null, status: "pending" },
      { id: "d43", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [],
    verificationHistory: [
      { date: "05 Jan 2026", action: "Aadhaar Card verified" },
      { date: "08 Jan 2026", action: "Birth Certificate missing — notified parents" },
      { date: "15 Jan 2026", action: "Report Card uploaded — pending review" },
    ],
  },
  {
    id: "s9", name: "Arjun Das", roll: 9, className: "8-A", gender: "Male", verificationPct: 100, pendingCount: 0,
    requiredDocs: [
      { id: "d44", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d45", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d46", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d47", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d48", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [],
    verificationHistory: [
      { date: "05 Jan 2026", action: "All required documents verified" },
    ],
  },
  {
    id: "s10", name: "Neha Kapoor", roll: 10, className: "8-A", gender: "Female", verificationPct: 100, pendingCount: 0,
    requiredDocs: [
      { id: "d49", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d50", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d51", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d52", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d53", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [
      { id: "d54", name: "Medical Certificate", uploadedDate: "10 Feb 2026", verifiedBy: null, status: "verified" },
    ],
    verificationHistory: [
      { date: "05 Jan 2026", action: "All required documents verified" },
    ],
  },
  {
    id: "s11", name: "Rahul Verma", roll: 11, className: "8-A", gender: "Male", verificationPct: 80, pendingCount: 1,
    requiredDocs: [
      { id: "d55", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d56", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d57", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d58", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d59", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: null, status: "pending" },
    ],
    additionalDocs: [],
    verificationHistory: [
      { date: "05 Jan 2026", action: "Aadhaar Card verified" },
      { date: "15 Jan 2026", action: "Passport Photograph uploaded — pending review" },
    ],
  },
  {
    id: "s12", name: "Simran Kaur", roll: 12, className: "8-A", gender: "Female", verificationPct: 80, pendingCount: 1,
    requiredDocs: [
      { id: "d60", name: "Aadhaar Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d61", name: "Birth Certificate", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d62", name: "Transfer Certificate", uploadedDate: "05 Jan 2026", verifiedBy: null, status: "pending" },
      { id: "d63", name: "Previous Year Report Card", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
      { id: "d64", name: "Passport Photograph", uploadedDate: "05 Jan 2026", verifiedBy: "Mr. Kumar", status: "verified" },
    ],
    additionalDocs: [],
    verificationHistory: [
      { date: "05 Jan 2026", action: "Aadhaar Card verified" },
      { date: "12 Jan 2026", action: "Transfer Certificate uploaded — pending review" },
    ],
  },
];

export const CLASS_DOCUMENTS: ClassDocument[] = [
  { id: "cd1", name: "Class 8-A Timetable — Term 2", type: "timetable", uploadedBy: "Mr. Kumar", uploadedDate: "01 Jun 2026", size: "124 KB" },
  { id: "cd2", name: "PTM Notice — June 2026", type: "notice", uploadedBy: "Mr. Kumar", uploadedDate: "10 Jun 2026", size: "89 KB" },
  { id: "cd3", name: "Holiday Circular — Summer Break", type: "circular", uploadedBy: "Admin", uploadedDate: "15 Jun 2026", size: "156 KB" },
  { id: "cd4", name: "Mathematics Project Guidelines", type: "guidelines", uploadedBy: "Mr. Kumar", uploadedDate: "05 Jun 2026", size: "234 KB" },
  { id: "cd5", name: "Quadratic Equations — Study Material", type: "material", uploadedBy: "Mr. Kumar", uploadedDate: "08 Jun 2026", size: "1.2 MB" },
  { id: "cd6", name: "Class Rules & Code of Conduct", type: "notice", uploadedBy: "Mr. Kumar", uploadedDate: "01 Jun 2026", size: "67 KB" },
  { id: "cd7", name: "Science Fair Project Brief", type: "guidelines", uploadedBy: "Mr. Kumar", uploadedDate: "12 Jun 2026", size: "178 KB" },
];

export const QUESTION_PAPERS: QuestionPaper[] = [
  { id: "qp1", name: "Mathematics Unit Test — June", subject: "Mathematics", className: "8-A", examType: "Unit Test", createdDate: "10 Jun 2026", size: "345 KB" },
  { id: "qp2", name: "Mathematics Mid Term — May", subject: "Mathematics", className: "8-A", examType: "Mid Term", createdDate: "15 May 2026", size: "412 KB" },
  { id: "qp3", name: "Mathematics Practice Set — Algebra", subject: "Mathematics", className: "8-A", examType: "Practice", createdDate: "05 Jun 2026", size: "289 KB" },
  { id: "qp4", name: "Mathematics Previous Year — 2025", subject: "Mathematics", className: "8-A", examType: "Previous Year", createdDate: "01 Jun 2026", size: "523 KB" },
  { id: "qp5", name: "Computer Science Unit Test — June", subject: "Computer Science", className: "10-A", examType: "Unit Test", createdDate: "12 Jun 2026", size: "278 KB" },
  { id: "qp6", name: "Mathematics Final Exam — April", subject: "Mathematics", className: "8-A", examType: "Final Exam", createdDate: "28 Apr 2026", size: "612 KB" },
  { id: "qp7", name: "Mathematics Practice Set — Geometry", subject: "Mathematics", className: "8-A", examType: "Practice", createdDate: "08 Jun 2026", size: "312 KB" },
  { id: "qp8", name: "Mathematics Previous Year — 2024", subject: "Mathematics", className: "8-A", examType: "Previous Year", createdDate: "01 Jun 2026", size: "498 KB" },
];

export const SCHOOL_DOCUMENTS_LIST: SchoolDocument[] = [
  { id: "sd1", name: "Academic Calendar 2026-27", category: "Academic", uploadedDate: "01 Apr 2026", size: "1.5 MB" },
  { id: "sd2", name: "School Circular — Fee Structure", category: "Circular", uploadedDate: "15 Apr 2026", size: "234 KB" },
  { id: "sd3", name: "PTM Schedule — June 2026", category: "PTM", uploadedDate: "10 Jun 2026", size: "89 KB" },
  { id: "sd4", name: "Holiday List 2026-27", category: "Holiday", uploadedDate: "01 Apr 2026", size: "156 KB" },
  { id: "sd5", name: "Examination Guidelines — Term 2", category: "Exam", uploadedDate: "05 Jun 2026", size: "345 KB" },
  { id: "sd6", name: "School Safety Policy", category: "Policy", uploadedDate: "01 Apr 2026", size: "412 KB" },
];

export const PERSONAL_DOCUMENTS: PersonalDocument[] = [
  { id: "pd1", name: "Teaching Certificate", category: "Certificates", uploadedDate: "01 Jun 2025", size: "2.1 MB", confidential: true },
  { id: "pd2", name: "Joining Letter", category: "Employment", uploadedDate: "01 Jun 2025", size: "156 KB", confidential: true },
  { id: "pd3", name: "CTET Certificate", category: "Certificates", uploadedDate: "15 Mar 2024", size: "1.8 MB", confidential: true },
  { id: "pd4", name: "Training Certificate — AI in Education", category: "Training", uploadedDate: "20 Apr 2026", size: "890 KB", confidential: false },
  { id: "pd5", name: "Lesson Plan — Quadratic Equations", category: "Lesson Plans", uploadedDate: "05 Jun 2026", size: "345 KB", confidential: false },
  { id: "pd6", name: "Personal Notes — Term Planning", category: "Notes", uploadedDate: "01 Jun 2026", size: "67 KB", confidential: true },
  { id: "pd7", name: "Workshop Certificate — STEM", category: "Training", uploadedDate: "10 May 2026", size: "1.1 MB", confidential: false },
  { id: "pd8", name: "B.Ed Degree Certificate", category: "Certificates", uploadedDate: "01 Jun 2025", size: "2.3 MB", confidential: true },
];

export const DOCUMENT_AI_INSIGHTS = [
  { text: "4 student documents require verification.", type: "warning" as const },
  { text: "2 Aadhaar cards are missing.", type: "warning" as const },
  { text: "3 report cards need re-upload.", type: "info" as const },
  { text: "All TC documents have been verified.", type: "success" as const },
];
