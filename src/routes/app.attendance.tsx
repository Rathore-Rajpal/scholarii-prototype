import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { TeacherPageLayout, TabButton, KpiCard } from "@/components/scholarii/TeacherPageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid,
  PolarAngleAxis, Radar as RechartsRadar,
} from "recharts";
import {
  Users, CheckCircle2, XCircle, AlertTriangle, TrendingUp, TrendingDown, Search,
  Calendar, Download, Bell, FileText, Sparkles, ClipboardCheck,
  Clock, ChevronRight, ArrowUpRight, ArrowDownRight, Target,
  UserCheck, Filter, RotateCcw, Save, BarChart3, Eye, Phone,
  Mail, MessageSquare, AlertCircle, Zap, BookOpen,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ATTENDANCE_STUDENTS,
  DAILY_ATTENDANCE_HISTORY,
  RISK_STUDENTS,
  MONTHLY_TRENDS,
  WEEKLY_TRENDS,
  HEATMAP_DATA,
  CLASS_COMPARISON,
  TOP_ATTENDEES,
  MOST_ABSENT_STUDENTS,
  ATTENDANCE_AI_INSIGHTS,
  TEACHER_CLASSES,
  TEACHER_SUBJECTS,
  TEACHER_LECTURES,
  getStudentAttendanceHistory,
  type AttendanceStudent,
} from "@/lib/scholarii/teacher-attendance-mock-data";

export const Route = createFileRoute("/app/attendance")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <AttendancePage />
    </RoleGuard>
  ),
});

type TabId = "mark" | "reports" | "student" | "risk" | "analytics";

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "mark", label: "Mark Attendance", icon: ClipboardCheck },
  { id: "reports", label: "Attendance Reports", icon: BarChart3 },
  { id: "student", label: "Student Attendance", icon: Users },
  { id: "risk", label: "Risk Students", icon: AlertTriangle },
  { id: "analytics", label: "Attendance Analytics", icon: TrendingUp },
];

const monthlyChartConfig = {
  present: { label: "Present", color: "hsl(142, 76%, 36%)" },
  absent: { label: "Absent", color: "hsl(0, 84%, 60%)" },
  late: { label: "Late", color: "hsl(38, 92%, 50%)" },
} satisfies ChartConfig;

const weeklyChartConfig = {
  percentage: { label: "Attendance %", color: "hsl(142, 76%, 36%)" },
} satisfies ChartConfig;

const distributionChartConfig = {
  value: { label: "Students", color: "hsl(142, 76%, 36%)" },
} satisfies ChartConfig;

