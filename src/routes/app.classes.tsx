import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ClipboardList, GraduationCap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/classes")({ component: ClassesPage });

const classes = [
  { name: "Class 8-A", subject: "Mathematics", students: 32, attendance: 94, pending: 4, color: "from-violet-500 to-fuchsia-500" },
  { name: "Class 7-B", subject: "Mathematics", students: 28, attendance: 91, pending: 2, color: "from-emerald-500 to-teal-500" },
  { name: "Class 9-A", subject: "Mathematics", students: 30, attendance: 96, pending: 0, color: "from-amber-500 to-orange-500" },
  { name: "Class 10-A", subject: "Mathematics", students: 26, attendance: 92, pending: 6, color: "from-sky-500 to-indigo-500" },
];

function ClassesPage() {
  return (
    <div>
      <PageHeader title="My Classes" subtitle="Classes you currently teach this term." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classes.map((c) => (
          <Card key={c.name} className="p-5 hover:shadow-glow transition">
            <div className={`h-24 -m-5 mb-4 rounded-t-xl bg-gradient-to-br ${c.color} relative overflow-hidden`}>
              <div className="absolute inset-0 grid place-items-center"><div className="text-white"><div className="text-2xl font-bold">{c.name}</div><div className="text-xs opacity-90">{c.subject}</div></div></div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-2">
              <div><Users className="size-4 mx-auto text-muted-foreground" /><div className="text-sm font-semibold mt-1">{c.students}</div><div className="text-[10px] text-muted-foreground">Students</div></div>
              <div><GraduationCap className="size-4 mx-auto text-muted-foreground" /><div className="text-sm font-semibold mt-1">{c.attendance}%</div><div className="text-[10px] text-muted-foreground">Attendance</div></div>
              <div><ClipboardList className="size-4 mx-auto text-muted-foreground" /><div className="text-sm font-semibold mt-1">{c.pending}</div><div className="text-[10px] text-muted-foreground">To grade</div></div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="outline" className="text-[10px]">{c.pending > 0 ? `${c.pending} pending` : "All graded"}</Badge>
              <Button variant="ghost" size="sm">Open <ArrowRight className="size-3.5 ml-1" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
