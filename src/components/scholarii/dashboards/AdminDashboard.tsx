import { PageHeader, StatCard } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Activity, DollarSign, ClipboardList, Plus, FileText, HardDrive, UserPlus } from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";
import { useMemo } from "react";

export function AdminDashboard() {
  const data = useMemo(() => loadData(), []);
  const totalUsers = data.students.length + data.teachers.length + 200; // include parents
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="System health and recent activity." />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={totalUsers.toString()} hint="Students + Teachers + Parents" />
        <StatCard icon={Activity} label="Active Sessions" value="142" tone="success" />
        <StatCard icon={DollarSign} label="Fee Collection Today" value="₹86,450" tone="warning" />
        <StatCard icon={ClipboardList} label="Pending Tasks" value="7" tone="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { i: UserPlus, l: "Add User" },
              { i: DollarSign, l: "Record Payment" },
              { i: FileText, l: "Generate Report" },
              { i: HardDrive, l: "System Backup" },
            ].map((a) => (
              <button key={a.l} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-sm">
                <div className="size-9 rounded-lg bg-brand-gradient grid place-items-center text-white"><a.i className="size-4" /></div>
                <span className="font-medium">{a.l}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              { t: "User created", d: "New student account: Aarush Joshi", time: "5 min ago" },
              { t: "Fee payment", d: "₹45,000 recorded for S0087", time: "1 hour ago" },
              { t: "System update", d: "Backup completed successfully", time: "3 hours ago" },
              { t: "Login activity", d: "23 teachers logged in today", time: "Today" },
              { t: "Permission change", d: "Updated role for Priya Mehta", time: "Yesterday" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="size-2 rounded-full mt-2 bg-brand-gradient" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.t}</div>
                  <div className="text-xs text-muted-foreground">{a.d}</div>
                </div>
                <div className="text-xs text-muted-foreground">{a.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <h3 className="font-semibold mb-4">System Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: "API Uptime", v: "99.98%" }, { l: "Database", v: "Healthy" },
            { l: "Storage Used", v: "68%" }, { l: "Last Backup", v: "Today 3 AM" },
          ].map((s) => (
            <div key={s.l} className="p-4 rounded-xl bg-muted/40">
              <div className="text-xs text-muted-foreground">{s.l}</div>
              <div className="text-lg font-semibold mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
