import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Building2, FlaskConical, Library, Bus, Wifi, Wrench } from "lucide-react";

export const Route = createFileRoute("/app/infrastructure")({ component: InfraPage });

const facilities = [
  { name: "Classrooms", count: 42, used: 38, icon: Building2, color: "from-violet-500 to-fuchsia-500" },
  { name: "Science Labs", count: 6, used: 5, icon: FlaskConical, color: "from-emerald-500 to-teal-500" },
  { name: "Library", count: 1, used: 1, icon: Library, color: "from-amber-500 to-orange-500" },
  { name: "Buses", count: 12, used: 12, icon: Bus, color: "from-sky-500 to-indigo-500" },
];

const rooms = [
  { id: "R-201", type: "Classroom", capacity: 36, status: "Occupied", now: "Class 8-A · Math" },
  { id: "R-105", type: "Physics Lab", capacity: 24, status: "Free", now: "—" },
  { id: "R-110", type: "Chemistry Lab", capacity: 24, status: "Occupied", now: "Class 10-A · Chem" },
  { id: "R-303", type: "Computer Lab", capacity: 30, status: "Maintenance", now: "Hardware upgrade" },
  { id: "R-Aud", type: "Auditorium", capacity: 400, status: "Reserved", now: "Sports day briefing" },
];

const tickets = [
  { id: "MNT-184", t: "AC repair – R-201", pri: "High", age: "2h" },
  { id: "MNT-183", t: "Projector bulb – R-105", pri: "Medium", age: "1d" },
  { id: "MNT-182", t: "Plumbing – Block C", pri: "Low", age: "2d" },
];

function InfraPage() {
  return (
    <div>
      <PageHeader title="Infrastructure" subtitle="Classrooms, labs, transport and facilities." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {facilities.map((f) => (
          <Card key={f.name} className="p-5">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${f.color} grid place-items-center text-white mb-3`}><f.icon className="size-5" /></div>
            <div className="text-2xl font-semibold">{f.used}<span className="text-sm text-muted-foreground">/{f.count}</span></div>
            <div className="text-xs text-muted-foreground mb-3">{f.name} in use</div>
            <Progress value={(f.used / f.count) * 100} />
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="font-semibold mb-4">Room status</div>
          <div className="divide-y divide-border">
            {rooms.map((r) => (
              <div key={r.id} className="py-3 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-muted grid place-items-center text-sm font-mono">{r.id}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{r.type}</div>
                  <div className="text-xs text-muted-foreground">{r.now}</div>
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">Cap {r.capacity}</div>
                <Badge variant={r.status === "Free" ? "secondary" : r.status === "Maintenance" ? "destructive" : "outline"}
                  className={r.status === "Free" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : ""}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="font-semibold mb-4 flex items-center gap-2"><Wrench className="size-4" />Maintenance tickets</div>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-3 rounded-xl border border-border">
                <div className="flex justify-between items-start"><div className="text-xs font-mono text-muted-foreground">{t.id}</div><Badge variant={t.pri === "High" ? "destructive" : t.pri === "Medium" ? "secondary" : "outline"}>{t.pri}</Badge></div>
                <div className="text-sm font-medium mt-1">{t.t}</div>
                <div className="text-[10px] text-muted-foreground mt-1">Open · {t.age}</div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4">View all tickets</Button>
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground"><Wifi className="size-4" />Campus Wi-Fi: <span className="text-emerald-600 font-medium">Operational</span></div>
        </Card>
      </div>
    </div>
  );
}
