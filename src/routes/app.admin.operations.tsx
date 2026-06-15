import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BookOpen,
  Building2,
  Calendar,
  Check,
  ClipboardList,
  FileDown,
  FileText,
  Printer,
  Receipt,
  Users,
  UserX,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/admin/operations")({
  component: AdminOperationsPage,
});

type ModalType = "timetable" | "attendance" | "exam" | "receipt" | "studentList" | "government";
type ReorderItem = { name: string };
type Priority = "High" | "Medium" | "Low";
type RequestStatus = "Pending" | "In Progress" | "Completed";
type MaintenanceIssue = {
  issue: string;
  location: string;
  reportedBy: string;
  date: string;
  priority: Priority;
  status: RequestStatus;
};

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100";

const classes = Array.from({ length: 10 }, (_, grade) => [`Class ${grade + 1}A`, `Class ${grade + 1}B`]).flat();

const periods = [
  { type: "period", label: "Period 1", room: "Room 301", time: "08:30-09:10 AM", subject: "Mathematics", teacher: "Mr Verma" },
  { type: "period", label: "Period 2", room: "Science Lab", time: "09:15-09:55 AM", subject: "Science", teacher: "Mrs Singh" },
  { type: "period", label: "Period 3", room: "Room 301", time: "10:00-10:40 AM", subject: "History", teacher: "Mr Sharma" },
  { type: "break", label: "Short Break", time: "10:40-10:55 AM" },
  { type: "period", label: "Period 4", room: "Room 301", time: "10:55-11:35 AM", subject: "English", teacher: "Mrs Patel" },
  { type: "period", label: "Period 5", room: "Computer Lab", time: "11:40 AM-12:20 PM", subject: "Computer", teacher: "Mr Khan" },
  { type: "period", label: "Period 6", room: "Sports Ground", time: "12:25-01:05 PM", subject: "PE", teacher: "Mr Roy" },
  { type: "break", label: "Lunch Break", time: "01:05-01:40 PM" },
  { type: "period", label: "Period 7", room: "Art Studio", time: "01:40-02:20 PM", subject: "Art", teacher: "Mrs Dutta" },
  { type: "period", label: "Period 8", room: "Library", time: "02:25-03:05 PM", subject: "Library", teacher: "Mrs Rao" },
];

const statTiles = [
  { label: "Classes Running", value: "48", icon: BookOpen },
  { label: "Teachers Present", value: "16", icon: Users },
  { label: "Teachers Absent", value: "2", icon: UserX, valueClass: "text-red-600" },
  { label: "Events Today", value: "2", icon: Calendar },
  { label: "Exams Today", value: "6", icon: ClipboardList },
  { label: "Rooms Occupied", value: "9", icon: Building2 },
  { label: "Pending Replacements", value: "1", icon: AlertCircle, valueClass: "text-amber-600" },
];

const printCards = [
  { modal: "timetable" as ModalType, icon: Printer, tone: "violet", title: "Print Class Timetable", desc: "Print full timetable for any class or all classes", button: "Print" },
  { modal: "attendance" as ModalType, icon: ClipboardList, tone: "blue", title: "Export Attendance Sheet", desc: "Download blank or filled attendance sheet by class", button: "Export" },
  { modal: "exam" as ModalType, icon: FileText, tone: "green", title: "Exam Schedule", desc: "Print today's exam timetable and hall allocation", button: "Print" },
  { modal: "receipt" as ModalType, icon: Receipt, tone: "amber", title: "Fee Receipt Reprint", desc: "Reprint a previously issued fee receipt", button: "Search & Print" },
  { modal: "studentList" as ModalType, icon: Users, tone: "orange", title: "Class Student List", desc: "Print full student list with admission numbers", button: "Print" },
  { modal: "government" as ModalType, icon: FileDown, tone: "gray", title: "Government Report Export", desc: "Export compliance and attendance data for authorities", button: "Export" },
];

