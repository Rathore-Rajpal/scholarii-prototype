import { createFileRoute } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Download,
  FileText,
  GraduationCap,
  Printer,
  TrendingUp,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/academics")({ component: AdminAcademicsPage });

type TabId = "timetable" | "exams" | "reports" | "syllabus";
type ExamFilter = "Upcoming" | "Completed" | "All";
type ReportStatus = "Ready to Print" | "Printed" | "Not Ready";

const classes = [
  "Grade 1-A", "Grade 1-B", "Grade 2-A", "Grade 2-B", "Grade 3-A", "Grade 3-B",
  "Grade 4-A", "Grade 4-B", "Grade 5-A", "Grade 5-B", "Grade 6-A", "Grade 6-B",
  "Grade 7-A", "Grade 7-B", "Grade 8-A", "Grade 8-B", "Grade 9-A", "Grade 9-B",
  "Grade 10-A", "Grade 10-B",
];

const periods = [
  { label: "Period 1", room: "Room 101", time: "08:30-09:10 AM", subject: "Mathematics", teacher: "Mr Verma" },
  { label: "Period 2", room: "Room 101", time: "09:15-09:55 AM", subject: "English", teacher: "Mrs Patel" },
  { label: "Period 3", room: "Room 101", time: "10:00-10:40 AM", subject: "EVS", teacher: "Mrs Singh" },
  { label: "Short Break", room: "-", time: "10:40-10:55 AM", subject: "-", teacher: "-", break: true },
  { label: "Period 4", room: "Room 101", time: "10:55-11:35 AM", subject: "Hindi", teacher: "Mrs Sharma" },
  { label: "Period 5", room: "Art Studio", time: "11:40 AM-12:20 PM", subject: "Art", teacher: "Mrs Dutta" },
  { label: "Period 6", room: "Sports Ground", time: "12:25-01:05 PM", subject: "PE", teacher: "Mr Roy" },
  { label: "Lunch Break", room: "-", time: "01:05-01:40 PM", subject: "-", teacher: "-", break: true },
  { label: "Period 7", room: "Room 101", time: "01:40-02:20 PM", subject: "Mathematics", teacher: "Mr Verma" },
  { label: "Period 8", room: "Library", time: "02:25-03:05 PM", subject: "Library", teacher: "Mrs Rao" },
];

const exams = [
  ["Mathematics", "Class 10", "18 Jun", "10:00 AM", "Hall A", "Mr Khan", "Upcoming"],
  ["Physics", "Class 12", "18 Jun", "10:00 AM", "Hall B", "Mrs Singh", "Upcoming"],
  ["Chemistry", "Class 11", "18 Jun", "1:30 PM", "Lab 3", "Mr Verma", "Upcoming"],
  ["English", "Class 9", "19 Jun", "9:00 AM", "Room 301", "Mrs Patel", "Upcoming"],
  ["Hindi", "Class 8", "19 Jun", "9:00 AM", "Room 302", "Mrs Sharma", "Upcoming"],
  ["Science", "Class 7", "20 Jun", "10:00 AM", "Room 201", "Mrs Rao", "Upcoming"],
  ["Social Studies", "Class 6", "20 Jun", "10:00 AM", "Room 202", "Mr Roy", "Upcoming"],
  ["Mathematics", "Class 5", "21 Jun", "9:00 AM", "Room 101", "Mr Sharma", "Upcoming"],
  ["English", "Class 4", "21 Jun", "9:00 AM", "Room 102", "Mrs Dutta", "Upcoming"],
  ["EVS", "Class 3", "14 Jun", "9:00 AM", "Room 103", "Mrs Singh", "Completed"],
  ["Mathematics", "Class 2", "13 Jun", "9:00 AM", "Room 104", "Mr Khan", "Completed"],
  ["English", "Class 1", "12 Jun", "9:00 AM", "Room 105", "Mrs Patel", "Completed"],
  ["GK", "Class 3", "11 Jun", "11:00 AM", "Room 103", "Mrs Sharma", "Completed"],
  ["Drawing", "Class 4", "10 Jun", "11:00 AM", "Room 102", "Mrs Dutta", "Completed"],
  ["Computer", "Class 5", "09 Jun", "10:00 AM", "Lab 1", "Mr Verma", "Completed"],
  ["PE Theory", "Class 6", "08 Jun", "10:00 AM", "Room 201", "Mr Roy", "Completed"],
] as const;

