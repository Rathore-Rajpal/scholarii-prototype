import {
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { PageHeader } from "@/components/scholarii/AppShell";
import { NewAdmissionModal } from "@/components/modals/NewAdmissionModal";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DoorOpen,
  FileText,
  IndianRupee,
  Plus,
  UserCog,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

type Tone = "blue" | "violet" | "green" | "amber" | "orange" | "gray" | "red" | "slate";
type Due = "Today" | "Tomorrow" | "This week";

const toneClasses: Record<Tone, { icon: string; soft: string; dot: string; avatar: string; border: string }> = {
  blue: {
    icon: "text-blue-600",
    soft: "bg-blue-50",
    dot: "bg-blue-500",
    avatar: "bg-blue-100 text-blue-700",
    border: "border-blue-100",
  },
  violet: {
    icon: "text-violet-600",
    soft: "bg-violet-50",
    dot: "bg-violet-500",
    avatar: "bg-violet-100 text-violet-700",
    border: "border-violet-100",
  },
  green: {
    icon: "text-green-600",
    soft: "bg-green-50",
    dot: "bg-green-500",
    avatar: "bg-green-100 text-green-700",
    border: "border-green-100",
  },
  amber: {
    icon: "text-amber-600",
    soft: "bg-amber-50",
    dot: "bg-amber-500",
    avatar: "bg-amber-100 text-amber-700",
    border: "border-amber-100",
  },
  orange: {
    icon: "text-orange-600",
    soft: "bg-orange-50",
    dot: "bg-orange-500",
    avatar: "bg-orange-100 text-orange-700",
    border: "border-orange-100",
  },
  gray: {
    icon: "text-gray-600",
    soft: "bg-gray-50",
    dot: "bg-gray-400",
    avatar: "bg-gray-100 text-gray-700",
    border: "border-gray-100",
  },
  red: {
    icon: "text-red-600",
    soft: "bg-red-50",
    dot: "bg-red-500",
    avatar: "bg-red-100 text-red-700",
    border: "border-red-100",
  },
  slate: {
    icon: "text-slate-600",
    soft: "bg-slate-50",
    dot: "bg-slate-500",
    avatar: "bg-slate-100 text-slate-700",
    border: "border-slate-100",
  },
};

const badgeClasses: Record<Due, string> = {
  Today: "bg-red-100 text-red-700",
  Tomorrow: "bg-amber-100 text-amber-700",
  "This week": "bg-gray-100 text-gray-600",
};

const kpiCards = [
  {
    label: "Total Students",
    value: "430",
    icon: Users,
    tone: "blue" as Tone,
    sub: "Active enrollment",
    dot: "green" as Tone,
    delta: "↑ 2 this month",
    deltaTone: "text-green-600",
    spark: [22, 25, 24, 28, 30, 29, 33],
  },
  {
    label: "Today's Admissions",
    value: "3 New",
    icon: UserPlus,
    tone: "violet" as Tone,
    sub: "Applications processed",
    dot: "blue" as Tone,
    delta: "+1 vs yesterday",
    deltaTone: "text-green-600",
    spark: [1, 2, 1, 3, 2, 2, 3],
  },
  {
    label: "Fee Collected Today",
    value: "₹24,500",
    icon: IndianRupee,
    tone: "green" as Tone,
    sub: "Receipts issued",
    dot: "green" as Tone,
    delta: "↑ 12% vs yesterday",
    deltaTone: "text-green-600",
    spark: [12, 15, 13, 18, 19, 22, 25],
  },
  {
    label: "Pending Fee Amount",
    value: "₹1,82,000",
    icon: AlertCircle,
    tone: "amber" as Tone,
    sub: "Awaiting collection",
    dot: "amber" as Tone,
    delta: "38 students overdue",
    deltaTone: "text-red-600",
    spark: [34, 35, 38, 36, 39, 37, 38],
  },
  {
    label: "Certificates Pending",
    value: "7",
    icon: FileText,
    tone: "orange" as Tone,
    sub: "Requests in queue",
    dot: "amber" as Tone,
    delta: "TC: 3 | Bonafide: 4",
    deltaTone: "text-amber-700",
    spark: [9, 8, 8, 7, 6, 8, 7],
  },
  {
    label: "Visitors Today",
    value: "12",
    icon: Users,
    tone: "gray" as Tone,
    sub: "Front office log",
    dot: "gray" as Tone,
    delta: "3 currently inside",
    deltaTone: "text-gray-600",
    spark: [2, 4, 5, 8, 10, 11, 12],
  },
];

const quickActions = [
  { icon: UserPlus, tone: "violet" as Tone, title: "New Admission", desc: "Register a new student" },
  { icon: IndianRupee, tone: "green" as Tone, title: "Collect Fee", desc: "Record payment and issue receipt" },
  { icon: FileText, tone: "blue" as Tone, title: "Issue Certificate", desc: "TC, Bonafide, or Character cert" },
  { icon: ClipboardList, tone: "orange" as Tone, title: "Mark Attendance", desc: "Update today's records" },
  { icon: UserCog, tone: "slate" as Tone, title: "Add Staff Record", desc: "Update employee information" },
  { icon: DoorOpen, tone: "red" as Tone, title: "Log Visitor", desc: "Record entry for today" },
];

type QuickActionTitle = (typeof quickActions)[number]["title"];

type AttendanceStatus = "Present" | "Absent" | "Late";

const gradeOptions = Array.from({ length: 10 }, (_, index) => `Grade ${index + 1}`);
const classSectionOptions = gradeOptions.flatMap((grade) => ["A", "B"].map((section) => `${grade}-${section}`));
const feeMonths = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];
const mockAttendanceStudents = [
  { name: "Aarav Sharma", admissionNo: "1A01" },
  { name: "Arjun Patel", admissionNo: "1A02" },
  { name: "Ishaan Singh", admissionNo: "1A03" },
  { name: "Aadhya Mehta", admissionNo: "1A04" },
  { name: "Anaya Iyer", admissionNo: "1A05" },
  { name: "Kabir Joshi", admissionNo: "1A06" },
  { name: "Aryan Khan", admissionNo: "1A07" },
  { name: "Tara Kapoor", admissionNo: "1A08" },
  { name: "Aditya Verma", admissionNo: "1A09" },
  { name: "Diya Nair", admissionNo: "1A10" },
];

