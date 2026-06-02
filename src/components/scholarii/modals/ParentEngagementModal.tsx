import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { X } from "lucide-react";
import type { Student } from "@/lib/scholarii/types";

interface ParentEngagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
}

export function ParentEngagementModal({ open, onOpenChange, students }: ParentEngagementModalProps) {
  // Calculate engagement by class
  const classEngagement: Record<string, { total: number; engaged: number; notEngaged: number; avgScore: number }> = {};

  students.forEach((student) => {
    const classKey = `${student.grade}-${student.section}`;
    if (!classEngagement[classKey]) {
      classEngagement[classKey] = { total: 0, engaged: 0, notEngaged: 0, avgScore: 0 };
    }
    classEngagement[classKey].total += 1;
    const score = student.parentEngagementScore || 0;
    classEngagement[classKey].avgScore += score;
    if (score >= 70) classEngagement[classKey].engaged += 1;
    else classEngagement[classKey].notEngaged += 1;
  });

  // Calculate averages
  Object.values(classEngagement).forEach((stats) => {
    stats.avgScore = Math.round(stats.avgScore / stats.total);
  });

  const classEngagementArray = Object.entries(classEngagement)
    .map(([classKey, stats]) => ({
      class: classKey,
      percentage: Math.round((stats.engaged / stats.total) * 100),
      engaged: stats.engaged,
      notEngaged: stats.notEngaged,
      avgScore: stats.avgScore,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Overall stats
  const totalStudents = students.length;
  const engagedParents = students.filter((s) => (s.parentEngagementScore || 0) >= 70).length;
  const engagementPercentage = Math.round((engagedParents / totalStudents) * 100);
  const averageEngagement = Math.round(
    students.reduce((sum, s) => sum + (s.parentEngagementScore || 0), 0) / totalStudents
  );

  // Engagement metrics breakdown
  const engagementMetrics = [
    { metric: "Circular Read Rate", value: 78 },
    { metric: "PTM Confirmation Rate", value: 82 },
    { metric: "Homework Acknowledgment", value: 76 },
    { metric: "WhatsApp Open Rate", value: 85 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Parent Engagement Analysis</DialogTitle>
          <DialogClose className="rounded-lg p-1 hover:bg-accent">
            <X className="size-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
              <div className="text-xs text-muted-foreground">Overall Engagement</div>
              <div className="text-2xl font-bold mt-1">{averageEngagement}%</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{engagedParents} engaged</p>
            </Card>
            <Card className="p-4 bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900">
              <div className="text-xs text-muted-foreground">Engagement Rate</div>
              <div className="text-2xl font-bold mt-1">{engagementPercentage}%</div>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">Parents engaged</p>
            </Card>
            <Card className="p-4 bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
              <div className="text-xs text-muted-foreground">Total Families</div>
              <div className="text-2xl font-bold mt-1">{totalStudents}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Families tracked</p>
            </Card>
          </div>

          {/* Engagement Metrics Breakdown */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Engagement Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {engagementMetrics.map((item) => (
                <Card key={item.metric} className="p-4 bg-muted/20">
                  <div className="text-xs text-muted-foreground mb-2">{item.metric}</div>
                  <div className="flex items-end gap-2">
                    <div className="text-2xl font-bold">{item.value}%</div>
                    <div className="flex-1 h-8 bg-muted rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-from to-brand-to"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Class-wise Engagement */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Class-wise Engagement</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classEngagementArray}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="class" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="percentage" fill="var(--brand-from)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Table */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Engagement by Class</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Class</th>
                    <th className="px-4 py-2 text-right font-medium">Engaged</th>
                    <th className="px-4 py-2 text-right font-medium">Not Engaged</th>
                    <th className="px-4 py-2 text-right font-medium">Avg Score</th>
                    <th className="px-4 py-2 text-right font-medium">% Engaged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {classEngagementArray.map((item) => (
                    <tr key={item.class} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 font-medium">{item.class}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-600 dark:text-emerald-400">{item.engaged}</td>
                      <td className="px-4 py-2.5 text-right text-red-600 dark:text-red-400">{item.notEngaged}</td>
                      <td className="px-4 py-2.5 text-right">{item.avgScore}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights */}
          <Card className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              <li>• Focus on classes with engagement below 70%</li>
              <li>• WhatsApp communication is most effective (85% open rate)</li>
              <li>• Consider increasing PTM frequency for low engagement classes</li>
              <li>• Use targeted outreach for {totalStudents - engagedParents} disengaged families</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
