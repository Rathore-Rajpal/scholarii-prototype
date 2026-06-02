import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Clock, Save } from "lucide-react";
import { useAuth } from "@/lib/scholarii/auth";
import { loadData } from "@/lib/scholarii/mock";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/attendance")({ component: AttendancePage });

type Status = "present" | "absent" | "late";

function AttendancePage() {
  const { user } = useAuth();
  if (user?.role === "student") return <StudentAttendanceView />;
  return <TeacherMarkAttendance />;
}

function TeacherMarkAttendance() {
  const data = useMemo(() => loadData(), []);
  const [cls, setCls] = useState("8-A");
  const students = data.students.filter(s => `${s.grade}-${s.section}` === cls).slice(0, 12);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const set = (id: string, s: Status) => setStatuses(p => ({ ...p, [id]: s }));
  const allPresent = () => setStatuses(Object.fromEntries(students.map(s => [s.id, "present" as Status])));

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Mark today's attendance for your class." action={
        <Button className="bg-brand-gradient text-white border-0" onClick={() => toast.success("Attendance saved")}><Save className="size-4 mr-1" />Save</Button>
      } />

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <Select value={cls} onValueChange={setCls}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["8-A","9-A","9-B","10-A","10-B"].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-44" />
          <Select defaultValue="math">
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="sci">Science</SelectItem>
              <SelectItem value="eng">English</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={allPresent}>Mark all present</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="divide-y divide-border">
          {students.map((s) => {
            const st = statuses[s.id];
            return (
              <div key={s.id} className="flex items-center gap-3 p-3">
                <Avatar className="size-9"><AvatarFallback style={{ backgroundColor: s.avatarColor, color: "white" }}>{s.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.roll}</div>
                </div>
                <div className="flex gap-1">
                  <ToggleBtn active={st === "present"} onClick={() => set(s.id, "present")} color="emerald" icon={Check} label="Present" />
                  <ToggleBtn active={st === "absent"} onClick={() => set(s.id, "absent")} color="red" icon={X} label="Absent" />
                  <ToggleBtn active={st === "late"} onClick={() => set(s.id, "late")} color="amber" icon={Clock} label="Late" />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function ToggleBtn({ active, onClick, color, icon: Icon, label }: { active: boolean; onClick: () => void; color: "emerald" | "red" | "amber"; icon: typeof Check; label: string }) {
  const cls = active
    ? color === "emerald" ? "bg-emerald-500 text-white border-emerald-500" : color === "red" ? "bg-red-500 text-white border-red-500" : "bg-amber-500 text-white border-amber-500"
    : "bg-background text-muted-foreground hover:bg-accent";
  return (
    <button onClick={onClick} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium transition-colors ${cls}`}>
      <Icon className="size-3.5" />{label}
    </button>
  );
}

function StudentAttendanceView() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Track your daily attendance and overall percentage." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-1 text-center">
          <div className="text-sm text-muted-foreground">Overall</div>
          <div className="text-6xl font-bold text-brand-gradient mt-2">94%</div>
          <div className="text-sm text-muted-foreground mt-2">Excellent attendance!</div>
          <div className="mt-6 space-y-2 text-sm text-left">
            <div className="flex justify-between"><span>Present</span><span className="font-medium text-emerald-600">142 days</span></div>
            <div className="flex justify-between"><span>Absent</span><span className="font-medium text-red-600">6 days</span></div>
            <div className="flex justify-between"><span>Late</span><span className="font-medium text-amber-600">3 days</span></div>
          </div>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">This Month</h3>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="font-medium text-muted-foreground py-1">{d}</div>)}
            {days.map((d) => {
              const status = d % 11 === 0 ? "absent" : d % 7 === 0 ? "late" : "present";
              const color = status === "present" ? "bg-emerald-500" : status === "absent" ? "bg-red-500" : "bg-amber-500";
              return (
                <div key={d} className="aspect-square rounded-lg border border-border grid place-items-center relative">
                  <span className="text-muted-foreground">{d}</span>
                  <div className={`absolute bottom-1 size-1.5 rounded-full ${color}`} />
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-emerald-500" />Present</span>
            <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-red-500" />Absent</span>
            <span className="flex items-center gap-1"><div className="size-2 rounded-full bg-amber-500" />Late</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
