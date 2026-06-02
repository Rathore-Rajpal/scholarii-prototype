import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, ScatterChart, Scatter, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { X, AlertCircle } from "lucide-react";
import type { Teacher } from "@/lib/scholarii/types";

interface TeacherWorkloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teachers: Teacher[];
}

export function TeacherWorkloadModal({ open, onOpenChange, teachers }: TeacherWorkloadModalProps) {
  // Filter overloaded teachers
  const overloadedTeachers = teachers.filter((t) => t.isOverloaded);
  const activeTeachers = teachers.filter((t) => t.status === "Active");

  // Calculate statistics
  const avgClassesPerDay = Math.round(teachers.reduce((sum, t) => sum + (t.classesPerDay || 0), 0) / teachers.length);
  const avgPendingTasks = Math.round(teachers.reduce((sum, t) => sum + (t.pendingTasks || 0), 0) / teachers.length);

  // Department-wise workload
  const departmentWorkload: Record<string, { total: number; overloaded: number; avgClasses: number }> = {};

  teachers.forEach((teacher) => {
    const dept = teacher.department || "General";
    if (!departmentWorkload[dept]) {
      departmentWorkload[dept] = { total: 0, overloaded: 0, avgClasses: 0 };
    }
    departmentWorkload[dept].total += 1;
    if (teacher.isOverloaded) departmentWorkload[dept].overloaded += 1;
    departmentWorkload[dept].avgClasses += teacher.classesPerDay || 0;
  });

  const departmentData = Object.entries(departmentWorkload)
    .map(([dept, stats]) => ({
      department: dept,
      overloadedCount: stats.overloaded,
      totalTeachers: stats.total,
      overloadedPercentage: Math.round((stats.overloaded / stats.total) * 100),
      avgClassesPerDay: Math.round(stats.avgClasses / stats.total),
    }))
    .sort((a, b) => b.overloadedPercentage - a.overloadedPercentage);

  // Workload distribution
  const workloadData = teachers
    .map((t) => ({
      name: t.name.split(" ")[0],
      classesPerDay: t.classesPerDay || 0,
      pendingTasks: t.pendingTasks || 0,
      isOverloaded: t.isOverloaded ? 1 : 0,
    }))
    .sort((a, b) => b.classesPerDay - a.classesPerDay)
    .slice(0, 10); // Top 10 busiest teachers

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Teacher Workload Analysis</DialogTitle>
          <DialogClose className="rounded-lg p-1 hover:bg-accent">
            <X className="size-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
              <div className="text-xs text-muted-foreground">Total Teachers</div>
              <div className="text-2xl font-bold mt-1">{activeTeachers.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active teachers</p>
            </Card>
            <Card className="p-4 bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900">
              <div className="text-xs text-muted-foreground">Overloaded</div>
              <div className="text-2xl font-bold mt-1">{overloadedTeachers.length}</div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{Math.round((overloadedTeachers.length / activeTeachers.length) * 100)}% of staff</p>
            </Card>
            <Card className="p-4 bg-sky-50/40 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900">
              <div className="text-xs text-muted-foreground">Avg Classes/Day</div>
              <div className="text-2xl font-bold mt-1">{avgClassesPerDay}</div>
              <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">Optimal: 4-5 classes</p>
            </Card>
            <Card className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
              <div className="text-xs text-muted-foreground">Avg Pending Tasks</div>
              <div className="text-2xl font-bold mt-1">{avgPendingTasks}</div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Per teacher</p>
            </Card>
          </div>

          {/* Department Workload */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Department-wise Workload Stress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="department" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="overloadedCount" fill="var(--brand-from)" name="Overloaded Teachers" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Stress Table */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Department Stress Index</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Department</th>
                    <th className="px-4 py-2 text-right font-medium">Total Teachers</th>
                    <th className="px-4 py-2 text-right font-medium">Overloaded</th>
                    <th className="px-4 py-2 text-right font-medium">Stress Level</th>
                    <th className="px-4 py-2 text-right font-medium">Avg Classes/Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {departmentData.map((item) => {
                    const stressLevel =
                      item.overloadedPercentage >= 50 ? "High" : item.overloadedPercentage >= 25 ? "Moderate" : "Low";
                    const stressColor =
                      item.overloadedPercentage >= 50
                        ? "text-red-600 dark:text-red-400"
                        : item.overloadedPercentage >= 25
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-600 dark:text-emerald-400";

                    return (
                      <tr key={item.department} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{item.department}</td>
                        <td className="px-4 py-2.5 text-right">{item.totalTeachers}</td>
                        <td className="px-4 py-2.5 text-right text-red-600 dark:text-red-400">
                          {item.overloadedCount} ({item.overloadedPercentage}%)
                        </td>
                        <td className={`px-4 py-2.5 text-right font-semibold ${stressColor}`}>{stressLevel}</td>
                        <td className="px-4 py-2.5 text-right">{item.avgClassesPerDay}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overloaded Teachers */}
          {overloadedTeachers.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">Overloaded Teachers (Need Attention)</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Teacher Name</th>
                      <th className="px-4 py-2 text-left font-medium">Subject</th>
                      <th className="px-4 py-2 text-right font-medium">Classes/Day</th>
                      <th className="px-4 py-2 text-right font-medium">Pending Tasks</th>
                      <th className="px-4 py-2 text-left font-medium">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {overloadedTeachers.slice(0, 8).map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{teacher.name}</td>
                        <td className="px-4 py-2.5">{teacher.subject}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-red-600 dark:text-red-400">
                          {teacher.classesPerDay}
                        </td>
                        <td className="px-4 py-2.5 text-right">{teacher.pendingTasks}</td>
                        <td className="px-4 py-2.5">{teacher.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <Card className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <div className="flex gap-2 items-start">
              <AlertCircle className="size-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Recommendations</h4>
                <ul className="text-sm space-y-1 text-muted-foreground mt-1">
                  <li>• Balance teaching load across departments</li>
                  <li>• Consider hiring substitute teachers for high-stress periods</li>
                  <li>• Review {overloadedTeachers.length} overloaded teachers' schedules</li>
                  <li>• Implement task delegation system to reduce pending work</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
