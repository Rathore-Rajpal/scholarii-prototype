export type DocumentStatus = "requested" | "uploaded" | "verified" | "rejected";
export type DocumentTab = "school" | "private";

export type DocumentCategory =
  | "Identity"
  | "Academic"
  | "Medical"
  | "Financial"
  | "Photograph"
  | "Study Material"
  | "Project"
  | "Personal";

export interface Document {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadDate: string | null;
  verificationDate: string | null;
  verifiedBy: string | null;
  fileName: string | null;
  fileSize: string | null;
  fileType: string | null;
  isPrivate: boolean;
}

export const STATUS_CONFIG: Record<DocumentStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  requested: { label: "Requested", color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", dot: "bg-slate-500" },
  uploaded: { label: "Uploaded", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
  verified: { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500" },
};

export const CATEGORY_CONFIG: Record<DocumentCategory, { label: string; color: string; bg: string }> = {
  Identity: { label: "Identity", color: "text-violet-400", bg: "bg-violet-500/10" },
  Academic: { label: "Academic", color: "text-blue-400", bg: "bg-blue-500/10" },
  Medical: { label: "Medical", color: "text-rose-400", bg: "bg-rose-500/10" },
  Financial: { label: "Financial", color: "text-amber-400", bg: "bg-amber-500/10" },
  Photograph: { label: "Photograph", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  "Study Material": { label: "Study Material", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  Project: { label: "Project", color: "text-purple-400", bg: "bg-purple-500/10" },
  Personal: { label: "Personal", color: "text-sky-400", bg: "bg-sky-500/10" },
};

export const SCHOOL_DOCUMENTS: Document[] = [
  {
    id: "doc1",
    name: "Aadhaar Card",
    description: "Government-issued identity proof with Aadhaar number",
    category: "Identity",
    status: "verified",
    uploadDate: "2026-04-10",
    verificationDate: "2026-04-12",
    verifiedBy: "Mrs. Kavita Sharma",
    fileName: "aadhaar_card.pdf",
    fileSize: "245 KB",
    fileType: "application/pdf",
    isPrivate: false,
  },
  {
    id: "doc2",
    name: "Birth Certificate",
    description: "Original birth certificate issued by municipal corporation",
    category: "Identity",
    status: "verified",
    uploadDate: "2026-04-10",
    verificationDate: "2026-04-12",
    verifiedBy: "Mrs. Kavita Sharma",
    fileName: "birth_certificate.pdf",
    fileSize: "312 KB",
    fileType: "application/pdf",
    isPrivate: false,
  },
  {
    id: "doc3",
    name: "Transfer Certificate (TC / LC)",
    description: "Transfer certificate from previously attended school",
    category: "Academic",
    status: "verified",
    uploadDate: "2026-04-08",
    verificationDate: "2026-04-11",
    verifiedBy: "Mr. Rajesh Patel",
    fileName: "transfer_certificate.pdf",
    fileSize: "189 KB",
    fileType: "application/pdf",
    isPrivate: false,
  },
  {
    id: "doc4",
    name: "Previous Year Report Card",
    description: "Report card from the last academic year at previous school",
    category: "Academic",
    status: "verified",
    uploadDate: "2026-04-08",
    verificationDate: "2026-04-11",
    verifiedBy: "Mr. Rajesh Patel",
    fileName: "previous_report_card.pdf",
    fileSize: "428 KB",
    fileType: "application/pdf",
    isPrivate: false,
  },
  {
    id: "doc5",
    name: "Passport Size Photograph",
    description: "Recent passport-size photograph (4.5cm × 3.5cm) on white background",
    category: "Photograph",
    status: "verified",
    uploadDate: "2026-04-10",
    verificationDate: "2026-04-12",
    verifiedBy: "Mrs. Kavita Sharma",
    fileName: "passport_photo.jpg",
    fileSize: "89 KB",
    fileType: "image/jpeg",
    isPrivate: false,
  },
];

export const PRIVATE_DOCUMENTS: Document[] = [
  {
    id: "priv1",
    name: "Physics Notes",
    description: "Personal handwritten physics notes for revision",
    category: "Study Material",
    status: "uploaded",
    uploadDate: "2026-05-20",
    verificationDate: null,
    verifiedBy: null,
    fileName: "physics_notes.pdf",
    fileSize: "1.8 MB",
    fileType: "application/pdf",
    isPrivate: true,
  },
  {
    id: "priv2",
    name: "Personal Study Planner",
    description: "Weekly and monthly study schedule with goal tracking",
    category: "Personal",
    status: "uploaded",
    uploadDate: "2026-06-01",
    verificationDate: null,
    verifiedBy: null,
    fileName: "study_planner.docx",
    fileSize: "245 KB",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    isPrivate: true,
  },
  {
    id: "priv3",
    name: "Science Project Draft",
    description: "Draft report for science fair project on renewable energy",
    category: "Project",
    status: "uploaded",
    uploadDate: "2026-06-05",
    verificationDate: null,
    verifiedBy: null,
    fileName: "science_project_draft.pdf",
    fileSize: "3.2 MB",
    fileType: "application/pdf",
    isPrivate: true,
  },
  {
    id: "priv4",
    name: "IIT Preparation Notes",
    description: "Handpicked IIT-JEE preparation material and practice problems",
    category: "Study Material",
    status: "uploaded",
    uploadDate: "2026-05-15",
    verificationDate: null,
    verifiedBy: null,
    fileName: "iit_prep_notes.pdf",
    fileSize: "4.5 MB",
    fileType: "application/pdf",
    isPrivate: true,
  },
  {
    id: "priv5",
    name: "Scholarship Information",
    description: "Collected scholarship eligibility criteria and application details",
    category: "Personal",
    status: "uploaded",
    uploadDate: "2026-04-22",
    verificationDate: null,
    verifiedBy: null,
    fileName: "scholarship_info.pdf",
    fileSize: "567 KB",
    fileType: "application/pdf",
    isPrivate: true,
  },
];

export const ALL_DOCUMENTS: Document[] = [...SCHOOL_DOCUMENTS, ...PRIVATE_DOCUMENTS];
