import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  GraduationCap,
  BookOpen,
  Timer,
  Sparkles,
  Bell,
  CalendarClock,
  PartyPopper,
  Trophy,
  Award,
  Sun,
} from "lucide-react";
import {
  getTimetableData,
  type TimetableData,
  type Period,
  type EventCategory,
  type AcademicEvent,
} from "@/lib/scholarii/timetable-mock-data";

export const Route = createFileRoute("/app/timetable")({
  component: TimetablePage,
});

const subjectChartConfig = {
  periods: {
    label: "Periods",
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig;

const TABS = [
  { id: "today", label: "Today", icon: CalendarDays },
  { id: "weekly", label: "Weekly Timetable", icon: Calendar },
  { id: "exams", label: "Exam Schedule", icon: GraduationCap },
  { id: "calendar", label: "Academic Calendar", icon: CalendarClock },
] as const;

type TabId = (typeof TABS)[number]["id"];

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-muted p-4 mb-4">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "default" | "success" | "warning" | "info";
}) {
  const toneStyles = {
    default: "from-slate-500/10 to-slate-600/5 text-slate-600",
    success: "from-emerald-500/10 to-emerald-600/5 text-emerald-600",
    warning: "from-amber-500/10 to-amber-600/5 text-amber-600",
    info: "from-violet-500/10 to-violet-600/5 text-violet-600",
  };

  const iconBg = {
    default: "bg-slate-500/10",
    success: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
    info: "bg-violet-500/10",
  };

  return (
    <Card className="relative overflow-hidden p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneStyles[tone]} opacity-50`} />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${iconBg[tone]}`}>
          <Icon className="size-4" />
        </div>
      </div>
    </Card>
  );
}

