import { createFileRoute } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  LayoutGrid,
  List,
  Printer,
  Search,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/students")({
  component: AdminStudentsPage,
});

type Risk = "Healthy" | "Needs Attention" | "At Risk";
type FeeStatus = "Paid" | "Pending" | "Overdue";
type Student = {
  id: number;
  name: string;
  parent: string;
  admissionNo: string;
  grade: string;
  section: string;
  attendance: number;
  feeStatus: FeeStatus;
  risk: Risk;
  avatarColor: string;
};

const firstStudents = [
  ["Aarav Sharma", "Reyansh Sharma", "1A01", 89, "Paid", "Needs Attention"],
  ["Arjun Patel", "Ayaan Patel", "1A02", 85, "Paid", "Healthy"],
  ["Ishaan Singh", "Krishna Singh", "1A03", 88, "Paid", "Healthy"],
  ["Aadhya Mehta", "Ishaan Mehta", "1A04", 87, "Paid", "Healthy"],
  ["Anaya Iyer", "Shaurya Iyer", "1A05", 87, "Paid", "Healthy"],
  ["Kabir Joshi", "Ananya Joshi", "1A06", 87, "Paid", "Healthy"],
  ["Aryan Khan", "Diya Khan", "1A07", 92, "Paid", "Healthy"],
  ["Tara Kapoor", "Aadhya Kapoor", "1A08", 85, "Paid", "Healthy"],
  ["Aditya Verma", "Saanvi Verma", "1A09", 85, "Paid", "Healthy"],
  ["Ayaan Kumar", "Aanya Kumar", "1A10", 88, "Paid", "Healthy"],
] as const;

const names = [
  "Vivaan Gupta",
  "Diya Nair",
  "Krishna Rao",
  "Saanvi Das",
  "Rohan Shah",
  "Meera Reddy",
  "Arnav Bhat",
  "Ira Menon",
];
const parentNames = [
  "Rahul Gupta",
  "Neha Nair",
  "Mohan Rao",
  "Priya Das",
  "Karan Shah",
  "Sunita Reddy",
  "Vikram Bhat",
  "Anil Menon",
];
const avatarColors = ["#7c3aed", "#0891b2", "#059669", "#ea580c", "#db2777", "#2563eb"];

const students: Student[] = Array.from({ length: 430 }, (_, index) => {
  if (index < firstStudents.length) {
    const [name, parent, admissionNo, attendance, feeStatus, risk] = firstStudents[index];
    return {
      id: index + 1,
      name,
      parent,
      admissionNo,
      grade: "Grade 1",
      section: "A",
      attendance,
      feeStatus,
      risk,
      avatarColor: avatarColors[index % avatarColors.length],
    };
  }
  const grade = (index % 10) + 1;
  const attendance = 68 + (index % 29);
  const feeStatus: FeeStatus = index % 19 === 0 ? "Overdue" : index % 11 === 0 ? "Pending" : "Paid";
  const risk: Risk =
    attendance < 75 || feeStatus === "Overdue"
      ? "At Risk"
      : attendance < 82 || feeStatus === "Pending"
        ? "Needs Attention"
        : "Healthy";
  return {
    id: index + 1,
    name: names[index % names.length],
    parent: parentNames[index % parentNames.length],
    admissionNo: `${grade}${String.fromCharCode(65 + (index % 3))}${String(index + 1).padStart(3, "0")}`,
    grade: `Grade ${grade}`,
    section: String.fromCharCode(65 + (index % 3)),
    attendance,
    feeStatus,
    risk,
    avatarColor: avatarColors[index % avatarColors.length],
  };
});

const atRiskStudents = [
  ["Riya Deshmukh", "4B18", "Grade 4-B", 68, "Paid", "Low attendance"],
  ["Atharv Kulkarni", "5A11", "Grade 5-A", 91, "Overdue", "Fee overdue"],
  ["Myra Chawla", "6C08", "Grade 6-C", 71, "Overdue", "Low attendance and fee overdue"],
  ["Dev Malhotra", "7A23", "Grade 7-A", 74, "Pending", "Low attendance"],
  ["Sara Thomas", "8B15", "Grade 8-B", 82, "Overdue", "Fee overdue"],
  ["Neil D'Souza", "9A07", "Grade 9-A", 69, "Paid", "Low attendance"],
  ["Kavya Nair", "3C12", "Grade 3-C", 78, "Pending", "Needs academic attention"],
  ["Om Prakash", "10B09", "Grade 10-B", 72, "Overdue", "Low attendance and fee overdue"],
] as const;

