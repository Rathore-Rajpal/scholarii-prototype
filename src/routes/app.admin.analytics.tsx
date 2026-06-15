import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/app/admin/analytics")({ component: AdminAnalyticsPage });

const attendanceTrend = Array.from({ length: 30 }, (_, index) => ({ day: index + 1, attendance: 86 + ((index * 3) % 9) }));
const attendanceRows = [
  ["Class 1", "82", "8", "91%"],
  ["Class 2", "78", "10", "89%"],
  ["Class 3", "76", "12", "86%"],
  ["Class 4", "84", "6", "93%"],
  ["Class 5", "81", "7", "92%"],
];
const feeByGrade = [
  { grade: "Grade 1", collected: 82000 },
  { grade: "Grade 2", collected: 76000 },
  { grade: "Grade 3", collected: 92000 },
  { grade: "Grade 4", collected: 108000 },
  { grade: "Grade 5", collected: 124000 },
];
const feeRows = [
  ["Grade 1", "Rs 82,000", "Rs 18,000", "82%"],
  ["Grade 2", "Rs 76,000", "Rs 24,000", "76%"],
  ["Grade 3", "Rs 92,000", "Rs 16,000", "85%"],
  ["Grade 4", "Rs 1,08,000", "Rs 20,000", "84%"],
  ["Grade 5", "Rs 1,24,000", "Rs 22,000", "85%"],
];
const enrollmentByGrade = [
  { grade: "Grade 1", students: 86 },
  { grade: "Grade 2", students: 82 },
  { grade: "Grade 3", students: 88 },
  { grade: "Grade 4", students: 84 },
  { grade: "Grade 5", students: 90 },
];
const enrollmentRows = [
  ["Grade 1", "86", "100", "86%"],
  ["Grade 2", "82", "96", "85%"],
  ["Grade 3", "88", "100", "88%"],
  ["Grade 4", "84", "96", "88%"],
  ["Grade 5", "90", "100", "90%"],
];

function AdminAnalyticsPage() {
  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Attendance, fee, and enrollment data for admin reporting"
        action={
          <div className="flex flex-wrap gap-2">
            <Button className="bg-violet-600 text-white hover:bg-violet-700" onClick={() => toast.success("Report exported")}>
              📥 Export Report
            </Button>
            <Button variant="ghost" onClick={() => toast.success("Summary generated")}>
              📋 Generate Summary
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Avg Attendance This Month" value="89%" />
        <Kpi label="Fee Collection Rate" value="78%" />
        <Kpi label="New Admissions" value="18" />
        <Kpi label="Reports Generated" value="12" />
      </div>

      <Card className="mt-6 overflow-hidden border-gray-100 bg-white shadow-sm">
        <Tabs defaultValue="attendance">
          <div className="border-b border-gray-100 px-5 pt-5">
            <TabsList className="h-auto rounded-none bg-transparent p-0">
              <Tab value="attendance">Attendance Reports</Tab>
              <Tab value="fees">Fee Reports</Tab>
              <Tab value="enrollment">Enrollment Reports</Tab>
            </TabsList>
          </div>
          <TabsContent value="attendance" className="m-0 p-5">
            <TabHeader title="Attendance Reports" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Mini label="School Average" value="89%" />
              <Mini label="Best Class" value="4-A | 96%" />
              <Mini label="Lowest Class" value="3-B | 78%" />
              <Mini label="Below Threshold" value="38" />
            </div>
            <ChartCard>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend}>
                  <defs><linearGradient id="attendanceAdminFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.35} /><stop offset="100%" stopColor="#10b981" stopOpacity={0.04} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis domain={[75, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="attendance" stroke="#10b981" fill="url(#attendanceAdminFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
            <DataTable headers={["Class", "Present", "Absent", "%"]} rows={attendanceRows} />
          </TabsContent>
          <TabsContent value="fees" className="m-0 p-5">
            <TabHeader title="Fee Reports" />
            <div className="grid gap-3 sm:grid-cols-3"><Mini label="Total Collected" value="Rs 4,82,000" /><Mini label="Pending" value="Rs 1,82,000" /><Mini label="Collection Rate" value="78%" /></div>
            <ChartCard><ResponsiveContainer width="100%" height="100%"><BarChart data={feeByGrade}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="grade" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="collected" fill="#7c3aed" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
            <DataTable headers={["Grade", "Collected", "Pending", "Collection Rate"]} rows={feeRows} />
          </TabsContent>
          <TabsContent value="enrollment" className="m-0 p-5">
            <TabHeader title="Enrollment Reports" />
            <div className="grid gap-3 sm:grid-cols-3"><Mini label="Total Students" value="430" /><Mini label="New This Month" value="18" /><Mini label="Transfer Out" value="6" /></div>
            <ChartCard><ResponsiveContainer width="100%" height="100%"><BarChart data={enrollmentByGrade}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="grade" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="students" fill="#0891b2" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
            <DataTable headers={["Grade", "Students", "Capacity", "Capacity %"]} rows={enrollmentRows} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return <Card className="border-gray-100 bg-white p-4 shadow-sm"><p className="text-xs text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></Card>;
}
function Mini({ label, value }: { label: string; value: string }) {
  return <Card className="border-gray-100 bg-gray-50 p-4"><p className="text-xs text-gray-500">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></Card>;
}
function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  return <TabsTrigger value={value} className="rounded-none border-b-2 border-transparent px-4 py-3 shadow-none data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-violet-600 data-[state=active]:shadow-none">{children}</TabsTrigger>;
}
function TabHeader({ title }: { title: string }) {
  return <div className="mb-4 flex justify-end"><Button variant="outline" onClick={() => toast.success(`${title} exported`)}><Download className="mr-2 size-4" />Export</Button></div>;
}
function ChartCard({ children }: { children: React.ReactNode }) {
  return <div className="my-5 h-80 rounded-xl border border-gray-100 bg-white p-3">{children}</div>;
}
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <Table><TableHeader className="bg-gray-50"><TableRow>{headers.map((h) => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.join("-")}>{row.map((cell) => <TableCell key={cell}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table>
    </div>
  );
}
