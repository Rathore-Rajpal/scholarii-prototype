import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Sparkles, Send, Paperclip, Mic, Search, Plus, MoreHorizontal,
  BrainCircuit, BookOpen, GraduationCap, Lightbulb, FileText,
  MessageSquare, Clock, ChevronDown, X, Loader2, PanelRightOpen,
  PanelRightClose, Trash2, Settings, Zap, Target, Menu,
  Users, Calendar, Wallet, TrendingUp, AlertTriangle, CheckCircle2,
} from "lucide-react";
import {
  MOCK_CONVERSATIONS, AI_MODELS, AI_SKILLS, SUGGESTED_PROMPTS,
  QUICK_ACTIONS, ATTACHABLE_RESOURCES, AI_RESPONSES,
} from "@/lib/scholarii/ai-mock-data";
import type { ChatConversation, ChatMessage, AiModel, AiSkill } from "@/lib/scholarii/ai-mock-data";
import {
  PARENT_AI_SKILLS, PARENT_SUGGESTED_PROMPTS, PARENT_QUICK_ACTIONS,
  PARENT_ATTACHABLE_RESOURCES, PARENT_MOCK_CONVERSATIONS, PARENT_AI_RESPONSES,
} from "@/lib/scholarii/parent-ai-mock-data";
import {
  TEACHER_AI_SKILLS, TEACHER_SUGGESTED_PROMPTS, TEACHER_QUICK_ACTIONS,
  TEACHER_ATTACHABLE_RESOURCES, TEACHER_MOCK_CONVERSATIONS, TEACHER_AI_RESPONSES,
} from "@/lib/scholarii/teacher-ai-mock-data";
import {
  PRINCIPAL_AI_SKILLS, PRINCIPAL_SUGGESTED_PROMPTS, PRINCIPAL_QUICK_ACTIONS,
  PRINCIPAL_ATTACHABLE_RESOURCES, PRINCIPAL_MOCK_CONVERSATIONS, PRINCIPAL_AI_RESPONSES,
} from "@/lib/scholarii/principal-ai-mock-data";
import { useAuth } from "@/lib/scholarii/auth";

export const Route = createFileRoute("/app/ai")({ component: AiStudyAssistant });

const DAILY_LIMIT = 10;

