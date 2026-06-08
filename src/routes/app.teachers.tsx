import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  FileText,
  Download,
  UserPlus,
  LayoutGrid,
  List,
  Star,
} from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";

export const Route = createFileRoute("/app/teachers")({ component: TeachersPage });

const TABLE_PAGE_SIZE = 10;
const CARD_PAGE_SIZE = 12;

const workloadLevels = ["all", "Normal", "High", "Overloaded"] as const;
const availabilityLevels = ["all", "Available", "Teaching", "Absent", "On Leave", "Late"] as const;
const attendanceLevels = ["all", "Above 95%", "90-95%", "Below 90%"] as const;
const performanceLevels = ["all", "4+", "3-4", "Below 3"] as const;

type WorkloadLevel = (typeof workloadLevels)[number];
type AvailabilityLevel = (typeof availabilityLevels)[number];
type AttendanceLevel = (typeof attendanceLevels)[number];
type PerformanceLevel = (typeof performanceLevels)[number];

type DerivedTeacher = {
  id: string;
  name: string;
  subject: string;
  department: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Late";
  roleType: "Teaching" | "Non-Teaching";
  avatarColor: string;
  rating: number;
  classes: string[];
  employeeId: string;
  attendancePct: number;
  workloadScore: number;
  workloadLevel: "Normal" | "High" | "Overloaded";
  availability: "Available" | "Teaching" | "Absent" | "On Leave" | "Late";
  periodsAssigned: number[];
  freePeriods: number[];
  currentStatus: string;
  designation: string;
  experience: string;
  pendingTasks: number;
  salaryAmount: number;
  salaryMethod: "Bank Transfer" | "Cash" | "UPI";
  salaryStatus: "Paid" | "Pending" | "On Hold";
};

const departments = ["Mathematics", "Science", "Languages", "Social Studies", "Sports", "Administration"];

