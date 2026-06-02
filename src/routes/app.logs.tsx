import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Shield, UserPlus, FileEdit, Trash2, LogIn, DollarSign } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/logs")({ component: LogsPage });

const allLogs = [
  { t: "2m ago", who: "Dr. Rajesh K.", role: "Principal", action: "Updated school settings", target: "academic-year", sev: "Info", icon: FileEdit },
  { t: "12m ago", who: "Priya Verma", role: "Admin", action: "Added new student", target: "Aarav Patel · 8-A", sev: "Info", icon: UserPlus },
  { t: "47m ago", who: "Suresh M.", role: "Teacher", action: "Marked attendance", target: "Class 9-A", sev: "Info", icon: FileEdit },
  { t: "1h ago", who: "System", role: "System", action: "Backup completed", target: "daily-snapshot", sev: "Info", icon: Shield },
  { t: "2h ago", who: "Priya Verma", role: "Admin", action: "Recorded fee payment", target: "₹12,500 · Diya S.", sev: "Info", icon: DollarSign },
  { t: "3h ago", who: "Unknown", role: "—", action: "Failed login attempt", target: "admin@scholarii", sev: "Warning", icon: LogIn },
  { t: "5h ago", who: "Anita I.", role: "Teacher", action: "Deleted assignment draft", target: "Hindi Worksheet 3", sev: "Warning", icon: Trash2 },
  { t: "8h ago", who: "Dr. Rajesh K.", role: "Principal", action: "Approved leave request", target: "Suresh M.", sev: "Info", icon: FileEdit },
  { t: "Yest", who: "System", role: "System", action: "Rate limit triggered", target: "/api/students", sev: "Warning", icon: Shield },
  { t: "Yest", who: "Priya Verma", role: "Admin", action: "Permission changed", target: "Teacher role · grades", sev: "Critical", icon: Shield },
];

const sev = {
  Info: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  Warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

function LogsPage() {
  const [q, setQ] = useState("");
  const rows = allLogs.filter((l) => !q || l.who.toLowerCase().includes(q.toLowerCase()) || l.action.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="Every meaningful action on the platform, timestamped."
        action={<Button variant="outline" size="sm"><Download className="size-4 mr-1" />Export</Button>}
      />
      <Card className="p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search by user or action..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {(["All", "Info", "Warning", "Critical"] as const).map((s) => <Button key={s} variant="outline" size="sm">{s}</Button>)}
      </Card>

      <Card className="divide-y divide-border">
        {rows.map((l, i) => (
          <div key={i} className="p-4 flex gap-4 items-start hover:bg-muted/30">
            <div className="size-9 rounded-lg bg-muted grid place-items-center shrink-0"><l.icon className="size-4 text-muted-foreground" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{l.who}</span>
                <Badge variant="outline" className="text-[10px]">{l.role}</Badge>
                <Badge className={`text-[10px] ${sev[l.sev as keyof typeof sev]}`}>{l.sev}</Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">{l.action} — <span className="text-foreground">{l.target}</span></div>
            </div>
            <div className="text-xs text-muted-foreground shrink-0">{l.t}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}
