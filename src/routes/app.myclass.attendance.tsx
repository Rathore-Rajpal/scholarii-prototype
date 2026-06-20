import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Edit3,
  Eye,
  Filter,
  LayoutGrid,
  List,
  MessageSquare,
  Search,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
  Bell,
  Save,
  RotateCcw,
  Sparkles,
  Phone,
  BarChart3,
} from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/myclass/attendance")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <MyClassAttendancePage />
    </RoleGuard>
  ),
});

type TabId = "mark" | "reports" | "student" | "risk" | "analytics" | "ai";
type AttendanceStatus = "present" | "absent" | "late" | "leave";
type RiskLevel = "low" | "medium" | "high";
type StudentViewMode = "grid" | "list";
type StudentSort = "roll" | "name" | "attendance" | "risk";
type ProfileTab = "overview" | "attendance" | "remarks" | "timeline";
type ReportSort = "latest" | "attendance-high" | "attendance-low";

interface ClassStudent {
  id: string;
  roll: number;
  name: string;
  gender: "Male" | "Female";
  attendance: number;
  status: AttendanceStatus;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
  consecutiveAbsences: number;
  riskLevel: RiskLevel;
  suggestedAction: string;
  parentName: string;
  parentContact: string;
  teacherRemarks: string[];
  attendanceHistory: {
    month: string;
    present: number;
    absent: number;
    late: number;
    leave: number;
    percentage: number;
  }[];
  attendanceTimeline: { date: string; status: AttendanceStatus; note: string }[];
}

const CLASS_NAME = "8-A";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const STATUS_ORDER: AttendanceStatus[] = ["present", "absent", "late", "leave"];

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "mark", label: "Mark Attendance", icon: ClipboardCheck },
  { id: "reports", label: "Attendance Reports", icon: BarChart3 },
  { id: "student", label: "Student Attendance", icon: Users },
  { id: "risk", label: "Risk Students", icon: AlertTriangle },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "ai", label: "AI Insights", icon: Sparkles },
];

const PROFILE_TABS: { id: ProfileTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "attendance", label: "Attendance" },
  { id: "remarks", label: "Teacher Remarks" },
  { id: "timeline", label: "Timeline" },
];

const statusMeta: Record<AttendanceStatus, { label: string; color: string; bg: string }> = {
  present: { label: "Present", color: "text-emerald-700", bg: "bg-emerald-500/10" },
  absent: { label: "Absent", color: "text-red-700", bg: "bg-red-500/10" },
  late: { label: "Late", color: "text-amber-700", bg: "bg-amber-500/10" },
  leave: { label: "Leave", color: "text-violet-700", bg: "bg-violet-500/10" },
};

const riskMeta: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  low: { label: "Low", color: "text-emerald-700", bg: "bg-emerald-500/10" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-500/10" },
  high: { label: "High", color: "text-red-700", bg: "bg-red-500/10" },
};