function TeachersPage() {
  const data = useMemo(() => loadData(), []);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [subject, setSubject] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceLevel>("all");
  const [employmentStatus, setEmploymentStatus] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState<PerformanceLevel>("all");
  const [workloadFilter, setWorkloadFilter] = useState<WorkloadLevel>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityLevel>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [page, setPage] = useState(1);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [leavePanelOpen, setLeavePanelOpen] = useState(false);

  const derivedTeachers = useMemo<DerivedTeacher[]>(() => {
    return data.teachers.map((teacher, index) => {
      const attendancePct = 88 + ((index * 7) % 12);
      const workloadScore = 60 + ((index * 5) % 35);
      const workloadLevel = workloadScore >= 85 ? "Overloaded" : workloadScore >= 75 ? "High" : "Normal";
      const department = teacher.department ?? departments[index % departments.length];
      const roleType = department === "Administration" ? "Non-Teaching" : "Teaching";
      const availability = teacher.status === "On Leave"
        ? "On Leave"
        : teacher.status === "Late"
        ? "Late"
        : index % 4 === 0
        ? "Available"
        : "Teaching";
      const periodsAssigned = [1, 2, 4, 6].filter((p) => (index + p) % 3 !== 0);
      const freePeriods = [1, 2, 3, 4, 5, 6, 7, 8].filter((p) => !periodsAssigned.includes(p));
      const currentStatus = availability === "Teaching"
        ? `Teaching ${teacher.classes[0] ?? "Class"}`
        : availability === "Available"
        ? "Available now"
        : availability === "Late"
        ? "Late arrival"
        : "On leave";

      return {
        id: teacher.id,
        name: teacher.name,
        subject: teacher.subject,
        department,
        email: teacher.email,
        phone: teacher.phone,
        status: teacher.status,
        roleType,
        avatarColor: teacher.avatarColor,
        rating: teacher.rating,
        classes: teacher.classes,
        employeeId: `EMP-${String(2100 + index)}`,
        attendancePct,
        workloadScore,
        workloadLevel,
        availability,
        periodsAssigned,
        freePeriods,
        currentStatus,
        designation: index % 5 === 0 ? "Senior Teacher" : "Subject Teacher",
        experience: `${4 + (index % 12)} yrs`,
        pendingTasks: Math.max(0, (index * 2) % 8),
        salaryAmount: 28000 + (index % 8) * 2500,
        salaryMethod: index % 3 === 0 ? "UPI" : index % 3 === 1 ? "Bank Transfer" : "Cash",
        salaryStatus: index % 6 === 0 ? "On Hold" : index % 4 === 0 ? "Pending" : "Paid",
      };
    });
  }, [data.teachers]);

  const filteredTeachers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return derivedTeachers.filter((teacher) => {
      if (q) {
        const matches =
          teacher.name.toLowerCase().includes(q) ||
          teacher.employeeId.toLowerCase().includes(q) ||
          teacher.department.toLowerCase().includes(q) ||
          teacher.subject.toLowerCase().includes(q) ||
          teacher.phone.toLowerCase().includes(q) ||
          teacher.email.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (department !== "all" && teacher.department !== department) return false;
      if (subject !== "all" && teacher.subject !== subject) return false;
      if (employmentStatus !== "all" && teacher.status !== employmentStatus) return false;
      if (workloadFilter !== "all" && teacher.workloadLevel !== workloadFilter) return false;
      if (availabilityFilter !== "all" && teacher.availability !== availabilityFilter) return false;
      if (attendanceFilter !== "all") {
        if (attendanceFilter === "Above 95%" && teacher.attendancePct < 95) return false;
        if (attendanceFilter === "90-95%" && (teacher.attendancePct < 90 || teacher.attendancePct >= 95)) return false;
        if (attendanceFilter === "Below 90%" && teacher.attendancePct >= 90) return false;
      }
      if (performanceFilter !== "all") {
        if (performanceFilter === "4+" && teacher.rating < 4) return false;
        if (performanceFilter === "3-4" && (teacher.rating < 3 || teacher.rating >= 4)) return false;
        if (performanceFilter === "Below 3" && teacher.rating >= 3) return false;
      }
      return true;
    });
  }, [
    derivedTeachers,
    query,
    department,
    subject,
    employmentStatus,
    workloadFilter,
    availabilityFilter,
    attendanceFilter,
    performanceFilter,
  ]);

  const pageSize = viewMode === "table" ? TABLE_PAGE_SIZE : CARD_PAGE_SIZE;
  const pages = Math.max(1, Math.ceil(filteredTeachers.length / pageSize));
  const rows = filteredTeachers.slice((page - 1) * pageSize, page * pageSize);
  const selectedTeacher = derivedTeachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;

  const totalStaff = derivedTeachers.length + 10;
  const totalTeachers = derivedTeachers.length;
  const presentToday = derivedTeachers.filter((teacher) => teacher.status === "Active").length;
  const onLeave = derivedTeachers.filter((teacher) => teacher.status === "On Leave").length;
  const lateArrivals = derivedTeachers.filter((teacher) => teacher.status === "Late").length;
  const halfDayLeave = Math.max(1, Math.min(3, Math.round(totalTeachers * 0.1)));
  const currentlyTeaching = derivedTeachers.filter((teacher) => teacher.availability === "Teaching").length;
  const currentlyFree = derivedTeachers.filter((teacher) => teacher.availability === "Available").length;
  const overloaded = derivedTeachers.filter((teacher) => teacher.workloadLevel === "Overloaded").length;
  const pendingSubstitutions = 2;

  const pieSegments = [
    { label: "Teaching", value: currentlyTeaching, color: "#22c55e" },
    { label: "Available", value: currentlyFree, color: "#38bdf8" },
    { label: "On Leave", value: onLeave, color: "#f59e0b" },
    { label: "Half Day", value: halfDayLeave, color: "#f97316" },
  ];

  const totalPie = pieSegments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const pieBackground = pieSegments.reduce((background, segment, index) => {
    const start = pieSegments.slice(0, index).reduce((sum, s) => sum + s.value, 0);
    const end = start + segment.value;
    const startPct = (start / totalPie) * 100;
    const endPct = (end / totalPie) * 100;
    const slice = `${segment.color} ${startPct}% ${endPct}%`;
    return background ? `${background}, ${slice}` : slice;
  }, "");

  const departmentOverview = departments.map((dept, index) => ({
    name: dept,
    total: 8 + (index % 4),
    present: 7 + (index % 3),
    absent: index % 2 === 0 ? 1 : 0,
    performance: 82 + index * 3,
    workload: index % 2 === 0 ? "High" : "Normal",
  }));

  const departmentMixColors = ["#22c55e", "#38bdf8", "#f59e0b", "#a855f7", "#f97316", "#ef4444"];
  const departmentMixSegments = departmentOverview.map((dept, index) => ({
    label: dept.name,
    value: dept.total,
    color: departmentMixColors[index % departmentMixColors.length],
  }));
  const departmentMixTotal = departmentMixSegments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const departmentMixBackground = departmentMixSegments.reduce((background, segment, index) => {
    const start = departmentMixSegments.slice(0, index).reduce((sum, s) => sum + s.value, 0);
    const end = start + segment.value;
    const startPct = (start / departmentMixTotal) * 100;
    const endPct = (end / departmentMixTotal) * 100;
    const slice = `${segment.color} ${startPct}% ${endPct}%`;
    return background ? `${background}, ${slice}` : slice;
  }, "");

  const availabilityNow = derivedTeachers
    .filter((teacher) => teacher.availability === "Available")
    .slice(0, 5)
    .map((teacher) => ({
      name: teacher.name,
      department: teacher.department,
      freeUntil: "Period 5",
    }));

  const substituteAssignments = [
    { absent: "Mrs Sharma", className: "Class 8A", period: "Period 4", substitute: "Mr Khan", status: "Assigned" },
    { absent: "Mr Verma", className: "Class 10B", period: "Period 5", substitute: "Not Assigned", status: "Critical" },
  ];

  const leaveRequests = [
    {
      name: "Mrs Sharma",
      range: "2026-06-04 to 2026-06-06",
      type: "Medical",
      reason: "Surgery follow-up appointment",
      status: "Pending",
    },
    {
      name: "Mr Verma",
      range: "2026-06-02",
      type: "Personal",
      reason: "Family event",
      status: "Pending",
    },
    {
      name: "Ms Rao",
      range: "2026-06-10 to 2026-06-11",
      type: "Training",
      reason: "Subject workshop",
      status: "Pending",
    },
  ];


  const clearFilters = () => {
    setQuery("");
    setDepartment("all");
    setSubject("all");
    setAttendanceFilter("all");
    setEmploymentStatus("all");
    setPerformanceFilter("all");
    setWorkloadFilter("all");
    setAvailabilityFilter("all");
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title="Staff Management & Workforce Intelligence"
        subtitle="Operational visibility for staffing, workload, and coverage in one command center."
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-brand-gradient text-white border-0"><UserPlus className="size-4 mr-1" />Add Staff</Button>
            <Button variant="outline" size="sm" onClick={() => setLeavePanelOpen(true)}>
              <ClipboardCheck className="size-4 mr-1" />Leaves
            </Button>
            <Button variant="outline" size="sm"><FileText className="size-4 mr-1" />Generate Staff Report</Button>
            <Button variant="outline" size="sm"><Download className="size-4 mr-1" />Export Data</Button>
            <Button variant="outline" size="sm"><Briefcase className="size-4 mr-1" />Schedule Meeting</Button>
          </div>
        }
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Total Staff</p>
            <div className="text-2xl font-bold mt-2">{totalStaff} Staff Members</div>
            <p className="text-xs text-muted-foreground mt-1">{totalTeachers} Teachers â€¢ 10 Admin</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Present Today</p>
            <div className="text-2xl font-bold mt-2">{presentToday} Present</div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((presentToday / totalTeachers) * 100)}%</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">On Leave</p>
            <div className="text-2xl font-bold mt-2">{onLeave} Teachers</div>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Half Day Leave</p>
            <div className="text-2xl font-bold mt-2">{halfDayLeave} Staff</div>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Currently Teaching</p>
            <div className="text-2xl font-bold mt-2">{currentlyTeaching} Active</div>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Currently Free</p>
            <div className="text-2xl font-bold mt-2">{currentlyFree} Available</div>
          </Card>
          <Card className="p-4 border-2 border-amber-200/70 dark:border-amber-900/40">
            <p className="text-xs text-muted-foreground">Overloaded Teachers</p>
            <div className="text-2xl font-bold mt-2">{overloaded} Teachers</div>
            <Badge variant="outline" className="mt-2">Warning</Badge>
          </Card>
          <Card className="p-4 border-2 border-red-200/70 dark:border-red-900/40">
            <p className="text-xs text-muted-foreground">Pending Substitutions</p>
            <div className="text-2xl font-bold mt-2">{pendingSubstitutions} Unassigned</div>
            <Badge variant="destructive" className="mt-2">Critical</Badge>
          </Card>
        </div>

        <Tabs defaultValue="workforce" className="space-y-4">
          <Card className="p-3 border-border/60 bg-white/70 backdrop-blur-xl shadow-sm">
            <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
              <TabsTrigger
                value="workforce"
                className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md data-[state=active]:border-emerald-500/70 data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80 data-[state=active]:text-foreground data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)] data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60 hover:border-emerald-300 hover:bg-white/80 hover:text-foreground"
              >
                Workforce Intelligence
              </TabsTrigger>
              <TabsTrigger
                value="directory"
                className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md data-[state=active]:border-emerald-500/70 data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80 data-[state=active]:text-foreground data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)] data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60 hover:border-emerald-300 hover:bg-white/80 hover:text-foreground"
              >
                Staff Directory
              </TabsTrigger>
              <TabsTrigger
                value="department"
                className="rounded-full border border-border/70 bg-white/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 backdrop-blur-md data-[state=active]:border-emerald-500/70 data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-50/90 data-[state=active]:to-white/80 data-[state=active]:text-foreground data-[state=active]:shadow-[0_10px_30px_rgba(16,185,129,0.18)] data-[state=active]:ring-1 data-[state=active]:ring-emerald-200/60 hover:border-emerald-300 hover:bg-white/80 hover:text-foreground"
              >
                Department Overview
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="workforce" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Workforce Intelligence</h3>
                <p className="text-sm text-muted-foreground">Immediate staffing issues requiring attention.</p>
              </div>
              <Badge variant="secondary">Live alerts</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Teacher Absence Alert</p>
                <p className="text-xl font-bold mt-2">{onLeave + lateArrivals} teachers</p>
                <p className="text-xs text-muted-foreground">Absent or late today</p>
                <Button size="sm" variant="outline" onClick={() => setEmploymentStatus("On Leave")}>View Details</Button>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Workload Alert</p>
                <p className="text-xl font-bold mt-2">{overloaded} teachers</p>
                <p className="text-xs text-muted-foreground">No free periods</p>
                <Button size="sm" variant="outline" onClick={() => setWorkloadFilter("Overloaded")}>View Details</Button>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Substitute Alert</p>
                <p className="text-xl font-bold mt-2">{pendingSubstitutions} classes</p>
                <p className="text-xs text-muted-foreground">Need substitutes</p>
                <Button size="sm" variant="outline">View Details</Button>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Department Alert</p>
                <p className="text-xl font-bold mt-2">Science Dept</p>
                <p className="text-xs text-muted-foreground">70% capacity</p>
                <Button size="sm" variant="outline" onClick={() => setDepartment("Science")}>View Details</Button>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Leave Alert</p>
                <p className="text-xl font-bold mt-2">3 requests</p>
                <p className="text-xs text-muted-foreground">Pending approval</p>
                <Button size="sm" variant="outline">View Details</Button>
              </Card>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Live Staff Mix</p>
                <div className="text-3xl font-bold mt-2">{totalTeachers}</div>
                <p className="text-sm text-muted-foreground">Teachers today</p>
              </div>
              <div
                className="size-20 rounded-full"
                style={{ background: `conic-gradient(${pieBackground})` }}
                aria-label="Staff availability pie chart"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              {pieSegments.map((segment) => (
                <div key={segment.label} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span>{segment.label}: {segment.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

          </TabsContent>

          <TabsContent value="directory" className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Staff Directory</h3>
              <p className="text-sm text-muted-foreground">Search, filter, and open staff profiles.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === "table" ? "secondary" : "outline"}
                onClick={() => setViewMode("table")}
              >
                <List className="size-4 mr-1" />Table
              </Button>
              <Button
                size="sm"
                variant={viewMode === "card" ? "secondary" : "outline"}
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="size-4 mr-1" />Cards
              </Button>
              <Button size="sm" variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          </div>

          <Card className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search name, employee ID, department, subject, phone, email..."
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setPage(1); }}
                />
              </div>
              <Select value={department} onValueChange={(value) => { setDepartment(value); setPage(1); }}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={subject} onValueChange={(value) => { setSubject(value); setPage(1); }}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {Array.from(new Set(derivedTeachers.map((teacher) => teacher.subject))).map((value) => (
                    <SelectItem key={value} value={value}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={employmentStatus} onValueChange={(value) => { setEmploymentStatus(value); setPage(1); }}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Attendance Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                </SelectContent>
              </Select>
              <Select value={attendanceFilter} onValueChange={(value: AttendanceLevel) => { setAttendanceFilter(value); setPage(1); }}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Attendance %" /></SelectTrigger>
                <SelectContent>
                  {attendanceLevels.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value === "all" ? "All attendance" : value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={performanceFilter} onValueChange={(value: PerformanceLevel) => { setPerformanceFilter(value); setPage(1); }}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Performance" /></SelectTrigger>
                <SelectContent>
                  {performanceLevels.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value === "all" ? "All ratings" : value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={workloadFilter} onValueChange={(value: WorkloadLevel) => { setWorkloadFilter(value); setPage(1); }}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Workload" /></SelectTrigger>
                <SelectContent>
                  {workloadLevels.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value === "all" ? "All workload" : value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={(value: AvailabilityLevel) => { setAvailabilityFilter(value); setPage(1); }}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Availability" /></SelectTrigger>
                <SelectContent>
                  {availabilityLevels.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value === "all" ? "All availability" : value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Todayâ€™s Status</TableHead>
                    <TableHead>Attendance %</TableHead>
                    <TableHead>Workload Score</TableHead>
                    <TableHead>Availability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((teacher) => (
                    <TableRow key={teacher.id} className="cursor-pointer" onClick={() => setSelectedTeacherId(teacher.id)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback style={{ backgroundColor: teacher.avatarColor, color: "white" }}>
                              {teacher.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{teacher.name}</div>
                            <div className="text-xs text-muted-foreground">{teacher.subject}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{teacher.employeeId}</TableCell>
                      <TableCell>{teacher.department}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>
                        <Badge variant={teacher.roleType === "Teaching" ? "secondary" : "outline"}>
                          {teacher.roleType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={teacher.status === "Active" ? "secondary" : teacher.status === "Late" ? "outline" : "destructive"}>
                          {teacher.status}
                        </Badge>
                      </TableCell>
                      <TableCell className={teacher.attendancePct >= 95 ? "text-emerald-600 font-medium" : teacher.attendancePct >= 90 ? "text-amber-600 font-medium" : "text-red-600 font-medium"}>
                        {teacher.attendancePct}%
                      </TableCell>
                      <TableCell>
                        <span className={teacher.workloadLevel === "Overloaded" ? "text-red-600 font-medium" : teacher.workloadLevel === "High" ? "text-amber-600 font-medium" : "text-emerald-600 font-medium"}>
                          {teacher.workloadScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{teacher.availability}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!rows.length && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-12">
                        No staff match the selected filters.
                        <div className="mt-3">
                          <Button size="sm" variant="outline" onClick={clearFilters}>Clear Filters</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {rows.map((teacher) => (
                  <Card key={teacher.id} className="p-4 hover:shadow-md transition" onClick={() => setSelectedTeacherId(teacher.id)}>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback style={{ backgroundColor: teacher.avatarColor, color: "white" }}>
                          {teacher.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{teacher.name}</div>
                        <div className="text-xs text-muted-foreground">{teacher.department}</div>
                      </div>
                      <div className="ml-auto flex flex-col items-end gap-1">
                        <Badge variant="outline">{teacher.availability}</Badge>
                        <Badge variant={teacher.roleType === "Teaching" ? "secondary" : "outline"}>
                          {teacher.roleType}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-muted-foreground space-y-1">
                      <div>Employee ID: {teacher.employeeId}</div>
                      <div>Subjects: {teacher.subject}</div>
                      <div>Workload: {teacher.workloadScore} ({teacher.workloadLevel})</div>
                      <div>Attendance: {teacher.attendancePct}%</div>
                    </div>
                  </Card>
                ))}
                {!rows.length && (
                  <Card className="p-6 text-center text-muted-foreground col-span-full">
                    No staff match the selected filters.
                    <div className="mt-3">
                      <Button size="sm" variant="outline" onClick={clearFilters}>Clear Filters</Button>
                    </div>
                  </Card>
                )}
              </div>
            )}

            <div className="flex items-center justify-between p-4 border-t border-border text-sm">
              <div className="text-muted-foreground">
                Showing {filteredTeachers.length === 0 ? 0 : (page - 1) * pageSize + 1}â€“{Math.min(page * pageSize, filteredTeachers.length)} of {filteredTeachers.length}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <div className="px-3 py-1.5 rounded-md bg-muted">{page} / {pages}</div>
                <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </Card>
        </div>
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-4 items-start">
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">Department Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {departmentOverview.map((dept) => (
                  <Card key={dept.name} className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{dept.name}</p>
                      <Badge variant={dept.workload === "High" ? "destructive" : "secondary"}>{dept.workload}</Badge>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground space-y-1">
                      <div>Total Staff: {dept.total}</div>
                      <div>Present: {dept.present}</div>
                      <div>Absent: {dept.absent}</div>
                      <div>Performance: {dept.performance}%</div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Department Mix</p>
                    <h4 className="font-semibold mt-1">Staff Distribution</h4>
                  </div>
                  <Badge variant="outline">{departmentMixTotal} Staff</Badge>
                </div>
                <div className="mt-5 flex items-center justify-center">
                  <div
                    className="size-36 rounded-full shadow-inner"
                    style={{ background: `conic-gradient(${departmentMixBackground})` }}
                    aria-label="Department staffing mix chart"
                  />
                </div>
                <div className="mt-5 space-y-2">
                  {departmentMixSegments.map((segment) => (
                    <div key={segment.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span>{segment.label}</span>
                      </div>
                      <span className="text-muted-foreground">{segment.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        </TabsContent>
        </Tabs>
      </div>

      <Sheet open={!!selectedTeacherId} onOpenChange={(open) => !open && setSelectedTeacherId(null)}>
        <SheetContent side="right" className="w-[50vw] min-w-[420px] max-w-[880px] overflow-hidden">
          {selectedTeacher && (
            <div className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>Staff Profile</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full pr-3">
                <div className="space-y-5">
                  <Card className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-12">
                        <AvatarFallback style={{ backgroundColor: selectedTeacher.avatarColor, color: "white" }}>
                          {selectedTeacher.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-lg font-semibold">{selectedTeacher.name}</div>
                        <div className="text-xs text-muted-foreground">{selectedTeacher.employeeId} â€¢ {selectedTeacher.designation}</div>
                        <div className="text-xs text-muted-foreground">{selectedTeacher.department} â€¢ {selectedTeacher.experience} experience</div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant={selectedTeacher.status === "Active" ? "secondary" : selectedTeacher.status === "Late" ? "outline" : "destructive"}>
                          {selectedTeacher.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground">{selectedTeacher.currentStatus}</div>
                      </div>
                    </div>
                  </Card>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="flex flex-wrap gap-2 h-auto">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="attendance">Attendance</TabsTrigger>
                      {selectedTeacher.roleType === "Teaching" && (
                        <TabsTrigger value="schedule">Schedule</TabsTrigger>
                      )}
                      <TabsTrigger value="workload">Workload</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="leave">Leave</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <Card className="p-4 grid grid-cols-2 gap-4 text-sm">
                        <ProfileItem label="Joining Date" value="2018-06-15" />
                        <ProfileItem label="Qualification" value="M.Ed, B.Sc" />
                        <ProfileItem label="Subjects" value={selectedTeacher.subject} />
                        <ProfileItem label="Classes Assigned" value={selectedTeacher.classes.join(", ") || "-"} />
                        <ProfileItem label="Emergency Contact" value={selectedTeacher.phone} />
                        <ProfileItem label="Email" value={selectedTeacher.email} />
                        <ProfileItem label="Salary Amount" value={`â‚¹${selectedTeacher.salaryAmount.toLocaleString("en-IN")}`} />
                        <ProfileItem label="Salary Method" value={selectedTeacher.salaryMethod} />
                        <ProfileItem label="Salary Status" value={selectedTeacher.salaryStatus} />
                        <ProfileItem label="Role Type" value={selectedTeacher.roleType} />
                      </Card>
                    </TabsContent>

                    <TabsContent value="attendance">
                      <Card className="p-4 space-y-4 text-sm">
                        <ProfileItem label="Attendance %" value={`${selectedTeacher.attendancePct}%`} />
                        <ProfileItem label="Present Days" value="182" />
                        <ProfileItem label="Absent Days" value="6" />
                        <ProfileItem label="Late Arrivals" value={String(selectedTeacher.status === "Late" ? 2 : 0)} />
                        <div className="text-xs text-muted-foreground">Monthly trend: steady with minor dips in April.</div>
                      </Card>
                    </TabsContent>

                    {selectedTeacher.roleType === "Teaching" && (
                      <TabsContent value="schedule">
                        <Card className="p-4 space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <ProfileItem label="Current Class" value={selectedTeacher.currentStatus} />
                            <ProfileItem label="Next Class" value={selectedTeacher.classes[1] ?? "Free"} />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                              <span
                                key={period}
                                className={`px-2 py-1 rounded-full text-[11px] ${selectedTeacher.periodsAssigned.includes(period) ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                              >
                                P{period} {selectedTeacher.periodsAssigned.includes(period) ? "âœ“" : "FREE"}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground">Free periods: {selectedTeacher.freePeriods.join(", ")}</div>
                        </Card>
                      </TabsContent>
                    )}

                    <TabsContent value="workload">
                      <Card className="p-4 space-y-3 text-sm">
                        <ProfileItem label="Periods per week" value="28" />
                        <ProfileItem label="Classes Assigned" value={selectedTeacher.classes.join(", ") || "-"} />
                        <ProfileItem label="Subjects Assigned" value={selectedTeacher.subject} />
                        <ProfileItem label="Homework Pending" value={String(selectedTeacher.pendingTasks)} />
                        <ProfileItem label="Reports Pending" value={String(Math.max(1, selectedTeacher.pendingTasks - 2))} />
                        <ProfileItem label="Workload Status" value={selectedTeacher.workloadLevel} />
                      </Card>
                    </TabsContent>

                    <TabsContent value="performance">
                      <Card className="p-4 space-y-3 text-sm">
                        <ProfileItem label="Average Student Results" value="84%" />
                        <ProfileItem label="Homework Completion" value="92%" />
                        <ProfileItem label="Attendance Submission" value="96%" />
                        <ProfileItem label="Parent Feedback" value="4.2 / 5" />
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`size-4 ${i < Math.round(selectedTeacher.rating) ? "fill-amber-400" : ""}`} />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{selectedTeacher.rating.toFixed(1)}</span>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="leave">
                      <Card className="p-4 space-y-3 text-sm">
                        <ProfileItem label="Leaves Taken" value="6" />
                        <ProfileItem label="Remaining Leaves" value="8" />
                        <ProfileItem label="Upcoming Leaves" value="2 pending" />
                        <ProfileItem label="Last Leave" value="2026-05-12" />
                      </Card>
                    </TabsContent>

                    <TabsContent value="documents">
                      <Card className="p-4 space-y-3">
                        {["Qualification Certificates", "ID Documents", "Employment Documents", "Contracts", "Verification Records"].map((doc) => (
                          <div key={doc} className="flex items-center justify-between">
                            <span className="text-sm">{doc}</span>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                        ))}
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={leavePanelOpen} onOpenChange={setLeavePanelOpen}>
        <SheetContent side="right" className="w-[420px] sm:w-[520px]">
          <SheetHeader>
            <SheetTitle>Leave Requests</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {leaveRequests.map((leave) => (
              <Card key={`${leave.name}-${leave.range}`} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{leave.name}</p>
                    <p className="text-xs text-muted-foreground">{leave.range}</p>
                    <p className="text-xs text-muted-foreground">Type: {leave.type}</p>
                    <p className="text-xs text-muted-foreground">Reason: {leave.reason}</p>
                  </div>
                  <Badge variant="outline">{leave.status}</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary">Approve</Button>
                  <Button size="sm" variant="outline">Reject</Button>
                </div>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
