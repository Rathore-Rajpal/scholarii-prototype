import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/scholarii/AppShell";
import {
  FileText, Users, ShieldCheck, Share2, Sparkles, Search, Upload,
  Download, Eye, CheckCircle2, AlertTriangle, Clock, FolderOpen,
  BookOpen, Info, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SCHOOL_DOCUMENTS, STUDENT_DOCUMENTS, STAFF_DOCUMENTS,
  COMPLIANCE_DOCUMENTS, SHARED_DOCUMENTS, DOC_AI_INSIGHTS, DOC_ACTIONS,
  DOC_CATEGORIES, DOC_DEPARTMENTS, DOC_CLASSES,
} from "@/lib/scholarii/principal-documents-mock-data";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  draft: { bg: "bg-amber-500/10", text: "text-amber-600" },
  archived: { bg: "bg-gray-500/10", text: "text-gray-600" },
  complete: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  pending: { bg: "bg-amber-500/10", text: "text-amber-600" },
  missing: { bg: "bg-red-500/10", text: "text-red-600" },
  verified: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  expired: { bg: "bg-red-500/10", text: "text-red-600" },
  valid: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  "expiring-soon": { bg: "bg-amber-500/10", text: "text-amber-600" },
};
const INSIGHT_STYLES: Record<string, { bg: string; border: string; iconColor: string }> = {
  warning: { bg: "bg-amber-500/5", border: "border-amber-200/50", iconColor: "text-amber-500" },
  success: { bg: "bg-emerald-500/5", border: "border-emerald-200/50", iconColor: "text-emerald-500" },
  danger: { bg: "bg-red-500/5", border: "border-red-200/50", iconColor: "text-red-500" },
  info: { bg: "bg-sky-500/5", border: "border-sky-200/50", iconColor: "text-sky-500" },
};

