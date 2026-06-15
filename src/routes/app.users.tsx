import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PageHeader } from "@/components/scholarii/AppShell";
import { NewAdmissionModal } from "@/components/modals/NewAdmissionModal";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  BookOpen,
  Check,
  ClipboardList,
  Download,
  FileText,
  Mail,
  Phone,
  Printer,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/users")({ component: AdmissionsManagementPage });

type Status = "New" | "Docs Pending" | "Under Review" | "Confirmed" | "Rejected";
type App = {
  student: string;
  parent: string;
  grade: string;
  date: string;
  docs: number;
  status: Status;
};
type Tab = "details" | "documents" | "fee";

const palette = [
  "#667eea",
  "#764ba2",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];
const fieldClass =
  "h-10 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100";
const grades = Array.from({ length: 10 }, (_, index) => `Grade ${index + 1}`);
const apps: App[] = (
  [
    ["Aarav Singh", "Rajesh Singh", "Grade 1", "2026-06-12", 4, "New"],
    ["Maya Rao", "Sunita Rao", "Grade 2", "2026-06-11", 3, "Docs Pending"],
    ["Ishaan Patel", "Vikram Patel", "Grade 3", "2026-06-10", 2, "Docs Pending"],
    ["Diya Sharma", "Meena Sharma", "Grade 4", "2026-06-09", 4, "Under Review"],
    ["Rohan Verma", "Anil Verma", "Grade 5", "2026-06-08", 0, "Docs Pending"],
    ["Kavya Nair", "Priya Nair", "Grade 1", "2026-06-07", 4, "Confirmed"],
    ["Saanvi Gupta", "Deepak Gupta", "Grade 2", "2026-06-06", 3, "Docs Pending"],
    ["Aditya Joshi", "Ramesh Joshi", "Grade 3", "2026-06-05", 2, "Under Review"],
    ["Priya Menon", "Sanjay Menon", "Grade 4", "2026-06-04", 1, "Docs Pending"],
    ["Ananya Iyer", "Kavitha Iyer", "Grade 5", "2026-06-03", 4, "Confirmed"],
    ["Dev Sharma", "Suresh Sharma", "Grade 1", "2026-06-02", 4, "Confirmed"],
    ["Tina Mehta", "Rekha Mehta", "Grade 2", "2026-06-01", 1, "Docs Pending"],
    ["Arjun Kapoor", "Manoj Kapoor", "Grade 6", "2026-05-30", 4, "Under Review"],
    ["Sneha Pillai", "Rajan Pillai", "Grade 7", "2026-05-29", 3, "Docs Pending"],
    ["Kabir Khan", "Salim Khan", "Grade 8", "2026-05-28", 4, "Confirmed"],
    ["Riya Desai", "Nitin Desai", "Grade 1", "2026-05-27", 2, "Docs Pending"],
    ["Amit Jain", "Prakash Jain", "Grade 9", "2026-05-26", 4, "Under Review"],
    ["Pooja Reddy", "Venkat Reddy", "Grade 2", "2026-05-25", 0, "New"],
    ["Karan Singh", "Harpreet Singh", "Grade 3", "2026-05-24", 3, "Docs Pending"],
    ["Nisha Patil", "Ganesh Patil", "Grade 4", "2026-05-23", 4, "Confirmed"],
    ["Yash Kulkarni", "Sunil Kulkarni", "Grade 5", "2026-05-22", 1, "Docs Pending"],
    ["Aisha Shaikh", "Imran Shaikh", "Grade 6", "2026-05-21", 4, "Under Review"],
  ] satisfies [string, string, string, string, number, Status][]
).map(([student, parent, grade, date, docs, status]) => ({
  student,
  parent,
  grade,
  date,
  docs,
  status,
}));