const exams = [
  { subject: "Mathematics", klass: "Class 10", time: "10:00 AM-1:00 PM", invigilator: "Mr Khan", room: "Hall A" },
  { subject: "Physics", klass: "Class 12", time: "10:00 AM-1:00 PM", invigilator: "Mrs Singh", room: "Hall B" },
  { subject: "Chemistry", klass: "Class 11", time: "1:30 PM-4:00 PM", invigilator: "Mr Verma", room: "Lab 3" },
];

const checklist = [
  "Hall tickets distributed",
  "Answer sheets counted & kept ready",
  "Seating arrangement printed",
  "Invigilation duty list given to teacher",
  "Room set up done",
];

const events = [
  { name: "Morning Assembly", meta: "Main Ground - Mrs Joseph", time: "08:15 AM", status: "Completed" },
  { name: "Science Exhibition", meta: "Auditorium - Mr Roy", time: "12:30 PM", status: "Running" },
  { name: "PTM", meta: "Hall B - Mrs Patel", time: "02:00 PM", status: "Pending" },
];

const routes = [
  ["R-01", "Nashik Road, CBS", "Mr Ramesh", "45 students", "Running"],
  ["R-02", "Satpur, MIDC", "Mr Suresh", "38 students", "Running"],
  ["R-03", "Gangapur Road", "Mr Vijay", "42 students", "Running"],
  ["R-04", "College Road, Sharanpur", "Mr Anil", "35 students", "Delayed"],
  ["R-05", "Panchavati", "Mr Deepak", "40 students", "Running"],
  ["R-06", "Dwarka, Indira Nagar", "Mr Pramod", "44 students", "Running"],
  ["R-07", "Cidco, Nashik East", "Mr Rajesh", "36 students", "Breakdown"],
  ["R-08", "Ozar, Nandur", "Mr Santosh", "30 students", "Running"],
];

const drivers = [
  ["Mr Ramesh", "Present"],
  ["Mr Suresh", "Present"],
  ["Mr Vijay", "Present"],
  ["Mr Anil", "Present"],
  ["Mr Deepak", "Present"],
  ["Mr Pramod", "Present"],
  ["Mr Rajesh", "Absent"],
  ["Mr Santosh", "Present"],
];

const stock = [
  ["A4 Paper Reams", "Stationery", "12", "20", "Low Stock", "Reorder"],
  ["Chalk Boxes", "Classroom", "45", "30", "Adequate", "-"],
  ["Registers (Student)", "Records", "8", "15", "Low Stock", "Reorder"],
  ["Printer Ink Cartridges", "Office", "3", "5", "Low", "Reorder"],
  ["Whiteboard Markers", "Classroom", "22", "20", "Adequate", "-"],
  ["Stapler Pins", "Office", "15", "10", "Adequate", "-"],
  ["Attendance Registers", "Records", "4", "10", "Low Stock", "Reorder"],
  ["Rubber Stamps", "Office", "6", "5", "Adequate", "-"],
  ["Correction Fluid", "Stationery", "2", "8", "Low Stock", "Reorder"],
  ["Carbon Copy Paper", "Records", "18", "20", "Low", "Reorder"],
];

const requisitions = [
  ["A4 Paper (50 reams)", "Submitted 3 days ago", "Pending Approval"],
  ["Student Registers (20 nos)", "Submitted 1 week ago", "Pending Approval"],
  ["Printer Ink (5 cartridges)", "Submitted today", "Just Submitted"],
  ["Lab Glassware Set", "Submitted 5 days ago", "Approved"],
];

const maintenanceIssues: MaintenanceIssue[] = [
  { issue: "Ceiling fan not working", location: "Class 4B", reportedBy: "Mrs Patel", date: "10 Jun", priority: "High", status: "Pending" },
  { issue: "Broken window glass", location: "Class 7A", reportedBy: "Mr Sharma", date: "09 Jun", priority: "Medium", status: "In Progress" },
  { issue: "Leaking tap in washroom", location: "Boys Toilet Block", reportedBy: "Office", date: "08 Jun", priority: "Medium", status: "In Progress" },
  { issue: "Projector not turning on", location: "Class 9B", reportedBy: "Mr Khan", date: "11 Jun", priority: "High", status: "Pending" },
  { issue: "Tube light fused", location: "Staff Room", reportedBy: "Mrs Rao", date: "07 Jun", priority: "Low", status: "Completed" },
  { issue: "Door lock broken", location: "Library", reportedBy: "Mrs Dutta", date: "06 Jun", priority: "Medium", status: "Completed" },
  { issue: "Notice board damaged", location: "Main Corridor", reportedBy: "Office", date: "05 Jun", priority: "Low", status: "Pending" },
  { issue: "Water cooler not cooling", location: "Ground Floor", reportedBy: "Office", date: "11 Jun", priority: "High", status: "Pending" },
];

