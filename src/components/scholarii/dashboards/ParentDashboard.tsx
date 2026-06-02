import { PageHeader, StatCard } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, ClipboardList, GraduationCap, Wallet, Wallet as Pay, FileText, MessageSquare, CalendarDays } from "lucide-react";
import { useState } from "react";

const CHILDREN = [
  { id: "c1", name: "Aarav Sharma", class: "8-A", color: "#10b981" },
  { id: "c2", name: "Diya Sharma", class: "5-B", color: "#ec4899" },
];

export function ParentDashboard() {
  const [child, setChild] = useState(CHILDREN[0].id);
  const c = CHILDREN.find((x) => x.id === child)!;
  return (
    <div>
      <PageHeader
        title={`Hi, Mr. Sharma`}
        subtitle="Stay updated on your child's school day."
        action={
          <div className="flex items-center gap-3">
            <Avatar><AvatarFallback style={{ backgroundColor: c.color, color: "white" }}>{c.name.split(" ").map(s=>s[0]).join("")}</AvatarFallback></Avatar>
            <Select value={child} onValueChange={setChild}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHILDREN.map((x) => <SelectItem key={x.id} value={x.id}>{x.name} — Class {x.class}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardCheck} label="Attendance" value="94%" tone="success" />
        <StatCard icon={ClipboardList} label="Pending Work" value="2" tone="warning" />
        <StatCard icon={GraduationCap} label="Latest Grade" value="A" tone="info" />
        <StatCard icon={Wallet} label="Fee Status" value="Paid" hint="Next: Jan 10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Today's Update — {c.name}</h3>
          <div className="space-y-3">
            {[
              { t: "Classes attended", d: "6 of 6 classes today", tone: "bg-emerald-500" },
              { t: "Homework assigned", d: "Mathematics — Chapter 4 exercise", tone: "bg-violet-500" },
              { t: "Teacher note", d: "Excellent participation in Science class", tone: "bg-sky-500" },
              { t: "Tomorrow's classes", d: "Math, English, Hindi, PE, Science, History", tone: "bg-amber-500" },
            ].map((u, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <div className={`size-2 rounded-full mt-2 ${u.tone}`} />
                <div>
                  <div className="text-sm font-medium">{u.t}</div>
                  <div className="text-sm text-muted-foreground">{u.d}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { i: Pay, l: "Pay fees" },
              { i: FileText, l: "View report card" },
              { i: MessageSquare, l: "Contact teacher" },
              { i: CalendarDays, l: "Apply for leave" },
            ].map((a) => (
              <button key={a.l} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm">
                <div className="size-9 rounded-lg bg-brand-gradient grid place-items-center text-white"><a.i className="size-4" /></div>
                <span className="font-medium">{a.l}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <h3 className="font-semibold mb-4">Recent Announcements</h3>
        <div className="space-y-3">
          {[
            { t: "Sports Day on Dec 15", d: "All students must attend in sports uniform", p: "Important" as const },
            { t: "Diwali Holidays", d: "School closed Oct 28 – Nov 5", p: "Normal" as const },
            { t: "Fee deadline extended", d: "Q3 deadline moved to Nov 10", p: "Urgent" as const },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{a.t}</div>
                  <Badge variant={a.p === "Urgent" ? "destructive" : a.p === "Important" ? "default" : "secondary"} className={a.p === "Important" ? "bg-brand-gradient border-0" : ""}>{a.p}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{a.d}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
