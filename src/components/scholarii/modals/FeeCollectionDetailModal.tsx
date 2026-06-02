import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { X, TrendingUp, AlertCircle } from "lucide-react";
import type { Student } from "@/lib/scholarii/types";

interface FeeCollectionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
  feeTarget: number;
}

export function FeeCollectionDetailModal({ open, onOpenChange, students, feeTarget }: FeeCollectionDetailModalProps) {
  // Calculate class-wise fee collection
  const classFeesData: Record<string, { paid: number; pending: number; overdue: number; total: number }> = {};

  students.forEach((student) => {
    const classKey = `${student.grade}-${student.section}`;
    if (!classFeesData[classKey]) {
      classFeesData[classKey] = { paid: 0, pending: 0, overdue: 0, total: 0 };
    }
    classFeesData[classKey].total += 1;
    if (student.feeStatus === "Paid") classFeesData[classKey].paid += 1;
    else if (student.feeStatus === "Pending") classFeesData[classKey].pending += 1;
    else classFeesData[classKey].overdue += 1;
  });

  const classFeesArray = Object.entries(classFeesData)
    .map(([classKey, stats]) => ({
      class: classKey,
      paid: stats.paid,
      pending: stats.pending,
      overdue: stats.overdue,
      percentage: Math.round((stats.paid / stats.total) * 100),
    }))
    .sort((a, b) => a.percentage - b.percentage);

  // Overall stats
  const totalStudents = students.length;
  const paidStudents = students.filter((s) => s.feeStatus === "Paid").length;
  const pendingStudents = students.filter((s) => s.feeStatus === "Pending").length;
  const overdueStudents = students.filter((s) => s.feeStatus === "Overdue").length;

  const averageFeePerStudent = feeTarget / totalStudents;
  const collectedAmount = paidStudents * averageFeePerStudent;
  const pendingAmount = pendingStudents * averageFeePerStudent;
  const overdueAmount = overdueStudents * averageFeePerStudent;
  const percentOfTarget = Math.round((collectedAmount / feeTarget) * 100);

  // Monthly trend data
  const monthlyTrendData = [
    { month: "Apr", collected: 480, target: 800 },
    { month: "May", collected: 520, target: 800 },
    { month: "Jun", collected: 610, target: 800 },
    { month: "Jul", collected: 590, target: 800 },
    { month: "Aug", collected: 640, target: 800 },
    { month: "Sep", collected: 700, target: 800 },
    { month: "Oct", collected: 720, target: 800 },
    { month: "Nov", collected: 685, target: 800 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Fee Collection Analysis</DialogTitle>
          <DialogClose className="rounded-lg p-1 hover:bg-accent">
            <X className="size-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
              <div className="text-xs text-muted-foreground">Collected</div>
              <div className="text-xl font-bold mt-1">₹{(collectedAmount / 100000).toFixed(1)}L</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{paidStudents} students</p>
            </Card>
            <Card className="p-4 bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900">
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="text-xl font-bold mt-1">₹{(pendingAmount / 100000).toFixed(1)}L</div>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">{pendingStudents} students</p>
            </Card>
            <Card className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
              <div className="text-xs text-muted-foreground">Overdue</div>
              <div className="text-xl font-bold mt-1">₹{(overdueAmount / 100000).toFixed(1)}L</div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{overdueStudents} students</p>
            </Card>
            <Card className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <div className="text-xs text-muted-foreground">% of Target</div>
              <div className="text-xl font-bold mt-1">{percentOfTarget}%</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Target: ₹{(feeTarget / 100000).toFixed(1)}L</p>
            </Card>
          </div>

          {/* Monthly Trend */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Monthly Collection Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="feeTrend" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--brand-from)" />
                    <stop offset="100%" stopColor="var(--brand-to)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} label={{ value: "₹ (in thousands)", angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="collected" stroke="url(#feeTrend)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="var(--muted-foreground)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Class-wise Collection */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Class-wise Collection Status</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Class</th>
                    <th className="px-4 py-2 text-right font-medium">Paid</th>
                    <th className="px-4 py-2 text-right font-medium">Pending</th>
                    <th className="px-4 py-2 text-right font-medium">Overdue</th>
                    <th className="px-4 py-2 text-right font-medium">Collection %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {classFeesArray.map((item) => (
                    <tr key={item.class} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 font-medium">{item.class}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-600 dark:text-emerald-400">{item.paid}</td>
                      <td className="px-4 py-2.5 text-right text-sky-600 dark:text-sky-400">{item.pending}</td>
                      <td className="px-4 py-2.5 text-right text-red-600 dark:text-red-400">{item.overdue}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Status Summary */}
          <Card className="p-4 border-2 border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex gap-2 items-start">
              <AlertCircle className="size-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Action Required</h4>
                <ul className="text-sm space-y-1 text-muted-foreground mt-1">
                  <li>• {overdueStudents} students have overdue fees (₹{(overdueAmount / 100000).toFixed(1)}L)</li>
                  <li>• Current collection is {percentOfTarget}% of target</li>
                  <li>• Focus on classes with &lt;75% collection rate</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