const toneClasses: Record<string, { icon: string; soft: string }> = {
  violet: { icon: "text-violet-600", soft: "bg-violet-50" },
  blue: { icon: "text-blue-600", soft: "bg-blue-50" },
  green: { icon: "text-green-600", soft: "bg-green-50" },
  amber: { icon: "text-amber-600", soft: "bg-amber-50" },
  orange: { icon: "text-orange-600", soft: "bg-orange-50" },
  gray: { icon: "text-gray-600", soft: "bg-gray-50" },
};

const statusClasses: Record<string, string> = {
  Running: "bg-green-100 text-green-700",
  Delayed: "bg-amber-100 text-amber-700",
  Breakdown: "bg-red-100 text-red-700",
  Adequate: "bg-green-100 text-green-700",
  Low: "bg-amber-100 text-amber-700",
  "Low Stock": "bg-red-100 text-red-700",
  "Pending Approval": "bg-amber-100 text-amber-700",
  "Just Submitted": "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-red-50 text-red-600",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  LowPriority: "bg-gray-100 text-gray-600",
};

function AdminOperationsPage() {
  const [selectedClass, setSelectedClass] = useState("Class 10A");
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [reorderItem, setReorderItem] = useState<ReorderItem | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<MaintenanceIssue | null>(null);
  const [examChecks, setExamChecks] = useState<Record<number, boolean[]>>(() =>
    Object.fromEntries(exams.map((_, index) => [index, Array(checklist.length).fill(false)])),
  );
  const [maintenanceFormKey, setMaintenanceFormKey] = useState(0);

  const modal = useMemo(() => {
    if (activeModal) return <PrintExportModal modal={activeModal} onClose={() => setActiveModal(null)} />;
    if (reorderItem) return <ReorderModal item={reorderItem} onClose={() => setReorderItem(null)} />;
    if (selectedIssue) return <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />;
    return null;
  }, [activeModal, reorderItem, selectedIssue]);

  const toggleExamCheck = (examIndex: number, checkIndex: number) => {
    setExamChecks((current) => ({
      ...current,
      [examIndex]: current[examIndex].map((checked, index) => (index === checkIndex ? !checked : checked)),
    }));
  };

  const submitMaintenance = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Maintenance request logged successfully");
    setMaintenanceFormKey((key) => key + 1);
  };

  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Daily Office Operations"
        subtitle="Manage schedules, print documents, exams, transport, inventory and maintenance"
        action={
          <div className="flex flex-wrap gap-2">
            <GhostButton icon={Printer}>Print Timetable</GhostButton>
            <GhostButton icon={FileText}>Export Attendance Sheet</GhostButton>
            <GhostButton icon={ClipboardList}>Daily Report</GhostButton>
          </div>
        }
      />

      <section className="grid gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:grid-cols-[7fr_3fr]">
        <div>
          <p className="text-sm text-gray-500">Today</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">Friday, 12 June 2026</h2>
          <p className="mt-2 text-sm text-gray-400">Current time: 9:06 AM</p>
          <p className="mt-1 text-sm font-medium text-violet-600">Period 4 - 10:55 AM - 11:35 AM</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-amber-500" />
            <h3 className="text-base font-semibold text-amber-800">Examination Day</h3>
          </div>
          <p className="mt-2 text-sm text-amber-700">Exams running today with staggered rooms and invigilation coverage</p>
          <div className="mt-4 space-y-2 text-sm text-amber-800">
            <p><span className="font-semibold">Exam coverage:</span> 3 exams across Classes 10-12</p>
            <p><span className="font-semibold">Rooms allocated:</span> Hall A, Hall B, Lab 3</p>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {statTiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">{tile.label}</p>
                <p className={`mt-2 text-2xl font-bold text-gray-900 ${tile.valueClass ?? ""}`}>{tile.value}</p>
              </div>
              <tile.icon className="size-5 text-gray-400" />
            </div>
          </div>
        ))}
      </section>

      <SectionCard className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading title="Class Timetable" subtitle="Today's schedule - reference view for parent and staff queries" />
          <div className="min-w-48">
            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)} className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100">
              {classes.map((klass) => <option key={klass}>{klass}</option>)}
            </select>
            <p className="mt-2 text-xs text-gray-400">3 lectures - short break - 3 lectures - lunch - 2 lectures</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {periods.map((period) => period.type === "period" ? (
            <div key={`${period.label}-${period.time}`} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900">{period.label}</h3>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">{period.room}</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">{period.time}</p>
              <p className="mt-2 text-sm font-medium text-gray-900">{period.subject}</p>
              <p className="mt-1 text-sm text-gray-500">{period.teacher}</p>
            </div>
          ) : (
            <div key={`${period.label}-${period.time}`} className="rounded-xl bg-gray-50 p-4">
              <h3 className="font-semibold text-gray-900">{period.label}</h3>
              <p className="mt-3 text-sm text-gray-500">{period.time}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <section className="mt-6">
        <SectionHeading title="Print & Export Center" subtitle="Generate and download documents for daily office use" />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {printCards.map((card) => (
            <button key={card.title} type="button" onClick={() => setActiveModal(card.modal)} className="rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-violet-300 hover:shadow-md">
              <IconBubble icon={card.icon} tone={card.tone} />
              <h3 className="mt-4 font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-1 min-h-10 text-sm text-gray-500">{card.desc}</p>
              <span className="mt-4 inline-flex rounded-full border border-violet-200 px-3 py-1.5 text-sm font-semibold text-violet-600">{card.button}</span>
            </button>
          ))}
        </div>
      </section>

      <SectionCard className="mt-6">
        <SectionHeading title="School Events Today" />
        <div className="mt-4 divide-y divide-gray-100">
          {events.map((event) => (
            <div key={event.name} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-gray-900">{event.name}</p>
                <p className="text-sm text-gray-500">{event.meta}</p>
              </div>
              <div className="flex min-w-44 items-center justify-end gap-3">
                <span className="text-sm font-medium text-gray-700">{event.time}</span>
                <EventBadge status={event.status} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <section className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <SectionHeading title="Exam Paperwork & Coordination" subtitle="Today's exam logistics and document checklist" />
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">Exam Day Active</span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
          {exams.map((exam, examIndex) => {
            const complete = examChecks[examIndex].filter(Boolean).length;
            return (
              <div key={exam.subject} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{exam.subject}</h3>
                    <p className="text-sm text-gray-500">{exam.klass}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">{exam.room}</span>
                </div>
                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-900">Time:</span> {exam.time}</p>
                  <p><span className="font-medium text-gray-900">Invigilator:</span> {exam.invigilator}</p>
                  <p><span className="font-medium text-gray-900">Room:</span> {exam.room}</p>
                </div>
                <div className="mt-5 space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Paperwork Checklist</p>
                  {checklist.map((item, checkIndex) => (
                    <label key={item} className="flex cursor-pointer items-start gap-2 text-sm text-gray-600">
                      <input type="checkbox" checked={examChecks[examIndex][checkIndex]} onChange={() => toggleExamCheck(examIndex, checkIndex)} className="mt-0.5 size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>{complete}/5 tasks completed</span>
                    <span>{Math.round((complete / 5) * 100)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-violet-500" style={{ width: `${(complete / 5) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-right">
          <Button variant="outline" className="rounded-full border-violet-200 bg-white text-violet-600 hover:bg-violet-50 hover:text-violet-700">Print All Exam Documents</Button>
        </div>
      </section>

      <section className="mt-6">
        <SectionHeading title="Transport Coordination" subtitle="Today's bus routes and driver status" />
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[65fr_35fr]">
          <TableCard headers={["Route No", "Areas Covered", "Driver", "Capacity", "Status"]} rows={routes} />
          <SectionCard>
            <h3 className="font-semibold text-gray-900">Driver Attendance Today</h3>
            <div className="mt-4 space-y-3">
              {drivers.map(([driver, status]) => (
                <div key={driver} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{driver}</span>
                  <span className={status === "Absent" ? "font-semibold text-red-600" : "text-gray-600"}>{status === "Absent" ? "X" : <Check className="inline size-4 text-green-600" />} {status}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-semibold text-red-700">R-07 bus breakdown reported near Cidco.</p>
              <p className="mt-1 text-sm text-red-600">Contact alternate transport or inform affected parents.</p>
              <Button variant="outline" size="sm" className="mt-3 rounded-full border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700">Notify Parents</Button>
            </div>
          </SectionCard>
        </div>
      </section>

      <section className="mt-6">
        <SectionHeading title="Inventory & Stationery" subtitle="Current stock levels and pending requisitions" />
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[60fr_40fr]">
          <SectionCard>
            <Table headers={["Item", "Category", "Current Stock", "Min Required", "Status", "Action"]}>
              {stock.map((row) => (
                <tr key={row[0]} className="border-t border-gray-100">
                  {row.slice(0, 4).map((cell) => <td key={cell} className="px-4 py-3 text-sm text-gray-600">{cell}</td>)}
                  <td className="px-4 py-3"><StatusBadge className={statusClasses[row[4]]}>{row[4]}</StatusBadge></td>
                  <td className="px-4 py-3 text-right">
                    {row[5] === "Reorder" ? (
                      <Button variant="outline" size="sm" className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700" onClick={() => setReorderItem({ name: row[0] })}>Reorder</Button>
                    ) : <span className="text-sm text-gray-400">-</span>}
                  </td>
                </tr>
              ))}
            </Table>
          </SectionCard>
          <SectionCard>
            <h3 className="font-semibold text-gray-900">Pending Requisitions</h3>
            <div className="mt-4 divide-y divide-gray-100">
              {requisitions.map(([item, date, status]) => (
                <div key={item} className="py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900">{item}</p>
                    <StatusBadge className={statusClasses[status]}>{status}</StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{date}</p>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full rounded-full bg-violet-600 text-white hover:bg-violet-700">+ New Requisition</Button>
          </SectionCard>
        </div>
      </section>

      <section className="mt-6">
        <SectionHeading title="Maintenance Requests" subtitle="Log and track repair and facility issues" />
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[60fr_40fr]">
          <SectionCard>
            <Table headers={["Issue", "Location", "Reported By", "Date", "Priority", "Status", "Action"]}>
              {maintenanceIssues.map((row) => (
                <tr key={`${row.issue}-${row.location}`} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{row.issue}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.reportedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.date}</td>
                  <td className="px-4 py-3"><StatusBadge className={statusClasses[row.priority === "Low" ? "LowPriority" : row.priority]}>{row.priority}</StatusBadge></td>
                  <td className="px-4 py-3"><StatusBadge className={statusClasses[row.status]}>{row.status}</StatusBadge></td>
                  <td className="px-4 py-3 text-right"><Button variant="outline" size="sm" className="rounded-full border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700" onClick={() => setSelectedIssue(row)}>View</Button></td>
                </tr>
              ))}
            </Table>
          </SectionCard>
          <SectionCard>
            <h3 className="font-semibold text-gray-900">Log New Maintenance Request</h3>
            <form key={maintenanceFormKey} className="mt-4 space-y-3" onSubmit={submitMaintenance}>
              <Field label="Issue Description *"><textarea required rows={3} placeholder="Describe the problem clearly" className={fieldClass} /></Field>
              <Field label="Location / Room *"><input required placeholder="e.g. Class 4B, Staff Room, Boys Toilet" className={fieldClass} /></Field>
              <Field label="Category *"><Select required options={["Electrical", "Plumbing", "Furniture", "Equipment", "Civil", "Pest Control", "Other"]} /></Field>
              <Field label="Priority *"><Select required options={["High", "Medium", "Low"]} /></Field>
              <Field label="Reported By"><input defaultValue="Office (Admin)" className={fieldClass} /></Field>
              <Field label="Attach photo (optional)"><input type="file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-3 file:rounded-full file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700" /></Field>
              <Button type="submit" className="mt-4 w-full rounded-full bg-violet-600 text-white hover:bg-violet-700">Submit Request</Button>
            </form>
          </SectionCard>
        </div>
      </section>

      {modal}
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function GhostButton({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <Button variant="outline" className="rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
      <Icon className="mr-2 size-4" />
      {children}
    </Button>
  );
}

function IconBubble({ icon: Icon, tone }: { icon: LucideIcon; tone: string }) {
  return (
    <div className={`grid size-11 place-items-center rounded-xl ${toneClasses[tone].soft}`}>
      <Icon className={`size-5 ${toneClasses[tone].icon}`} />
    </div>
  );
}

function StatusBadge({ children, className }: { children: ReactNode; className: string }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}

function EventBadge({ status }: { status: string }) {
  const className = status === "Running" ? "bg-violet-600 text-white" : status === "Completed" ? "bg-gray-100 text-gray-500" : "border border-gray-200 text-gray-500";
  return <StatusBadge className={className}>{status}</StatusBadge>;
}

function TableCard({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <SectionCard>
      <Table headers={headers}>
        {rows.map((row) => (
          <tr key={row[0]} className="border-t border-gray-100">
            {row.slice(0, -1).map((cell) => <td key={`${row[0]}-${cell}`} className="px-4 py-3 text-sm text-gray-600">{cell}</td>)}
            <td className="px-4 py-3"><StatusBadge className={statusClasses[row[row.length - 1]]}>{row[row.length - 1]}</StatusBadge></td>
          </tr>
        ))}
      </Table>
    </SectionCard>
  );
}

function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left">
        <thead className="text-xs uppercase text-gray-400">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
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

function Select({ options, required = false, defaultValue }: { options: string[]; required?: boolean; defaultValue?: string }) {
  return (
    <select required={required} defaultValue={defaultValue ?? options[0]} className={fieldClass}>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

function ModalFrame({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 p-4" onClick={onClose}>
      <div className="relative max-h-[85vh] w-full max-w-[550px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button type="button" aria-label="Close modal" className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" onClick={onClose}>
          <X className="size-5" />
        </button>
        <h2 className="pr-8 text-xl font-semibold text-gray-900">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

function PrintExportModal({ modal, onClose }: { modal: ModalType; onClose: () => void }) {
  const allClasses = ["All Classes", ...classes];
  const submit = (message: string) => {
    toast.success(message);
    onClose();
  };

  if (modal === "timetable") {
    return (
      <ModalFrame title="Print Class Timetable" onClose={onClose}>
        <div className="space-y-4">
          <Field label="Select Class"><Select options={allClasses} /></Field>
          <Field label="Format"><Select options={["Portrait", "Landscape"]} /></Field>
          <ModalActions onClose={onClose} submitLabel="Print Now" onSubmit={() => submit("Timetable sent to printer")} />
        </div>
      </ModalFrame>
    );
  }

  if (modal === "attendance") {
    return (
      <ModalFrame title="Export Attendance Sheet" onClose={onClose}>
        <div className="space-y-4">
          <Field label="Select Class"><Select options={classes} /></Field>
          <Field label="Select Date"><input type="date" defaultValue="2026-06-12" className={fieldClass} /></Field>
          <Field label="Type"><Select options={["Blank Sheet", "Today's Filled Data"]} /></Field>
          <ModalActions onClose={onClose} submitLabel="Download Excel" onSubmit={() => submit("Attendance sheet downloaded")} />
        </div>
      </ModalFrame>
    );
  }

  if (modal === "exam") {
    return (
      <ModalFrame title="Exam Schedule" onClose={onClose}>
        <div className="space-y-4">
          <Field label="Select Exam"><Select options={["Today's Exams", "Full Schedule"]} /></Field>
          <ModalActions onClose={onClose} submitLabel="Print Now" onSubmit={() => submit("Exam schedule sent to printer")} />
        </div>
      </ModalFrame>
    );
  }

  if (modal === "receipt") {
    return (
      <ModalFrame title="Fee Receipt Reprint" onClose={onClose}>
        <div className="space-y-4">
          <Field label="Student Name or Receipt No"><input placeholder="Enter student name or receipt number" className={fieldClass} /></Field>
          <Button className="rounded-full bg-violet-600 text-white hover:bg-violet-700">Search</Button>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-semibold text-gray-900">R-2026-003 | Kabir Joshi | Rs 4,800</span>
              <Button variant="outline" size="sm" className="rounded-full bg-white" onClick={() => submit("Receipt sent to printer")}>Print</Button>
            </div>
          </div>
        </div>
      </ModalFrame>
    );
  }

  if (modal === "studentList") {
    return (
      <ModalFrame title="Class Student List" onClose={onClose}>
        <div className="space-y-4">
          <Field label="Select Class"><Select options={classes} /></Field>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Include</p>
            {["Photo", "Parent Contact", "Address"].map((item) => (
              <label key={item} className="mr-4 inline-flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="size-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                {item}
              </label>
            ))}
          </div>
          <ModalActions onClose={onClose} submitLabel="Print Now" onSubmit={() => submit("Student list sent to printer")} />
        </div>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame title="Government Report Export" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Report Type"><Select options={["Monthly Attendance", "Enrollment Data", "Fee Collection Summary"]} /></Field>
        <Field label="Month"><Select options={["June 2026"]} /></Field>
        <ModalActions onClose={onClose} submitLabel="Download PDF" onSubmit={() => submit("Government report downloaded")} />
      </div>
    </ModalFrame>
  );
}

function ReorderModal({ item, onClose }: { item: ReorderItem; onClose: () => void }) {
  return (
    <ModalFrame title="Raise Reorder Request" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Item Name"><input readOnly value={item.name} className={`${fieldClass} bg-gray-50`} /></Field>
        <Field label="Quantity Required"><input type="number" min={1} defaultValue={20} className={fieldClass} /></Field>
        <Field label="Urgency"><Select options={["Urgent", "This Week", "This Month"]} /></Field>
        <Field label="Notes"><textarea rows={3} placeholder="Optional" className={fieldClass} /></Field>
        <ModalActions onClose={onClose} submitLabel="Submit Request" onSubmit={() => { toast.success("Reorder request submitted"); onClose(); }} />
      </div>
    </ModalFrame>
  );
}

function IssueModal({ issue, onClose }: { issue: MaintenanceIssue; onClose: () => void }) {
  return (
    <ModalFrame title="Maintenance Request Details" onClose={onClose}>
      <div className="space-y-4 text-sm">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="font-semibold text-gray-900">{issue.issue}</p>
          <p className="mt-2 text-gray-600">Location: {issue.location}</p>
          <p className="text-gray-600">Reported by: {issue.reportedBy}</p>
          <p className="text-gray-600">Date: {issue.date}</p>
          <div className="mt-3 flex gap-2">
            <StatusBadge className={statusClasses[issue.priority === "Low" ? "LowPriority" : issue.priority]}>{issue.priority}</StatusBadge>
            <StatusBadge className={statusClasses[issue.status]}>{issue.status}</StatusBadge>
          </div>
        </div>
        <Field label="Update Status"><Select options={["Pending", "In Progress", "Completed"]} defaultValue={issue.status} /></Field>
        <ModalActions onClose={onClose} submitLabel="Save Update" onSubmit={() => { toast.success("Maintenance request updated"); onClose(); }} />
      </div>
    </ModalFrame>
  );
}

function ModalActions({ onClose, submitLabel, onSubmit }: { onClose: () => void; submitLabel: string; onSubmit: () => void }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" className="rounded-full" onClick={onClose}>Cancel</Button>
      <Button type="button" className="rounded-full bg-violet-600 text-white hover:bg-violet-700" onClick={onSubmit}>{submitLabel}</Button>
    </div>
  );
}