export default function PrincipalDocumentsPage() {
  const [activeTab, setActiveTab] = useState("school");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredSchoolDocs = useMemo(() => {
    let list = [...SCHOOL_DOCUMENTS];
    if (selectedCategory !== "all") list = list.filter((d) => d.category === selectedCategory);
    if (selectedDepartment !== "all") list = list.filter((d) => d.department === selectedDepartment);
    if (selectedStatus !== "all") list = list.filter((d) => d.status === selectedStatus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q));
    }
    if (sortBy === "newest") list.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    else if (sortBy === "oldest") list.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
    else if (sortBy === "updated") list.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    else list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [selectedCategory, selectedDepartment, selectedStatus, searchQuery, sortBy]);

  const filteredStudentDocs = useMemo(() => {
    let list = [...STUDENT_DOCUMENTS];
    if (selectedClass !== "all") list = list.filter((d) => d.class === selectedClass);
    if (selectedStatus !== "all") list = list.filter((d) => d.status === selectedStatus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => d.studentName.toLowerCase().includes(q) || d.documentType.toLowerCase().includes(q));
    }
    return list;
  }, [selectedClass, selectedStatus, searchQuery]);

  const filteredStaffDocs = useMemo(() => {
    let list = [...STAFF_DOCUMENTS];
    if (selectedDepartment !== "all") list = list.filter((d) => d.department === selectedDepartment);
    if (selectedStatus !== "all") list = list.filter((d) => d.status === selectedStatus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((d) => d.staffName.toLowerCase().includes(q) || d.documentType.toLowerCase().includes(q));
    }
    return list;
  }, [selectedDepartment, selectedStatus, searchQuery]);

  const totalDocs = SCHOOL_DOCUMENTS.length + STUDENT_DOCUMENTS.length + STAFF_DOCUMENTS.length + COMPLIANCE_DOCUMENTS.length;
  const thisMonthDocs = 8;
  const pendingApprovals = SCHOOL_DOCUMENTS.filter((d) => d.status === "draft").length + STAFF_DOCUMENTS.filter((d) => d.status === "pending").length;
  const expiringDocs = COMPLIANCE_DOCUMENTS.filter((d) => d.renewalStatus === "expiring-soon" || d.renewalStatus === "expired").length;

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="School Document Management Center — organize, search, and manage all school documents."
        action={
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <Select defaultValue="2025-26">
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2025-26">2025-26</SelectItem>
                <SelectItem value="2026-27">2026-27</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all" onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {DOC_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select defaultValue="all" onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DOC_DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full sm:w-44 pl-8 text-xs"
              />
            </div>
              <Button size="sm" className="h-8 text-xs gap-1.5 bg-violet-600 hover:bg-violet-700 w-full sm:w-auto">
              <Upload className="size-3" /> Upload
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="kpi-mobile-scroll grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KpiCard icon={FolderOpen} label="Total Documents" value={String(totalDocs)} tone="violet" />
        <KpiCard icon={FileText} label="Added This Month" value={String(thisMonthDocs)} tone="sky" />
        <KpiCard icon={Clock} label="Pending Approvals" value={String(pendingApprovals)} tone="amber" />
        <KpiCard icon={AlertTriangle} label="Expiring Documents" value={String(expiringDocs)} tone="red" />
        <KpiCard icon={Sparkles} label="AI Indexed" value={String(totalDocs - 3)} tone="emerald" />
        <KpiCard icon={Share2} label="Shared Documents" value={String(SHARED_DOCUMENTS.length)} tone="sky" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="p-4 mb-8">
          <TabsList className="h-11 overflow-x-auto scrollbar-hide">
            <TabsTrigger value="school" className="text-sm gap-2 px-5"><BookOpen className="size-4" /> School Docs</TabsTrigger>
            <TabsTrigger value="student" className="text-sm gap-2 px-5"><Users className="size-4" /> Student Docs</TabsTrigger>
            <TabsTrigger value="staff" className="text-sm gap-2 px-5"><ShieldCheck className="size-4" /> Staff Docs</TabsTrigger>
            <TabsTrigger value="compliance" className="text-sm gap-2 px-5"><FileText className="size-4" /> Compliance</TabsTrigger>
            <TabsTrigger value="shared" className="text-sm gap-2 px-5"><Share2 className="size-4" /> Shared</TabsTrigger>
            <TabsTrigger value="ai" className="text-sm gap-2 px-5"><Sparkles className="size-4" /> AI Insights</TabsTrigger>
          </TabsList>
        </Card>

        {/* ═══ SCHOOL DOCUMENTS ═══ */}
        <TabsContent value="school">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold">School Documents</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 h-7 text-[10px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="updated">Recently Updated</SelectItem>
                  <SelectItem value="alpha">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Document</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Uploaded By</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Updated</th>
                    <th className="text-center p-2 text-[10px] font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchoolDocs.map((doc) => (
                    <tr key={doc.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-lg bg-violet-500/10 grid place-items-center"><FileText className="size-3.5 text-violet-500" /></div>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground">{doc.category}</td>
                      <td className="p-2 text-muted-foreground">{doc.uploadedBy}</td>
                      <td className="p-2 text-muted-foreground">{new Date(doc.uploadDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="p-2 text-muted-foreground">{new Date(doc.lastUpdated).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="p-2 text-center">
                        <Badge className={cn("border-0 text-[8px] capitalize", STATUS_STYLES[doc.status]?.bg, STATUS_STYLES[doc.status]?.text)}>
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Eye className="size-3" /></button>
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Download className="size-3" /></button>
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Share2 className="size-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ═══ STUDENT DOCUMENTS ═══ */}
        <TabsContent value="student">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {DOC_CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card className="p-5">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Student Documents</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Student</th>
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Class</th>
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Document Type</th>
                      <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Upload Date</th>
                      <th className="text-center p-2 text-[10px] font-medium text-muted-foreground">Status</th>
                      <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudentDocs.map((doc) => (
                      <tr key={doc.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarFallback className="bg-violet-500 text-white text-[8px]">{doc.studentName.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{doc.studentName}</span>
                          </div>
                        </td>
                        <td className="p-2 text-muted-foreground">{doc.class}</td>
                        <td className="p-2 text-muted-foreground">{doc.documentType}</td>
                        <td className="p-2 text-muted-foreground">{new Date(doc.uploadDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="p-2 text-center">
                          <Badge className={cn("border-0 text-[8px] capitalize", STATUS_STYLES[doc.status]?.bg, STATUS_STYLES[doc.status]?.text)}>
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Eye className="size-3" /></button>
                            <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Download className="size-3" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ═══ STAFF DOCUMENTS ═══ */}
        <TabsContent value="staff">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DOC_DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Staff Documents</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Staff</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Department</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Document Type</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Upload Date</th>
                    <th className="text-center p-2 text-[10px] font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaffDocs.map((doc) => (
                    <tr key={doc.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback className="bg-violet-500 text-white text-[8px]">{doc.staffName.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{doc.staffName}</span>
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground">{doc.department}</td>
                      <td className="p-2 text-muted-foreground">{doc.documentType}</td>
                      <td className="p-2 text-muted-foreground">{new Date(doc.uploadDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="p-2 text-center">
                        <Badge className={cn("border-0 text-[8px] capitalize", STATUS_STYLES[doc.status]?.bg, STATUS_STYLES[doc.status]?.text)}>
                          {doc.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Eye className="size-3" /></button>
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Download className="size-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ═══ COMPLIANCE DOCUMENTS ═══ */}
        <TabsContent value="compliance">
          <Card className="p-5">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Compliance Documents</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Document</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Issued By</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Expiry Date</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Last Verified</th>
                    <th className="text-center p-2 text-[10px] font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPLIANCE_DOCUMENTS.map((doc) => (
                    <tr key={doc.id} className={cn("border-b border-border/30 hover:bg-muted/20 transition-colors", doc.renewalStatus === "expired" && "bg-red-500/5")}>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("size-7 rounded-lg grid place-items-center", doc.renewalStatus === "expired" ? "bg-red-500/10" : doc.renewalStatus === "expiring-soon" ? "bg-amber-500/10" : "bg-emerald-500/10")}>
                            {doc.renewalStatus === "expired" ? <AlertTriangle className="size-3.5 text-red-500" /> : doc.renewalStatus === "expiring-soon" ? <Clock className="size-3.5 text-amber-500" /> : <CheckCircle2 className="size-3.5 text-emerald-500" />}
                          </div>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground">{doc.issuedBy}</td>
                      <td className="p-2 text-muted-foreground">{new Date(doc.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="p-2 text-muted-foreground">{new Date(doc.lastVerified).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="p-2 text-center">
                        <Badge className={cn("border-0 text-[8px] capitalize", STATUS_STYLES[doc.renewalStatus]?.bg, STATUS_STYLES[doc.renewalStatus]?.text)}>
                          {doc.renewalStatus === "expiring-soon" ? "Expiring Soon" : doc.renewalStatus}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Eye className="size-3" /></button>
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Download className="size-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ═══ SHARED DOCUMENTS ═══ */}
        <TabsContent value="shared">
          <Card className="p-5">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Shared Documents</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Document</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Audience</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Shared By</th>
                    <th className="text-left p-2 text-[10px] font-medium text-muted-foreground">Shared Date</th>
                    <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Views</th>
                    <th className="text-right p-2 text-[10px] font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {SHARED_DOCUMENTS.map((doc) => (
                    <tr key={doc.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-lg bg-sky-500/10 grid place-items-center"><Share2 className="size-3.5 text-sky-500" /></div>
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground">{doc.audience}</td>
                      <td className="p-2 text-muted-foreground">{doc.sharedBy}</td>
                      <td className="p-2 text-muted-foreground">{new Date(doc.sharedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="p-2 text-right font-semibold">{doc.viewsCount}</td>
                      <td className="p-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Eye className="size-3" /></button>
                          <button className="size-6 rounded-lg hover:bg-muted grid place-items-center text-muted-foreground hover:text-foreground transition-colors"><Download className="size-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ═══ AI INSIGHTS ═══ */}
        <TabsContent value="ai">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4 sm:p-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Sparkles className="size-3.5 text-violet-500" /> AI Document Insights
              </h4>
              <div className="space-y-2">
                {DOC_AI_INSIGHTS.map((insight) => {
                  const styles = INSIGHT_STYLES[insight.type];
                  const iconMap: Record<string, typeof AlertTriangle> = { "alert-triangle": AlertTriangle, info: Info };
                  const Icon = iconMap[insight.icon] || Info;
                  return (
                    <div key={insight.id} className={cn("flex items-start gap-3 rounded-xl border p-3", styles.bg, styles.border)}>
                      <Icon className={cn("size-3.5 shrink-0 mt-0.5", styles.iconColor)} />
                      <span className="text-xs">{insight.text}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Recommended Actions</h4>
              <div className="space-y-2">
                {DOC_ACTIONS.map((action) => (
                  <div key={action.id} className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5">
                    <div className={cn(
                      "size-6 rounded-lg grid place-items-center shrink-0",
                      action.priority === "high" ? "bg-red-500/10" : action.priority === "medium" ? "bg-amber-500/10" : "bg-sky-500/10"
                    )}>
                      <span className={cn(
                        "text-[10px] font-bold",
                        action.priority === "high" ? "text-red-600" : action.priority === "medium" ? "text-amber-600" : "text-sky-600"
                      )}>
                        {action.priority === "high" ? "!" : action.priority === "medium" ? "•" : "i"}
                      </span>
                    </div>
                    <p className="text-xs flex-1">{action.text}</p>
                    <Badge variant="outline" className="text-[9px] capitalize">{action.priority}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, tone }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "violet" | "sky" | "emerald" | "amber" | "red";
}) {
  const tones = {
    violet: "bg-violet-500/10 text-violet-500",
    sky: "bg-sky-500/10 text-sky-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
    red: "bg-red-500/10 text-red-500",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", tones[tone])}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] text-muted-foreground truncate">{label}</div>
          <div className="text-lg font-semibold truncate">{value}</div>
        </div>
      </div>
    </Card>
  );
}
