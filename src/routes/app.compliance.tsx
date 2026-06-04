import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";

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
  { label: "Compliance Health Score", value: "92 / 100", hint: "Healthy", tone: "emerald" },
  { label: "Total Compliance Items", value: "18", hint: "Tracked", tone: "sky" },
  { label: "Need Attention", value: "2", hint: "Within 30 days", tone: "amber" },
  { label: "Critical", value: "0", hint: "No blockers", tone: "rose" },
  { label: "Pending Submissions", value: "1", hint: "Government cycle", tone: "violet" },
  { label: "Inspection Ready", value: "89%", hint: "High readiness", tone: "slate" },
] as const;

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

function toneClasses(level: StatusLevel) {
  switch (level) {
    case "Healthy":
      return {
        card: "border-emerald-200 bg-emerald-50/50",
        badge: "bg-emerald-600 text-white hover:bg-emerald-600",
        text: "text-emerald-700",
      };
    case "Warning":
      return {
        card: "border-amber-200 bg-amber-50/50",
        badge: "bg-amber-600 text-white hover:bg-amber-600",
        text: "text-amber-700",
      };
    case "Critical":
      return {
        card: "border-red-200 bg-red-50/50",
        badge: "bg-red-600 text-white hover:bg-red-600",
        text: "text-red-700",
      };
  }
}

