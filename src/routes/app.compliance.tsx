import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  Search,
  ShieldCheck,
  Upload,
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  ClipboardCheck,
  Calendar,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/compliance")({ component: CompliancePage });

type StatusLevel = "Healthy" | "Warning" | "Critical";
type ComplianceCategory = "Regulatory" | "Safety" | "Infrastructure" | "Government Submission" | "Staff";

type ComplianceItem = {
  id: string;
  name: string;
  category: ComplianceCategory;
  statusLevel: StatusLevel;
  statusLabel: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  issueDate: string;
  expiryDate: string;
  daysRemaining: number;
  documentName: string;
  notes: string;
};

const complianceItems: ComplianceItem[] = [
  {
    id: "school-recognition",
    name: "School Recognition / RTE Compliance",
    category: "Regulatory",
    statusLevel: "Healthy",
    statusLabel: "Active",
    primaryLabel: "Valid Until",
    primaryValue: "12 Aug 2027",
    secondaryLabel: "Days Remaining",
    secondaryValue: "428 Days Remaining",
    issueDate: "12 Aug 2024",
    expiryDate: "12 Aug 2027",
    daysRemaining: 428,
    documentName: "Recognition Certificate",
    notes: "Recognition file is current and aligned with the existing academic year.",
  },
  {
    id: "udise",
    name: "UDISE+",
    category: "Government Submission",
    statusLevel: "Healthy",
    statusLabel: "Submitted",
    primaryLabel: "Last Updated",
    primaryValue: "02 Jun 2026",
    secondaryLabel: "Verification Status",
    secondaryValue: "Verified",
    issueDate: "01 Jun 2026",
    expiryDate: "30 Sep 2026",
    daysRemaining: 118,
    documentName: "UDISE Submission Record",
    notes: "Current UDISE+ submission has been verified and accepted in the latest cycle.",
  },
  {
    id: "fire-noc",
    name: "Fire NOC",
    category: "Safety",
    statusLevel: "Warning",
    statusLabel: "Expires in 24 Days",
    primaryLabel: "Expiry Date",
    primaryValue: "28 Jun 2026",
    secondaryLabel: "Days Remaining",
    secondaryValue: "24 Days Remaining",
    issueDate: "28 Jun 2024",
    expiryDate: "28 Jun 2026",
    daysRemaining: 24,
    documentName: "Fire Safety Certificate",
    notes: "Renewal should be initiated immediately to avoid inspection risk.",
  },
  {
    id: "building-safety",
    name: "Building Safety Certificate",
    category: "Infrastructure",
    statusLevel: "Healthy",
    statusLabel: "Active",
    primaryLabel: "Renewal Date",
    primaryValue: "15 Jul 2026",
    secondaryLabel: "Days Remaining",
    secondaryValue: "41 Days Remaining",
    issueDate: "15 Jul 2024",
    expiryDate: "15 Jul 2026",
    daysRemaining: 41,
    documentName: "Structural Safety Certificate",
    notes: "The building safety certificate is valid, with renewal scheduled within the quarter.",
  },
  {
    id: "water-sanitation",
    name: "Water & Sanitation Certificate",
    category: "Safety",
    statusLevel: "Warning",
    statusLabel: "Expires in 18 Days",
    primaryLabel: "Expiry Date",
    primaryValue: "22 Jun 2026",
    secondaryLabel: "Days Remaining",
    secondaryValue: "18 Days Remaining",
    issueDate: "22 Jun 2024",
    expiryDate: "22 Jun 2026",
    daysRemaining: 18,
    documentName: "Water Test and Sanitation Report",
    notes: "Renewal and water testing should be completed within the next two weeks.",
  },
  {
    id: "board-affiliation",
    name: "Board / Affiliation Compliance",
    category: "Regulatory",
    statusLevel: "Healthy",
    statusLabel: "Active",
    primaryLabel: "Affiliation Validity",
    primaryValue: "31 Mar 2027",
    secondaryLabel: "Days Remaining",
    secondaryValue: "300 Days Remaining",
    issueDate: "31 Mar 2025",
    expiryDate: "31 Mar 2027",
    daysRemaining: 300,
    documentName: "Board Affiliation Approval",
    notes: "Affiliation compliance is current and the latest records are in good standing.",
  },
];

const complianceStats = [
  { label: "Compliance Health Score", value: "92 / 100", hint: "Healthy", icon: ShieldCheck, tone: "emerald" as const },
  { label: "Total Compliance Items", value: "18", hint: "Tracked", icon: ClipboardList, tone: "sky" as const },
  { label: "Need Attention", value: "2", hint: "Within 30 days", icon: AlertTriangle, tone: "amber" as const },
  { label: "Critical", value: "0", hint: "No blockers", icon: CheckCircle2, tone: "emerald" as const },
  { label: "Pending Submissions", value: "1", hint: "Government cycle", icon: FileText, tone: "violet" as const },
  { label: "Inspection Ready", value: "89%", hint: "High readiness", icon: ClipboardCheck, tone: "sky" as const },
];

