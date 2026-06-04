import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState, type ChangeEvent, type ReactNode, type RefObject } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Clock3,
  Edit3,
  FileText,
  GraduationCap,
  RefreshCw,
  ShieldCheck,
  Upload,
  UserRound,
  Users,
  School,
} from "lucide-react";

export const Route = createFileRoute("/app/brain")({ component: SchoolBrainPage });

type KnowledgeField = {
  key: string;
  label: string;
  value: string;
};

type KnowledgeSource = {
  label: string;
  status: string;
  count: string;
  icon: typeof FileText;
};

type AccessControl = {
  key: string;
  label: string;
  enabled: boolean;
  description: string;
};

type UpdateItem = {
  title: string;
  time: string;
  note: string;
};

type RecordItem = {
  label: string;
  value: string;
  note: string;
};

const initialSchoolKnowledge: KnowledgeField[] = [
  { key: "school_name", label: "School Name", value: "Scholarii Modern School" },
  { key: "school_vision", label: "School Vision", value: "To build confident learners through academic excellence and values." },
  { key: "school_policies", label: "School Policies", value: "Attendance, conduct, communication, and safeguarding policies are active." },
  { key: "school_rules", label: "School Rules", value: "Be respectful, be punctual, and follow classroom and campus guidelines." },
  { key: "school_timings", label: "School Timings", value: "7:30 AM - 2:00 PM" },
  { key: "academic_structure", label: "Academic Structure", value: "Primary, Secondary, and Senior Secondary" },
  { key: "house_system", label: "House System", value: "Four houses with weekly points, events, and student leadership activities." },
  { key: "important_contacts", label: "Important Contacts", value: "Principal office, reception, transport desk, and parent relations team." },
  { key: "school_facilities", label: "School Facilities", value: "Library, science labs, computer labs, sports ground, and transport support." },
];

const knowledgeSources: KnowledgeSource[] = [
  { label: "School Documents", status: "Connected", count: "1,248 Documents", icon: FileText },
  { label: "Policies", status: "Connected", count: "184 Documents", icon: ShieldCheck },
  { label: "Circulars", status: "Connected", count: "96 Documents", icon: BookOpen },
  { label: "Academic Records", status: "Connected", count: "520 Records", icon: GraduationCap },
  { label: "Staff Information", status: "Connected", count: "68 Profiles", icon: Users },
  { label: "Student Records", status: "Connected", count: "1,320 Records", icon: UserRound },
  { label: "Compliance Documents", status: "Connected", count: "124 Documents", icon: ShieldCheck },
];

const initialAccessControls: AccessControl[] = [
  { key: "school_documents", label: "School Documents", enabled: true, description: "Policies, circulars, and school-wide notes." },
  { key: "staff_records", label: "Staff Records", enabled: true, description: "Staff profiles, roles, and school responsibilities." },
  { key: "student_records", label: "Student Records", enabled: true, description: "Student profiles, classes, and parent links." },
  { key: "financial_records", label: "Financial Records", enabled: false, description: "Fees, dues, and sensitive finance details." },
  { key: "compliance_documents", label: "Compliance Documents", enabled: true, description: "Policies, checks, and compliance updates." },
];

const initialUpdates: UpdateItem[] = [
  { title: "New Circular Added", time: "2 Hours Ago", note: "Parent communication circular added to the school brain." },
  { title: "Staff Handbook Updated", time: "Yesterday", note: "Updated staff handbook now available to Scholarii AI." },
  { title: "Compliance Document Uploaded", time: "2 Days Ago", note: "A new compliance document was connected for reference." },
  { title: "School Policy Updated", time: "Last Week", note: "The school policy record was refreshed with the latest version." },
];

const staffRecords: RecordItem[] = [
  { label: "Teachers", value: "48 profiles", note: "Subject allocation, role, and contact summary." },
  { label: "Administrative Staff", value: "12 profiles", note: "Front office, coordination, and support roles." },
  { label: "Support Staff", value: "8 profiles", note: "Transport, lab, campus, and other support roles." },
];

const studentRecords: RecordItem[] = [
  { label: "Students", value: "1,320 records", note: "Class, section, and basic student profile details." },
  { label: "Parents", value: "1,186 linked profiles", note: "Parent contacts and communication details." },
  { label: "Classes", value: "42 classes", note: "Class and section summaries across the school." },
  { label: "Sections", value: "21 sections", note: "Organized class sections currently linked." },
];

