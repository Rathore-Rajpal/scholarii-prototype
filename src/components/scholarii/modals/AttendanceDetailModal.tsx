import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { X } from "lucide-react";
import type { Student } from "@/lib/scholarii/types";

interface AttendanceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
}

export function AttendanceDetailModal({ open, onOpenChange, students }: AttendanceDetailModalProps) {
  // Calculate class-wise attendance
  const classAttendance: Record<string, { present: number; total: number; percentage: number }> = {};
  
  students.forEach((student) => {
    const classKey = `${student.grade}-${student.section}`;
    if (!classAttendance[classKey]) {
      classAttendance[classKey] = { present: 0, total: 0, percentage: 0 };
    }
    classAttendance[classKey].total += 1;
    if (student.attendance >= 75) {
      classAttendance[classKey].present += 1;
    }
  });

  // Calculate percentages
  Object.values(classAttendance).forEach((stats) => {
    stats.percentage = Math.round((stats.present / stats.total) * 100);
  });

  const classAttendanceArray = Object.entries(classAttendance)
    .map(([classKey, stats]) => ({
      class: classKey,
      percentage: stats.percentage,
      present: stats.present,
      absent: stats.total - stats.present,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // School statistics
  const totalStudents = students.length;
  const presentStudents = students.filter((s) => s.attendance >= 75).length;
  const schoolAverage = Math.round((presentStudents / totalStudents) * 100);

  // Trends mock data
  const trendData = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    attendance: 85 + Math.random() * 10,
  }));

  // Chronic absentees
  const chronicAbsentees = students.filter((s) => s.isChronicAbsentee);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Student Attendance Analysis</DialogTitle>
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
              <div className="text-xs text-muted-foreground">Present Today</div>
              <div className="text-2xl font-bold mt-1">{presentStudents}</div>
            </Card>
            <Card className="p-4 bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900">
              <div className="text-xs text-muted-foreground">Chronic Absentees</div>
              <div className="text-2xl font-bold mt-1">{chronicAbsentees.length}</div>
            </Card>
          </div>

          {/* Attendance Trend */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Attendance Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <defs>
                  <linearGradient id="attTrend" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--brand-from)" />
                    <stop offset="100%" stopColor="var(--brand-to)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis domain={[80, 100]} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="attendance" stroke="url(#attTrend)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Class-wise Attendance */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Class-wise Attendance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={classAttendanceArray}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="class" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="percentage" fill="var(--brand-from)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Class Attendance Table */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Attendance by Class</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 border-b border-border">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Class</th>
                    <th className="px-4 py-2 text-right font-medium">Present</th>
                    <th className="px-4 py-2 text-right font-medium">Absent</th>
                    <th className="px-4 py-2 text-right font-medium">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {classAttendanceArray.map((item) => (
                    <tr key={item.class} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 font-medium">{item.class}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-600 dark:text-emerald-400">{item.present}</td>
                      <td className="px-4 py-2.5 text-right text-red-600 dark:text-red-400">{item.absent}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Insights */}
          <Card className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <h4 className="font-semibold text-sm mb-2">Insights</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Highest attendance: {classAttendanceArray[0]?.class || "N/A"} ({classAttendanceArray[0]?.percentage}%)</li>
              <li>• Lowest attendance: {classAttendanceArray[classAttendanceArray.length - 1]?.class || "N/A"} ({classAttendanceArray[classAttendanceArray.length - 1]?.percentage}%)</li>
              <li>• Total chronic absentees: {chronicAbsentees.length} students need intervention</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
