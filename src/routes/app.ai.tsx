import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  FileText,
  History,
  Image as ImageIcon,
  Layers,
  Mic,
  PanelRightOpen,
  Paperclip,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Share2,
  Sparkles,
  Square,
  Star,
  Download,
  Trash2,
  X,
  Zap,
  Settings,
} from "lucide-react";

export const Route = createFileRoute("/app/ai")({ component: ScholariiAiPage });

type Skill = "Simple Query" | "Analytics" | "Research" | "Agent";

type ModelProvider = "Scholarii" | "OpenAI" | "Anthropic" | "Google";

type ModelId =
  | "scholarii-default"
  | "gpt-5"
  | "gpt-5-mini"
  | "gpt-4o"
  | "claude-opus-4"
  | "claude-sonnet-4"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash";

type ModelInfo = {
  id: ModelId;
  name: string;
  provider: ModelProvider;
  recommended?: boolean;
  description?: string;
};

type AttachmentKind = "Document" | "Spreadsheet" | "Image" | "Report" | "File";

type Attachment = {
  name: string;
  kind: AttachmentKind;
  size: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  skill: Skill;
  model: ModelId;
  attachments?: Attachment[];
  timestamp: Date;
  response?: AIResponse;
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
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
};

const SKILLS: { id: Skill; label: string; icon: typeof Sparkles; description: string; accent: string }[] = [
  { id: "Simple Query", label: "Simple Query", icon: Zap, description: "Quick questions and answers", accent: "text-slate-600" },
  { id: "Analytics", label: "Analytics", icon: BarChart3, description: "Performance analysis and KPIs", accent: "text-cyan-600" },
  { id: "Research", label: "Research", icon: BookOpen, description: "Deep research and reports", accent: "text-violet-600" },
  { id: "Agent", label: "Agent", icon: Layers, description: "Autonomous multi-step execution", accent: "text-emerald-600" },
];

