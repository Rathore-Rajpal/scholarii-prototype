import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ScrollText,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  ChevronRight,
  Users,
  Phone,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import {
  LEAVE_BALANCES,
  LEAVE_REQUESTS,
  LEAVE_STATS,
  STUDENT_LEAVE_REQUESTS,
  STUDENT_LEAVE_STATS,
} from "@/lib/scholarii/teacher-leaves-mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/leaves")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <LeavesPage />
    </RoleGuard>
  ),
});

const PAGE_TABS = [
  { id: "students", label: "Student Leaves", icon: Users },
  { id: "my-leaves", label: "My Leaves", icon: ScrollText },
] as const;

type PageTabId = (typeof PAGE_TABS)[number]["id"];

const REQUEST_TABS = [
  { id: "all", label: "All", icon: ScrollText },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
  { id: "rejected", label: "Rejected", icon: XCircle },
] as const;

type RequestTabId = (typeof REQUEST_TABS)[number]["id"];

const STATUS_META: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
> = {
  approved: {
    label: "Approved",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600",
    bg: "bg-red-500/10",
    icon: XCircle,
  },
};

function LeavesPage() {
  const [pageTab, setPageTab] = useState<PageTabId>("students");

  return (
    <div>
      <PageHeader
        title="Leaves"
        subtitle="Manage student leave requests and track your own leave balance."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-brand-gradient text-white border-0">
                <Plus className="size-4 mr-1" />
                {pageTab === "students" ? "Record Leave" : "Apply Leave"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {pageTab === "students" ? "Record Student Leave" : "Apply for Leave"}
                </DialogTitle>
              </DialogHeader>
              {pageTab === "students" ? <RecordStudentLeaveForm /> : <ApplyLeaveForm />}
            </DialogContent>
          </Dialog>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        {pageTab === "students" ? (
          <>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center">
                  <Users className="size-5 text-violet-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Requests</div>
                  <div className="text-xl font-semibold">{STUDENT_LEAVE_STATS.totalRequests}</div>
                </div>
              </div>
            </Card>
            <Card className="p-5 border-2 border-amber-200/70 dark:border-amber-900/40">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-500/10 grid place-items-center">
                  <Clock className="size-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                  <div className="text-xl font-semibold">{STUDENT_LEAVE_STATS.pending}</div>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                  <div className="text-xl font-semibold">{STUDENT_LEAVE_STATS.approved}</div>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center">
                  <XCircle className="size-5 text-red-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Rejected</div>
                  <div className="text-xl font-semibold">{STUDENT_LEAVE_STATS.rejected}</div>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-sky-500/10 grid place-items-center">
                  <Calendar className="size-5 text-sky-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Today on Leave</div>
                  <div className="text-xl font-semibold">1</div>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center">
                  <ScrollText className="size-5 text-violet-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Balance</div>
                  <div className="text-xl font-semibold">{LEAVE_STATS.totalBalance} Days</div>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Used This Year</div>
                  <div className="text-xl font-semibold">{LEAVE_STATS.usedThisYear} Days</div>
                </div>
              </div>
            </Card>
            <Card className="p-5 border-2 border-amber-200/70 dark:border-amber-900/40">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-500/10 grid place-items-center">
                  <Clock className="size-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Pending Requests</div>
                  <div className="text-xl font-semibold">{LEAVE_STATS.pendingRequests}</div>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-sky-500/10 grid place-items-center">
                  <Calendar className="size-5 text-sky-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Upcoming Leaves</div>
                  <div className="text-xl font-semibold">{LEAVE_STATS.upcomingLeaves}</div>
                </div>
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center">
                  <AlertTriangle className="size-5 text-red-500" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Remaining</div>
                  <div className="text-xl font-semibold">{LEAVE_STATS.totalBalance - LEAVE_STATS.usedThisYear} Days</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Page Tabs */}
      <Card className="p-4 mb-6">
        <div className="flex gap-1">
          {PAGE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPageTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                pageTab === tab.id
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

      {pageTab === "students" ? <StudentLeavesTab /> : <MyLeavesTab />}
    </div>
  );
}

function StudentLeavesTab() {
  const [activeTab, setActiveTab] = useState<RequestTabId>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = STUDENT_LEAVE_REQUESTS;
    if (activeTab !== "all") {
      list = list.filter((r) => r.status === activeTab);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.leaveType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, search]);

  const selected = STUDENT_LEAVE_REQUESTS.find((r) => r.id === selectedId);

  return (
    <div>
      {/* Tabs + Search */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex gap-1 flex-1">
            {REQUEST_TABS.map((tab) => (
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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/40 border-0 h-9"
            />
          </div>
        </div>
      </Card>

      {/* Student Leave Requests */}
      <div className="space-y-3 pb-4">
        {filtered.map((req) => {
          const meta = STATUS_META[req.status];
          const StatusIcon = meta.icon;

          return (
            <button
              key={req.id}
              onClick={() => setSelectedId(req.id === selectedId ? null : req.id)}
              className={cn(
                "w-full rounded-2xl border p-5 text-left transition-all",
                selected?.id === req.id
                  ? "border-violet-500 bg-violet-500/5 shadow-sm ring-1 ring-violet-500/20"
                  : "border-border/60 hover:border-border hover:bg-muted/20"
              )}
            >
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-sky-500 text-white text-sm font-semibold">
                    {req.studentName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold">{req.studentName}</h3>
                    <Badge className={cn("border-0 text-[10px]", meta.bg, meta.color)}>
                      {meta.label}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {req.className} · Roll #{req.roll}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {format(parseISO(req.fromDate), "dd MMM")} – {format(parseISO(req.toDate), "dd MMM yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {req.days} day{req.days > 1 ? "s" : ""}
                    </span>
                    <span className="text-violet-600 font-medium">{req.leaveType}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.reason}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
              </div>

              {/* Expanded Details */}
              {selected?.id === req.id && (
                <div className="mt-4 border-t border-border/60 pt-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">Applied On</div>
                      <div className="text-sm font-medium">{format(parseISO(req.appliedOn), "dd MMM yyyy")}</div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">Parent</div>
                      <div className="text-sm font-medium">{req.parentName}</div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">Contact</div>
                      <div className="text-sm font-medium">{req.parentContact}</div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">Leave Type</div>
                      <div className="text-sm font-medium">{req.leaveType}</div>
                    </div>
                  </div>

                  {req.approvedBy && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Approved by {req.approvedBy}
                    </div>
                  )}

                  {req.remarks && (
                    <div className="rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Remarks:</span> {req.remarks}
                    </div>
                  )}

                  {/* Action Buttons for Pending */}
                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-500/10 text-emerald-600 border-0 hover:bg-emerald-500/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Leave approved for ${req.studentName}`);
                        }}
                      >
                        <CheckCircle2 className="size-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Leave rejected for ${req.studentName}`);
                        }}
                      >
                        <XCircle className="size-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Message sent to parent (demo)");
                        }}
                      >
                        <MessageSquare className="size-3 mr-1" />
                        Message Parent
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Calling parent (demo)");
                        }}
                      >
                        <Phone className="size-3 mr-1" />
                        Call Parent
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="size-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No student leave requests found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or tab filter</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function MyLeavesTab() {
  const [activeTab, setActiveTab] = useState<RequestTabId>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = LEAVE_REQUESTS;
    if (activeTab !== "all") {
      list = list.filter((r) => r.status === activeTab);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.leaveType.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, search]);

  const selected = LEAVE_REQUESTS.find((r) => r.id === selectedId);

  return (
    <div>
      {/* Leave Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {LEAVE_BALANCES.map((lb) => (
          <Card key={lb.type} className="p-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">{lb.type}</div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold">{lb.total - lb.used - lb.pending}</span>
                <span className="text-xs text-muted-foreground ml-1">available</span>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>{lb.used} used</div>
                {lb.pending > 0 && <div className="text-amber-600">{lb.pending} pending</div>}
              </div>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${((lb.used + lb.pending) / lb.total) * 100}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs + Search */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex gap-1 flex-1">
            {REQUEST_TABS.map((tab) => (
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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search leaves..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/40 border-0 h-9"
            />
          </div>
        </div>
      </Card>

      {/* Leave Requests */}
      <div className="space-y-3 pb-4">
        {filtered.map((req) => {
          const meta = STATUS_META[req.status];
          const StatusIcon = meta.icon;

          return (
            <button
              key={req.id}
              onClick={() => setSelectedId(req.id === selectedId ? null : req.id)}
              className={cn(
                "w-full rounded-2xl border p-5 text-left transition-all",
                selected?.id === req.id
                  ? "border-violet-500 bg-violet-500/5 shadow-sm ring-1 ring-violet-500/20"
                  : "border-border/60 hover:border-border hover:bg-muted/20"
              )}
            >
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className={cn("text-white text-sm font-semibold", meta.bg, meta.color)}>
                    <StatusIcon className="size-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold">{req.leaveType}</h3>
                    <Badge className={cn("border-0 text-[10px]", meta.bg, meta.color)}>
                      {meta.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {format(parseISO(req.fromDate), "dd MMM")} – {format(parseISO(req.toDate), "dd MMM yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {req.days} day{req.days > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.reason}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
              </div>

              {/* Expanded Details */}
              {selected?.id === req.id && (
                <div className="mt-4 border-t border-border/60 pt-4 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">Applied On</div>
                      <div className="text-sm font-medium">{format(parseISO(req.appliedOn), "dd MMM yyyy")}</div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">From</div>
                      <div className="text-sm font-medium">{format(parseISO(req.fromDate), "dd MMM yyyy")}</div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">To</div>
                      <div className="text-sm font-medium">{format(parseISO(req.toDate), "dd MMM yyyy")}</div>
                    </div>
                    <div className="rounded-xl bg-muted/30 p-3">
                      <div className="text-[10px] text-muted-foreground">Days</div>
                      <div className="text-sm font-medium">{req.days}</div>
                    </div>
                  </div>

                  {req.approvedBy && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      Approved by {req.approvedBy}
                    </div>
                  )}

                  {req.substitute && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="size-4">
                        <AvatarFallback className="text-[8px] bg-sky-500 text-white">S</AvatarFallback>
                      </Avatar>
                      Substitute: {req.substitute}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <ScrollText className="size-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No leave requests found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or tab filter</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function RecordStudentLeaveForm() {
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Student leave recorded (demo)");
      }}
    >
      <div className="space-y-1.5">
        <Label>Student</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select student" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s1">Aarav Sharma (Roll #1)</SelectItem>
            <SelectItem value="s4">Priya Patel (Roll #4)</SelectItem>
            <SelectItem value="s5">Rohan Gupta (Roll #5)</SelectItem>
            <SelectItem value="s6">Sneha Reddy (Roll #6)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Leave Type</Label>
        <Select defaultValue="medical">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="medical">Medical Leave</SelectItem>
            <SelectItem value="personal">Personal Leave</SelectItem>
            <SelectItem value="sick">Sick Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>From Date</Label>
          <Input type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label>To Date</Label>
          <Input type="date" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Reason</Label>
        <Textarea rows={3} required placeholder="Reason for leave..." />
      </div>
      <div className="space-y-1.5">
        <Label>Remarks (optional)</Label>
        <Textarea rows={2} placeholder="Any additional notes..." />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" className="bg-brand-gradient text-white border-0">
          Record Leave
        </Button>
      </div>
    </form>
  );
}

function ApplyLeaveForm() {
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Leave application submitted (demo)");
      }}
    >
      <div className="space-y-1.5">
        <Label>Leave Type</Label>
        <Select defaultValue="casual">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="casual">Casual Leave</SelectItem>
            <SelectItem value="sick">Sick Leave</SelectItem>
            <SelectItem value="earned">Earned Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>From Date</Label>
          <Input type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label>To Date</Label>
          <Input type="date" required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Reason</Label>
        <Textarea rows={3} required placeholder="Reason for leave..." />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" className="bg-brand-gradient text-white border-0">
          Submit
        </Button>
      </div>
    </form>
  );
}