function CompliancePage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedPanel, setSelectedPanel] = useState<{ kind: "score" } | { kind: "item"; item: ComplianceItem } | null>(null);

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
            <Button size="sm" className="bg-brand-gradient text-white border-0">
              <Upload className="mr-2 size-4" />
              Upload Document
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="mr-2 size-4" />
              Generate Compliance Report
            </Button>
            <Button size="sm" variant="outline">
              <CalendarDays className="mr-2 size-4" />
              View Compliance Calendar
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
          {complianceStats.map((stat) => (
            <Card key={stat.label} className="p-4 border-border/60">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <div className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.hint}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6 border-border/60 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <ShieldCheck className="size-3.5" />
                Compliance Health
              </div>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">92 / 100</h2>
              <div className="mt-2 flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Healthy</Badge>
                <Badge variant="outline">Inspection-focused</Badge>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                The school remains compliant across most regulatory requirements. Two certificates need attention within the next 30 days,
                while overall inspection readiness remains high.
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-background/80 p-3">
                  <p className="text-xs text-muted-foreground">Total Compliance Items</p>
                  <p className="mt-1 text-lg font-semibold">18</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-3">
                  <p className="text-xs text-muted-foreground">Need Attention</p>
                  <p className="mt-1 text-lg font-semibold text-amber-700">2</p>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-3">
                  <p className="text-xs text-muted-foreground">Critical</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-700">0</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="self-start" onClick={() => setSelectedPanel({ kind: "score" })}>
              Explain Score
            </Button>
          </div>
        </Card>

        <Card className="p-4 border-border/60">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Search and Filters</h3>
              <p className="text-sm text-muted-foreground">Search certificate name, compliance item, or document name.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="w-full pl-9 lg:w-[300px]"
                  placeholder="Search certificate, item, document..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="Regulatory">Regulatory</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="Government Submission">Government Submission</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="ghost" onClick={resetFilters}>
                Clear
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Core Compliance Status</h3>
              <p className="text-sm text-muted-foreground">The most important compliance areas relevant to Maharashtra school oversight.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const theme = toneClasses(item.statusLevel);
              return (
                <button key={item.id} type="button" className="text-left" onClick={() => setSelectedPanel({ kind: "item", item })}>
                  <Card className={`h-full p-4 border-border/60 transition hover:-translate-y-0.5 hover:shadow-md ${theme.card}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <h4 className="mt-1 text-base font-semibold">{item.name}</h4>
                      </div>
                      <Badge className={theme.badge}>{item.statusLevel}</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="mt-1 font-medium">{item.statusLabel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.primaryLabel}</p>
                        <p className="mt-1 font-medium">{item.primaryValue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.secondaryLabel}</p>
                        <p className={`mt-1 font-medium ${theme.text}`}>{item.secondaryValue}</p>
                      </div>
                      <div className="flex items-end justify-end">
                        <span className="text-xs text-muted-foreground">Tap for details</span>
                      </div>
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
          {filteredItems.length === 0 ? (
            <Card className="p-5 border-border/60">
              <p className="text-sm text-muted-foreground">No compliance items match the current filters.</p>
            </Card>
          ) : null}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-4">
          <Card className="p-5 border-border/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Expiring Certificates & Renewals</h3>
                <p className="text-sm text-muted-foreground">Sorted by nearest expiry so upcoming risks are visible first.</p>
              </div>
              <Badge variant="outline">{expiringCertificates.length} Items</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {expiringCertificates.map((item) => {
                const theme = toneClasses(item.statusLevel);
                return (
                  <button key={item.id} type="button" className="w-full text-left" onClick={() => setSelectedPanel({ kind: "item", item })}>
                    <div className={`rounded-xl border p-4 transition hover:shadow-sm ${theme.card}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{item.statusLabel}</p>
                        </div>
                        <Badge className={theme.badge}>{item.daysRemaining} Days Left</Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Expiry Date</span>
                        <span className="font-semibold">{item.expiryDate}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 border-border/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Inspection Readiness</h3>
                <p className="text-sm text-muted-foreground">Quick view of what is inspection-ready and what needs attention.</p>
              </div>
              <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Inspection Ready</Badge>
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-background p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Inspection Readiness</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">89%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Overall Status</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">Inspection Ready</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[89%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {inspectionChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                  <div className="flex items-center gap-2">
                    {item.done ? <CheckCircle2 className="size-4 text-emerald-600" /> : <CircleAlert className="size-4 text-amber-600" />}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <Badge className={item.done ? "bg-emerald-600 text-white hover:bg-emerald-600" : "bg-amber-600 text-white hover:bg-amber-600"}>
                    {item.done ? "Ready" : "Attention"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-4">
          <Card className="p-5 border-border/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Compliance Calendar</h3>
                <p className="text-sm text-muted-foreground">Upcoming compliance events in a simple timeline.</p>
              </div>
              <Badge variant="outline">Timeline</Badge>
            </div>
            <div className="mt-4 space-y-4">
              {complianceCalendar.map((event, index) => (
                <div key={event.title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-10 items-center justify-center rounded-full border border-border bg-slate-50 text-slate-700">
                      <Clock3 className="size-4" />
                    </div>
                    {index < complianceCalendar.length - 1 ? <div className="mt-2 h-full w-px bg-border" /> : null}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{event.date}</p>
                    <p className="mt-1 font-medium">{event.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 border-border/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Staff Compliance Overview</h3>
                <p className="text-sm text-muted-foreground">Staff verification and renewal status at a glance.</p>
              </div>
              <Badge variant="outline">Staff</Badge>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {staffOverview.map((item) => (
                <Card key={item.label} className="p-4 border-border/60">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5 border-border/60 bg-slate-50/40">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">Minimal actions for compliance oversight.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                Upload Document
              </Button>
              <Button size="sm" variant="outline">
                Generate Compliance Report
              </Button>
              <Button size="sm" variant="outline">
                View Compliance Calendar
              </Button>
            </div>
          </div>
        </Card>

      </div>

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
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Current Score</p>
                  <p className="mt-2 text-4xl font-semibold tracking-tight">92 / 100</p>
                  <Badge className="mt-3 bg-emerald-600 text-white hover:bg-emerald-600">Healthy</Badge>
                </div>
                <Card className="p-4 border-border/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">What the score means</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The score reflects how ready the school is for inspection, based on current certificate validity, submission
                    completeness, staff verification, and upcoming expiry risk.
                  </p>
                </Card>
                <Card className="p-4 border-border/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">How it is calculated</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Major certificates are weighted most heavily, followed by submission status and staff compliance. Healthy items
                    increase the score while upcoming expiries and missing documents reduce it.
                  </p>
                </Card>
                <Card className="p-4 border-border/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Why this score was assigned</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
                  <Badge className={toneClasses(selectedPanel.item.statusLevel).badge}>{selectedPanel.item.statusLevel}</Badge>
                  <Badge variant="outline">{selectedPanel.item.category}</Badge>
                  <Badge variant="outline">{selectedPanel.item.documentName}</Badge>
                </div>
                <Card className="p-4 border-border/60">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="mt-1 font-medium">{selectedPanel.item.statusLabel}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Issue Date</p>
                      <p className="mt-1 font-medium">{selectedPanel.item.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expiry Date</p>
                      <p className="mt-1 font-medium">{selectedPanel.item.expiryDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Days Remaining</p>
                      <p className="mt-1 font-medium">{selectedPanel.item.daysRemaining} Days</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 border-border/60">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Details</p>
                  <div className="mt-3 grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">{selectedPanel.item.primaryLabel}</p>
                      <p className="mt-1 font-medium">{selectedPanel.item.primaryValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{selectedPanel.item.secondaryLabel}</p>
                      <p className="mt-1 font-medium">{selectedPanel.item.secondaryValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="mt-1 leading-6 text-muted-foreground">{selectedPanel.item.notes}</p>
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
