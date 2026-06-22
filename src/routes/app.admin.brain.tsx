import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Activity, BookOpen, Clock3, Database, Edit3, FileText, GraduationCap, RefreshCw, Search, Upload, UserRound, Users } from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/app/admin/brain")({ component: AdminSchoolBrainPage });

type KnowledgeField = { key: string; label: string; value: string };
type StaffRecord = { name: string; role: string; department: string; contact: string; subjects: string };
type StudentRecord = { name: string; grade: string; roll: string; attendance: string; feeStatus: string; parent: string };

const initialSchoolKnowledge: KnowledgeField[] = [
  { key: "school_name", label: "School Name", value: "Scholarii Modern School" },
  { key: "school_vision", label: "School Vision", value: "To build confident learners through academic excellence, values, and practical curiosity." },
  { key: "school_policies", label: "School Policies", value: "Attendance, conduct, parent communication, fee collection, document verification, and safety policies." },
  { key: "school_rules", label: "School Rules", value: "Be respectful, be punctual, wear the correct uniform, keep campus clean, and follow classroom guidelines." },
  { key: "school_timings", label: "School Timings", value: "7:30 AM - 2:00 PM" },
  { key: "academic_structure", label: "Academic Structure", value: "Primary, Secondary, and Senior Secondary sections with grade-wise subject allocation." },
  { key: "house_system", label: "House System", value: "Four houses with weekly points, inter-house events, and student leadership responsibilities." },
  { key: "important_contacts", label: "Important Contacts", value: "Principal office, reception, accounts desk, transport desk, and parent relations desk." },
  { key: "school_facilities", label: "School Facilities", value: "Library, science labs, computer labs, sports ground, auditorium, activity hall, and transport support." },
];

const staffRecords: StaffRecord[] = [
  { name: "Anita Sharma", role: "Class Teacher", department: "Primary", contact: "98765 11001", subjects: "English, EVS" },
  { name: "Raj Verma", role: "Science Teacher", department: "Science", contact: "98765 11002", subjects: "Physics, General Science" },
  { name: "Kavita Iyer", role: "Librarian", department: "Library", contact: "98765 11003", subjects: "Reading Program" },
  { name: "Sanjay Roy", role: "Physics Teacher", department: "Science", contact: "98765 11004", subjects: "Physics" },
  { name: "Farah Khan", role: "Art Teacher", department: "Arts", contact: "98765 11005", subjects: "Art, Craft" },
  { name: "Ravi Patil", role: "Sports Coach", department: "Sports", contact: "98765 11006", subjects: "PE, Athletics" },
  { name: "Ananya Desai", role: "Basketball Coach", department: "Sports", contact: "98765 11007", subjects: "Basketball" },
  { name: "Meera Nair", role: "Math Teacher", department: "Mathematics", contact: "98765 11008", subjects: "Mathematics" },
  { name: "Vikram Thomas", role: "Activity Coordinator", department: "Activities", contact: "98765 11009", subjects: "Clubs, Events" },
  { name: "Neha Kulkarni", role: "Computer Teacher", department: "IT", contact: "98765 11010", subjects: "Computer Science" },
  { name: "Amit Joshi", role: "Hindi Teacher", department: "Languages", contact: "98765 11011", subjects: "Hindi" },
  { name: "Priya Menon", role: "Counsellor", department: "Student Support", contact: "98765 11012", subjects: "Counselling" },
  { name: "Sameer Gupta", role: "Accountant", department: "Administration", contact: "98765 11013", subjects: "Fees" },
  { name: "Leena Shah", role: "Admission Clerk", department: "Administration", contact: "98765 11014", subjects: "Admissions" },
  { name: "Arun Pawar", role: "Lab Assistant", department: "Science", contact: "98765 11015", subjects: "Lab Support" },
  { name: "Nisha Rao", role: "Document Officer", department: "Administration", contact: "98765 11016", subjects: "Certificates" },
  { name: "Manoj Singh", role: "Transport Manager", department: "Transport", contact: "98765 11017", subjects: "Routes" },
  { name: "Pooja Bhat", role: "Receptionist", department: "Front Office", contact: "98765 11018", subjects: "Parent Queries" },
];

