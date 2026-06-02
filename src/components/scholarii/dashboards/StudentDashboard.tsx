import { PageHeader, StatCard } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardCheck, ClipboardList, GraduationCap, Wallet, Clock, BookOpen } from "lucide-react";

export function StudentDashboard() {
  const today = [
    { time: "08:30", subject: "Mathematics", teacher: "Mr. Kumar", room: "201", now: true },
    { time: "09:20", subject: "English", teacher: "Ms. Iyer", room: "105" },
    { time: "10:30", subject: "Science", teacher: "Mr. Rao", room: "Lab 2" },
    { time: "11:20", subject: "History", teacher: "Ms. Joshi", room: "302" },
  ];
  const pending = [
    { subject: "Mathematics", title: "Quadratic Equations Worksheet", due: "Tomorrow", urgent: true },
    { subject: "Science", title: "Lab Report — Ohm's Law", due: "In 3 days" },
    { subject: "English", title: "Essay: My Favourite Book", due: "In 5 days" },
  ];
  const grades = [
    { subject: "Mathematics", score: "92/100", grade: "A+" },
    { subject: "Science", score: "85/100", grade: "A" },
    { subject: "English", score: "78/100", grade: "B+" },
  ];

  return (
    <div>
      <PageHeader title="Hello, Aarav 👋" subtitle="Here's your day at a glance." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardCheck} label="Attendance" value="94%" tone="success" />
        <StatCard icon={ClipboardList} label="Pending Work" value="3" tone="warning" />
        <StatCard icon={GraduationCap} label="Upcoming Exams" value="2" tone="info" />
        <StatCard icon={Wallet} label="Fee Status" value="Paid" hint="Next due: Jan 10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Today's Classes</h3>
          <div className="space-y-2">
            {today.map((t) => (
              <div key={t.time} className={`flex items-center gap-4 p-3 rounded-xl border ${t.now ? "border-primary bg-accent/40" : "border-border"}`}>
                <div className="text-sm font-medium w-16 flex items-center gap-1"><Clock className="size-3.5" />{t.time}</div>
                <div className="flex-1">
                  <div className="font-medium">{t.subject} {t.now && <Badge className="ml-2 bg-brand-gradient border-0">Now</Badge>}</div>
                  <div className="text-xs text-muted-foreground">{t.teacher} • {t.room}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Recent Grades</h3>
          <div className="space-y-3">
            {grades.map((g) => (
              <div key={g.subject} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{g.subject}</div>
                  <div className="text-xs text-muted-foreground">{g.score}</div>
                </div>
                <div className="size-9 rounded-lg bg-brand-gradient text-white font-bold grid place-items-center text-sm">{g.grade}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pending Assignments</h3>
          <Button size="sm" variant="ghost">View all</Button>
        </div>
        <div className="space-y-2">
          {pending.map((p) => (
            <div key={p.title} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors">
              <div className="size-10 rounded-lg bg-accent grid place-items-center"><BookOpen className="size-4 text-accent-foreground" /></div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.subject}</div>
              </div>
              <Badge variant={p.urgent ? "destructive" : "secondary"}>{p.due}</Badge>
              <Button size="sm" className="bg-brand-gradient text-white border-0">Submit</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Overall Attendance</h3>
          <span className="text-2xl font-bold text-brand-gradient">94%</span>
        </div>
        <Progress value={94} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">You're doing great — keep it above 75% to stay eligible for exams.</p>
      </Card>
    </div>
  );
}