const inspectionChecklist = [
  { label: "School Recognition", done: true },
  { label: "UDISE+", done: true },
  { label: "Fire NOC", done: true },
  { label: "Building Safety", done: true },
  { label: "Water Certificate", done: false },
  { label: "Staff Verification", done: false },
  { label: "Board Compliance", done: true },
];

const complianceCalendar = [
  { date: "12 July", title: "Water Test Renewal", detail: "Water safety testing and documentation review." },
  { date: "18 July", title: "Fire Safety Inspection", detail: "Fire department inspection and renewal workflow." },
  { date: "24 July", title: "UDISE Verification", detail: "Government portal verification and record check." },
  { date: "31 July", title: "Staff Verification Review", detail: "Review pending staff documents and approvals." },
];

const staffOverview = [
  { label: "Verified Staff", value: "58 / 61", hint: "95% verified" },
  { label: "Pending Verification", value: "3", hint: "Needs review" },
  { label: "Qualification Documents Missing", value: "2", hint: "Upload pending" },
  { label: "Contract Renewals Due", value: "4", hint: "Upcoming" },
];

const statusToneMap = {
  Healthy: { icon: "bg-emerald-500/10 text-emerald-500", badge: "bg-emerald-500/10 text-emerald-600 border-0", text: "text-emerald-600", ring: "ring-emerald-500/20" },
  Warning: { icon: "bg-amber-500/10 text-amber-500", badge: "bg-amber-500/10 text-amber-600 border-0", text: "text-amber-600", ring: "ring-amber-500/20" },
  Critical: { icon: "bg-red-500/10 text-red-500", badge: "bg-red-500/10 text-red-600 border-0", text: "text-red-600", ring: "ring-red-500/20" },
};