const studentRecords: StudentRecord[] = [
  { name: "Aarav Sharma", grade: "Grade 8", roll: "8A-07", attendance: "94%", feeStatus: "Paid", parent: "Rohit Sharma" },
  { name: "Ishaan Singh", grade: "Grade 7", roll: "7B-12", attendance: "88%", feeStatus: "Pending", parent: "Megha Singh" },
  { name: "Myra Kapoor", grade: "Grade 10", roll: "10A-03", attendance: "96%", feeStatus: "Paid", parent: "Anil Kapoor" },
  { name: "Riya Patil", grade: "Grade 6", roll: "6C-18", attendance: "91%", feeStatus: "Partial", parent: "Sunita Patil" },
];

const updates = [
  { title: "School Timings Updated", time: "Just Now", note: "Office timing note refreshed for admin queries." },
  { title: "Staff Profile Added", time: "20 Min Ago", note: "New document officer details connected to the brain." },
  { title: "Fee Circular Uploaded", time: "1 Hour Ago", note: "June fee reminder circular indexed for AI drafting." },
  { title: "Student Record Sync", time: "2 Hours Ago", note: "430 active student records refreshed." },
  { title: "Compliance Note Updated", time: "Yesterday", note: "Water certificate renewal timeline added." },
  { title: "Library Source Connected", time: "Yesterday", note: "Library usage summary added as a knowledge source." },
  { title: "Admission Template Revised", time: "2 Days Ago", note: "Admission letter wording updated for 2026-27." },
  { title: "Staff Contact Audit", time: "3 Days Ago", note: "Phone contacts verified for 18 staff profiles." },
  { title: "Facility Schedule Indexed", time: "4 Days Ago", note: "Room booking schedule connected to AI context." },
  { title: "School Policy Refresh", time: "Last Week", note: "Attendance and conduct rules refreshed." },
];

