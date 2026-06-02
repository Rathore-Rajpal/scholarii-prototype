import { PageHeader, StatCard } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookMarked, Users, ClipboardList, CalendarClock, Clock, MapPin, ChevronRight } from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";

export function TeacherDashboard() {
  const data = useMemo(() => loadData(), []);
  const schedule = [
    { time: "08:30 – 09:15", class: "10-A", subject: "Mathematics", room: "201" },
    { time: "09:20 – 10:05", class: "9-B", subject: "Mathematics", room: "203" },
    { time: "10:30 – 11:15", class: "8-A", subject: "Mathematics", room: "105" },
    { time: "11:20 – 12:05", class: "7-A", subject: "Mathematics", room: "108" },
  ];

  return (
    <div>
      <PageHeader title="Good morning, Rajesh" subtitle="You have 4 classes today and 12 assignments to grade." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookMarked} label="My Classes" value="5" />
        <StatCard icon={Users} label="Total Students" value="168" tone="info" />
        <StatCard icon={ClipboardList} label="To Grade" value="12" tone="warning" />
        <StatCard icon={CalendarClock} label="PTA Meetings" value="3" hint="This week" tone="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Today's Schedule</h3>
            <Badge variant="secondary">{new Date().toLocaleDateString("en-IN", { weekday: "long" })}</Badge>
          </div>
          <div className="space-y-3">
            {schedule.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                <div className="text-center w-24 shrink-0">
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Clock className="size-3" />{s.time}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{s.subject} — Class {s.class}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="size-3" />Room {s.room}</div>
                </div>
                <Button size="sm" className="bg-brand-gradient text-white border-0">Mark Attendance</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Pending Submissions</h3>
          <div className="space-y-2">
            {data.assignments.slice(0, 4).map((a) => (
              <Link to="/app/assignments" key={a.id} className="block p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium truncate">{a.title}</div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{a.submitted}/{a.total} submitted • {a.graded} graded</div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <h3 className="font-semibold mb-4">Upcoming Events</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { t: "Mid-term Exams", d: "Dec 12 – Dec 20", tone: "from-violet-500 to-fuchsia-500" },
            { t: "Class 10 PTA", d: "Dec 8 — 10:00 AM", tone: "from-amber-400 to-orange-500" },
            { t: "Sports Day", d: "Dec 15", tone: "from-emerald-400 to-teal-500" },
          ].map((e) => (
            <div key={e.t} className="p-4 rounded-xl border border-border">
              <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${e.tone} mb-3`} />
              <div className="font-medium">{e.t}</div>
              <div className="text-sm text-muted-foreground">{e.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
