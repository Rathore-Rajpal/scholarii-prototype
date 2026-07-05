import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  FileCheck,
  Upload,
  Search,
  Sparkles,
  Calendar,
  GraduationCap,
  BookOpen,
  X,
  File,
  Send,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/scholarii/auth";
import { PlaceholderPage } from "@/components/scholarii/RoleGuard";

export const Route = createFileRoute("/app/assignments")({
  component: AssignmentsPage,
});

type AssignmentStatus = "not_submitted" | "in_progress" | "submitted" | "verified";

interface Assignment {
  id: string;
  subject: string;
  teacher: string;
  title: string;
  description: string;
  status: AssignmentStatus;
  createdDate: string;
  deadline: string;
  body?: string;
  references: string;
  fileName?: string;
  uploadDate?: string;
  aiResponse: string[];
  aiChecklist: { label: string; done: boolean }[];
}

const ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    subject: "Mathematics",
    teacher: "Mr. Sharma",
    title: "Algebra Worksheet",
    description: "Solve the algebraic equations provided in Chapter 5.",
    status: "not_submitted",
    createdDate: "10 June 2026",
    deadline: "20 June 2026",
    body: "Solve the following algebraic equations from Chapter 5:\n\n1. 2x + 5 = 15\n2. 3y - 7 = 14\n3. 4(x - 2) = 20\n4. (2x + 3)/5 = 4\n5. 5x - 3(x + 2) = 8\n\nShow all working steps. Verify each answer by substitution.",
    references: "Chapter 5 Algebra",
    aiResponse: [
      "Read Chapter 5 Algebra thoroughly.",
      "Identify variables and constants in each equation.",
      "Solve equations one by one, showing all steps.",
      "Verify answers by substitution.",
      "Review solved examples from textbook.",
      "Complete worksheet and upload.",
    ],
    aiChecklist: [
      { label: "Read Chapter 5 Algebra", done: false },
      { label: "Identify variables and constants", done: false },
      { label: "Solve equations step by step", done: false },
      { label: "Verify answers by substitution", done: false },
      { label: "Review solved examples", done: false },
      { label: "Complete and upload worksheet", done: false },
    ],
  },
  {
    id: "2",
    subject: "Science",
    teacher: "Mrs. Gupta",
    title: "Photosynthesis Project",
    description: "Create a detailed project on the process of photosynthesis.",
    status: "in_progress",
    createdDate: "5 June 2026",
    deadline: "18 June 2026",
    body: "Create a project covering the complete photosynthesis process.\n\nInclude:\n- Definition and importance\n- Role of sunlight, water, and chlorophyll\n- Chemical equation\n- Diagram of the process\n- Real-world examples\n\nFormat: Handwritten or digital. Minimum 5 pages.",
    references: "Chapter 6 Biology",
    aiResponse: [
      "Review Chapter 6 Biology.",
      "Understand photosynthesis process.",
      "Create a simple diagram.",
      "Explain sunlight, water and chlorophyll roles.",
      "Add real-world examples.",
      "Prepare final project report.",
    ],
    aiChecklist: [
      { label: "Review Chapter 6 Biology", done: true },
      { label: "Understand photosynthesis process", done: true },
      { label: "Create diagram", done: false },
      { label: "Explain sunlight, water, chlorophyll roles", done: false },
      { label: "Add real-world examples", done: false },
      { label: "Prepare final project report", done: false },
    ],
  },
  {
    id: "3",
    subject: "English",
    teacher: "Ms. Wilson",
    title: "Essay on Climate Change",
    description: "Write a 500-word essay on the causes and effects of climate change.",
    status: "submitted",
    createdDate: "1 June 2026",
    deadline: "15 June 2026",
    body: "Write a well-structured essay (500 words) on climate change.\n\nStructure:\n- Introduction: Define climate change\n- Body Paragraph 1: Causes (fossil fuels, deforestation)\n- Body Paragraph 2: Effects (rising sea levels, extreme weather)\n- Conclusion: Solutions and call to action\n\nUse formal English. Cite at least 2 sources.",
    references: "Provided Reading Material",
    fileName: "climate_change_essay.pdf",
    uploadDate: "14 June 2026",
    aiResponse: [
      "Read provided reading material.",
      "Understand causes of climate change.",
      "Structure essay into Introduction, Body and Conclusion.",
      "Include recent examples and data.",
      "Proofread grammar and spelling.",
      "Submit final essay.",
    ],
    aiChecklist: [
      { label: "Read provided material", done: true },
      { label: "Understand causes of climate change", done: true },
      { label: "Structure essay", done: true },
      { label: "Include recent examples", done: true },
      { label: "Proofread grammar and spelling", done: true },
      { label: "Submit final essay", done: true },
    ],
  },
  {
    id: "4",
    subject: "Computer Science",
    teacher: "Mr. Verma",
    title: "HTML Portfolio Page",
    description: "Build a personal portfolio page using HTML and basic CSS.",
    status: "verified",
    createdDate: "25 May 2026",
    deadline: "10 June 2026",
    body: "Create a personal portfolio webpage using HTML.\n\nRequired sections:\n- Profile section with name and photo placeholder\n- Skills section (list at least 5 skills)\n- Projects section (describe 3 projects)\n- Contact section\n\nUse semantic HTML. Include basic CSS styling. Test in browser before submitting.",
    references: "HTML Basics Module",
    fileName: "portfolio_page.zip",
    uploadDate: "9 June 2026",
    aiResponse: [
      "Review HTML Basics Module.",
      "Create page structure with DOCTYPE.",
      "Add profile section with name.",
      "Add skills section with list.",
      "Add projects section with descriptions.",
      "Test page in browser.",
      "Upload final file.",
    ],
    aiChecklist: [
      { label: "Review HTML Basics Module", done: true },
      { label: "Create page structure", done: true },
      { label: "Add profile section", done: true },
      { label: "Add skills section", done: true },
      { label: "Add projects section", done: true },
      { label: "Test page in browser", done: true },
      { label: "Upload final file", done: true },
    ],
  },
];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "text-blue-600",
  Science: "text-cyan-600",
  English: "text-emerald-600",
  "Computer Science": "text-violet-600",
};

