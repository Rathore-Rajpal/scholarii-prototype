import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FilePlus, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/app/admissions")({ component: AdmissionsPage });

type Application = {
  id: string;
  student: string;
  parent: string;
  classApplied: string;
  appliedAt: string;
  status: "New" | "Documents Pending" | "Under Review" | "Approved" | "Rejected" | "Enrolled";
  docsSubmitted: number;
  docsRequired: number;
  notes?: string;
};

const STATUSES: Application["status"][] = ["New", "Documents Pending", "Under Review", "Approved", "Rejected", "Enrolled"];

function makeMockApplications(): Application[] {
  const classes = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];
  const names = ["Aarav Singh", "Maya Rao", "Ishaan Patel", "Diya Sharma", "Rohan Verma", "Kavya Nair", "Saanvi Gupta", "Aditya Joshi", "Priya Menon", "Ananya Iyer", "Kabir Khan", "Rhea Kapoor", "Neil D'Souza", "Sara Thomas", "Vivaan Mehta", "Ila Bhatia", "Om Prakash", "Neelam S"].map((n, i) => `${n}`);
  const apps: Application[] = [];
  for (let i = 0; i < 22; i++) {
    const student = names[i % names.length];
    const parent = `Parent of ${student.split(" ")[0]}`;
    const classApplied = classes[i % classes.length];
    const status = STATUSES[(i * 3) % STATUSES.length];
    const appliedAt = new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString().slice(0, 10);
    const docsRequired = 4;
    const docsSubmitted = Math.max(0, docsRequired - (i % 5));
    apps.push({ id: `APP-${2100 + i}`, student, parent, classApplied, appliedAt, status, docsSubmitted, docsRequired, notes: i % 7 === 0 ? "Follow up call requested" : undefined });
  }
  return apps;
}

