import { createFileRoute } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarCheck,
  Download,
  FileCheck2,
  FileText,
  Search,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

export const Route = createFileRoute("/app/admin/staff")({
  component: AdminStaffPage,
});

type StaffStatus = "Active" | "On Leave" | "Absent";
type AttendanceStatus = "Present" | "Absent" | "Leave" | "Half-day";
type StaffRecord = {
  name: string;
  designation: string;
  employeeId: string;
  department: string;
  role: string;
  contact: string;
  status: StaffStatus;
  avatarColor: string;
  email: string;
  joiningDate: string;
  qualification: string;
  address: string;
  emergencyContact: string;
  contractExpiry: string;
  salaryBand: string;
};

const staff: StaffRecord[] = [
  ["Vivaan Patel", "Mathematics Teacher", "EMP-2100", "Mathematics", "Teaching", "9812345671", "Active"],
  ["Vihaan Gupta", "English Teacher", "EMP-2101", "Languages", "Teaching", "9823456712", "Active"],
  ["Reyansh Iyer", "Science Teacher", "EMP-2102", "Science", "Teaching", "9834567123", "Active"],
  ["Krishna Nair", "Social Studies", "EMP-2103", "Social Studies", "Teaching", "9845671234", "Active"],
  ["Shaurya Kapoor", "Hindi Teacher", "EMP-2104", "Languages", "Teaching", "9856712345", "Active"],
  ["Diya Patel", "Computer Teacher", "EMP-2105", "Science", "Teaching", "9867123456", "Active"],
  ["Saanvi Gupta", "Physics Teacher", "EMP-2106", "Science", "Teaching", "9812346789", "On Leave"],
  ["Pari Iyer", "Chemistry Teacher", "EMP-2107", "Science", "Teaching", "9823457891", "Active"],
  ["Myra Nair", "Biology Teacher", "EMP-2108", "Languages", "Teaching", "9834568912", "Active"],
  ["Iraa Kapoor", "History Teacher", "EMP-2109", "Social Studies", "Teaching", "9845679123", "Active"],
  ["Priya Sharma", "Office Clerk", "EMP-2110", "Administration", "Admin Staff", "9856790234", "Active"],
  ["Kavita Soni", "Peon", "EMP-2111", "Support", "Support Staff", "9867901345", "Active"],
  ["Ramesh Kumar", "Guard", "EMP-2112", "Support", "Security", "9812347890", "Active"],
  ["Suresh Nair", "Bus Driver", "EMP-2113", "Transport", "Driver", "9823458901", "Active"],
  ["Vijay Singh", "Bus Driver", "EMP-2114", "Transport", "Driver", "9834569012", "Active"],
  ["Deepak Patil", "Lab Assistant", "EMP-2115", "Science", "Lab Staff", "9845670123", "Active"],
  ["Anita Joshi", "Librarian", "EMP-2116", "Library", "Library Staff", "9856781234", "Active"],
  ["Santosh More", "Cook", "EMP-2117", "Support", "Support Staff", "9867892345", "Absent"],
].map(([name, designation, employeeId, department, role, contact, status], index) => ({
  name,
  designation,
  employeeId,
  department,
  role,
  contact,
  status: status as StaffStatus,
  avatarColor: ["#7c3aed", "#0891b2", "#059669", "#ea580c", "#db2777", "#2563eb"][index % 6],
  email: `${name.toLowerCase().replace(/\s+/g, ".")}@scholarii.edu`,
  joiningDate: `${String(10 + (index % 18)).padStart(2, "0")} June ${2014 + (index % 9)}`,
  qualification: role === "Teaching" ? "B.Ed, subject specialization" : "School service certification",
  address: `${12 + index}, College Road, Nashik, Maharashtra 422005`,
  emergencyContact: `+91 ${contact.slice(0, 5)} ${contact.slice(5)}`,
  contractExpiry: index === 17 ? "12 July 2026" : `${15 + (index % 10)} March 2027`,
  salaryBand: role === "Teaching" ? "Rs 32,000 - Rs 48,000" : "Rs 18,000 - Rs 30,000",
}));

const leaveRequests = [
  { name: "Saanvi Gupta", days: "3 days", type: "Medical", range: "2026-06-15 to 2026-06-17", status: "Pending" },
  { name: "Reyansh Iyer", days: "1 day", type: "Personal", range: "2026-06-20", status: "Pending" },
  { name: "Kavita Soni", days: "2 days", type: "Family", range: "2026-06-22 to 2026-06-23", status: "Pending" },
];