const MODELS: ModelInfo[] = [
  { id: "scholarii-default", name: "Scholarii Default", provider: "Scholarii", recommended: true, description: "Optimized for school intelligence" },
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI", description: "Most capable OpenAI model" },
  { id: "gpt-5-mini", name: "GPT-5 Mini", provider: "OpenAI", description: "Fast and efficient" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", description: "Multimodal intelligence" },
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", description: "Most capable Claude model" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", description: "Balanced performance" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", description: "Google's flagship model" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", description: "Fast and versatile" },
];

const SUGGESTED_PROMPTS = [
  { text: "Which students are academically at risk?", skill: "Analytics" as Skill },
  { text: "Analyze fee collection performance.", skill: "Analytics" as Skill },
  { text: "Generate a school performance summary.", skill: "Research" as Skill },
  { text: "Identify attendance concerns.", skill: "Analytics" as Skill },
];

const THINKING_STEPS: Record<Skill, string[]> = {
  "Simple Query": ["Understanding your question...", "Searching school data...", "Preparing answer..."],
  Analytics: ["Analyzing attendance trends...", "Processing academic performance data...", "Evaluating fee collection patterns...", "Comparing class-wise metrics...", "Building visualizations...", "Generating insights & recommendations..."],
  Research: ["Researching topic across school data...", "Reviewing documents & records...", "Cross-referencing sources...", "Analyzing patterns & trends...", "Building comprehensive report...", "Compiling references & citations..."],
  Agent: ["Understanding objective...", "Evaluating available actions...", "Planning execution sequence...", "Preparing execution plan...", "Finalizing recommended steps..."],
};

const THINKING_DELAY: Record<Skill, number> = {
  "Simple Query": 3000,
  Analytics: 22000,
  Research: 18000,
  Agent: 12000,
};

function inferAttachmentKind(name: string): AttachmentKind {
  const lower = name.toLowerCase();
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls") || lower.endsWith(".csv")) return "Spreadsheet";
  if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp")) return "Image";
  if (lower.endsWith(".pdf")) return "Report";
  if (lower.endsWith(".doc") || lower.endsWith(".docx") || lower.endsWith(".txt")) return "Document";
  return "File";
}

function buildMockResponse(skill: Skill, query: string, _attachments: Attachment[]): AIResponse {
  const q = query.toLowerCase();

  if (skill === "Simple Query") {
    if (q.includes("absent") || q.includes("attendance")) {
      return {
        headline: "18 students are absent today.",
        summary: "Most absences are concentrated in Grade 8 and Grade 9, with Monday and Tuesday contributing the largest share.",
        bullets: [
          "7 students were marked late before the first period.",
          "5 families already have follow-up reminders queued.",
          "Attendance staff should prioritise repeat absentees first.",
        ],
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
      };
    }
    return {
      headline: "Here is the latest school update.",
      summary: "The school remains operationally stable and the current data does not show any urgent exception.",
      bullets: [
        "Attendance is within the expected range.",
        "Fee follow-up is concentrated in a few classes.",
        "Parent engagement remains healthy this week.",
      ],
    };
  }

  if (skill === "Analytics") {
    const focus = q.includes("attendance") ? "Attendance" : q.includes("fee") ? "Fee Collection" : q.includes("academic") || q.includes("risk") ? "Academic Performance" : "School Operations";
    return {
      headline: `${focus} Analysis — Key Findings`,
      summary: `Based on comprehensive analysis of your school's ${focus.toLowerCase()} data over the past 30 days, here is the detailed performance breakdown. The pattern suggests the school is stable overall, but one or two cohorts are driving most of the variation.`,
      bullets: [
        "Grade 8 is the most likely intervention group in the current snapshot.",
        "Weekday trends suggest early-week support will have the highest return.",
        "The latest data points are consistent across attendance, engagement, and follow-up activity.",
        "YoY comparison shows a 3.2% improvement in overall metrics.",
      ],
      metrics: [
        { label: "Current Level", value: "84%", note: "Healthy" },
        { label: "Risk Clusters", value: "2", note: "Needs follow-up" },
        { label: "Confidence", value: "High", note: "Strong signal" },
        { label: "Priority", value: "Medium", note: "Monitor closely" },
        { label: "30-Day Trend", value: "+3.2%", note: "Improving" },
        { label: "Peer Comparison", value: "Top 15%", note: "Above avg" },
      ],
      chartData: [
        { label: "Week 1", value: 82 },
        { label: "Week 2", value: 85 },
        { label: "Week 3", value: 88 },
        { label: "Week 4", value: 84 },
        { label: "Week 5", value: 91 },
        { label: "Week 6", value: 89 },
        { label: "Week 7", value: 93 },
        { label: "Week 8", value: 94 },
      ],
    };
  }

  if (skill === "Research") {
    return {
      headline: "Research Report — School Performance Analysis",
      summary: "I conducted a deep analysis of your school's academic, operational, and financial data to identify key patterns and provide actionable recommendations.",
      bullets: [
        "The strongest performance signal is concentrated in Grades 6–7, with Grade 8 showing a decline.",
        "Fee collection correlates strongly with parent engagement scores.",
        "Attendance patterns suggest Tuesday and Thursday are the most productive school days.",
        "Teacher workload distribution is uneven across departments.",
      ],
      reportSections: [
        { title: "Executive Summary", body: "The available evidence points to a school that is performing well overall, with specific areas of concern in Grade 8 academic performance and mid-week attendance dips. Targeted interventions in these areas should yield measurable improvements within one academic term." },
        { title: "Academic Findings", body: "Grades 6 and 7 maintain strong academic performance with average scores above 85%. Grade 8 shows a concerning 6% decline in mathematics scores, primarily driven by 3 students who require immediate attention. Science performance remains consistent across all grades." },
        { title: "Operational Findings", body: "Teacher attendance is at 94%, with substitute coverage adequately addressing gaps. Library utilization has increased 12% this quarter. Transport routes are running on schedule with 98% punctuality." },
        { title: "Financial Findings", body: "Fee collection rate stands at 87%, with Grade 8 showing the lowest collection at 79%. WhatsApp-based reminders have proven most effective with a 68% response rate. No critical payment clusters identified." },
        { title: "Recommendations", body: "1) Initiate targeted academic support for Grade 8 mathematics students. 2) Implement parent engagement campaign for fee defaulter families. 3) Introduce early-week attendance monitoring. 4) Review teacher workload distribution across Science department." },
      ],
      references: ["Attendance_Report_Q4.pdf", "Academic_Performance_2024.xlsx", "Fee_Collection_Analysis.pdf", "Teacher_Workload_Data.csv", "Parent_Engagement_Survey.pdf", "Grade_8_Detailed_Report.pdf"],
    };
  }

  // Agent
  return {
    headline: "Execution Plan Ready",
    summary: "Scholarii AI has analyzed your request and prepared a multi-step execution plan. Review the suggested actions below before proceeding.",
    bullets: [
      "The plan addresses the core issue through a structured 3-step workflow.",
      "All actions are scoped to your school's current operational context.",
      "Estimated completion time: 2 business days with automated follow-ups.",
    ],
    actions: q.includes("fee")
      ? ["Generate personalized fee reminders for 84 families", "Send WhatsApp notifications to priority defaulter group", "Schedule follow-up check in 7 days", "Update fee dashboard with latest status"]
      : q.includes("attendance")
        ? ["Generate attendance alert report for Grade 8 & 9", "Notify class teachers of repeat absentees", "Send parent notifications for students with 3+ absences", "Update attendance tracking dashboard"]
        : q.includes("risk")
          ? ["Identify and flag at-risk students in Grade 8", "Generate intervention recommendations", "Notify academic coordinator", "Schedule follow-up assessment in 2 weeks"]
          : ["Generate comprehensive analysis report", "Notify stakeholders with findings", "Schedule review meeting", "Update operational dashboard"],
  };
}

function seedConversations(): HistoryItem[] {
  const now = new Date();
  return [
    {
      id: "conv-1",
      title: "Attendance Analysis",
      createdAt: new Date(now.getTime() - 3600000),
      messages: [
        { id: "m1", role: "user", content: "Analyze attendance trends across the school.", skill: "Analytics", model: "scholarii-default", timestamp: new Date(now.getTime() - 3600000) },
        { id: "m2", role: "assistant", content: "Attendance analysis complete.", skill: "Analytics", model: "scholarii-default", timestamp: new Date(now.getTime() - 3595000), response: buildMockResponse("Analytics", "attendance", []) },
      ],
    },
    {
      id: "conv-2",
      title: "Fee Collection Review",
      createdAt: new Date(now.getTime() - 86400000),
      messages: [
        { id: "m3", role: "user", content: "Show fee defaulters for this week.", skill: "Simple Query", model: "scholarii-default", timestamp: new Date(now.getTime() - 86400000) },
        { id: "m4", role: "assistant", content: "Fee collection review complete.", skill: "Simple Query", model: "scholarii-default", timestamp: new Date(now.getTime() - 86395000), response: buildMockResponse("Simple Query", "fee defaulters", []) },
      ],
    },
    {
      id: "conv-3",
      title: "PTM Research",
      createdAt: new Date(now.getTime() - 172800000),
      messages: [
        { id: "m5", role: "user", content: "Research parent engagement patterns for the PTM cycle.", skill: "Research", model: "scholarii-default", timestamp: new Date(now.getTime() - 172800000) },
        { id: "m6", role: "assistant", content: "PTM research complete.", skill: "Research", model: "scholarii-default", timestamp: new Date(now.getTime() - 172795000), response: buildMockResponse("Research", "PTM parent engagement", []) },
      ],
    },
  ];
}

function ScholariiAiPage() {
  const [conversations, setConversations] = useState<HistoryItem[]>(seedConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [skill, setSkill] = useState<Skill>("Simple Query");
  const [model, setModel] = useState<ModelId>("scholarii-default");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const currentModel = useMemo(() => MODELS.find((m) => m.id === model) ?? MODELS[0], [model]);
  const currentSkill = useMemo(() => SKILLS.find((s) => s.id === skill) ?? SKILLS[0], [skill]);
  const isEmpty = messages.length === 0;
  const activeConversation = useMemo(() => conversations.find((c) => c.id === activeConversationId) ?? null, [activeConversationId, conversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isThinking) return;
    setThinkingStep(0);
    const steps = THINKING_STEPS[skill];
    const stepDuration = THINKING_DELAY[skill] / steps.length;
    const interval = window.setInterval(() => {
      setThinkingStep((prev) => (prev + 1) % steps.length);
    }, stepDuration);
    return () => window.clearInterval(interval);
  }, [isThinking, skill]);

  const getModelLabel = (id: ModelId) => MODELS.find((m) => m.id === id)?.name ?? id;

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmed,
      skill,
      model,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    const timeout = window.setTimeout(() => {
      const response = buildMockResponse(skill, trimmed, attachments);
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response.headline,
        skill,
        model,
        timestamp: new Date(),
        response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);

      setConversations((prev) => {
        const convId = activeConversationId ?? `conv-${Date.now()}`;
        const existing = prev.find((c) => c.id === convId);
        const allMsgs = existing ? [...existing.messages, userMsg, assistantMsg] : [userMsg, assistantMsg];
        const title = trimmed.length > 40 ? `${trimmed.slice(0, 37)}...` : trimmed;
        const updated: HistoryItem = { id: convId, title, messages: allMsgs, createdAt: existing?.createdAt ?? new Date() };
        setActiveConversationId(convId);
        return [updated, ...prev.filter((c) => c.id !== convId)].slice(0, 20);
      });
    }, THINKING_DELAY[skill]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestedPrompt = (text: string, promptSkill: Skill) => {
    setSkill(promptSkill);
    setInput(text);
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files ?? []);
    if (!files.length) return;
    const mapped = files.map((f) => ({ name: f.name, kind: inferAttachmentKind(f.name), size: `${Math.max(1, Math.round(f.size / 1024))} KB` }));
    setAttachments((prev) => [...prev, ...mapped].slice(0, 8));
    e.currentTarget.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    const mapped = files.map((f) => ({ name: f.name, kind: inferAttachmentKind(f.name), size: `${Math.max(1, Math.round(f.size / 1024))} KB` }));
    setAttachments((prev) => [...prev, ...mapped].slice(0, 8));
  };

  const loadConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setMessages(conv.messages);
      setActiveConversationId(id);
      setHistoryOpen(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setActiveConversationId(null);
    setInput("");
    setAttachments([]);
    setHistoryOpen(false);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const renderMessage = (msg: Message) => {
    const isUser = msg.role === "user";
    return (
      <div key={msg.id} className="group px-4 py-6 first:pt-0">
        <div className="mx-auto max-w-3xl">
          <div className="flex gap-4">
            <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", isUser ? "bg-slate-900 text-white" : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white")}>
              {isUser ? <span className="text-xs font-semibold">You</span> : <BrainCircuit className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold">{isUser ? "You" : "Scholarii AI"}</span>
                {!isUser && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {getModelLabel(msg.model)}
                  </Badge>
                )}
              </div>

              {isUser ? (
                <div className="text-sm leading-7 whitespace-pre-wrap">{msg.content}</div>
              ) : msg.response ? (
                <div className="space-y-4">
                  <p className="text-sm leading-7 text-muted-foreground">{msg.response.summary}</p>

                  {msg.response.bullets.length > 0 && (
                    <ul className="space-y-2">
                      {msg.response.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                          <span className="leading-7">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {msg.response.metrics && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {msg.response.metrics.map((m) => (
                        <div key={m.label} className="rounded-xl border border-border bg-slate-50 p-3">
                          <div className="text-xs text-muted-foreground">{m.label}</div>
                          <div className="mt-1 text-lg font-bold">{m.value}</div>
                          <div className="text-xs text-muted-foreground">{m.note}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.response.chartData && (
                    <div className="rounded-xl border border-border bg-slate-50 p-3">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <BarChart3 className="size-4 text-cyan-600" />
                        Trend
                      </div>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={msg.response.chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                            <defs>
                              <linearGradient id={`fill-${msg.id}`} x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                            <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                            <RechartsTooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)" }} />
                            <Area type="monotone" dataKey="value" stroke="#06b6d4" fill={`url(#fill-${msg.id})`} strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {msg.response.reportSections && (
                    <div className="space-y-2">
                      {msg.response.reportSections.map((sec) => (
                        <div key={sec.title} className="rounded-xl border border-border bg-slate-50 p-3">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <BookOpen className="size-4 text-violet-600" />
                            {sec.title}
                          </div>
                          <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{sec.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.response.references && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.response.references.map((ref) => (
                        <Badge key={ref} variant="outline" className="text-xs">{ref}</Badge>
                      ))}
                    </div>
                  )}

                  {msg.response.actions && (
                    <div className="rounded-xl border border-border bg-slate-50 p-3">
                      <div className="text-sm font-semibold mb-2">Action Items</div>
                      <div className="space-y-1.5">
                        {msg.response.actions.map((a) => (
                          <div key={a} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm">
                            <CheckCircle2 className="size-4 text-emerald-600" />
                            {a}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="bg-brand-gradient text-white border-0">Execute</Button>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => copyMessage(msg.response!.headline + "\n" + msg.response!.summary)}>
                      <Copy className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => toast.success("Regenerating...")}>
                      <RefreshCw className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => toast.success("Exported")}>
                      <Download className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => toast.success("Link copied")}>
                      <Share2 className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => toast.success("Saved to School Brain")}>
                      <Save className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-7">{msg.content}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9 lg:hidden">
                <History className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="border-b border-border px-4 py-4">
                <SheetTitle className="flex items-center gap-2">
                  <History className="size-4" />
                  History
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="p-3">
                  <Button variant="outline" className="w-full justify-start gap-2 mb-3" onClick={startNewConversation}>
                    <Plus className="size-4" />
                    New Conversation
                  </Button>
                  {conversations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => loadConversation(c.id)}
                      className={cn(
                        "w-full rounded-xl px-3 py-2.5 text-left text-sm transition-colors mb-1",
                        c.id === activeConversationId
                          ? "bg-slate-100 font-medium"
                          : "hover:bg-slate-50 text-muted-foreground"
                      )}
                    >
                      <div className="truncate">{c.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {c.createdAt.toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8" onClick={() => setHistoryOpen(true)}>
              <History className="size-4" />
            </Button>
          </div>

          <div>
            <h1 className="text-base font-semibold flex items-center gap-2">
              Scholarii AI
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-1.5 py-0">
                <BrainCircuit className="mr-1 size-2.5" />
                School Intelligence Layer
              </Badge>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="size-8 hidden sm:flex">
            <Settings className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setContextOpen(!contextOpen)}>
            <PanelRightOpen className="size-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Chat Area */}
        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          {isEmpty ? (
            /* Empty State */
            <div className="flex-1 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                  <div className="text-center mb-6">
                    <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 mb-3">
                      <BrainCircuit className="size-7" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight sm:text-2xl">How can I help your school today?</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ask questions, analyze data, generate reports, and gain insights.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTED_PROMPTS.map((p) => (
                      <button
                        key={p.text}
                        onClick={() => handleSuggestedPrompt(p.text, p.skill)}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3 text-left text-sm transition-all hover:border-slate-300 hover:shadow-md"
                      >
                        <div className="size-8 shrink-0 rounded-lg bg-slate-100 grid place-items-center group-hover:bg-slate-200 transition-colors">
                          <Sparkles className="size-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium leading-snug">{p.text}</div>
                          <div className="text-xs text-muted-foreground">{p.skill}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {messages.map(renderMessage)}

              {isThinking && (
                <div className="px-4 py-6">
                  <div className="mx-auto max-w-3xl flex gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                      <Sparkles className="size-4 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-2">Scholarii AI</div>
                      <div className="space-y-1.5">
                        {THINKING_STEPS[skill].map((step, i) => (
                          <div key={step} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className={cn("size-1.5 rounded-full", i <= thinkingStep ? "bg-emerald-500" : "bg-slate-300")} />
                            <span className={cn(i <= thinkingStep ? "text-foreground" : "")}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border bg-background p-3 sm:p-4">
            <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {attachments.map((a) => {
                    const Icon = a.kind === "Image" ? ImageIcon : a.kind === "Spreadsheet" ? BarChart3 : FileText;
                    return (
                      <div key={a.name} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-slate-50 px-2.5 py-1 text-xs">
                        <Icon className="size-3 text-muted-foreground" />
                        <span className="font-medium truncate max-w-[120px]">{a.name}</span>
                        <button type="button" onClick={() => setAttachments((p) => p.filter((x) => x.name !== a.name))} className="ml-0.5 text-muted-foreground hover:text-foreground">
                          <X className="size-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Textarea */}
              <div
                className={cn(
                  "relative rounded-2xl border bg-white transition-colors",
                  isDragging ? "border-emerald-400 bg-emerald-50/50" : "border-border focus-within:border-slate-400"
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Scholarii AI..."
                  className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent p-4 pr-12 text-sm shadow-none focus-visible:ring-0"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full"
                    onClick={() => toast("Voice input is a demo feature")}
                  >
                    <Mic className="size-4" />
                  </Button>
                  <Button
                    type="submit"
                    size="icon"
                    className={cn(
                      "size-8 rounded-full transition-all",
                      input.trim() && !isThinking
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-slate-200 text-slate-400"
                    )}
                    disabled={!input.trim() || isThinking}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Selectors Row */}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Skill Selector */}
                  <Popover open={skillOpen} onOpenChange={setSkillOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium">
                        <currentSkill.icon className={cn("size-3.5", currentSkill.accent)} />
                        {currentSkill.label}
                        <ChevronDown className="size-3 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" side="top" className="w-64 p-1.5">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5 font-medium">Skill</div>
                      {SKILLS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { setSkill(s.id); setSkillOpen(false); }}
                          className={cn(
                            "flex items-start gap-2.5 w-full rounded-lg px-2 py-2 text-left text-sm transition-colors",
                            skill === s.id ? "bg-slate-100" : "hover:bg-slate-50"
                          )}
                        >
                          <s.icon className={cn("mt-0.5 size-4 shrink-0", s.accent)} />
                          <div>
                            <div className="font-medium">{s.label}</div>
                            <div className="text-xs text-muted-foreground">{s.description}</div>
                          </div>
                        </button>
                      ))}
                    </PopoverContent>
                  </Popover>

                  {/* Model Selector */}
                  <Popover open={modelOpen} onOpenChange={setModelOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium">
                        {currentModel.recommended && <Star className="size-3 text-amber-500 fill-amber-500" />}
                        {currentModel.name}
                        <ChevronDown className="size-3 text-muted-foreground" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" side="top" className="w-72 p-1.5">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 py-1.5 font-medium">Model</div>
                      {(["Scholarii", "OpenAI", "Anthropic", "Google"] as ModelProvider[]).map((provider) => {
                        const providerModels = MODELS.filter((m) => m.provider === provider);
                        if (providerModels.length === 0) return null;
                        return (
                          <div key={provider}>
                            <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{provider}</div>
                            {providerModels.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => { setModel(m.id); setModelOpen(false); }}
                                className={cn(
                                  "flex items-start gap-2 w-full rounded-lg px-2 py-2 text-left text-sm transition-colors",
                                  model === m.id ? "bg-slate-100" : "hover:bg-slate-50"
                                )}
                              >
                                <div className="mt-0.5 size-4 shrink-0 grid place-items-center">
                                  {m.recommended && <Star className="size-3.5 text-amber-500 fill-amber-500" />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium">{m.name}</span>
                                    {m.recommended && (
                                      <Badge className="text-[9px] px-1 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200">
                                        Recommended
                                      </Badge>
                                    )}
                                  </div>
                                  {m.description && <div className="text-xs text-muted-foreground">{m.description}</div>}
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="text-[11px] text-muted-foreground hidden sm:block">
                  Press <kbd className="rounded border border-border bg-slate-50 px-1 py-0.5 text-[10px] font-mono">Enter</kbd> to send
                </div>
              </div>
            </form>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.csv,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Context Sidebar */}
        {contextOpen && (
          <div className="hidden lg:flex w-72 shrink-0 flex-col border-l border-border bg-white overflow-hidden animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold">School Context</h3>
              <Button variant="ghost" size="icon" className="size-7" onClick={() => setContextOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                <div className="rounded-xl border border-border bg-slate-50 p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-2">School Health</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">92%</div>
                      <div className="text-[10px] text-muted-foreground">Attendance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-600">87%</div>
                      <div className="text-[10px] text-muted-foreground">Collection</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-violet-600">A</div>
                      <div className="text-[10px] text-muted-foreground">Academic</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-600">3</div>
                      <div className="text-[10px] text-muted-foreground">Alerts</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Current Config</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                      <span className="text-muted-foreground">Skill</span>
                      <span className="font-medium">{currentSkill.label}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{currentModel.name}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Recent Reports</div>
                  <div className="space-y-1">
                    {["Attendance Report", "Fee Collection", "Academic Summary"].map((r) => (
                      <div key={r} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer transition-colors">
                        <FileText className="size-3.5 text-muted-foreground" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">Quick Stats</div>
                  <div className="space-y-1">
                    {[
                      { label: "Students", value: "1,247" },
                      { label: "Teachers", value: "68" },
                      { label: "Classes", value: "32" },
                      { label: "Today's Attendance", value: "91.2%" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between rounded-lg px-3 py-2 text-xs">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-semibold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