const activities = [
  { initials: "PA", tone: "violet" as Tone, title: "Issued Bonafide Certificate", desc: "Rohan Verma — Grade 4B", time: "10 mins ago" },
  { initials: "PA", tone: "green" as Tone, title: "Fee Collected", desc: "₹4,500 from Aarav Sharma (Grade 1A)", time: "25 mins ago" },
  { initials: "PA", tone: "blue" as Tone, title: "New Admission Registered", desc: "Ananya Kapoor — Grade 3", time: "1 hr ago" },
  { initials: "PA", tone: "amber" as Tone, title: "Address Updated", desc: "Ishaan Singh — Grade 2A", time: "2 hrs ago" },
  { initials: "PA", tone: "orange" as Tone, title: "TC Issued", desc: "Meera Pillai — Grade 5C", time: "3 hrs ago" },
  { initials: "PA", tone: "red" as Tone, title: "Visitor Logged", desc: "Mr. Suresh Nair — Parent inquiry", time: "3.5 hrs ago" },
  { initials: "PA", tone: "slate" as Tone, title: "Bulk Attendance Marked", desc: "430 students — today", time: "4 hrs ago" },
  { initials: "PA", tone: "green" as Tone, title: "Fee Report Generated", desc: "May 2026 collection summary", time: "Yesterday" },
  { initials: "PA", tone: "gray" as Tone, title: "Staff Record Added", desc: "Mrs. Kavita Soni — Peon", time: "Yesterday" },
  { initials: "PA", tone: "blue" as Tone, title: "Circular Sent", desc: "Summer Holiday Notice — All parents", time: "2 days ago" },
];

const tasks = [
  { priority: "red" as Tone, title: "Process 3 pending TC requests", due: "Today" as Due },
  { priority: "red" as Tone, title: "Follow up on ₹82,000 overdue fees (12 students)", due: "Today" as Due },
  { priority: "amber" as Tone, title: "Complete Ananya Kapoor admission paperwork", due: "Today" as Due },
  { priority: "amber" as Tone, title: "Print report cards for Grade 5", due: "Tomorrow" as Due },
  { priority: "gray" as Tone, title: "Update government compliance attendance report", due: "This week" as Due },
  { priority: "gray" as Tone, title: "Inventory check: stationery and lab supplies", due: "This week" as Due },
];

const gradeCollection = [
  { grade: "Grade 1", collected: 42000, target: 48000 },
  { grade: "Grade 2", collected: 38500, target: 46000 },
  { grade: "Grade 3", collected: 29000, target: 42000 },
  { grade: "Grade 4", collected: 21000, target: 38000 },
  { grade: "Grade 5", collected: 18000, target: 36000 },
].map((item) => ({ ...item, percent: Math.round((item.collected / item.target) * 100) }));

const overdueStudents = [
  { initials: "AS", name: "Aarav Sharma", klass: "1A", amount: "₹12,000", days: "45 days" },
  { initials: "RP", name: "Rohan Patel", klass: "3B", amount: "₹8,500", days: "32 days" },
  { initials: "KJ", name: "Kavya Joshi", klass: "4C", amount: "₹14,000", days: "28 days" },
  { initials: "MP", name: "Meera Pillai", klass: "2A", amount: "₹6,000", days: "15 days" },
  { initials: "SK", name: "Sanvi Kapoor", klass: "5B", amount: "₹9,500", days: "12 days" },
];

const admissions = [
  { student: "Ananya Kapoor", grade: "Grade 3", parent: "Sunita Kapoor", status: "In Progress", badge: "bg-blue-100 text-blue-700" },
  { student: "Dev Sharma", grade: "Grade 1", parent: "Ramesh Sharma", status: "Approved", badge: "bg-green-100 text-green-700" },
  { student: "Tina Mehta", grade: "Grade 5", parent: "Priya Mehta", status: "Pending Docs", badge: "bg-amber-100 text-amber-700" },
];

