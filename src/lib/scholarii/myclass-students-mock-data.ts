// ============================================================
// MY CLASS STUDENTS MOCK DATA
// ============================================================

export interface Student {
  id: string;
  name: string;
  roll: number;
  gender: "Male" | "Female";
  dob: string;
  bloodGroup: string;
  admissionNo: string;
  photo: string;
  attendance: number;
  score: number;
  status: "top" | "at-risk" | "stable";
  documents: { name: string; status: "verified" | "pending" | "missing" }[];
  parentName: string;
  parentContact: string;
  address: string;
  house: string;
  emergencyContact: string;
}

export interface StudentAttendance {
  month: string;
  present: number;
  absent: number;
  late: number;
  leave: number;
}

export interface StudentPerformance {
  subject: string;
  marks: number;
  grade: string;
}

export interface StudentNote {
  id: string;
  date: string;
  note: string;
  type: "academic" | "behavior" | "general";
}

export interface StudentCommunication {
  id: string;
  date: string;
  type: "meeting" | "remark" | "update" | "notice";
  content: string;
}

export const STUDENTS: Student[] = [
  {
    id: "s1", name: "Aarav Sharma", roll: 1, gender: "Male", dob: "15 Mar 2010", bloodGroup: "B+",
    admissionNo: "ADM-2024-001", photo: "", attendance: 96, score: 92, status: "top",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Rajesh Sharma", parentContact: "+91 98765 43210", address: "12 MG Road, Delhi",
    house: "Red", emergencyContact: "+91 98765 43211",
  },
  {
    id: "s2", name: "Priya Patel", roll: 2, gender: "Female", dob: "22 Jul 2010", bloodGroup: "O+",
    admissionNo: "ADM-2024-002", photo: "", attendance: 94, score: 88, status: "stable",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "pending" },
    ],
    parentName: "Suresh Patel", parentContact: "+91 98765 43212", address: "45 Park Street, Mumbai",
    house: "Blue", emergencyContact: "+91 98765 43213",
  },
  {
    id: "s3", name: "Rohan Gupta", roll: 3, gender: "Male", dob: "10 Nov 2009", bloodGroup: "A+",
    admissionNo: "ADM-2024-003", photo: "", attendance: 78, score: 62, status: "at-risk",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "pending" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "missing" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Anil Gupta", parentContact: "+91 98765 43214", address: "78 Lake View, Bangalore",
    house: "Green", emergencyContact: "+91 98765 43215",
  },
  {
    id: "s4", name: "Sneha Reddy", roll: 4, gender: "Female", dob: "05 Jan 2010", bloodGroup: "AB+",
    admissionNo: "ADM-2024-004", photo: "", attendance: 92, score: 85, status: "stable",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Venkat Reddy", parentContact: "+91 98765 43216", address: "23 Hill Road, Hyderabad",
    house: "Yellow", emergencyContact: "+91 98765 43217",
  },
  {
    id: "s5", name: "Vikram Singh", roll: 5, gender: "Male", dob: "18 Sep 2009", bloodGroup: "B-",
    admissionNo: "ADM-2024-005", photo: "", attendance: 88, score: 79, status: "stable",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "pending" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Manoj Singh", parentContact: "+91 98765 43218", address: "56 Civil Lines, Jaipur",
    house: "Red", emergencyContact: "+91 98765 43219",
  },
  {
    id: "s6", name: "Ananya Nair", roll: 6, gender: "Female", dob: "30 Apr 2010", bloodGroup: "O-",
    admissionNo: "ADM-2024-006", photo: "", attendance: 98, score: 94, status: "top",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Krishna Nair", parentContact: "+91 98765 43220", address: "89 Beach Road, Kochi",
    house: "Blue", emergencyContact: "+91 98765 43221",
  },
  {
    id: "s7", name: "Karthik Menon", roll: 7, gender: "Male", dob: "12 Feb 2010", bloodGroup: "A-",
    admissionNo: "ADM-2024-007", photo: "", attendance: 85, score: 72, status: "stable",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Ravi Menon", parentContact: "+91 98765 43222", address: "34 Temple Road, Trivandrum",
    house: "Green", emergencyContact: "+91 98765 43223",
  },
  {
    id: "s8", name: "Divya Joshi", roll: 8, gender: "Female", dob: "25 Jun 2010", bloodGroup: "B+",
    admissionNo: "ADM-2024-008", photo: "", attendance: 76, score: 58, status: "at-risk",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "missing" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "pending" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Suresh Joshi", parentContact: "+91 98765 43224", address: "67 Gandhi Nagar, Pune",
    house: "Yellow", emergencyContact: "+91 98765 43225",
  },
  {
    id: "s9", name: "Arjun Das", roll: 9, gender: "Male", dob: "08 Aug 2009", bloodGroup: "O+",
    admissionNo: "ADM-2024-009", photo: "", attendance: 91, score: 81, status: "stable",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Prakash Das", parentContact: "+91 98765 43226", address: "90 Station Road, Kolkata",
    house: "Red", emergencyContact: "+91 98765 43227",
  },
  {
    id: "s10", name: "Neha Kapoor", roll: 10, gender: "Female", dob: "14 Dec 2009", bloodGroup: "AB-",
    admissionNo: "ADM-2024-010", photo: "", attendance: 97, score: 95, status: "top",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Amit Kapoor", parentContact: "+91 98765 43228", address: "12 Mall Road, Chandigarh",
    house: "Blue", emergencyContact: "+91 98765 43229",
  },
  {
    id: "s11", name: "Rahul Verma", roll: 11, gender: "Male", dob: "03 May 2010", bloodGroup: "A+",
    admissionNo: "ADM-2024-011", photo: "", attendance: 89, score: 76, status: "stable",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "verified" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "pending" },
    ],
    parentName: "Deepak Verma", parentContact: "+91 98765 43230", address: "45 Nehru Nagar, Lucknow",
    house: "Green", emergencyContact: "+91 98765 43231",
  },
  {
    id: "s12", name: "Simran Kaur", roll: 12, gender: "Female", dob: "19 Oct 2009", bloodGroup: "B+",
    admissionNo: "ADM-2024-012", photo: "", attendance: 82, score: 68, status: "at-risk",
    documents: [
      { name: "Aadhaar Card", status: "verified" },
      { name: "Birth Certificate", status: "verified" },
      { name: "Transfer Certificate", status: "pending" },
      { name: "Previous Report Card", status: "verified" },
      { name: "Passport Photograph", status: "verified" },
    ],
    parentName: "Harpreet Kaur", parentContact: "+91 98765 43232", address: "78 Rajpur Road, Dehradun",
    house: "Yellow", emergencyContact: "+91 98765 43233",
  },
];

