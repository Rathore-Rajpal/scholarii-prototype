import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, FileText, Clock, BookOpen, FolderOpen, Upload, Search,
  Download, Eye, CheckCircle2, XCircle, AlertTriangle, Sparkles,
  ChevronRight, PenLine, Trash2, Copy, Lock, Shield, Send,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  STUDENT_DOCS,
  CLASS_DOCUMENTS,
  QUESTION_PAPERS,
  SCHOOL_DOCUMENTS_LIST,
  PERSONAL_DOCUMENTS,
  DOCUMENT_AI_INSIGHTS,
  type StudentDocEntry,
} from "@/lib/scholarii/teacher-documents-mock-data";
import { useAuth } from "@/lib/scholarii/auth";
import PrincipalDocumentsPage from "@/components/scholarii/PrincipalDocumentsPage";

export const Route = createFileRoute("/app/documents")({
  component: DocumentsPageWrapper,
});

function DocumentsPageWrapper() {
  const { user } = useAuth();
  if (user?.role === "principal") return <PrincipalDocumentsPage />;
  return (
    <RoleGuard allowedRoles={["teacher"]}>
      <DocumentsPage />
    </RoleGuard>
  );
}

type TabId = "students" | "class" | "question-papers" | "school" | "my-docs";
type SideTab = "required" | "additional" | "history";

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "students", label: "Students", icon: Users },
  { id: "class", label: "Class Documents", icon: FolderOpen },
  { id: "question-papers", label: "Question Papers", icon: FileText },
  { id: "school", label: "School Documents", icon: BookOpen },
  { id: "my-docs", label: "My Documents", icon: Shield },
];

const SIDE_TABS: { id: SideTab; label: string }[] = [
  { id: "required", label: "Required Docs" },
  { id: "additional", label: "Additional Docs" },
  { id: "history", label: "History" },
];

const statusStyles: Record<string, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  verified: { color: "text-emerald-600", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  pending: { color: "text-amber-600", bg: "bg-amber-500/10", icon: Clock },
  missing: { color: "text-red-600", bg: "bg-red-500/10", icon: XCircle },
};

const examTypeColors: Record<string, string> = {
  "Unit Test": "bg-purple-500/10 text-purple-600",
  "Mid Term": "bg-purple-500/10 text-purple-600",
  "Final Exam": "bg-red-500/10 text-red-600",
  "Practice": "bg-emerald-500/10 text-emerald-600",
  "Previous Year": "bg-amber-500/10 text-amber-600",
};

