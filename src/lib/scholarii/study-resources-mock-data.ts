export type ResourceType = "pdf" | "docx" | "ppt" | "link" | "video" | "worksheet" | "notes" | "guide";
export type ResourceTab = "syllabus" | "teacher" | "mine" | "papers" | "saved";

export interface Resource {
  id: string;
  title: string;
  subject: string;
  description: string;
  type: ResourceType;
  size?: string;
  uploadedBy: string;
  uploadDate: string;
  tags: string[];
  bookmarked: boolean;
  class?: string;
  board?: string;
  year?: number;
  examType?: string;
  url?: string;
}

export const FILE_TYPE_CONFIG: Record<ResourceType, { label: string; color: string; bg: string; icon: string }> = {
  pdf: { label: "PDF", color: "text-red-400", bg: "bg-red-500/10", icon: "\ud83d\udcc4" },
  docx: { label: "DOCX", color: "text-blue-400", bg: "bg-blue-500/10", icon: "\ud83d\udcdd" },
  ppt: { label: "PPT", color: "text-orange-400", bg: "bg-orange-500/10", icon: "\ud83d\udcca" },
  link: { label: "Link", color: "text-cyan-400", bg: "bg-cyan-500/10", icon: "\ud83d\udd17" },
  video: { label: "Video", color: "text-violet-400", bg: "bg-violet-500/10", icon: "\ud83c\udfac" },
  worksheet: { label: "Worksheet", color: "text-amber-400", bg: "bg-amber-500/10", icon: "\ud83d\udcf3" },
  notes: { label: "Notes", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: "\ud83d\udcdd" },
  guide: { label: "Guide", color: "text-violet-400", bg: "bg-violet-500/10", icon: "\u2728" },
};

export const SYLLABUS_BOOKS: Resource[] = [
  { id: "b1", title: "Mathematics NCERT", subject: "Mathematics", description: "Official NCERT Mathematics textbook for Class 10. Covers algebra, geometry, trigonometry, statistics, and probability.", type: "pdf", size: "12.4 MB", uploadedBy: "School Administration", uploadDate: "1 Apr 2026", tags: ["NCERT", "Mathematics", "Class 10"], bookmarked: false, class: "Class 10", board: "CBSE" },
  { id: "b2", title: "Science NCERT", subject: "Science", description: "Official NCERT Science textbook for Class 10. Covers physics, chemistry, and biology concepts.", type: "pdf", size: "15.2 MB", uploadedBy: "School Administration", uploadDate: "1 Apr 2026", tags: ["NCERT", "Science", "Class 10"], bookmarked: true, class: "Class 10", board: "CBSE" },
  { id: "b3", title: "English Reader", subject: "English", description: "Prescribed English reader with prose, poetry, and grammar sections for Class 10.", type: "pdf", size: "8.7 MB", uploadedBy: "School Administration", uploadDate: "1 Apr 2026", tags: ["NCERT", "English", "Class 10"], bookmarked: false, class: "Class 10", board: "CBSE" },
  { id: "b4", title: "Social Science NCERT", subject: "Social Studies", description: "NCERT Social Science textbook covering history, geography, civics, and economics.", type: "pdf", size: "18.1 MB", uploadedBy: "School Administration", uploadDate: "1 Apr 2026", tags: ["NCERT", "Social Studies", "Class 10"], bookmarked: false, class: "Class 10", board: "CBSE" },
];

export const TEACHER_RESOURCES: Resource[] = [
  { id: "t1", title: "Algebra Complete Notes", subject: "Mathematics", description: "Comprehensive notes on algebraic expressions, linear equations, and polynomials. Includes solved examples and practice problems.", type: "pdf", size: "2.3 MB", uploadedBy: "Mr. Sharma", uploadDate: "10 May 2026", tags: ["Algebra", "Notes", "Unit 1"], bookmarked: true },
  { id: "t2", title: "Photosynthesis Project Guide", subject: "Science", description: "Step-by-step guide for the photosynthesis project. Includes diagram templates and reference material.", type: "ppt", size: "5.1 MB", uploadedBy: "Mrs. Gupta", uploadDate: "5 Jun 2026", tags: ["Photosynthesis", "Project", "Biology"], bookmarked: false },
  { id: "t3", title: "Climate Change Worksheet", subject: "English", description: "Reading comprehension and essay writing worksheet on climate change. Includes prompt questions and rubric.", type: "worksheet", size: "1.1 MB", uploadedBy: "Ms. Wilson", uploadDate: "1 Jun 2026", tags: ["Climate Change", "Worksheet", "Essay"], bookmarked: false },
  { id: "t4", title: "Computer Networks Study Guide", subject: "Computer Science", description: "Detailed guide on computer networks, HTML basics, and CSS fundamentals for Class 10.", type: "pdf", size: "3.4 MB", uploadedBy: "Mr. Verma", uploadDate: "20 May 2026", tags: ["Networks", "HTML", "CSS"], bookmarked: false },
  { id: "t5", title: "French Revolution Timeline", subject: "Social Studies", description: "Visual timeline of the French Revolution with key events, dates, and figures. Useful for exam revision.", type: "pdf", size: "1.8 MB", uploadedBy: "Mr. Reddy", uploadDate: "15 May 2026", tags: ["French Revolution", "History", "Timeline"], bookmarked: false },
];

