import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Calendar, CalendarDays, CheckCircle2, CircleAlert, ClipboardCheck, ClipboardList, FileText, LayoutDashboard, ShieldCheck, Upload } from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/compliance")({ component: AdminCompliancePage });

type Status = "Healthy" | "Warning" | "Critical";
type Item = { item: string; category: string; status: Status; dueDate: string; responsible: string; action: string };

const overviewItems: Item[] = [
  { item: "School Recognition/RTE", category: "Regulatory", status: "Healthy", dueDate: "12 Aug 2027", responsible: "Principal Office", action: "View" },
  { item: "UDISE+", category: "Government Submission", status: "Healthy", dueDate: "30 Sep 2026", responsible: "Admin Clerk", action: "Update" },
  { item: "Fire NOC", category: "Safety", status: "Warning", dueDate: "9 Jul 2026", responsible: "Facilities", action: "Upload Renewal" },
  { item: "Building Safety", category: "Infrastructure", status: "Healthy", dueDate: "15 Jul 2026", responsible: "Estate Office", action: "View" },
  { item: "Water & Sanitation", category: "Safety", status: "Warning", dueDate: "3 Jul 2026", responsible: "Admin Clerk", action: "Upload Renewal" },
  { item: "Board Affiliation", category: "Regulatory", status: "Healthy", dueDate: "31 Mar 2027", responsible: "Principal Office", action: "View" },
];

const complianceRows: Item[] = [
  ...overviewItems,
  { item: "Staff Police Verification", category: "Staff", status: "Healthy", dueDate: "30 Jul 2026", responsible: "HR Desk", action: "Review" },
  { item: "Teacher Qualification Records", category: "Staff", status: "Healthy", dueDate: "15 Aug 2026", responsible: "HR Desk", action: "Review" },
  { item: "Fee Register Audit", category: "Finance", status: "Healthy", dueDate: "30 Jun 2026", responsible: "Accounts", action: "Export" },
  { item: "Admission Register", category: "Records", status: "Healthy", dueDate: "30 Jun 2026", responsible: "Admissions", action: "Verify" },
  { item: "Transfer Certificate Register", category: "Records", status: "Healthy", dueDate: "30 Jun 2026", responsible: "Documents", action: "Verify" },
  { item: "Scholarship Records", category: "Government Submission", status: "Healthy", dueDate: "15 Jul 2026", responsible: "Admin Clerk", action: "Submit" },
  { item: "Midday Meal Declaration", category: "Government Submission", status: "Healthy", dueDate: "20 Jul 2026", responsible: "Admin Clerk", action: "Submit" },
  { item: "Health Checkup Register", category: "Safety", status: "Healthy", dueDate: "10 Aug 2026", responsible: "Nurse", action: "Review" },
  { item: "Transport Fitness Certificates", category: "Transport", status: "Warning", dueDate: "28 Jul 2026", responsible: "Transport", action: "Renew" },
  { item: "CCTV Maintenance Log", category: "Safety", status: "Healthy", dueDate: "5 Jul 2026", responsible: "Facilities", action: "View" },
  { item: "Lab Safety Register", category: "Safety", status: "Healthy", dueDate: "25 Jul 2026", responsible: "Lab Assistant", action: "Review" },
  { item: "PF/ESIC Staff Compliance", category: "Staff", status: "Healthy", dueDate: "31 Jul 2026", responsible: "Accounts", action: "Review" },
];

const inspection = [
  ["School Recognition/RTE", true],
  ["UDISE+ submission proof", true],
  ["Fire NOC renewal file", false],
  ["Building safety certificate", true],
  ["Water testing certificate", false],
  ["Staff verification records", true],
  ["Admission and TC registers", true],
  ["Fee register audit", true],
] as const;

const calendar = [
  ["3 Jul 2026", "Water Certificate Renewal", "Renew water testing and sanitation certificate."],
  ["9 Jul 2026", "Fire NOC Expiry", "Upload fire safety renewal before expiry."],
  ["28 Jul 2026", "Transport Fitness Review", "Check vehicle fitness certificate status."],
  ["15 Aug 2026", "Mid-year Inspection", "Prepare inspection document bundle."],
];

const statusTone: Record<Status, string> = {
  Healthy: "bg-emerald-500/10 text-emerald-600 border-0",
  Warning: "bg-amber-500/10 text-amber-600 border-0",
  Critical: "bg-red-500/10 text-red-600 border-0",
};

function AdminCompliancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <PageHeader
        title="Compliance & Regulatory"
        subtitle="Maharashtra school compliance tracking and document management"
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="gap-1.5 bg-violet-600 hover:bg-violet-700"><Upload className="size-3" /> Upload Document</Button>
            <Button size="sm" variant="outline" className="gap-1.5"><FileText className="size-3" /> Generate Report</Button>
            <Button size="sm" variant="outline" className="gap-1.5"><CalendarDays className="size-3" /> Calendar</Button>
          </div>
        }
      />

      <div className="mb-8 kpi-mobile-scroll grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Compliance Score" value="92/100" hint="Healthy" icon={ShieldCheck} tone="emerald" />
        <Kpi label="Total Items" value="18" hint="Tracked" icon={ClipboardList} tone="sky" />
        <Kpi label="Need Attention" value="2" hint="Within 30 days" icon={AlertTriangle} tone="amber" />
        <Kpi label="Critical" value="0" hint="No blockers" icon={CheckCircle2} tone="emerald" />
        <Kpi label="Pending Submissions" value="1" hint="Government cycle" icon={FileText} tone="violet" />
        <Kpi label="Inspection Ready" value="89%" hint="High readiness" icon={ClipboardCheck} tone="sky" />
      </div>

      <Card className="mb-8 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500"><ShieldCheck className="size-5" /></div>
              <div>
                <p className="text-xs font-semibold">Compliance Score</p>
                <p className="text-3xl font-semibold">92/100</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge className="border-0 bg-emerald-500/10 text-emerald-600">Healthy</Badge>
              <Badge variant="outline">Inspection-focused</Badge>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">The school is inspection-ready with two renewal items requiring attention within the next 30 days and no critical compliance blockers.</p>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="mb-8 p-4">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="overview" className="gap-2 px-5"><LayoutDashboard className="size-4" /> Overview</TabsTrigger>
            <TabsTrigger value="items" className="gap-2 px-5"><ClipboardList className="size-4" /> Compliance Items</TabsTrigger>
            <TabsTrigger value="expiring" className="gap-2 px-5"><AlertTriangle className="size-4" /> Expiring Certificates</TabsTrigger>
            <TabsTrigger value="inspection" className="gap-2 px-5"><ClipboardCheck className="size-4" /> Inspection Readiness</TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2 px-5"><Calendar className="size-4" /> Calendar</TabsTrigger>
          </TabsList>
        </Card>

        {activeTab === "overview" ? (
          <Card className="p-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {overviewItems.map((item) => <ComplianceCard key={item.item} item={item} />)}
            </div>
          </Card>
        ) : null}

        {activeTab === "items" ? (
          <Card className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/60">
                    {["Item", "Category", "Status", "Due Date", "Responsible", "Action"].map((head) => <th key={head} className="p-2 text-left text-[10px] font-medium text-muted-foreground">{head}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {complianceRows.map((row) => (
                    <tr key={row.item} className="border-b border-border/30">
                      <td className="p-2 font-medium">{row.item}</td>
                      <td className="p-2 text-muted-foreground">{row.category}</td>
                      <td className="p-2"><Badge className={cn("text-[10px]", statusTone[row.status])}>{row.status}</Badge></td>
                      <td className="p-2 text-muted-foreground">{row.dueDate}</td>
                      <td className="p-2 text-muted-foreground">{row.responsible}</td>
                      <td className="p-2"><Button variant="ghost" size="sm" className="h-7 text-xs">{row.action}</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : null}

        {activeTab === "expiring" ? (
          <Card className="p-5">
            <div className="space-y-3">
              {[
                ["Fire NOC", "Expires 9 Jul 2026", "24 days"],
                ["Water Certificate", "Expires 3 Jul 2026", "18 days"],
              ].map(([name, expiry, days]) => (
                <div key={name} className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">{expiry} | {days}</p>
                  </div>
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">Upload Renewal</Button>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === "inspection" ? (
          <Card className="p-5">
            <div className="mb-4 rounded-xl border border-border/60 p-4">
              <p className="text-[11px] text-muted-foreground">Inspection Readiness</p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-2xl font-semibold">89%</p>
                <Badge className="border-0 bg-emerald-500/10 text-emerald-600">Inspection Ready</Badge>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[89%] rounded-full bg-emerald-500" /></div>
            </div>
            <div className="space-y-2">
              {inspection.map(([label, done]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                  <div className="flex items-center gap-2">{done ? <CheckCircle2 className="size-3.5 text-emerald-500" /> : <CircleAlert className="size-3.5 text-amber-500" />}<span className="text-xs font-medium">{label}</span></div>
                  <Badge className={cn("border-0 text-[10px]", done ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>{done ? "Ready" : "Attention"}</Badge>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === "calendar" ? (
          <Card className="p-5">
            <div className="space-y-4">
              {calendar.map(([date, title, detail], index) => (
                <div key={title} className="flex gap-3">
                  <div className="flex flex-col items-center"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-500"><CalendarDays className="size-4" /></div>{index < calendar.length - 1 ? <div className="mt-2 h-full w-px bg-border" /> : null}</div>
                  <div className="pb-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{date}</p><p className="mt-1 text-xs font-semibold">{title}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{detail}</p></div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </Tabs>

      <Card className="mt-8 p-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">Upload Document</Button>
          <Button variant="outline">Generate Compliance Report</Button>
          <Button variant="outline">View Compliance Calendar</Button>
        </div>
      </Card>
    </div>
  );
}

function ComplianceCard({ item }: { item: Item }) {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-[11px] text-muted-foreground">{item.category}</p><p className="mt-1 text-xs font-semibold">{item.item}</p></div>
        <Badge className={cn("text-[10px]", statusTone[item.status])}>{item.status}</Badge>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">Due: {item.dueDate}</p>
      {item.status === "Warning" ? <p className="mt-1 text-[11px] font-medium text-amber-600">{item.item.includes("Fire") ? "24 days" : "18 days"}</p> : null}
    </div>
  );
}

function Kpi({ label, value, hint, icon: Icon, tone }: { label: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }>; tone: "emerald" | "sky" | "amber" | "violet" }) {
  const tones = {
    emerald: "bg-emerald-500/10 text-emerald-500",
    sky: "bg-sky-500/10 text-sky-500",
    amber: "bg-amber-500/10 text-amber-500",
    violet: "bg-violet-500/10 text-violet-500",
  };
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-3"><div className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}><Icon className="size-5" /></div><div><p className="text-[11px] text-muted-foreground">{label}</p><p className="text-lg font-semibold">{value}</p></div></div>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </Card>
  );
}