const classChartConfig = {
  percentage: { label: "Attendance %", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const radarConfig = {
  a: { label: "Mon", color: "hsl(142, 76%, 36%)" },
  b: { label: "Tue", color: "hsl(262, 83%, 58%)" },
} satisfies ChartConfig;

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  present: { label: "Present", color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  absent: { label: "Absent", color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/20" },
  late: { label: "Late", color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  leave: { label: "Leave", color: "text-violet-600", bg: "bg-violet-500/10", border: "border-violet-500/20" },
};

function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabId>("mark");
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("8-A");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [selectedLecture, setSelectedLecture] = useState("L1");
  const [selectedDate, setSelectedDate] = useState("2026-06-16");
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceStudent["status"]>>(() => {
    const initial: Record<string, AttendanceStudent["status"]> = {};
    ATTENDANCE_STUDENTS.forEach((s) => { initial[s.id] = s.status; });
    return initial;
  });
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [reportFilterMonth, setReportFilterMonth] = useState("all");
  const [reportFilterStatus, setReportFilterStatus] = useState("all");

  const filteredStudents = useMemo(() => {
    let result = [...ATTENDANCE_STUDENTS];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || String(s.roll).includes(q));
    }
    return result;
  }, [search]);

  const filteredReportDays = useMemo(() => {
    let result = [...DAILY_ATTENDANCE_HISTORY];
    if (reportFilterMonth !== "all") {
      const monthNum = parseInt(reportFilterMonth);
      result = result.filter((d) => {
        const date = new Date(d.date);
        return date.getMonth() + 1 === monthNum;
      });
    }
    if (reportFilterStatus !== "all") {
      result = result.filter((d) => {
        if (reportFilterStatus === "present") return d.present > 0;
        if (reportFilterStatus === "absent") return d.absent > 0;
        return true;
      });
    }
    return result;
  }, [reportFilterMonth, reportFilterStatus]);

  const filteredStudentList = useMemo(() => {
    let result = [...ATTENDANCE_STUDENTS];
    if (studentSearch) {
      const q = studentSearch.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q) || String(s.roll).includes(q));
    }
    return result;
  }, [studentSearch]);

  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return ATTENDANCE_STUDENTS.find((s) => s.id === selectedStudentId) || null;
  }, [selectedStudentId]);

  const totalStudents = ATTENDANCE_STUDENTS.length;
  const presentToday = Object.values(attendanceRecords).filter((s) => s === "present").length;
  const absentToday = Object.values(attendanceRecords).filter((s) => s === "absent").length;
  const atRiskCount = RISK_STUDENTS.length;
  const avgAttendance = Math.round(ATTENDANCE_STUDENTS.reduce((sum, s) => sum + s.attendance, 0) / totalStudents);

  const handleAttendanceChange = useCallback((studentId: string, status: AttendanceStudent["status"]) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  }, []);

  const markAllPresent = useCallback(() => {
    const updated: Record<string, AttendanceStudent["status"]> = {};
    ATTENDANCE_STUDENTS.forEach((s) => { updated[s.id] = "present"; });
    setAttendanceRecords(updated);
  }, []);

  const markAllAbsent = useCallback(() => {
    const updated: Record<string, AttendanceStudent["status"]> = {};
    ATTENDANCE_STUDENTS.forEach((s) => { updated[s.id] = "absent"; });
    setAttendanceRecords(updated);
  }, []);

  const resetAttendance = useCallback(() => {
    const initial: Record<string, AttendanceStudent["status"]> = {};
    ATTENDANCE_STUDENTS.forEach((s) => { initial[s.id] = s.status; });
    setAttendanceRecords(initial);
  }, []);

  const distributionData = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, leave: 0 };
    Object.values(attendanceRecords).forEach((s) => {
      if (s === "present") counts.present++;
      else if (s === "absent") counts.absent++;
      else if (s === "late") counts.late++;
      else if (s === "leave") counts.leave++;
    });
    return [
      { name: "Present", value: counts.present, fill: "hsl(142, 76%, 36%)" },
      { name: "Absent", value: counts.absent, fill: "hsl(0, 84%, 60%)" },
      { name: "Late", value: counts.late, fill: "hsl(38, 92%, 50%)" },
      { name: "Leave", value: counts.leave, fill: "hsl(262, 83%, 58%)" },
    ];
  }, [attendanceRecords]);

  const heatmapMaxMin = useMemo(() => {
    let max = 0; let min = 100;
    HEATMAP_DATA.forEach((row) => {
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
        const val = row[day as keyof typeof row] as number;
        if (val > max) max = val;
        if (val < min) min = val;
      });
    });
    return { max, min };
  }, []);

  return (
    <TeacherPageLayout
      title="Attendance"
      subtitle="Manage and monitor attendance across your classes."
      kpiCards={
        <>
          <KpiCard label="Total Students" value={totalStudents} icon={Users} color="text-purple-600 bg-purple-500/10" />
          <KpiCard label="Present Today" value={presentToday} icon={CheckCircle2} color="text-emerald-600 bg-emerald-500/10" />
          <KpiCard label="Absent Today" value={absentToday} icon={XCircle} color="text-red-600 bg-red-500/10" />
          <KpiCard label="At-Risk Students" value={atRiskCount} icon={AlertTriangle} color="text-amber-600 bg-amber-500/10" />
          <KpiCard label="Average Attendance" value={`${avgAttendance}%`} icon={TrendingUp} color="text-emerald-600 bg-emerald-500/10" />
        </>
      }
      tabs={
        <>
          {TABS.map((tab) => (
            <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} icon={tab.icon} label={tab.label} />
          ))}
        </>
      }
    >
      {/* ===================== TAB 1: MARK ATTENDANCE ===================== */}
      {activeTab === "mark" && (
          <div className="space-y-4">
            {/* Controls */}
            <Card className="p-4 border-2 border-border/60">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-border bg-background text-sm" />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-28"><SelectValue placeholder="Class" /></SelectTrigger>
                  <SelectContent>{TEACHER_CLASSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Subject" /></SelectTrigger>
                  <SelectContent>{TEACHER_SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={selectedLecture} onValueChange={setSelectedLecture}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Lecture" /></SelectTrigger>
                  <SelectContent>{TEACHER_LECTURES.map((l) => <SelectItem key={l.id} value={l.id}>{l.time} — {l.class}</SelectItem>)}</SelectContent>
                </Select>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
              </div>
            </Card>

            {/* Bulk Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={markAllPresent}>
                <CheckCircle2 className="size-3.5 mr-1 text-emerald-600" />Mark All Present
              </Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={markAllAbsent}>
                <XCircle className="size-3.5 mr-1 text-red-600" />Mark All Absent
              </Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={resetAttendance}>
                <RotateCcw className="size-3.5 mr-1" />Reset
              </Button>
              <div className="ml-auto">
                <Button size="sm" className="text-xs bg-brand-gradient text-white border-0">
                  <Save className="size-3.5 mr-1" />Save Attendance
                </Button>
              </div>
            </div>

            {/* Student List */}
            <Card className="border-2 border-border/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground w-12">Roll</th>
                      <th className="text-left p-3 text-xs font-medium text-muted-foreground">Student</th>
                      <th className="text-center p-3 text-xs font-medium text-muted-foreground">Attendance %</th>
                      <th className="text-center p-3 text-xs font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => {
                      const currentStatus = attendanceRecords[student.id];
                      return (
                        <tr key={student.id} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-3 text-xs text-muted-foreground">{student.roll}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="size-7">
                                <AvatarFallback className={cn("text-[10px] text-white",
                                  student.attendance >= 90 ? "bg-emerald-500" :
                                  student.attendance >= 80 ? "bg-amber-500" : "bg-red-500"
                                )}>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{student.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center text-xs font-medium">{student.attendance}%</td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1.5">
                              {(["present", "absent", "late", "leave"] as const).map((status) => {
                                const cfg = statusConfig[status];
                                const isActive = currentStatus === status;
                                return (
                                  <button key={status} onClick={() => handleAttendanceChange(student.id, status)} className={cn(
                                    "px-2.5 py-1 rounded-md text-[10px] font-medium transition-all border",
                                    isActive ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "border-transparent text-muted-foreground hover:bg-muted",
                                  )}>
                                    {cfg.label}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Quick Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Present", count: distributionData[0].value, color: "text-emerald-600 bg-emerald-500/10" },
                { label: "Absent", count: distributionData[1].value, color: "text-red-600 bg-red-500/10" },
                { label: "Late", count: distributionData[2].value, color: "text-amber-600 bg-amber-500/10" },
                { label: "Leave", count: distributionData[3].value, color: "text-violet-600 bg-violet-500/10" },
              ].map((item) => (
                <Card key={item.label} className="p-3 border-2 border-border/60 text-center">
                  <div className={cn("text-2xl font-bold", item.color.split(" ")[0])}>{item.count}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ATTENDANCE REPORTS ===================== */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            {/* Filters */}
            <Card className="p-4 border-2 border-border/60">
              <div className="flex flex-wrap items-center gap-3">
                <Select value={reportFilterMonth} onValueChange={setReportFilterMonth}>
                  <SelectTrigger className="w-32"><SelectValue placeholder="Month" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={reportFilterStatus} onValueChange={setReportFilterStatus}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Has Present</SelectItem>
                    <SelectItem value="absent">Has Absent</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="text-xs ml-auto">
                  <Download className="size-3.5 mr-1" />Export Report
                </Button>
              </div>
            </Card>

            {/* Daily Timeline */}
            <Card className="p-5 border-2 border-border/60">
              <h3 className="text-sm font-semibold mb-4">Daily Attendance Timeline</h3>
              <div className="space-y-0">
                {filteredReportDays.map((day, i) => (
                  <div key={day.date}>
                    <div className="flex items-center gap-4 py-3">
                      <div className="w-32 shrink-0">
                        <div className="text-sm font-medium">{day.date}</div>
                        <div className="text-[10px] text-muted-foreground">{day.day}</div>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-6 rounded-full bg-muted overflow-hidden flex">
                          {day.total > 0 && (
                            <>
                              <div className="bg-emerald-500 h-full" style={{ width: `${(day.present / day.total) * 100}%` }} />
                              <div className="bg-red-500 h-full" style={{ width: `${(day.absent / day.total) * 100}%` }} />
                              <div className="bg-amber-500 h-full" style={{ width: `${(day.late / day.total) * 100}%` }} />
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] shrink-0 w-36">
                          <span className="text-emerald-600 font-medium">{day.present} Present</span>
                          <span className="text-red-600 font-medium">{day.absent} Absent</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold">{day.total > 0 ? Math.round((day.present / day.total) * 100) : 0}%</div>
                      </div>
                    </div>
                    {i < filteredReportDays.length - 1 && <div className="border-b border-border/50" />}
                  </div>
                ))}
              </div>
            </Card>

            {/* Monthly Summary Chart */}
            <Card className="p-5 border-2 border-border/60">
              <h3 className="text-sm font-semibold mb-4">Monthly Summary</h3>
              <ChartContainer config={monthlyChartConfig} className="h-[280px] w-full">
                <BarChart data={MONTHLY_TRENDS} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="late" fill="var(--color-late)" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ChartContainer>
            </Card>
          </div>
        )}

        {/* ===================== TAB 3: STUDENT ATTENDANCE ===================== */}
        {activeTab === "student" && (
          <div className="space-y-4">
            {/* Search */}
            <Card className="p-4 border-2 border-border/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input placeholder="Search student by name or roll number..." className="pl-9" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} />
              </div>
            </Card>

            {/* Student List */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredStudentList.map((student) => (
                <Card key={student.id} className={cn(
                  "p-4 border-2 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5",
                  selectedStudentId === student.id ? "border-violet-500" : "border-border/60",
                )} onClick={() => setSelectedStudentId(student.id === selectedStudentId ? null : student.id)}>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback className={cn("text-xs font-medium text-white",
                        student.attendance >= 90 ? "bg-emerald-500" :
                        student.attendance >= 80 ? "bg-amber-500" : "bg-red-500"
                      )}>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold truncate">{student.name}</h3>
                        {student.attendance >= 95 && <Badge className="text-[9px] bg-emerald-500 text-white border-0">Top</Badge>}
                        {student.attendance < 80 && <Badge className="text-[9px] bg-red-500 text-white border-0">Risk</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">Roll #{student.roll} · {student.className}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn("text-lg font-bold",
                        student.attendance >= 90 ? "text-emerald-600" :
                        student.attendance >= 80 ? "text-amber-600" : "text-red-600"
                      )}>{student.attendance}%</div>
                    </div>
                  </div>
                  {/* Inline progress */}
                  <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-500",
                      student.attendance >= 90 ? "bg-emerald-500" :
                      student.attendance >= 80 ? "bg-amber-500" : "bg-red-500"
                    )} style={{ width: `${student.attendance}%` }} />
                  </div>
                </Card>
              ))}
            </div>

            {/* Student Detail Panel */}
            {selectedStudent && (
              <Card className="p-5 border-2 border-border/60">
                <div className="flex items-center gap-4 mb-5">
                  <Avatar className="size-12">
                    <AvatarFallback className={cn("text-sm font-medium text-white",
                      selectedStudent.attendance >= 90 ? "bg-emerald-500" :
                      selectedStudent.attendance >= 80 ? "bg-amber-500" : "bg-red-500"
                    )}>{selectedStudent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-bold">{selectedStudent.name}</h3>
                    <div className="text-xs text-muted-foreground">Roll #{selectedStudent.roll} · {selectedStudent.className}</div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs"><Phone className="size-3.5 mr-1" />Call Parent</Button>
                    <Button variant="outline" size="sm" className="text-xs"><Mail className="size-3.5 mr-1" />Send Notice</Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Attendance", value: `${selectedStudent.attendance}%`, color: "text-emerald-600" },
                    { label: "Present Days", value: "105", color: "text-emerald-600" },
                    { label: "Absent Days", value: "8", color: "text-red-600" },
                    { label: "Late Days", value: "3", color: "text-amber-600" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/30">
                      <div className={cn("text-lg font-bold", stat.color)}>{stat.value}</div>
                      <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Monthly Chart */}
                <div className="mb-5">
                  <h4 className="text-xs font-semibold mb-3">Monthly Attendance</h4>
                  <ChartContainer config={monthlyChartConfig} className="h-[200px] w-full">
                    <BarChart data={getStudentAttendanceHistory(selectedStudent.id)} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="present" fill="var(--color-present)" radius={[3, 3, 0, 0]} barSize={16} />
                      <Bar dataKey="absent" fill="var(--color-absent)" radius={[3, 3, 0, 0]} barSize={16} />
                      <Bar dataKey="late" fill="var(--color-late)" radius={[3, 3, 0, 0]} barSize={16} />
                    </BarChart>
                  </ChartContainer>
                </div>

                {/* Attendance Trend Line */}
                <div>
                  <h4 className="text-xs font-semibold mb-3">Attendance Trend</h4>
                  <ChartContainer config={weeklyChartConfig} className="h-[160px] w-full">
                    <LineChart data={getStudentAttendanceHistory(selectedStudent.id).map((m, i) => ({
                      month: m.month,
                      percentage: Math.round(((m.present) / (m.present + m.absent + m.late + m.leave || 1)) * 100),
                    }))} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="percentage" stroke="var(--color-percentage)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ===================== TAB 4: RISK STUDENTS ===================== */}
        {activeTab === "risk" && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {RISK_STUDENTS.map((student) => (
                <Card key={student.id} className="p-4 border-2 border-border/60">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10 shrink-0">
                      <AvatarFallback className={cn("text-xs font-medium text-white",
                        student.riskLevel === "high" ? "bg-red-500" :
                        student.riskLevel === "medium" ? "bg-amber-500" : "bg-orange-500"
                      )}>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{student.name}</h3>
                        <Badge className={cn("text-[9px] border-0 text-white",
                          student.riskLevel === "high" ? "bg-red-500" :
                          student.riskLevel === "medium" ? "bg-amber-500" : "bg-orange-500"
                        )}>{student.riskLevel} risk</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Roll #{student.roll} · {student.className}</div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="font-medium">Attendance: {student.attendance}%</span>
                        {student.consecutiveAbsences > 0 && (
                          <span className="text-red-600">{student.consecutiveAbsences} consecutive absences</span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                        <AlertCircle className="size-3 inline mr-1" />{student.reason}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                    <Button variant="outline" size="sm" className="text-xs flex-1">
                      <Phone className="size-3.5 mr-1" />Notify Parent
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs flex-1">
                      <Edit className="size-3.5 mr-1" />Add Note
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs flex-1">
                      <Calendar className="size-3.5 mr-1" />Schedule PTA
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Risk Summary */}
            <Card className="p-5 border-2 border-border/60">
              <h3 className="text-sm font-semibold mb-4">Risk Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <div className="text-2xl font-bold text-red-600">{RISK_STUDENTS.filter((s) => s.riskLevel === "high").length}</div>
                  <div className="text-xs text-muted-foreground">High Risk</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <div className="text-2xl font-bold text-amber-600">{RISK_STUDENTS.filter((s) => s.riskLevel === "medium").length}</div>
                  <div className="text-xs text-muted-foreground">Medium Risk</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                  <div className="text-2xl font-bold text-orange-600">{RISK_STUDENTS.filter((s) => s.riskLevel === "low").length}</div>
                  <div className="text-xs text-muted-foreground">Low Risk</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ===================== TAB 5: ATTENDANCE ANALYTICS ===================== */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            {/* Monthly Trend + Weekly Trend */}
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="p-5 border-2 border-border/60">
                <h3 className="text-sm font-semibold mb-4">Monthly Attendance Trend</h3>
                <ChartContainer config={monthlyChartConfig} className="h-[240px] w-full">
                  <LineChart data={MONTHLY_TRENDS} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="percentage" stroke="var(--color-present)" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ChartContainer>
              </Card>

              <Card className="p-5 border-2 border-border/60">
                <h3 className="text-sm font-semibold mb-4">Weekly Attendance Trend</h3>
                <ChartContainer config={weeklyChartConfig} className="h-[240px] w-full">
                  <BarChart data={WEEKLY_TRENDS} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="percentage" fill="var(--color-percentage)" radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
                </ChartContainer>
              </Card>
            </div>

            {/* Attendance Distribution + Class Comparison */}
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="p-5 border-2 border-border/60">
                <h3 className="text-sm font-semibold mb-4">Attendance Distribution</h3>
                <ChartContainer config={distributionChartConfig} className="h-[240px] w-full">
                  <PieChart>
                    <Pie data={distributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {distributionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {distributionData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="size-2 rounded-full" style={{ background: entry.fill }} />
                      {entry.name} ({entry.value})
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 border-2 border-border/60">
                <h3 className="text-sm font-semibold mb-4">Class Comparison</h3>
                <ChartContainer config={classChartConfig} className="h-[240px] w-full">
                  <BarChart data={CLASS_COMPARISON} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                    <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <YAxis type="category" dataKey="class" tick={{ fontSize: 11 }} className="text-muted-foreground" width={40} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="percentage" fill="var(--color-percentage)" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ChartContainer>
              </Card>
            </div>

            {/* Heatmap */}
            <Card className="p-5 border-2 border-border/60">
              <h3 className="text-sm font-semibold mb-4">Attendance Heatmap</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-xs font-medium text-muted-foreground">Week</th>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <th key={day} className="text-center p-2 text-xs font-medium text-muted-foreground">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HEATMAP_DATA.map((row) => (
                      <tr key={row.day}>
                        <td className="p-2 text-xs font-medium text-muted-foreground">{row.day}</td>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                          const val = row[day as keyof typeof row] as number;
                          const intensity = (val - heatmapMaxMin.min) / (heatmapMaxMin.max - heatmapMaxMin.min || 1);
                          return (
                            <td key={day} className="text-center p-2">
                              <div className={cn(
                                "w-full h-8 rounded-md grid place-items-center text-[10px] font-bold text-white",
                                intensity > 0.7 ? "bg-emerald-500" :
                                intensity > 0.4 ? "bg-emerald-400" : "bg-emerald-300"
                              )}>{val}%</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Top Attendees + Most Absent */}
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="p-5 border-2 border-border/60">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-8 rounded-lg bg-emerald-500/10 grid place-items-center">
                    <TrendingUp className="size-4 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-semibold">Top Attendees</h3>
                </div>
                <div className="space-y-0">
                  {TOP_ATTENDEES.map((student, i) => (
                    <div key={student.name}>
                      <div className="flex items-center gap-3 py-2.5">
                        <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                        <Avatar className="size-7">
                          <AvatarFallback className="text-[10px] text-white bg-emerald-500">{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{student.name}</div>
                          <div className="text-[10px] text-muted-foreground">Roll #{student.roll} · {student.className}</div>
                        </div>
                        <Badge className="text-[9px] bg-emerald-500 text-white border-0">{student.percentage}%</Badge>
                      </div>
                      {i < TOP_ATTENDEES.length - 1 && <div className="border-b border-border/50" />}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 border-2 border-border/60">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-8 rounded-lg bg-red-500/10 grid place-items-center">
                    <TrendingDown className="size-4 text-red-600" />
                  </div>
                  <h3 className="text-sm font-semibold">Most Absent Students</h3>
                </div>
                <div className="space-y-0">
                  {MOST_ABSENT_STUDENTS.map((student, i) => (
                    <div key={student.name}>
                      <div className="flex items-center gap-3 py-2.5">
                        <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                        <Avatar className="size-7">
                          <AvatarFallback className="text-[10px] text-white bg-red-500">{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{student.name}</div>
                          <div className="text-[10px] text-muted-foreground">Roll #{student.roll} · {student.absentDays} absent days</div>
                        </div>
                        <Badge className="text-[9px] bg-red-500 text-white border-0">{student.percentage}%</Badge>
                      </div>
                      {i < MOST_ABSENT_STUDENTS.length - 1 && <div className="border-b border-border/50" />}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* AI Insights */}
            <Card className="p-5 border-2 border-border/60">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-violet-500/10 grid place-items-center">
                  <Sparkles className="size-4 text-violet-600" />
                </div>
                <h3 className="text-sm font-semibold">AI Insights</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {ATTENDANCE_AI_INSIGHTS.map((insight, i) => (
                  <div key={i} className={cn(
                    "flex items-start gap-2.5 p-3 rounded-lg border",
                    insight.type === "warning" ? "bg-amber-500/5 border-amber-500/20" :
                    insight.type === "success" ? "bg-emerald-500/5 border-emerald-500/20" :
                    "bg-violet-500/5 border-violet-500/20"
                  )}>
                    <Sparkles className={cn("size-3.5 mt-0.5 shrink-0",
                      insight.type === "warning" ? "text-amber-500" :
                      insight.type === "success" ? "text-emerald-500" : "text-violet-500"
                    )} />
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-5 border-2 border-border/60">
              <h3 className="text-sm font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  { label: "Mark Attendance", icon: ClipboardCheck, color: "text-emerald-600 bg-emerald-500/10" },
                  { label: "Export Report", icon: Download, color: "text-violet-600 bg-violet-500/10" },
                  { label: "Notify Parents", icon: Bell, color: "text-amber-600 bg-amber-500/10" },
                  { label: "Schedule PTA", icon: Calendar, color: "text-blue-600 bg-blue-500/10" },
                  { label: "Generate Report", icon: FileText, color: "text-violet-600 bg-violet-500/10" },
                  { label: "Open AI Assistant", icon: Sparkles, color: "text-violet-600 bg-violet-500/10" },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button key={action.label} className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border border-border/60 text-left transition-all hover:shadow-sm hover:-translate-y-0.5"
                    )}>
                      <div className={cn("size-8 rounded-lg grid place-items-center", action.color)}>
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
    </TeacherPageLayout>
  );
}

function Edit({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