export const STUDENT_ATTENDANCE: Record<string, StudentAttendance[]> = {
  s1: [
    { month: "Jan", present: 22, absent: 0, late: 1, leave: 1 },
    { month: "Feb", present: 20, absent: 1, late: 0, leave: 1 },
    { month: "Mar", present: 23, absent: 0, late: 0, leave: 0 },
    { month: "Apr", present: 21, absent: 1, late: 1, leave: 0 },
    { month: "May", present: 22, absent: 0, late: 0, leave: 1 },
  ],
  s3: [
    { month: "Jan", present: 18, absent: 4, late: 2, leave: 0 },
    { month: "Feb", present: 16, absent: 5, late: 1, leave: 0 },
    { month: "Mar", present: 20, absent: 2, late: 1, leave: 0 },
    { month: "Apr", present: 17, absent: 4, late: 2, leave: 0 },
    { month: "May", present: 19, absent: 3, late: 1, leave: 0 },
  ],
};

export const STUDENT_PERFORMANCE: Record<string, StudentPerformance[]> = {
  s1: [
    { subject: "Mathematics", marks: 95, grade: "A+" },
    { subject: "Science", marks: 92, grade: "A+" },
    { subject: "English", marks: 88, grade: "A" },
    { subject: "Hindi", marks: 90, grade: "A+" },
    { subject: "Social Science", marks: 86, grade: "A" },
  ],
  s3: [
    { subject: "Mathematics", marks: 58, grade: "C" },
    { subject: "Science", marks: 65, grade: "B" },
    { subject: "English", marks: 62, grade: "B" },
    { subject: "Hindi", marks: 60, grade: "B" },
    { subject: "Social Science", marks: 68, grade: "B" },
  ],
};

export const STUDENT_NOTES: Record<string, StudentNote[]> = {
  s1: [
    { id: "n1", date: "10 Jun 2026", note: "Excellent participation in Mathematics class.", type: "academic" },
    { id: "n2", date: "05 Jun 2026", note: "Helped classmates with Quadratic Equations.", type: "behavior" },
  ],
  s3: [
    { id: "n3", date: "12 Jun 2026", note: "Needs extra Mathematics support.", type: "academic" },
    { id: "n4", date: "08 Jun 2026", note: "Attendance dropped this month. Check with parents.", type: "general" },
  ],
};

