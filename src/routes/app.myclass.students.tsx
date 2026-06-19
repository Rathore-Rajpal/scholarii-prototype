import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  AlertCircle,
  LayoutGrid,
  List,
  Filter,
  Eye,
  MessageSquare,
  CalendarDays,
  Brain,
  FileCheck,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/app/myclass/students")({ component: TeacherStudentsPage });

const PAGE_SIZE = 10;
const CARD_PAGE_SIZE = 12;

const riskStyles = {
  Healthy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "Needs Attention": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "At Risk": "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
} as const;

const attendanceBands = ["all", "90+", "75-89", "below-75"] as const;
const academicBands = ["all", "80+", "65-79", "below-65"] as const;
const riskLevels = ["all", "Healthy", "Needs Attention", "At Risk"] as const;

type AttendanceBand = (typeof attendanceBands)[number];
type AcademicBand = (typeof academicBands)[number];
type RiskLevel = (typeof riskLevels)[number];

function TeacherStudentsPage() {
  const data = useMemo(() => loadData(), []);
  const [q, setQ] = useState("");
  const [gender, setGender] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [feeStatus, setFeeStatus] = useState<string>("all");
  const [attendanceBand, setAttendanceBand] = useState<AttendanceBand>("all");
  const [academicBand, setAcademicBand] = useState<AcademicBand>("all");
  const [admissionYear, setAdmissionYear] = useState<string>("all");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [page, setPage] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [drawerWidth, setDrawerWidth] = useState(720);
  const [isResizing, setIsResizing] = useState(false);

  const derivedStudents = useMemo(() => {
    return data.students
      .filter((student) => student.grade === 8 && student.section === "A")
      .map((student, index) => {
        const scores = student.testScores ? Object.values(student.testScores) : [];
        const academicScore = scores.length
          ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
          : 0;
        const feeStatusDisplay =
          student.feeStatus === "Overdue" && index % 5 !== 0 ? "Pending" : student.feeStatus;
        const feeLabel = feeStatusDisplay === "Pending" ? "Partial" : feeStatusDisplay;
        const attendanceRisk = student.attendance < 75;
        const academicRisk = academicScore > 0 && academicScore < 65;
        const feeRisk = feeStatusDisplay === "Overdue";
        const needsAttention =
          student.attendance < 85 ||
          (academicScore > 0 && academicScore < 75) ||
          feeStatusDisplay === "Pending";
        const risk: "Healthy" | "Needs Attention" | "At Risk" =
          attendanceRisk || academicRisk || feeRisk
            ? "At Risk"
            : needsAttention
              ? "Needs Attention"
              : "Healthy";
        const attendanceBandValue: AttendanceBand =
          student.attendance >= 90 ? "90+" : student.attendance >= 75 ? "75-89" : "below-75";
        const academicBandValue: AcademicBand =
          academicScore >= 80 ? "80+" : academicScore >= 65 ? "65-79" : "below-65";
        const admissionYearValue = String(2021 + (index % 4));
        const transferStatus = index % 35 === 0 ? "Transfer Pending" : "Active";
        const behaviorIncidents = index % 19 === 0 ? 1 + (index % 2) : 0;

        return {
          ...student,
          academicScore,
          feeStatusDisplay,
          feeLabel,
          risk,
          attendanceBand: attendanceBandValue,
          academicBand: academicBandValue,
          admissionYear: admissionYearValue,
          transferStatus,
          behaviorIncidents,
        };
      });
  }, [data.students]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return derivedStudents.filter((student) => {
      const matchesQuery =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.roll.toLowerCase().includes(query) ||
        student.parent.toLowerCase().includes(query) ||
        student.parentPhone.toLowerCase().includes(query);
      if (!matchesQuery) return false;
      if (gender !== "all" && student.gender !== gender) return false;
      if (status !== "all" && student.transferStatus !== status) return false;
      if (feeStatus !== "all") {
        if (feeStatus === "Partial" && student.feeLabel !== "Partial") return false;
        if (feeStatus !== "Partial" && student.feeLabel !== feeStatus) return false;
      }
      if (attendanceBand !== "all" && student.attendanceBand !== attendanceBand) return false;
      if (academicBand !== "all" && student.academicBand !== academicBand) return false;
      if (admissionYear !== "all" && student.admissionYear !== admissionYear) return false;
      if (riskLevel !== "all" && student.risk !== riskLevel) return false;
      return true;
    });
  }, [
    derivedStudents,
    q,
    gender,
    status,
    feeStatus,
    attendanceBand,
    academicBand,
    admissionYear,
    riskLevel,
  ]);

  const pageSize = viewMode === "table" ? PAGE_SIZE : CARD_PAGE_SIZE;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const selectedStudent =
    derivedStudents.find((student) => student.id === selectedStudentId) || null;

  const totalStudents = derivedStudents.length;
  const presentToday = derivedStudents.filter((s) => s.attendance >= 75).length;
  const belowAttendance = derivedStudents.filter((s) => s.attendance < 75).length;
  const atRisk = derivedStudents.filter((s) => s.risk === "At Risk").length;
  const newAdmissions = 18;
  const transferRequests = derivedStudents.filter(
    (s) => s.transferStatus === "Transfer Pending",
  ).length;

  const clearFilters = () => {
    setQ("");
    setGender("all");
    setStatus("all");
    setFeeStatus("all");
    setAttendanceBand("all");
    setAcademicBand("all");
    setAdmissionYear("all");
    setRiskLevel("all");
    setPage(1);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (event: MouseEvent) => {
      const nextWidth = Math.max(420, Math.min(980, window.innerWidth - event.clientX));
      setDrawerWidth(nextWidth);
    };

    const handleUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isResizing]);

  return (
    <RoleGuard allowedRoles={["teacher"]}>
      <div>
        <PageHeader
          title="Student Command Center"
          subtitle="Monitor attendance, performance, risk, and student operations in one intelligent workspace."
        />

        <div className="space-y-6">
          {/* KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Total Students</p>
                <Users className="size-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {totalStudents.toLocaleString()} Students
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Present Today</p>
                <UserCheck className="size-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold mt-2">{presentToday.toLocaleString()} Present</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((presentToday / totalStudents) * 100).toFixed(1)}%
              </p>
            </Card>
            <Card className="p-4 border-2 border-amber-200/70 dark:border-amber-900/40">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Below 75% Attendance</p>
                <AlertTriangle className="size-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold mt-2">{belowAttendance} Students</div>
            </Card>
            <Card className="p-4 border-2 border-red-200/70 dark:border-red-900/40">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">At-Risk Students</p>
                <AlertCircle className="size-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold mt-2">{atRisk} Students</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">New Admissions (Month)</p>
                <UserPlus className="size-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">{newAdmissions} Students</div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Transfer Requests</p>
                <UserX className="size-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-2">{transferRequests} Pending</div>
            </Card>
          </div>

          {/* Student Directory */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Student Directory</h2>
                <p className="text-sm text-muted-foreground">
                  Search and filter student records instantly.
                </p>
              </div>
            </div>

            <Card className="p-4">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search name, admission number, parent, phone..."
                    value={q}
                    onChange={(e) => {
                      setQ(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <Select
                  value={gender}
                  onValueChange={(v) => {
                    setGender(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Transfer Pending">Transfer Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={attendanceBand}
                  onValueChange={(v: AttendanceBand) => {
                    setAttendanceBand(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Attendance %" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All attendance</SelectItem>
                    <SelectItem value="90+">90% and above</SelectItem>
                    <SelectItem value="75-89">75% to 89%</SelectItem>
                    <SelectItem value="below-75">Below 75%</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={academicBand}
                  onValueChange={(v: AcademicBand) => {
                    setAcademicBand(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Academic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All performance</SelectItem>
                    <SelectItem value="80+">80% and above</SelectItem>
                    <SelectItem value="65-79">65% to 79%</SelectItem>
                    <SelectItem value="below-65">Below 65%</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={feeStatus}
                  onValueChange={(v) => {
                    setFeeStatus(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Fee Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All fees</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={admissionYear}
                  onValueChange={(v) => {
                    setAdmissionYear(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Admission Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    {Array.from({ length: 4 }).map((_, i) => {
                      const year = 2021 + i;
                      return (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Select
                  value={riskLevel}
                  onValueChange={(v: RiskLevel) => {
                    setRiskLevel(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All risk</SelectItem>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                    <SelectItem value="At Risk">At Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <Filter className="size-4 mr-1" />
                  Clear Filters
                </Button>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant={viewMode === "table" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                  >
                    <List className="size-4 mr-1" />
                    Table
                  </Button>
                  <Button
                    variant={viewMode === "card" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("card")}
                  >
                    <LayoutGrid className="size-4 mr-1" />
                    Cards
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              {viewMode === "table" ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Admission No</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Attendance %</TableHead>
                      <TableHead>Academic Score</TableHead>
                      <TableHead>Fee Status</TableHead>
                      <TableHead>Risk Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((student) => (
                      <TableRow
                        key={student.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedStudentId(student.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback
                                style={{ backgroundColor: student.avatarColor, color: "white" }}
                              >
                                {student.name
                                  .split(" ")
                                  .map((p) => p[0])
                                  .slice(0, 2)
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.parent}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{student.roll}</TableCell>
                        <TableCell>
                          Grade {student.grade}-{student.section}
                        </TableCell>
                        <TableCell
                          className={
                            student.attendance >= 90
                              ? "text-emerald-600 font-medium"
                              : student.attendance >= 75
                                ? "text-amber-600 font-medium"
                                : "text-red-600 font-medium"
                          }
                        >
                          {student.attendance}%
                        </TableCell>
                        <TableCell
                          className={
                            student.academicScore >= 80
                              ? "text-emerald-600 font-medium"
                              : student.academicScore >= 65
                                ? "text-amber-600 font-medium"
                                : "text-red-600 font-medium"
                          }
                        >
                          {student.academicScore || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              student.feeLabel === "Paid"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : student.feeLabel === "Overdue"
                                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            }
                          >
                            {student.feeLabel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={riskStyles[student.risk]}>{student.risk}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!rows.length && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                          No students match the selected filters.
                          <div className="mt-3">
                            <Button size="sm" variant="outline" onClick={clearFilters}>
                              Clear Filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {rows.map((student) => (
                    <Card
                      key={student.id}
                      className="p-4 cursor-pointer hover:shadow-md transition"
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback
                            style={{ backgroundColor: student.avatarColor, color: "white" }}
                          >
                            {student.name
                              .split(" ")
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Grade {student.grade}-{student.section} - {student.roll}
                          </div>
                        </div>
                        <Badge className={`ml-auto ${riskStyles[student.risk]}`}>
                          {student.risk}
                        </Badge>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Attendance</p>
                          <p className="font-semibold">{student.attendance}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Academic</p>
                          <p className="font-semibold">{student.academicScore || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fees</p>
                          <p className="font-semibold">{student.feeLabel}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {!rows.length && (
                    <Card className="p-6 text-center text-muted-foreground col-span-full">
                      No students match the selected filters.
                      <div className="mt-3">
                        <Button size="sm" variant="outline" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between p-4 border-t border-border text-sm">
                <div className="text-muted-foreground">
                  Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, filtered.length)} of {filtered.length}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <div className="px-3 py-1.5 rounded-md bg-muted">
                    {page} / {pages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === pages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Sheet
          open={!!selectedStudentId}
          onOpenChange={(open) => !open && setSelectedStudentId(null)}
        >
          <SheetContent
            side="right"
            className="min-w-[420px] max-w-[980px] overflow-hidden"
            style={{ width: drawerWidth }}
          >
            <div
              className="absolute left-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-muted/60"
              onMouseDown={() => setIsResizing(true)}
            />
            {selectedStudent && (
              <div className="h-full flex flex-col">
                <SheetHeader>
                  <SheetTitle>Student Profile</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full pr-3">
                  <div className="space-y-5">
                    <Card className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-12">
                          <AvatarFallback
                            style={{ backgroundColor: selectedStudent.avatarColor, color: "white" }}
                          >
                            {selectedStudent.name
                              .split(" ")
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-lg font-semibold">{selectedStudent.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Admission No: {selectedStudent.roll}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Grade {selectedStudent.grade}-{selectedStudent.section}
                          </div>
                        </div>
                        <div className="space-y-2 text-right">
                          <Badge variant="secondary">{selectedStudent.transferStatus}</Badge>
                          <Badge className={riskStyles[selectedStudent.risk]}>
                            {selectedStudent.risk}
                          </Badge>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="text-sm font-semibold mb-2">AI Student Insights</h4>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        {getInsights(selectedStudent).map((insight) => (
                          <div key={insight} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-amber-500" />
                            <span>{insight}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="flex flex-wrap gap-2 h-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="academics">Academics</TabsTrigger>
                        <TabsTrigger value="fees">Fees</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="communication">Communication</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview">
                        <Card className="p-4 grid grid-cols-2 gap-4 text-sm">
                          <ProfileItem
                            label="Age"
                            value={`${14 + (Number(selectedStudent.roll) % 4)} years`}
                          />
                          <ProfileItem
                            label="DOB"
                            value={`200${Number(selectedStudent.roll) % 9}-0${(Number(selectedStudent.roll) % 9) + 1}-15`}
                          />
                          <ProfileItem
                            label="Gender"
                            value={selectedStudent.gender === "M" ? "Male" : "Female"}
                          />
                          <ProfileItem
                            label="Blood Group"
                            value={["A+", "B+", "O+", "AB+"][Number(selectedStudent.roll) % 4]}
                          />
                          <ProfileItem
                            label="Address"
                            value={`${selectedStudent.grade} Park Street, Bengaluru`}
                          />
                          <ProfileItem
                            label="Parent"
                            value={`${selectedStudent.parent} - ${selectedStudent.parentPhone}`}
                          />
                          <ProfileItem
                            label="Emergency Contact"
                            value={selectedStudent.parentPhone}
                          />
                          <ProfileItem
                            label="Admission Date"
                            value={`202${Number(selectedStudent.roll) % 3}-06-15`}
                          />
                        </Card>
                      </TabsContent>

                      <TabsContent value="attendance">
                        <Card className="p-4 space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <ProfileItem
                              label="Current Attendance"
                              value={`${selectedStudent.attendance}%`}
                            />
                            <ProfileItem
                              label="Days Present"
                              value={`${Math.round((180 * selectedStudent.attendance) / 100)}`}
                            />
                            <ProfileItem
                              label="Days Absent"
                              value={`${180 - Math.round((180 * selectedStudent.attendance) / 100)}`}
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Attendance Status</p>
                            <Badge
                              className={
                                selectedStudent.attendance >= 90
                                  ? "bg-emerald-100 text-emerald-700"
                                  : selectedStudent.attendance >= 75
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                              }
                            >
                              {selectedStudent.attendance >= 90
                                ? "Excellent"
                                : selectedStudent.attendance >= 75
                                  ? "Good"
                                  : "Needs Attention"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Monthly trend: steady with minor dips last week.
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="academics">
                        <Card className="p-4 space-y-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <ProfileItem
                              label="Overall Score"
                              value={`${selectedStudent.academicScore || "-"}%`}
                            />
                            <ProfileItem
                              label="Class Rank"
                              value={`${(Number(selectedStudent.roll) % 25) + 1}`}
                            />
                            <ProfileItem
                              label="Strength"
                              value={getTopSubjects(selectedStudent).join(", ") || "-"}
                            />
                          </div>
                          <div className="space-y-2 text-xs">
                            {selectedStudent.testScores ? (
                              Object.entries(selectedStudent.testScores).map(([subject, score]) => (
                                <div key={subject} className="flex items-center justify-between">
                                  <span>{subject}</span>
                                  <span
                                    className={
                                      score >= 80
                                        ? "text-emerald-600"
                                        : score >= 65
                                          ? "text-amber-600"
                                          : "text-red-600"
                                    }
                                  >
                                    {score}%
                                  </span>
                                </div>
                              ))
                            ) : (
                              <span className="text-muted-foreground">
                                No subject scores available.
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Weak subjects: {getWeakSubjects(selectedStudent).join(", ") || "None"}
                          </div>
                        </Card>
                      </TabsContent>

                      <TabsContent value="fees">
                        <Card className="p-4 space-y-4 text-sm">
                          <ProfileItem label="Fee Status" value={selectedStudent.feeLabel} />
                          <ProfileItem
                            label="Total Paid"
                            value={
                              selectedStudent.feeStatusDisplay === "Paid"
                                ? "INR 48,000"
                                : "INR 32,000"
                            }
                          />
                          <ProfileItem
                            label="Pending Amount"
                            value={
                              selectedStudent.feeStatusDisplay === "Overdue"
                                ? "INR 16,000"
                                : selectedStudent.feeStatusDisplay === "Pending"
                                  ? "INR 8,000"
                                  : "INR 0"
                            }
                          />
                          <ProfileItem label="Last Payment" value="2026-05-12" />
                          <ProfileItem
                            label="Concession"
                            value={Number(selectedStudent.roll) % 3 === 0 ? "Sibling" : "None"}
                          />
                        </Card>
                      </TabsContent>

                      <TabsContent value="documents">
                        <Card className="p-4 space-y-3">
                          {[
                            "Birth Certificate",
                            "Aadhaar",
                            "Transfer Certificate",
                            "Medical Documents",
                            "Report Cards",
                            "Student ID",
                          ].map((doc) => (
                            <div key={doc} className="flex items-center justify-between">
                              <span className="text-sm">{doc}</span>
                              <Button size="sm" variant="outline">
                                Download
                              </Button>
                            </div>
                          ))}
                        </Card>
                      </TabsContent>

                      <TabsContent value="communication">
                        <Card className="p-4 space-y-3 text-sm">
                          <div>
                            <p className="font-medium">Recent Notices</p>
                            <p className="text-xs text-muted-foreground">
                              2 notices sent in the last 30 days.
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Messages Sent</p>
                            <p className="text-xs text-muted-foreground">
                              4 parent messages logged.
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Communication History</p>
                            <p className="text-xs text-muted-foreground">
                              Last contact: 2026-05-20
                            </p>
                          </div>
                        </Card>
                      </TabsContent>
                    </Tabs>

                    <Card className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h4 className="text-sm font-semibold">Teacher Actions</h4>
                          <p className="text-xs text-muted-foreground">Class-level actions only.</p>
                        </div>
                        <Badge variant="secondary">Allowed</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button variant="outline" size="sm" className="justify-start">
                          <Eye className="size-4 mr-2" /> View Student
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <MessageSquare className="size-4 mr-2" /> Add Remark
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <MessageSquare className="size-4 mr-2" /> Contact Parent
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <UserCheck className="size-4 mr-2" /> View Attendance
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <TrendingUp className="size-4 mr-2" /> View Performance
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <FileCheck className="size-4 mr-2" /> Verify Documents
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <BookOpen className="size-4 mr-2" /> Assign Work
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <CalendarDays className="size-4 mr-2" /> Schedule Meeting
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start sm:col-span-2">
                          <Brain className="size-4 mr-2" /> Generate AI Insights
                        </Button>
                      </div>
                    </Card>
                  </div>
                </ScrollArea>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </RoleGuard>
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

function getTopSubjects(student: { testScores?: Record<string, number> }) {
  if (!student.testScores) return [];
  return Object.entries(student.testScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([subject]) => subject);
}

function getWeakSubjects(student: { testScores?: Record<string, number> }) {
  if (!student.testScores) return [];
  return Object.entries(student.testScores)
    .filter(([, score]) => score < 65)
    .map(([subject]) => subject);
}

function getInsights(student: {
  attendance: number;
  academicScore: number;
  feeStatusDisplay: string;
  behaviorIncidents: number;
}) {
  const insights: string[] = [];
  if (student.attendance < 85) {
    insights.push("Attendance has dropped over the last month and needs follow-up.");
  }
  if (student.academicScore > 0 && student.academicScore < 70) {
    insights.push("Performance is below class average in core subjects.");
  }
  if (student.feeStatusDisplay === "Overdue") {
    insights.push("Fees have been overdue for more than 30 days.");
  }
  if (student.behaviorIncidents > 0) {
    insights.push("Recent behavior incidents require counselor attention.");
  }
  if (!insights.length) {
    insights.push("Student is on track with no immediate risks detected.");
  }
  return insights.slice(0, 4);
}
