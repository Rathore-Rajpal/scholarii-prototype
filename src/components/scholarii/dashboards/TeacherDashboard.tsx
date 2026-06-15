import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  ClipboardCheck,
  Megaphone,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Upload,
  Plus,
} from "lucide-react";
import { getTeacherDashboardData, type TeacherDashboardData } from "@/lib/scholarii/teacher-mock-data";
import { useAuth } from "@/lib/scholarii/auth";

const TABS = [
  { id: "schedule", label: "Today's Schedule", icon: Calendar },
  { id: "classes", label: "My Classes", icon: Users },
  { id: "assignments", label: "Assignments", icon: FileText },
  { id: "exams", label: "Exam Activity", icon: GraduationCap },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "actions", label: "Quick Actions", icon: LayoutGrid },
] as const;

type TabId = (typeof TABS)[number]["id"];

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "success" | "warning" | "info" | "default";
}) {
  const toneStyles = {
    success: "from-emerald-500/10 to-emerald-600/5 text-emerald-600",
    warning: "from-amber-500/10 to-amber-600/5 text-amber-600",
    info: "from-violet-500/10 to-violet-600/5 text-violet-600",
    default: "from-slate-500/10 to-slate-600/5 text-slate-600",
  };

  const iconBg = {
    success: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
    info: "bg-violet-500/10",
    default: "bg-slate-500/10",
  };

  return (
    <Card className="relative overflow-hidden p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneStyles[tone]} opacity-50`} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${iconBg[tone]}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

function TodayScheduleTab({ data }: { data: TeacherDashboardData }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Today's Classes" />
      <div className="space-y-3">
        {data.todaySchedule.map((item) => (
          <Card key={item.id} className="p-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-2.5 ${
                item.status === "completed" ? "bg-emerald-500/10" :
                item.status === "ongoing" ? "bg-violet-500/10" :
                "bg-slate-500/10"
              }`}>
                <Clock className={`size-5 ${
                  item.status === "completed" ? "text-emerald-600" :
                  item.status === "ongoing" ? "text-violet-600" :
                  "text-slate-600"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{item.time} - {item.endTime}</p>
                  <Badge variant="outline" className={`text-xs ${
                    item.status === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                    item.status === "ongoing" ? "bg-violet-500/10 text-violet-600 border-violet-500/20" :
                    "bg-slate-500/10 text-slate-600 border-slate-500/20"
                  }`}>
                    {item.status === "completed" ? "Completed" : item.status === "ongoing" ? "Ongoing" : "Upcoming"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.className} · {item.subject} · Room {item.room}
                </p>
              </div>
              {item.status === "ongoing" && (
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <div className="size-2 rounded-full bg-violet-500 animate-pulse" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MyClassesTab({ data }: { data: TeacherDashboardData }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="My Classes" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.myClasses.map((cls) => (
          <Card key={cls.id} className="p-5 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{cls.name}</h3>
                  {cls.isClassTeacher && (
                    <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-600 border-violet-500/20">
                      Class Teacher
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{cls.subject}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{cls.students}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Attendance</span>
                <span className="font-medium">{cls.attendance}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${cls.attendance}%` }}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="size-3.5" />
              <span>{cls.upcomingExam}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AssignmentsTab({ data }: { data: TeacherDashboardData }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Assignments" />
      <div className="space-y-3">
        {data.assignments.map((assignment) => (
          <Card key={assignment.id} className="p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-500/10 p-2">
                  <FileText className="size-4 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-amber-600">{assignment.pending}</p>
                  <p className="text-[10px] text-muted-foreground">Pending</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-blue-600">{assignment.submitted}</p>
                  <p className="text-[10px] text-muted-foreground">Submitted</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-emerald-600">{assignment.verified}</p>
                  <p className="text-[10px] text-muted-foreground">Verified</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ExamActivityTab({ data }: { data: TeacherDashboardData }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Exam Activity" />
      <div className="space-y-3">
        {data.examActivities.map((exam) => (
          <Card key={exam.id} className="p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${
                  exam.daysLeft <= 3 ? "bg-amber-500/10" :
                  exam.daysLeft <= 7 ? "bg-violet-500/10" :
                  "bg-emerald-500/10"
                }`}>
                  <GraduationCap className={`size-4 ${
                    exam.daysLeft <= 3 ? "text-amber-600" :
                    exam.daysLeft <= 7 ? "text-violet-600" :
                    "text-emerald-600"
                  }`} />
                </div>
                <div>
                  <p className="font-medium">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">{exam.subject}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={`text-xs ${
                  exam.daysLeft <= 3 ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                  exam.daysLeft <= 7 ? "bg-violet-500/10 text-violet-600 border-violet-500/20" :
                  "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                }`}>
                  {exam.daysLeft} Days Left
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsTab({ data }: { data: TeacherDashboardData }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Announcements" />
      <div className="space-y-3">
        {data.announcements.map((notice) => (
          <Card key={notice.id} className="p-4 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${
                  notice.type === "school" ? "bg-violet-500/10" :
                  notice.type === "pta" ? "bg-blue-500/10" :
                  "bg-amber-500/10"
                }`}>
                  <Megaphone className={`size-4 ${
                    notice.type === "school" ? "text-violet-600" :
                    notice.type === "pta" ? "text-blue-600" :
                    "text-amber-600"
                  }`} />
                </div>
                <div>
                  <p className="font-medium">{notice.title}</p>
                  <p className="text-xs text-muted-foreground">{notice.date}</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-xs ${
                notice.priority === "urgent" ? "bg-red-500/10 text-red-600 border-red-500/20" :
                notice.priority === "important" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                "bg-slate-500/10 text-slate-600 border-slate-500/20"
              }`}>
                {notice.priority === "urgent" ? "Urgent" :
                 notice.priority === "important" ? "Important" : "Normal"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function QuickActionsTab() {
  const nav = useNavigate();
  const actions = [
    { label: "Mark Attendance", icon: ClipboardCheck, action: () => nav({ to: "/app/attendance" as never }) },
    { label: "Open My Classes", icon: Users, action: () => nav({ to: "/app/classes" as never }) },
    { label: "Create Assignment", icon: Plus, action: () => {} },
    { label: "Create Exam", icon: GraduationCap, action: () => {} },
    { label: "Generate Question Paper", icon: FileText, action: () => {} },
    { label: "Upload Resource", icon: Upload, action: () => {} },
    { label: "Open AI Assistant", icon: Sparkles, action: () => nav({ to: "/app/ai" as never }) },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Quick Actions" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={a.action}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-border/60 bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="rounded-xl bg-violet-500/10 p-3">
                <Icon className="size-5 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-center">{a.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const data = useMemo(() => getTeacherDashboardData(), []);
  const [activeTab, setActiveTab] = useState<TabId>("schedule");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const teacherName = user?.name?.split(" ")[1] ?? "Mr. Sharma";
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {getGreeting()}, {teacherName} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's your teaching overview for today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{dateStr}</p>
            <p className="text-xs text-muted-foreground">
              Mathematics Department · 4 Classes
            </p>
          </div>
          <Avatar className="size-10 border-2 border-background shadow-md">
            <AvatarFallback className="bg-violet-500/10 text-violet-600 font-semibold text-sm">
              {user?.name?.charAt(0) ?? "T"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Calendar}
          label="Today's Classes"
          value={`${data.totalClasses} Classes`}
          tone="info"
        />
        <MetricCard
          icon={FileText}
          label="Pending Reviews"
          value={`${data.pendingReviews} Submissions`}
          tone="warning"
        />
        <MetricCard
          icon={GraduationCap}
          label="Upcoming Exams"
          value={`${data.upcomingExams} Exams`}
          tone="info"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Attendance Pending"
          value={`${data.attendancePending} Class Left`}
          tone="default"
        />
      </div>

      {/* Tab Bar */}
      <div className="sticky top-0 z-30 -mx-1 px-1 pt-1 pb-3">
        <div className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl rounded-2xl" />
          <div className="relative flex gap-1 overflow-x-auto scrollbar-none rounded-2xl border border-border/60 bg-card p-1.5 shadow-sm">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-500/10 text-violet-600 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "schedule" && <TodayScheduleTab data={data} />}
        {activeTab === "classes" && <MyClassesTab data={data} />}
        {activeTab === "assignments" && <AssignmentsTab data={data} />}
        {activeTab === "exams" && <ExamActivityTab data={data} />}
        {activeTab === "announcements" && <AnnouncementsTab data={data} />}
        {activeTab === "actions" && <QuickActionsTab />}
      </div>
    </div>
  );
}
