import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  Table2,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/app/ai")({ component: ScholariiAiPage });

type Mode = "Simple Query" | "Analysis" | "Research" | "Agent";

type AttachmentKind = "Document" | "Spreadsheet" | "Image" | "Report" | "Policy" | "Circular" | "File";

type Attachment = {
  name: string;
  kind: AttachmentKind;
  size: string;
};

type AIResponse = {
  headline: string;
  summary: string;
  bullets: string[];
  metrics?: { label: string; value: string; note: string }[];
  chartData?: { label: string; value: number }[];
  reportSections?: { title: string; body: string }[];
  references?: string[];
  actions?: string[];
};

type HistoryItem = {
  id: number;
  title: string;
  mode: Mode;
  prompt: string;
  time: string;
  response: AIResponse;
};

const MODES: Mode[] = ["Simple Query", "Analysis", "Research", "Agent"];

const THINKING_STEPS = [
  "Scholarii AI is thinking...",
  "Analyzing school data...",
  "Reviewing documents...",
  "Generating response...",
];

const modeMeta: Record<Mode, { label: string; hint: string; accent: string }> = {
  "Simple Query": {
    label: "Simple Query",
    hint: "Fast, direct answer",
    accent: "from-slate-900 to-slate-700",
  },
  Analysis: {
    label: "Analysis",
    hint: "Insights + KPIs",
    accent: "from-cyan-600 to-sky-600",
  },
  Research: {
    label: "Research",
    hint: "Report with sources",
    accent: "from-violet-600 to-fuchsia-600",
  },
  Agent: {
    label: "Agent",
    hint: "Action plan",
    accent: "from-emerald-600 to-teal-600",
  },
};

const initialAttachments: Attachment[] = [
  { name: "Attendance_Report.pdf", kind: "Report", size: "1.4 MB" },
  { name: "Academic_Performance.xlsx", kind: "Spreadsheet", size: "824 KB" },
];

function inferAttachmentKind(name: string): AttachmentKind {
  const lower = name.toLowerCase();
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls") || lower.endsWith(".csv")) return "Spreadsheet";
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp")) return "Image";
  if (lower.endsWith(".pdf")) return "Report";
  if (lower.endsWith(".doc") || lower.endsWith(".docx") || lower.endsWith(".txt")) return "Document";
  return "File";
}

function inferAttachmentIcon(kind: AttachmentKind) {
  switch (kind) {
    case "Image":
      return ImageIcon;
    case "Spreadsheet":
      return Table2;
    case "Report":
    case "Document":
    case "Policy":
    case "Circular":
      return FileText;
    default:
      return Paperclip;
  }
}

function queryTopic(query: string) {
  const q = query.toLowerCase();
  if (q.includes("attendance")) return "attendance";
  if (q.includes("fee")) return "fee collection";
  if (q.includes("grade 8")) return "Grade 8";
  if (q.includes("ptm")) return "PTM";
  if (q.includes("teacher")) return "teacher workload";
  if (q.includes("parent")) return "parent engagement";
  if (q.includes("compliance")) return "compliance";
  if (q.includes("risk")) return "student risk";
  return "school operations";
}

