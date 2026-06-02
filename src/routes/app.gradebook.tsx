import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Save, Download } from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/gradebook")({ component: GradebookPage });

const assessments = ["Quiz 1", "Mid-term", "Project", "Quiz 2", "Final"];

function gradeFor(n: number) {
  if (n >= 90) return { g: "A+", c: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" };
  if (n >= 80) return { g: "A", c: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" };
  if (n >= 70) return { g: "B", c: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" };
  if (n >= 60) return { g: "C", c: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" };
  return { g: "D", c: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" };
}

function GradebookPage() {
  const data = useMemo(() => loadData(), []);
  const [cls, setCls] = useState("8-A");
  const students = data.students.filter((s) => `${s.grade}-${s.section}` === cls).slice(0, 12);
  const [grid, setGrid] = useState<Record<string, number[]>>(() => Object.fromEntries(students.map((s, i) => [s.id, assessments.map((_, j) => 60 + ((i * 7 + j * 11) % 38))])));

  const avg = (arr: number[]) => Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);

  return (
    <div>
      <PageHeader
        title="Gradebook"
        subtitle="Record marks across assessments and track averages."
        action={<div className="flex gap-2"><Button variant="outline" size="sm"><Download className="size-4 mr-1" />Export</Button><Button size="sm" className="bg-brand-gradient text-white border-0" onClick={() => toast.success("Grades saved")}><Save className="size-4 mr-1" />Save</Button></div>}
      />
      <Card className="p-4 mb-4 flex flex-wrap gap-3">
        <Select value={cls} onValueChange={setCls}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{["6-A", "7-A", "8-A", "9-A", "10-A"].map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
        </Select>
        <Select defaultValue="Mathematics"><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent>{["Mathematics", "Science", "English"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select defaultValue="term1"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="term1">Term 1</SelectItem><SelectItem value="term2">Term 2</SelectItem></SelectContent></Select>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 sticky left-0 bg-muted/50">Student</th>
              {assessments.map((a) => <th key={a} className="p-3 text-center font-medium min-w-24">{a}<div className="text-[10px] text-muted-foreground">/100</div></th>)}
              <th className="p-3 text-center">Avg</th>
              <th className="p-3 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const marks = grid[s.id];
              const a = avg(marks);
              const gr = gradeFor(a);
              return (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 sticky left-0 bg-card font-medium">{s.name}<div className="text-[10px] text-muted-foreground font-normal">Roll {s.roll}</div></td>
                  {marks.map((m, j) => (
                    <td key={j} className="p-2 text-center">
                      <Input type="number" min={0} max={100} value={m} onChange={(e) => setGrid({ ...grid, [s.id]: marks.map((v, k) => k === j ? Number(e.target.value) : v) })} className="w-16 mx-auto h-8 text-center" />
                    </td>
                  ))}
                  <td className="p-3 text-center font-semibold">{a}</td>
                  <td className="p-3 text-center"><Badge className={gr.c}>{gr.g}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
