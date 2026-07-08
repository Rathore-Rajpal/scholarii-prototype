import { createFileRoute } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Download, FileText, Printer, Search, Upload, X } from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/documents")({
  component: AdminDocumentsPage,
});

type Status = "Verified ✓" | "Active" | "Expiring" | "Pending" | "Issued" | "Awaiting Principal";

const documents = [
  ["Aarav Sharma — Aadhar Card", "Student", "10 Apr 2026", "Admin", "Verified ✓"],
  ["Aarav Sharma — Birth Certificate", "Student", "10 Apr 2026", "Admin", "Verified ✓"],
  ["Priya Sharma — Employee PAN", "Staff", "5 Mar 2026", "Admin", "Verified ✓"],
  ["School Recognition Certificate", "School", "1 Jan 2026", "Principal", "Active"],
  ["Fire NOC 2026", "Compliance", "15 Feb 2026", "Admin", "Expiring"],
  ["Rohan Patel — Transfer Certificate", "Student", "18 Apr 2026", "Admin", "Pending"],
  ["Kavita Soni — Police Verification", "Staff", "2 Feb 2026", "Admin", "Verified ✓"],
  ["Building Safety Certificate", "Compliance", "12 Jan 2026", "Admin", "Active"],
  ["UDISE Annual Return", "School", "30 Mar 2026", "Principal", "Verified ✓"],
  ["Meera Pillai — Report Card", "Student", "20 May 2026", "Admin", "Verified ✓"],
  ["Ramesh Kumar — Aadhar Card", "Staff", "9 Mar 2026", "Admin", "Verified ✓"],
  ["Water Safety Inspection", "Compliance", "8 Jun 2026", "Admin", "Pending"],
  ["Fee Structure 2026-27", "School", "1 Apr 2026", "Principal", "Active"],
  ["Ananya Iyer — Bonafide Copy", "Certificate", "11 Jun 2026", "Admin", "Issued"],
  ["Sanvi Kapoor — Photos", "Student", "14 Apr 2026", "Admin", "Verified ✓"],
  ["Transport Fitness Certificate", "Compliance", "26 May 2026", "Admin", "Expiring"],
  ["Deepak Patil — Qualification Certificates", "Staff", "5 Mar 2026", "Admin", "Verified ✓"],
  ["Annual Academic Calendar", "School", "1 Apr 2026", "Principal", "Active"],
  ["Ishaan Singh — Birth Certificate", "Student", "9 Apr 2026", "Admin", "Pending"],
  ["Municipal Correspondence REF-002", "Correspondence", "8 Jun 2026", "Admin", "Active"],
] as const;

const studentDocs = [
  ["Aarav Sharma", "1-A", "✅", "✅", "⏳", "✅", "✅"],
  ["Priya Mehta", "2-B", "✅", "✅", "✅", "✅", "✅"],
  ["Kabir Joshi", "3-A", "✅", "❌", "⏳", "✅", "✅"],
  ["Sneha Rao", "1-B", "✅", "✅", "✅", "❌", "✅"],
  ["Aryan Khan", "4-A", "✅", "✅", "✅", "✅", "⏳"],
  ["Meera Nair", "5-B", "✅", "✅", "✅", "✅", "✅"],
  ["Dev Sharma", "1-A", "❌", "✅", "⏳", "✅", "✅"],
  ["Kavya Iyer", "2-A", "✅", "✅", "✅", "✅", "❌"],
  ["Rohan Patel", "3-B", "✅", "⏳", "❌", "✅", "✅"],
  ["Riya Desai", "1-A", "✅", "✅", "✅", "⏳", "✅"],
] as const;

const staffDocs = [
  ["Priya Sharma", "Office Clerk", "✅", "✅", "✅", "✅", "✅"],
  ["Kavita Soni", "Peon", "✅", "✅", "⏳", "✅", "✅"],
  ["Ramesh Kumar", "Guard", "✅", "❌", "✅", "✅", "⏳"],
  ["Suresh Nair", "Bus Driver", "✅", "✅", "✅", "✅", "✅"],
  ["Deepak Patil", "Lab Assistant", "✅", "✅", "✅", "⏳", "✅"],
  ["Anita Joshi", "Librarian", "✅", "✅", "✅", "✅", "❌"],
  ["Vivaan Patel", "Mathematics Teacher", "✅", "✅", "✅", "✅", "✅"],
  ["Saanvi Gupta", "Physics Teacher", "✅", "✅", "⏳", "✅", "✅"],
] as const;

