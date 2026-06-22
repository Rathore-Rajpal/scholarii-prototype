import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Bot,
  Calendar,
  ChevronDown,
  FileCheck,
  FileText,
  Loader2,
  Mic,
  Paperclip,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  ReceiptIndianRupee,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/admin/ai")({ component: AdminAiPage });

type ChatRole = "user" | "ai";
type ModelId = "fast" | "smart" | "reasoning";
type Section = "today" | "yesterday" | "previous";

type Message = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
};

type Conversation = {
  id: string;
  title: string;
  section: Section;
  messages: Message[];
};

type Skill = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const DAILY_LIMIT = 10;

const MODELS: { id: ModelId; name: string; label: string; icon: string }[] = [
  { id: "fast", name: "Fast", label: "Fast", icon: "⚡" },
  { id: "smart", name: "Smart", label: "Smart", icon: "✦" },
  { id: "reasoning", name: "Reasoning", label: "Reasoning", icon: "🧠" },
];

const ADMIN_SKILLS: Skill[] = [
  { id: "fees", name: "Fee Calculator", description: "Calculate fee dues and generate summaries", icon: ReceiptIndianRupee },
  { id: "admission", name: "Admission Helper", description: "Draft admission letters and certificates", icon: FileCheck },
  { id: "reports", name: "Report Writer", description: "Generate attendance and fee reports", icon: FileText },
  { id: "circulars", name: "Circular Drafter", description: "Write notices and circulars for parents", icon: BookOpen },
  { id: "documents", name: "Document Checker", description: "Verify document completeness", icon: FileCheck },
  { id: "schedule", name: "Schedule Assistant", description: "Answer queries about timetables", icon: Calendar },
];

const EXAMPLE_AI_RESPONSE = `Here is a fee reminder letter:

Dear Parent/Guardian,

This is a gentle reminder that the school fees for [Student Name]
for the month of June 2026 are due.

Fee Details:
• Tuition Fee: ₹[Amount]
• Due Date: 15th June 2026

Kindly visit the school office between 9 AM - 1 PM (Monday to Saturday)
or contact us at 020-XXXXXXXX to clear the dues.

Please note that a late fee of ₹50 per day will be charged after the due date.

Thank you for your cooperation.

Regards,
Office Administration
Scholarii Modern School

Shall I customize this for a specific student or send as a bulk template?`;

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "fee-reminder",
    title: "Pending fee reminder letter",
    section: "today",
    messages: [
      { id: "m1", role: "user", content: "Draft a reminder letter for parents with pending fees", timestamp: "10:10 AM" },
      { id: "m2", role: "ai", content: EXAMPLE_AI_RESPONSE, timestamp: "10:11 AM" },
    ],
  },
  { id: "admission-certificate", title: "Admission certificate format", section: "yesterday", messages: [] },
  { id: "attendance-summary", title: "Attendance summary for Grade 8", section: "previous", messages: [] },
];

const SYSTEM_PROMPT = `You are Scholarii AI, an administrative assistant for an Indian school office clerk.
Help with fee calculations, drafting letters, generating reports, answering
queries about students and attendance. Keep responses concise and professional.
Use ₹ for currency. School name: Scholarii Modern School.`;

