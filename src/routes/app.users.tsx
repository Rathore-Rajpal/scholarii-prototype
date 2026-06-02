import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, MoreHorizontal, Shield } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/users")({ component: UsersPage });

const palette = ["#667eea", "#764ba2", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899"];
const users = [
  { name: "Dr. Rajesh Kumar", email: "rajesh@scholarii.school", role: "Principal", status: "Active", last: "2m ago" },
  { name: "Priya Verma", email: "priya@scholarii.school", role: "Admin", status: "Active", last: "12m ago" },
  { name: "Suresh Mehta", email: "suresh@scholarii.school", role: "Teacher", status: "Active", last: "47m ago" },
  { name: "Anita Iyer", email: "anita@scholarii.school", role: "Teacher", status: "On Leave", last: "Yesterday" },
  { name: "Vikram Singh", email: "vikram@scholarii.school", role: "Teacher", status: "Active", last: "3h ago" },
  { name: "Aarav Sharma", email: "aarav.s@student.scholarii", role: "Student", status: "Active", last: "1h ago" },
  { name: "Diya Sharma", email: "diya.s@student.scholarii", role: "Student", status: "Active", last: "1h ago" },
  { name: "Mr. Arjun Patel", email: "arjun.p@parent.scholarii", role: "Parent", status: "Active", last: "5h ago" },
  { name: "Mrs. Neha Reddy", email: "neha.r@parent.scholarii", role: "Parent", status: "Invited", last: "—" },
  { name: "Kavya Joshi", email: "kavya@scholarii.school", role: "Admin", status: "Suspended", last: "Last week" },
];

const roleColor: Record<string, string> = {
  Principal: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  Admin: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  Teacher: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  Student: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Parent: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

function UsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const rows = users.filter((u) => (!q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())) && (role === "all" || u.role === role));

  return (
    <div>
      <PageHeader title="User Management" subtitle={`${users.length} users across all roles.`} action={<Button size="sm" className="bg-brand-gradient text-white border-0"><UserPlus className="size-4 mr-1" />Invite User</Button>} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {["Principal", "Admin", "Teacher", "Student", "Parent"].map((r) => (
          <Card key={r} className="p-4"><div className="flex items-center gap-2"><Shield className="size-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">{r}s</span></div><div className="text-xl font-semibold mt-1">{users.filter(u => u.role === r).length}</div></Card>
        ))}
      </div>

      <Card className="p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search name or email..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Select value={role} onValueChange={setRole}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All roles</SelectItem>{["Principal", "Admin", "Teacher", "Student", "Parent"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Last active</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((u, i) => (
              <TableRow key={u.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8"><AvatarFallback style={{ backgroundColor: palette[i % palette.length], color: "white" }}>{u.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                    <div><div className="font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                  </div>
                </TableCell>
                <TableCell><Badge className={roleColor[u.role]}>{u.role}</Badge></TableCell>
                <TableCell>
                  <Badge variant={u.status === "Active" ? "secondary" : u.status === "Suspended" ? "destructive" : "outline"} className={u.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : ""}>{u.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.last}</TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
