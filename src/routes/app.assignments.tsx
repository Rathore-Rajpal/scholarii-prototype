import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Upload } from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";
import { useAuth } from "@/lib/scholarii/auth";
import { useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/app/assignments")({ component: AssignmentsPage });

function AssignmentsPage() {
  const { user } = useAuth();
  const data = useMemo(() => loadData(), []);
  const isStudent = user?.role === "student";

  return (
    <div>
      <PageHeader
        title="Assignments"
        subtitle={isStudent ? "Track your assignments and submissions." : "Create and review assignments."}
        action={!isStudent && <Button size="sm" className="bg-brand-gradient text-white border-0"><Plus className="size-4 mr-1" />Create Assignment</Button>}
      />
      <Tabs defaultValue={isStudent ? "pending" : "all"}>
        <TabsList>
          {isStudent ? (
            <>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="review">Pending Review</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
            </>
          )}
        </TabsList>

        {(["all", "pending", "review", "submitted", "graded"] as const).map((k) => (
          <TabsContent key={k} value={k} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.assignments.map((a) => {
                const due = new Date(a.dueDate);
                const overdue = due.getTime() < Date.now();
                return (
                  <Card key={a.id} className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs text-primary font-medium">{a.subject}</div>
                        <div className="font-semibold mt-1 truncate">{a.title}</div>
                      </div>
                      <Badge variant={overdue ? "destructive" : "secondary"}>{overdue ? "Overdue" : "Due " + format(due, "MMM d")}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Class {a.class} • {a.submitted}/{a.total} submitted</div>
                    <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-brand-gradient" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
                    </div>
                    <div className="mt-4 flex gap-2">
                      {isStudent ? (
                        <Button size="sm" className="bg-brand-gradient text-white border-0 flex-1" onClick={() => toast.success("Submission flow coming soon")}><Upload className="size-3.5 mr-1" />Submit</Button>
                      ) : (
                        <Button size="sm" variant="outline" className="flex-1"><FileText className="size-3.5 mr-1" />View ({a.graded} graded)</Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