const SUBJECT_ICON_BG: Record<string, string> = {
  Mathematics: "bg-blue-500/10",
  Science: "bg-cyan-500/10",
  English: "bg-emerald-500/10",
  "Computer Science": "bg-violet-500/10",
};

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  not_submitted: { label: "Not Submitted", color: "text-red-500", bg: "bg-red-500/10" },
  in_progress: { label: "Pending", color: "text-amber-500", bg: "bg-amber-500/10" },
  submitted: { label: "Submitted", color: "text-blue-500", bg: "bg-blue-500/10" },
  verified: { label: "Verified", color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Mathematics: BookOpen,
  Science: FileCheck,
  English: File,
  "Computer Science": GraduationCap,
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "not_submitted", label: "Not Submitted" },
  { value: "in_progress", label: "In Progress" },
  { value: "submitted", label: "Submitted" },
  { value: "verified", label: "Verified" },
];

function AssignmentsPage() {
  const { user } = useAuth();
  if (user?.role === "teacher") {
    return (
      <PlaceholderPage
        title="Assignments"
        subtitle="Create, review, and verify assignments."
        icon={ClipboardList}
      />
    );
  }

  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [aiSidebarAssignment, setAiSidebarAssignment] = useState<Assignment | null>(null);

  const metrics = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter(
      (a) => a.status === "not_submitted" || a.status === "in_progress"
    ).length;
    const submitted = assignments.filter((a) => a.status === "submitted").length;
    const verified = assignments.filter((a) => a.status === "verified").length;
    return { total, pending, submitted, verified };
  }, [assignments]);

  const filtered = useMemo(() => {
    let result = assignments;
    if (filter !== "all") {
      result = result.filter((a) => a.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          a.teacher.toLowerCase().includes(q)
      );
    }
    return result;
  }, [assignments, filter, search]);

  const handleStartProgress = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "in_progress" as const } : a))
    );
    setSelectedAssignment((prev) =>
      prev && prev.id === id ? { ...prev, status: "in_progress" as const } : prev
    );
  };

  const handleFileUpload = (id: string) => {
    const now = new Date();
    const uploadDate = `${now.getDate()} ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "submitted" as const, fileName: "uploaded_file.pdf", uploadDate }
          : a
      )
    );
    setSelectedAssignment((prev) =>
      prev && prev.id === id
        ? { ...prev, status: "submitted" as const, fileName: "uploaded_file.pdf", uploadDate }
        : prev
    );
  };

  return (
    <div className="space-y-6 p-6 pb-20 md:p-8">
      {/* Header */}
      <div className="flex items-start gap-3 mb-6 px-0">
        <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center flex-shrink-0">
          <ClipboardList size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-sm text-gray-500 mt-0.5 leading-snug">
            View assignments from your teachers, track progress, submit work, and get AI guidance.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-3 mb-6">
        <MetricCard
          icon={BookOpen}
          label="Total Assignments"
          value={String(metrics.total)}
          trend="up"
          trendLabel="All assignments this term"
          tone="info"
        />
        <MetricCard
          icon={Clock}
          label="Pending"
          value={String(metrics.pending)}
          trend="up"
          trendLabel="Need your attention"
          tone="warning"
        />
        <MetricCard
          icon={FileCheck}
          label="Submitted"
          value={String(metrics.submitted)}
          trend="up"
          trendLabel="Awaiting review"
          tone="info"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Verified"
          value={String(metrics.verified)}
          trend="up"
          trendLabel="Completed"
          tone="success"
        />
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-4 px-4">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === opt.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by title, subject, teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-muted/30 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
                <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium text-foreground/80">No assignments found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {search ? "Try adjusting your search or filters." : "You're all caught up!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onSelect={() => setSelectedAssignment(assignment)}
              onAi={() => setAiSidebarAssignment(assignment)}
            />
          ))
        )}
      </div>

      {/* Assignment Detail Sheet */}
      <Sheet open={!!selectedAssignment} onOpenChange={(open) => !open && setSelectedAssignment(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedAssignment && (
            <AssignmentDetail
              assignment={selectedAssignment}
              onStartProgress={handleStartProgress}
              onFileUpload={handleFileUpload}
              onOpenAi={() => {
                setAiSidebarAssignment(selectedAssignment);
                setSelectedAssignment(null);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* AI Sidebar */}
      <Sheet open={!!aiSidebarAssignment} onOpenChange={(open) => !open && setAiSidebarAssignment(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {aiSidebarAssignment && (
            <AiSidebar assignment={aiSidebarAssignment} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  trendLabel,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  trendLabel: string;
  tone: "success" | "warning" | "info" | "default";
}) {
  const toneStyles = {
    success: "from-emerald-500/10 to-emerald-600/5",
    warning: "from-amber-500/10 to-amber-600/5",
    info: "from-blue-500/10 to-blue-600/5",
    default: "from-slate-500/10 to-slate-600/5",
  };

  const iconBg = {
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    info: "bg-blue-500/10 text-blue-600",
    default: "bg-slate-500/10 text-slate-600",
  };

  return (
    <Card className="relative overflow-hidden px-5 py-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between min-h-[80px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${toneStyles[tone]} opacity-50`} />
      <div className="relative flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground leading-tight max-w-[70%]">{label}</p>
        <div className={`rounded-xl p-2.5 ${iconBg[tone]} flex-shrink-0 ml-2`}>
          <Icon className="size-6" />
        </div>
      </div>
      <div className="relative mt-2">
        <p className="text-4xl font-bold text-foreground leading-tight break-words">{value}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {trend === "up" && <TrendingUp className="size-3 text-emerald-500 shrink-0" />}
          {trend === "down" && <TrendingDown className="size-3 text-red-500 shrink-0" />}
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-emerald-600"
                : trend === "down"
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {trendLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}

