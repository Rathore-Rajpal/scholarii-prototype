import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Plus } from "lucide-react";

export const Route = createFileRoute("/app/events")({ component: EventsPage });

const events = [
  { d: "15", m: "Dec", title: "Annual Sports Day", time: "8:00 AM – 4:00 PM", loc: "Main Ground", tag: "All School", color: "from-amber-500 to-orange-500", rsvp: 420 },
  { d: "22", m: "Dec", title: "Winter Concert", time: "6:00 PM", loc: "Auditorium", tag: "Parents Welcome", color: "from-sky-500 to-indigo-500", rsvp: 312 },
  { d: "05", m: "Jan", title: "Science Exhibition", time: "10:00 AM", loc: "Lab Block", tag: "Class 6–10", color: "from-emerald-500 to-teal-500", rsvp: 180 },
  { d: "26", m: "Jan", title: "Republic Day", time: "8:30 AM", loc: "Assembly", tag: "Mandatory", color: "from-violet-500 to-fuchsia-500", rsvp: 510 },
  { d: "14", m: "Feb", title: "PTA Quarterly Meet", time: "11:00 AM", loc: "Conference Hall", tag: "Parents", color: "from-pink-500 to-rose-500", rsvp: 246 },
  { d: "02", m: "Mar", title: "Inter-school Debate", time: "9:00 AM", loc: "Auditorium", tag: "Class 9–10", color: "from-cyan-500 to-blue-500", rsvp: 96 },
];

function EventsPage() {
  return (
    <div>
      <PageHeader title="Events" subtitle="School calendar and upcoming events." action={<Button size="sm" className="bg-brand-gradient text-white border-0"><Plus className="size-4 mr-1" />New Event</Button>} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e) => (
          <Card key={e.title} className="overflow-hidden hover:shadow-glow transition">
            <div className={`h-24 bg-gradient-to-br ${e.color} flex items-center px-5 gap-4`}>
              <div className="bg-white/95 rounded-xl px-3 py-2 text-center min-w-[64px]"><div className="text-2xl font-bold text-foreground leading-none">{e.d}</div><div className="text-[10px] uppercase tracking-wide text-muted-foreground">{e.m}</div></div>
              <div className="text-white"><div className="text-lg font-semibold leading-tight">{e.title}</div><Badge className="bg-white/20 text-white border-0 mt-1 text-[10px]">{e.tag}</Badge></div>
            </div>
            <div className="p-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" />{e.time}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="size-4" />{e.loc}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Users className="size-4" />{e.rsvp} RSVPs</div>
              <div className="flex gap-2 pt-2"><Button variant="outline" size="sm" className="flex-1">Details</Button><Button size="sm" className="flex-1 bg-brand-gradient text-white border-0">RSVP</Button></div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 mt-6">
        <div className="flex items-center gap-2 font-semibold mb-3"><Calendar className="size-4" />This week at a glance</div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
            <div key={d} className="p-3 rounded-xl bg-muted/40">
              <div className="text-muted-foreground">{d}</div>
              <div className="text-lg font-semibold my-1">{10 + i}</div>
              {i === 2 && <Badge variant="secondary" className="text-[9px]">Assembly</Badge>}
              {i === 4 && <Badge className="bg-brand-gradient text-white border-0 text-[9px]">Sports</Badge>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
