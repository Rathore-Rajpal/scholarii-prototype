import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Users, GraduationCap, DollarSign, Activity } from "lucide-react";
import { monthlyAttendance, feeCollection } from "@/lib/scholarii/mock";

export const Route = createFileRoute("/app/analytics")({ component: AnalyticsPage });

const enrollment = [
  { m: "Apr", v: 420 }, { m: "May", v: 432 }, { m: "Jun", v: 445 },
  { m: "Jul", v: 460 }, { m: "Aug", v: 478 }, { m: "Sep", v: 490 }, { m: "Oct", v: 512 },
];
const gender = [{ name: "Boys", value: 268, c: "#667eea" }, { name: "Girls", value: 244, c: "#ec4899" }];
const sources = [
  { src: "Referrals", v: 38 }, { src: "Walk-in", v: 24 }, { src: "Website", v: 20 }, { src: "Social", v: 12 }, { src: "Events", v: 6 },
];

function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="School-wide trends, KPIs and reports." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total Students", v: "512", d: "+22 this month", up: true, i: Users, c: "from-violet-500 to-fuchsia-500" },
          { l: "Avg Attendance", v: "93.4%", d: "+1.2% vs last", up: true, i: Activity, c: "from-emerald-500 to-teal-500" },
          { l: "Fee Collected", v: "₹6.85L", d: "-2.1% vs target", up: false, i: DollarSign, c: "from-amber-500 to-orange-500" },
          { l: "Avg Grade", v: "B+", d: "Stable", up: true, i: GraduationCap, c: "from-sky-500 to-indigo-500" },
        ].map((k) => (
          <Card key={k.l} className="p-5">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${k.c} grid place-items-center text-white mb-3`}><k.i className="size-5" /></div>
            <div className="text-2xl font-semibold">{k.v}</div>
            <div className="text-xs text-muted-foreground">{k.l}</div>
            <div className={`text-xs mt-2 inline-flex items-center gap-1 ${k.up ? "text-emerald-600" : "text-red-600"}`}>{k.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}{k.d}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="font-semibold mb-3">Attendance trend</div>
            <div className="h-64"><ResponsiveContainer><AreaChart data={monthlyAttendance}><defs><linearGradient id="a1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#667eea" stopOpacity={0.4} /><stop offset="100%" stopColor="#667eea" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="m" /><YAxis /><Tooltip /><Area dataKey="v" stroke="#667eea" fill="url(#a1)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
          </Card>
          <Card className="p-5">
            <div className="font-semibold mb-3">Gender split</div>
            <div className="h-64"><ResponsiveContainer><PieChart><Pie data={gender} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={3}>{gender.map((g) => <Cell key={g.name} fill={g.c} />)}</Pie><Legend /></PieChart></ResponsiveContainer></div>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="mt-4 grid lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="font-semibold mb-3">Enrollment growth</div>
            <div className="h-64"><ResponsiveContainer><AreaChart data={enrollment}><defs><linearGradient id="a2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.4} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="m" /><YAxis /><Tooltip /><Area dataKey="v" stroke="#10b981" fill="url(#a2)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
          </Card>
          <Card className="p-5">
            <div className="font-semibold mb-3">Admission sources (%)</div>
            <div className="h-64"><ResponsiveContainer><BarChart data={sources}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="src" /><YAxis /><Tooltip /><Bar dataKey="v" fill="#8b5cf6" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="mt-4">
          <Card className="p-5">
            <div className="font-semibold mb-3">Fee collection (monthly)</div>
            <div className="h-72"><ResponsiveContainer><BarChart data={feeCollection}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="m" /><YAxis /><Tooltip formatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} /><Bar dataKey="v" fill="url(#g2)" radius={[8, 8, 0, 0]} /><defs><linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#ef4444" /></linearGradient></defs></BarChart></ResponsiveContainer></div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-5 mt-6">
        <div className="font-semibold mb-3">Recent insights</div>
        <ul className="space-y-2 text-sm">
          {["Attendance up 1.2% — best month since June.", "Class 10-A leads in academic performance for 3rd straight month.", "Fee collection slightly behind Q3 target; 18 pending parents.", "Computer Science marks improved 6% after new teacher onboarding."].map((t, i) => (
            <li key={i} className="flex gap-2"><Badge variant="outline" className="shrink-0">{i + 1}</Badge>{t}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