function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("students");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("roll");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [sideTab, setSideTab] = useState<SideTab>("required");
  const [sideWidth, setSideWidth] = useState(35);
  const [classSearch, setClassSearch] = useState("");
  const [qpSearch, setQpSearch] = useState("");
  const [qpFilterType, setQpFilterType] = useState("all");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [mySearch, setMySearch] = useState("");

  const filteredStudents = useMemo(() => {
    let result = [...STUDENT_DOCS];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || String(s.roll).includes(q));
    }
    if (filterStatus === "pending") result = result.filter((s) => s.pendingCount > 0);
    else if (filterStatus === "verified") result = result.filter((s) => s.verificationPct === 100);
    else if (filterStatus === "missing") result = result.filter((s) => s.requiredDocs.some((d) => d.status === "missing"));
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "verification") result.sort((a, b) => b.verificationPct - a.verificationPct);
    else if (sortBy === "pending") result.sort((a, b) => b.pendingCount - a.pendingCount);
    else result.sort((a, b) => a.roll - b.roll);
    return result;
  }, [search, filterStatus, sortBy]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return STUDENT_DOCS.find((s) => s.id === selectedStudentId) || null;
  }, [selectedStudentId]);

  const filteredClassDocs = useMemo(() => {
    if (!classSearch) return CLASS_DOCUMENTS;
    const q = classSearch.toLowerCase();
    return CLASS_DOCUMENTS.filter((d) => d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q));
  }, [classSearch]);

  const filteredQP = useMemo(() => {
    let result = [...QUESTION_PAPERS];
    if (qpSearch) {
      const q = qpSearch.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q));
    }
    if (qpFilterType !== "all") result = result.filter((p) => p.examType === qpFilterType);
    return result;
  }, [qpSearch, qpFilterType]);

  const filteredSchoolDocs = useMemo(() => {
    if (!schoolSearch) return SCHOOL_DOCUMENTS_LIST;
    const q = schoolSearch.toLowerCase();
    return SCHOOL_DOCUMENTS_LIST.filter((d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
  }, [schoolSearch]);

  const filteredPersonalDocs = useMemo(() => {
    if (!mySearch) return PERSONAL_DOCUMENTS;
    const q = mySearch.toLowerCase();
    return PERSONAL_DOCUMENTS.filter((d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
  }, [mySearch]);

  const totalStudentDocs = STUDENT_DOCS.reduce((sum, s) => sum + s.requiredDocs.length + s.additionalDocs.length, 0);
  const pendingVerifications = STUDENT_DOCS.reduce((sum, s) => sum + s.pendingCount, 0);

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Manage student, class, academic and personal documents."
        action={
          <Button size="sm" className="bg-brand-gradient text-white border-0">
            <Upload className="size-4 mr-1" />
            Upload
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-purple-500/10 grid place-items-center">
              <Users className="size-5 text-purple-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Student Documents</div>
              <div className="text-xl font-semibold">{totalStudentDocs}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-2 border-amber-200/70 dark:border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 grid place-items-center">
              <Clock className="size-5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Pending Verifications</div>
              <div className="text-xl font-semibold">{pendingVerifications}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center">
              <FolderOpen className="size-5 text-violet-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Class Documents</div>
              <div className="text-xl font-semibold">{CLASS_DOCUMENTS.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
              <FileText className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Question Papers</div>
              <div className="text-xl font-semibold">{QUESTION_PAPERS.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-sky-500/10 grid place-items-center">
              <Shield className="size-5 text-sky-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">My Documents</div>
              <div className="text-xl font-semibold">{PERSONAL_DOCUMENTS.length}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs + Search */}
      <Card className="p-4 mb-6">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-violet-500/10 text-violet-600 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-4 pb-4">

        {/* ===================== STUDENTS TAB ===================== */}
        {activeTab === "students" && (
          <div className="flex gap-4" style={{ minHeight: "500px" }}>
            {/* Left: Student Grid */}
            <div className={cn("flex-1 space-y-3 transition-all", selectedStudentId ? "" : "")}>
              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-8 h-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Sort" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roll">Roll Number</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="verification">Verification %</SelectItem>
                    <SelectItem value="pending">Pending Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student Cards Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredStudents.map((student) => (
                  <button key={student.id} onClick={() => { setSelectedStudentId(student.id === selectedStudentId ? null : student.id); setSideTab("required"); }} className={cn(
                    "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left",
                    selectedStudentId === student.id
                      ? "border-purple-500 bg-purple-500/5 shadow-sm"
                      : "border-border/60 hover:border-border hover:bg-muted/30",
                  )}>
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className={cn("text-[10px] font-medium text-white",
                        student.verificationPct === 100 ? "bg-emerald-500" :
                        student.verificationPct >= 80 ? "bg-amber-500" : "bg-red-500"
                      )}>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{student.name}</div>
                      <div className="text-[10px] text-muted-foreground">Roll #{student.roll}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn("text-sm font-bold",
                        student.verificationPct === 100 ? "text-emerald-600" :
                        student.verificationPct >= 80 ? "text-amber-600" : "text-red-600"
                      )}>{student.verificationPct}%</div>
                      {student.pendingCount > 0 && (
                        <div className="text-[9px] text-amber-600">{student.pendingCount} pending</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Student Document Sidebar */}
            {selectedStudent && (
              <div className="border border-border/60 rounded-xl bg-card flex flex-col" style={{ width: `${sideWidth}%`, minWidth: "30%", maxWidth: "50%" }}>
                {/* Sidebar Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 shrink-0">
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className={cn("text-[10px] font-medium text-white",
                      selectedStudent.verificationPct === 100 ? "bg-emerald-500" :
                      selectedStudent.verificationPct >= 80 ? "bg-amber-500" : "bg-red-500"
                    )}>{selectedStudent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{selectedStudent.name}</div>
                    <div className="text-[10px] text-muted-foreground">Roll #{selectedStudent.roll} · {selectedStudent.className} · {selectedStudent.verificationPct}% verified</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground" onClick={() => setSelectedStudentId(null)}>
                    <span className="text-sm leading-none">&times;</span>
                  </Button>
                </div>

                {/* Sidebar Tabs */}
                <div className="flex gap-1 px-3 pt-2 pb-1 border-b border-border/60 shrink-0">
                  {SIDE_TABS.map((tab) => (
                    <button key={tab.id} onClick={() => setSideTab(tab.id)} className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-medium transition-all",
                      sideTab === tab.id ? "bg-purple-500/10 text-purple-600" : "text-muted-foreground hover:bg-muted",
                    )}>{tab.label}</button>
                  ))}
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-purple-600">
                      <Send className="size-3 mr-1" />Re-upload
                    </Button>
                  </div>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                  {sideTab === "required" && selectedStudent.requiredDocs.map((doc) => {
                    const cfg = statusStyles[doc.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                        <div className={cn("size-7 rounded-lg grid place-items-center shrink-0", cfg.bg)}>
                          <FileText className={cn("size-3.5", cfg.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium">{doc.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{doc.uploadedDate || "Not uploaded"}</span>
                            {doc.verifiedBy && <span>· {doc.verifiedBy}</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className={cn("text-[9px] border-0", cfg.bg, cfg.color)}>
                          <StatusIcon className="size-2.5 mr-0.5" />{doc.status}
                        </Badge>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Eye className="size-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Download className="size-3" /></Button>
                        </div>
                      </div>
                    );
                  })}

                  {sideTab === "additional" && (
                    selectedStudent.additionalDocs.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <FolderOpen className="size-6 mx-auto mb-1.5 opacity-40" />
                        <p className="text-[10px]">No additional documents.</p>
                      </div>
                    ) : selectedStudent.additionalDocs.map((doc) => {
                      const cfg = statusStyles[doc.status];
                      const StatusIcon = cfg.icon;
                      return (
                        <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                          <div className={cn("size-7 rounded-lg grid place-items-center shrink-0", cfg.bg)}>
                            <FileText className={cn("size-3.5", cfg.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium">{doc.name}</div>
                            <div className="text-[10px] text-muted-foreground">{doc.uploadedDate}</div>
                          </div>
                          <Badge variant="outline" className={cn("text-[9px] border-0", cfg.bg, cfg.color)}>
                            <StatusIcon className="size-2.5 mr-0.5" />{doc.status}
                          </Badge>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Eye className="size-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Download className="size-3" /></Button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {sideTab === "history" && (
                    <div className="space-y-0">
                      {selectedStudent.verificationHistory.map((entry, i) => (
                        <div key={i} className="flex items-start gap-2.5 py-2">
                          <div className="size-5 rounded-full bg-purple-500/10 grid place-items-center shrink-0 mt-0.5">
                            <CheckCircle2 className="size-2.5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] text-muted-foreground">{entry.date}</div>
                            <div className="text-xs">{entry.action}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== CLASS DOCUMENTS TAB ===================== */}
        {activeTab === "class" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search class documents..." className="pl-8 h-8 text-xs" value={classSearch} onChange={(e) => setClassSearch(e.target.value)} />
              </div>
              <Button size="sm" className="h-8 text-xs bg-brand-gradient text-white border-0"><Upload className="size-3 mr-1" />Upload</Button>
            </div>
            <div className="space-y-1.5">
              {filteredClassDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                  <div className="size-7 rounded-lg bg-purple-500/10 grid place-items-center shrink-0">
                    <FileText className="size-3.5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{doc.name}</div>
                    <div className="text-[10px] text-muted-foreground">{doc.uploadedBy} · {doc.uploadedDate} · {doc.size}</div>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-0 bg-purple-500/10 text-purple-600 capitalize">{doc.type}</Badge>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Eye className="size-3" /></Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Download className="size-3" /></Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><PenLine className="size-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== QUESTION PAPERS TAB ===================== */}
        {activeTab === "question-papers" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search question papers..." className="pl-8 h-8 text-xs" value={qpSearch} onChange={(e) => setQpSearch(e.target.value)} />
              </div>
              <Select value={qpFilterType} onValueChange={setQpFilterType}>
                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Unit Test">Unit Test</SelectItem>
                  <SelectItem value="Mid Term">Mid Term</SelectItem>
                  <SelectItem value="Final Exam">Final Exam</SelectItem>
                  <SelectItem value="Practice">Practice</SelectItem>
                  <SelectItem value="Previous Year">Previous Year</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8 text-xs bg-brand-gradient text-white border-0"><Upload className="size-3 mr-1" />Upload</Button>
            </div>
            <div className="space-y-1.5">
              {filteredQP.map((paper) => (
                <div key={paper.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                  <div className="size-7 rounded-lg bg-emerald-500/10 grid place-items-center shrink-0">
                    <FileText className="size-3.5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{paper.name}</div>
                    <div className="text-[10px] text-muted-foreground">{paper.subject} · {paper.className} · {paper.createdDate}</div>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] border-0", examTypeColors[paper.examType])}>{paper.examType}</Badge>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Eye className="size-3" /></Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Download className="size-3" /></Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Copy className="size-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== SCHOOL DOCUMENTS TAB ===================== */}
        {activeTab === "school" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Search school documents..." className="pl-8 h-8 text-xs" value={schoolSearch} onChange={(e) => setSchoolSearch(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              {filteredSchoolDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                  <div className="size-7 rounded-lg bg-purple-500/10 grid place-items-center shrink-0">
                    <BookOpen className="size-3.5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{doc.name}</div>
                    <div className="text-[10px] text-muted-foreground">{doc.category} · {doc.uploadedDate} · {doc.size}</div>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-0 bg-purple-500/10 text-purple-600">{doc.category}</Badge>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Eye className="size-3" /></Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Download className="size-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== MY DOCUMENTS TAB ===================== */}
        {activeTab === "my-docs" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input placeholder="Search personal documents..." className="pl-8 h-8 text-xs" value={mySearch} onChange={(e) => setMySearch(e.target.value)} />
              </div>
              <Button size="sm" className="h-8 text-xs bg-brand-gradient text-white border-0"><Upload className="size-3 mr-1" />Upload</Button>
            </div>
            <div className="space-y-1.5">
              {filteredPersonalDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors">
                  <div className="size-7 rounded-lg bg-purple-500/10 grid place-items-center shrink-0">
                    {doc.confidential ? <Lock className="size-3.5 text-purple-600" /> : <FileText className="size-3.5 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">{doc.name}</span>
                      {doc.confidential && <Badge className="text-[8px] bg-red-500/10 text-red-600 border-0 h-4 px-1">Private</Badge>}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{doc.category} · {doc.uploadedDate} · {doc.size}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Eye className="size-3" /></Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><Download className="size-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