function KpiCard({ label, value, icon: Icon, note }: { label: string; value: string; icon: typeof FileText; note: string }) {
  return (
    <Card className="border-border/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          <div className="mt-1 text-sm text-muted-foreground">{note}</div>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl bg-slate-50 text-slate-700">
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="border-border/60 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{subtitle}</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight">{title}</h3>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function SchoolBrainPage() {
  const [schoolKnowledge, setSchoolKnowledge] = useState<KnowledgeField[]>(initialSchoolKnowledge);
  const [accessControls, setAccessControls] = useState<AccessControl[]>(initialAccessControls);
  const [updates, setUpdates] = useState<UpdateItem[]>(initialUpdates);
  const [lastUpdated, setLastUpdated] = useState("2 Hours Ago");
  const [editingField, setEditingField] = useState<KnowledgeField | null>(null);
  const [draftValue, setDraftValue] = useState("");
  const [staffSheetOpen, setStaffSheetOpen] = useState(false);
  const [studentSheetOpen, setStudentSheetOpen] = useState(false);
  const schoolSectionRef = useRef<HTMLDivElement | null>(null);
  const accessSectionRef = useRef<HTMLDivElement | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const enabledAccessLabels = useMemo(
    () => accessControls.filter((item) => item.enabled).map((item) => item.label.toLowerCase()),
    [accessControls]
  );

  const schoolBrainSummary = useMemo(() => {
    const enabled = enabledAccessLabels.join(", ");
    return `Scholarii AI currently has access to ${enabled}. Financial information is currently restricted.`;
  }, [enabledAccessLabels]);

  const openEdit = (field: KnowledgeField) => {
    setEditingField(field);
    setDraftValue(field.value);
  };

  const saveEdit = () => {
    if (!editingField) return;
    setSchoolKnowledge((current) => current.map((field) => (field.key === editingField.key ? { ...field, value: draftValue.trim() || field.value } : field)));
    toast.success(`${editingField.label} updated.`);
    setEditingField(null);
  };

  const scrollToSection = (ref: RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleUploadKnowledge = () => {
    uploadInputRef.current?.click();
  };

  const handleUploadedFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    if (!files.length) return;

    setUpdates((current) => [
      { title: "Knowledge Source Uploaded", time: "Just Now", note: `${files.length} file${files.length > 1 ? "s" : ""} added to the school brain.` },
      ...current,
    ].slice(0, 5));
    setLastUpdated("Just Now");
    toast.success(`${files.length} knowledge source${files.length > 1 ? "s" : ""} queued for the school brain.`);
    event.currentTarget.value = "";
  };

  const handleRefresh = () => {
    setLastUpdated("Just Now");
    setUpdates((current) => [
      { title: "School Brain Refreshed", time: "Just Now", note: "Scholarii AI memory view was refreshed for the principal." },
      ...current,
    ].slice(0, 5));
    toast.success("School brain refreshed.");
  };

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_35%),linear-gradient(to_bottom,rgba(248,250,252,0.9),transparent)]" />

      <PageHeader
        title="School Brain"
        subtitle="Control what Scholarii AI knows about your school in one simple place."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-50">
              <BrainCircuit className="mr-1 size-3.5" />
              Knowledge control center
            </Badge>
            <Badge variant="outline">{lastUpdated}</Badge>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Knowledge Sources" value="248 Sources" icon={FileText} note="Connected to Scholarii AI" />
        <KpiCard label="Documents Connected" value="1,284 Documents" icon={BookOpen} note="School and compliance files" />
        <KpiCard label="Staff Profiles" value="68 Profiles" icon={Users} note="Staff knowledge records" />
        <KpiCard label="Student Records" value="1,320 Records" icon={UserRound} note="Student and parent knowledge" />
        <KpiCard label="Last Updated" value={lastUpdated} icon={Clock3} note="Latest brain refresh status" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <div ref={schoolSectionRef} className="space-y-6">
          <SectionCard
            title="School Knowledge"
            subtitle="School Brain Overview"
            action={<Badge variant="outline">Editable</Badge>}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {schoolKnowledge.map((field) => (
                <div key={field.key} className="rounded-2xl border border-border bg-slate-50/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{field.label}</div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{field.value}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" className="h-8 gap-2 rounded-full px-3" onClick={() => openEdit(field)}>
                      <Edit3 className="size-3.5" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="AI Knowledge Sources"
              subtitle="What Scholarii AI learns from"
              action={<Badge variant="outline">Visibility</Badge>}
            >
              <div className="grid gap-3">
                {knowledgeSources.map((source) => {
                  const Icon = source.icon;
                  return (
                    <div key={source.label} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-2xl bg-slate-50 text-slate-700">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <div className="font-semibold">{source.label}</div>
                          <div className="text-sm text-muted-foreground">{source.count}</div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{source.status}</Badge>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard
              title="AI Access Control"
              subtitle="What Scholarii AI can use"
              action={<Badge variant="outline">Simple toggles</Badge>}
            >
              <div ref={accessSectionRef} className="space-y-3">
                {accessControls.map((item) => (
                  <div key={item.key} className="rounded-2xl border border-border bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold">{item.label}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn(item.enabled && "border-emerald-200 bg-emerald-50 text-emerald-700")}>
                          {item.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch
                          checked={item.enabled}
                          onCheckedChange={(checked) =>
                            setAccessControls((current) =>
                              current.map((control) => (control.key === item.key ? { ...control, enabled: checked } : control))
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Staff Knowledge"
            subtitle="Summary"
            action={
              <Button type="button" variant="outline" className="h-9 rounded-full px-3" onClick={() => setStaffSheetOpen(true)}>
                View Staff Knowledge
              </Button>
            }
          >
            <div className="rounded-3xl border border-border bg-gradient-to-br from-slate-50 to-white p-5">
              <div className="text-3xl font-semibold tracking-tight">68 Staff Profiles Available</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-white p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Teachers</div>
                  <div className="mt-2 text-lg font-semibold">48</div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Admin</div>
                  <div className="mt-2 text-lg font-semibold">12</div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Support</div>
                  <div className="mt-2 text-lg font-semibold">8</div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Student Knowledge"
            subtitle="Summary"
            action={
              <Button type="button" variant="outline" className="h-9 rounded-full px-3" onClick={() => setStudentSheetOpen(true)}>
                View Student Knowledge
              </Button>
            }
          >
            <div className="rounded-3xl border border-border bg-gradient-to-br from-slate-50 to-white p-5">
              <div className="text-3xl font-semibold tracking-tight">1,320 Student Records Available</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-white p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Students</div>
                  <div className="mt-2 text-lg font-semibold">1,320</div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Parents</div>
                  <div className="mt-2 text-lg font-semibold">1,186</div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Classes</div>
                  <div className="mt-2 text-lg font-semibold">42</div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-3">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Sections</div>
                  <div className="mt-2 text-lg font-semibold">21</div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Recent Updates"
            subtitle="Recent knowledge activity"
            action={<Badge variant="outline">{updates.length} updates</Badge>}
          >
            <div className="space-y-3">
              {updates.map((item, index) => (
                <div key={`${item.title}-${index}`} className="rounded-2xl border border-border bg-slate-50/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.note}</p>
                    </div>
                    <Badge variant="outline">{item.time}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <Card className="border-border/60 bg-slate-900 p-5 text-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-white/10">
                <School className="size-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-white/60">Scholarii AI Summary</div>
                <h3 className="mt-1 text-lg font-semibold">School Brain Status</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{schoolBrainSummary}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Button type="button" variant="outline" className="h-11 justify-start rounded-2xl" onClick={() => scrollToSection(schoolSectionRef)}>
          <Edit3 className="mr-2 size-4" />
          Update School Information
        </Button>
        <Button type="button" variant="outline" className="h-11 justify-start rounded-2xl" onClick={handleUploadKnowledge}>
          <Upload className="mr-2 size-4" />
          Upload Knowledge Source
        </Button>
        <Button type="button" variant="outline" className="h-11 justify-start rounded-2xl" onClick={() => scrollToSection(accessSectionRef)}>
          <ShieldCheck className="mr-2 size-4" />
          Manage AI Access
        </Button>
        <Button type="button" className="h-11 justify-start rounded-2xl bg-brand-gradient text-white border-0" onClick={handleRefresh}>
          <RefreshCw className="mr-2 size-4" />
          Refresh School Brain
        </Button>
      </div>

      <input ref={uploadInputRef} type="file" multiple className="hidden" onChange={handleUploadedFiles} />

      <Dialog
        open={Boolean(editingField)}
        onOpenChange={(open) => {
          if (!open) setEditingField(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit School Knowledge</DialogTitle>
            <DialogDescription>Update the information Scholarii AI should always know about the school.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground">{editingField?.label}</div>
            <Textarea
              value={draftValue}
              onChange={(event) => setDraftValue(event.target.value)}
              className="min-h-[180px]"
              placeholder="Enter the updated school information"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingField(null)}>
              Cancel
            </Button>
            <Button type="button" className="bg-brand-gradient text-white border-0" onClick={saveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={staffSheetOpen} onOpenChange={setStaffSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Staff Knowledge</SheetTitle>
            <SheetDescription>Simple staff knowledge records available to Scholarii AI.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {staffRecords.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.note}</p>
                  </div>
                  <Badge variant="outline">{item.value}</Badge>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={studentSheetOpen} onOpenChange={setStudentSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Student Knowledge</SheetTitle>
            <SheetDescription>Simple student and parent knowledge records available to Scholarii AI.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {studentRecords.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.note}</p>
                  </div>
                  <Badge variant="outline">{item.value}</Badge>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