function AdmissionsPage() {
  const applications = useMemo(() => makeMockApplications(), []);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedCapacityClass, setSelectedCapacityClass] = useState<string>("Grade 1");

  const totals = useMemo(() => {
    const inquiries = 542;
    const submitted = applications.filter((a) => a.status !== "New").length + 95; // realistic-looking
    const confirmed = applications.filter((a) => a.status === "Enrolled" || a.status === "Approved").length || 218;
    const conversion = Math.round((confirmed / Math.max(1, submitted)) * 100);
    const pending = applications.filter((a) => a.status === "Documents Pending" || a.status === "Under Review").length || 12;
    const seats = 18;
    return { inquiries, submitted, confirmed, conversion, pending, seats };
  }, [applications]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      if (q && !(a.student.toLowerCase().includes(q) || a.parent.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (classFilter !== "all" && a.classApplied !== classFilter) return false;
      return true;
    }).slice(0, 10);
  }, [applications, query, statusFilter, classFilter]);

  const classesOverview = useMemo(() => {
    return [
      { name: "Grade 1", filled: 116, total: 120 },
      { name: "Grade 2", filled: 98, total: 120 },
      { name: "Grade 3", filled: 120, total: 120 },
      { name: "Grade 4", filled: 86, total: 120 },
      { name: "Grade 5", filled: 103, total: 120 },
    ];
  }, []);



  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setClassFilter("all");
  };

  return (
    <div>
      <PageHeader
        title="Admissions & Enrollment"
        subtitle="Admissions centre — pipeline, capacity, and quick approvals."
        action={
          <div className="flex flex-col sm:flex-row gap-2">
             <Button size="sm" className="bg-brand-gradient text-white border-0 w-full sm:w-auto"><FilePlus className="mr-2" />New Admission</Button>
             <Button size="sm" variant="outline" className="w-full sm:w-auto"><FileText className="mr-2" />Import Applications</Button>
             <Button size="sm" variant="outline" className="w-full sm:w-auto"><Download className="mr-2" />Export Report</Button>
           </div>
        }
      />

      <div className="space-y-6">
        {/* KPIs */}
        <div className="kpi-mobile-scroll grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-3 sm:p-4">
             <p className="text-xs text-muted-foreground">Total Inquiries</p>
            <div className="text-2xl font-bold mt-2">{totals.inquiries.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">+12% this month</div>
          </Card>
           <Card className="p-3 sm:p-4">
             <p className="text-xs text-muted-foreground">Applications Submitted</p>
            <div className="text-2xl font-bold mt-2">{totals.submitted}</div>
          </Card>
           <Card className="p-3 sm:p-4">
             <p className="text-xs text-muted-foreground">Admissions Confirmed</p>
            <div className="text-2xl font-bold mt-2">{totals.confirmed}</div>
          </Card>
           <Card className="p-3 sm:p-4">
             <p className="text-xs text-muted-foreground">Conversion Rate</p>
            <div className="text-2xl font-bold mt-2">{totals.conversion}%</div>
          </Card>
           <Card className="p-3 sm:p-4">
             <p className="text-xs text-muted-foreground">Pending Approvals</p>
            <div className="text-2xl font-bold mt-2">{totals.pending}</div>
            <Badge variant="destructive" className="mt-2">Warning</Badge>
          </Card>
           <Card className="p-3 sm:p-4">
             <p className="text-xs text-muted-foreground">Seats Remaining</p>
            <div className="text-2xl font-bold mt-2">{totals.seats}</div>
          </Card>
        </div>

        {/* Recent Applications */}
        <div className="space-y-3">
          <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                   <h3 className="text-base sm:text-lg font-semibold">Recent Applications</h3>
                  <p className="text-sm text-muted-foreground">Latest 10 applications — click to view details.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                     <Input className="pl-9" placeholder="Search student, parent, application..." value={query} onChange={(e) => setQuery(e.target.value)} />
                   </div>
                   <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                     <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All statuses</SelectItem>
                       {STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                     </SelectContent>
                   </Select>
                   <Select value={classFilter} onValueChange={(v) => setClassFilter(v)}>
                     <SelectTrigger className="w-40"><SelectValue placeholder="Class" /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="all">All classes</SelectItem>
                       {Array.from(new Set(applications.map((a) => a.classApplied))).map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                     </SelectContent>
                   </Select>
                   <Button size="sm" variant="outline" onClick={clearFilters}>Clear</Button>
                 </div>
              </div>

              <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Class Applied</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={a.id} className="cursor-pointer" onClick={() => setSelectedApp(a)}>
                      <TableCell>{a.student}</TableCell>
                      <TableCell>{a.parent}</TableCell>
                      <TableCell>{a.classApplied}</TableCell>
                      <TableCell className="font-mono text-sm">{a.appliedAt}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === "Approved" || a.status === "Enrolled" ? "secondary" : a.status === "Rejected" ? "destructive" : a.status === "Documents Pending" ? "warning" : "outline"}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{a.docsSubmitted}/{a.docsRequired}</TableCell>
                      <TableCell><Button size="sm" variant="ghost">View</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-border text-sm">
                <div className="text-muted-foreground">Showing {filtered.length} of {applications.length} recent applications</div>
                <div>
                  <Button size="sm" variant="outline">View All</Button>
                </div>
              </div>
            </Card>
          </div>

        {/* Class Capacity Overview */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold">Class Capacity Overview</h3>
            <Select value={selectedCapacityClass} onValueChange={setSelectedCapacityClass}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Select Class" /></SelectTrigger>
              <SelectContent>
                {classesOverview.map((c) => (
                  <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {classesOverview.filter((c) => c.name === selectedCapacityClass).map((c) => {
            const pct = Math.round((c.filled / c.total) * 100);
            const seatsLeft = c.total - c.filled;
            return (
              <div key={c.name} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
                     <p className="text-xs text-muted-foreground">Filled Seats</p>
                     <p className="text-3xl font-bold text-blue-600 mt-2">{c.filled}</p>
                   </Card>
                   <Card className="p-3 sm:p-4 bg-emerald-50 border-emerald-200">
                     <p className="text-xs text-muted-foreground">Total Seats</p>
                     <p className="text-3xl font-bold text-emerald-600 mt-2">{c.total}</p>
                   </Card>
                   <Card className="p-3 sm:p-4 bg-amber-50 border-amber-200">
                     <p className="text-xs text-muted-foreground">Seats Available</p>
                     <p className="text-3xl font-bold text-amber-600 mt-2">{seatsLeft}</p>
                   </Card>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Capacity Status</span>
                    <span className="text-sm font-semibold text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className="h-3 bg-gradient-to-r from-blue-500 to-emerald-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <Sheet open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <SheetContent side="right" className="w-[480px]">
          {selectedApp && (
            <div className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>Application Details</SheetTitle>
              </SheetHeader>
              <ScrollArea className="p-4">
                <Card className="p-4 mb-3">
                  <div className="font-semibold text-lg">{selectedApp.student}</div>
                  <div className="text-xs text-muted-foreground">{selectedApp.id} • Applied for {selectedApp.classApplied}</div>
                </Card>

                <Card className="p-4 mb-3">
                  <div className="text-sm font-semibold">Student Information</div>
                  <div className="mt-2 text-sm text-muted-foreground">Name: {selectedApp.student}</div>
                  <div className="text-sm text-muted-foreground">Applied: {selectedApp.appliedAt}</div>
                </Card>

                <Card className="p-4 mb-3">
                  <div className="text-sm font-semibold">Parent Information</div>
                  <div className="mt-2 text-sm text-muted-foreground">Name: {selectedApp.parent}</div>
                </Card>

                <Card className="p-4 mb-3">
                  <div className="text-sm font-semibold">Documents</div>
                  <div className="mt-2 text-sm text-muted-foreground">Submitted: {selectedApp.docsSubmitted} / {selectedApp.docsRequired}</div>
                </Card>

                <Card className="p-4 mb-3">
                  <div className="text-sm font-semibold">Notes</div>
                  <div className="mt-2 text-sm text-muted-foreground">{selectedApp.notes ?? "-"}</div>
                </Card>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => {/* mock approve */}}>Approve</Button>
                  <Button variant="outline" className="flex-1" onClick={() => {/* mock reject */}}>Reject</Button>
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