function TodayTab({ data }: { data: TimetableData }) {
  const [selectedPeriod, setSelectedPeriod] = useState<(Period & { status: string }) | null>(null);

  return (
    <div className="space-y-6">
      {data.substitutions.length > 0 && (
        <Card className="p-4 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2 shrink-0">
              <AlertTriangle className="size-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-amber-700 dark:text-amber-500">
                Substitution Alert
              </h3>
              {data.substitutions.map((sub, i) => (
                <p key={i} className="text-sm text-muted-foreground mt-1">
                  {sub.originalSubject} replaced by{" "}
                  <span className="font-medium text-foreground">{sub.replacementSubject}</span>.
                  Teacher: {sub.teacher} · Period {sub.period}
                </p>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div>
        <h3 className="font-semibold mb-4">Today's Classes</h3>
        <div className="relative">
          <div className="absolute left-9 top-0 bottom-0 w-px bg-border sm:left-[52px]" />
          <div className="space-y-1">
            {data.todaySchedule.map((cls, i) => (
              <div
                key={i}
                className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 sm:gap-4 ${
                  cls.status === "ongoing"
                    ? "bg-violet-500/5 border border-violet-500/20 shadow-sm"
                    : cls.status === "completed"
                      ? "opacity-60 hover:opacity-80"
                      : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedPeriod(cls)}
              >
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`size-3 rounded-full border-2 ${
                      cls.status === "ongoing"
                        ? "border-violet-500 bg-violet-500"
                        : cls.status === "completed"
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-muted-foreground/30 bg-background"
                    }`}
                  />
                </div>
                <div className="w-20 text-[11px] text-muted-foreground font-medium sm:w-28 sm:text-xs">
                  {cls.time} - {cls.endTime}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${cls.status === "ongoing" ? "text-violet-600" : ""}`}
                    >
                      {cls.subject}
                    </span>
                    {cls.status === "ongoing" && (
                      <Badge className="bg-violet-500/10 text-violet-600 border-0 text-xs">
                        Ongoing
                      </Badge>
                    )}
                    {cls.status === "completed" && (
                      <CheckCircle2 className="size-3.5 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cls.teacher} · {cls.room}
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tabs-mobile-scroll flex gap-3 overflow-x-auto scrollbar-none">
        <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={() => {}}>
          <Calendar className="size-3.5" /> View Full Week
        </Button>
        <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={() => {}}>
          <GraduationCap className="size-3.5" /> Exam Schedule
        </Button>
        <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={() => {}}>
          <Bell className="size-3.5" /> Add Reminder
        </Button>
      </div>

      <Dialog open={!!selectedPeriod} onOpenChange={() => setSelectedPeriod(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedPeriod?.subject}</DialogTitle>
            <DialogDescription>Class details</DialogDescription>
          </DialogHeader>
          {selectedPeriod && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                  <Clock className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">
                      {selectedPeriod.time} - {selectedPeriod.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                  <MapPin className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Room</p>
                    <p className="text-sm font-medium">{selectedPeriod.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 col-span-2">
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teacher</p>
                    <p className="text-sm font-medium">{selectedPeriod.teacher}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <div className="size-3 rounded-full bg-violet-500" />
                <span className="text-sm font-medium capitalize">{selectedPeriod.status}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WeeklyTab({ data }: { data: TimetableData }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<(Period & { day: string }) | null>(null);

  const days = data.weeklyTimetable;
  const allPeriods = days[0]?.periods.map((_, i) => i) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(selectedDay === d.day ? null : d.day)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              selectedDay === d.day
                ? "bg-violet-500/10 text-violet-600 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      <Card className="p-4 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-px bg-border/50 rounded-xl overflow-hidden">
            <div className="bg-muted/50 p-3 text-xs font-medium text-muted-foreground">Period</div>
            {days.map((d) => (
              <div
                key={d.day}
                className={`bg-muted/50 p-3 text-xs font-medium text-center ${
                  selectedDay === d.day ? "text-violet-600 bg-violet-500/5" : ""
                }`}
              >
                {d.shortDay}
              </div>
            ))}

            {allPeriods.map((pi) => (
              <>
                <div
                  key={`period-${pi}`}
                  className="bg-card p-3 text-xs font-medium text-muted-foreground"
                >
                  P{pi + 1}
                </div>
                {days.map((d) => {
                  const period = d.periods[pi];
                  if (!period) return <div key={`${d.day}-${pi}`} className="bg-card p-2" />;
                  return (
                    <button
                      key={`${d.day}-${pi}`}
                      onClick={() => setSelectedCell({ ...period, day: d.day })}
                      className="bg-card p-2 text-left hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className="size-2 rounded-full shrink-0"
                          style={{ backgroundColor: data.getSubjectColor(period.subject) }}
                        />
                        <span className="text-xs font-medium truncate">{period.subject}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{period.teacher}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{period.room}</p>
                    </button>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Weekly Statistics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">Total Classes</p>
              <p className="text-2xl font-bold">{data.totalWeeklyClasses}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">Academic Hours</p>
              <p className="text-2xl font-bold">{data.totalAcademicHours}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Subject Distribution</h3>
          <ChartContainer config={subjectChartConfig} className="h-[160px] w-full">
            <BarChart data={data.subjectDist} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="subject" tick={{ fontSize: 9 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="periods"
                fill="var(--color-periods)"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>

      <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCell?.subject}</DialogTitle>
            <DialogDescription>{selectedCell?.day}</DialogDescription>
          </DialogHeader>
          {selectedCell && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                <Clock className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="text-sm font-medium">
                    {selectedCell.time} - {selectedCell.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                <MapPin className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Room</p>
                  <p className="text-sm font-medium">{selectedCell.room}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 col-span-2">
                <User className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Teacher</p>
                  <p className="text-sm font-medium">{selectedCell.teacher}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExamsTab({ data }: { data: TimetableData }) {
  const typeStyles: Record<string, string> = {
    unit: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    midterm: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    final: "bg-red-500/10 text-red-600 border-red-500/20",
    practical: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  };

  const getDaysBadge = (days: number) => {
    if (days <= 3) return "destructive" as const;
    if (days <= 7) return "secondary" as const;
    return "outline" as const;
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard
          icon={GraduationCap}
          label="Upcoming Exams"
          value={`${data.upcomingExams.length}`}
          tone="default"
        />
        <MetricCard
          icon={CalendarDays}
          label="This Month"
          value={`${data.examsThisMonth.length}`}
          tone="info"
        />
        <MetricCard
          icon={Timer}
          label="Next Exam"
          value={`In ${data.nextExamDays} Days`}
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.exams.map((exam) => (
          <Card key={exam.id} className="p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-violet-500/10 p-3 shrink-0">
                <GraduationCap className="size-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{exam.name}</h4>
                  <Badge
                    variant="outline"
                    className={`text-[10px] border ${typeStyles[exam.type]}`}
                  >
                    {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{exam.subject}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(exam.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {exam.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {exam.room}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground mb-1">
                  {new Date(exam.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <Badge variant={getDaysBadge(exam.daysLeft)} className="text-xs">
                  {exam.daysLeft} Days
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Exam Calendar</h3>
        <div className="grid grid-cols-7 gap-px bg-border/50 rounded-xl overflow-hidden text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="bg-muted/50 p-2 text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const examOnDay = data.exams.find(
              (e) => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === 6,
            );
            return (
              <div
                key={day}
                className={`bg-card p-2 text-sm ${
                  examOnDay ? "bg-violet-500/5 font-semibold text-violet-600" : ""
                }`}
              >
                {day}
                {examOnDay && (
                  <div className="mt-1">
                    <div className="size-1.5 rounded-full bg-violet-500 mx-auto" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
          <div className="size-2 rounded-full bg-violet-500" />
          <span>Exam dates</span>
        </div>
      </Card>
    </div>
  );
}

function CalendarTab({ data }: { data: TimetableData }) {
  const [activeFilter, setActiveFilter] = useState<EventCategory | "all">("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);

  const ACADEMIC_YEAR_START = 2026;
  const ACADEMIC_MONTHS = [
    { month: 3, year: 2026, label: "Apr 2026" },
    { month: 4, year: 2026, label: "May 2026" },
    { month: 5, year: 2026, label: "Jun 2026" },
    { month: 6, year: 2026, label: "Jul 2026" },
    { month: 7, year: 2026, label: "Aug 2026" },
    { month: 8, year: 2026, label: "Sep 2026" },
    { month: 9, year: 2026, label: "Oct 2026" },
    { month: 10, year: 2026, label: "Nov 2026" },
    { month: 11, year: 2026, label: "Dec 2026" },
    { month: 0, year: 2027, label: "Jan 2027" },
    { month: 1, year: 2027, label: "Feb 2027" },
    { month: 2, year: 2027, label: "Mar 2027" },
  ];

  const EVENT_CATEGORIES: {
    key: EventCategory | "all";
    label: string;
    color: string;
    dot: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: "all",
      label: "All",
      color: "bg-foreground text-background",
      dot: "bg-foreground",
      icon: CalendarDays,
    },
    {
      key: "exam",
      label: "Exams",
      color: "bg-red-500/10 text-red-600 border-red-500/20",
      dot: "bg-red-500",
      icon: GraduationCap,
    },
    {
      key: "holiday",
      label: "Holidays",
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      dot: "bg-emerald-500",
      icon: Sun,
    },
    {
      key: "event",
      label: "Events",
      color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
      dot: "bg-violet-500",
      icon: PartyPopper,
    },
    {
      key: "ptm",
      label: "PTM",
      color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      dot: "bg-amber-500",
      icon: User,
    },
    {
      key: "result",
      label: "Results",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      dot: "bg-blue-500",
      icon: Award,
    },
    {
      key: "competition",
      label: "Competitions",
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      dot: "bg-orange-500",
      icon: Trophy,
    },
    {
      key: "deadline",
      label: "Deadlines",
      color: "bg-slate-500/10 text-slate-600 border-slate-500/20",
      dot: "bg-slate-600",
      icon: Timer,
    },
  ];

  const DOT_COLORS: Record<EventCategory, string> = {
    exam: "bg-red-500",
    holiday: "bg-emerald-500",
    event: "bg-violet-500",
    ptm: "bg-amber-500",
    result: "bg-blue-500",
    competition: "bg-orange-500",
    deadline: "bg-slate-600",
  };

  const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    holiday: Sun,
    ptm: User,
    event: PartyPopper,
    sports: Trophy,
    exam: GraduationCap,
    result: Award,
    competition: Trophy,
    deadline: Timer,
  };

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return data.academicEvents;
    return data.academicEvents.filter((e) => e.type === activeFilter);
  }, [data.academicEvents, activeFilter]);

  const getEventsForDate = (date: Date): AcademicEvent[] => {
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventDate;
      return date >= eventDate && date <= eventEnd;
    });
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const timelinePhases = [
    { label: "Term 1", start: "Apr", end: "Jun", color: "bg-violet-500" },
    { label: "Mid-Term", start: "Jul", end: "Jul", color: "bg-amber-500" },
    { label: "Term 2", start: "Aug", end: "Oct", color: "bg-emerald-500" },
    { label: "Final Exams", start: "Nov", end: "Dec", color: "bg-red-500" },
    { label: "Results", start: "Jan", end: "Mar", color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={Sun}
          label="Total Holidays"
          value={`${data.totalHolidays}`}
          tone="success"
        />
        <MetricCard
          icon={GraduationCap}
          label="Total Exams"
          value={`${data.totalExams}`}
          tone="default"
        />
        <MetricCard
          icon={PartyPopper}
          label="Total Events"
          value={`${data.totalEvents + data.totalCompetitions}`}
          tone="info"
        />
        <MetricCard
          icon={Timer}
          label="Days Left (Term 2)"
          value={`${data.daysRemainingInTerm}`}
          tone="warning"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {EVENT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeFilter === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 border ${
                isActive
                  ? `${cat.color} shadow-sm`
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
              }`}
            >
              <Icon className="size-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {EVENT_CATEGORIES.filter((c) => c.key !== "all").map((cat) => (
          <div key={cat.key} className="flex items-center gap-1.5">
            <div className={`size-2 rounded-full ${cat.dot}`} />
            <span>{cat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {ACADEMIC_MONTHS.map((m) => {
              const daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
              const firstDayOfWeek = new Date(m.year, m.month, 1).getDay();
              const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
              const paddedDays = [...Array(firstDayOfWeek).fill(null), ...daysArray];

              return (
                <Card key={`${m.year}-${m.month}`} className="p-3">
                  <h4 className="text-xs font-semibold mb-2 text-center">{m.label}</h4>
                  <div className="grid grid-cols-7 gap-px text-center">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="text-[9px] font-medium text-muted-foreground py-0.5">
                        {d}
                      </div>
                    ))}
                    {paddedDays.map((day, i) => {
                      if (day === null) return <div key={`empty-${i}`} />;
                      const dateObj = new Date(m.year, m.month, day);
                      const dateStr = `${m.year}-${String(m.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const events = getEventsForDate(dateObj);
                      const isToday = dateStr === todayStr;
                      const isSelected = selectedDate?.getTime() === dateObj.getTime();
                      const hasEvent = events.length > 0;
                      const firstEvent = events[0];

                      return (
                        <button
                          key={`${m.year}-${m.month}-${day}`}
                          onClick={() => setSelectedDate(dateObj)}
                          className={`relative p-0.5 rounded text-[10px] transition-all duration-150 ${
                            isToday
                              ? "bg-violet-500 text-white font-bold"
                              : isSelected
                                ? "bg-violet-500/10 text-violet-600 font-semibold"
                                : hasEvent
                                  ? "hover:bg-muted/80 font-medium"
                                  : "hover:bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {day}
                          {hasEvent && !isToday && (
                            <div className="flex justify-center gap-px mt-px">
                              {events.slice(0, 2).map((ev, ei) => (
                                <div
                                  key={ei}
                                  className={`size-1 rounded-full ${DOT_COLORS[ev.type]}`}
                                />
                              ))}
                              {events.length > 2 && (
                                <div className="size-1 rounded-full bg-muted-foreground" />
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="lg:hidden space-y-4">
            {ACADEMIC_MONTHS.filter((m) => {
              const now = new Date();
              return m.month === now.getMonth() && m.year === now.getFullYear();
            })
              .concat(
                ACADEMIC_MONTHS.filter((m) => {
                  const now = new Date();
                  return !(m.month === now.getMonth() && m.year === now.getFullYear());
                }),
              )
              .slice(0, 3)
              .map((m) => {
                const daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
                const firstDayOfWeek = new Date(m.year, m.month, 1).getDay();
                const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                const paddedDays = [...Array(firstDayOfWeek).fill(null), ...daysArray];

                return (
                  <Card key={`mobile-${m.year}-${m.month}`} className="p-3">
                    <h4 className="text-xs font-semibold mb-2">{m.label}</h4>
                    <div className="grid grid-cols-7 gap-px text-center">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div
                          key={i}
                          className="text-[9px] font-medium text-muted-foreground py-0.5"
                        >
                          {d}
                        </div>
                      ))}
                      {paddedDays.map((day, i) => {
                        if (day === null) return <div key={`empty-${i}`} />;
                        const dateObj = new Date(m.year, m.month, day);
                        const dateStr = `${m.year}-${String(m.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const events = getEventsForDate(dateObj);
                        const isToday = dateStr === todayStr;
                        const isSelected = selectedDate?.getTime() === dateObj.getTime();
                        const hasEvent = events.length > 0;

                        return (
                          <button
                            key={`mobile-${m.year}-${m.month}-${day}`}
                            onClick={() => setSelectedDate(dateObj)}
                            className={`relative p-0.5 rounded text-[10px] transition-all duration-150 ${
                              isToday
                                ? "bg-violet-500 text-white font-bold"
                                : isSelected
                                  ? "bg-violet-500/10 text-violet-600 font-semibold"
                                  : hasEvent
                                    ? "hover:bg-muted/80 font-medium"
                                    : "hover:bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            {day}
                            {hasEvent && !isToday && (
                              <div className="flex justify-center gap-px mt-px">
                                {events.slice(0, 2).map((ev, ei) => (
                                  <div
                                    key={ei}
                                    className={`size-1 rounded-full ${DOT_COLORS[ev.type]}`}
                                  />
                                ))}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
          </div>

          {selectedDate && selectedDateEvents.length > 0 && (
            <Card className="p-4 mt-4 lg:hidden">
              <h4 className="font-semibold text-sm mb-3">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h4>
              <div className="space-y-2">
                {selectedDateEvents.map((event) => {
                  const Icon = TYPE_ICONS[event.type] ?? Calendar;
                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className={`size-2 rounded-full shrink-0 ${DOT_COLORS[event.type]}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{event.type}</p>
                      </div>
                      <ChevronRight className="size-3 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        <div className="hidden lg:block w-72 shrink-0 space-y-4">
          <Card className="p-4">
            <h4 className="font-semibold text-sm mb-3">Upcoming Events</h4>
            <div className="space-y-2">
              {data.upcomingEvents.map((event) => {
                const Icon = TYPE_ICONS[event.type] ?? Calendar;
                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div
                      className={`rounded-lg p-1.5 shrink-0 ${EVENT_CATEGORIES.find((c) => c.key === event.type)?.color ?? "bg-muted"}`}
                    >
                      <Icon className="size-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {event.time && ` · ${event.time}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold text-sm mb-3">Quick Stats</h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Holidays</span>
                <span className="text-sm font-semibold text-emerald-600">{data.totalHolidays}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Examinations</span>
                <span className="text-sm font-semibold text-red-600">{data.totalExams}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">School Events</span>
                <span className="text-sm font-semibold text-violet-600">{data.totalEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">PTMs</span>
                <span className="text-sm font-semibold text-amber-600">{data.totalPTMs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Result Days</span>
                <span className="text-sm font-semibold text-blue-600">{data.totalResults}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Competitions</span>
                <span className="text-sm font-semibold text-orange-600">
                  {data.totalCompetitions}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Term 2 Ends</span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {data.daysRemainingInTerm} days
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Academic Year Timeline</h3>
        <p className="text-sm text-muted-foreground mb-5">April 2026 — March 2027</p>
        <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
          {timelinePhases.map((phase, i) => (
            <div
              key={i}
              className={`${phase.color} relative group flex items-center justify-center cursor-default`}
              style={{ flex: i === 1 || i === 3 ? 0.5 : i === 4 ? 1.5 : 2 }}
            >
              <span className="text-[10px] font-semibold text-white drop-shadow-sm whitespace-nowrap">
                {phase.label}
              </span>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-muted-foreground whitespace-nowrap bg-popover border rounded px-2 py-1 shadow-md z-10">
                {phase.start} — {phase.end}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-1">
          {timelinePhases.map((phase, i) => (
            <div
              key={i}
              style={{ flex: i === 1 || i === 3 ? 0.5 : i === 4 ? 1.5 : 2 }}
              className="text-center"
            >
              <span className="text-[9px] text-muted-foreground">{phase.start}</span>
            </div>
          ))}
          <div style={{ flex: 0 }} className="text-center">
            <span className="text-[9px] text-muted-foreground">Mar</span>
          </div>
        </div>
      </Card>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedEvent && (
                <div
                  className={`rounded-lg p-1.5 ${EVENT_CATEGORIES.find((c) => c.key === selectedEvent.type)?.color ?? "bg-muted"}`}
                >
                  {(() => {
                    const Icon = TYPE_ICONS[selectedEvent.type] ?? Calendar;
                    return <Icon className="size-4" />;
                  })()}
                </div>
              )}
              <div>
                <DialogTitle>{selectedEvent?.title}</DialogTitle>
                <DialogDescription className="capitalize">{selectedEvent?.type}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                  <Calendar className="size-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">
                      {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {selectedEvent.endDate && (
                        <>
                          {" "}
                          —{" "}
                          {new Date(selectedEvent.endDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                {selectedEvent.time && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                    <Clock className="size-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{selectedEvent.time}</p>
                    </div>
                  </div>
                )}
                {selectedEvent.location && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 col-span-2">
                    <MapPin className="size-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{selectedEvent.location}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function TimetablePage() {
  const data = useMemo(() => getTimetableData(), []);
  const [activeTab, setActiveTab] = useState<TabId>("today");
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkTabScroll = useCallback(() => {
    const el = tabScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    checkTabScroll();
    const el = tabScrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkTabScroll);
    ro.observe(el);
    el.addEventListener("scroll", checkTabScroll, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", checkTabScroll);
    };
  }, [checkTabScroll]);

  const scrollTabs = useCallback((dir: "left" | "right") => {
    const el = tabScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timetable"
        subtitle="View your class schedule, upcoming periods, substitutions, and academic calendar."
      />

      <Card className="p-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="rounded-xl bg-violet-500/10 p-2">
            <CalendarDays className="size-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h2>
            <p className="text-sm text-muted-foreground">Today's schedule at a glance</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={BookOpen}
          label="Total Classes"
          value={`${data.todaySchedule.length}`}
          tone="default"
        />
        <MetricCard icon={Timer} label="Remaining" value={`${data.remainingCount}`} tone="info" />
        <MetricCard icon={Sun} label="Free Periods" value={`${data.freePeriods}`} tone="success" />
        <MetricCard icon={Clock} label="Study Hours" value={`${data.totalHours}h`} tone="warning" />
      </div>

      <Card className="p-4 mb-4 overflow-hidden sm:mb-6">
        <div className="relative flex items-center">
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs("left")}
              className="absolute left-0 z-20 flex h-full w-8 items-center justify-center bg-gradient-to-r from-background via-background/90 to-transparent"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4 text-muted-foreground" />
            </button>
          )}
          <div
            ref={tabScrollRef}
            className="tabs-mobile-scroll flex gap-1 overflow-x-auto scrollbar-none"
          >
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
                  {tab.label}
                </button>
              );
            })}
          </div>
          {canScrollRight && (
            <button
              onClick={() => scrollTabs("right")}
              className="absolute right-0 z-20 flex h-full w-8 items-center justify-center bg-gradient-to-l from-background via-background/90 to-transparent"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </Card>

      <div className="min-h-[400px]">
        {activeTab === "today" && <TodayTab data={data} />}
        {activeTab === "weekly" && <WeeklyTab data={data} />}
        {activeTab === "exams" && <ExamsTab data={data} />}
        {activeTab === "calendar" && <CalendarTab data={data} />}
      </div>
    </div>
  );
}