function CompliancePage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedPanel, setSelectedPanel] = useState<{ kind: "score" } | { kind: "item"; item: ComplianceItem } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return complianceItems.filter((item) => {
      if (q && !(item.name.toLowerCase().includes(q) || item.documentName.toLowerCase().includes(q))) return false;
      if (statusFilter !== "all" && item.statusLevel !== statusFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      return true;
    });
  }, [query, statusFilter, categoryFilter]);

  const expiringCertificates = useMemo(() => {
    return [...filteredItems]
      .filter((item) => item.daysRemaining <= 60)
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 4);
  }, [filteredItems]);

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <div>
      <PageHeader
        title="Compliance"
        subtitle="Maharashtra-focused compliance and inspection readiness center for the principal."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-violet-600 hover:bg-violet-700">
              <Upload className="size-3" /> Upload Document
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <FileText className="size-3" /> Generate Report
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
              <CalendarDays className="size-3" /> Compliance Calendar
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {complianceStats.map((stat) => {
          const Icon = stat.icon;
          const tones = { emerald: "bg-emerald-500/10 text-emerald-500", sky: "bg-sky-500/10 text-sky-500", amber: "bg-amber-500/10 text-amber-500", violet: "bg-violet-500/10 text-violet-500" };
          return (
            <Card key={stat.label} className="p-3 sm:p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("size-10 rounded-xl grid place-items-center shrink-0", tones[stat.tone])}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  <div className="text-lg font-semibold">{stat.value}</div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">{stat.hint}</p>
            </Card>
          );
        })}
      </div>

      {/* Compliance Health Summary */}
      <Card className="p-4 sm:p-5 mb-6 sm:mb-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center shrink-0">
                <ShieldCheck className="size-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-semibold">Compliance Health</p>
                <div className="text-2xl sm:text-4xl font-semibold">92 / 100</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">Healthy</Badge>
              <Badge variant="outline" className="text-[10px]">Inspection-focused</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-5 max-w-2xl">
              The school remains compliant across most regulatory requirements. Two certificates need attention within the next 30 days,
              while overall inspection readiness remains high.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl border border-border/60 p-3 sm:p-4">
                <p className="text-[11px] text-muted-foreground">Total Compliance Items</p>
                <p className="text-lg font-semibold">18</p>
              </div>
              <div className="rounded-xl border border-border/60 p-3 sm:p-4">
                <p className="text-[11px] text-muted-foreground">Need Attention</p>
                <p className="text-lg font-semibold text-amber-600">2</p>
              </div>
              <div className="rounded-xl border border-border/60 p-3 sm:p-4">
                <p className="text-[11px] text-muted-foreground">Critical</p>
                <p className="text-lg font-semibold text-emerald-600">0</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 self-start" onClick={() => setSelectedPanel({ kind: "score" })}>
            Explain Score
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="p-3 sm:p-4 mb-6 sm:mb-8">
          <TabsList className="h-11 overflow-x-auto scrollbar-hide">
            <TabsTrigger value="overview" className="text-sm gap-2 px-5"><LayoutDashboard className="size-4" /> Overview</TabsTrigger>
            <TabsTrigger value="items" className="text-sm gap-2 px-5"><ClipboardList className="size-4" /> Compliance Items</TabsTrigger>
            <TabsTrigger value="expiring" className="text-sm gap-2 px-5"><AlertTriangle className="size-4" /> Expiring Certificates</TabsTrigger>
            <TabsTrigger value="inspection" className="text-sm gap-2 px-5"><ClipboardCheck className="size-4" /> Inspection Readiness</TabsTrigger>
            <TabsTrigger value="calendar" className="text-sm gap-2 px-5"><Calendar className="size-4" /> Calendar</TabsTrigger>
            <TabsTrigger value="staff" className="text-sm gap-2 px-5"><Users className="size-4" /> Staff</TabsTrigger>
          </TabsList>
        </Card>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Compliance Overview</h3>
                <p className="text-xs text-muted-foreground">Summary of all compliance areas and their current status.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Summary</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {complianceItems.map((item) => {
                const tone = statusToneMap[item.statusLevel];
                return (
                  <div key={item.id} className="rounded-xl border border-border/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] text-muted-foreground">{item.category}</p>
                        <p className="text-xs font-semibold mt-1">{item.name}</p>
                      </div>
                      <Badge className={cn("text-[10px]", tone.badge)}>{item.statusLevel}</Badge>
                    </div>
                    <div className="mt-2 text-[11px] text-muted-foreground">{item.statusLabel}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* ═══ COMPLIANCE ITEMS ═══ */}
        {activeTab === "items" && (
          <div>
            <Card className="p-3 sm:p-4 mb-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-base sm:text-lg font-semibold">Search and Filters</p>
                  <p className="text-[11px] text-muted-foreground">Search certificate name, compliance item, or document name.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="h-8 text-xs pl-8 w-full sm:w-[260px]"
                      placeholder="Search certificate, item, document..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[150px] h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="Healthy">Healthy</SelectItem>
                      <SelectItem value="Warning">Warning</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] h-8 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="Regulatory">Regulatory</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Government Submission">Govt Submission</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={resetFilters}>Clear</Button>
                </div>
              </div>
            </Card>

            <p className="text-base sm:text-lg font-semibold mb-3">Core Compliance Status</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {filteredItems.map((item) => {
                const tone = statusToneMap[item.statusLevel];
                return (
                  <button key={item.id} type="button" className="text-left" onClick={() => setSelectedPanel({ kind: "item", item })}>
                    <Card className="h-full p-4 transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] text-muted-foreground">{item.category}</p>
                          <h4 className="text-xs font-semibold mt-1">{item.name}</h4>
                        </div>
                        <Badge className={cn("text-[10px]", tone.badge)}>{item.statusLevel}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-[11px] text-muted-foreground">Status</p>
                          <p className="font-medium mt-0.5">{item.statusLabel}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">{item.primaryLabel}</p>
                          <p className="font-medium mt-0.5">{item.primaryValue}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">{item.secondaryLabel}</p>
                          <p className={cn("font-medium mt-0.5", tone.text)}>{item.secondaryValue}</p>
                        </div>
                        <div className="flex items-end justify-end">
                          <span className="text-[10px] text-muted-foreground">Tap for details</span>
                        </div>
                      </div>
                    </Card>
                  </button>
                );
              })}
            </div>
            {filteredItems.length === 0 && (
              <Card className="p-5"><p className="text-xs text-muted-foreground">No compliance items match the current filters.</p></Card>
            )}
          </div>
        )}

        {/* ═══ EXPIRING CERTIFICATES ═══ */}
        {activeTab === "expiring" && (
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Expiring Certificates & Renewals</h3>
                <p className="text-xs text-muted-foreground">Sorted by nearest expiry so upcoming risks are visible first.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">{expiringCertificates.length} Items</Badge>
            </div>
            <div className="space-y-3">
              {expiringCertificates.map((item) => {
                const tone = statusToneMap[item.statusLevel];
                return (
                  <button key={item.id} type="button" className="w-full text-left" onClick={() => setSelectedPanel({ kind: "item", item })}>
                    <div className="rounded-xl border border-border/60 p-4 transition hover:shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{item.statusLabel}</p>
                        </div>
                        <Badge className={cn("text-[10px]", tone.badge)}>{item.daysRemaining} Days Left</Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Expiry Date</span>
                        <span className="font-semibold">{item.expiryDate}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {/* ═══ INSPECTION READINESS ═══ */}
        {activeTab === "inspection" && (
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Inspection Readiness</h3>
                <p className="text-xs text-muted-foreground">Quick view of what is inspection-ready and what needs attention.</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">Inspection Ready</Badge>
            </div>
            <div className="rounded-xl border border-border/60 p-4 mb-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground">Inspection Readiness</p>
                  <p className="text-2xl font-semibold mt-1">89%</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-muted-foreground">Overall Status</p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">Inspection Ready</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[89%] rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="space-y-2">
              {inspectionChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2.5 sm:py-2">
                  <div className="flex items-center gap-2">
                    {item.done ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <CircleAlert className="size-3.5 text-amber-500" />}
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <Badge className={cn("text-[10px] border-0", item.done ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>
                    {item.done ? "Ready" : "Attention"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ═══ CALENDAR ═══ */}
        {activeTab === "calendar" && (
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Compliance Calendar</h3>
                <p className="text-xs text-muted-foreground">Upcoming compliance events in a simple timeline.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Timeline</Badge>
            </div>
            <div className="space-y-4">
              {complianceCalendar.map((event, index) => (
                <div key={event.title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center shrink-0">
                      <Clock3 className="size-4 text-violet-500" />
                    </div>
                    {index < complianceCalendar.length - 1 ? <div className="mt-2 h-full w-px bg-border" /> : null}
                  </div>
                  <div className="pb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{event.date}</p>
                    <p className="text-xs font-semibold mt-1">{event.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ═══ STAFF ═══ */}
        {activeTab === "staff" && (
          <Card className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Staff Compliance Overview</h3>
                <p className="text-xs text-muted-foreground">Staff verification and renewal status at a glance.</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Staff</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {staffOverview.map((item) => (
                <Card key={item.label} className="p-4">
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold mt-1">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.hint}</p>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-3 sm:p-4 mt-6 sm:mt-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-base sm:text-lg font-semibold">Quick Actions</p>
            <p className="text-[11px] text-muted-foreground">Minimal actions for compliance oversight.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">Upload Document</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">Generate Report</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">View Calendar</Button>
          </div>
        </div>
      </Card>

      {/* Detail Sheet */}
      <Sheet
        open={selectedPanel !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPanel(null);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {selectedPanel?.kind === "score" ? (
            <>
              <SheetHeader>
                <SheetTitle>Compliance Health Score</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <p className="text-[11px] text-muted-foreground">Current Score</p>
                  <p className="text-3xl font-semibold mt-1">92 / 100</p>
                  <Badge className="mt-2 bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">Healthy</Badge>
                </div>
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground mb-1">What the score means</p>
                  <p className="text-xs text-muted-foreground leading-5">
                    The score reflects how ready the school is for inspection, based on current certificate validity, submission
                    completeness, staff verification, and upcoming expiry risk.
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground mb-1">How it is calculated</p>
                  <p className="text-xs text-muted-foreground leading-5">
                    Major certificates are weighted most heavily, followed by submission status and staff compliance. Healthy items
                    increase the score while upcoming expiries and missing documents reduce it.
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground mb-1">Why this score was assigned</p>
                  <p className="text-xs text-muted-foreground leading-5">
                    Only two items need immediate attention, there are no critical gaps, and the core Maharashtra compliance areas are
                    in strong standing.
                  </p>
                </Card>
              </div>
            </>
          ) : selectedPanel?.kind === "item" ? (
            <>
              <SheetHeader>
                <SheetTitle>{selectedPanel.item.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn("text-[10px] border-0", statusToneMap[selectedPanel.item.statusLevel].badge)}>{selectedPanel.item.statusLevel}</Badge>
                  <Badge variant="outline" className="text-[10px]">{selectedPanel.item.category}</Badge>
                  <Badge variant="outline" className="text-[10px]">{selectedPanel.item.documentName}</Badge>
                </div>
                <Card className="p-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Status</p>
                      <p className="font-medium mt-0.5">{selectedPanel.item.statusLabel}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Issue Date</p>
                      <p className="font-medium mt-0.5">{selectedPanel.item.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Expiry Date</p>
                      <p className="font-medium mt-0.5">{selectedPanel.item.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Days Remaining</p>
                      <p className="font-medium mt-0.5">{selectedPanel.item.daysRemaining} Days</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <p className="text-[11px] text-muted-foreground mb-2">Details</p>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-[11px] text-muted-foreground">{selectedPanel.item.primaryLabel}</p>
                      <p className="font-medium mt-0.5">{selectedPanel.item.primaryValue}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">{selectedPanel.item.secondaryLabel}</p>
                      <p className="font-medium mt-0.5">{selectedPanel.item.secondaryValue}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Notes</p>
                      <p className="text-muted-foreground leading-5 mt-0.5">{selectedPanel.item.notes}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
