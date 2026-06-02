import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import type { Teacher } from "@/lib/scholarii/types";

interface TeacherAttendanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teachers: Teacher[];
}

export function TeacherAttendanceModal({ open, onOpenChange, teachers }: TeacherAttendanceModalProps) {
  // Categorize teachers by status
  const activeTeachers = teachers.filter((t) => t.status === "Active");
  const onLeaveTeachers = teachers.filter((t) => t.status === "On Leave");
  const lateTeachers = teachers.filter((t) => t.status === "Late");

  // Department impact analysis
  const departmentImpact: Record<string, { affected: number; departments: Set<string> }> = {};

  onLeaveTeachers.forEach((teacher) => {
    teacher.classes.forEach((className) => {
      if (!departmentImpact[className]) {
        departmentImpact[className] = { affected: 0, departments: new Set() };
      }
      departmentImpact[className].affected += 1;
      if (teacher.department) {
        departmentImpact[className].departments.add(teacher.department);
      }
    });
  });

  const impactedClasses = Object.entries(departmentImpact)
    .map(([className, impact]) => ({
      class: className,
      affectedTeachers: impact.affected,
      departments: Array.from(impact.departments).join(", "),
    }))
    .sort((a, b) => b.affectedTeachers - a.affectedTeachers);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Teacher Attendance Overview</DialogTitle>
          <DialogClose className="rounded-lg p-1 hover:bg-accent">
            <X className="size-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
              <div className="text-xs text-muted-foreground">Present Today</div>
              <div className="text-2xl font-bold mt-1">{activeTeachers.length}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Out of {teachers.length} teachers</p>
            </Card>
            <Card className="p-4 bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
              <div className="text-xs text-muted-foreground">On Leave</div>
              <div className="text-2xl font-bold mt-1">{onLeaveTeachers.length}</div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Classes impacted</p>
            </Card>
            <Card className="p-4 bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900">
              <div className="text-xs text-muted-foreground">Running Late</div>
              <div className="text-2xl font-bold mt-1">{lateTeachers.length}</div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">Teachers</p>
            </Card>
          </div>

          {/* Present Teachers */}
          {activeTeachers.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">Present Teachers ({activeTeachers.length})</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Teacher Name</th>
                      <th className="px-4 py-2 text-left font-medium">Subject</th>
                      <th className="px-4 py-2 text-left font-medium">Classes</th>
                      <th className="px-4 py-2 text-left font-medium">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activeTeachers.slice(0, 10).map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{teacher.name}</td>
                        <td className="px-4 py-2.5">{teacher.subject}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground">{teacher.classes.join(", ")}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground">{teacher.department || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* On Leave Teachers */}
          {onLeaveTeachers.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">On Leave ({onLeaveTeachers.length})</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Teacher Name</th>
                      <th className="px-4 py-2 text-left font-medium">Subject</th>
                      <th className="px-4 py-2 text-left font-medium">Classes Impacted</th>
                      <th className="px-4 py-2 text-left font-medium">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {onLeaveTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-muted/20 transition-colors bg-amber-50/20 dark:bg-amber-950/10">
                        <td className="px-4 py-2.5 font-medium">{teacher.name}</td>
                        <td className="px-4 py-2.5">{teacher.subject}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground">{teacher.classes.length}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground">{teacher.department || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Late Teachers */}
          {lateTeachers.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">Running Late ({lateTeachers.length})</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Teacher Name</th>
                      <th className="px-4 py-2 text-left font-medium">Subject</th>
                      <th className="px-4 py-2 text-left font-medium">Classes Today</th>
                      <th className="px-4 py-2 text-left font-medium">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {lateTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-muted/20 transition-colors bg-red-50/20 dark:bg-red-950/10">
                        <td className="px-4 py-2.5 font-medium">{teacher.name}</td>
                        <td className="px-4 py-2.5">{teacher.subject}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground">{teacher.classes.length}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground">{teacher.department || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Classes Impacted */}
          {impactedClasses.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">Classes Impacted by Absences</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Class</th>
                      <th className="px-4 py-2 text-right font-medium">Teachers on Leave</th>
                      <th className="px-4 py-2 text-left font-medium">Departments Affected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {impactedClasses.map((item) => (
                      <tr key={item.class} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 font-medium">{item.class}</td>
                        <td className="px-4 py-2.5 text-right">{item.affectedTeachers}</td>
                        <td className="px-4 py-2.5">{item.departments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Substitutes Info */}
          <Card className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <h4 className="font-semibold text-sm mb-2">Substitute Teacher Assignment</h4>
            <p className="text-sm text-muted-foreground">
              {onLeaveTeachers.length === 0
                ? "No substitute assignments needed today."
                : `${onLeaveTeachers.length} substitute teacher(s) assigned to cover ${impactedClasses.length} class(es).`}
            </p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