const chartConfig = {
  percentage: { label: "Attendance %", color: "hsl(142, 76%, 36%)" },
  present: { label: "Present", color: "hsl(142, 76%, 36%)" },
  absent: { label: "Absent", color: "hsl(0, 84%, 60%)" },
  late: { label: "Late", color: "hsl(38, 92%, 50%)" },
  leave: { label: "Leave", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const HEATMAP_DATA = [
  { day: "Week 1", Mon: 95, Tue: 93, Wed: 94, Thu: 92, Fri: 96, Sat: 90 },
  { day: "Week 2", Mon: 94, Tue: 95, Wed: 96, Thu: 93, Fri: 97, Sat: 91 },
  { day: "Week 3", Mon: 92, Tue: 94, Wed: 93, Thu: 91, Fri: 95, Sat: 89 },
  { day: "Week 4", Mon: 96, Tue: 97, Wed: 95, Thu: 94, Fri: 98, Sat: 92 },
  { day: "Week 5", Mon: 93, Tue: 95, Wed: 94, Thu: 92, Fri: 96, Sat: 90 },
  { day: "Week 6", Mon: 97, Tue: 98, Wed: 96, Thu: 95, Fri: 99, Sat: 93 },
];

const MONTHLY_TRENDS = [
  { month: "Jan", percentage: 91, present: 882, absent: 54, late: 18, leave: 6 },
  { month: "Feb", percentage: 92, present: 894, absent: 50, late: 14, leave: 6 },
  { month: "Mar", percentage: 93, present: 906, absent: 44, late: 12, leave: 4 },
  { month: "Apr", percentage: 92, present: 898, absent: 48, late: 13, leave: 5 },
  { month: "May", percentage: 94, present: 912, absent: 40, late: 11, leave: 3 },
  { month: "Jun", percentage: 95, present: 918, absent: 36, late: 10, leave: 2 },
];

const WEEKLY_TRENDS = [
  { week: "Week 1", percentage: 92, present: 39, absent: 3, late: 0, leave: 0 },
  { week: "Week 2", percentage: 93, present: 39, absent: 3, late: 0, leave: 0 },
  { week: "Week 3", percentage: 91, present: 38, absent: 4, late: 0, leave: 0 },
  { week: "Week 4", percentage: 94, present: 40, absent: 2, late: 0, leave: 0 },
  { week: "Week 5", percentage: 95, present: 40, absent: 2, late: 0, leave: 0 },
  { week: "Week 6", percentage: 96, present: 41, absent: 1, late: 0, leave: 0 },
];

const LATE_TRENDS = [
  { month: "Jan", late: 18 },
  { month: "Feb", late: 16 },
  { month: "Mar", late: 12 },
  { month: "Apr", late: 13 },
  { month: "May", late: 10 },
  { month: "Jun", late: 8 },
];

const LEAVE_TRENDS = [
  { month: "Jan", leave: 6 },
  { month: "Feb", leave: 5 },
  { month: "Mar", leave: 4 },
  { month: "Apr", leave: 5 },
  { month: "May", leave: 3 },
  { month: "Jun", leave: 2 },
];

const ABSENT_TODAY_IDS = new Set(["s3", "s8", "s12", "s18"]);
const RISK_IDS = new Set(["s3", "s8", "s12", "s17"]);

const names = [
  "Aarav Sharma",
  "Priya Patel",
  "Rohan Gupta",
  "Sneha Reddy",
  "Vikram Singh",
  "Ananya Nair",
  "Karthik Menon",
  "Divya Joshi",
  "Arjun Das",
  "Neha Kapoor",
  "Rahul Verma",
  "Simran Kaur",
  "Aditya Rao",
  "Pooja Mehta",
  "Ravi Kumar",
  "Sonia Mishra",
  "Amit Tiwari",
  "Deepa Pillai",
  "Mohit Kumar",
  "Isha Jain",
  "Kabir Khan",
  "Tara Sharma",
  "Nisha Verma",
  "Kavya Iyer",
  "Aryan Singh",
  "Myra Das",
  "Disha Nair",
  "Varun Reddy",
  "Tanvi Joshi",
  "Rehan Khan",
  "Aditi Rao",
  "Ritesh Mehta",
  "Meera Kapoor",
  "Samir Verma",
  "Riya Patel",
  "Yash Gupta",
  "Khushi Sharma",
  "Omar Khan",
  "Nandini Reddy",
  "Pranav Iyer",
  "Anika Das",
  "Harsh Singh",
];

function buildClassStudents(): ClassStudent[] {
  return names.map((name, index) => {
    const roll = index + 1;
    const isRisk = RISK_IDS.has(`s${roll}`);
    const attendance = isRisk ? [72, 69, 74, 71][index % 4] : Math.min(99, 95 + (index % 4));
    const currentStatus: AttendanceStatus = ABSENT_TODAY_IDS.has(`s${roll}`) ? "absent" : "present";
    const consecutiveAbsences = isRisk ? 2 + (index % 3) : index % 9 === 0 ? 1 : 0;
    const riskLevel: RiskLevel = isRisk ? (attendance < 70 ? "high" : "medium") : "low";
    const suggestedAction = isRisk
      ? "Contact parent and schedule a short attendance review."
      : attendance >= 96
        ? "Acknowledge consistency and keep positive reinforcement going."
        : "Keep monitoring for patterns and small dips.";

    return {
      id: `s${roll}`,
      roll,
      name,
      gender: index % 2 === 0 ? "Male" : "Female",
      attendance,
      status: currentStatus,
      presentDays: Math.round((attendance / 100) * 180),
      absentDays: Math.max(0, 180 - Math.round((attendance / 100) * 180)),
      lateDays: isRisk ? 5 + (index % 4) : 1 + (index % 3),
      leaveDays: index % 5 === 0 ? 2 : 1,
      consecutiveAbsences,
      riskLevel,
      suggestedAction,
      parentName: `${name.split(" ")[0]} Parent`,
      parentContact: `+91 98765 ${String(43210 + index).slice(-5)}`,
      teacherRemarks: [
        isRisk ? "Needs immediate attendance intervention." : "Attendance is stable and improving.",
        index % 4 === 0 ? "Prompt follow-up with parent noted." : "Consistent classroom routine.",
      ],
      attendanceHistory: MONTHS.map((month, monthIndex) => {
        const base = Math.max(
          12,
          Math.min(20, Math.round((attendance / 100) * 20) + (monthIndex % 3) - 1),
        );
        const absent = Math.max(0, 20 - base - (monthIndex % 2));
        const late = monthIndex % 3 === 0 ? 1 : 0;
        const leave = monthIndex % 4 === 0 ? 1 : 0;
        return {
          month,
          present: base,
          absent,
          late,
          leave,
          percentage: Math.round((base / (base + absent + late + leave)) * 100),
        };
      }),
      attendanceTimeline: [
        {
          date: "16 Jun 2026",
          status: currentStatus,
          note: currentStatus === "absent" ? "Absent today." : "Marked present today.",
        },
        {
          date: "13 Jun 2026",
          status: isRisk ? "late" : "present",
          note: isRisk ? "Late arrival recorded." : "On time.",
        },
        {
          date: "10 Jun 2026",
          status: isRisk ? "absent" : "present",
          note: isRisk ? "Missed class, follow-up needed." : "Regular attendance.",
        },
        { date: "07 Jun 2026", status: "present", note: "Attended morning session." },
      ],
    };
  });
}

function MyClassAttendancePage() {
  const students = useMemo(() => buildClassStudents(), []);
  const [activeTab, setActiveTab] = useState<TabId>("mark");
  const [markDate, setMarkDate] = useState("2026-06-16");
  const [markSearch, setMarkSearch] = useState("");
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    students.forEach((student) => {
      initial[student.id] = student.status;
    });
    return initial;
  });
  const [savedAt, setSavedAt] = useState<string | null>("Today, 9:15 AM");
  const [reportDateFrom, setReportDateFrom] = useState("2026-06-01");
  const [reportDateTo, setReportDateTo] = useState("2026-06-16");
  const [reportMonth, setReportMonth] = useState("Jun");
  const [reportSort, setReportSort] = useState<ReportSort>("latest");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentSort, setStudentSort] = useState<StudentSort>("roll");
  const [studentViewMode, setStudentViewMode] = useState<StudentViewMode>("grid");
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id ?? "");
  const [selectedProfileTab, setSelectedProfileTab] = useState<ProfileTab>("overview");

  const classStudents = useMemo(() => {
    return students.map((student) => ({
      ...student,
      currentStatus: attendanceState[student.id] ?? student.status,
    }));
  }, [attendanceState, students]);

  const selectedStudent = useMemo(
    () =>
      classStudents.find((student) => student.id === selectedStudentId) ?? classStudents[0] ?? null,
    [classStudents, selectedStudentId],
  );

  const filteredMarkStudents = useMemo(() => {
    const query = markSearch.trim().toLowerCase();
    return classStudents.filter((student) => {
      if (!query) return true;
      return (
        student.name.toLowerCase().includes(query) ||
        String(student.roll).includes(query) ||
        student.parentName.toLowerCase().includes(query)
      );
    });
  }, [classStudents, markSearch]);

  const filteredStudentAttendance = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    const sorted = [...classStudents].filter((student) => {
      if (!query) return true;
      return (
        student.name.toLowerCase().includes(query) ||
        String(student.roll).includes(query) ||
        student.parentName.toLowerCase().includes(query)
      );
    });

    if (studentSort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (studentSort === "attendance") sorted.sort((a, b) => b.attendance - a.attendance);
    else if (studentSort === "risk")
      sorted.sort((a, b) => riskWeight(b.riskLevel) - riskWeight(a.riskLevel));
    else sorted.sort((a, b) => a.roll - b.roll);

    return sorted;
  }, [classStudents, studentSearch, studentSort]);

  const riskStudents = useMemo(
    () =>
      classStudents.filter(
        (student) => student.attendance < 75 || student.consecutiveAbsences >= 3,
      ),
    [classStudents],
  );

  const totalStudents = classStudents.length;
  const presentToday = Object.values(attendanceState).filter(
    (status) => status === "present",
  ).length;
  const absentToday = Object.values(attendanceState).filter((status) => status === "absent").length;
  const atRiskStudents = riskStudents.length;
  const averageAttendance = Math.round(
    classStudents.reduce((sum, student) => sum + student.attendance, 0) / totalStudents,
  );

  const markCounts = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, leave: 0 };
    Object.values(attendanceState).forEach((status) => {
      counts[status] += 1;
    });
    return counts;
  }, [attendanceState]);

  const attendanceDistribution = useMemo(
    () => [
      {
        name: "90% and Above",
        value: classStudents.filter((student) => student.attendance >= 90).length,
        fill: "hsl(142, 76%, 36%)",
      },
      {
        name: "75% to 89%",
        value: classStudents.filter(
          (student) => student.attendance >= 75 && student.attendance < 90,
        ).length,
        fill: "hsl(38, 92%, 50%)",
      },
      {
        name: "Below 75%",
        value: classStudents.filter((student) => student.attendance < 75).length,
        fill: "hsl(0, 84%, 60%)",
      },
    ],
    [classStudents],
  );

  const heatmapMinMax = useMemo(() => {
    const values = HEATMAP_DATA.flatMap((row) => DAY_KEYS.map((day) => row[day]));
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, []);

  const dailyReportRows = useMemo(() => {
    const rows = [
      {
        date: "16 Jun 2026",
        label: "Today",
        present: presentToday,
        absent: absentToday,
        late: markCounts.late,
        leave: markCounts.leave,
      },
      { date: "15 Jun 2026", label: "Yesterday", present: 39, absent: 2, late: 1, leave: 0 },
      { date: "14 Jun 2026", label: "Weekend review", present: 40, absent: 1, late: 1, leave: 0 },
      { date: "13 Jun 2026", label: "Friday", present: 41, absent: 1, late: 0, leave: 0 },
    ];

    if (reportSort === "attendance-high") return [...rows].sort((a, b) => b.present - a.present);
    if (reportSort === "attendance-low") return [...rows].sort((a, b) => a.present - b.present);
    return rows;
  }, [markCounts.leave, markCounts.late, absentToday, presentToday, reportSort]);

  const studentInsights = useMemo(() => {
    const low = classStudents.filter((student) => student.attendance < 75);
    const frequentAbsentees = classStudents.filter((student) => student.consecutiveAbsences >= 2);
    const improving = classStudents.filter((student) => student.attendance >= 92).slice(0, 5);
    const likelyToDrop = classStudents
      .filter((student) => student.attendance >= 75 && student.attendance < 82)
      .slice(0, 5);

    return {
      low,
      frequentAbsentees,
      improving,
      likelyToDrop,
    };
  }, [classStudents]);

  const markStudent = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((previous) => ({ ...previous, [studentId]: status }));
  };

  const applyBulk = (status: AttendanceStatus) => {
    setAttendanceState(() => {
      const next: Record<string, AttendanceStatus> = {};
      classStudents.forEach((student) => {
        next[student.id] = status;
      });
      return next;
    });
    setSavedAt(null);
  };

  const resetBulk = () => {
    const next: Record<string, AttendanceStatus> = {};
    students.forEach((student) => {
      next[student.id] = student.status;
    });
    setAttendanceState(next);
    setSavedAt("Today, 9:15 AM");
  };

  const saveAttendance = () => {
    setSavedAt("Just now");
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Manage attendance for Class 8-A only."
        action={
          <Button size="sm" className="bg-brand-gradient text-white border-0">
            <ClipboardCheck className="size-4 mr-1" />
            Mark Attendance
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-sky-500/10 grid place-items-center">
              <Users className="size-5 text-sky-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Students</div>
              <div className="text-xl font-semibold">{totalStudents} Students</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Present Today</div>
              <div className="text-xl font-semibold">{presentToday} Students</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center">
              <UserX className="size-5 text-red-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Absent Today</div>
              <div className="text-xl font-semibold">{absentToday} Students</div>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-2 border-amber-200/70 dark:border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 grid place-items-center">
              <AlertTriangle className="size-5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">At-Risk Students</div>
              <div className="text-xl font-semibold">{atRiskStudents} Students</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
              <TrendingUp className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Average Attendance</div>
              <div className="text-xl font-semibold">{averageAttendance}%</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-1">
          {TABS.map((tab) => (
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
      </Card>

      <div className="space-y-4 pb-4">
        {activeTab === "mark" && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={markDate}
                      onChange={(event) => setMarkDate(event.target.value)}
                      className="bg-transparent outline-none"
                    />
                  </div>
                  <div className="relative min-w-[240px] flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search students..."
                      value={markSearch}
                      onChange={(event) => setMarkSearch(event.target.value)}
                    />
                  </div>
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    Class {CLASS_NAME}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <Button variant="outline" size="sm" onClick={() => applyBulk("present")}>
                    <CheckCircle2 className="mr-2 size-4" />
                    Mark All Present
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => applyBulk("absent")}>
                    <UserX className="mr-2 size-4" />
                    Mark All Absent
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => applyBulk("late")}>
                    <Clock3 className="mr-2 size-4" />
                    Mark All Late
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetBulk}>
                    <RotateCcw className="mr-2 size-4" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveAttendance}
                    className="bg-brand-gradient text-white border-0"
                  >
                    <Save className="mr-2 size-4" />
                    Save Attendance
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Class: {CLASS_NAME}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>Selected date: {markDate}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{savedAt ? `Saved ${savedAt}` : "Unsaved changes"}</span>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                        Roll Number
                      </th>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                        Student Name
                      </th>
                      <th className="p-3 text-center text-xs font-medium text-muted-foreground">
                        Attendance %
                      </th>
                      <th className="p-3 text-center text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="p-3 text-right text-xs font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMarkStudents.map((student) => {
                      const currentStatus = attendanceState[student.id] ?? "present";
                      return (
                        <tr
                          key={student.id}
                          className="border-t border-border/50 transition-colors hover:bg-muted/20"
                        >
                          <td className="p-3 text-xs font-medium text-muted-foreground">
                            {student.roll}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-8">
                                <AvatarFallback className="bg-sky-500 text-white">
                                  {student.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {student.parentName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={cn(
                                "font-semibold",
                                student.attendance >= 95
                                  ? "text-emerald-700"
                                  : student.attendance >= 75
                                    ? "text-amber-700"
                                    : "text-red-700",
                              )}
                            >
                              {student.attendance}%
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap justify-center gap-1.5">
                              {STATUS_ORDER.map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onClick={() => markStudent(student.id, status)}
                                  className={cn(
                                    "rounded-md border px-2.5 py-1 text-[10px] font-medium transition-all",
                                    currentStatus === status
                                      ? `${statusMeta[status].bg} ${statusMeta[status].color} border-transparent`
                                      : "border-border/60 text-muted-foreground hover:bg-muted",
                                  )}
                                >
                                  {statusMeta[status].label}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudentId(student.id);
                                  setSelectedProfileTab("remarks");
                                  setActiveTab("student");
                                }}
                              >
                                <MessageSquare className="mr-2 size-4" />
                                Add Remark
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudentId(student.id);
                                  setSelectedProfileTab("overview");
                                  setActiveTab("student");
                                }}
                              >
                                <Eye className="mr-2 size-4" />
                                View Student Profile
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Present</p>
                <div className="mt-2 text-2xl font-bold text-emerald-700">{markCounts.present}</div>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Absent</p>
                <div className="mt-2 text-2xl font-bold text-red-700">{markCounts.absent}</div>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Late</p>
                <div className="mt-2 text-2xl font-bold text-amber-700">{markCounts.late}</div>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-muted-foreground">Leave</p>
                <div className="mt-2 text-2xl font-bold text-violet-700">{markCounts.leave}</div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={reportDateFrom}
                    onChange={(event) => setReportDateFrom(event.target.value)}
                    className="bg-transparent outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={reportDateTo}
                    onChange={(event) => setReportDateTo(event.target.value)}
                    className="bg-transparent outline-none"
                  />
                </div>
                <Select value={reportMonth} onValueChange={setReportMonth}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={reportSort}
                  onValueChange={(value) => setReportSort(value as ReportSort)}
                >
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="attendance-high">Attendance High to Low</SelectItem>
                    <SelectItem value="attendance-low">Attendance Low to High</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="ml-auto">
                  <Filter className="mr-2 size-4" />
                  Apply Filters
                </Button>
              </div>
            </Card>

            <div className="grid gap-3 lg:grid-cols-3">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Daily Report</p>
                    <div className="mt-1 text-lg font-semibold">16 Jun 2026</div>
                  </div>
                  <ClipboardCheck className="size-5 text-emerald-600" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <SummaryStat label="Present" value={`${presentToday}`} tone="text-emerald-700" />
                  <SummaryStat label="Absent" value={`${absentToday}`} tone="text-red-700" />
                  <SummaryStat label="Late" value={`${markCounts.late}`} tone="text-amber-700" />
                  <SummaryStat label="Leave" value={`${markCounts.leave}`} tone="text-violet-700" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Weekly Report</p>
                    <div className="mt-1 text-lg font-semibold">This Week</div>
                  </div>
                  <TrendingUp className="size-5 text-sky-600" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <SummaryStat label="Average" value="94%" tone="text-emerald-700" />
                  <SummaryStat label="Best Day" value="Friday" tone="text-sky-700" />
                  <SummaryStat label="Absence" value="2" tone="text-red-700" />
                  <SummaryStat label="Late" value="0" tone="text-amber-700" />
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Report</p>
                    <div className="mt-1 text-lg font-semibold">{reportMonth} Summary</div>
                  </div>
                  <BarChart3 className="size-5 text-violet-600" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <SummaryStat label="Improvement" value="+3%" tone="text-emerald-700" />
                  <SummaryStat label="Target" value="95%" tone="text-sky-700" />
                  <SummaryStat label="Interventions" value="4" tone="text-amber-700" />
                  <SummaryStat label="Reports" value="3" tone="text-violet-700" />
                </div>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Monthly Attendance Trend</h3>
                <ChartContainer config={chartConfig} className="mt-4 h-[260px] w-full">
                  <LineChart
                    data={MONTHLY_TRENDS}
                    margin={{ top: 5, right: 12, left: -12, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      domain={[85, 100]}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="var(--color-percentage)"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Weekly Attendance Trend</h3>
                <ChartContainer config={chartConfig} className="mt-4 h-[260px] w-full">
                  <BarChart
                    data={WEEKLY_TRENDS}
                    margin={{ top: 5, right: 12, left: -12, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/50"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      domain={[85, 100]}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="percentage"
                      fill="var(--color-percentage)"
                      radius={[6, 6, 0, 0]}
                      barSize={28}
                    />
                  </BarChart>
                </ChartContainer>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="text-sm font-semibold">Attendance Heatmap</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-xs font-medium text-muted-foreground">
                        Week
                      </th>
                      {DAY_KEYS.map((day) => (
                        <th
                          key={day}
                          className="p-2 text-center text-xs font-medium text-muted-foreground"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HEATMAP_DATA.map((row) => (
                      <tr key={row.day}>
                        <td className="p-2 text-xs font-medium text-muted-foreground">{row.day}</td>
                        {DAY_KEYS.map((day) => {
                          const value = row[day];
                          const ratio =
                            (value - heatmapMinMax.min) /
                            (heatmapMinMax.max - heatmapMinMax.min || 1);
                          return (
                            <td key={day} className="p-2 text-center">
                              <div
                                className={cn(
                                  "grid h-8 place-items-center rounded-md text-[10px] font-semibold text-white",
                                  ratio > 0.7
                                    ? "bg-emerald-500"
                                    : ratio > 0.4
                                      ? "bg-emerald-400"
                                      : "bg-emerald-300",
                                )}
                              >
                                {value}%
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold">Daily Report Log</h3>
              <div className="mt-4 space-y-2">
                {dailyReportRows.map((row) => (
                  <div
                    key={row.date}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 px-4 py-3"
                  >
                    <div className="min-w-[140px]">
                      <div className="text-sm font-medium">{row.date}</div>
                      <div className="text-xs text-muted-foreground">{row.label}</div>
                    </div>
                    <div className="grid flex-1 grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                      <SummaryStat
                        label="Present"
                        value={`${row.present}`}
                        tone="text-emerald-700"
                      />
                      <SummaryStat label="Absent" value={`${row.absent}`} tone="text-red-700" />
                      <SummaryStat label="Late" value={`${row.late}`} tone="text-amber-700" />
                      <SummaryStat label="Leave" value={`${row.leave}`} tone="text-violet-700" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "student" && (
          <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[220px] flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search students..."
                      value={studentSearch}
                      onChange={(event) => setStudentSearch(event.target.value)}
                    />
                  </div>
                  <Select
                    value={studentSort}
                    onValueChange={(value) => setStudentSort(value as StudentSort)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roll">Roll Number</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="risk">Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant={studentViewMode === "grid" ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setStudentViewMode("grid")}
                    >
                      <LayoutGrid className="mr-2 size-4" />
                      Grid
                    </Button>
                    <Button
                      variant={studentViewMode === "list" ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setStudentViewMode("list")}
                    >
                      <List className="mr-2 size-4" />
                      List
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                {studentViewMode === "grid" ? (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredStudentAttendance.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => {
                          setSelectedStudentId(student.id);
                          setSelectedProfileTab("overview");
                        }}
                        className={cn(
                          "rounded-2xl border p-4 text-left transition-all",
                          selectedStudent?.id === student.id
                            ? "border-sky-500 bg-sky-500/5 shadow-sm"
                            : "border-border/60 hover:border-border hover:bg-muted/20",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarFallback className="bg-sky-500 text-white">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium">{student.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Roll #{student.roll}
                            </div>
                          </div>
                          <Badge
                            className={cn(
                              "shrink-0",
                              riskMeta[student.riskLevel].bg,
                              riskMeta[student.riskLevel].color,
                            )}
                          >
                            {riskMeta[student.riskLevel].label}
                          </Badge>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                          <StatBlock label="Present %" value={`${student.attendance}%`} />
                          <StatBlock
                            label="Absent %"
                            value={`${Math.max(0, 100 - student.attendance)}%`}
                          />
                          <StatBlock label="Late %" value={`${Math.max(0, student.lateDays)} d`} />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                            Roll
                          </th>
                          <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                            Student
                          </th>
                          <th className="p-3 text-center text-xs font-medium text-muted-foreground">
                            Attendance
                          </th>
                          <th className="p-3 text-center text-xs font-medium text-muted-foreground">
                            Present
                          </th>
                          <th className="p-3 text-center text-xs font-medium text-muted-foreground">
                            Absent
                          </th>
                          <th className="p-3 text-center text-xs font-medium text-muted-foreground">
                            Late
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudentAttendance.map((student) => (
                          <tr
                            key={student.id}
                            onClick={() => {
                              setSelectedStudentId(student.id);
                              setSelectedProfileTab("overview");
                            }}
                            className={cn(
                              "cursor-pointer border-t border-border/50 hover:bg-muted/20",
                              selectedStudent?.id === student.id && "bg-sky-500/5",
                            )}
                          >
                            <td className="p-3 text-xs text-muted-foreground">{student.roll}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="size-8">
                                  <AvatarFallback className="bg-sky-500 text-white">
                                    {student.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {student.parentName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center font-semibold">{student.attendance}%</td>
                            <td className="p-3 text-center text-emerald-700">
                              {student.presentDays}
                            </td>
                            <td className="p-3 text-center text-red-700">{student.absentDays}</td>
                            <td className="p-3 text-center text-amber-700">{student.lateDays}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>

            <Card className="p-4">
              {selectedStudent ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-sky-500 text-white">
                        {selectedStudent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="text-lg font-semibold">{selectedStudent.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Roll #{selectedStudent.roll} · Class {CLASS_NAME}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {selectedStudent.parentName} · {selectedStudent.parentContact}
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        riskMeta[selectedStudent.riskLevel].bg,
                        riskMeta[selectedStudent.riskLevel].color,
                      )}
                    >
                      {riskMeta[selectedStudent.riskLevel].label} risk
                    </Badge>
                  </div>

                  <Tabs
                    value={selectedProfileTab}
                    onValueChange={(value) => setSelectedProfileTab(value as ProfileTab)}
                    className="w-full"
                  >
                    <TabsList className="h-auto flex-wrap gap-2">
                      {PROFILE_TABS.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id}>
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <ProfileStat label="Present %" value={`${selectedStudent.attendance}%`} />
                        <ProfileStat
                          label="Absent %"
                          value={`${Math.max(0, 100 - selectedStudent.attendance)}%`}
                        />
                        <ProfileStat
                          label="Late %"
                          value={`${Math.min(20, selectedStudent.lateDays * 2)}%`}
                        />
                        <ProfileStat
                          label="Leave %"
                          value={`${Math.min(15, selectedStudent.leaveDays * 3)}%`}
                        />
                      </div>
                      <Card className="p-4">
                        <h4 className="text-sm font-semibold">Attendance Summary</h4>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                          <ProfileStat
                            label="Current Status"
                            value={statusMeta[selectedStudent.currentStatus].label}
                          />
                          <ProfileStat
                            label="Consecutive Absences"
                            value={`${selectedStudent.consecutiveAbsences}`}
                          />
                          <ProfileStat
                            label="Risk Level"
                            value={riskMeta[selectedStudent.riskLevel].label}
                          />
                          <ProfileStat
                            label="Suggested Action"
                            value={selectedStudent.suggestedAction}
                          />
                        </div>
                      </Card>
                      <Card className="p-4">
                        <h4 className="text-sm font-semibold">Monthly Attendance</h4>
                        <ChartContainer config={chartConfig} className="mt-4 h-[220px] w-full">
                          <LineChart
                            data={selectedStudent.attendanceHistory}
                            margin={{ top: 5, right: 12, left: -12, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                            <XAxis
                              dataKey="month"
                              tick={{ fontSize: 11 }}
                              className="text-muted-foreground"
                            />
                            <YAxis
                              domain={[10, 20]}
                              tick={{ fontSize: 11 }}
                              className="text-muted-foreground"
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                              type="monotone"
                              dataKey="percentage"
                              stroke="var(--color-percentage)"
                              strokeWidth={2.5}
                              dot={{ r: 3 }}
                            />
                          </LineChart>
                        </ChartContainer>
                      </Card>
                    </TabsContent>

                    <TabsContent value="attendance" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
                        <ProfileStat
                          label="Present Days"
                          value={`${selectedStudent.presentDays}`}
                        />
                        <ProfileStat label="Absent Days" value={`${selectedStudent.absentDays}`} />
                        <ProfileStat label="Late Days" value={`${selectedStudent.lateDays}`} />
                        <ProfileStat label="Leave Days" value={`${selectedStudent.leaveDays}`} />
                      </div>
                      <Card className="p-4">
                        <h4 className="text-sm font-semibold">Attendance Breakdown</h4>
                        <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
                          <ProfileStat label="Present %" value={`${selectedStudent.attendance}%`} />
                          <ProfileStat
                            label="Absent %"
                            value={`${Math.max(0, 100 - selectedStudent.attendance)}%`}
                          />
                          <ProfileStat
                            label="Late %"
                            value={`${Math.max(0, selectedStudent.lateDays)}%`}
                          />
                          <ProfileStat
                            label="Leave %"
                            value={`${Math.max(0, selectedStudent.leaveDays)}%`}
                          />
                        </div>
                      </Card>
                      <Card className="p-4">
                        <h4 className="text-sm font-semibold">Attendance Trend</h4>
                        <ChartContainer config={chartConfig} className="mt-4 h-[220px] w-full">
                          <LineChart
                            data={selectedStudent.attendanceHistory.map((item) => ({
                              month: item.month,
                              percentage: item.percentage,
                            }))}
                            margin={{ top: 5, right: 12, left: -12, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                            <XAxis
                              dataKey="month"
                              tick={{ fontSize: 11 }}
                              className="text-muted-foreground"
                            />
                            <YAxis
                              domain={[10, 20]}
                              tick={{ fontSize: 11 }}
                              className="text-muted-foreground"
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line
                              type="monotone"
                              dataKey="percentage"
                              stroke="var(--color-percentage)"
                              strokeWidth={2.5}
                              dot={{ r: 3 }}
                            />
                          </LineChart>
                        </ChartContainer>
                      </Card>
                    </TabsContent>

                    <TabsContent value="remarks" className="mt-4 space-y-4">
                      <Card className="p-4">
                        <h4 className="text-sm font-semibold">Teacher Remarks</h4>
                        <div className="mt-4 space-y-2">
                          {selectedStudent.teacherRemarks.map((remark) => (
                            <div
                              key={remark}
                              className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-sm text-muted-foreground"
                            >
                              {remark}
                            </div>
                          ))}
                        </div>
                      </Card>
                      <Card className="p-4">
                        <h4 className="text-sm font-semibold">Add Remark</h4>
                        <div className="mt-3 space-y-3">
                          <Input placeholder="Write a short attendance remark..." />
                          <div className="flex justify-end">
                            <Button>
                              <Save className="mr-2 size-4" />
                              Save Remark
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="timeline" className="mt-4 space-y-3">
                      {selectedStudent.attendanceTimeline.map((entry) => (
                        <div
                          key={`${entry.date}-${entry.note}`}
                          className="flex items-start gap-3 rounded-xl border border-border/60 p-3"
                        >
                          <div
                            className={cn(
                              "mt-0.5 size-2.5 rounded-full",
                              statusMeta[entry.status].bg,
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-medium">{entry.date}</div>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "rounded-full",
                                  statusMeta[entry.status].bg,
                                  statusMeta[entry.status].color,
                                )}
                              >
                                {statusMeta[entry.status].label}
                              </Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{entry.note}</p>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="grid h-full place-items-center rounded-2xl border border-dashed border-border/60 bg-muted/10 p-8 text-center text-sm text-muted-foreground">
                  Select a student to open their attendance workspace.
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "risk" && (
          <div className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-2">
              {riskStudents.map((student) => (
                <Card key={student.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-red-500 text-white">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Roll #{student.roll} · {CLASS_NAME}
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            riskMeta[student.riskLevel].bg,
                            riskMeta[student.riskLevel].color,
                          )}
                        >
                          {riskMeta[student.riskLevel].label} risk
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                        <ProfileStat label="Attendance" value={`${student.attendance}%`} />
                        <ProfileStat label="Consecutive" value={`${student.consecutiveAbsences}`} />
                        <ProfileStat label="Action" value={student.suggestedAction} />
                      </div>
                      <div className="mt-3 rounded-xl bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground">
                        Suggested action: {student.suggestedAction}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <Button variant="outline" size="sm">
                      <Phone className="mr-2 size-4" />
                      Contact Parent
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 size-4" />
                      Add Remark
                    </Button>
                    <Button variant="outline" size="sm">
                      <CalendarDays className="mr-2 size-4" />
                      Schedule Meeting
                    </Button>
                    <Button variant="outline" size="sm">
                      <Brain className="mr-2 size-4" />
                      Generate AI Suggestions
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Monthly Attendance Trend</h3>
                <ChartContainer config={chartConfig} className="mt-4 h-[260px] w-full">
                  <LineChart
                    data={MONTHLY_TRENDS}
                    margin={{ top: 5, right: 12, left: -12, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      domain={[85, 100]}
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="var(--color-percentage)"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Attendance Distribution</h3>
                <ChartContainer config={chartConfig} className="mt-4 h-[260px] w-full">
                  <PieChart>
                    <Pie
                      data={attendanceDistribution}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {attendanceDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {attendanceDistribution.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                      />
                      {entry.name} ({entry.value})
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Attendance Heatmap</h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-xs font-medium text-muted-foreground">
                          Week
                        </th>
                        {DAY_KEYS.map((day) => (
                          <th
                            key={day}
                            className="p-2 text-center text-xs font-medium text-muted-foreground"
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HEATMAP_DATA.map((row) => (
                        <tr key={row.day}>
                          <td className="p-2 text-xs font-medium text-muted-foreground">
                            {row.day}
                          </td>
                          {DAY_KEYS.map((day) => {
                            const value = row[day];
                            const intensity =
                              (value - heatmapMinMax.min) /
                              (heatmapMinMax.max - heatmapMinMax.min || 1);
                            return (
                              <td key={day} className="p-2 text-center">
                                <div
                                  className={cn(
                                    "grid h-8 place-items-center rounded-md text-[10px] font-semibold text-white",
                                    intensity > 0.7
                                      ? "bg-emerald-500"
                                      : intensity > 0.4
                                        ? "bg-emerald-400"
                                        : "bg-emerald-300",
                                  )}
                                >
                                  {value}%
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="text-sm font-semibold">Best Attendance Students</h3>
                  <div className="mt-4 space-y-3">
                    {[...classStudents]
                      .sort((a, b) => b.attendance - a.attendance)
                      .slice(0, 5)
                      .map((student, index) => (
                        <div key={student.id} className="flex items-center gap-3">
                          <div className="w-5 text-xs font-bold text-muted-foreground">
                            {index + 1}
                          </div>
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-emerald-500 text-white">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{student.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Roll #{student.roll}
                            </div>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-700">
                            {student.attendance}%
                          </Badge>
                        </div>
                      ))}
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-semibold">Worst Attendance Students</h3>
                  <div className="mt-4 space-y-3">
                    {[...classStudents]
                      .sort((a, b) => a.attendance - b.attendance)
                      .slice(0, 5)
                      .map((student, index) => (
                        <div key={student.id} className="flex items-center gap-3">
                          <div className="w-5 text-xs font-bold text-muted-foreground">
                            {index + 1}
                          </div>
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-red-500 text-white">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{student.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Roll #{student.roll}
                            </div>
                          </div>
                          <Badge className="bg-red-500/10 text-red-700">
                            {student.attendance}%
                          </Badge>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Late Arrival Trends</h3>
                <ChartContainer config={chartConfig} className="mt-4 h-[220px] w-full">
                  <BarChart data={LATE_TRENDS} margin={{ top: 5, right: 12, left: -12, bottom: 0 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/50"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="late"
                      fill="var(--color-late)"
                      radius={[6, 6, 0, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ChartContainer>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold">Leave Trends</h3>
                <ChartContainer config={chartConfig} className="mt-4 h-[220px] w-full">
                  <LineChart
                    data={LEAVE_TRENDS}
                    margin={{ top: 5, right: 12, left: -12, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      className="text-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="leave"
                      stroke="var(--color-leave)"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <InsightCard
                title="Students likely to fall below 75%"
                icon={AlertTriangle}
                tone="amber"
                items={studentInsights.likelyToDrop.map(
                  (student) => `${student.name} (${student.attendance}%)`,
                )}
              />
              <InsightCard
                title="Frequently absent students"
                icon={Bell}
                tone="red"
                items={studentInsights.frequentAbsentees.map(
                  (student) =>
                    `${student.name} · ${student.consecutiveAbsences} consecutive absences`,
                )}
              />
              <InsightCard
                title="Students improving attendance"
                icon={TrendingUp}
                tone="emerald"
                items={studentInsights.improving.map(
                  (student) => `${student.name} (${student.attendance}%)`,
                )}
              />
              <InsightCard
                title="Attendance patterns"
                icon={Sparkles}
                tone="sky"
                items={[
                  "Monday attendance is slightly lower than other weekdays.",
                  "Late arrivals trend down after Wednesday.",
                  "Leave requests peak near month-end.",
                  "Class 8-A remains above the 94% target average.",
                ]}
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <InsightCard
                title="Suggested interventions"
                icon={Brain}
                tone="violet"
                items={[
                  "Run a short attendance call with families of risk students.",
                  "Pair the two lowest attendance students with a buddy system.",
                  "Use daily reminders before first period for one week.",
                  "Review transport or timing issues for repeat absentees.",
                ]}
              />
              <InsightCard
                title="Parent communication suggestions"
                icon={MessageSquare}
                tone="sky"
                items={[
                  "Send a supportive note before the next attendance dip.",
                  "Share a weekly progress summary with parents of risk students.",
                  "Invite parents for a short meeting when absences reach 3 days.",
                  "Use positive reinforcement for students above 96%.",
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-1 font-semibold", tone)}>{value}</div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-2">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold leading-5">{value}</div>
    </div>
  );
}

function InsightCard({
  title,
  icon: Icon,
  tone,
  items,
}: {
  title: string;
  icon: typeof AlertTriangle;
  tone: "amber" | "red" | "emerald" | "sky" | "violet";
  items: string[];
}) {
  const tones = {
    amber: "bg-amber-500/10 text-amber-700 border-amber-200",
    red: "bg-red-500/10 text-red-700 border-red-200",
    emerald: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    sky: "bg-sky-500/10 text-sky-700 border-sky-200",
    violet: "bg-violet-500/10 text-violet-700 border-violet-200",
  } as const;

  return (
    <Card className={cn("p-4", tones[tone])}>
      <div className="flex items-center gap-3">
        <div className="grid size-8 place-items-center rounded-lg bg-background/70">
          <Icon className="size-4" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl bg-background/70 px-3 py-2 text-xs leading-5 text-muted-foreground"
          >
            {item}
          </div>
        ))}
      </div>
    </Card>
  );
}

function riskWeight(level: RiskLevel) {
  if (level === "high") return 3;
  if (level === "medium") return 2;
  return 1;
}