function AiStudyAssistant() {
  const { user, parentMode } = useAuth();
  const isParent = user?.role === "student" && parentMode;
  const isTeacher = user?.role === "teacher";
  const isPrincipal = user?.role === "principal";
  const assistantTitle =
    isPrincipal ? "AI School Advisor" : isTeacher ? "AI Teaching Assistant" : isParent ? "AI Assistant" : "AI Study Assistant";
  const assistantDescription = isPrincipal
    ? "Your AI copilot for school operations, finances, academics, and strategic decisions."
    : isTeacher
      ? "Your teaching copilot for lesson planning, feedback, and follow-up."
      : isParent
        ? "Your AI companion to monitor and support your child's academic journey."
        : "Your personal AI tutor. Ask anything, learn faster.";

  // Use role-specific data
  const AI_SKILLS_TO_USE = isPrincipal ? PRINCIPAL_AI_SKILLS : isTeacher ? TEACHER_AI_SKILLS : isParent ? PARENT_AI_SKILLS : AI_SKILLS;
  const SUGGESTED_PROMPTS_TO_USE = isPrincipal ? PRINCIPAL_SUGGESTED_PROMPTS : isTeacher ? TEACHER_SUGGESTED_PROMPTS : isParent ? PARENT_SUGGESTED_PROMPTS : SUGGESTED_PROMPTS;
  const QUICK_ACTIONS_TO_USE = isPrincipal ? PRINCIPAL_QUICK_ACTIONS : isTeacher ? TEACHER_QUICK_ACTIONS : isParent ? PARENT_QUICK_ACTIONS : QUICK_ACTIONS;
  const ATTACHABLE_RESOURCES_TO_USE = isPrincipal ? PRINCIPAL_ATTACHABLE_RESOURCES : isTeacher ? TEACHER_ATTACHABLE_RESOURCES : isParent ? PARENT_ATTACHABLE_RESOURCES : ATTACHABLE_RESOURCES;
  const MOCK_CONVERSATIONS_TO_USE = isPrincipal ? PRINCIPAL_MOCK_CONVERSATIONS : isTeacher ? TEACHER_MOCK_CONVERSATIONS : isParent ? PARENT_MOCK_CONVERSATIONS : MOCK_CONVERSATIONS;
  const AI_RESPONSES_TO_USE = isPrincipal ? PRINCIPAL_AI_RESPONSES : isTeacher ? TEACHER_AI_RESPONSES : isParent ? PARENT_AI_RESPONSES : AI_RESPONSES;

  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS_TO_USE);
  const [activeConvId, setActiveConvId] = useState<string | null>(MOCK_CONVERSATIONS_TO_USE[0]?.id ?? null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AiModel>(AI_MODELS[1]);
  const [selectedSkill, setSelectedSkill] = useState<AiSkill>(AI_SKILLS_TO_USE[0]);
  const [attachedResource, setAttachedResource] = useState<typeof ATTACHABLE_RESOURCES[0] | null>(null);
  const [resourcePickerOpen, setResourcePickerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [queriesUsed, setQueriesUsed] = useState(2);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const quotaRemaining = DAILY_LIMIT - queriesUsed;
  const quotaExhausted = quotaRemaining <= 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg || quotaExhausted || isTyping) return;

    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      role: "user",
      content: msg,
      attachedResource: attachedResource?.title,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (activeConvId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, newMsg] } : c
        )
      );
    } else {
      const conv: ChatConversation = {
        id: `conv${Date.now()}`,
        title: msg.slice(0, 40) + (msg.length > 40 ? "..." : ""),
        messages: [newMsg],
        createdAt: new Date().toISOString().split("T")[0],
        section: "today",
      };
      setConversations((prev) => [conv, ...prev]);
      setActiveConvId(conv.id);
    }

    setInput("");
    setAttachedResource(null);
    setIsTyping(true);
    setQueriesUsed((p) => p + 1);

    setTimeout(() => {
      const lower = msg.toLowerCase();
      let response = "";

      if (attachedResource) {
        if (isPrincipal) {
          response = `I've received the resource "${attachedResource.title}" (${attachedResource.subject}). Here's my analysis:\n\n**Key Points from ${attachedResource.title}:**\n1. Executive summary and key findings\n2. Trends and patterns identified\n3. Action items requiring attention\n4. Recommendations for decision-making\n\nWhat would you like me to help you with regarding this resource?`;
        } else if (isTeacher) {
          response = `I've received the resource "${attachedResource.title}" (${attachedResource.subject}). Here's my analysis:\n\n**Key Points from ${attachedResource.title}:**\n1. Teaching-relevant content summary\n2. Classroom application ideas\n3. Student engagement opportunities\n4. Assessment integration points\n\nWhat would you like me to help you with regarding this resource?`;
        } else if (isParent) {
          response = `I've received the resource "${attachedResource.title}" (${attachedResource.subject}). Here's my analysis:\n\n**Key Points from ${attachedResource.title}:**\n1. Summary of the document\n2. Important highlights\n3. Action items if any\n4. Relevant context for your child\n\nWhat would you like me to help you with regarding this resource?`;
        } else {
          response = `I've received the resource "${attachedResource.title}" (${attachedResource.subject}). Here's my analysis:\n\n**Key Points from ${attachedResource.title}:**\n1. Core concept explanation\n2. Important formulas and definitions\n3. Application examples\n4. Exam-relevant topics\n\nWhat would you like me to help you with regarding this resource?`;
        }
      } else if (isPrincipal) {
        // Principal-specific responses
        if (lower.includes("performance") || lower.includes("overview") || lower.includes("school")) {
          response = PRINCIPAL_AI_RESPONSES["school overview"];
        } else if (lower.includes("fee") || lower.includes("collection") || lower.includes("defaulter")) {
          response = PRINCIPAL_AI_RESPONSES["fee analysis"];
        } else if (lower.includes("staff") || lower.includes("teacher") || lower.includes("employee")) {
          response = PRINCIPAL_AI_RESPONSES["staff performance"];
        } else if (lower.includes("student") || lower.includes("enrollment") || lower.includes("class")) {
          response = PRINCIPAL_AI_RESPONSES["student analytics"];
        } else if (lower.includes("compliance") || lower.includes("audit") || lower.includes("inspection")) {
          response = PRINCIPAL_AI_RESPONSES["compliance"];
        } else if (lower.includes("budget") || lower.includes("spending") || lower.includes("expense")) {
          response = PRINCIPAL_AI_RESPONSES["budget"];
        } else if (lower.includes("revenue") || lower.includes("income") || lower.includes("financial")) {
          response = PRINCIPAL_AI_RESPONSES["revenue"];
        } else if (lower.includes("report") || lower.includes("monthly") || lower.includes("summary")) {
          response = PRINCIPAL_AI_RESPONSES["report"];
        } else {
          const key = Object.keys(PRINCIPAL_AI_RESPONSES).find((k) => lower.includes(k));
          response = key ? PRINCIPAL_AI_RESPONSES[key] : PRINCIPAL_AI_RESPONSES["default"];
        }
      } else if (isTeacher) {
        // Teacher-specific responses
        if (lower.includes("lesson") || lower.includes("plan") || lower.includes("teach")) {
          response = TEACHER_AI_RESPONSES["lesson plan"];
        } else if (lower.includes("performance") || lower.includes("analysis") || lower.includes("class")) {
          response = TEACHER_AI_RESPONSES["student analysis"];
        } else if (lower.includes("exam") || lower.includes("test") || lower.includes("preparation")) {
          response = TEACHER_AI_RESPONSES["exam preparation"];
        } else if (lower.includes("quiz") || lower.includes("question") || lower.includes("assessment")) {
          response = TEACHER_AI_RESPONSES["quiz creation"];
        } else if (lower.includes("feedback") || lower.includes("report card") || lower.includes("comment")) {
          response = TEACHER_AI_RESPONSES["feedback"];
        } else if (lower.includes("parent") || lower.includes("meeting") || lower.includes("communicate")) {
          response = TEACHER_AI_RESPONSES["parent communication"];
        } else {
          const key = Object.keys(TEACHER_AI_RESPONSES).find((k) => lower.includes(k));
          response = key ? TEACHER_AI_RESPONSES[key] : TEACHER_AI_RESPONSES["default"];
        }
      } else if (isParent) {
        // Parent-specific responses
        if (lower.includes("performance") || lower.includes("performing") || lower.includes("grades")) {
          response = PARENT_AI_RESPONSES["performance"];
        } else if (lower.includes("attendance") || lower.includes("present") || lower.includes("absent")) {
          response = PARENT_AI_RESPONSES["attendance"];
        } else if (lower.includes("fee") || lower.includes("payment") || lower.includes("dues")) {
          response = PARENT_AI_RESPONSES["fees"];
        } else if (lower.includes("exam") || lower.includes("test") || lower.includes("preparation")) {
          response = PARENT_AI_RESPONSES["exams"];
        } else if (lower.includes("event") || lower.includes("ptm") || lower.includes("fair")) {
          response = PARENT_AI_RESPONSES["events"];
        } else if (lower.includes("focus") || lower.includes("week") || lower.includes("priority")) {
          response = PARENT_AI_RESPONSES["focus"];
        } else if (lower.includes("support") || lower.includes("help") || lower.includes("home")) {
          response = PARENT_AI_RESPONSES["support"];
        } else if (lower.includes("notice") || lower.includes("school")) {
          response = PARENT_AI_RESPONSES["notices"];
        } else {
          const key = Object.keys(PARENT_AI_RESPONSES).find((k) => lower.includes(k));
          response = key ? PARENT_AI_RESPONSES[key] : PARENT_AI_RESPONSES["default"];
        }
      } else {
        // Student-specific responses
        if (lower.includes("photosynthesis") || lower.includes("biology")) {
          response = MOCK_CONVERSATIONS[0].messages[1].content;
        } else if (lower.includes("linear") || lower.includes("algebra") || lower.includes("equation")) {
          response = MOCK_CONVERSATIONS[1].messages[1].content;
        } else if (lower.includes("climate") || lower.includes("essay")) {
          response = MOCK_CONVERSATIONS[2].messages[1].content;
        } else if (lower.includes("newton") || lower.includes("physics") || lower.includes("motion")) {
          response = MOCK_CONVERSATIONS[3].messages[1].content;
        } else if (lower.includes("html") || lower.includes("portfolio") || lower.includes("computer")) {
          response = MOCK_CONVERSATIONS[4].messages[1].content;
        } else {
          const key = Object.keys(AI_RESPONSES).find((k) => lower.includes(k));
          response = key ? AI_RESPONSES[key] : `I understand your question about "${msg}". Let me help you with that.\n\nHere's what I can tell you:\n\n1. **Overview**: This is an important topic in your curriculum.\n\n2. **Key Points**: \n   - Point 1: Fundamental concept\n   - Point 2: Application\n   - Point 3: Exam relevance\n\n3. **Study Tips**: Focus on understanding the core principles rather than memorizing.\n\nWould you like me to:\n- Create detailed notes?\n- Generate practice questions?\n- Create flashcards?\n- Explain a specific concept?`;
        }
      }

      const aiMsg: ChatMessage = {
        id: `m${Date.now() + 1}`,
        role: "ai",
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId ? { ...c, messages: [...c.messages, aiMsg] } : c
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  const handleNewChat = () => {
    setActiveConvId(null);
    setInput("");
    setAttachedResource(null);
  };

  const grouped = useMemo(() => {
    const today: ChatConversation[] = [];
    const yesterday: ChatConversation[] = [];
    const previous: ChatConversation[] = [];
    conversations.forEach((c) => {
      if (c.section === "today") today.push(c);
      else if (c.section === "yesterday") yesterday.push(c);
      else previous.push(c);
    });
    return { today, yesterday, previous };
  }, [conversations]);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-foreground hidden sm:inline">{assistantTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => { setModelDropdownOpen(!modelDropdownOpen); setSkillDropdownOpen(false); }}
              className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span>{selectedModel.icon}</span>
              <span className="hidden sm:inline">{selectedModel.label}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {modelDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-border/40 bg-card p-1 shadow-xl">
                {AI_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m); setModelDropdownOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      selectedModel.id === m.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Skill Selector */}
          <div className="relative">
            <button
              onClick={() => { setSkillDropdownOpen(!skillDropdownOpen); setModelDropdownOpen(false); }}
              className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span className="hidden sm:inline">{selectedSkill.name}</span>
              <span className="sm:hidden">Skill</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {skillDropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-xl border border-border/40 bg-card p-1 shadow-xl max-h-80 overflow-y-auto">
                {AI_SKILLS_TO_USE.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedSkill(s); setSkillDropdownOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      selectedSkill.id === s.id ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quota */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Daily Limit</p>
              <p className={`text-xs font-bold ${quotaExhausted ? "text-red-400" : "text-foreground"}`}>
                {quotaRemaining} / {DAILY_LIMIT} Remaining
              </p>
            </div>
            <div className="h-8 w-8">
              <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke={quotaExhausted ? "#ef4444" : "#8b5cf6"}
                  strokeWidth="3"
                  strokeDasharray={`${(quotaRemaining / DAILY_LIMIT) * 100.5} 100.5`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground hidden lg:flex">
            {rightPanelOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Chat History */}
        <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-64 border-r border-border/40 bg-background/95 backdrop-blur-xl transition-transform lg:relative lg:translate-x-0`}>
          <div className="flex h-full flex-col pt-14 lg:pt-0">
            <div className="p-3">
              <Button onClick={handleNewChat} className="w-full gap-2" size="sm">
                <Plus className="h-4 w-4" /> New Chat
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
              {grouped.today.length > 0 && (
                <ChatSection title="Today" chats={grouped.today} activeId={activeConvId} onSelect={(id) => { setActiveConvId(id); setSidebarOpen(false); }} />
              )}
              {grouped.yesterday.length > 0 && (
                <ChatSection title="Yesterday" chats={grouped.yesterday} activeId={activeConvId} onSelect={(id) => { setActiveConvId(id); setSidebarOpen(false); }} />
              )}
              {grouped.previous.length > 0 && (
                <ChatSection title="Previous Chats" chats={grouped.previous} activeId={activeConvId} onSelect={(id) => { setActiveConvId(id); setSidebarOpen(false); }} />
              )}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Chat Area */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {activeConv && activeConv.messages.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
                {activeConv.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            <EmptyState
              onSend={handleSend}
              isParent={isParent}
              title={assistantTitle}
              description={assistantDescription}
            />
          )}

          {/* Composer */}
          <div className="border-t border-border/40 bg-background/80 p-4 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl space-y-3">
              {/* Preset Prompts */}
              {!activeConv || activeConv.messages.length === 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {QUICK_ACTIONS_TO_USE.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.label)}
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                    >
                      <span>{action.icon}</span> {action.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {/* Attached Resource */}
              {attachedResource && (
                <div className="flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2">
                  <BookOpen className="h-4 w-4 text-violet-400" />
                  <span className="text-sm font-medium text-foreground">{attachedResource.title}</span>
                  <Badge variant="outline" className="text-[10px]">{attachedResource.subject}</Badge>
                  <span className="text-[10px] text-muted-foreground">Attached</span>
                  <button onClick={() => setAttachedResource(null)} className="ml-auto text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Input Area */}
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => setResourcePickerOpen(true)}
                    className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="Attach Resource"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button className="rounded-xl p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" title="Voice Input (Coming Soon)">
                    <Mic className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={quotaExhausted ? "Daily AI limit reached. Resets tomorrow." : isParent ? "Ask about your child's progress..." : `Ask anything about ${selectedSkill.name.toLowerCase()}...`}
                    disabled={quotaExhausted}
                    rows={1}
                    className="w-full resize-none rounded-xl border border-border/50 bg-muted/30 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    size="icon"
                    className="absolute right-2 bottom-2 h-8 w-8 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-600 hover:to-purple-700"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || quotaExhausted || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {quotaExhausted && (
                <p className="text-center text-xs text-red-400">Daily AI Limit Reached. Your quota will reset tomorrow.</p>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        {rightPanelOpen && (
          <aside className="hidden w-72 border-l border-border/40 bg-background/95 backdrop-blur-xl lg:block">
            <RightSidebar
              skill={selectedSkill}
              resource={attachedResource}
              conversation={activeConv}
              isParent={isParent}
            />
          </aside>
        )}
      </div>

      {/* Resource Picker */}
      <Sheet open={resourcePickerOpen} onOpenChange={setResourcePickerOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Attach Resource</SheetTitle>
            <SheetDescription>Select a resource to add as context</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {ATTACHABLE_RESOURCES_TO_USE.map((r) => (
              <button
                key={r.id}
                onClick={() => { setAttachedResource(r); setResourcePickerOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl border border-border/40 bg-muted/30 p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/60 text-lg">
                  {r.type === "Book" ? "\ud83d\udcda" : r.type === "Notes" ? "\ud83d\udcdd" : r.type === "PPT" ? "\ud83d\udcca" : r.type === "Worksheet" ? "\ud83d\udcf3" : "\ud83d\udcc4"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.subject} — {r.type}</p>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ChatSection({ title, chats, activeId, onSelect }: {
  title: string; chats: ChatConversation[]; activeId: string | null; onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="space-y-0.5">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
              activeId === chat.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] space-y-1 ${isUser ? "text-right" : ""}`}>
        {message.attachedResource && (
          <div className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[10px] ${isUser ? "bg-primary/10 text-primary" : "bg-violet-500/10 text-violet-400"}`}>
            <BookOpen className="h-3 w-3" /> {message.attachedResource}
          </div>
        )}
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted/60 text-foreground rounded-bl-md"
        }`}>
          <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
        </div>
        <p className="text-[10px] text-muted-foreground">{message.timestamp}</p>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <span className="text-xs font-bold text-primary">U</span>
        </div>
      )}
    </div>
  );
}

function EmptyState({
  onSend,
  isParent,
  title,
  description,
}: {
  onSend: (text: string) => void;
  isParent: boolean;
  title: string;
  description: string;
}) {
  const prompts = isParent ? PARENT_SUGGESTED_PROMPTS : SUGGESTED_PROMPTS;
  
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-lg text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20">
          <BrainCircuit className="h-10 w-10 text-violet-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSend(prompt)}
              className="rounded-xl border border-border/40 bg-muted/30 p-3 text-left text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RightSidebar({ skill, resource, conversation, isParent }: {
  skill: AiSkill; resource: typeof ATTACHABLE_RESOURCES[0] | null; conversation: ChatConversation | undefined; isParent: boolean;
}) {
  const suggestedActions = isParent ? [
    { label: "View Report Card", icon: <FileText className="h-3.5 w-3.5" /> },
    { label: "Check Attendance", icon: <Calendar className="h-3.5 w-3.5" /> },
    { label: "Fee Payment", icon: <Wallet className="h-3.5 w-3.5" /> },
    { label: "Contact Class Teacher", icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { label: "Download Progress Report", icon: <FileText className="h-3.5 w-3.5" /> },
    { label: "Set Fee Reminder", icon: <Clock className="h-3.5 w-3.5" /> },
  ] : [
    { label: "Generate Notes", icon: <FileText className="h-3.5 w-3.5" /> },
    { label: "Create Quiz", icon: <Target className="h-3.5 w-3.5" /> },
    { label: "Important Questions", icon: <Lightbulb className="h-3.5 w-3.5" /> },
    { label: "Revision Summary", icon: <BookOpen className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex h-full flex-col p-4 space-y-5 overflow-y-auto">
      <div className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Active Skill</p>
        <div className="rounded-xl border border-border/40 bg-muted/30 p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-foreground">{skill.name}</span>
          </div>
        </div>
      </div>

      {resource && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Attached Resource</p>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-400" />
              <div>
                <p className="text-sm font-medium text-foreground">{resource.title}</p>
                <p className="text-xs text-muted-foreground">{resource.subject}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Conversation</p>
        <div className="rounded-xl border border-border/40 bg-muted/30 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Messages</span>
            <span className="font-medium text-foreground">{conversation?.messages.length ?? 0}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Model</span>
            <span className="font-medium text-foreground">Scholarii Smart</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Skill</span>
            <span className="font-medium text-foreground">{skill.name}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Suggested Actions</p>
        <div className="space-y-1.5">
          {suggestedActions.map((action) => (
            <button
              key={action.label}
              className="flex w-full items-center gap-2.5 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {isParent && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Child Overview</p>
          <div className="rounded-xl border border-border/40 bg-muted/30 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-foreground">Aarav Sharma</span>
            </div>
            <div className="text-xs text-muted-foreground">Class 8-A · Roll 8A07</div>
          </div>
        </div>
      )}

      {isParent && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Stats</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/40 bg-muted/30 p-2">
              <div className="flex items-center gap-1 mb-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] text-muted-foreground">Attendance</span>
              </div>
              <p className="text-sm font-bold text-foreground">94%</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-muted/30 p-2">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="h-3 w-3 text-violet-400" />
                <span className="text-[10px] text-muted-foreground">Score</span>
              </div>
              <p className="text-sm font-bold text-foreground">84%</p>
            </div>
          </div>
        </div>
      )}

      {isParent && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Upcoming</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3 text-amber-400" />
              <span className="text-muted-foreground">Unit Test: 5 days</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Wallet className="h-3 w-3 text-blue-400" />
              <span className="text-muted-foreground">Fee Due: 15 days</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto space-y-2">
        <div className="rounded-xl border border-border/40 bg-muted/30 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <p className="text-xs font-semibold text-foreground">Daily Usage</p>
          </div>
          <p className="text-[11px] text-muted-foreground">2 / 10 queries used today</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted/50">
            <div className="h-full w-[20%] rounded-full bg-gradient-to-r from-violet-500 to-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
