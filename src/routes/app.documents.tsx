import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Search,
  Share2,
  ShieldCheck,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/app/documents")({ component: DocumentsPage });

type DocumentStatus = "Indexed" | "Processing" | "Private" | "Shared";
type DocumentType = "Policy" | "Circular" | "Result" | "Certificate" | "Form" | "Record" | "Report";

type LibraryDocument = {
  id: number;
  name: string;
  category: string;
  type: DocumentType;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  status: DocumentStatus;
  description: string;
};

type CategoryNode = {
  label: string;
  count?: string;
  children?: string[];
};

const overviewCards = [
  { label: "Total Documents", value: "4,582 Documents", note: "All school files and records", icon: FileText },
  { label: "Categories", value: "12 Categories", note: "Organized by document type", icon: FolderOpen },
  { label: "Recent Uploads", value: "24 This Week", note: "Recently added files", icon: Upload },
  { label: "Storage Used", value: "18.2 GB", note: "Current storage usage", icon: BookOpen },
  { label: "AI Indexed", value: "3,842 Documents", note: "Available to Scholarii AI", icon: ShieldCheck },
];

const categoryTree: CategoryNode[] = [
  { label: "School Documents", count: "4,582" },
  {
    label: "Academic Documents",
    count: "1,028",
    children: ["Syllabus", "Lesson Plans", "Question Papers", "Results", "Academic Policies"],
  },
  {
    label: "Student Documents",
    count: "1,920",
    children: ["Admission Records", "Transfer Certificates", "Student Profiles", "Report Cards"],
  },
  {
    label: "Staff Documents",
    count: "562",
    children: ["Contracts", "Qualification Certificates", "Verification Documents", "HR Records"],
  },
  { label: "Compliance Documents", count: "348", children: ["Fire NOC", "Recognition", "Audit Files", "Safety Certificates"] },
  { label: "Finance Documents", count: "220", children: ["Fee Structure", "Receipts", "Ledger Reports"] },
  { label: "Library Documents", count: "136", children: ["Book Lists", "Catalogues", "Issue Rules"] },
  { label: "Sports Documents", count: "84", children: ["Event Plans", "Participation Lists", "Certificates"] },
  { label: "Transport Documents", count: "72", children: ["Route Sheets", "Driver Details", "Vehicle Records"] },
  { label: "Infrastructure Documents", count: "118", children: ["Floor Plans", "Maintenance", "Asset Register"] },
  { label: "Meeting Records", count: "91", children: ["PTA", "Staff Meetings", "Governing Body"] },
  { label: "Policies & SOPs", count: "203", children: ["Attendance", "Discipline", "Communication", "Safety"] },
];

const documents: LibraryDocument[] = [
  {
    id: 1,
    name: "Student Handbook.pdf",
    category: "School Documents",
    type: "Report",
    uploadedBy: "Admin Office",
    uploadDate: "12 Jul 2026",
    size: "2.1 MB",
    status: "Indexed",
    description: "Student handbook with rules, calendar, and school expectations.",
  },
  {
    id: 2,
    name: "Fire_NOC_2026.pdf",
    category: "Compliance Documents",
    type: "Certificate",
    uploadedBy: "Facilities Team",
    uploadDate: "10 Jul 2026",
    size: "1.4 MB",
    status: "Indexed",
    description: "Latest fire NOC for compliance and safety records.",
  },
  {
    id: 3,
    name: "PTM Circular - July.pdf",
    category: "Meeting Records",
    type: "Circular",
    uploadedBy: "Principal Office",
    uploadDate: "Yesterday",
    size: "860 KB",
    status: "Shared",
    description: "Parent meeting communication for the July PTM schedule.",
  },
  {
    id: 4,
    name: "Grade 10 Results.xlsx",
    category: "Academic Documents",
    type: "Result",
    uploadedBy: "Exam Cell",
    uploadDate: "2 Days Ago",
    size: "1.8 MB",
    status: "Processing",
    description: "Class 10 result summary and academic records export.",
  },
  {
    id: 5,
    name: "Staff Handbook.pdf",
    category: "Staff Documents",
    type: "Policy",
    uploadedBy: "HR Desk",
    uploadDate: "2 Hours Ago",
    size: "3.5 MB",
    status: "Private",
    description: "Internal handbook for staff policy, roles, and procedures.",
  },
  {
    id: 6,
    name: "UDISE Submission.pdf",
    category: "Compliance Documents",
    type: "Record",
    uploadedBy: "Office Admin",
    uploadDate: "Last Week",
    size: "1.2 MB",
    status: "Indexed",
    description: "Annual UDISE submission and reference file.",
  },
];