const statusClass: Record<Status, string> = {
  New: "bg-gray-100 text-gray-600",
  "Docs Pending": "bg-amber-100 text-amber-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Confirmed: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const pendingDocs = [
  ["Maya Rao", "Grade 2", true, false, true, true],
  ["Ishaan Patel", "Grade 3", true, true, false, false],
  ["Rohan Verma", "Grade 5", false, false, false, false],
  ["Saanvi Gupta", "Grade 2", true, true, true, false],
  ["Priya Menon", "Grade 4", true, false, true, false],
  ["Tina Mehta", "Grade 2", true, false, false, false],
  ["Sneha Pillai", "Grade 7", true, true, false, true],
  ["Riya Desai", "Grade 1", true, false, true, false],
  ["Karan Singh", "Grade 3", true, true, true, false],
  ["Yash Kulkarni", "Grade 5", true, false, false, false],
] as const;

const followups = [
  ["Rohan Verma", "Grade 5", "0/4 documents missing - urgent", "9823456781"],
  ["Tina Mehta", "Grade 2", "Admission fee pending - 12 days", "9812345678"],
  ["Maya Rao", "Grade 2", "School TC not submitted", "9834567812"],
  ["Riya Desai", "Grade 1", "No response since 5 days", "9845678123"],
  ["Priya Menon", "Grade 4", "Aadhar copy pending", "9856781234"],
  ["Yash Kulkarni", "Grade 5", "3 docs missing - not responding", "9867812345"],
];

const seats = [
  ["Grade 1", "24/25", "23/25", "47", "50", "3", "Almost Full"],
  ["Grade 2", "25/25", "24/25", "49", "50", "1", "Full"],
  ["Grade 3", "22/25", "23/25", "45", "50", "5", "Available"],
  ["Grade 4", "24/25", "24/25", "48", "50", "2", "Almost Full"],
  ["Grade 5", "21/25", "22/25", "43", "50", "7", "Available"],
  ["Grade 6", "23/25", "22/25", "45", "50", "5", "Available"],
  ["Grade 7", "25/25", "24/25", "49", "50", "1", "Full"],
  ["Grade 8", "20/25", "21/25", "41", "50", "9", "Available"],
  ["Grade 9", "24/25", "23/25", "47", "50", "3", "Almost Full"],
  ["Grade 10", "22/25", "23/25", "45", "50", "5", "Available"],
];

const feeRows = [
  [
    "Kavya Nair",
    "Grade 1",
    "Registration + Admission",
    "Rs 3,000",
    "Cash",
    "2026-06-07",
    "R-ADM-001",
  ],
  [
    "Dev Sharma",
    "Grade 1",
    "Registration + Admission",
    "Rs 3,000",
    "UPI",
    "2026-06-02",
    "R-ADM-002",
  ],
  [
    "Kabir Khan",
    "Grade 8",
    "Registration + Admission",
    "Rs 3,000",
    "Cheque",
    "2026-05-28",
    "R-ADM-003",
  ],
  [
    "Ananya Iyer",
    "Grade 5",
    "Registration + Admission",
    "Rs 3,000",
    "Cash",
    "2026-06-03",
    "R-ADM-004",
  ],
  ["Aarav Singh", "Grade 1", "Registration Only", "Rs 500", "Cash", "2026-06-12", "R-ADM-005"],
  ["Arjun Kapoor", "Grade 6", "Registration Only", "Rs 500", "UPI", "2026-05-30", "R-ADM-006"],
  [
    "Nisha Patil",
    "Grade 4",
    "Registration + Admission",
    "Rs 3,000",
    "Cash",
    "2026-05-23",
    "R-ADM-007",
  ],
  ["Diya Sharma", "Grade 4", "Registration Only", "Rs 500", "UPI", "2026-06-09", "R-ADM-008"],
];

function AdmissionsManagementPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [grade, setGrade] = useState("all");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("applications");
  const [selected, setSelected] = useState<App | null>(null);
  const [feeModal, setFeeModal] = useState(false);
  const [showNewAdmission, setShowNewAdmission] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [lettersModal, setLettersModal] = useState(false);
  const [done, setDone] = useState<number[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return apps.filter((app) => {
      const matchesQ = !q || `${app.student} ${app.parent} ${app.grade}`.toLowerCase().includes(q);
      return (
        matchesQ &&
        (status === "all" || app.status === status) &&
        (grade === "all" || app.grade === grade)
      );
    });
  }, [query, status, grade]);

  const visible = filtered.slice((page - 1) * 10, page * 10);
  const switchTab = (id: string) => {
    setActiveTab(id);
    requestAnimationFrame(() => tabsRef.current?.scrollIntoView({ block: "start" }));
  };
  const tabs = [
    ["applications", ClipboardList, "Applications"],
    ["documents", FileText, "Documents & Follow-up"],
    ["seats", BookOpen, "Seats & Fees"],
    ["print", Printer, "Print Actions"],
  ] as const;

  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Admissions Management"
        subtitle="Application tracking, document collection, and enrollment"
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-full bg-violet-600 text-white hover:bg-violet-700"
              onClick={() => setShowNewAdmission(true)}
            >
              <UserPlus className="mr-2 size-4" />
              New Admission
            </Button>
            <Ghost icon={Printer}>Print Forms</Ghost>
            <Ghost icon={Download}>Export Report</Ghost>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        {[
          ["Total Inquiries", "542", "+12% this month", ""],
          ["Applications Submitted", "106", "Awaiting processing", ""],
          ["Documents Pending", "34", "Students with incomplete docs", "Action Needed"],
          ["Awaiting Principal Approval", "12", "Sent for review", "Pending"],
          ["Admissions Confirmed", "11", "This academic year", ""],
          ["Seats Remaining", "18", "Across all grades", "Warning"],
        ].map(([label, value, sub, badge]) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            <p className="mt-1 text-sm text-gray-500">{sub}</p>
            {badge && (
              <Badge
                className={`mt-3 ${badge === "Pending" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
              >
                {badge}
              </Badge>
            )}
          </div>
        ))}
      </div>

      <div ref={tabsRef} className="mt-6 flex overflow-x-auto border-b border-gray-200">
        {tabs.map(([id, Icon, label]) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${activeTab === id ? "border-violet-600 font-semibold text-violet-600" : "border-transparent text-gray-500 hover:text-violet-600"}`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "applications" && (
        <Card className="mt-4">
          <SectionTitle
            title="All Applications"
            subtitle="Click View to see full details and update documents"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-64 flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search student, parent, class..."
                className={`${fieldClass} w-full pl-9`}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={status}
                onChange={(value) => {
                  setStatus(value);
                  setPage(1);
                }}
                options={["all", "New", "Docs Pending", "Under Review", "Confirmed", "Rejected"]}
                labels={{ all: "All Statuses" }}
              />
              <Select
                value={grade}
                onChange={(value) => {
                  setGrade(value);
                  setPage(1);
                }}
                options={["all", ...grades]}
                labels={{ all: "All Classes" }}
              />
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setGrade("all");
                  setPage(1);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
          <Table
            headers={[
              "Student Name",
              "Parent Name",
              "Class Applied",
              "Applied On",
              "Documents",
              "Status",
              "Action",
            ]}
          >
            {visible.map((app, index) => (
              <tr
                key={`${app.student}-${app.date}`}
                className="cursor-pointer border-t border-gray-100 hover:bg-gray-50"
                onClick={() => setSelected(app)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={app.student} index={index} />
                    <div>
                      <p className="font-medium text-gray-900">{app.student}</p>
                      <p className="text-xs text-gray-500">{app.parent}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{app.parent}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{app.grade}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{app.date}</td>
                <td className={`px-4 py-3 text-sm font-medium ${docColor(app.docs)}`}>
                  {app.docs}/4
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusClass[app.status]}>{app.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <button className="text-sm font-medium text-violet-600 hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </Table>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-gray-500">
              Showing {filtered.length ? (page - 1) * 10 + 1 : 0}-
              {Math.min(page * 10, filtered.length)} of {filtered.length} applications
            </span>
            <div className="flex gap-1">
              <SmallButton onClick={() => setPage(Math.max(1, page - 1))}>Prev</SmallButton>
              {[1, 2, 3].map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`size-8 rounded-full text-sm ${page === number ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-violet-50"}`}
                >
                  {number}
                </button>
              ))}
              <SmallButton onClick={() => setPage(Math.min(3, page + 1))}>Next</SmallButton>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "documents" && (
        <div className="mt-4 grid gap-4 xl:grid-cols-[55fr_45fr]">
          <Card>
            <div className="flex items-start justify-between gap-3">
              <SectionTitle
                title="Document Collection Tracker"
                subtitle="Incomplete documents - follow up required"
              />
              <Button
                size="sm"
                className="rounded-full bg-violet-600 text-white"
                onClick={() =>
                  toast.success("Reminders sent to all 10 parents with pending documents")
                }
              >
                Send Bulk Reminder
              </Button>
            </div>
            <Table
              headers={[
                "Student",
                "Grade",
                "Birth Cert",
                "School TC",
                "Aadhar",
                "Photos",
                "Action",
              ]}
            >
              {pendingDocs.map(([student, rowGrade, ...docs]) => (
                <tr key={student} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm font-medium">{student}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{rowGrade}</td>
                  {docs.map((ok, index) => (
                    <td key={index} className="px-3 py-2">
                      {ok ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <X className="size-4 text-red-600" />
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <SmallButton
                      onClick={() => toast.success(`Document reminder sent to ${student} parent`)}
                    >
                      Remind
                    </SmallButton>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
          <Card>
            <SectionTitle title="Today's Follow-up List" subtitle="Parents to contact today" />
            <div className="mt-4">
              {followups.map(([student, rowGrade, reason, phone], index) => {
                const isDone = done.includes(index);
                return (
                  <div
                    key={student}
                    className={`mb-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition ${isDone ? "opacity-50 line-through" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={student} index={index} />
                      <div>
                        <p className="font-medium">{student}</p>
                        <p className="text-xs text-gray-500">{rowGrade}</p>
                      </div>
                    </div>
                    <p
                      className={`my-2 text-sm ${reason.includes("urgent") || reason.includes("not responding") ? "text-red-600" : "text-amber-700"}`}
                    >
                      {reason}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-500">{phone}</span>
                      <SmallButton onClick={() => toast.success(`Calling ${student} parent`)}>
                        <Phone className="mr-1 size-3" />
                        Call
                      </SmallButton>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() =>
                            setDone((current) =>
                              current.includes(index)
                                ? current.filter((item) => item !== index)
                                : [...current, index],
                            )
                          }
                        />
                        Mark Done
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "seats" && (
        <div className="mt-4 grid gap-4 xl:grid-cols-[55fr_45fr]">
          <div className="space-y-4">
            <Card>
              <SectionTitle title="Seat Availability" subtitle="Enrollment vs capacity" />
              <Table headers={["Grade", "Filled", "Total", "Available", "Status"]}>
                {seats.map((row) => (
                  <tr key={row[0]} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-sm font-medium">{row[0]}</td>
                    {row.slice(3, 6).map((cell) => (
                      <td key={cell} className="px-3 py-2 text-sm text-gray-600">
                        {cell}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <SeatBadge status={row[6]} />
                    </td>
                  </tr>
                ))}
              </Table>
            </Card>
            <Card>
              <SectionTitle
                title="Admission Fee Collection"
                subtitle="Registration and admission fee tracking"
              />
              <Table
                headers={[
                  "Student & Grade",
                  "Fee Type",
                  "Amount",
                  "Mode",
                  "Date",
                  "Receipt",
                  "Action",
                ]}
              >
                {feeRows.map((row) => (
                  <tr key={row[6]} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <p className="text-sm font-medium">{row[0]}</p>
                      <p className="text-xs text-gray-500">{row[1]}</p>
                    </td>
                    {row.slice(2).map((cell) => (
                      <td key={cell} className="px-3 py-2 text-sm text-gray-600">
                        {cell}
                      </td>
                    ))}
                    <td className="px-3 py-2">
                      <SmallButton
                        onClick={() => toast.success(`Receipt ${row[6]} sent to printer`)}
                      >
                        Reprint
                      </SmallButton>
                    </td>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold">School-wide Capacity</h3>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ["Total Seats", "500"],
                  ["Filled", "459"],
                  ["Available", "41"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between text-sm">
                <span>Capacity used</span>
                <span>91.8%</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-gray-100">
                <div className="h-3 rounded-full bg-violet-500" style={{ width: "91.8%" }} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["Grades with seats", "6"],
                  ["Almost full", "3"],
                  ["Full grades", "2"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="font-semibold">This Month Fee Summary</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <p>Registration Fees: Rs 4,000</p>
                <p>Admission Fees: Rs 18,000</p>
                <p className="text-xl font-bold text-gray-900">Total Collected: Rs 22,000</p>
                <p>Fee Waivers: 2 (by Principal)</p>
                <p>Pending: Rs 12,500</p>
              </div>
              <Button
                className="mt-5 w-full rounded-full bg-violet-600 text-white"
                onClick={() => setFeeModal(true)}
              >
                Collect Fee
              </Button>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "print" && (
        <section className="mt-4">
          <SectionTitle
            title="Quick Print & Export Actions"
            subtitle="Generate, print, and download admission documents"
          />
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(
              [
                [
                  FileText,
                  "text-violet-600 bg-violet-50",
                  "Blank Admission Form",
                  "Print physical form for walk-in parents",
                  "Print",
                  () => toast.success("Admission form sent to printer"),
                ],
                [
                  BookOpen,
                  "text-blue-600 bg-blue-50",
                  "Enrollment Register",
                  "Official serial-number-wise admission register",
                  "Download",
                  () => toast.success("Enrollment register downloading..."),
                ],
                [
                  ClipboardList,
                  "text-green-600 bg-green-50",
                  "Documents Checklist",
                  "Printable checklist for document collection",
                  "Print",
                  () => toast.success("Documents checklist sent to printer"),
                ],
                [
                  BarChart2,
                  "text-amber-600 bg-amber-50",
                  "Admission Report",
                  "Monthly summary of applications and confirmations",
                  "Export PDF",
                  () => setReportModal(true),
                ],
                [
                  Mail,
                  "text-orange-600 bg-orange-50",
                  "Confirmation Letters",
                  "Print admission confirmation for confirmed students",
                  "Print",
                  () => setLettersModal(true),
                ],
                [
                  Download,
                  "text-gray-600 bg-gray-100",
                  "Export Applications",
                  "Download all applications as Excel sheet",
                  "Export Excel",
                  () => toast.success("Applications exported to Excel"),
                ],
              ] satisfies [typeof Printer, string, string, string, string, () => void][]
            ).map(([Icon, tone, title, description, action, onClick]) => (
              <div
                key={title}
                className="flex min-h-48 cursor-pointer flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:border-violet-300"
                onClick={onClick}
              >
                <div className={`grid size-10 place-items-center rounded-full ${tone}`}>
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 flex-1 text-sm text-gray-500">{description}</p>
                <div>
                  <SmallButton>{action}</SmallButton>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selected && <ApplicationModal app={selected} onClose={() => setSelected(null)} />}
      {feeModal && <CollectFeeModal onClose={() => setFeeModal(false)} />}
      {showNewAdmission && <NewAdmissionModal onClose={() => setShowNewAdmission(false)} />}
      {reportModal && <ExportReportModal onClose={() => setReportModal(false)} />}
      {lettersModal && <ConfirmationLettersModal onClose={() => setLettersModal(false)} />}
    </div>
  );
}

function ExportReportModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Export Admission Report" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          toast.success("Admission report downloading");
          onClose();
        }}
      >
        <Field label="Month">
          <Select
            value="June 2026"
            onChange={() => undefined}
            options={["June 2026", "May 2026", "April 2026"]}
          />
        </Field>
        <Field label="Format">
          <Select value="PDF" onChange={() => undefined} options={["PDF", "Excel"]} />
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-full bg-violet-600 text-white">Download</Button>
        </div>
      </form>
    </Modal>
  );
}

function ConfirmationLettersModal({ onClose }: { onClose: () => void }) {
  const students = [
    "Kavya Nair",
    "Dev Sharma",
    "Kabir Khan",
    "Ananya Iyer",
    "Nisha Patil",
    "Ananya Iyer",
  ];
  return (
    <Modal title="Print Confirmation Letters" onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          toast.success("Selected confirmation letters sent to printer");
          onClose();
        }}
      >
        <Field label="Select Students">
          <div className="space-y-2 rounded-xl border border-gray-100 p-3">
            {students.map((student, index) => (
              <label key={`${student}-${index}`} className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked />
                {student}
              </label>
            ))}
          </div>
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-full bg-violet-600 text-white">Print Selected</Button>
        </div>
      </form>
    </Modal>
  );
}

function ApplicationModal({ app, onClose }: { app: App; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("details");
  const docs = [
    "Birth Certificate",
    "Previous School TC",
    "Aadhar Copy (Student + Parent)",
    "Passport Size Photos (2 nos)",
  ];

  return (
    <Modal
      title={`${app.student} - Application Details`}
      subtitle={`${app.grade} Application - Applied ${app.date}`}
      onClose={onClose}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge className={`${statusClass[app.status]} px-3 py-1`}>{app.status}</Badge>
        {app.status === "Under Review" && (
          <Button
            className="rounded-full bg-violet-600 text-white hover:bg-violet-700"
            onClick={() => toast.success("Application forwarded to principal")}
          >
            Forward to Principal
          </Button>
        )}
      </div>
      <div className="mt-5 flex gap-4 border-b border-gray-100">
        {(["details", "documents", "fee"] as Tab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`pb-2 text-sm capitalize ${tab === item ? "border-b-2 border-violet-600 font-semibold text-violet-600" : "text-gray-500"}`}
          >
            {item === "fee" ? "Fee" : item === "details" ? "Application Details" : "Documents"}
          </button>
        ))}
      </div>
      {tab === "details" && <DetailsTab app={app} />}
      {tab === "documents" && (
        <div className="mt-5">
          <SectionTitle
            title="Document Checklist"
            subtitle="Mark documents as received when parent submits physical copies"
          />
          <div className="mt-4 space-y-3">
            {docs.map((doc, index) => {
              const received = index < app.docs;
              return (
                <div
                  key={doc}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">{doc}</p>
                    {received && <p className="text-xs text-gray-500">Received on {app.date}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        received ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }
                    >
                      {received ? "Received" : "Pending"}
                    </Badge>
                    {received ? (
                      <span className="text-sm font-medium text-green-600">Received</span>
                    ) : (
                      <SmallButton onClick={() => toast.success(`${doc} marked received`)}>
                        Mark Received
                      </SmallButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            variant="outline"
            className="mt-4 rounded-full border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => toast.success("Reminder sent to parent via SMS")}
          >
            Send Document Reminder
          </Button>
        </div>
      )}
      {tab === "fee" && <FeeTab />}
    </Modal>
  );
}

function DetailsTab({ app }: { app: App }) {
  const rows = [
    ["Student Name", app.student],
    ["Date of Birth", "2017-04-12"],
    ["Gender", "Not specified"],
    ["Aadhar Number", "XXXX-XXXX-4321"],
    ["Previous School", "Bright Future School"],
    ["Grade Applied", app.grade],
    ["Section Preference", "A"],
    ["Application Date", app.date],
  ];
  return (
    <div className="mt-5 space-y-5">
      <InfoGrid rows={rows} />
      <SectionTitle title="Parent Details" />
      <InfoGrid
        rows={[
          ["Father's Name", app.parent],
          ["Mother's Name", "Mrs " + app.parent.split(" ")[0]],
          ["Primary Contact", "9823456781"],
          ["Alternate Contact", "9812345678"],
          ["Email", `${app.student.split(" ")[0].toLowerCase()}@parent.example`],
          ["Home Address", "Nashik Road, Nashik"],
        ]}
      />
      <SectionTitle title="Activity Log" />
      <div className="space-y-3 text-sm text-gray-600">
        {[
          "Application submitted - 2026-06-10 9:15 AM",
          "Documents partially uploaded - 2026-06-10 11:30 AM",
          "Sent for principal review - 2026-06-11 2:00 PM",
        ].map((item) => (
          <p
            key={item}
            className="before:mr-2 before:inline-block before:size-2 before:rounded-full before:bg-violet-500 before:content-['']"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function FeeTab() {
  const [nested, setNested] = useState(false);
  return (
    <div className="mt-5">
      <SectionTitle title="Admission Fee Status" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Registration Fee</p>
          <p className="mt-1 text-xl font-bold">Rs 500</p>
          <Badge className="mt-2 bg-green-100 text-green-700">Paid</Badge>
        </div>
        <div className="rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Admission Fee</p>
          <p className="mt-1 text-xl font-bold">Rs 2,500</p>
          <Badge className="mt-2 bg-amber-100 text-amber-700">Pending</Badge>
        </div>
      </div>
      <Table headers={["Fee Type", "Amount", "Payment Mode", "Date", "Receipt No"]}>
        <tr className="border-t border-gray-100">
          <td className="px-4 py-3 text-sm">Registration Fee</td>
          <td className="px-4 py-3 text-sm">Rs 500</td>
          <td className="px-4 py-3 text-sm">Cash</td>
          <td className="px-4 py-3 text-sm">2026-06-10</td>
          <td className="px-4 py-3 text-sm">R-2026-ADM-001</td>
        </tr>
      </Table>
      <Button
        className="mt-4 w-full rounded-full bg-violet-600 text-white hover:bg-violet-700"
        onClick={() => setNested(true)}
      >
        Collect Fee
      </Button>
      {nested && <CollectFeeModal onClose={() => setNested(false)} compact />}
    </div>
  );
}

function CollectFeeModal({ onClose, compact = false }: { onClose: () => void; compact?: boolean }) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    toast.success(compact ? "Receipt generated" : "Receipt generated - R-ADM-009");
    onClose();
  };
  return (
    <Modal title={compact ? "Collect Fee" : "Collect Admission Fee"} onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        {!compact && (
          <>
            <Field label="Student Name *">
              <input required className={fieldClass} />
            </Field>
            <Field label="Admission No">
              <input className={fieldClass} />
            </Field>
            <Field label="Grade *">
              <Select required value="Grade 1" onChange={() => undefined} options={grades} />
            </Field>
          </>
        )}
        <Field label="Fee Type *">
          <Select
            required
            value="Registration Fee"
            onChange={() => undefined}
            options={
              compact
                ? ["Registration Fee", "Admission Fee", "Other"]
                : ["Registration Fee Rs 500", "Admission Fee Rs 2,500", "Both Rs 3,000"]
            }
          />
        </Field>
        <Field label="Amount Rs">
          <input
            required
            type="number"
            defaultValue={compact ? 500 : 3000}
            className={fieldClass}
          />
        </Field>
        <Field label="Payment Mode *">
          <Select
            required
            value="Cash"
            onChange={() => undefined}
            options={compact ? ["Cash", "UPI", "Cheque"] : ["Cash", "UPI", "Cheque", "DD"]}
          />
        </Field>
        {!compact && (
          <>
            <Field label="Reference No">
              <input className={fieldClass} />
            </Field>
            <Field label="Date *">
              <input required type="date" defaultValue="2026-06-13" className={fieldClass} />
            </Field>
          </>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700">
            Generate Receipt
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Modal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          onClick={onClose}
        >
          <X className="size-5" />
        </button>
        <h2 className="pr-8 text-xl font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[820px] text-left">
        <thead className="sticky top-0 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}

function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
      style={{ backgroundColor: palette[index % palette.length] }}
    >
      {initials}
    </span>
  );
}

function Badge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function Ghost({
  icon: Icon,
  children,
  onClick,
}: {
  icon: typeof Printer;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      onClick={onClick}
    >
      <Icon className="mr-2 size-4" />
      {children}
    </Button>
  );
}

function SmallButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function Select({
  value,
  onChange,
  options,
  labels = {},
  required = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
  required?: boolean;
}) {
  return (
    <select
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={fieldClass}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {labels[option] ?? option}
        </option>
      ))}
    </select>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function InfoGrid({ rows }: { rows: string[][] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className={label === "Home Address" ? "md:col-span-2" : ""}>
          <p className="text-xs font-medium uppercase text-gray-400">{label}</p>
          <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SeatBadge({ status }: { status: string }) {
  const klass =
    status === "Full"
      ? "bg-red-100 text-red-700"
      : status === "Almost Full"
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";
  return <Badge className={klass}>{status}</Badge>;
}

function docColor(count: number) {
  if (count === 4) return "text-green-600";
  if (count >= 2) return "text-amber-600";
  return "text-red-600";
}