export const STUDENT_COMMUNICATION: Record<string, StudentCommunication[]> = {
  s1: [
    { id: "c1", date: "15 Jun 2026", type: "remark", content: "Class teacher remark: Excellent performance this term." },
    { id: "c2", date: "10 Jun 2026", type: "meeting", content: "Parent meeting: Discussed advanced Mathematics curriculum." },
  ],
  s3: [
    { id: "c3", date: "14 Jun 2026", type: "notice", content: "Sent notice to parents about attendance concerns." },
    { id: "c4", date: "08 Jun 2026", type: "meeting", content: "Parent meeting: Discussed improvement plan for Mathematics." },
  ],
};

export const AI_INSIGHTS: Record<string, string[]> = {
  s1: ["Consistent top performer across all subjects.", "Ready for advanced Mathematics challenges.", "Strong leadership qualities observed."],
  s3: ["Attendance dropped by 4% this month.", "Needs Algebra revision before Unit Test.", "Consider peer tutoring with top performers."],
  s8: ["Attendance below 80% — intervention needed.", "Struggling with core Mathematics concepts.", "Recommend additional practice sessions."],
};

// ============================================================
// CLASS-LEVEL ANALYTICS DATA
// ============================================================

export const CLASS_ATTENDANCE_TREND = [
  { month: "Jan", present: 245, absent: 12, late: 8, leave: 5 },
  { month: "Feb", present: 240, absent: 15, late: 10, leave: 5 },
  { month: "Mar", present: 248, absent: 10, late: 7, leave: 5 },
  { month: "Apr", present: 242, absent: 14, late: 9, leave: 5 },
  { month: "May", present: 250, absent: 8, late: 6, leave: 6 },
];

export const SUBJECT_PERFORMANCE = [
  { subject: "Mathematics", avg: 78, high: 95, low: 45, pass: 85 },
  { subject: "Science", avg: 82, high: 98, low: 52, pass: 88 },
  { subject: "English", avg: 80, high: 96, low: 48, pass: 86 },
  { subject: "Hindi", avg: 76, high: 94, low: 42, pass: 82 },
  { subject: "Social Science", avg: 79, high: 92, low: 50, pass: 84 },
];

export const GRADE_DISTRIBUTION = [
  { grade: "A+", count: 8 },
  { grade: "A", count: 12 },
  { grade: "B+", count: 10 },
  { grade: "B", count: 8 },
  { grade: "C", count: 4 },
  { grade: "D", count: 0 },
];

export const ATTENDANCE_DISTRIBUTION = [
  { range: "90-100%", count: 18, color: "#10b981" },
  { range: "80-89%", count: 14, color: "#f59e0b" },
  { range: "75-79%", count: 6, color: "#f97316" },
  { range: "Below 75%", count: 4, color: "#ef4444" },
];

export const CLASS_AI_INSIGHTS = [
  { id: "ai1", type: "warning", text: "4 students need Mathematics support before upcoming assessment." },
  { id: "ai2", type: "success", text: "Class attendance improved by 3% this month." },
  { id: "ai3", type: "info", text: "3 parent meetings recommended for at-risk students." },
  { id: "ai4", type: "warning", text: "Science scores dropped 5% compared to last term." },
  { id: "ai5", type: "success", text: "Top 5 performers maintaining consistent grades." },
  { id: "ai6", type: "info", text: "Consider peer tutoring: pair top performers with struggling students." },
];

export const CLASS_NOTICES = [
  { id: "nc1", date: "15 Jun 2026", title: "Mathematics Unit Test scheduled for 25 Jun", type: "exam" },
  { id: "nc2", date: "12 Jun 2026", title: "Parent-Teacher meeting on 20 Jun", type: "meeting" },
  { id: "nc3", date: "10 Jun 2026", title: "Science exhibition entries due by 18 Jun", type: "event" },
];

export const QUICK_ACTIONS = [
  { id: "qa1", label: "Mark Attendance", icon: "CheckCircle", color: "text-emerald-600 bg-emerald-500/10" },
  { id: "qa2", label: "Open Documents", icon: "FileText", color: "text-purple-600 bg-purple-500/10" },
  { id: "qa3", label: "View Results", icon: "TrendingUp", color: "text-blue-600 bg-blue-500/10" },
  { id: "qa4", label: "Message Parent", icon: "MessageSquare", color: "text-amber-600 bg-amber-500/10" },
  { id: "qa5", label: "Add Assignment", icon: "PlusCircle", color: "text-violet-600 bg-violet-500/10" },
  { id: "qa6", label: "Generate AI Report", icon: "Sparkles", color: "text-rose-600 bg-rose-500/10" },
];