function buildMockResponse(mode: Mode, query: string, attachments: Attachment[]): AIResponse {
  const q = query.toLowerCase();
  const references = attachments.slice(0, 3).map((item) => item.name);

  if (mode === "Simple Query") {
    if (q.includes("absent")) {
      return {
        headline: "18 students are absent today.",
        summary: "Most absences are concentrated in Grade 8 and Grade 9, with Monday and Tuesday contributing the largest share.",
        bullets: [
          "7 students were marked late before the first period.",
          "5 families already have follow-up reminders queued.",
          "Attendance staff should prioritise repeat absentees first.",
        ],
        references,
      };
    }

    if (q.includes("fee")) {
      return {
        headline: "84 families currently have pending fee dues.",
        summary: "Grade 8 continues to show the highest follow-up volume, but the overall collection trend remains stable.",
        bullets: [
          "32 families are due within the next 7 days.",
          "WhatsApp reminders have the highest response rate.",
          "No fee cluster is marked critical yet.",
        ],
        references,
      };
    }

    if (q.includes("teacher")) {
      return {
        headline: "5 teachers are on leave today.",
        summary: "Two departments are carrying slightly heavier timetables, but cover plans are already in place.",
        bullets: [
          "Science has the highest temporary load.",
          "Three substitution slots are still open.",
          "No class is left uncovered for the day.",
        ],
        references,
      };
    }

    return {
      headline: "Here is the latest school answer.",
      summary: "The school remains operationally stable and the current data does not show any urgent exception.",
      bullets: [
        "Attendance is within the expected range.",
        "Fee follow-up is concentrated in a few classes.",
        "Parent engagement remains healthy this week.",
      ],
      references,
    };
  }

  if (mode === "Analysis") {
    const focus = queryTopic(query);
    return {
      headline: `${focus.charAt(0).toUpperCase() + focus.slice(1)} shows a healthy baseline with a few pressure points.`,
      summary: "The pattern suggests the school is stable overall, but one or two cohorts are driving most of the variation.",
      bullets: [
        "Grade 8 is the most likely intervention group in the current snapshot.",
        "Weekday trends suggest early-week support will have the highest return.",
        "The latest data points are consistent across attendance, engagement, and follow-up activity.",
      ],
      metrics: [
        { label: "Current level", value: "84%", note: "Healthy" },
        { label: "Risk clusters", value: "2", note: "Needs follow-up" },
        { label: "Confidence", value: "High", note: "Strong signal" },
        { label: "Priority", value: "Medium", note: "Monitor closely" },
      ],
      chartData: [
        { label: "Mon", value: 88 },
        { label: "Tue", value: 90 },
        { label: "Wed", value: 89 },
        { label: "Thu", value: 92 },
        { label: "Fri", value: 94 },
      ],
      references,
    };
  }

  if (mode === "Research") {
    const topic = queryTopic(query);
    return {
      headline: `Research brief on ${topic}.`,
      summary: "I reviewed the latest files, school records, and operating patterns to identify the likely drivers behind the issue.",
      bullets: [
        "The strongest signal is concentrated in a small group rather than across the whole school.",
        "Uploaded files support the same pattern that the operational dashboard shows.",
        "A short intervention cycle should produce the fastest improvement.",
      ],
      reportSections: [
        {
          title: "Executive Summary",
          body:
            "The available evidence points to a contained issue that can be improved with targeted communication, earlier follow-up, and tighter monitoring over the next cycle.",
        },
        {
          title: "Findings",
          body:
            "The data suggests the issue is concentrated in a specific grade band, with a secondary effect visible in parent response timing and early-week attendance.",
        },
        {
          title: "Recommendations",
          body:
            "Prioritise targeted outreach, publish a concise parent-facing note, and review the next checkpoint after the weekly follow-up window closes.",
        },
      ],
      references: [
        ...references,
        "Attendance Policy.pdf",
        "Grade 8 Reports",
        "Academic Analytics",
      ].slice(0, 5),
    };
  }

  return {
    headline: "Action plan staged for approval.",
    summary: "Scholarii AI has translated your prompt into a practical workflow that can be executed after review.",
    bullets: [
      "The plan is staged but nothing has been executed in this prototype.",
      "You can review the sequence before triggering the action set.",
      "The likely impact is a cleaner operational follow-through.",
    ],
    actions:
      q.includes("fee")
        ? ["Generate fee reminder", "Notify parents", "Update dashboard"]
        : q.includes("ptm")
          ? ["Draft PTM summary", "Schedule communication", "Notify parents"]
          : q.includes("attendance")
            ? ["Generate attendance report", "Notify class teachers", "Update dashboard"]
            : ["Generate report", "Notify stakeholders", "Update dashboard"],
    references,
  };
}

function seedHistory(attachments: Attachment[]): HistoryItem[] {
  const seeds = [
    { id: 1, title: "Attendance Analysis", mode: "Analysis" as Mode, prompt: "Analyze attendance trends across the school.", time: "Today" },
    { id: 2, title: "Fee Collection Review", mode: "Simple Query" as Mode, prompt: "Show fee defaulters for this week.", time: "Yesterday" },
    { id: 3, title: "PTM Summary", mode: "Research" as Mode, prompt: "Research parent engagement patterns for the PTM cycle.", time: "2 days ago" },
    { id: 4, title: "Compliance Review", mode: "Research" as Mode, prompt: "Review compliance readiness for the principal.", time: "4 days ago" },
    { id: 5, title: "Student Risk Analysis", mode: "Analysis" as Mode, prompt: "Identify students at risk of falling behind.", time: "Last week" },
  ];

  return seeds.map((item) => ({
    ...item,
    response: buildMockResponse(item.mode, item.prompt, attachments),
  }));
}

function ScholariiAiPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("Simple Query");
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [history, setHistory] = useState<HistoryItem[]>(() => seedHistory(initialAttachments));
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [pendingRequest, setPendingRequest] = useState<{ query: string; mode: Mode; attachments: Attachment[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const activeHistory = useMemo(
    () => history.find((item) => item.id === activeHistoryId) ?? null,
    [activeHistoryId, history]
  );

  useEffect(() => {
    if (!isThinking || !pendingRequest) return;

    setThinkingStep(0);
    const stepTimer = window.setInterval(() => {
      setThinkingStep((current) => (current + 1) % THINKING_STEPS.length);
    }, 1250);

    const doneTimer = window.setTimeout(() => {
      const response = buildMockResponse(pendingRequest.mode, pendingRequest.query, pendingRequest.attachments);
      const newEntry: HistoryItem = {
        id: Date.now(),
        title: pendingRequest.query.length > 34 ? `${pendingRequest.query.slice(0, 31)}...` : pendingRequest.query,
        mode: pendingRequest.mode,
        prompt: pendingRequest.query,
        time: "Just now",
        response,
      };

      setHistory((current) => [newEntry, ...current].slice(0, 6));
      setActiveHistoryId(newEntry.id);
      setIsThinking(false);
      setPendingRequest(null);
    }, 5000);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(doneTimer);
    };
  }, [isThinking, pendingRequest]);

  const sendLabel = "Send";

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    if (!files.length) return;

    const mapped = files.map((file) => ({
      name: file.name,
      kind: inferAttachmentKind(file.name),
      size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
    }));

    setAttachments((current) => [...current, ...mapped].slice(0, 8));
    event.currentTarget.value = "";
  };

  const removeAttachment = (name: string) => {
    setAttachments((current) => current.filter((item) => item.name !== name));
  };

  const startThinking = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    if (!trimmed) {
      toast("Please enter a question for Scholarii AI.");
      return;
    }

    setPendingRequest({ query: trimmed, mode, attachments: [...attachments] });
    setIsThinking(true);
    setQuery("");
  };

  const handleComposerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startThinking(query);
  };

  const handleHistoryOpen = (item: HistoryItem) => {
    setQuery(item.prompt);
    setMode(item.mode);
    setActiveHistoryId(item.id);
    setIsThinking(false);
    setPendingRequest(null);
  };

  const handleExecuteActions = () => {
    toast.success("Action plan executed in demo mode.");
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_35%),linear-gradient(to_bottom,rgba(248,250,252,0.9),transparent)]" />

      <PageHeader
        title="Scholarii AI"
        subtitle="Ask questions, analyze data, conduct research, and automate school operations."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
              <BrainCircuit className="mr-1 size-3.5" />
              School intelligence layer
            </Badge>
            <Badge variant="outline">4 modes</Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr] xl:h-[calc(100dvh-12.5rem)] xl:min-h-[680px] xl:items-stretch xl:overflow-hidden">
        <div className="space-y-4 xl:flex xl:h-full xl:flex-col">
          <Card className="border-border/60 bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-sm xl:h-full">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">AI input area</p>
                  <h2 className="mt-1 text-xl font-semibold">Ask anything about your school</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use the school brain to answer questions, explain trends, generate reports, or prepare actions.
                  </p>
                </div>
                <div className="hidden rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground md:flex md:items-center md:gap-2">
                  <Clock3 className="size-3.5" />
                  Thinking cycle: 5 seconds
                </div>
              </div>

              <form className="flex flex-1 min-h-0 flex-col rounded-2xl border border-border bg-background p-3" onSubmit={handleComposerSubmit}>
                <div className="mb-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Suggested prompts</p>
                    <Badge variant="outline">Use as a starting point</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Which students are at risk?",
                      "Analyze fee collection performance.",
                      "Generate academic summary.",
                      "Research attendance decline.",
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setQuery(item);
                          composerRef.current?.focus();
                        }}
                        className="rounded-full border border-border bg-slate-50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-cyan-200 hover:bg-cyan-50"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  ref={composerRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      startThinking(query);
                    }
                  }}
                  placeholder='Ask anything about your school...'
                  className="min-h-[170px] resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                  />

                <div className="mt-3 flex-1 min-h-0">
                  <div className="mb-3 flex flex-wrap gap-2 overflow-x-auto pb-1">
                    {attachments.map((item) => {
                      const Icon = inferAttachmentIcon(item.kind);
                      return (
                        <div
                          key={item.name}
                          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-slate-50 px-3 py-1.5 text-xs text-foreground shadow-sm"
                        >
                          <Icon className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground">({item.size})</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(item.name)}
                            className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      );
                    })}
                    {!attachments.length && (
                      <div className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground">
                        No attachments added yet
                      </div>
                    )}
                  </div>

                  <div className="mt-auto border-t border-border/60 pt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={handleAttachClick} className="h-9 rounded-full px-3">
                        <Paperclip className="mr-2 size-4" />
                        Attach
                      </Button>

                      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
                        <span className="px-2 text-xs text-muted-foreground">Skill</span>
                        <Select value={mode} onValueChange={(value) => setMode(value as Mode)}>
                          <SelectTrigger className="h-8 w-[132px] rounded-full border-0 bg-transparent px-2 text-xs shadow-none">
                            <SelectValue placeholder="Select skill" />
                          </SelectTrigger>
                          <SelectContent>
                            {MODES.map((item) => (
                              <SelectItem key={item} value={item}>
                                {modeMeta[item].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-full"
                        onClick={() => toast("Voice input is a demo control in this prototype.")}
                        aria-label="Voice input"
                      >
                        <Mic className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-full px-3"
                        onClick={() => {
                          setQuery("");
                          setAttachments(initialAttachments);
                        }}
                      >
                        Reset
                      </Button>

                      <Button
                        type="submit"
                        className="ml-auto size-10 rounded-full bg-slate-900 p-0 text-white hover:bg-slate-800"
                        disabled={isThinking}
                        aria-label={isThinking ? "Thinking" : "Send message"}
                      >
                        {isThinking ? <Sparkles className="size-4 animate-pulse" /> : <ArrowUp className="size-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.csv,.doc,.docx,.txt"
                className="hidden"
                onChange={handleAttachmentChange}
              />

              <div className="flex items-center gap-2">
                <Badge variant="outline">{attachments.length} attachments</Badge>
                <Badge variant="outline">{modeMeta[mode].label}</Badge>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 xl:flex xl:h-full xl:flex-col xl:justify-stretch">
          <Card className="border-border/60 p-4 shadow-sm xl:h-full">
            <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Chat / response area</p>
                <h3 className="mt-1 text-lg font-semibold">Live Scholarii AI response</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-900 text-white hover:bg-slate-900">{mode}</Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryOpen((current) => !current)}
                  className="h-8 gap-2 rounded-full px-3 text-xs"
                >
                  <History className="size-3.5" />
                  {historyOpen ? "Hide history" : "History"}
                </Button>
              </div>
            </div>

            <div className={cn("mt-4 flex flex-1 min-h-0 flex-col rounded-3xl border border-border bg-gradient-to-b from-slate-50 to-white p-4", historyOpen ? "xl:p-4" : "")}>
              <div className={cn("grid h-full min-h-0 gap-4", historyOpen ? "xl:grid-cols-[minmax(0,1fr)_280px]" : "grid-cols-1")}>
                <div className="flex min-h-0 flex-col rounded-2xl border border-border bg-white">
                  <div className="border-b border-border/60 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Conversation</div>
                        <div className="text-sm font-medium text-foreground">
                          {isThinking && pendingRequest
                            ? "Scholarii AI is preparing your response"
                            : activeHistory
                              ? activeHistory.title
                              : "No response yet"}
                        </div>
                      </div>
                      <Badge variant="outline">{isThinking ? "Thinking" : "Ready"}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-4">
                  {!isThinking && !activeHistory && (
                    <div className="flex min-h-[300px] items-center justify-center">
                      <div className="max-w-md rounded-3xl border border-dashed border-border bg-slate-50/80 p-5 text-center">
                        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white shadow-sm">
                          <BrainCircuit className="size-6 text-cyan-600" />
                        </div>
                        <div className="mt-4 text-lg font-semibold">Chat with Scholarii AI</div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          Type a prompt on the left and send it with the button below. Responses will appear here like a chat transcript.
                        </p>
                      </div>
                    </div>
                  )}

                  {isThinking && pendingRequest && (
                    <>
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-3xl rounded-br-md bg-slate-900 px-4 py-3 text-sm text-white shadow-sm">
                          <p className="text-[11px] uppercase tracking-wide text-white/70">You</p>
                          <p className="mt-1 leading-6">{pendingRequest.query}</p>
                          {pendingRequest.attachments.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {pendingRequest.attachments.map((item) => (
                                <Badge key={item.name} variant="outline" className="border-white/20 bg-white/10 text-white">
                                  {item.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="max-w-[88%] rounded-3xl rounded-bl-md border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm text-foreground shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-2xl bg-white shadow-sm">
                              <Sparkles className="size-5 animate-pulse text-cyan-600" />
                            </div>
                            <div>
                              <div className="font-semibold">Scholarii AI is thinking...</div>
                              <div className="text-muted-foreground">{THINKING_STEPS[thinkingStep]}</div>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {THINKING_STEPS.map((step, index) => (
                              <div
                                key={step}
                                className={cn(
                                  "rounded-2xl border p-3 text-xs transition-all",
                                  index <= thinkingStep
                                    ? "border-cyan-200 bg-white text-foreground shadow-sm"
                                    : "border-border bg-white/60 text-muted-foreground"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={cn("size-2 rounded-full", index <= thinkingStep ? "bg-cyan-500" : "bg-slate-300")} />
                                  <span className="font-medium">{step}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {!isThinking && activeHistory && (
                    <>
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-3xl rounded-br-md bg-slate-900 px-4 py-3 text-sm text-white shadow-sm">
                          <p className="text-[11px] uppercase tracking-wide text-white/70">You</p>
                          <p className="mt-1 leading-6">{activeHistory.prompt}</p>
                        </div>
                      </div>

                      <div className="flex justify-start">
                        <div className="max-w-[88%] rounded-3xl rounded-bl-md border border-border bg-white px-4 py-3 text-sm text-foreground shadow-sm">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 font-semibold">
                              <BrainCircuit className="size-4 text-cyan-600" />
                              Scholarii AI
                            </div>
                            <Badge variant="outline">Prototype response</Badge>
                          </div>
                          <div className="mt-3 text-base font-semibold tracking-tight">{activeHistory.response.headline}</div>
                          <p className="mt-2 leading-6 text-muted-foreground">{activeHistory.response.summary}</p>

                          {activeHistory.response.bullets.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {activeHistory.response.bullets.map((item) => (
                                <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="mt-1 size-1.5 rounded-full bg-cyan-500" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {activeHistory.response.metrics && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                              {activeHistory.response.metrics.map((metric) => (
                                <div key={metric.label} className="rounded-2xl border border-border bg-slate-50 p-3">
                                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                                  <div className="mt-1 text-lg font-semibold">{metric.value}</div>
                                  <div className="text-xs text-muted-foreground">{metric.note}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {activeHistory.response.chartData && (
                            <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-3">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                  <BarChart3 className="size-4 text-cyan-600" />
                                  Visual summary
                                </div>
                                <Badge variant="outline">Mock chart</Badge>
                              </div>
                              <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={activeHistory.response.chartData} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
                                    <defs>
                                      <linearGradient id="aiAnalysisFill" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                    <XAxis dataKey="label" stroke="var(--muted-foreground)" tickMargin={10} />
                                    <YAxis domain={[80, 100]} stroke="var(--muted-foreground)" width={32} />
                                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                                    <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="url(#aiAnalysisFill)" strokeWidth={2} />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}

                          {activeHistory.response.reportSections && (
                            <div className="mt-4 space-y-3">
                              {activeHistory.response.reportSections.map((section) => (
                                <div key={section.title} className="rounded-2xl border border-border bg-slate-50 p-3">
                                  <div className="flex items-center gap-2 font-semibold">
                                    <BookOpen className="size-4 text-violet-600" />
                                    {section.title}
                                  </div>
                                  <p className="mt-2 leading-6 text-muted-foreground">{section.body}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {activeHistory.response.references && (
                            <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-3">
                              <div className="text-sm font-semibold">Sources consulted</div>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {activeHistory.response.references.map((reference) => (
                                  <Badge key={reference} variant="outline" className="bg-white">
                                    {reference}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeHistory.response.actions && (
                            <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-3">
                              <div className="text-sm font-semibold">Actions identified</div>
                              <div className="mt-3 space-y-2">
                                {activeHistory.response.actions.map((action) => (
                                  <div key={action} className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm">
                                    <CheckCircle2 className="size-4 text-emerald-600" />
                                    <span>{action}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button onClick={handleExecuteActions} className="bg-brand-gradient text-white border-0">
                                  Execute Actions
                                </Button>
                                <Button variant="outline">Review plan</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  </div>
                  </div>
                </div>

                {historyOpen && (
                  <aside className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">AI activity history</p>
                        <h3 className="mt-1 text-sm font-semibold">Recent interactions</h3>
                      </div>
                      <Badge variant="outline">{history.length} items</Badge>
                    </div>

                    <div className="mt-4 space-y-2">
                      {history.map((item) => {
                        const active = item.id === activeHistoryId;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleHistoryOpen(item)}
                            className={cn(
                              "w-full rounded-2xl border p-3 text-left transition-all",
                              active ? "border-cyan-200 bg-cyan-50/70 shadow-sm" : "border-border bg-background hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <Clock3 className="size-3.5 text-muted-foreground" />
                                  <span className="text-sm font-semibold">{item.title}</span>
                                </div>
                                <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{item.prompt}</p>
                              </div>
                              <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
