import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  GraduationCap,
  Search,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  ClipboardCheck,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TEACHER_CLASSES,
  CLASS_OVERVIEW_STATS,
} from "@/lib/scholarii/teacher-myclasses-mock-data";
import { useAuth } from "@/lib/scholarii/auth";

export const Route = createFileRoute("/app/classes")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <MyClassesPage />
    </RoleGuard>
  ),
});

function MyClassesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const stats = CLASS_OVERVIEW_STATS;

  const filteredClasses = TEACHER_CLASSES.filter((cls) =>
    cls.className.toLowerCase().includes(search.toLowerCase()) ||
    cls.subject.toLowerCase().includes(search.toLowerCase())
  );

  const selectedClass = TEACHER_CLASSES.find((c) => c.id === selectedClassId);

  return (
    <div>
      <PageHeader
        title="My Classes"
        subtitle={`Classes assigned to ${user?.name || "you"} — track students, attendance, and performance.`}
        action={
          <Button size="sm" className="bg-brand-gradient text-white border-0">
            <ClipboardCheck className="size-4 mr-1" />
            Mark Attendance
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center">
              <BookOpen className="size-5 text-violet-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Classes</div>
              <div className="text-xl font-semibold">{stats.totalClasses} Classes</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-sky-500/10 grid place-items-center">
              <Users className="size-5 text-sky-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Students</div>
              <div className="text-xl font-semibold">{stats.totalStudents} Students</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
              <GraduationCap className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg Attendance</div>
              <div className="text-xl font-semibold">{stats.avgClassAttendance}%</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 grid place-items-center">
              <TrendingUp className="size-5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
              <div className="text-xl font-semibold">{stats.avgClassScore}%</div>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-2 border-violet-200/70 dark:border-violet-900/40">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center">
              <Trophy className="size-5 text-violet-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Class Teacher Of</div>
              <div className="text-xl font-semibold">{stats.classTeacherOf}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/40 border-0"
          />
        </div>
      </Card>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
        {filteredClasses.map((cls) => (
          <button
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id === selectedClassId ? null : cls.id)}
            className={cn(
              "rounded-2xl border p-5 text-left transition-all",
              selectedClass?.id === cls.id
                ? "border-violet-500 bg-violet-500/5 shadow-sm ring-1 ring-violet-500/20"
                : "border-border/60 hover:border-border hover:bg-muted/20"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-11">
                  <AvatarFallback className="bg-violet-500 text-white text-sm font-semibold">
                    {cls.grade}-{cls.section}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{cls.className}</div>
                  <div className="text-xs text-muted-foreground">{cls.subject}</div>
                </div>
              </div>
              {cls.isClassTeacher && (
                <Badge className="bg-violet-500/10 text-violet-600 border-0 text-[10px]">
                  Class Teacher
                </Badge>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-muted/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="size-3.5 text-sky-500" />
                  <span className="text-[10px] text-muted-foreground">Students</span>
                </div>
                <div className="text-lg font-semibold">{cls.studentCount}</div>
              </div>
              <div className="rounded-xl bg-muted/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="size-3.5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">Room</span>
                </div>
                <div className="text-lg font-semibold">{cls.room}</div>
              </div>
            </div>

            {/* Attendance Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Avg Attendance</span>
                <span className={cn(
                  "text-xs font-semibold",
                  cls.avgAttendance >= 90 ? "text-emerald-600" : cls.avgAttendance >= 80 ? "text-amber-600" : "text-red-600"
                )}>
                  {cls.avgAttendance}%
                </span>
              </div>
              <Progress value={cls.avgAttendance} className="h-1.5" />
            </div>

            {/* Score Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Avg Score</span>
                <span className={cn(
                  "text-xs font-semibold",
                  cls.avgScore >= 75 ? "text-emerald-600" : cls.avgScore >= 60 ? "text-amber-600" : "text-red-600"
                )}>
                  {cls.avgScore}%
                </span>
              </div>
              <Progress value={cls.avgScore} className="h-1.5" />
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mb-4 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Trophy className="size-3" />
                {cls.topPerformers} top
              </div>
              <div className="flex items-center gap-1.5 text-red-600">
                <AlertTriangle className="size-3" />
                {cls.atRiskStudents} at-risk
              </div>
            </div>

            {/* Schedule & Next Exam */}
            <div className="space-y-2 border-t border-border/60 pt-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {cls.schedule}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {cls.nextExam}
              </div>
            </div>

            {/* Last Activity */}
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-violet-500/5 px-3 py-2 text-xs text-violet-600">
              <Sparkles className="size-3" />
              {cls.lastActivity}
            </div>

            {/* Expanded Details */}
            {selectedClass?.id === cls.id && (
              <div className="mt-4 border-t border-border/60 pt-4 space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-xs font-medium hover:bg-muted/50 transition-colors">
                    <ClipboardCheck className="size-3.5 text-violet-500" />
                    Attendance
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-xs font-medium hover:bg-muted/50 transition-colors">
                    <FileText className="size-3.5 text-sky-500" />
                    Assignments
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-xs font-medium hover:bg-muted/50 transition-colors">
                    <TrendingUp className="size-3.5 text-emerald-500" />
                    Results
                  </button>
                  <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-xs font-medium hover:bg-muted/50 transition-colors">
                    <Users className="size-3.5 text-amber-500" />
                    Students
                  </button>
                </div>
              </div>
            )}

            {/* View Arrow */}
            <div className="mt-3 flex justify-end">
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="size-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No classes found</p>
          <p className="text-xs text-muted-foreground mt-1">Try adjusting your search</p>
        </Card>
      )}
    </div>
  );
}
