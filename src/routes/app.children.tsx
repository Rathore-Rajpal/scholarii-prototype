import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, ClipboardCheck, GraduationCap, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/children")({ component: ChildrenPage });

const kids = [
  { name: "Aarav Sharma", class: "Class 8-A", roll: "8A07", attendance: 94, grade: "A", fees: "Paid", color: "#667eea", next: "Math Test · Fri" },
  { name: "Diya Sharma", class: "Class 5-B", roll: "5B03", attendance: 88, grade: "A-", fees: "Pending", color: "#ec4899", next: "Art Project · Mon" },
];

function ChildrenPage() {
  return (
    <div>
      <PageHeader title="My Children" subtitle="Profiles and progress of your enrolled children." />
      <div className="grid lg:grid-cols-2 gap-5">
        {kids.map((k) => (
          <Card key={k.name} className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16"><AvatarFallback style={{ backgroundColor: k.color, color: "white" }} className="text-lg">{k.name.split(" ").map(p => p[0]).join("")}</AvatarFallback></Avatar>
              <div className="flex-1">
                <div className="text-lg font-semibold">{k.name}</div>
                <div className="text-sm text-muted-foreground">{k.class} · Roll {k.roll}</div>
              </div>
              <Badge className="bg-brand-gradient text-white border-0">{k.grade}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <Stat icon={ClipboardCheck} label="Attendance" value={`${k.attendance}%`} />
              <Stat icon={GraduationCap} label="Avg Grade" value={k.grade} />
              <Stat icon={Wallet} label="Fees" value={k.fees} />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-sm mb-1.5"><span className="text-muted-foreground">Term progress</span><span className="font-medium">{k.attendance}%</span></div>
              <Progress value={k.attendance} />
            </div>

            <div className="mt-5 flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 text-sm"><Calendar className="size-4 text-muted-foreground" /><span className="text-muted-foreground">Next:</span><span className="font-medium">{k.next}</span></div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-muted/40 text-center">
      <Icon className="size-4 mx-auto text-muted-foreground mb-1.5" />
      <div className="font-semibold text-sm">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}