function AdminAiPage() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState("fee-reminder");
  const [selectedModel, setSelectedModel] = useState(MODELS[1]);
  const [selectedSkill, setSelectedSkill] = useState(ADMIN_SKILLS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [usedCount, setUsedCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = conversations.find((conversation) => conversation.id === activeConvId);
  const messages = activeConversation?.messages ?? [];
  const remaining = DAILY_LIMIT - usedCount;
  const isNearLimit = usedCount >= 8;
  const isLimitReached = remaining <= 0;

  const grouped = useMemo(() => ({
    today: conversations.filter((conversation) => conversation.section === "today"),
    yesterday: conversations.filter((conversation) => conversation.section === "yesterday"),
    previous: conversations.filter((conversation) => conversation.section === "previous"),
  }), [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const handleNewChat = () => {
    const id = `chat-${Date.now()}`;
    setConversations((current) => [
      { id, title: "New admin chat", section: "today", messages: [] },
      ...current,
    ]);
    setActiveConvId(id);
    setInput("");
  };

  const appendMessage = (conversationId: string, message: Message) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title: conversation.messages.length === 0 && message.role === "user" ? message.content.slice(0, 42) : conversation.title,
              messages: [...conversation.messages, message],
            }
          : conversation
      )
    );
  };

  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isTyping || isLimitReached) return;

    let conversationId = activeConvId;
    if (!conversationId) {
      conversationId = `chat-${Date.now()}`;
      setConversations((current) => [{ id: conversationId, title: messageText.slice(0, 42), section: "today", messages: [] }, ...current]);
      setActiveConvId(conversationId);
    }

    const userMessage: Message = {
      id: `m-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: currentTime(),
    };

    appendMessage(conversationId, userMessage);
    setInput("");
    setIsTyping(true);
    setUsedCount((count) => Math.min(DAILY_LIMIT, count + 1));

    try {
      const response = await callAnthropic(messageText, selectedSkill, selectedModel.id);
      appendMessage(conversationId, {
        id: `m-${Date.now()}-ai`,
        role: "ai",
        content: response,
        timestamp: currentTime(),
      });
    } catch {
      appendMessage(conversationId, {
        id: `m-${Date.now()}-fallback`,
        role: "ai",
        content: fallbackResponse(messageText, selectedSkill),
        timestamp: currentTime(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="-m-4 flex h-[calc(100vh-2rem)] flex-col overflow-hidden bg-background lg:-m-8 lg:h-[calc(100vh-4rem)]">
      <header className="flex items-center justify-between border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold">Scholarii AI Assistant</h1>
            <p className="text-xs text-muted-foreground">AI-powered help for administrative tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dropdown open={modelOpen} setOpen={setModelOpen} button={`${selectedModel.icon} ${selectedModel.label}`}>
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => { setSelectedModel(model); setModelOpen(false); }}
                className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm", selectedModel.id === model.id ? "bg-primary/10 text-primary" : "hover:bg-muted")}
              >
                <span>{model.icon}</span>
                {model.name}
              </button>
            ))}
          </Dropdown>

          <Dropdown open={skillOpen} setOpen={setSkillOpen} button={selectedSkill.name} wide>
            {ADMIN_SKILLS.map((skill) => {
              const Icon = skill.icon;
              return (
                <button
                  key={skill.id}
                  onClick={() => { setSelectedSkill(skill); setSkillOpen(false); }}
                  className={cn("flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left", selectedSkill.id === skill.id ? "bg-primary/10 text-primary" : "hover:bg-muted")}
                >
                  <Icon className="mt-0.5 size-4 shrink-0" />
                  <span>
                    <span className="block text-sm font-medium">{skill.name}</span>
                    <span className="block text-xs text-muted-foreground">{skill.description}</span>
                  </span>
                </button>
              );
            })}
          </Dropdown>

          <div className={cn("hidden rounded-xl border px-3 py-1.5 text-right text-xs md:block", isNearLimit ? "border-amber-200 bg-amber-50 text-amber-700" : "border-border/50")}>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Daily Limit</p>
            <p className="font-semibold">{remaining}/10 remaining</p>
          </div>

          <button onClick={() => setRightPanelOpen((open) => !open)} className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted lg:block">
            {rightPanelOpen ? <PanelRightClose className="size-5" /> : <PanelRightOpen className="size-5" />}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 border-r border-border/40 bg-background/95 lg:block">
          <div className="p-3">
            <Button onClick={handleNewChat} className="w-full gap-2 bg-violet-600 hover:bg-violet-700" size="sm">
              <Plus className="size-4" /> New Chat
            </Button>
          </div>
          <div className="space-y-5 overflow-y-auto px-2 pb-4">
            <ChatSection title="Today" chats={grouped.today} activeId={activeConvId} onSelect={setActiveConvId} />
            <ChatSection title="Yesterday" chats={grouped.yesterday} activeId={activeConvId} onSelect={setActiveConvId} />
            <ChatSection title="Previous" chats={grouped.previous} activeId={activeConvId} onSelect={setActiveConvId} />
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
              {messages.length === 0 ? (
                <div className="flex min-h-[42vh] items-center justify-center text-center">
                  <div className="max-w-md">
                    <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-violet-500/10 text-violet-500">
                      <Bot className="size-8" />
                    </div>
                    <h2 className="text-xl font-semibold">How can I help the admin office?</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Ask for fee summaries, circular drafts, compliance notes, certificates, or timetable answers.</p>
                  </div>
                </div>
              ) : messages.map((message) => <MessageBubble key={message.id} message={message} />)}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" /> Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-border/40 bg-background/90 p-4 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl">
              {isNearLimit && !isLimitReached ? (
                <p className="mb-2 text-center text-xs font-medium text-amber-600">Daily AI usage warning: {remaining} requests remaining.</p>
              ) : null}
              {isLimitReached ? (
                <p className="mb-2 text-center text-xs font-medium text-red-500">Daily AI limit reached. Your quota resets tomorrow.</p>
              ) : null}
              <div className="flex items-end gap-2">
                <button className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted" title="Attach file">
                  <Paperclip className="size-5" />
                </button>
                <button className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted" title="Voice input">
                  <Mic className="size-5" />
                </button>
                <div className="relative flex-1">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={isLimitReached}
                    rows={1}
                    placeholder={`Ask about ${selectedSkill.name.toLowerCase()}...`}
                    className="min-h-12 w-full resize-none rounded-xl border border-border/50 bg-muted/30 px-4 py-3 pr-12 text-sm outline-none transition focus:border-violet-400 focus:bg-background focus:ring-2 focus:ring-violet-500/15 disabled:opacity-50"
                  />
                  <Button size="icon" className="absolute bottom-2 right-2 size-8 bg-violet-600 hover:bg-violet-700" onClick={() => handleSend()} disabled={!input.trim() || isTyping || isLimitReached}>
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {rightPanelOpen && (
          <aside className="hidden w-72 overflow-y-auto border-l border-border/40 bg-background/95 p-4 lg:block">
            <RightPanel skill={selectedSkill} model={selectedModel.label} messageCount={messages.length} usedCount={usedCount} />
          </aside>
        )}
      </div>
    </div>
  );
}

function Dropdown({ open, setOpen, button, children, wide = false }: {
  open: boolean;
  setOpen: (open: boolean) => void;
  button: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex max-w-[180px] items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-xs font-medium hover:bg-muted">
        <span className="truncate">{button}</span>
        <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
      </button>
      {open ? (
        <div className={cn("absolute right-0 top-full z-50 mt-1 rounded-xl border border-border/50 bg-card p-1 shadow-xl", wide ? "w-80" : "w-48")}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function ChatSection({ title, chats, activeId, onSelect }: {
  title: string;
  chats: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-0.5">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm", activeId === chat.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
          >
            <FileText className="size-3.5 shrink-0" />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser ? (
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white">
          <Sparkles className="size-4" />
        </div>
      ) : null}
      <div className={cn("max-w-[82%] space-y-1", isUser && "text-right")}>
        <div className={cn("rounded-2xl px-4 py-3 text-sm leading-relaxed", isUser ? "rounded-br-md bg-violet-600 text-white" : "rounded-bl-md bg-muted/60 text-foreground")}>
          <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
        </div>
        <p className="text-[10px] text-muted-foreground">{message.timestamp}</p>
      </div>
      {isUser ? (
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-500/15 text-xs font-bold text-violet-600">A</div>
      ) : null}
    </div>
  );
}

function RightPanel({ skill, model, messageCount, usedCount }: { skill: Skill; model: string; messageCount: number; usedCount: number }) {
  const Icon = skill.icon;
  const actions = ["Generate fee reminder", "Draft circular", "Check document list", "Create report summary", "Prepare admission letter"];

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active Skill</p>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-violet-500" />
            <span className="text-sm font-medium">{skill.name}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{skill.description}</p>
        </div>
      </div>
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Conversation Stats</p>
        <div className="space-y-2 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Messages</span><span className="font-medium">{messageCount}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="font-medium">{model}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Daily usage</span><span className="font-medium">{usedCount}/10</span></div>
        </div>
      </div>
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Suggested Actions</p>
        <div className="space-y-1.5">
          {actions.map((action) => (
            <button key={action} className="flex w-full items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2.5 text-left text-sm text-muted-foreground hover:border-violet-200 hover:bg-violet-50 hover:text-foreground">
              <Zap className="size-3.5 text-violet-500" />
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

async function callAnthropic(prompt: string, skill: Skill, model: ModelId): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  if (!apiKey) throw new Error("Missing Anthropic API key");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: model === "reasoning" ? 900 : 600,
      system: `${SYSTEM_PROMPT}\nCurrent admin skill: ${skill.name} - ${skill.description}`,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error("Anthropic request failed");
  const data = await response.json() as { content?: { type: string; text?: string }[] };
  const text = data.content?.find((item) => item.type === "text")?.text;
  if (!text) throw new Error("Anthropic response missing text");
  return text;
}

function fallbackResponse(prompt: string, skill: Skill) {
  return `I can help with this ${skill.name.toLowerCase()} request.

Draft response for: "${prompt}"

Please share the student name, class, amount, and due date if you want this customized for a specific record. I can also convert it into a bulk parent template for Scholarii Modern School.`;
}

function currentTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