const issuedCertificates = [
  ["CERT-001", "Meera Pillai", "TC", "2026-06-10", "Admin", "Issued"],
  ["CERT-002", "Rohan Verma", "Bonafide", "2026-06-11", "Admin", "Issued"],
  ["CERT-003", "Ananya Iyer", "TC", "2026-06-09", "Admin", "Awaiting Principal"],
  ["CERT-004", "Kabir Joshi", "Character", "2026-06-08", "Admin", "Issued"],
  ["CERT-005", "Sneha Rao", "Bonafide", "2026-06-07", "Admin", "Issued"],
  ["CERT-006", "Aryan Khan", "Migration", "2026-06-05", "Admin", "Awaiting Principal"],
  ["CERT-007", "Kavya Iyer", "Sports", "2026-06-04", "Admin", "Issued"],
  ["CERT-008", "Dev Sharma", "Library Clearance", "2026-06-03", "Admin", "Issued"],
  ["CERT-009", "Riya Desai", "Bonafide", "2026-06-02", "Admin", "Issued"],
  ["CERT-010", "Ishaan Singh", "TC", "2026-06-01", "Admin", "Awaiting Principal"],
] as const;

const pendingCertificates = [
  ["Meera Soni", "Grade 5-B", "Transfer Certificate", "Parent request"],
  ["Rohan Verma", "Grade 3-A", "Bonafide", "Scholarship submission"],
  ["Ananya Iyer", "Grade 4-C", "TC", "Inter-school transfer"],
  ["Dev Malhotra", "Grade 7-A", "Character Certificate", "Competition entry"],
  ["Sara Thomas", "Grade 8-B", "Bonafide", "Bank account"],
  ["Neil D'Souza", "Grade 9-A", "Migration", "Board registration"],
  ["Kavya Nair", "Grade 3-C", "Sports Certificate", "District sports office"],
] as const;

const correspondence = [
  ["2026-06-12", "Received", "Maharashtra Education Dept", "Annual Return", "REF-001"],
  ["2026-06-10", "Sent", "All Parents", "Summer Holiday Notice", "CIR-045"],
  ["2026-06-08", "Received", "Municipal Corp", "Water Safety Inspection", "REF-002"],
  ["2026-06-06", "Sent", "Education Officer", "UDISE Confirmation", "OUT-018"],
  ["2026-06-04", "Received", "Fire Department", "NOC Renewal Reminder", "REF-003"],
  ["2026-06-01", "Sent", "All Staff", "Document Verification Drive", "CIR-044"],
  ["2026-05-29", "Received", "Transport Office", "Vehicle Fitness Notice", "REF-004"],
  ["2026-05-25", "Sent", "PTA Members", "Meeting Minutes", "OUT-017"],
  ["2026-05-22", "Received", "Health Dept", "Medical Camp Approval", "REF-005"],
  ["2026-05-20", "Sent", "Vendors", "Quotation Request", "OUT-016"],
] as const;

function AdminDocumentsPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");

  const filteredDocuments = useMemo(() => {
    const term = query.trim().toLowerCase();
    return documents.filter(([name, docCategory, , , docStatus]) => {
      if (term && !name.toLowerCase().includes(term)) return false;
      if (category !== "all" && docCategory !== category) return false;
      if (status !== "all" && docStatus !== status) return false;
      return true;
    });
  }, [category, query, status]);

  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Document Management"
        subtitle="School records, student documents, certificates, and official correspondence"
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-violet-600 text-white hover:bg-violet-700"
              onClick={() => setUploadOpen(true)}
            >
              📤 Upload Document
            </Button>
            <Button className="hidden md:inline-flex" variant="ghost" onClick={() => toast.success("Document sent to printer")}>
              🖨️ Print
            </Button>
            <Button className="hidden md:inline-flex" variant="ghost" onClick={() => toast.success("Document index exported")}>
              📥 Export Index
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label="Total Documents" value="1,284" hint="All categories" />
        <Kpi label="Student Documents" value="856" hint="Admission + records" />
        <Kpi label="Staff Documents" value="124" hint="Employee records" />
        <Kpi label="Pending Verification" value="18" hint="Needs review" tone="amber" />
        <Kpi label="Expiring Soon" value="4" hint="Within 30 days" tone="red" />
      </div>

      <Card className="mt-6 overflow-hidden border-gray-100 bg-white shadow-sm">
        <Tabs defaultValue="all">
          <div className="border-b border-gray-100 px-5 pt-5">
            <TabsList className="flex h-auto overflow-x-auto rounded-none bg-transparent p-0 scrollbar-hide">
              <DocTab value="all">📁 All Documents</DocTab>
              <DocTab value="students">👥 Student Docs</DocTab>
              <DocTab value="staff">👨‍🏫 Staff Docs</DocTab>
              <DocTab value="certificates">📜 Certificates</DocTab>
              <DocTab value="correspondence">📮 Correspondence</DocTab>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0 p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="relative min-w-64 flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search document name"
                  className="pl-9"
                />
              </div>
              <Filter value={category} onChange={setCategory} label="Category">
                {["Student", "Staff", "School", "Compliance", "Certificate", "Correspondence"].map(
                  (item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ),
                )}
              </Filter>
              <Filter value={status} onChange={setStatus} label="Status">
                {["Verified ✓", "Active", "Expiring", "Pending", "Issued"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </Filter>
              <Input
                type="date"
                value={dateRange}
                onChange={(event) => setDateRange(event.target.value)}
                className="w-44"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setStatus("all");
                  setDateRange("");
                }}
              >
                Clear
              </Button>
            </div>
            <DocumentList rows={filteredDocuments} />
          </TabsContent>

          <TabsContent value="students" className="m-0 p-5">
            <div className="mb-4 flex justify-end">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["All Classes", "1-A", "1-B", "2-A", "2-B", "3-A", "3-B", "4-A", "5-B"].map(
                    (item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <TrackerTable
              headers={[
                "Student",
                "Class",
                "Aadhar",
                "Birth Cert",
                "TC",
                "Photos",
                "Report Card",
                "Action",
              ]}
              rows={studentDocs}
            />
          </TabsContent>

          <TabsContent value="staff" className="m-0 p-5">
            <TrackerTable
              headers={[
                "Staff Member",
                "Designation",
                "Aadhar",
                "PAN",
                "Qualifications",
                "Experience",
                "Police Verification",
                "Action",
              ]}
              rows={staffDocs}
            />
          </TabsContent>

          <TabsContent value="certificates" className="m-0 p-5">
            <Tabs defaultValue="issued">
              <TabsList className="flex overflow-x-auto scrollbar-hide">
                <TabsTrigger value="issued">Issued</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              <TabsContent value="issued" className="mt-4">
                <SimpleTable
                  headers={[
                    "Certificate No",
                    "Student",
                    "Type",
                    "Issue Date",
                    "Issued By",
                    "Status",
                  ]}
                  rows={issuedCertificates}
                />
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        {["Student", "Class", "Type", "Reason", "Action"].map((header) => (
                          <TableHead
                            key={header}
                            className={header === "Action" ? "text-right" : ""}
                          >
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingCertificates.map((row) => (
                        <TableRow key={`${row[0]}-${row[2]}`}>
                          {row.map((cell) => (
                            <TableCell key={`${row[0]}-${cell}`}>{cell}</TableCell>
                          ))}
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              className="bg-violet-600 text-white hover:bg-violet-700"
                              onClick={() => setCertificateOpen(true)}
                            >
                              Generate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="templates" className="mt-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    "Transfer Certificate",
                    "Bonafide Certificate",
                    "Character Certificate",
                    "Migration Certificate",
                    "Sports Certificate",
                    "Fee Clearance",
                  ].map((item) => (
                    <Card key={item} className="border-gray-100 p-4 shadow-sm">
                      <FileText className="size-5 text-violet-600" />
                      <p className="mt-3 font-semibold">{item}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => toast.info(`${item} template opened`)}
                      >
                        View Template
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="correspondence" className="m-0 p-5">
            <div className="mb-4 flex justify-end">
              <Button
                className="bg-violet-600 text-white hover:bg-violet-700"
                onClick={() => toast.success("New correspondence logged")}
              >
                + Log New Correspondence
              </Button>
            </div>
            <SimpleTable
              headers={["Date", "Type", "From/To", "Subject", "Reference No", "Action"]}
              rows={correspondence.map((row) => [...row, "View"])}
              action
            />
          </TabsContent>
        </Tabs>
      </Card>

      {uploadOpen && <UploadDocumentModal onClose={() => setUploadOpen(false)} />}
      {certificateOpen && <CertificateModal onClose={() => setCertificateOpen(false)} />}
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone = "gray",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "gray" | "amber" | "red";
}) {
  const dot = tone === "amber" ? "bg-amber-500" : tone === "red" ? "bg-red-500" : "bg-gray-400";
  return (
    <Card className="border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs text-gray-500">{hint}</p>
        </div>
        <span className={cn("mt-1 size-2.5 rounded-full", dot)} />
      </div>
    </Card>
  );
}

function DocTab({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="min-w-fit whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2.5 text-xs shadow-none data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-violet-600 data-[state=active]:shadow-none lg:px-5 lg:py-3 lg:text-sm"
    >
      {children}
    </TabsTrigger>
  );
}

function Filter({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}</SelectItem>
        {children}
      </SelectContent>
    </Select>
  );
}

function DocumentList({ rows }: { rows: readonly (readonly string[])[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <div className="divide-y divide-gray-100">
        {rows.map(([name, category, date, uploadedBy, status]) => (
          <div
            key={name}
            className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(220px,2fr)_1fr_1fr_1fr_1fr_1.4fr] md:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-violet-50 text-violet-600">
                <FileText className="size-5" />
              </div>
              <p className="font-medium text-gray-900">{name}</p>
            </div>
            <Badge>{category}</Badge>
            <span className="text-sm text-gray-500">{date}</span>
            <span className="text-sm text-gray-500">{uploadedBy}</span>
            <StatusBadge status={status as Status} />
            <div className="flex flex-wrap justify-end gap-2">
              <ActionButton label="View" />
              <IconButton icon={Download} label="Download" />
              <IconButton icon={Printer} label="Print" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackerTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: readonly (readonly string[])[];
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-gray-100 lg:block">
        <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className={header === "Action" ? "text-right" : ""}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const incomplete = row.some((cell) => cell === "❌" || cell === "⏳");
            return (
              <TableRow key={`${row[0]}-${row[1]}`}>
                {row.map((cell) => (
                  <TableCell key={`${row[0]}-${cell}`}>{cell}</TableCell>
                ))}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info(`Upload selected for ${row[0]}`)}
                    >
                      Upload
                    </Button>
                    {incomplete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-violet-600"
                        onClick={() => toast.success("Reminder sent")}
                      >
                        Send Reminder
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </div>
      <div className="space-y-3 lg:hidden">
        {rows.map((row) => {
          const incomplete = row.some((cell) => cell === "âŒ" || cell === "â³");
          const docHeaders = headers.slice(2, 6);
          const docCells = row.slice(2, 6);
          return (
            <div key={`${row[0]}-${row[1]}`} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{row[0]}</div>
                  <div className="text-xs text-gray-500">{row[1]}</div>
                </div>
                <StatusBadge status={incomplete ? "Pending" : "Verified âœ“"} />
              </div>
              <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                {docCells.map((cell, index) => (
                  <div key={`${row[0]}-${docHeaders[index]}`} className="rounded-lg bg-gray-50 p-2">
                    <div className="text-gray-400">{docHeaders[index]}</div>
                    <div className="mt-1 font-medium text-gray-900">{cell}</div>
                  </div>
                ))}
              </div>
              <Button className="w-full border-violet-200 text-violet-600" variant="outline" onClick={() => toast.info(`Upload selected for ${row[0]}`)}>
                Upload
              </Button>
              {incomplete && (
                <Button className="mt-2 w-full text-violet-600" variant="ghost" onClick={() => toast.success("Reminder sent")}>
                  Send Reminder
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function SimpleTable({
  headers,
  rows,
  action = false,
}: {
  headers: string[];
  rows: readonly (readonly string[])[];
  action?: boolean;
}) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-gray-100 lg:block">
        <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className={header === "Action" ? "text-right" : ""}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => (
                <TableCell key={`${row[0]}-${cell}`}>
                  {action && cellIndex === row.length - 1 ? (
                    <ActionButton label={cell} />
                  ) : cellIndex === row.length - 1 && headers[cellIndex] === "Status" ? (
                    <StatusBadge status={cell as Status} />
                  ) : (
                    cell
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
      <div className="space-y-3 lg:hidden">
        {rows.map((row, index) => (
          <div key={`${row[0]}-${index}`} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{row[1] ?? row[0]}</div>
                <div className="text-xs text-gray-500">{row[0]}</div>
              </div>
              {headers.includes("Status") && <StatusBadge status={row[headers.indexOf("Status")] as Status} />}
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
              {row.slice(0, action ? -1 : row.length).map((cell, cellIndex) => (
                <div key={`${row[0]}-${cell}-${cellIndex}`}>
                  <div className="text-gray-400">{headers[cellIndex] ?? "Field"}</div>
                  <div className="font-medium text-gray-900">{cell}</div>
                </div>
              ))}
            </div>
            {action && (
              <Button className="w-full border-violet-200 text-violet-600" variant="outline" onClick={() => toast.info(`${row[row.length - 1]} opened`)}>
                {row[row.length - 1]}
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="w-fit rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: Status | string }) {
  const style =
    status === "Expiring"
      ? "bg-red-50 text-red-700"
      : status === "Pending" || status === "Awaiting Principal"
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";
  return (
    <span className={cn("w-fit rounded-full px-2.5 py-1 text-xs font-medium", style)}>
      {status}
    </span>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-violet-600"
      onClick={() => toast.info(`${label} opened`)}
    >
      {label}
    </Button>
  );
}

function IconButton({ icon: Icon, label }: { icon: typeof Download; label: string }) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="px-2 text-gray-600"
      onClick={() => toast.success(`${label} ready`)}
    >
      <Icon className="size-4" />
    </Button>
  );
}

function UploadDocumentModal({ onClose }: { onClose: () => void }) {
  const [relatedTo, setRelatedTo] = useState("N/A");
  const [type, setType] = useState("Student Doc");
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Document uploaded");
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-0 lg:items-center lg:p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl lg:max-h-[85vh] lg:max-w-xl lg:rounded-2xl lg:p-6" onSubmit={submit}>
        <div className="mb-2 flex justify-center lg:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <Field label="Document Type">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Student Doc",
                  "Staff Doc",
                  "School Doc",
                  "Certificate",
                  "Compliance",
                  "Other",
                ].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Related To">
            <Select value={relatedTo} onValueChange={setRelatedTo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Student", "Staff", "School", "N/A"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {(relatedTo === "Student" || relatedTo === "Staff") && (
            <Field label="Name/ID">
              <Input />
            </Field>
          )}
          <Field label="Document Name *">
            <Input required />
          </Field>
          <Field label="Category">
            <Select defaultValue={type === "Compliance" ? "NOC" : "Identity"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Identity",
                  "Admission",
                  "Employment",
                  "Certificate",
                  "NOC",
                  "Inspection",
                  "Correspondence",
                  "Other",
                ].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="File Upload *">
            <Input required type="file" />
          </Field>
          <Field label="Remarks">
            <textarea className="min-h-24 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 lg:text-sm" />
          </Field>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button className="w-full" type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="w-full bg-violet-600 text-white hover:bg-violet-700">
            Upload
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

function CertificateModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 p-0 lg:items-center lg:p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl lg:max-h-[85vh] lg:max-w-md lg:rounded-2xl lg:p-6">
        <div className="mb-2 flex justify-center lg:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Generate Certificate</h2>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="mt-5 space-y-4">
          <Field label="Certificate Type">
            <Input defaultValue="Bonafide Certificate" />
          </Field>
          <Field label="Student Name">
            <Input defaultValue="Rohan Verma" />
          </Field>
          <Field label="Remarks">
            <Input placeholder="Optional note" />
          </Field>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button className="w-full" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="w-full bg-violet-600 text-white hover:bg-violet-700"
            onClick={() => {
              toast.success("Certificate generated for principal review");
              onClose();
            }}
          >
            Generate
          </Button>
        </div>
      </div>
    </div>,
    document.body,
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