const recentDocuments = [
  { name: "Staff Handbook", time: "2 Hours Ago" },
  { name: "PTM Circular", time: "Yesterday" },
  { name: "Grade 10 Results", time: "2 Days Ago" },
  { name: "School Recognition Certificate", time: "Last Week" },
];

const quickAccess = [
  "School Recognition Certificate",
  "Fire NOC",
  "UDISE Submission",
  "Staff Handbook",
  "School Policy",
  "Academic Calendar",
  "Fee Structure",
];

const storageOverview = [
  { label: "School Documents", value: "1,284 Files" },
  { label: "Student Documents", value: "1,920 Files" },
  { label: "Compliance Documents", value: "348 Files" },
  { label: "Staff Documents", value: "562 Files" },
];

const documentFilters = {
  category: ["All Categories", "Academic Documents", "Student Documents", "Staff Documents", "Compliance Documents"],
  type: ["All Types", "Policy", "Circular", "Result", "Certificate", "Form", "Record", "Report"],
  status: ["All Status", "Indexed", "Processing", "Private", "Shared"],
};

function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [previewDocument, setPreviewDocument] = useState<LibraryDocument | null>(null);
  const [openCategories, setOpenCategories] = useState<string[]>(["Academic Documents", "Student Documents", "Staff Documents"]);

  const filteredDocuments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return documents.filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.uploadedBy.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;
      const matchesType = typeFilter === "All Types" || item.type === typeFilter;
      const matchesStatus = statusFilter === "All Status" || item.status === statusFilter;
      const matchesDate =
        dateFilter === "All Dates" ||
        (dateFilter === "Today" && item.uploadDate === "Today") ||
        (dateFilter === "This Week" && ["Yesterday", "2 Days Ago", "2 Hours Ago", "Last Week"].includes(item.uploadDate)) ||
        (dateFilter === "This Month" && item.uploadDate !== "Last Month");

      return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesDate;
    });
  }, [search, categoryFilter, typeFilter, statusFilter, dateFilter]);

  const indexedCount = 3842;
  const notIndexedCount = 4582 - indexedCount;

  const toggleCategory = (label: string) => {
    setOpenCategories((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));
  };

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_35%),linear-gradient(to_bottom,rgba(248,250,252,0.9),transparent)]" />

      <PageHeader
        title="Documents"
        subtitle="Your school’s central document library for fast search, browsing, and access."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50">
              <FileText className="mr-1 size-3.5" />
              School filing cabinet
            </Badge>
            <Badge variant="outline">{filteredDocuments.length} visible</Badge>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {overviewCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-border/60 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.note}</div>
                </div>
                <div className="grid size-10 place-items-center rounded-2xl bg-slate-50 text-slate-700">
                  <Icon className="size-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Card className="border-border/60 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Category Tree</p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">Browse by folder</h3>
            </div>
            <Badge variant="outline">{categoryTree.length} groups</Badge>
          </div>

          <ScrollArea className="mt-4 h-[640px] pr-3">
            <div className="space-y-3">
              {categoryTree.map((category) => {
                const expanded = openCategories.includes(category.label);
                return (
                  <Collapsible key={category.label} open={expanded} onOpenChange={() => toggleCategory(category.label)}>
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="grid size-9 place-items-center rounded-xl bg-slate-50 text-slate-700">
                            <FolderOpen className="size-4.5" />
                          </div>
                          <div>
                            <div className="font-semibold">{category.label}</div>
                            {category.count && <div className="text-xs text-muted-foreground">{category.count} items</div>}
                          </div>
                        </div>
                        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <div className="ml-6 rounded-2xl border border-dashed border-border bg-slate-50/80 p-3">
                        {category.children?.map((child) => (
                          <button
                            key={child}
                            type="button"
                            onClick={() => setCategoryFilter(category.label)}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-white"
                          >
                            <span>{child}</span>
                            <ArrowRight className="size-3.5 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60 p-5 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Search</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">Document Library</h3>
                </div>
                <Badge variant="outline">Quick access first</Badge>
              </div>

              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_160px_160px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search documents..."
                    className="h-11 rounded-2xl border-border pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-11 rounded-2xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentFilters.category.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-11 rounded-2xl">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentFilters.type.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 rounded-2xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentFilters.status.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {["All Dates", "Today", "This Week", "This Month"].map((item) => (
                  <Button
                    key={item}
                    type="button"
                    variant={dateFilter === item ? "default" : "outline"}
                    size="sm"
                    className={cn("h-9 rounded-full px-3", dateFilter === item && "bg-brand-gradient text-white border-0")}
                    onClick={() => setDateFilter(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          <Card className="border-border/60 p-5 shadow-sm">
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.9fr_0.8fr] gap-3 border-b border-border bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <div>Document Name</div>
                <div>Category</div>
                <div>Uploaded By</div>
                <div>Upload Date</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y divide-border bg-white">
                {filteredDocuments.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreviewDocument(item)}
                    className="grid w-full grid-cols-[2fr_1fr_1fr_1fr_0.9fr_0.8fr] gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.category}</div>
                    <div className="text-sm text-muted-foreground">{item.uploadedBy}</div>
                    <div className="text-sm text-muted-foreground">{item.uploadDate}</div>
                    <div>
                      <Badge
                        variant="outline"
                        className={cn(
                          item.status === "Indexed" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                          item.status === "Processing" && "border-amber-200 bg-amber-50 text-amber-700",
                          item.status === "Private" && "border-slate-200 bg-slate-50 text-slate-700",
                          item.status === "Shared" && "border-sky-200 bg-sky-50 text-sky-700",
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">View</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(filteredDocuments.length, 6)} of {filteredDocuments.length} documents
              </div>
              <Button type="button" variant="outline" className="rounded-full">
                Export list
              </Button>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Recent Documents</p>
                  <h3 className="mt-1 text-lg font-semibold">Recently uploaded</h3>
                </div>
                <Badge variant="outline">Latest</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {recentDocuments.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-border bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.time}</div>
                      </div>
                      <FileText className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Quick Access</p>
                  <h3 className="mt-1 text-lg font-semibold">Frequently used files</h3>
                </div>
                <Badge variant="outline">Pinned</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickAccess.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-border bg-white px-3 py-2 text-sm text-foreground transition-colors hover:border-slate-300 hover:bg-slate-50"
                    onClick={() => toast(`Opening ${item} in demo mode.`)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Storage Overview</p>
                  <h3 className="mt-1 text-lg font-semibold">Document storage by category</h3>
                </div>
                <Badge variant="outline">Files</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {storageOverview.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border bg-slate-50/70 p-4">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">{item.value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">AI Indexing Status</p>
                  <h3 className="mt-1 text-lg font-semibold">Availability to Scholarii AI</h3>
                </div>
                <Badge variant="outline">Visibility only</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-slate-50/70 p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Documents Available To Scholarii AI</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">3,842</div>
                </div>
                <div className="rounded-2xl border border-border bg-slate-50/70 p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Not Yet Indexed</div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">740</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Button type="button" className="h-11 justify-start rounded-2xl bg-brand-gradient text-white border-0">
          <Upload className="mr-2 size-4" />
          Upload Document
        </Button>
        <Button type="button" variant="outline" className="h-11 justify-start rounded-2xl">
          <FolderOpen className="mr-2 size-4" />
          Create Folder
        </Button>
        <Button type="button" variant="outline" className="h-11 justify-start rounded-2xl">
          <Download className="mr-2 size-4" />
          Export Document List
        </Button>
      </div>

      <Sheet open={Boolean(previewDocument)} onOpenChange={(open) => !open && setPreviewDocument(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Document Preview</SheetTitle>
            <SheetDescription>Quick access to document details without leaving the library.</SheetDescription>
          </SheetHeader>

          {previewDocument && (
            <div className="mt-6 space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Document Name</div>
                <div className="mt-1 text-xl font-semibold tracking-tight">{previewDocument.name}</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoBlock label="Category" value={previewDocument.category} />
                <InfoBlock label="Upload Date" value={previewDocument.uploadDate} />
                <InfoBlock label="File Type" value={previewDocument.type} />
                <InfoBlock label="Size" value={previewDocument.size} />
                <InfoBlock label="Status" value={previewDocument.status} />
                <InfoBlock label="Uploaded By" value={previewDocument.uploadedBy} />
              </div>

              <div className="rounded-2xl border border-border bg-slate-50/70 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Description</div>
                <p className="mt-2 text-sm leading-6 text-foreground">{previewDocument.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" className="rounded-full bg-brand-gradient text-white border-0">
                  <Eye className="mr-2 size-4" />
                  Preview
                </Button>
                <Button type="button" variant="outline" className="rounded-full">
                  <Download className="mr-2 size-4" />
                  Download
                </Button>
                <Button type="button" variant="outline" className="rounded-full">
                  <Share2 className="mr-2 size-4" />
                  Share
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