export const MY_RESOURCES: Resource[] = [
  { id: "m1", title: "Physics Formula Sheet", subject: "Science", description: "Personal formula sheet covering all physics formulas for the upcoming exams.", type: "notes", uploadedBy: "Me", uploadDate: "8 Jun 2026", tags: ["Physics", "Formulas", "Revision"], bookmarked: true },
  { id: "m2", title: "History Revision Notes", subject: "Social Studies", description: "Handwritten revision notes for French Revolution and Socialism in Europe chapters.", type: "pdf", size: "0.8 MB", uploadedBy: "Me", uploadDate: "5 Jun 2026", tags: ["History", "Revision", "Notes"], bookmarked: false },
  { id: "m3", title: "Geography Map Practice", subject: "Social Studies", description: "Google Docs link with map-based practice questions for geography exam preparation.", type: "link", uploadedBy: "Me", uploadDate: "3 Jun 2026", tags: ["Geography", "Maps", "Practice"], bookmarked: false, url: "https://docs.google.com/document/d/example" },
];

export const PREVIOUS_PAPERS: Resource[] = [
  { id: "p1", title: "Unit Test 1 - Mathematics", subject: "Mathematics", description: "Previous year Unit Test 1 Mathematics question paper with marking scheme.", type: "pdf", size: "1.2 MB", uploadedBy: "School Administration", uploadDate: "20 May 2026", tags: ["Unit 1", "Mathematics", "Previous Paper"], bookmarked: false, year: 2026, examType: "Unit Test 1" },
  { id: "p2", title: "Mid-Term - Science", subject: "Science", description: "Mid-semester examination Science paper with answer key.", type: "pdf", size: "2.1 MB", uploadedBy: "School Administration", uploadDate: "20 Jun 2026", tags: ["Mid-Term", "Science", "Previous Paper"], bookmarked: true, year: 2026, examType: "Mid-Term" },
  { id: "p3", title: "Annual Exam - English", subject: "English", description: "Previous annual examination English paper with complete solution.", type: "pdf", size: "1.8 MB", uploadedBy: "School Administration", uploadDate: "15 Nov 2025", tags: ["Annual Exam", "English", "Previous Paper"], bookmarked: false, year: 2025, examType: "Annual Exam" },
  { id: "p4", title: "Unit Test 2 - Social Studies", subject: "Social Studies", description: "Previous year Unit Test 2 Social Studies paper with marking guidelines.", type: "pdf", size: "1.5 MB", uploadedBy: "School Administration", uploadDate: "10 Jul 2025", tags: ["Unit 2", "Social Studies", "Previous Paper"], bookmarked: false, year: 2025, examType: "Unit Test 2" },
];

export const SAVED_AI_GUIDES: Resource[] = [
  { id: "a1", title: "Mathematics Formula Sheet", subject: "Mathematics", description: "AI-generated comprehensive formula sheet covering all数学 chapters. Includes algebra, geometry, trigonometry, and statistics formulas.", type: "guide", uploadedBy: "AI Assistant", uploadDate: "12 Jun 2026", tags: ["AI Generated", "Formulas", "Mathematics"], bookmarked: true },
  { id: "a2", title: "Science Revision Notes", subject: "Science", description: "AI-curated revision notes summarizing key concepts from all science chapters. Optimized for last-minute revision.", type: "guide", uploadedBy: "AI Assistant", uploadDate: "10 Jun 2026", tags: ["AI Generated", "Revision", "Science"], bookmarked: false },
  { id: "a3", title: "History Timeline Summary", subject: "Social Studies", description: "AI-generated visual timeline of all historical events covered in the syllabus. Chronological order with key dates.", type: "guide", uploadedBy: "AI Assistant", uploadDate: "8 Jun 2026", tags: ["AI Generated", "History", "Timeline"], bookmarked: false },
  { id: "a4", title: "English Grammar Guide", subject: "English", description: "Comprehensive AI-generated grammar guide covering tenses, voice, reported speech, and writing skills.", type: "guide", uploadedBy: "AI Assistant", uploadDate: "5 Jun 2026", tags: ["AI Generated", "Grammar", "English"], bookmarked: false },
];

export const ALL_RESOURCES: Resource[] = [
  ...SYLLABUS_BOOKS,
  ...TEACHER_RESOURCES,
  ...MY_RESOURCES,
  ...PREVIOUS_PAPERS,
  ...SAVED_AI_GUIDES,
];
