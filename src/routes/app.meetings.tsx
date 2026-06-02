import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Video, Plus } from "lucide-react";

export const Route = createFileRoute("/app/meetings")({ component: MeetingsPage });

const meetings = [
  { d: "Sat, Dec 14", time: "10:00 AM", title: "Class 8-A Quarterly PTA", mode: "In-person", room: "Auditorium", rsvp: 28, total: 32, color: "#667eea", status: "Upcoming" },
  { d: "Mon, Dec 16", time: "5:30 PM", title: "Parent 1:1 — Aarav Sharma", mode: "Online", room: "Google Meet", rsvp: 1, total: 1, color: "#10b981", status: "Confirmed" },
  { d: "Wed, Dec 18", time: "11:00 AM", title: "Class 7-B PTA", mode: "In-person", room: "Room 204", rsvp: 19, total: 28, color: "#f59e0b", status: "Upcoming" },
  { d: "Fri, Dec 20", time: "4:00 PM", title: "Parent 1:1 — Diya Sharma", mode: "Online", room: "Zoom", rsvp: 1, total: 1, color: "#ec4899", status: "Pending" },
];

const past = [
  { d: "Nov 28", title: "Class 8-A · Term opener", rsvp: 30, total: 32, notes: "Discussed term roadmap and projects." },
  { d: "Nov 14", title: "Parent 1:1 — Aarav Sharma", rsvp: 1, total: 1, notes: "Academic improvement plan agreed." },
];

function MeetingsPage() {
  return (
    <div>
      <PageHeader title="PTA Meetings" subtitle="Schedule, track and follow-up on parent meetings." action={<Button size="sm" className="bg-brand-gradient text-white border-0"><Plus className="size-4 mr-1" />Schedule</Button>} />
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {[{ l: "Upcoming", v: 4 }, { l: "Confirmed", v: 28 }, { l: "Response rate", v: "87%" }].map((s) => (
          <Card key={s.l} className="p-5"><div className="text-xs text-muted-foreground">{s.l}</div><div className="text-2xl font-semibold mt-1">{s.v}</div></Card>
        ))}
      </div>

      <div className="font-semibold mb-3">Upcoming</div>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {meetings.map((m) => (
          <Card key={m.title} className="p-5">
            <div className="flex gap-4">
              <div className="size-12 rounded-xl grid place-items-center text-white shrink-0" style={{ backgroundColor: m.color }}>{m.mode === "Online" ? <Video className="size-5" /> : <MapPin className="size-5" />}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="font-semibold truncate">{m.title}</div>
                  <Badge variant="outline" className="shrink-0">{m.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-3 gap-y-1"><span className="flex items-center gap-1"><Calendar className="size-3.5" />{m.d}</span><span className="flex items-center gap-1"><Clock className="size-3.5" />{m.time}</span></div>
                <div className="text-xs text-muted-foreground mt-1">{m.mode} · {m.room}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex -space-x-2">{Array.from({ length: Math.min(4, m.rsvp) }).map((_, i) => <Avatar key={i} className="size-7 border-2 border-card"><AvatarFallback className="text-[10px] bg-brand-gradient text-white">P{i + 1}</AvatarFallback></Avatar>)}<div className="ml-3 text-xs text-muted-foreground self-center">{m.rsvp}/{m.total} RSVPs</div></div>
                  <Button size="sm" variant="outline">Details</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="font-semibold mb-3">Past meetings</div>
      <Card className="divide-y divide-border">
        {past.map((p) => (
          <div key={p.title} className="p-4 flex flex-wrap gap-3 items-center">
            <div className="text-xs text-muted-foreground min-w-16">{p.d}</div>
            <div className="flex-1 min-w-40"><div className="font-medium text-sm">{p.title}</div><div className="text-xs text-muted-foreground">{p.notes}</div></div>
            <Badge variant="secondary">{p.rsvp}/{p.total}</Badge>
            <Button variant="ghost" size="sm">Notes</Button>
          </div>
        ))}
      </Card>
    </div>
  );
}
