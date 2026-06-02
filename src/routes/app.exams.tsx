import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Award, FileText } from "lucide-react";

export const Route = createFileRoute("/app/exams")({ component: ExamsPage });

const upcoming = [
  { sub: "Mathematics", date: "Mon, Dec 09", time: "9:00 AM", dur: "2h", room: "Hall A", syllabus: 85 },
  { sub: "Science", date: "Wed, Dec 11", time: "9:00 AM", dur: "2h", room: "Hall A", syllabus: 72 },
  { sub: "English", date: "Fri, Dec 13", time: "9:00 AM", dur: "2h", room: "Hall B", syllabus: 90 },
  { sub: "Social Studies", date: "Mon, Dec 16", time: "9:00 AM", dur: "2h", room: "Hall A", syllabus: 60 },
];

const results = [
  { sub: "Mathematics", marks: 87, max: 100, grade: "A", rank: 4 },
  { sub: "Science", marks: 91, max: 100, grade: "A+", rank: 2 },
  { sub: "English", marks: 78, max: 100, grade: "B+", rank: 9 },
  { sub: "Hindi", marks: 82, max: 100, grade: "A-", rank: 6 },
  { sub: "Computer Science", marks: 95, max: 100, grade: "A+", rank: 1 },
];

function ExamsPage() {
  const total = results.reduce((s, r) => s + r.marks, 0);
  const max = results.reduce((s, r) => s + r.max, 0);
  const pct = Math.round((total / max) * 100);

  return (
    <div>
      <PageHeader title="Exams & Results" subtitle="Mid-term exam schedule and recent results." />
      <Tabs defaultValue="upcoming">
        <TabsList><TabsTrigger value="upcoming">Upcoming</TabsTrigger><TabsTrigger value="results">Results</TabsTrigger></TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {upcoming.map((u) => (
              <Card key={u.sub} className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg">{u.sub}</div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1"><Calendar className="size-3.5" />{u.date} · {u.time} · {u.dur}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Room {u.room}</div>
                  </div>
                  <Badge variant="outline">Mid-term</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">Syllabus completed</span><span className="font-medium">{u.syllabus}%</span></div>
                  <Progress value={u.syllabus} />
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full"><FileText className="size-3.5 mr-1.5" />View syllabus</Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card className="p-6 mb-4 bg-brand-gradient text-white">
            <div className="flex items-center gap-4">
              <Award className="size-10" />
              <div className="flex-1">
                <div className="text-sm opacity-90">Term 1 · Overall</div>
                <div className="text-3xl font-bold">{pct}% — Grade A</div>
                <div className="text-sm opacity-90 mt-1">Class rank: 4 of 32</div>
              </div>
              <Button variant="secondary" className="bg-white text-foreground">Download</Button>
            </div>
          </Card>

          <Card className="divide-y divide-border">
            {results.map((r) => (
              <div key={r.sub} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium">{r.sub}</div>
                  <div className="text-xs text-muted-foreground">Rank #{r.rank}</div>
                </div>
                <div className="text-right min-w-24">
                  <div className="text-xl font-semibold">{r.marks}<span className="text-sm text-muted-foreground">/{r.max}</span></div>
                </div>
                <Badge className="bg-brand-gradient text-white border-0 min-w-12 justify-center">{r.grade}</Badge>
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
