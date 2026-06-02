import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, BarChart3, Users, DollarSign, ClipboardCheck, GraduationCap, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/reports")({ component: ReportsPage });

const templates = [
  { t: "Student Attendance Report", d: "Class-wise daily/monthly attendance.", icon: ClipboardCheck, c: "from-emerald-500 to-teal-500" },
  { t: "Academic Performance", d: "Marks distribution and grade analysis.", icon: GraduationCap, c: "from-violet-500 to-fuchsia-500" },
  { t: "Fee Collection Summary", d: "Paid, pending and overdue totals.", icon: DollarSign, c: "from-amber-500 to-orange-500" },
  { t: "Enrollment Trends", d: "Year-over-year admission growth.", icon: Users, c: "from-sky-500 to-indigo-500" },
  { t: "Teacher Workload", d: "Periods, classes, grading load.", icon: BarChart3, c: "from-pink-500 to-rose-500" },
  { t: "Events & Activities", d: "Participation and outcomes.", icon: Calendar, c: "from-cyan-500 to-blue-500" },
];

const recent = [
  { name: "Term-1-Attendance-Class-8A.pdf", date: "Today, 9:14 AM", size: "186 KB" },
  { name: "Fee-Collection-Nov-2026.xlsx", date: "Yesterday", size: "42 KB" },
  { name: "Mid-Term-Results-Summary.pdf", date: "Nov 28", size: "312 KB" },
  { name: "Enrollment-Annual-2025-26.pdf", date: "Nov 20", size: "598 KB" },
];

function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports & Export" subtitle="Generate and download reports for any time range." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {templates.map((t) => (
          <Card key={t.t} className="p-5 hover:shadow-glow transition">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${t.c} grid place-items-center text-white mb-3`}><t.icon className="size-5" /></div>
            <div className="font-semibold">{t.t}</div>
            <div className="text-xs text-muted-foreground mt-1 mb-4">{t.d}</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">Configure</Button>
              <Button size="sm" className="flex-1 bg-brand-gradient text-white border-0">Generate</Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="font-semibold mb-4">Recent exports</div>
        <div className="divide-y divide-border">
          {recent.map((r) => (
            <div key={r.name} className="py-3 flex items-center gap-3">
              <div className="size-9 rounded-lg bg-muted grid place-items-center"><FileText className="size-4 text-muted-foreground" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.date} · {r.size}</div>
              </div>
              <Badge variant="outline" className="text-[10px]">Ready</Badge>
              <Button size="icon" variant="ghost"><Download className="size-4" /></Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