const documentRows = staff.map((member, index) => ({
  name: member.name,
  type: ["Aadhar Card", "PAN Card", "Qualification Certificates", "Police Verification", "Medical Fitness", "Employment Contract"][index % 6],
  uploaded: index % 5 === 0 ? "Pending" : "Uploaded",
  verified: index % 4 === 0 ? "Pending" : "Verified",
  expiry: index === 17 ? "12 Jul 2026" : index % 3 === 0 ? "31 Mar 2027" : "Not applicable",
}));

function AdminStaffPage() {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffRecord | null>(null);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(staff.map((member) => [member.employeeId, member.status === "On Leave" ? "Leave" : member.status === "Absent" ? "Absent" : "Present"])),
  );

  const departments = useMemo(() => Array.from(new Set(staff.map((member) => member.department))), []);
  const roles = useMemo(() => Array.from(new Set(staff.map((member) => member.role))), []);

  const filteredStaff = useMemo(() => {
    const term = query.trim().toLowerCase();
    return staff.filter((member) => {
      if (term && !`${member.name} ${member.employeeId} ${member.designation}`.toLowerCase().includes(term)) return false;
      if (department !== "all" && member.department !== department) return false;
      if (role !== "all" && member.role !== role) return false;
      if (status !== "all" && member.status !== status) return false;
      return true;
    });
  }, [department, query, role, status]);

  const clearFilters = () => {
    setQuery("");
    setDepartment("all");
    setRole("all");
    setStatus("all");
  };

  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader
        title="Staff Records & Directory"
        subtitle="Manage employee information, attendance, and leave records"
        action={
          <div className="flex flex-wrap gap-2">
            <Button className="bg-violet-600 text-white hover:bg-violet-700" onClick={() => toast.info("Add staff form opened")}>
              <UserPlus className="mr-2 size-4" />
              Add Staff
            </Button>
            <Button className="hidden md:inline-flex" variant="ghost" onClick={() => toast.info("Attendance marking is available below")}>
              <CalendarCheck className="mr-2 size-4" />
              Mark Attendance
            </Button>
            <Button className="hidden md:inline-flex" variant="ghost" onClick={() => toast.success("Staff data exported")}>
              <Download className="mr-2 size-4" />
              Export Data
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <KpiTile label="Total Staff" value="28" hint="18 Teachers • 10 Support" icon={Users} />
        <KpiTile label="Present Today" value="24" hint="85%" icon={UserCheck} tone="green" />
        <KpiTile label="On Leave" value="2" hint="Approved leave" icon={CalendarCheck} tone="amber" />
        <KpiTile label="Absent Unmarked" value="2" hint="Action needed" icon={UserX} tone="red" />
        <KpiTile label="Leave Requests" value="3" hint="Pending approval" icon={FileText} tone="blue" />
        <KpiTile label="Contract Expiring" value="1" hint="Within 30 days" icon={FileCheck2} tone="orange" />
      </div>

      <Card className="mt-6 overflow-hidden border-gray-100 bg-white shadow-sm">
        <Tabs defaultValue="directory">
          <div className="border-b border-gray-100 px-5 pt-5">
            <TabsList className="flex h-auto overflow-x-auto rounded-none bg-transparent p-0 scrollbar-hide">
              <DirectoryTab value="directory">👥 Staff Directory</DirectoryTab>
              <DirectoryTab value="attendance">📅 Attendance & Leave</DirectoryTab>
              <DirectoryTab value="documents">📋 Records & Documents</DirectoryTab>
            </TabsList>
          </div>

          <TabsContent value="directory" className="m-0 p-5">
            <Filters
              query={query}
              setQuery={setQuery}
              department={department}
              setDepartment={setDepartment}
              role={role}
              setRole={setRole}
              status={status}
              setStatus={setStatus}
              departments={departments}
              roles={roles}
              clear={clearFilters}
            />
            <StaffDirectoryTable staff={filteredStaff} onView={setSelectedStaff} />
          </TabsContent>

          <TabsContent value="attendance" className="m-0 p-5">
            <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[60fr_40fr]">
              <section className="rounded-xl border border-gray-100 bg-white p-4">
                <SectionHeading title="Today's Attendance" subtitle="Mark attendance for all staff members." />
                <div className="mt-4 hidden overflow-hidden rounded-xl border border-gray-100 lg:block">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((member) => (
                        <TableRow key={member.employeeId}>
                          <TableCell>
                            <StaffIdentity member={member} />
                          </TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5">
                              {(["Present", "Absent", "Leave", "Half-day"] as AttendanceStatus[]).map((option) => (
                                <Button
                                  key={option}
                                  size="sm"
                                  variant={attendance[member.employeeId] === option ? "secondary" : "ghost"}
                                  className={cn("h-8 rounded-full px-3", attendance[member.employeeId] === option && "bg-violet-100 text-violet-700 hover:bg-violet-100")}
                                  onClick={() => setAttendance((current) => ({ ...current, [member.employeeId]: option }))}
                                >
                                  {option}
                                </Button>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 space-y-3 lg:hidden">
                  {staff.map((member) => (
                    <div key={member.employeeId} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <StaffIdentity member={member} />
                        <StatusBadge status={attendance[member.employeeId]} />
                      </div>
                      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                        <Info label="Employee ID" value={member.employeeId} />
                        <Info label="Role" value={member.role} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(["Present", "Absent", "Leave", "Half-day"] as AttendanceStatus[]).map((option) => (
                          <Button
                            key={option}
                            size="sm"
                            variant={attendance[member.employeeId] === option ? "secondary" : "outline"}
                            className={cn("h-9 rounded-lg px-3 text-xs", attendance[member.employeeId] === option && "bg-violet-100 text-violet-700 hover:bg-violet-100")}
                            onClick={() => setAttendance((current) => ({ ...current, [member.employeeId]: option }))}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button className="bg-violet-600 text-white hover:bg-violet-700" onClick={() => toast.success("Attendance saved")}>
                    Save All Attendance
                  </Button>
                </div>
              </section>

              <section className="rounded-xl border border-gray-100 bg-white p-4">
                <SectionHeading title="Leave Requests" subtitle="Clerk forwards requests to principal for approval." />
                <div className="mt-4 space-y-3">
                  {leaveRequests.map((request) => (
                    <div key={`${request.name}-${request.range}`} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{request.name}</p>
                          <p className="mt-1 text-sm text-gray-500">{request.days} • {request.type}</p>
                          <p className="text-sm text-gray-500">{request.range}</p>
                        </div>
                        <StatusBadge status={request.status} />
                      </div>
                      <Button
                        variant="outline"
                        className="mt-4 border-violet-200 text-violet-600 hover:bg-violet-50 hover:text-violet-700"
                        onClick={() => toast.success(`${request.name}'s leave request forwarded to principal`)}
                      >
                        Forward to Principal
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-xl bg-violet-50 p-3 text-sm text-violet-700">
                  Clerk cannot approve leave requests. Requests must be forwarded to the principal.
                </p>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="m-0 p-5">
            <section className="rounded-xl border border-gray-100 bg-white p-4">
              <SectionHeading title="Staff Documents" subtitle="Upload records and track principal-only verification." />
              <div className="mt-4 hidden overflow-hidden rounded-xl border border-gray-100 lg:block">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentRows.map((row) => (
                      <TableRow key={`${row.name}-${row.type}`}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell><StatusBadge status={row.uploaded} /></TableCell>
                        <TableCell><StatusBadge status={row.verified} /></TableCell>
                        <TableCell>{row.expiry}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => toast.info(`Upload selected for ${row.name}`)}>
                              <Upload className="mr-1.5 size-4" />
                              Upload
                            </Button>
                            <Button size="sm" variant="outline" disabled title="Principal only">
                              Verify
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 space-y-3 lg:hidden">
                {documentRows.map((row) => (
                  <div key={`${row.name}-${row.type}`} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{row.name}</div>
                        <div className="text-xs text-gray-500">{row.type}</div>
                      </div>
                      <StatusBadge status={row.verified} />
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                      <Info label="Uploaded" value={row.uploaded} />
                      <Info label="Verified" value={row.verified} />
                      <Info label="Expiry" value={row.expiry} />
                      <Info label="Access" value="Principal only" />
                    </div>
                    <Button className="w-full border-violet-200 text-violet-600" variant="outline" onClick={() => toast.info(`Upload selected for ${row.name}`)}>
                      <Upload className="mr-1.5 size-4" />
                      Upload
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </Card>

      {selectedStaff && <StaffDetailModal member={selectedStaff} onClose={() => setSelectedStaff(null)} />}
    </div>
  );
}

function KpiTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = "gray",
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone?: "gray" | "green" | "amber" | "red" | "blue" | "orange";
}) {
  const tones = {
    gray: "bg-gray-50 text-gray-500",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <Card className="border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className={cn("mt-1 text-xs", tone === "gray" ? "text-gray-500" : tones[tone].split(" ")[1])}>{hint}</p>
        </div>
        <div className={cn("grid size-9 place-items-center rounded-lg", tones[tone])}>
          <Icon className="size-4" />
        </div>
      </div>
    </Card>
  );
}

function DirectoryTab({ value, children }: { value: string; children: ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="min-w-fit whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-2.5 text-xs shadow-none data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-violet-600 data-[state=active]:shadow-none lg:px-5 lg:py-3 lg:text-sm"
    >
      {children}
    </TabsTrigger>
  );
}

function Filters({
  query,
  setQuery,
  department,
  setDepartment,
  role,
  setRole,
  status,
  setStatus,
  departments,
  roles,
  clear,
}: {
  query: string;
  setQuery: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  departments: string[];
  roles: string[];
  clear: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative min-w-56 flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name/ID" className="pl-9" />
      </div>
      <FilterSelect value={department} onChange={setDepartment} label="All departments">
        {departments.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
      </FilterSelect>
      <FilterSelect value={role} onChange={setRole} label="All roles">
        {roles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
      </FilterSelect>
      <FilterSelect value={status} onChange={setStatus} label="All status">
        {["Active", "On Leave", "Absent"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
      </FilterSelect>
      <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
    </div>
  );
}

function FilterSelect({ value, onChange, label, children }: { value: string; onChange: (value: string) => void; label: string; children: ReactNode }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{label}</SelectItem>
        {children}
      </SelectContent>
    </Select>
  );
}

function StaffDirectoryTable({ staff: rows, onView }: { staff: StaffRecord[]; onView: (member: StaffRecord) => void }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-gray-100 lg:block">
        <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Employee ID</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((member) => (
            <TableRow key={member.employeeId}>
              <TableCell><StaffIdentity member={member} /></TableCell>
              <TableCell className="font-medium">{member.employeeId}</TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.contact}</TableCell>
              <TableCell><StatusBadge status={member.status} /></TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost" className="text-violet-600" onClick={() => onView(member)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
      <div className="space-y-3 lg:hidden">
        {rows.map((member) => (
          <div key={member.employeeId} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <StaffIdentity member={member} />
              <StatusBadge status={member.status} />
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
              <Info label="Employee ID" value={member.employeeId} />
              <Info label="Department" value={member.department} />
              <Info label="Role" value={member.role} />
              <Info label="Contact" value={member.contact} />
            </div>
            <Button className="w-full border-violet-200 text-violet-600" variant="outline" onClick={() => onView(member)}>
              View Details
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}

function StaffIdentity({ member }: { member: StaffRecord }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarFallback style={{ backgroundColor: member.avatarColor, color: "white" }}>
          {initials(member.name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-gray-900">{member.name}</p>
        <p className="text-xs text-gray-500">{member.designation}</p>
      </div>
    </div>
  );
}

function StaffDetailModal({ member, onClose }: { member: StaffRecord; onClose: () => void }) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 p-0 lg:items-center lg:p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative max-h-[90vh] w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl lg:max-h-[85vh] lg:max-w-[860px] lg:rounded-2xl">
        <div className="flex justify-center pb-1 pt-3 lg:hidden">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback style={{ backgroundColor: member.avatarColor, color: "white" }}>{initials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{member.name} — Staff Record</h2>
              <p className="text-sm text-gray-500">{member.employeeId} | {member.designation}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close staff record">
            <X className="size-5" />
          </button>
        </div>

        <Tabs defaultValue="personal">
          <div className="border-b border-gray-100 px-4 pt-3 lg:px-6">
            <TabsList className="flex h-auto overflow-x-auto bg-gray-50 scrollbar-hide">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="leave">Leave</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
          </div>
          <div className="max-h-[72vh] overflow-y-auto p-4 lg:p-6">
            <TabsContent value="personal" className="mt-0">
              <DetailPanel editLabel="Edit Personal Info">
                <Info label="Full Name" value={member.name} />
                <Info label="Employee ID" value={member.employeeId} />
                <Info label="Phone" value={`+91 ${member.contact}`} />
                <Info label="Email" value={member.email} />
                <Info label="Address" value={member.address} wide />
                <Info label="Emergency Contact" value={member.emergencyContact} />
                <Info label="Aadhar" value="XXXX XXXX 2841" />
                <Info label="Blood Group" value="B+" />
              </DetailPanel>
            </TabsContent>
            <TabsContent value="employment" className="mt-0">
              <DetailPanel editLabel="Edit Employment">
                <Info label="Designation" value={member.designation} />
                <Info label="Department" value={member.department} />
                <Info label="Role" value={member.role} />
                <Info label="Joining Date" value={member.joiningDate} />
                <Info label="Qualification" value={member.qualification} />
                <Info label="Contract Expiry" value={member.contractExpiry} />
                <Info label="Salary Band" value={member.salaryBand} />
                <Info label="Reporting To" value={member.role === "Teaching" ? "Principal" : "Admin Office"} />
              </DetailPanel>
            </TabsContent>
            <TabsContent value="attendance" className="mt-0">
              <DetailPanel editLabel="Edit Attendance">
                <MiniStat label="Present Days" value="146" />
                <MiniStat label="Absent Days" value={member.status === "Absent" ? "4" : "2"} />
                <MiniStat label="Leave Days" value={member.status === "On Leave" ? "7" : "5"} />
                <MiniStat label="Attendance %" value={member.status === "Absent" ? "82%" : "94%"} />
                <div className="sm:col-span-2">
                  <CompactTable headers={["Date", "Status", "Marked By"]} rows={[["15 Jun 2026", member.status === "On Leave" ? "Leave" : member.status === "Absent" ? "Absent" : "Present", "Admin Office"], ["14 Jun 2026", "Present", "Admin Office"], ["13 Jun 2026", "Present", "Admin Office"]]} />
                </div>
              </DetailPanel>
            </TabsContent>
            <TabsContent value="leave" className="mt-0">
              <DetailPanel editLabel="Edit Leave Record">
                <MiniStat label="Leave Balance" value="8 days" />
                <MiniStat label="Approved Leave" value="5 days" />
                <MiniStat label="Pending Requests" value={leaveRequests.some((request) => request.name === member.name) ? "1" : "0"} />
                <MiniStat label="Last Leave" value="12 May 2026" />
                <Info label="Current Request" value={leaveRequests.find((request) => request.name === member.name)?.range ?? "No pending request"} wide />
              </DetailPanel>
            </TabsContent>
            <TabsContent value="documents" className="mt-0">
              <DetailPanel editLabel="Edit Documents">
                {["Aadhar Card", "PAN Card", "Qualification Certificates", "Employment Contract", "Police Verification", "Medical Fitness"].map((doc, index) => (
                  <div key={doc} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
                    <div>
                      <p className="font-medium text-gray-900">{doc}</p>
                      <p className="text-xs text-gray-500">{index % 4 === 0 ? "Pending verification" : "Uploaded and filed"}</p>
                    </div>
                    <StatusBadge status={index % 4 === 0 ? "Pending" : "Verified"} />
                  </div>
                ))}
              </DetailPanel>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>,
    document.body,
  );
}

function DetailPanel({ children, editLabel }: { children: ReactNode; editLabel: string }) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
      <div className="mt-6 flex justify-end">
        <Button className="bg-violet-600 text-white hover:bg-violet-700" onClick={() => toast.info(`${editLabel} opened`)}>
          {editLabel.replace(/^Edit /, "Edit")}
        </Button>
      </div>
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function Info({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function CompactTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-gray-100 lg:block">
        <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>{headers.map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => <TableCell key={`${cell}-${cellIndex}`}>{cell}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
      <div className="space-y-3 lg:hidden">
        {rows.map((row, rowIndex) => (
          <div key={`${row[0]}-${rowIndex}`} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {row.map((cell, cellIndex) => <Info key={`${cell}-${cellIndex}`} label={headers[cellIndex] ?? "Field"} value={cell} />)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "Active" || status === "Present" || status === "Verified" || status === "Uploaded"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Absent"
        ? "bg-red-50 text-red-700"
        : status === "On Leave" || status === "Pending" || status === "Leave"
          ? "bg-amber-50 text-amber-700"
          : "bg-gray-100 text-gray-600";
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", className)}>{status}</span>;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}