function AssignmentCard({
  assignment,
  onSelect,
  onAi,
}: {
  assignment: Assignment;
  onSelect: () => void;
  onAi: () => void;
}) {
  const st = STATUS_BADGE[assignment.status];
  const SubIcon = SUBJECT_ICONS[assignment.subject] || BookOpen;
  const subjectColor = SUBJECT_COLORS[assignment.subject] || "text-gray-600";
  const iconBg = SUBJECT_ICON_BG[assignment.subject] || "bg-gray-500/10";

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-4 mb-3 overflow-hidden group cursor-pointer transition-all hover:shadow-md"
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <SubIcon className={`size-5 ${subjectColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold uppercase ${subjectColor}`}>{assignment.subject}</p>
          <p className="text-base font-bold text-gray-900 mt-0.5 leading-snug truncate">{assignment.title}</p>
          <p className="text-xs text-gray-400 mt-1">Due: {assignment.deadline}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full flex-shrink-0 font-medium ${st.bg} ${st.color}`}>
          {st.label}
        </span>
      </div>
    </div>
  );
}

function AssignmentDetail({
  assignment,
  onStartProgress,
  onFileUpload,
  onOpenAi,
}: {
  assignment: Assignment;
  onStartProgress: (id: string) => void;
  onFileUpload: (id: string) => void;
  onOpenAi: () => void;
}) {
  const st = STATUS_BADGE[assignment.status];
  const SubIcon = SUBJECT_ICONS[assignment.subject] || BookOpen;
  const subjectColor = SUBJECT_COLORS[assignment.subject] || "text-gray-600";
  const iconBg = SUBJECT_ICON_BG[assignment.subject] || "bg-gray-500/10";

  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2 text-lg">
          <SubIcon className={`size-5 ${subjectColor}`} />
          Assignment Details
        </SheetTitle>
        <SheetDescription>
          View full details, submit your work, or get AI help.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-5">
        {/* Subject & Teacher */}
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
            <SubIcon className={`size-6 ${subjectColor}`} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {assignment.subject}
            </p>
            <p className="text-sm text-foreground font-medium">{assignment.teacher}</p>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className={`${st.bg} ${st.color} border-0`}>
              {st.label}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-foreground">{assignment.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{assignment.description}</p>
        </div>

        <Separator />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Created
            </p>
            <p className="flex items-center gap-1.5 text-sm text-foreground">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {assignment.createdDate}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Deadline
            </p>
            <p className="flex items-center gap-1.5 text-sm text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {assignment.deadline}
            </p>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Description</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {assignment.description}
          </p>
        </div>

        {/* Body */}
        {assignment.body && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Assignment</h3>
            <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground font-sans">
                {assignment.body}
              </pre>
            </div>
          </div>
        )}

        {/* References */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">References</h3>
          <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-4 py-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{assignment.references}</span>
          </div>
        </div>

        {/* Upload Section */}
        {(assignment.status === "not_submitted" || assignment.status === "in_progress") && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Submit Your Work</h3>
              <div className="rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5">
                <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOCX, and Images
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-2"
                  onClick={() => onFileUpload(assignment.id)}
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Uploaded file */}
        {assignment.fileName && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Submitted File</h3>
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-4 py-3">
                <File className="h-5 w-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{assignment.fileName}</p>
                  <p className="text-xs text-muted-foreground">Uploaded: {assignment.uploadDate}</p>
                </div>
                <Badge variant="outline" className={`${st.bg} ${st.color} border-0 text-xs`}>
                  {st.label}
                </Badge>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {assignment.status === "not_submitted" && (
            <Button
              className="w-full gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700"
              onClick={() => onStartProgress(assignment.id)}
            >
              <ArrowRight className="h-4 w-4" />
              Start Working
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full gap-2 border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
            onClick={onOpenAi}
          >
            <Sparkles className="h-4 w-4" />
            Do With AI
          </Button>
        </div>
      </div>
    </div>
  );
}

function AiSidebar({ assignment }: { assignment: Assignment }) {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: `Hi! I can help you with "${assignment.title}". Here's a step-by-step guide to get started.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = "";

      if (lower.includes("help") || lower.includes("start") || lower.includes("how")) {
        response = `Here's how to approach "${assignment.title}":\n\n${assignment.aiResponse.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
      } else if (lower.includes("reference") || lower.includes("chapter") || lower.includes("material")) {
        response = `Reference material for this assignment:\n\n📚 ${assignment.references}\n\nReview this thoroughly before starting. It contains the core concepts you'll need.`;
      } else if (lower.includes("submit") || lower.includes("upload")) {
        response = `To submit your assignment:\n\n1. Click "Choose File" in the assignment details\n2. Upload your PDF, DOCX, or image file\n3. Your status will automatically change to "Submitted"\n4. Your teacher will review and verify it`;
      } else if (lower.includes("checklist") || lower.includes("progress")) {
        const done = assignment.aiChecklist.filter((c) => c.done).length;
        const total = assignment.aiChecklist.length;
        response = `Your progress: ${done}/${total} steps completed.\n\n${assignment.aiChecklist.map((c) => `${c.done ? "✅" : "⬜"} ${c.label}`).join("\n")}`;
      } else {
        response = `Great question! For "${assignment.title}", here are the key steps:\n\n${assignment.aiResponse.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nReference: ${assignment.references}`;
      }

      setMessages((prev) => [...prev, { role: "ai", text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const doneCount = assignment.aiChecklist.filter((c) => c.done).length;
  const totalChecklist = assignment.aiChecklist.length;

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          AI Study Assistant
        </SheetTitle>
        <SheetDescription>
          Step-by-step guidance for your assignment
        </SheetDescription>
      </SheetHeader>

      <div className="mt-4 flex-1 overflow-y-auto space-y-4">
        {/* Assignment Info */}
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">{assignment.title}</p>
          <p className="text-xs text-muted-foreground">{assignment.subject} — {assignment.teacher}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Reference: {assignment.references}
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-xl border border-border/40 bg-muted/30 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Progress Checklist
            </p>
            <span className="text-xs text-muted-foreground">{doneCount}/{totalChecklist}</span>
          </div>
          {assignment.aiChecklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-sm">{item.done ? "✅" : "⬜"}</span>
              <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 text-foreground"
                }`}
              >
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about this assignment..."
          className="flex-1 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button
          size="icon"
          className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-600 hover:to-purple-700"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
