import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { RoleGuard } from "@/components/scholarii/RoleGuard";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  CalendarClock,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Plus,
  ChevronRight,
  ClipboardCheck,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isPast } from "date-fns";
import {
  PTA_MEETINGS,
  PTA_STATS,
} from "@/lib/scholarii/teacher-ptameetings-mock-data";
import type { MeetingStatus } from "@/lib/scholarii/teacher-ptameetings-mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/app/ptameetings")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PTAMeetingsPage />
    </RoleGuard>
  ),
});

const STATUS_META: Record<
  MeetingStatus,
  { label: string; color: string; bg: string }
> = {
  upcoming: {
    label: "Upcoming",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  completed: {
    label: "Completed",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg: "bg-red-500/10",
  },
};

const TABS = [
  { id: "all", label: "All Meetings", icon: CalendarClock },
  { id: "upcoming", label: "Upcoming", icon: Clock },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

function PTAMeetingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = PTA_STATS;

  const filtered = useMemo(() => {
    let list = PTA_MEETINGS;
    if (activeTab !== "all") {
      list = list.filter((m) => m.status === activeTab);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.className.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, search]);

  const selected = PTA_MEETINGS.find((m) => m.id === selectedId);

  return (
    <div>
      <PageHeader
        title="PTA Meetings"
        subtitle="Schedule and manage Parent-Teacher Association meetings. Track attendance and follow-up actions."
        action={
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-brand-gradient text-white border-0">
                <Plus className="size-4 mr-1" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule PTA Meeting</DialogTitle>
              </DialogHeader>
              <ScheduleMeetingForm />
            </DialogContent>
          </Dialog>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-violet-500/10 grid place-items-center">
              <CalendarClock className="size-5 text-violet-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Meetings</div>
              <div className="text-xl font-semibold">{stats.totalMeetings}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-sky-500/10 grid place-items-center">
              <Clock className="size-5 text-sky-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
              <div className="text-xl font-semibold">{stats.upcoming}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 grid place-items-center">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Completed</div>
              <div className="text-xl font-semibold">{stats.completed}</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 grid place-items-center">
              <Users className="size-5 text-amber-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Avg Attendance</div>
              <div className="text-xl font-semibold">{stats.avgAttendance}%</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-red-500/10 grid place-items-center">
              <ClipboardCheck className="size-5 text-red-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Follow-ups</div>
              <div className="text-xl font-semibold">{stats.totalFollowUps}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs + Search */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex gap-1 flex-1">
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
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/40 border-0 h-9"
            />
          </div>
        </div>
      </Card>

      {/* Meeting Cards */}
      <div className="space-y-4 pb-4">
        {filtered.map((meeting) => {
          const meta = STATUS_META[meeting.status];
          const attendancePct =
            meeting.attendeesExpected > 0
              ? Math.round(
                  (meeting.attendeesActual / meeting.attendeesExpected) * 100
                )
              : 0;

          return (
            <button
              key={meeting.id}
              onClick={() =>
                setSelectedId(meeting.id === selectedId ? null : meeting.id)
              }
              className={cn(
                "w-full rounded-2xl border p-5 text-left transition-all",
                selected?.id === meeting.id
                  ? "border-violet-500 bg-violet-500/5 shadow-sm ring-1 ring-violet-500/20"
                  : "border-border/60 hover:border-border hover:bg-muted/20"
              )}
            >
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarFallback
                    className={cn("text-white text-sm font-semibold", meta.bg, meta.color)}
                  >
                    {format(parseISO(meeting.date), "dd")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <Badge
                      className={cn(
                        "border-0 text-[10px]",
                        meta.bg,
                        meta.color
                      )}
                    >
                      {meta.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <CalendarClock className="size-3" />
                      {format(parseISO(meeting.date), "dd MMM yyyy")} · {meeting.time} – {meeting.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {meeting.venue}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {meeting.agenda[0]}
                  </p>

                  {/* Parent Responses */}
                  {meeting.status === "upcoming" && (
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="text-emerald-600">
                        ✓ {meeting.parentResponses.accepted} accepted
                      </span>
                      <span className="text-red-600">
                        ✗ {meeting.parentResponses.declined} declined
                      </span>
                      <span className="text-amber-600">
                        ? {meeting.parentResponses.pending} pending
                      </span>
                    </div>
                  )}

                  {/* Attendance (completed) */}
                  {meeting.status === "completed" && meeting.attendeesActual > 0 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="size-3" />
                      {meeting.attendeesActual}/{meeting.attendeesExpected} attended ({attendancePct}%)
                    </div>
                  )}
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
              </div>

              {/* Expanded Details */}
              {selected?.id === meeting.id && (
                <div className="mt-4 border-t border-border/60 pt-4 space-y-4">
                  {/* Agenda */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Agenda
                    </h4>
                    <div className="space-y-1.5">
                      {meeting.agenda.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="size-5 rounded-full bg-violet-500/10 text-violet-600 text-[10px] font-medium grid place-items-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes (completed only) */}
                  {meeting.status === "completed" && meeting.notes && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Meeting Notes
                      </h4>
                      <div className="rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground">
                        {meeting.notes}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Actions (completed only) */}
                  {meeting.status === "completed" &&
                    meeting.followUpActions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Follow-up Actions
                        </h4>
                        <div className="space-y-1.5">
                          {meeting.followUpActions.map((action, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Sparkles className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    {meeting.status === "upcoming" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Reminder sent to parents (demo)");
                        }}
                      >
                        <MessageSquare className="size-3 mr-1" />
                        Send Reminder
                      </Button>
                    )}
                    {meeting.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Notes shared with parents (demo)");
                        }}
                      >
                        <MessageSquare className="size-3 mr-1" />
                        Share Notes
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <CalendarClock className="size-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No meetings found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search or tab filter
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function ScheduleMeetingForm() {
  const [open, setOpen] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Meeting scheduled (demo)");
        setOpen(false);
      }}
    >
      <div className="space-y-1.5">
        <Label>Title</Label>
        <Input required placeholder="e.g. Mid-Term Review" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label>Time</Label>
          <Input type="time" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Class</Label>
          <Select defaultValue="8-A">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8-A">Class 8-A</SelectItem>
              <SelectItem value="8-B">Class 8-B</SelectItem>
              <SelectItem value="9-A">Class 9-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Venue</Label>
          <Input required placeholder="e.g. School Hall" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Agenda (one per line)</Label>
        <Textarea rows={4} required placeholder="Topic 1&#10;Topic 2&#10;Topic 3" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-brand-gradient text-white border-0"
        >
          Schedule
        </Button>
      </div>
    </form>
  );
}