function AdminSchoolBrainPage() {
  const [schoolKnowledge, setSchoolKnowledge] = useState(initialSchoolKnowledge);
  const [activeTab, setActiveTab] = useState("school");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const filteredStaff = useMemo(() => {
    const q = staffSearch.trim().toLowerCase();
    return staffRecords.filter((staff) => !q || [staff.name, staff.role, staff.department, staff.subjects].some((value) => value.toLowerCase().includes(q)));
  }, [staffSearch]);

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    return studentRecords.filter((student) => {
      const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter;
      const matchesSearch = !q || [student.name, student.roll, student.parent, student.feeStatus].some((value) => value.toLowerCase().includes(q));
      return matchesGrade && matchesSearch;
    });
  }, [gradeFilter, studentSearch]);

  const beginEdit = (field: KnowledgeField) => {
    setEditingKey(field.key);
    setDraft(field.value);
  };

  const saveEdit = (key: string) => {
    setSchoolKnowledge((current) => current.map((field) => field.key === key ? { ...field, value: draft.trim() || field.value } : field));
    setEditingKey(null);
    toast.success("School information updated");
  };

  return (
    <div>
      <PageHeader
        title="School Brain"
        subtitle="School knowledge base and information center"
        action={<Badge variant="outline">Last updated: 2 Hours Ago</Badge>}
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Knowledge Sources" value="248 Sources" icon={FileText} note="Connected records" />
        <KpiCard label="Documents Connected" value="1,284 Documents" icon={BookOpen} note="School files" />
        <KpiCard label="Staff Profiles" value="18 Profiles" icon={Users} note="Admin quick lookup" />
        <KpiCard label="Student Records" value="430 Records" icon={UserRound} note="Active students" />
        <KpiCard label="Last Updated" value="2 Hours Ago" icon={Clock3} note="Latest refresh" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Card className="mb-8 p-4">
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger value="school" className="gap-2 px-5"><BookOpen className="size-4" /> School Knowledge</TabsTrigger>
            <TabsTrigger value="staff" className="gap-2 px-5"><Users className="size-4" /> Staff Knowledge</TabsTrigger>
            <TabsTrigger value="student" className="gap-2 px-5"><GraduationCap className="size-4" /> Student Knowledge</TabsTrigger>
            <TabsTrigger value="updates" className="gap-2 px-5"><Activity className="size-4" /> Recent Updates</TabsTrigger>
          </TabsList>
        </Card>

        {activeTab === "school" ? (
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">School Knowledge</h3>
                <p className="text-xs text-muted-foreground">Editable school information used by Scholarii AI.</p>
              </div>
              <Badge variant="outline">Editable</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {schoolKnowledge.map((field) => (
                <div key={field.key} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">{field.label}</p>
                      {editingKey === field.key ? (
                        <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="mt-2 min-h-28 text-xs" />
                      ) : (
                        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{field.value}</p>
                      )}
                    </div>
                    {editingKey !== field.key ? (
                      <Button type="button" variant="ghost" size="sm" className="h-8 shrink-0 gap-1.5 rounded-full px-3" onClick={() => beginEdit(field)}>
                        <Edit3 className="size-3" /> Edit
                      </Button>
                    ) : null}
                  </div>
                  {editingKey === field.key ? (
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEditingKey(null)}>Cancel</Button>
                      <Button size="sm" className="h-8 bg-violet-600 text-xs hover:bg-violet-700" onClick={() => saveEdit(field.key)}>Save</Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === "staff" ? (
          <Card className="p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold">Staff Knowledge</h3>
                <p className="text-xs text-muted-foreground">Quick lookup for all 18 staff profiles.</p>
              </div>
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input value={staffSearch} onChange={(event) => setStaffSearch(event.target.value)} placeholder="Search staff..." className="h-9 pl-8 text-xs" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredStaff.map((staff) => (
                <div key={staff.contact} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{staff.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{staff.role}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{staff.department}</Badge>
                  </div>
                  <div className="mt-3 space-y-1 text-xs">
                    <InfoRow label="Contact" value={staff.contact} />
                    <InfoRow label="Subjects" value={staff.subjects} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === "student" ? (
          <Card className="p-5">
            <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h3 className="text-sm font-semibold">Student Knowledge</h3>
                <p className="text-xs text-muted-foreground">Total: 430 students. Search basic student information.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="h-9 w-36 text-xs"><SelectValue placeholder="By Grade" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="Grade 6">Grade 6</SelectItem>
                    <SelectItem value="Grade 7">Grade 7</SelectItem>
                    <SelectItem value="Grade 8">Grade 8</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} placeholder="Student search..." className="h-9 w-64 pl-8 text-xs" />
                </div>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <MiniStat label="Total" value="430" />
              <MiniStat label="Grades" value="1-10" />
              <MiniStat label="Search Results" value={String(filteredStudents.length)} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {filteredStudents.map((student) => (
                <div key={student.roll} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.grade} | Roll {student.roll}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{student.feeStatus}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <InfoRow label="Attendance" value={student.attendance} />
                    <InfoRow label="Parent" value={student.parent} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === "updates" ? (
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Recent Updates</h3>
                <p className="text-xs text-muted-foreground">Latest changes made to the school brain.</p>
              </div>
              <Badge variant="outline">10 items</Badge>
            </div>
            <div className="space-y-3">
              {updates.map((update) => (
                <div key={`${update.title}-${update.time}`} className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold">{update.title}</p>
                      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{update.note}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-[10px]">{update.time}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </Tabs>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button variant="outline" className="h-10 justify-start gap-2 text-xs" onClick={() => setActiveTab("school")}>
          <Edit3 className="size-3.5" /> Update School Information
        </Button>
        <Button variant="outline" className="h-10 justify-start gap-2 text-xs" onClick={() => uploadInputRef.current?.click()}>
          <Upload className="size-3.5" /> Upload Knowledge Source
        </Button>
        <Button className="h-10 justify-start gap-2 bg-violet-600 text-xs hover:bg-violet-700" onClick={() => toast.success("School brain refreshed")}>
          <RefreshCw className="size-3.5" /> Refresh School Brain
        </Button>
      </div>
      <input ref={uploadInputRef} type="file" multiple className="hidden" onChange={(event) => {
        if (event.currentTarget.files?.length) toast.success("Knowledge source uploaded");
        event.currentTarget.value = "";
      }} />
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, note }: { label: string; value: string; icon: typeof Database; note: string }) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-500">
          <Icon className="size-5" />
        </div>
        <div>
          <div className="text-[11px] text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">{note}</p>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