const visitors = [
  { name: "Suresh Nair", purpose: "Parent Inquiry", time: "9:15 AM", status: "Checked Out", badge: "bg-green-100 text-green-700" },
  { name: "Meena Gupta", purpose: "Fee Payment", time: "10:00 AM", status: "Checked Out", badge: "bg-green-100 text-green-700" },
  { name: "Amit Verma", purpose: "TC Collection", time: "11:30 AM", status: "Checked Out", badge: "bg-green-100 text-green-700" },
  { name: "Priya Soni", purpose: "Meeting — Principal", time: "1:00 PM", status: "Inside", badge: "bg-amber-100 text-amber-700" },
  { name: "Unknown Vendor", purpose: "Stationery Delivery", time: "2:30 PM", status: "Inside", badge: "bg-amber-100 text-amber-700" },
];

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function StatusBadge({ children, className }: { children: string; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function IconBubble({ icon: Icon, tone }: { icon: LucideIcon; tone: Tone }) {
  return (
    <div className={`grid size-10 place-items-center rounded-xl ${toneClasses[tone].soft}`}>
      <Icon className={`size-5 ${toneClasses[tone].icon}`} />
    </div>
  );
}

type ModalChart =
  | { type: "bar"; title: string; data: { label: string; value: number }[]; color: string }
  | { type: "line"; title: string; data: { label: string; value: number }[]; color: string };

type KpiModal = {
  title: string;
  stats: { label: string; value: string }[];
  chart?: ModalChart;
  tableTitle: string;
  columns: string[];
  rows: string[][];
  insights: string[];
};

const kpiModals: Record<string, KpiModal> = {
  "Total Students": {
    title: "Student Enrollment Overview",
    stats: [
      { label: "Total Enrolled", value: "430" },
      { label: "Boys", value: "218" },
      { label: "Girls", value: "212" },
    ],
    chart: {
      type: "bar",
      title: "Enrollment by Grade",
      color: "#7C3AED",
      data: [42, 45, 44, 43, 41, 40, 38, 39, 37, 41].map((value, index) => ({
        label: `Grade ${index + 1}`,
        value,
      })),
    },
    tableTitle: "Section-wise Strength",
    columns: ["Grade", "Section", "Total Students", "Boys", "Girls"],
    rows: [
      ["Grade 1", "A", "24", "12", "12"],
      ["Grade 1", "B", "24", "13", "11"],
      ["Grade 2", "A", "24", "11", "13"],
      ["Grade 2", "B", "21", "10", "11"],
      ["Grade 3", "A", "24", "12", "12"],
      ["Grade 3", "B", "22", "11", "11"],
      ["Grade 4", "A", "23", "12", "11"],
      ["Grade 4", "B", "22", "10", "12"],
    ],
    insights: ["Highest enrollment: Grade 2 (45 students)", "Largest section: Grade 1-A (24 students)", "2 new admissions this month"],
  },
  "Today's Admissions": {
    title: "Today's Admission Activity",
    stats: [
      { label: "Applications Today", value: "3" },
      { label: "Approved", value: "1" },
      { label: "Pending Docs", value: "2" },
    ],
    chart: {
      type: "line",
      title: "Admissions This Month (June 2026)",
      color: "#2563eb",
      data: [1, 0, 2, 1, 3, 0, 1, 2, 1, 3].map((value, index) => ({
        label: `${index + 1} Jun`,
        value,
      })),
    },
    tableTitle: "Today's Applications",
    columns: ["Student Name", "Grade", "Parent Name", "Time", "Status", "Documents"],
    rows: [
      ["Ananya Kapoor", "Grade 3", "Sunita Kapoor", "9:15 AM", "In Progress", "2/4"],
      ["Dev Sharma", "Grade 1", "Ramesh Sharma", "10:30 AM", "Approved", "4/4"],
      ["Tina Mehta", "Grade 5", "Priya Mehta", "11:45 AM", "Pending Docs", "1/4"],
    ],
    insights: ["Conversion rate today: 33% (1 of 3 fully approved)", "Average document completion: 58%", "Pending follow-up: Ananya Kapoor, Tina Mehta"],
  },
  "Fee Collected Today": {
    title: "Today's Fee Collection",
    stats: [
      { label: "Collected Today", value: "₹24,500" },
      { label: "Receipts Issued", value: "8" },
      { label: "Average per Receipt", value: "₹3,062" },
    ],
    chart: {
      type: "bar",
      title: "Collection by Grade (Today)",
      color: "#16a34a",
      data: [6500, 5200, 4800, 4500, 3500].map((value, index) => ({
        label: `Grade ${index + 1}`,
        value,
      })),
    },
    tableTitle: "Today's Fee Transactions",
    columns: ["Student Name", "Class", "Amount", "Payment Mode", "Time", "Receipt No"],
    rows: [
      ["Aarav Sharma", "1-A", "₹4,500", "Cash", "9:10 AM", "R-2026-001"],
      ["Priya Mehta", "2-B", "₹3,200", "UPI", "9:45 AM", "R-2026-002"],
      ["Kabir Joshi", "3-A", "₹4,800", "Cash", "10:15 AM", "R-2026-003"],
      ["Sneha Rao", "1-B", "₹3,500", "Cheque", "11:00 AM", "R-2026-004"],
      ["Aryan Khan", "4-A", "₹4,000", "UPI", "11:30 AM", "R-2026-005"],
      ["Meera Nair", "5-B", "₹4,500", "Cash", "12:00 PM", "R-2026-006"],
    ],
    insights: ["UPI is most used payment mode today", "Grade 1 contributed highest collection: ₹6,500", "All receipts successfully generated"],
  },
  "Pending Fee Amount": {
    title: "Overdue Fee Analysis",
    stats: [
      { label: "Total Pending", value: "₹1,82,000" },
      { label: "Students Overdue", value: "38" },
      { label: "Average Overdue", value: "₹4,789" },
    ],
    chart: {
      type: "bar",
      title: "Pending Fees by Grade",
      color: "#d97706",
      data: [42000, 38000, 35000, 32000, 35000].map((value, index) => ({
        label: `Grade ${index + 1}`,
        value,
      })),
    },
    tableTitle: "Top Overdue Students",
    columns: ["Student", "Class", "Amount Overdue", "Days Overdue", "Last Reminder", "Action"],
    rows: [
      ["Aarav Sharma", "1-A", "₹12,000", "45 days", "3 days ago", "Remind"],
      ["Rohan Patel", "3-B", "₹8,500", "32 days", "1 week ago", "Remind"],
      ["Kavya Joshi", "4-C", "₹14,000", "28 days", "5 days ago", "Remind"],
      ["Meera Pillai", "2-A", "₹6,000", "15 days", "2 days ago", "Remind"],
      ["Sanvi Kapoor", "5-B", "₹9,500", "12 days", "Today", "Remind"],
      ["Ishaan Singh", "2-B", "₹7,200", "10 days", "Never", "Remind"],
      ["Diya Sharma", "1-B", "₹5,500", "8 days", "Never", "Remind"],
      ["Arjun Verma", "3-A", "₹11,000", "42 days", "1 week ago", "Remind"],
    ],
    insights: ["Highest overdue: Kavya Joshi, 4-C (₹14,000 - 28 days)", "2 students never received a reminder - action needed", "12 students overdue for more than 30 days"],
  },
  "Certificates Pending": {
    title: "Certificate Requests Queue",
    stats: [
      { label: "Total Pending", value: "7" },
      { label: "TC Requests", value: "3" },
      { label: "Bonafide Requests", value: "4" },
    ],
    tableTitle: "Pending Certificate Requests",
    columns: ["Student Name", "Class", "Certificate Type", "Requested On", "Requested By", "Priority", "Action"],
    rows: [
      ["Meera Pillai", "5-C", "Transfer Certificate", "2026-06-05", "Parent", "High", "Generate"],
      ["Rohan Verma", "4-B", "Bonafide", "2026-06-06", "Student", "Normal", "Generate"],
      ["Ananya Iyer", "3-A", "Transfer Certificate", "2026-06-04", "Parent", "High", "Generate"],
      ["Kabir Joshi", "2-B", "Bonafide", "2026-06-07", "Parent", "Normal", "Generate"],
      ["Priya Nair", "1-A", "Bonafide", "2026-06-08", "Parent", "Normal", "Generate"],
      ["Ishaan Singh", "6-A", "Transfer Certificate", "2026-06-03", "Parent", "Urgent", "Generate"],
      ["Diya Sharma", "7-B", "Bonafide", "2026-06-08", "Student", "Normal", "Generate"],
    ],
    insights: ["Oldest request: Ishaan Singh TC - 7 days pending (Urgent)", "3 TC requests require principal approval before generation", "2 requests from today - can be processed immediately"],
  },
  "Visitors Today": {
    title: "Today's Visitor Log",
    stats: [
      { label: "Total Visitors", value: "12" },
      { label: "Currently Inside", value: "3" },
      { label: "Checked Out", value: "9" },
    ],
    tableTitle: "Visitor Log - Today",
    columns: ["Visitor Name", "Purpose", "Host", "Time In", "Time Out", "Status", "Pass No"],
    rows: [
      ["Suresh Nair", "Parent Inquiry", "Office", "9:15 AM", "9:45 AM", "Checked Out", "V-001"],
      ["Meena Gupta", "Fee Payment", "Office", "10:00 AM", "10:20 AM", "Checked Out", "V-002"],
      ["Amit Verma", "TC Collection", "Office", "11:30 AM", "11:55 AM", "Checked Out", "V-003"],
      ["Priya Soni", "Principal Meeting", "Dr. Asha", "1:00 PM", "-", "Inside", "V-004"],
      ["Ravi Kumar", "Parent Inquiry", "Class 3 Teacher", "1:30 PM", "-", "Inside", "V-005"],
      ["Anand Joshi", "Stationery Delivery", "Office", "2:30 PM", "-", "Inside", "V-006"],
      ["Deepa Menon", "Admission Inquiry", "Office", "9:00 AM", "9:30 AM", "Checked Out", "V-007"],
      ["Kiran Shah", "Fee Payment", "Office", "10:45 AM", "11:00 AM", "Checked Out", "V-008"],
    ],
    insights: ["Peak hour: 9-11 AM (5 visitors)", "3 visitors currently on campus - passes V-004, V-005, V-006", "Most common purpose today: Fee Payment"],
  },
};

function ModalChartView({ chart }: { chart: ModalChart }) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{chart.title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === "bar" ? (
            <BarChart data={chart.data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip cursor={{ fill: "#F9FAFB" }} />
              <Bar dataKey="value" fill={chart.color} radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chart.data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip cursor={{ stroke: "#E5E7EB" }} />
              <Line type="monotone" dataKey="value" stroke={chart.color} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ModalCell({ value }: { value: string }) {
  if (value === "Remind") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
        onClick={() => toast.success("Reminder sent to parent")}
      >
        Remind
      </Button>
    );
  }

  if (value === "Generate") {
    return (
      <Button size="sm" className="h-8 rounded-lg bg-violet-600 text-white hover:bg-violet-700">
        Generate
      </Button>
    );
  }

  const badgeClass =
    value === "Approved" || value === "Checked Out"
      ? "bg-green-100 text-green-700"
      : value === "In Progress"
        ? "bg-blue-100 text-blue-700"
        : value === "Pending Docs" || value === "High" || value === "Inside"
          ? "bg-amber-100 text-amber-700"
          : value === "Urgent"
            ? "bg-red-100 text-red-700"
            : value === "Normal"
              ? "bg-gray-100 text-gray-600"
              : value === "Transfer Certificate"
                ? "bg-red-50 text-red-600"
                : value === "Bonafide"
                  ? "bg-blue-50 text-blue-600"
                  : "";

  if (badgeClass) {
    return <StatusBadge className={badgeClass}>{value}</StatusBadge>;
  }

  return <span>{value}</span>;
}

function KpiModalDialog({ modal, onClose }: { modal: KpiModal; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[650px] max-h-[85vh] overflow-y-auto relative my-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button aria-label="Close modal" className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="p-6">
          <h2 className="mb-1 pr-10 text-xl font-semibold text-gray-900">{modal.title}</h2>

          <div className="mb-6 grid grid-cols-3 gap-3">
            {modal.stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-gray-50 p-4">
                <div className="text-xs text-gray-500">{stat.label}</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {modal.chart && <ModalChartView chart={modal.chart} />}

          <h3 className="mb-3 text-sm font-semibold text-gray-700">{modal.tableTitle}</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  {modal.columns.map((column) => (
                    <th key={column} className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {modal.rows.map((row, rowIndex) => (
                  <tr key={`${modal.tableTitle}-${rowIndex}`} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`} className="px-3 py-3 text-gray-700">
                        <ModalCell value={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {modal.title === "Today's Visitor Log" && (
            <Button className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">
              <Plus className="mr-2 size-4" />
              Log New Visitor
            </Button>
          )}

          <div className="mt-4 rounded-xl bg-gray-50 p-4">
            <div className="mb-2 text-sm font-semibold text-gray-700">Insights</div>
            <ul className="space-y-1 text-sm text-gray-600">
              {modal.insights.map((insight) => (
                <li key={insight}>• {insight}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function QuickActionDivider({ children }: { children: string }) {
  return <div className="mt-5 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{children}</div>;
}

function QuickActionField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

function QuickActionInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 ${props.className ?? ""}`}
    />
  );
}

function QuickActionSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 ${props.className ?? ""}`}
    />
  );
}

function QuickActionTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 ${props.className ?? ""}`}
    />
  );
}

function QuickActionButtons({ submitLabel, onClose, onSubmit }: { submitLabel: string; onClose: () => void; onSubmit: () => void }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button
        type="button"
        className="rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        type="button"
        className="w-full rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-700"
        onClick={onSubmit}
      >
        {submitLabel}
      </button>
    </div>
  );
}

function QuickActionModal({ action, onClose }: { action: QuickActionTitle; onClose: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const currentTime = new Date().toTimeString().slice(0, 5);
  const [fields, setFields] = useState<Record<string, string>>({
    paymentMode: "Cash",
    paymentDate: today,
    certificateType: "Transfer Certificate (TC)",
    attendanceClass: "",
    attendanceDate: today,
    visitorTimeIn: currentTime,
    visitorPassNo: "V-009",
  });
  const [attendance, setAttendance] = useState<AttendanceStatus[]>(mockAttendanceStudents.map(() => "Present"));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const setField = (key: string) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
  };

  const closeWithToast = (message: string) => {
    onClose();
    toast.success(message);
  };

  const inputValue = (key: string) => fields[key] ?? "";
  const attendanceCounts = attendance.reduce(
    (counts, status) => ({ ...counts, [status]: counts[status] + 1 }),
    { Present: 0, Absent: 0, Late: 0 } as Record<AttendanceStatus, number>,
  );

  const renderClassOptions = () => classSectionOptions.map((klass) => <option key={klass}>{klass}</option>);

  let title = "";
  let subtitle = "";
  let content: ReactNode = null;

  if (action === "Collect Fee") {
    title = "Collect Fee Payment";
    subtitle = "Record a fee payment and generate receipt";
    content = (
      <>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickActionField label="Student Name" required>
            <QuickActionInput value={inputValue("feeStudent")} onChange={setField("feeStudent")} placeholder="Search by name or admission no." />
          </QuickActionField>
          <QuickActionField label="Admission Number">
            <QuickActionInput placeholder="e.g. 1A01" />
          </QuickActionField>
          <QuickActionField label="Class & Section" required>
            <QuickActionSelect value={inputValue("feeClass")} onChange={setField("feeClass")}>
              <option value="">Select class</option>
              {renderClassOptions()}
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Fee Type" required>
            <QuickActionSelect value={inputValue("feeType")} onChange={setField("feeType")}>
              <option value="">Select fee type</option>
              {["Tuition Fee", "Exam Fee", "Transport Fee", "Library Fee", "Sports Fee", "Miscellaneous"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Fee Month" required>
            <QuickActionSelect defaultValue="">
              <option value="" disabled>Select month</option>
              {feeMonths.map((month) => <option key={month}>{month}</option>)}
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Amount (₹)" required>
            <QuickActionInput type="number" value={inputValue("feeAmount")} onChange={setField("feeAmount")} placeholder="Enter amount" />
          </QuickActionField>
          <QuickActionField label="Payment Mode" required>
            <QuickActionSelect value={inputValue("paymentMode")} onChange={setField("paymentMode")}>
              {["Cash", "UPI", "Cheque", "NEFT", "DD"].map((mode) => <option key={mode}>{mode}</option>)}
            </QuickActionSelect>
          </QuickActionField>
          {inputValue("paymentMode") !== "Cash" && (
            <QuickActionField label="Transaction / Cheque Reference No.">
              <QuickActionInput placeholder="UPI ID, cheque no., or transaction ID" />
            </QuickActionField>
          )}
          <QuickActionField label="Payment Date" required>
            <QuickActionInput type="date" value={inputValue("paymentDate")} onChange={setField("paymentDate")} />
          </QuickActionField>
          <QuickActionField label="Remarks">
            <QuickActionTextarea rows={2} />
          </QuickActionField>
        </div>
        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          <div className="mb-2 font-semibold text-gray-800">Receipt Preview</div>
          <div>Student: {inputValue("feeStudent") || "-"}</div>
          <div>Class: {inputValue("feeClass") || "-"}</div>
          <div>Fee Type: {inputValue("feeType") || "-"}</div>
          <div>Amount: ₹{inputValue("feeAmount") || "0"}</div>
          <div>Mode: {inputValue("paymentMode")}</div>
          <div>Date: {inputValue("paymentDate")}</div>
          <div>Receipt No: Auto-generated (R-2026-XXX)</div>
        </div>
        <QuickActionButtons submitLabel="Generate Receipt" onClose={onClose} onSubmit={() => closeWithToast("✓ Receipt generated successfully")} />
      </>
    );
  }

  if (action === "Issue Certificate") {
    title = "Issue Certificate";
    subtitle = "Generate TC, Bonafide, or Character certificate";
    content = (
      <>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickActionField label="Certificate Type" required>
            <QuickActionSelect value={inputValue("certificateType")} onChange={setField("certificateType")}>
              <option>Transfer Certificate (TC)</option>
              <option>Bonafide Certificate</option>
              <option>Character Certificate</option>
              <option>Date of Birth Certificate</option>
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Student Name" required>
            <QuickActionInput placeholder="Search by name or admission no." />
          </QuickActionField>
          <QuickActionField label="Admission Number">
            <QuickActionInput />
          </QuickActionField>
          <QuickActionField label="Class & Section" required>
            <QuickActionSelect defaultValue="">
              <option value="" disabled>Select class</option>
              {renderClassOptions()}
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Purpose" required>
            <QuickActionInput placeholder="e.g. School admission, Passport application, Bank account" />
          </QuickActionField>
          <QuickActionField label="Requested By" required>
            <QuickActionSelect defaultValue="">
              <option value="" disabled>Select requester</option>
              <option>Student</option>
              <option>Parent</option>
              <option>Guardian</option>
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Requester Name" required>
            <QuickActionInput placeholder="Full name of requester" />
          </QuickActionField>
          <QuickActionField label="Contact Number" required>
            <QuickActionInput type="tel" />
          </QuickActionField>
          <QuickActionField label="Date Required" required>
            <QuickActionInput type="date" />
          </QuickActionField>
          <QuickActionField label="Remarks">
            <QuickActionTextarea rows={2} />
          </QuickActionField>
        </div>
        {inputValue("certificateType") === "Transfer Certificate (TC)" && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            ⚠ Transfer Certificate requires principal approval before issuance. The request will be sent to the principal for review.
          </div>
        )}
        <QuickActionButtons
          submitLabel="Submit Request"
          onClose={onClose}
          onSubmit={() =>
            closeWithToast(
              inputValue("certificateType") === "Transfer Certificate (TC)"
                ? "✓ TC request submitted for principal approval"
                : "✓ Certificate issued successfully",
            )
          }
        />
      </>
    );
  }

  if (action === "Mark Attendance") {
    title = "Mark Student Attendance";
    subtitle = "Update today's attendance records";
    content = (
      <>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickActionField label="Class" required>
            <QuickActionSelect value={inputValue("attendanceClass")} onChange={setField("attendanceClass")}>
              <option value="">Select class</option>
              {renderClassOptions()}
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Date" required>
            <QuickActionInput type="date" value={inputValue("attendanceDate")} readOnly />
          </QuickActionField>
        </div>
        {inputValue("attendanceClass") && (
          <div className="mt-5">
            <div className="mb-2 text-sm font-semibold text-gray-900">Students — {inputValue("attendanceClass")}</div>
            <div className="mb-3 text-sm font-semibold text-gray-700">
              Present: {attendanceCounts.Present} | Absent: {attendanceCounts.Absent} | Late: {attendanceCounts.Late}
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">#</th>
                    <th className="px-3 py-2 text-left font-semibold">Student Name</th>
                    <th className="px-3 py-2 text-left font-semibold">Admission No</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockAttendanceStudents.map((student, index) => (
                    <tr key={student.admissionNo}>
                      <td className="px-3 py-3 text-gray-600">{index + 1}</td>
                      <td className="px-3 py-3 font-medium text-gray-900">{student.name}</td>
                      <td className="px-3 py-3 text-gray-600">{student.admissionNo}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {(["Present", "Absent", "Late"] as AttendanceStatus[]).map((status) => {
                            const selected = attendance[index] === status;
                            const statusClass =
                              status === "Present"
                                ? "bg-green-100 text-green-700"
                                : status === "Absent"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700";
                            return (
                              <button
                                key={status}
                                type="button"
                                className={`rounded-full px-3 py-1 text-xs font-medium transition ${selected ? statusClass : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                                onClick={() =>
                                  setAttendance((current) => current.map((item, itemIndex) => (itemIndex === index ? status : item)))
                                }
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <QuickActionButtons
          submitLabel="Save Attendance"
          onClose={onClose}
          onSubmit={() => closeWithToast(`✓ Attendance saved for ${inputValue("attendanceClass") || "selected class"}`)}
        />
      </>
    );
  }

  if (action === "Add Staff Record") {
    title = "Add Staff Record";
    subtitle = "Add or update employee information";
    content = (
      <>
        <QuickActionDivider>Personal Details</QuickActionDivider>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickActionField label="Full Name" required><QuickActionInput /></QuickActionField>
          <QuickActionField label="Date of Birth" required><QuickActionInput type="date" /></QuickActionField>
          <QuickActionField label="Gender" required>
            <QuickActionSelect defaultValue="">
              <option value="" disabled>Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Aadhar Number"><QuickActionInput /></QuickActionField>
          <QuickActionField label="Contact Number" required><QuickActionInput type="tel" /></QuickActionField>
          <QuickActionField label="Email Address" required><QuickActionInput type="email" /></QuickActionField>
          <QuickActionField label="Home Address"><QuickActionTextarea rows={2} /></QuickActionField>
        </div>
        <QuickActionDivider>Employment Details</QuickActionDivider>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickActionField label="Employee ID"><QuickActionInput placeholder="e.g. EMP-2026-001" /></QuickActionField>
          <QuickActionField label="Role / Designation" required>
            <QuickActionSelect defaultValue="">
              <option value="" disabled>Select role</option>
              {["Teacher", "Office Clerk", "Lab Assistant", "Librarian", "Peon", "Guard", "Driver", "Cook", "Other"].map((role) => <option key={role}>{role}</option>)}
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Department">
            <QuickActionSelect defaultValue="">
              <option value="" disabled>Select department</option>
              {["Primary", "Secondary", "Administration", "Support Staff", "Management"].map((department) => <option key={department}>{department}</option>)}
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Date of Joining" required><QuickActionInput type="date" /></QuickActionField>
          <QuickActionField label="Employment Type" required>
            <QuickActionSelect defaultValue="">
              <option value="" disabled>Select type</option>
              <option>Permanent</option>
              <option>Contractual</option>
              <option>Part-time</option>
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Salary (₹)"><QuickActionInput type="number" placeholder="Monthly gross salary" /></QuickActionField>
          <QuickActionField label="Assigned Class"><QuickActionInput placeholder="e.g. Grade 5-A (for teachers)" /></QuickActionField>
        </div>
        <QuickActionDivider>Documents</QuickActionDivider>
        <div className="space-y-2 text-sm text-gray-700">
          {["Aadhar Copy Uploaded", "PAN Card Uploaded", "Qualification Certificates Uploaded", "Experience Letters Uploaded", "Police Verification Uploaded"].map((item) => (
            <label key={item} className="flex items-center gap-2">
              <input type="checkbox" className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
              {item}
            </label>
          ))}
        </div>
        <QuickActionButtons submitLabel="Save Staff Record" onClose={onClose} onSubmit={() => closeWithToast("✓ Staff record added successfully")} />
      </>
    );
  }

  if (action === "Log Visitor") {
    title = "Log Visitor Entry";
    subtitle = "Record visitor entry for today";
    content = (
      <>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <QuickActionField label="Visitor Name" required>
            <QuickActionInput value={inputValue("visitorName")} onChange={setField("visitorName")} placeholder="Full name" />
          </QuickActionField>
          <QuickActionField label="Contact Number" required><QuickActionInput type="tel" /></QuickActionField>
          <QuickActionField label="Purpose of Visit" required>
            <QuickActionSelect value={inputValue("visitorPurpose")} onChange={setField("visitorPurpose")}>
              <option value="">Select purpose</option>
              {["Parent Inquiry", "Fee Payment", "TC or Certificate Collection", "Principal Meeting", "Teacher Meeting", "Delivery", "Government Official", "Other"].map((purpose) => <option key={purpose}>{purpose}</option>)}
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="Whom to Meet" required>
            <QuickActionInput value={inputValue("visitorMeeting")} onChange={setField("visitorMeeting")} placeholder="e.g. Principal, Class Teacher, Office" />
          </QuickActionField>
          <QuickActionField label="Student Name">
            <QuickActionInput placeholder="If visiting for a student (optional)" />
          </QuickActionField>
          <QuickActionField label="ID Proof Type">
            <QuickActionSelect defaultValue="">
              <option value="" disabled>Select ID proof</option>
              <option>Aadhar</option>
              <option>PAN</option>
              <option>Driving Licence</option>
              <option>Voter ID</option>
              <option>Other</option>
            </QuickActionSelect>
          </QuickActionField>
          <QuickActionField label="ID Proof Number"><QuickActionInput /></QuickActionField>
          <QuickActionField label="Time In" required>
            <QuickActionInput type="time" value={inputValue("visitorTimeIn")} onChange={setField("visitorTimeIn")} />
          </QuickActionField>
          <QuickActionField label="Remarks"><QuickActionTextarea rows={2} /></QuickActionField>
        </div>
        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          <div className="mb-2 font-semibold text-gray-800">Visitor Pass Preview</div>
          <div>Pass No: {inputValue("visitorPassNo")}</div>
          <div>Name: {inputValue("visitorName") || "-"}</div>
          <div>Purpose: {inputValue("visitorPurpose") || "-"}</div>
          <div>Meeting: {inputValue("visitorMeeting") || "-"}</div>
          <div>Time In: {inputValue("visitorTimeIn")}</div>
          <div>Date: {today}</div>
          <div>Status: 🟡 Inside</div>
        </div>
        <QuickActionButtons submitLabel="Issue Visitor Pass" onClose={onClose} onSubmit={() => closeWithToast(`✓ Visitor pass issued — ${inputValue("visitorPassNo")}`)} />
      </>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[650px] max-h-[85vh] overflow-y-auto relative my-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button aria-label="Close modal" className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="p-6">
          <h2 className="mb-1 pr-10 text-xl font-semibold text-gray-900">{title}</h2>
          <p className="mb-6 text-sm text-gray-500">{subtitle}</p>
          {content}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function AdminDashboard() {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [activeFeeTab, setActiveFeeTab] = useState("This month");
  const [kpiStartIndex, setKpiStartIndex] = useState(0);
  const [kpiVisibleCount, setKpiVisibleCount] = useState(4);
  const [selectedKpiLabel, setSelectedKpiLabel] = useState<string | null>(null);
  const [selectedQuickAction, setSelectedQuickAction] = useState<QuickActionTitle | null>(null);
  const kpiTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      setKpiVisibleCount(window.innerWidth >= 1536 ? 5 : 4);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxKpiStartIndex = Math.max(0, kpiCards.length - kpiVisibleCount);
  const selectedKpiModal = selectedKpiLabel ? kpiModals[selectedKpiLabel] : null;

  useEffect(() => {
    setKpiStartIndex((current) => Math.min(current, maxKpiStartIndex));
  }, [maxKpiStartIndex]);

  useEffect(() => {
    const track = kpiTrackRef.current;
    const card = track?.children[kpiStartIndex] as HTMLElement | undefined;

    if (track && card) {
      track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
  }, [kpiStartIndex, kpiVisibleCount]);

  const toggleTask = (index: number) => {
    setCompletedTasks((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Today's Office Overview"
        subtitle="All administrative tasks and records at a glance"
        action={
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700">
              <Plus className="mr-2 size-4" />
              Quick Action
            </Button>
            <Button variant="outline" className="rounded-full border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Generate Report
            </Button>
          </div>
        }
      />

      <div className="relative pb-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous KPI card"
          disabled={kpiStartIndex === 0}
          onClick={() => setKpiStartIndex((current) => Math.max(0, current - 1))}
          className="absolute left-0 top-1/2 z-10 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </Button>

        <div ref={kpiTrackRef} className="flex gap-4 overflow-hidden px-5">
          {kpiCards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => setSelectedKpiLabel(card.label)}
              className="min-w-0 flex-[0_0_100%] cursor-pointer text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:flex-[0_0_calc((100%-16px)/2)] lg:flex-[0_0_calc((100%-48px)/4)] 2xl:flex-[0_0_calc((100%-64px)/5)]"
            >
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm font-medium text-gray-500">{card.label}</div>
                  <div className="flex items-start gap-3">
                    <IconBubble icon={card.icon} tone={card.tone} />
                    <span className={`mt-1 size-2 rounded-full ${toneClasses[card.dot].dot}`} />
                  </div>
                </div>
                <div className="mt-4 text-3xl font-bold tracking-tight text-gray-950">{card.value}</div>
                <div className="mt-1 text-sm text-gray-500">{card.sub}</div>
                <div className="mt-4 text-xs font-medium">
                  <span className={card.deltaTone}>{card.delta}</span>
                </div>
                <div className="mt-4 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={card.spark.map((value, index) => ({ index, value }))}>
                      <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Next KPI card"
          disabled={kpiStartIndex >= maxKpiStartIndex}
          onClick={() => setKpiStartIndex((current) => Math.min(maxKpiStartIndex, current + 1))}
          className="absolute right-0 top-1/2 z-10 size-9 translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {selectedKpiModal && <KpiModalDialog modal={selectedKpiModal} onClose={() => setSelectedKpiLabel(null)} />}
      {selectedQuickAction === "New Admission" && (
        <NewAdmissionModal onClose={() => setSelectedQuickAction(null)} />
      )}
      {selectedQuickAction && selectedQuickAction !== "New Admission" && (
        <QuickActionModal action={selectedQuickAction} onClose={() => setSelectedQuickAction(null)} />
      )}

      <section className="mt-5">
        <SectionHeading title="Quick Actions" subtitle="Frequently used tasks" />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              onClick={() => setSelectedQuickAction(action.title)}
              className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:border-violet-400 hover:shadow-md ${toneClasses[action.tone].border}`}
            >
              <IconBubble icon={action.icon} tone={action.tone} />
              <div className="mt-4 font-semibold text-gray-950">{action.title}</div>
              <div className="mt-1 text-sm text-gray-500">{action.desc}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(340px,2fr)]">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <SectionHeading title="Recent Activities" subtitle="Last actions performed" />
          <div className="mt-4 divide-y divide-gray-100">
            {activities.map((activity, index) => (
              <div key={`${activity.title}-${index}`} className="flex items-start gap-3 py-3">
                <div className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${toneClasses[activity.tone].avatar}`}>
                  {activity.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-950">{activity.title}</div>
                  <div className="truncate text-sm text-gray-500">{activity.desc}</div>
                </div>
                <div className="whitespace-nowrap text-right text-xs text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-right">
            <button className="text-sm font-semibold text-violet-600 hover:text-violet-700">View all activity →</button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <SectionHeading title="Upcoming Tasks" subtitle="Pending for today and this week" />
          <div className="mt-4 space-y-3">
            {tasks.map((task, index) => {
              const done = completedTasks.includes(index);
              return (
                <label
                  key={task.title}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 transition hover:border-violet-200"
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleTask(index)}
                    className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className={`size-2.5 shrink-0 rounded-full ${toneClasses[task.priority].dot}`} />
                  <span className={`min-w-0 flex-1 text-sm font-semibold text-gray-900 ${done ? "text-gray-400 line-through" : ""}`}>
                    {task.title}
                  </span>
                  <StatusBadge className={badgeClasses[task.due]}>{task.due}</StatusBadge>
                </label>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading title="Fee Collection Summary" subtitle="June 2026" />
          <div className="flex gap-4 text-sm font-medium text-gray-500">
            {["Today", "This week", "This month"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFeeTab(tab)}
                className={`border-b-2 pb-1 transition ${
                  activeFeeTab === tab ? "border-violet-600 text-violet-600" : "border-transparent hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="font-semibold text-gray-950">Collection by Grade</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeCollection} layout="vertical" margin={{ top: 8, right: 48, left: 8, bottom: 8 }}>
                  <CartesianGrid horizontal={false} stroke="#F3F4F6" />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="grade" width={72} tickLine={false} axisLine={false} tick={{ fill: "#4B5563", fontSize: 12 }} />
                  <Tooltip
                    formatter={(_, __, item) => {
                      const payload = item.payload as (typeof gradeCollection)[number];
                      return [`₹${payload.collected.toLocaleString("en-IN")} of ₹${payload.target.toLocaleString("en-IN")}`, "Collected"];
                    }}
                    cursor={{ fill: "#F9FAFB" }}
                  />
                  <Bar dataKey="percent" radius={[0, 8, 8, 0]}>
                    {gradeCollection.map((entry) => (
                      <Cell key={entry.grade} fill={entry.percent < 55 ? "#DC2626" : entry.percent < 60 ? "#F59E0B" : "#7C3AED"} />
                    ))}
                    <LabelList dataKey="percent" position="right" formatter={(value: number) => `${value}%`} fill="#4B5563" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <SectionHeading title="Overdue Fee Alerts" subtitle="Students with pending fees" />
            <div className="mt-4 divide-y divide-gray-100">
              {overdueStudents.map((student, index) => (
                <div key={student.name} className="flex items-center gap-3 py-3">
                  <div className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${toneClasses[["blue", "violet", "amber", "orange", "green"][index] as Tone].avatar}`}>
                    {student.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-950">{student.name}</div>
                    <div className="text-sm text-gray-500">Class {student.klass}</div>
                  </div>
                  <div className="text-right text-sm font-semibold text-gray-950">{student.amount}</div>
                  <div className="hidden text-sm text-gray-500 sm:block">{student.days}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                    onClick={() => toast.success("Reminder sent to parent")}
                  >
                    Remind
                  </Button>
                </div>
              ))}
            </div>
            <button className="mt-3 text-sm font-semibold text-violet-600 hover:text-violet-700">View all 38 overdue →</button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Today's Admissions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-400">
                <tr>
                  <th className="py-3 font-semibold">Student Name</th>
                  <th className="py-3 font-semibold">Grade</th>
                  <th className="py-3 font-semibold">Parent Name</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admissions.map((row) => (
                  <tr key={row.student}>
                    <td className="py-3 font-semibold text-gray-950">{row.student}</td>
                    <td className="py-3 text-gray-500">{row.grade}</td>
                    <td className="py-3 text-gray-500">{row.parent}</td>
                    <td className="py-3">
                      <StatusBadge className={row.badge}>{row.status}</StatusBadge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="outline" size="sm" className="rounded-full">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Visitor Log — Today (12 visitors)</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs uppercase text-gray-400">
                <tr>
                  <th className="py-3 font-semibold">Name</th>
                  <th className="py-3 font-semibold">Purpose</th>
                  <th className="py-3 font-semibold">Time In</th>
                  <th className="py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visitors.map((row) => (
                  <tr key={`${row.name}-${row.time}`}>
                    <td className="py-3 font-semibold text-gray-950">{row.name}</td>
                    <td className="py-3 text-gray-500">{row.purpose}</td>
                    <td className="py-3 text-gray-500">{row.time}</td>
                    <td className="py-3">
                      <StatusBadge className={row.badge}>{row.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Button variant="outline" className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700">
              <Plus className="mr-2 size-4" />
              Log New Visitor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