const reportCards: { student: string; className: string; status: ReportStatus; printedOn: string }[] = [
  { student: "Aarav Sharma", className: "Grade 1-A", status: "Ready to Print", printedOn: "-" },
  { student: "Arjun Patel", className: "Grade 1-A", status: "Ready to Print", printedOn: "-" },
  { student: "Ishaan Singh", className: "Grade 1-A", status: "Printed", printedOn: "10 Jun 2026" },
  { student: "Aadhya Mehta", className: "Grade 1-A", status: "Printed", printedOn: "10 Jun 2026" },
  { student: "Anaya Iyer", className: "Grade 1-A", status: "Ready to Print", printedOn: "-" },
  { student: "Kabir Joshi", className: "Grade 1-A", status: "Not Ready", printedOn: "-" },
  { student: "Aryan Khan", className: "Grade 1-A", status: "Printed", printedOn: "11 Jun 2026" },
  { student: "Tara Kapoor", className: "Grade 1-A", status: "Ready to Print", printedOn: "-" },
  { student: "Aditya Verma", className: "Grade 1-A", status: "Not Ready", printedOn: "-" },
  { student: "Ayaan Kumar", className: "Grade 1-A", status: "Printed", printedOn: "11 Jun 2026" },
  { student: "Maya Rao", className: "Grade 2-A", status: "Ready to Print", printedOn: "-" },
  { student: "Rohan Singh", className: "Grade 2-A", status: "Printed", printedOn: "10 Jun 2026" },
  { student: "Diya Sharma", className: "Grade 2-A", status: "Not Ready", printedOn: "-" },
  { student: "Kavya Nair", className: "Grade 2-A", status: "Ready to Print", printedOn: "-" },
  { student: "Dev Mehta", className: "Grade 2-A", status: "Ready to Print", printedOn: "-" },
];

const syllabus = [
  ["Mathematics", "Grades 1-10", 78, "7/9 chapters"],
  ["English", "Grades 1-10", 82, "9/11 chapters"],
  ["Science", "Grades 3-10", 71, "5/7 chapters"],
  ["Hindi", "Grades 1-10", 85, "11/13 chapters"],
  ["Social Studies", "Grades 4-10", 69, "9/13 chapters"],
  ["EVS", "Grades 1-3", 90, "9/10 chapters"],
  ["Computer Science", "Grades 3-10", 65, "6/9 chapters"],
  ["Physical Education", "Grades 1-10", 88, "7/8 modules"],
  ["Art & Craft", "Grades 1-8", 80, "8/10 modules"],
  ["Music", "Grades 1-5", 75, "6/8 modules"],
  ["Library", "Grades 1-10", 95, "19/20 sessions"],
  ["General Knowledge", "Grades 1-5", 55, "5/9 chapters"],
] as const;

function AdminAcademicsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("timetable");
  const [selectedClass, setSelectedClass] = useState("Grade 1-A");
  const [examFilter, setExamFilter] = useState<ExamFilter>("All");
  const [selectedTerm, setSelectedTerm] = useState("Term 1 (Apr-Jun)");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [paperwork, setPaperwork] = useState([false, false, false]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const filteredExams = useMemo(() => {
    if (examFilter === "All") return exams;
    return exams.filter((exam) => exam[6] === examFilter);
  }, [examFilter]);

  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Academics & Curriculum"
        subtitle="Timetable, exam schedule, report cards, and academic records"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" className="hidden border border-gray-200 bg-white gap-2 md:inline-flex" onClick={() => toast.success("Timetable sent to printer")}>
              <Printer className="size-4" /> Print Timetable
            </Button>
            <Button variant="ghost" className="hidden border border-gray-200 bg-white gap-2 md:inline-flex">
              <Calendar className="size-4" /> Exam Schedule
            </Button>
            <Button className="bg-violet-600 text-white hover:bg-violet-700 gap-2">
              <FileText className="size-4" /> Generate Report Cards
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiTile label="Total Classes" value="48" sub="Running today" icon={BookOpen} tone="violet" />
        <KpiTile label="Subjects Covered" value="12" sub="Across all grades" icon={GraduationCap} tone="blue" />
        <KpiTile label="Exams This Month" value="6" sub="2 completed, 4 upcoming" icon={ClipboardList} tone="amber" />
        <KpiTile label="Report Cards Pending" value="18" sub="Not yet printed" icon={FileText} tone="orange" dot />
        <KpiTile label="Syllabus Completion" value="74%" sub="School average" icon={TrendingUp} tone="green" />
      </div>

      <div className="mt-6 mb-4 flex overflow-x-auto border-b border-gray-200 scrollbar-hide">
        <TabButton active={activeTab === "timetable"} onClick={() => setActiveTab("timetable")}>Class Timetable</TabButton>
        <TabButton active={activeTab === "exams"} onClick={() => setActiveTab("exams")}>Exam Schedule</TabButton>
        <TabButton active={activeTab === "reports"} onClick={() => setActiveTab("reports")}>Report Cards</TabButton>
        <TabButton active={activeTab === "syllabus"} onClick={() => setActiveTab("syllabus")}>Syllabus Tracker</TabButton>
      </div>

      {activeTab === "timetable" && (
        <Section title="Class Timetable" subtitle="View and print timetables for any class">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-xs">
              <label className="text-sm font-medium text-gray-700">Select Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="mt-1 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{classes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button variant="ghost" className="border border-violet-200 bg-white text-violet-600 gap-2" onClick={() => toast.success("Timetable sent to printer")}>
              <Printer className="size-4" /> Print This Timetable
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-1 mb-4">3 lectures - short break - 3 lectures - lunch - 2 lectures</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {periods.map((period) => period.break ? (
              <div key={period.label} className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-700">{period.label}</p>
                <p className="mt-1 text-sm text-gray-500">{period.time}</p>
              </div>
            ) : (
              <div key={period.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900">{period.label}</p>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{period.room}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{period.time}</p>
                <p className="mt-2 text-sm font-medium text-gray-900">{period.subject}</p>
                <p className="text-sm text-gray-400">{period.teacher}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeTab === "exams" && (
        <Section title="Exam Schedule" subtitle="Upcoming and completed examinations">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1">
              {(["Upcoming", "Completed", "All"] as ExamFilter[]).map((filter) => (
                <button key={filter} onClick={() => setExamFilter(filter)} className={cn("px-3 py-1.5 text-sm", examFilter === filter ? "rounded-lg bg-violet-100 font-medium text-violet-700" : "text-gray-500 hover:text-gray-700")}>{filter}</button>
              ))}
            </div>
            <Button variant="ghost" className="border border-gray-200 bg-white gap-2" onClick={() => toast.success("Exam schedule sent to printer")}><Printer className="size-4" /> Print Schedule</Button>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="border-gray-100 bg-white shadow-sm xl:col-span-2">
              <DataTable headers={["Subject", "Class", "Date", "Time", "Room", "Invigilator", "Status"]}>
                {filteredExams.map((exam) => <tr key={exam.join("-")} className="border-b border-gray-50">{exam.map((cell, index) => <td key={`${cell}-${index}`} className="px-4 py-3 text-sm text-gray-600">{index === 6 ? <StatusBadge status={cell as "Upcoming" | "Completed"} /> : cell}</td>)}</tr>)}
              </DataTable>
              <div className="space-y-3 p-4 lg:hidden">
                {filteredExams.map((exam) => (
                  <div key={exam.join("-")} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{exam[0]}</div>
                        <div className="text-xs text-gray-500">{exam[1]}</div>
                      </div>
                      <StatusBadge status={exam[6] as "Upcoming" | "Completed"} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <Info label="Date" value={exam[2]} />
                      <Info label="Time" value={exam[3]} />
                      <Info label="Room" value={exam[4]} />
                      <Info label="Invigilator" value={exam[5]} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">This Month's Exams</h3>
              <SummaryRow label="Total Scheduled" value="16" />
              <SummaryRow label="Completed" value="6" valueClass="text-green-600" />
              <SummaryRow label="Upcoming" value="10" valueClass="text-blue-600" />
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-sm text-gray-500"><span>6 of 16 completed</span><span>37.5%</span></div>
                <div className="h-2 w-full rounded-full bg-gray-100"><div className="h-2 w-[37.5%] rounded-full bg-green-500" /></div>
              </div>
              <Divider />
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Upcoming This Week</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Mathematics (Class 10) - Wed 18 Jun, Hall A</li>
                <li>Physics (Class 12) - Wed 18 Jun, Hall B</li>
                <li>Chemistry (Class 11) - Wed 18 Jun, Lab 3</li>
              </ul>
              <Divider />
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Exam Paperwork</h4>
              {["Hall tickets printed", "Seating charts ready", "Answer sheets counted"].map((label, index) => (
                <label key={label} className={cn("mb-2 flex cursor-pointer items-center gap-2 text-sm", paperwork[index] ? "text-gray-400 line-through" : "text-gray-700")}>
                  <input type="checkbox" checked={paperwork[index]} onChange={() => setPaperwork((current) => current.map((checked, i) => i === index ? !checked : checked))} />
                  {label}
                </label>
              ))}
              <Button className="mt-4 w-full bg-violet-600 hover:bg-violet-700" onClick={() => toast.success("Exam documents sent to printer")}>Print All Exam Documents</Button>
            </Card>
          </div>
        </Section>
      )}

      {activeTab === "reports" && (
        <Section title="Report Cards" subtitle="Print and manage student report cards">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-xs">
              <label className="text-sm font-medium text-gray-700">Select Term</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="mt-1 bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Term 1 (Apr-Jun)", "Term 2 (Jul-Sep)", "Term 3 (Oct-Dec)", "Annual"].map((term) => <SelectItem key={term} value={term}>{term}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="border border-violet-200 bg-white text-violet-600 gap-2" onClick={() => toast.success("Report card sent to printer")}><Printer className="size-4" /> Print All Ready</Button>
              <Button variant="ghost" className="border border-gray-200 bg-white gap-2"><Download className="size-4" /> Export All</Button>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <Card className="border-gray-100 bg-white shadow-sm xl:col-span-2">
              <DataTable headers={["Student", "Class", "Status", "Printed On", "Action"]}>
                {reportCards.map((card) => (
                  <tr key={card.student} className="border-b border-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{card.student}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{card.className}</td>
                    <td className="px-4 py-3"><ReportBadge status={card.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{card.printedOn}</td>
                    <td className="px-4 py-3"><ReportAction status={card.status} /></td>
                  </tr>
                ))}
              </DataTable>
              <div className="space-y-3 p-4 lg:hidden">
                {reportCards.map((card) => (
                  <div key={card.student} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{card.student}</div>
                        <div className="text-xs text-gray-500">{card.className}</div>
                      </div>
                      <ReportBadge status={card.status} />
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                      <Info label="Printed On" value={card.printedOn} />
                      <Info label="Term" value={selectedTerm} />
                    </div>
                    <div className="w-full">
                      <ReportAction status={card.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900">Term 1 Report Cards</h3>
              <SummaryRow label="Total Students" value="430" />
              <SummaryRow label="Ready to Print" value="312" valueClass="text-green-600" />
              <SummaryRow label="Already Printed" value="86" valueClass="text-gray-500" />
              <SummaryRow label="Not Ready" value="32" valueClass="text-amber-600" />
              <Progress label="Ready" value="72.5%" width="72.5%" color="bg-green-500" />
              <Progress label="Printed" value="20%" width="20%" color="bg-gray-400" />
              <Progress label="Pending" value="7.5%" width="7.5%" color="bg-amber-400" />
              <Divider />
              <h4 className="mt-3 mb-2 text-sm font-semibold text-gray-700">Grade-wise Status</h4>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Grade 1", "42", "12", "4"], ["Grade 2", "40", "10", "8"], ["Grade 3", "38", "14", "6"], ["Grade 4", "35", "16", "7"], ["Grade 5", "32", "18", "4"],
                  ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="py-2 text-gray-600">{cell}</td>)}</tr>)}
                </tbody>
              </table>
              <Button className="mt-4 w-full bg-violet-600 hover:bg-violet-700" onClick={() => setBulkModalOpen(true)}>Bulk Print All Ready</Button>
            </Card>
          </div>
          {bulkModalOpen && <BulkPrintModal onClose={() => setBulkModalOpen(false)} />}
        </Section>
      )}

      {activeTab === "syllabus" && (
        <Section title="Syllabus Completion Tracker" subtitle="Track curriculum progress by subject and grade">
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            Syllabus data is updated by subject teachers. Contact teachers to update completion percentages.
          </div>
          <div className="mb-4 w-full max-w-xs">
            <label className="text-sm font-medium text-gray-700">Select Grade</label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="mt-1 bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>{["All Grades", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"].map((grade) => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {syllabus.map(([subject, grades, percent, chapters]) => <SyllabusCard key={subject} subject={subject} grades={grades} percent={percent} chapters={chapters} />)}
          </div>
          <Card className="mt-5 border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">School-wide Average: 74%</h3>
            <p className="mt-1 text-sm text-gray-500">Average across all 12 subjects - Last updated 2 days ago</p>
            <div className="mt-4 h-3 rounded-full bg-gray-100"><div className="h-3 w-[74%] rounded-full bg-violet-500" /></div>
          </Card>
        </Section>
      )}
    </div>
  );
}

function KpiTile({ label, value, sub, icon: Icon, tone, dot }: { label: string; value: string; sub: string; icon: ComponentType<{ className?: string }>; tone: "violet" | "blue" | "amber" | "orange" | "green"; dot?: boolean }) {
  const tones = {
    violet: "bg-violet-100 text-violet-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };
  return (
    <Card className="cursor-pointer rounded-xl border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-400">{sub}</p>
        </div>
        <div className={cn("relative grid size-10 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
          {dot ? <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-amber-400" /> : null}
        </div>
      </div>
    </Card>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={cn("min-w-fit whitespace-nowrap border-b-2 px-3 py-2.5 text-xs lg:px-5 lg:py-3 lg:text-sm", active ? "border-violet-600 font-semibold text-violet-600" : "border-transparent text-gray-500 hover:text-gray-700")}>{children}</button>;
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table className="hidden w-full min-w-[760px] text-left lg:table">
      <thead className="bg-gray-50">
        <tr>{headers.map((header) => <th key={header} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">{header}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-400">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: "Upcoming" | "Completed" }) {
  return <Badge className={cn("border-0", status === "Upcoming" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>{status}</Badge>;
}

function ReportBadge({ status }: { status: ReportStatus }) {
  const styles = {
    "Ready to Print": "bg-green-100 text-green-700",
    Printed: "bg-gray-100 text-gray-500",
    "Not Ready": "bg-amber-100 text-amber-700",
  };
  return <Badge className={cn("border-0", styles[status])}>{status}</Badge>;
}

function ReportAction({ status }: { status: ReportStatus }) {
  if (status === "Not Ready") return <span className="px-2 py-1 text-xs text-gray-300">-</span>;
  if (status === "Printed") return <button className="rounded border border-violet-200 px-2 py-1 text-xs text-violet-600" onClick={() => toast.success("Report card sent to printer")}>Reprint</button>;
  return <button className="rounded bg-violet-600 px-2 py-1 text-xs text-white" onClick={() => toast.success("Report card sent to printer")}>Print</button>;
}

function SummaryRow({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return <div className="mb-2 flex justify-between text-sm"><span className="text-gray-500">{label}</span><span className={cn("font-semibold text-gray-900", valueClass)}>{value}</span></div>;
}

function Divider() {
  return <div className="my-4 border-t border-gray-100" />;
}

function Progress({ label, value, width, color }: { label: string; value: string; width: string; color: string }) {
  return (
    <div className="mb-3 mt-3">
      <div className="mb-1 flex justify-between text-sm"><span className="text-gray-500">{label}</span><span className="font-medium text-gray-700">{value}</span></div>
      <div className="h-2 rounded-full bg-gray-100"><div className={cn("h-2 rounded-full", color)} style={{ width }} /></div>
    </div>
  );
}

function SyllabusCard({ subject, grades, percent, chapters }: { subject: string; grades: string; percent: number; chapters: string }) {
  const color = percent >= 80 ? "green" : percent >= 60 ? "amber" : "red";
  const textColor = color === "green" ? "text-green-600" : color === "amber" ? "text-amber-600" : "text-red-600";
  const barColor = color === "green" ? "bg-green-500" : color === "amber" ? "bg-amber-500" : "bg-red-500";
  return (
    <Card className="rounded-xl border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">{subject}</h3>
      <p className="mt-0.5 mb-3 text-xs text-gray-400">{grades}</p>
      <p className={cn("mb-1 text-3xl font-bold", textColor)}>{percent}%</p>
      <p className="mb-3 text-sm text-gray-500">{chapters}</p>
      <div className="h-2 rounded-full bg-gray-100"><div className={cn("h-2 rounded-full", barColor)} style={{ width: `${percent}%` }} /></div>
    </Card>
  );
}

function BulkPrintModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-0 lg:items-center lg:p-4" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl lg:max-h-[85vh] lg:max-w-[550px] lg:rounded-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-center pb-1 pt-3 lg:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100">
          <X size={18} />
        </button>
        <div className="p-4 lg:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Bulk Print Report Cards</h2>
          <div className="mt-5 space-y-4">
            <ModalSelect label="Select Grade" options={["All Grades", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"]} />
            <ModalSelect label="Select Section" options={["All", "A", "B"]} />
            <ModalSelect label="Print Only" options={["Ready Cards", "All Cards"]} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button className="w-full" variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="w-full bg-violet-600 hover:bg-violet-700" onClick={() => { toast.success("Report card sent to printer"); onClose(); }}>Print Now</Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ModalSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Select defaultValue={options[0]}>
        <SelectTrigger className="mt-1 bg-white"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
      </Select>
    </label>
  );
}