const pendingActions = [
  ["Rohan Verma", "Issue transfer certificate", "18 Jun 2026", "TC Request"],
  ["Maya Rao", "Collect birth certificate copy", "19 Jun 2026", "Documents"],
  ["Kabir Khan", "Follow up on overdue tuition fee", "20 Jun 2026", "Fee Follow-up"],
  ["Ananya Iyer", "Approve inter-school transfer", "21 Jun 2026", "Transfer"],
  ["Vivaan Mehta", "Verify updated home address", "22 Jun 2026", "Address Update"],
  ["Diya Sharma", "Collect signed medical form", "23 Jun 2026", "Documents"],
];

function AdminStudentsPage() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [section, setSection] = useState("all");
  const [status, setStatus] = useState("all");
  const [attendance, setAttendance] = useState("all");
  const [fees, setFees] = useState("all");
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return students.filter((student) => {
      if (
        term &&
        !`${student.name} ${student.parent} ${student.admissionNo}`.toLowerCase().includes(term)
      )
        return false;
      if (grade !== "all" && student.grade !== grade) return false;
      if (section !== "all" && student.section !== section) return false;
      if (status !== "all" && student.risk !== status) return false;
      if (attendance === "high" && student.attendance < 90) return false;
      if (attendance === "medium" && (student.attendance < 75 || student.attendance >= 90))
        return false;
      if (attendance === "low" && student.attendance >= 75) return false;
      if (fees !== "all" && student.feeStatus !== fees) return false;
      return true;
    });
  }, [attendance, fees, grade, query, section, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const visibleStudents = filtered.slice((page - 1) * 10, page * 10);
  const start = filtered.length ? (page - 1) * 10 + 1 : 0;
  const end = Math.min(page * 10, filtered.length);

  const clearFilters = () => {
    setQuery("");
    setGrade("all");
    setSection("all");
    setStatus("all");
    setAttendance("all");
    setFees("all");
    setPage(1);
  };

  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Student Records"
        subtitle="Search, view, and manage student information"
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-violet-600 text-white hover:bg-violet-700"
              onClick={() => toast.success("Add student form is ready to be connected")}
            >
              <UserPlus className="mr-2 size-4" />
              Add Student
            </Button>
            <Button variant="ghost" onClick={() => toast.success("Student list exported")}>
              <Download className="mr-2 size-4" />
              Export List
            </Button>
            <Button variant="ghost" onClick={() => toast.info("Import students selected")}>
              <Upload className="mr-2 size-4" />
              Import Students
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <KpiTile label="Total Students" value="430" icon={Users} />
        <KpiTile label="Present Today" value="392" hint="91.2%" icon={UserCheck} tone="green" />
        <KpiTile
          label="Below 75% Attendance"
          value="38 Students"
          icon={AlertTriangle}
          tone="amber"
        />
        <KpiTile label="Fee Defaulters" value="24 Students" icon={AlertCircle} tone="red" />
        <KpiTile label="New This Month" value="18 Students" icon={UserPlus} tone="blue" />
        <KpiTile label="Transfer Requests" value="13 Pending" icon={ArrowRightLeft} />
      </div>

      <Card className="mt-6 overflow-hidden border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 pt-5">
          <h2 className="text-lg font-semibold">Student Directory</h2>
          <p className="mt-1 text-sm text-gray-500">Search and manage all student records.</p>
          <Tabs defaultValue="all" className="mt-4">
            <TabsList className="h-auto rounded-none bg-transparent p-0">
              <DirectoryTab value="all">
                <ClipboardList className="mr-1.5 size-4" />
                All Students
              </DirectoryTab>
              <DirectoryTab value="risk">
                <AlertTriangle className="mr-1.5 size-4" />
                At-Risk Students
              </DirectoryTab>
              <DirectoryTab value="pending">
                <FileText className="mr-1.5 size-4" />
                Pending Actions
              </DirectoryTab>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="py-5">
                <Filters
                  query={query}
                  setQuery={(value) => {
                    setQuery(value);
                    setPage(1);
                  }}
                  grade={grade}
                  setGrade={setGrade}
                  section={section}
                  setSection={setSection}
                  status={status}
                  setStatus={setStatus}
                  attendance={attendance}
                  setAttendance={setAttendance}
                  fees={fees}
                  setFees={setFees}
                  clear={clearFilters}
                  view={view}
                  setView={setView}
                />

                {view === "table" ? (
                  <StudentTable students={visibleStudents} onView={setSelectedStudent} />
                ) : (
                  <StudentCards students={visibleStudents} onView={setSelectedStudent} />
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-sm">
                  <span className="text-gray-500">
                    Showing {start}-{end} of {filtered.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      <ChevronLeft className="mr-1 size-4" />
                      Previous
                    </Button>
                    <span className="min-w-14 text-center font-medium">
                      {page}/{totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    >
                      Next
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="mt-0 py-5">
              <RiskTable onView={(name) => setSelectedStudent(findStudent(name))} />
            </TabsContent>

            <TabsContent value="pending" className="mt-0 py-5">
              <PendingActions />
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {selectedStudent && (
        <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}

function KpiTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = "gray",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "gray" | "green" | "amber" | "red" | "blue";
}) {
  const tones = {
    gray: "bg-gray-50 text-gray-500",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <Card className="border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {hint && <p className="mt-1 text-xs text-emerald-600">{hint}</p>}
        </div>
        <div className={cn("grid size-9 place-items-center rounded-lg", tones[tone])}>
          <Icon className="size-4" />
        </div>
      </div>
    </Card>
  );
}

function DirectoryTab({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-b-2 border-transparent px-4 py-3 shadow-none data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-violet-600 data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

function Filters({
  query,
  setQuery,
  grade,
  setGrade,
  section,
  setSection,
  status,
  setStatus,
  attendance,
  setAttendance,
  fees,
  setFees,
  clear,
  view,
  setView,
}: {
  query: string;
  setQuery: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  section: string;
  setSection: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  attendance: string;
  setAttendance: (value: string) => void;
  fees: string;
  setFees: (value: string) => void;
  clear: () => void;
  view: "table" | "cards";
  setView: (value: "table" | "cards") => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative min-w-56 flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search student, parent, admission no..."
          className="pl-9"
        />
      </div>
      <FilterSelect value={grade} onChange={setGrade} label="All classes">
        {Array.from({ length: 10 }, (_, index) => (
          <SelectItem key={index + 1} value={`Grade ${index + 1}`}>
            Grade {index + 1}
          </SelectItem>
        ))}
      </FilterSelect>
      <FilterSelect value={section} onChange={setSection} label="All sections">
        {["A", "B", "C"].map((value) => (
          <SelectItem key={value} value={value}>
            Section {value}
          </SelectItem>
        ))}
      </FilterSelect>
      <FilterSelect value={status} onChange={setStatus} label="All status">
        <SelectItem value="Healthy">Healthy</SelectItem>
        <SelectItem value="Needs Attention">Needs Attention</SelectItem>
        <SelectItem value="At Risk">At Risk</SelectItem>
      </FilterSelect>
      <FilterSelect value={attendance} onChange={setAttendance} label="All attendance">
        <SelectItem value="high">90% and above</SelectItem>
        <SelectItem value="medium">75% to 89%</SelectItem>
        <SelectItem value="low">Below 75%</SelectItem>
      </FilterSelect>
      <FilterSelect value={fees} onChange={setFees} label="All fees">
        <SelectItem value="Paid">Paid</SelectItem>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Overdue">Overdue</SelectItem>
      </FilterSelect>
      <Button variant="ghost" size="sm" onClick={clear}>
        Clear Filters
      </Button>
      <div className="ml-auto flex rounded-lg border border-gray-200 p-1">
        <Button
          size="sm"
          variant={view === "table" ? "secondary" : "ghost"}
          onClick={() => setView("table")}
        >
          <List className="mr-1 size-4" />
          Table
        </Button>
        <Button
          size="sm"
          variant={view === "cards" ? "secondary" : "ghost"}
          onClick={() => setView("cards")}
        >
          <LayoutGrid className="mr-1 size-4" />
          Cards
        </Button>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}</SelectItem>
        {children}
      </SelectContent>
    </Select>
  );
}

function StudentTable({
  students,
  onView,
}: {
  students: Student[];
  onView: (student: Student) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Admission No</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Attendance %</TableHead>
            <TableHead>Fee Status</TableHead>
            <TableHead>Risk Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <StudentIdentity student={student} />
              </TableCell>
              <TableCell className="font-medium">{student.admissionNo}</TableCell>
              <TableCell>
                {student.grade}-{student.section}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "font-semibold",
                    student.attendance >= 90
                      ? "text-emerald-600"
                      : student.attendance < 75
                        ? "text-red-600"
                        : "text-amber-600",
                  )}
                >
                  {student.attendance}%
                </span>
              </TableCell>
              <TableCell>
                <StatusPill status={student.feeStatus} />
              </TableCell>
              <TableCell>
                <StatusPill status={student.risk} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-violet-600"
                  onClick={() => onView(student)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StudentCards({
  students,
  onView,
}: {
  students: Student[];
  onView: (student: Student) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {students.map((student) => (
        <Card key={student.id} className="border-gray-100 p-4 shadow-sm">
          <StudentIdentity student={student} />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Info label="Admission No" value={student.admissionNo} />
            <Info label="Class" value={`${student.grade}-${student.section}`} />
            <Info label="Attendance" value={`${student.attendance}%`} />
            <Info label="Fee Status" value={student.feeStatus} />
          </div>
          <Button
            className="mt-4 w-full"
            variant="outline"
            size="sm"
            onClick={() => onView(student)}
          >
            View Record
          </Button>
        </Card>
      ))}
    </div>
  );
}

function StudentIdentity({ student }: { student: Student }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarFallback style={{ backgroundColor: student.avatarColor, color: "white" }}>
          {initials(student.name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-gray-900">{student.name}</p>
        <p className="text-xs text-gray-500">{student.parent}</p>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Risk | FeeStatus }) {
  const style =
    status === "Paid" || status === "Healthy"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Overdue" || status === "At Risk"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", style)}>{status}</span>
  );
}

function RiskTable({ onView }: { onView: (name: string) => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Admission No</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Fee Status</TableHead>
            <TableHead>Risk Status</TableHead>
            <TableHead>Risk Reason</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {atRiskStudents.map(([name, admissionNo, grade, attendance, feeStatus, reason]) => (
            <TableRow key={admissionNo}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{admissionNo}</TableCell>
              <TableCell>{grade}</TableCell>
              <TableCell className={attendance < 75 ? "font-semibold text-red-600" : ""}>
                {attendance}%
              </TableCell>
              <TableCell>
                <StatusPill status={feeStatus as FeeStatus} />
              </TableCell>
              <TableCell>
                <StatusPill status="At Risk" />
              </TableCell>
              <TableCell className="text-gray-600">{reason}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-violet-600"
                  onClick={() => onView(name)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PendingActions() {
  return (
    <div className="space-y-3">
      {pendingActions.map(([name, action, dueDate, type]) => (
        <div
          key={`${name}-${type}`}
          className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 p-4"
        >
          <div className="min-w-44">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-gray-500">{type}</p>
          </div>
          <p className="flex-1 text-sm text-gray-600">{action}</p>
          <p className="text-sm text-gray-500">Due {dueDate}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success(`Action opened for ${name}`)}
          >
            Act
          </Button>
        </div>
      ))}
    </div>
  );
}

function StudentDetailModal({ student, onClose }: { student: Student; onClose: () => void }) {
  const [collectFeeOpen, setCollectFeeOpen] = useState(false);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9999] grid place-items-center overflow-y-auto bg-black/60 p-4"
        onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      >
        <div className="my-6 w-full max-w-[700px] overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold">{student.name} — Student Record</h2>
              <p className="text-sm text-gray-500">
                {student.grade}-{student.section} | {student.admissionNo}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close student record"
            >
              <X className="size-5" />
            </button>
          </div>

          <Tabs defaultValue="profile">
            <div className="border-b border-gray-100 px-6 pt-3">
              <TabsList className="h-auto bg-gray-50">
                {["Profile", "Attendance", "Fees", "Documents", "Activity"].map((tab) => (
                  <TabsTrigger key={tab} value={tab.toLowerCase()}>
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <TabsContent value="profile" className="mt-0">
                <ProfileTab student={student} />
              </TabsContent>
              <TabsContent value="attendance" className="mt-0">
                <AttendanceTab student={student} />
              </TabsContent>
              <TabsContent value="fees" className="mt-0">
                <FeesTab onCollect={() => setCollectFeeOpen(true)} />
              </TabsContent>
              <TabsContent value="documents" className="mt-0">
                <DocumentsTab />
              </TabsContent>
              <TabsContent value="activity" className="mt-0">
                <ActivityTab student={student} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      {collectFeeOpen && (
        <CollectFeeModal student={student} onClose={() => setCollectFeeOpen(false)} />
      )}
    </>,
    document.body,
  );
}

function ProfileTab({ student }: { student: Student }) {
  return (
    <div>
      <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
        <Avatar className="size-16">
          <AvatarFallback
            className="text-xl"
            style={{ backgroundColor: student.avatarColor, color: "white" }}
          >
            {initials(student.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">{student.name}</h3>
          <p className="text-sm text-gray-500">
            {student.grade}-{student.section} | Admission No. {student.admissionNo}
          </p>
        </div>
      </div>
      <SectionTitle>Student Information</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <Info label="Full Name" value={student.name} />
        <Info label="Date of Birth" value="14 August 2018" />
        <Info label="Gender" value="Male" />
        <Info label="Aadhar Number" value="XXXX XXXX 4821" />
        <Info label="Class" value={student.grade} />
        <Info label="Section" value={student.section} />
        <Info label="Admission Date" value="10 June 2024" />
        <Info label="Blood Group" value="B+" />
      </div>
      <SectionTitle>Parent Details</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        <Info label="Father's Name" value={student.parent} />
        <Info label="Mother's Name" value="Anjali Sharma" />
        <Info label="Primary Contact" value="+91 98765 43210" />
        <Info label="Email" value="parent@example.com" />
        <div className="sm:col-span-2">
          <Info label="Home Address" value="24, College Road, Nashik, Maharashtra 422005" />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={() => toast.success("Student profile sent to printer")}>
          <Printer className="mr-2 size-4" />
          Print Profile
        </Button>
        <Button
          className="bg-violet-600 text-white hover:bg-violet-700"
          onClick={() => toast.info("Edit details mode opened")}
        >
          Edit Details
        </Button>
      </div>
    </div>
  );
}

const attendanceTrend = Array.from({ length: 30 }, (_, index) => ({
  day: index + 1,
  attendance: [100, 100, 0, 100, 100, 100, 0][index % 7],
}));

function AttendanceTab({ student }: { student: Student }) {
  const attendanceRows = [
    ["15 Jun 2026", "Present", "Full Day", "-"],
    ["14 Jun 2026", "Present", "Full Day", "-"],
    ["13 Jun 2026", "Absent", "Full Day", "Medical leave"],
    ["12 Jun 2026", "Present", "Full Day", "-"],
    ["11 Jun 2026", "Present", "Full Day", "-"],
    ["10 Jun 2026", "Present", "Full Day", "Late by 8 minutes"],
    ["09 Jun 2026", "Present", "Full Day", "-"],
    ["08 Jun 2026", "Absent", "Period 1-4", "Parent informed"],
    ["07 Jun 2026", "Present", "Full Day", "-"],
    ["06 Jun 2026", "Present", "Full Day", "-"],
  ];
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat label="Present Days" value="146" />
        <MiniStat label="Absent Days" value="18" />
        <MiniStat label="Attendance %" value={`${student.attendance}%`} />
      </div>
      <SectionTitle>Last 30 Days</SectionTitle>
      <div className="h-56 rounded-xl border border-gray-100 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceTrend}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <SectionTitle>Recent Attendance</SectionTitle>
      <CompactTable headers={["Date", "Status", "Period", "Remarks"]} rows={attendanceRows} />
    </div>
  );
}

function FeesTab({ onCollect }: { onCollect: () => void }) {
  const transactions = [
    ["June 2026", "Tuition Fee", "Rs 4,800", "05 Jun 2026", "UPI", "R-2606-118"],
    ["May 2026", "Tuition Fee", "Rs 4,800", "04 May 2026", "Card", "R-2605-092"],
    ["April 2026", "Tuition Fee", "Rs 4,800", "06 Apr 2026", "Cash", "R-2604-071"],
    ["April 2026", "Transport Fee", "Rs 1,200", "06 Apr 2026", "Cash", "R-2604-072"],
  ];
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat label="Total Due" value="Rs 19,200" />
        <MiniStat label="Paid" value="Rs 14,400" />
        <MiniStat label="Pending" value="Rs 4,800" />
      </div>
      <div className="flex items-center justify-between">
        <SectionTitle>Fee Transactions</SectionTitle>
        <Button className="bg-violet-600 text-white hover:bg-violet-700" onClick={onCollect}>
          Collect Fee
        </Button>
      </div>
      <CompactTable
        headers={["Month", "Fee Type", "Amount", "Paid On", "Mode", "Receipt"]}
        rows={transactions}
      />
    </div>
  );
}

function DocumentsTab() {
  const documents = [
    ["Birth Certificate", "Received", "Verified on 10 Jun 2024"],
    ["Aadhar Card", "Received", "Verified on 10 Jun 2024"],
    ["Previous School TC", "Received", "Verified on 12 Jun 2024"],
    ["Medical Certificate", "Pending", "Reminder sent 14 Jun 2026"],
  ];
  return (
    <div className="space-y-3">
      {documents.map(([name, status, detail]) => (
        <div
          key={name}
          className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-violet-50 text-violet-600">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-xs text-gray-500">{detail}</p>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              status === "Received"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700",
            )}
          >
            {status}
          </span>
        </div>
      ))}
    </div>
  );
}

function ActivityTab({ student }: { student: Student }) {
  const activity = [
    ["Today, 10:24 AM", "Attendance marked present", "Updated by Front Office"],
    ["14 Jun 2026", "Medical document reminder sent", `Sent to ${student.parent}`],
    ["05 Jun 2026", "June tuition fee collected", "Receipt R-2606-118 generated"],
    ["02 Jun 2026", "Parent contact number updated", "Updated by Admin User"],
    ["28 May 2026", "Student profile viewed", "Viewed by Class Teacher"],
  ];
  return (
    <div className="space-y-0">
      {activity.map(([date, title, detail], index) => (
        <div key={title} className="relative flex gap-4 pb-6">
          {index < activity.length - 1 && (
            <span className="absolute left-[7px] top-4 h-full w-px bg-gray-200" />
          )}
          <span className="relative mt-1.5 size-4 flex-shrink-0 rounded-full border-4 border-violet-100 bg-violet-600" />
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-gray-500">{detail}</p>
            <p className="mt-1 text-xs text-gray-400">{date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectFeeModal({ student, onClose }: { student: Student; onClose: () => void }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] grid place-items-center bg-black/60 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Collect Fee</h3>
            <p className="text-sm text-gray-500">{student.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100"
            aria-label="Close collect fee modal"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <FormField label="Fee Type">
            <select className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm">
              <option>Tuition Fee</option>
              <option>Transport Fee</option>
              <option>Activity Fee</option>
            </select>
          </FormField>
          <FormField label="Amount">
            <Input defaultValue="4800" type="number" />
          </FormField>
          <FormField label="Payment Mode">
            <select className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm">
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Bank Transfer</option>
            </select>
          </FormField>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-violet-600 text-white hover:bg-violet-700"
            onClick={() => {
              toast.success("Fee collected and receipt generated");
              onClose();
            }}
          >
            Collect & Generate Receipt
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 mt-6 text-sm font-semibold text-gray-900">{children}</h3>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function CompactTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <TableCell key={`${cell}-${cellIndex}`}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function findStudent(name: string): Student {
  return (
    students.find((student) => student.name === name) ?? {
      id: 9999,
      name,
      parent: "Parent Record",
      admissionNo: "ADM-2026",
      grade: "Grade 6",
      section: "A",
      attendance: 72,
      feeStatus: "Overdue",
      risk: "At Risk",
      avatarColor: "#7c3aed",
    }
  );
}
