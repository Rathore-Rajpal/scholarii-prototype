import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, ScatterChart, Scatter, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { X } from "lucide-react";
import type { Student } from "@/lib/scholarii/types";

interface AcademicPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
}

export function AcademicPerformanceModal({ open, onOpenChange, students }: AcademicPerformanceModalProps) {
  // Calculate subject-wise averages
  const subjectAverages: Record<string, number[]> = {};
  const classAverages: Record<string, number[]> = {};

  students.forEach((student) => {
    const classKey = `${student.grade}-${student.section}`;

    if (student.testScores) {
      Object.entries(student.testScores).forEach(([subject, score]) => {
        if (!subjectAverages[subject]) subjectAverages[subject] = [];
        subjectAverages[subject].push(score);
      });
    }

    if (student.testScores) {
      if (!classAverages[classKey]) classAverages[classKey] = [];
      const classScore = Object.values(student.testScores).reduce((a, b) => a + b, 0) / Object.keys(student.testScores).length;
      classAverages[classKey].push(classScore);
    }
  });

  const subjectData = Object.entries(subjectAverages)
    .map(([subject, scores]) => ({
      subject,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      total: scores.length,
    }))
    .sort((a, b) => b.average - a.average);

  const classData = Object.entries(classAverages)
    .map(([className, scores]) => ({
      class: className,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      total: scores.length,
    }))
    .sort((a, b) => b.average - a.average);

  // Overall stats
  const allScores = students
    .flatMap((s) => (s.testScores ? Object.values(s.testScores) : []))
    .filter((s): s is number => typeof s === "number");
  const schoolAverage = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);

  // Failing students (score < 60)
  const failingStudents = students.filter(
    (s) => s.testScores && Object.values(s.testScores).some((score) => score < 60)
  );

  // Strongest and weakest subjects
  const strongest = subjectData[0];
  const weakest = subjectData[subjectData.length - 1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Academic Performance Analysis</DialogTitle>
          <DialogClose className="rounded-lg p-1 hover:bg-accent">
            <X className="size-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
              <div className="text-xs text-muted-foreground">School Average</div>
              <div className="text-2xl font-bold mt-1">{schoolAverage}%</div>
            </Card>
            <Card className="p-4 bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900">
              <div className="text-xs text-muted-foreground">Strongest Subject</div>
              <div className="text-lg font-bold mt-1">{strongest?.subject}</div>
              <div className="text-sm text-sky-600 dark:text-sky-400">{strongest?.average}%</div>
            </Card>
            <Card className="p-4 bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900">
              <div className="text-xs text-muted-foreground">Weakest Subject</div>
              <div className="text-lg font-bold mt-1">{weakest?.subject}</div>
              <div className="text-sm text-red-600 dark:text-red-400">{weakest?.average}%</div>
            </Card>
          </div>

          {/* Subject Performance */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="subject" stroke="var(--muted-foreground)" fontSize={12} angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="average" fill="var(--brand-from)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Class Performance Table */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Class-wise Performance</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Class</th>
                    <th className="px-4 py-2 text-right font-medium">Average Score</th>
                    <th className="px-4 py-2 text-right font-medium">Students</th>
                    <th className="px-4 py-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {classData.map((item) => {
                    const status = item.average >= 80 ? "Excellent" : item.average >= 70 ? "Good" : item.average >= 60 ? "Average" : "Needs Support";
                    const statusColor = item.average >= 80 ? "text-emerald-600" : item.average >= 70 ? "text-sky-600" : item.average >= 60 ? "text-amber-600" : "text-red-600";
                    return (
                      <tr key={item.class} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{item.class}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">{item.average}%</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">{item.total}</td>
                        <td className={`px-4 py-2.5 text-right font-medium ${statusColor}`}>{status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Performance Table */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Subject-wise Breakdown</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Subject</th>
                    <th className="px-4 py-2 text-right font-medium">Average</th>
                    <th className="px-4 py-2 text-right font-medium">Trending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subjectData.map((item, i) => (
                    <tr key={item.subject} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 font-medium">{item.subject}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{item.average}%</td>
                      <td className="px-4 py-2.5 text-right text-muted-foreground">{i === 0 ? "↑ Strongest" : i === subjectData.length - 1 ? "↓ Weakest" : "→ Stable"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights & Recommendations */}
          <Card className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <h4 className="font-semibold text-sm mb-2">Insights & Recommendations</h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              <li>• {failingStudents.length} students are failing in one or more subjects</li>
              <li>• {strongest?.subject} is the strongest subject with {strongest?.average}% average</li>
              <li>• {weakest?.subject} needs focus with only {weakest?.average}% average</li>
              <li>• Consider additional tutoring for {weakest?.subject}</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
