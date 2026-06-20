import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle, Search, Send, Paperclip, Smile, Mic, Hash,
  Users, Pin, BookOpen, FileText, Link as LinkIcon, Phone,
  MoreVertical, Check, CheckCheck, Info, ArrowLeft, PanelLeftClose,
  PanelLeftOpen, UsersRound, Megaphone, Calendar, Lightbulb, BookMarked,
} from "lucide-react";
import { CONVERSATIONS } from "@/lib/scholarii/messages-mock-data";
import { TEACHER_CONVERSATIONS } from "@/lib/scholarii/teacher-messages-mock-data";
import type { Conversation, Message } from "@/lib/scholarii/messages-mock-data";
import { useAuth } from "@/lib/scholarii/auth";

export const Route = createFileRoute("/app/messages")({ component: MessagesPage });

const STUDENT_FILTER_OPTIONS = ["All", "Teachers", "Students", "Channels", "Unread"];
const TEACHER_FILTER_OPTIONS = ["All", "Teachers", "Students", "Parents", "Channels", "Unread"];
const PANEL_MIN = 280;
const PANEL_DEFAULT = 380;
const PANEL_MAX = 550;

function getStoredPanel(): { width: number; collapsed: boolean } {
  try {
    const raw = localStorage.getItem("scholarii-msg-panel");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { width: PANEL_DEFAULT, collapsed: false };
}

function MessagesPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const FILTER_OPTIONS = isTeacher ? TEACHER_FILTER_OPTIONS : STUDENT_FILTER_OPTIONS;
  const [conversations, setConversations] = useState<Conversation[]>(isTeacher ? TEACHER_CONVERSATIONS : CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showContext, setShowContext] = useState(true);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [panelWidth, setPanelWidth] = useState(getStoredPanel().width);
  const [panelCollapsed, setPanelCollapsed] = useState(getStoredPanel().collapsed);
  const [isResizing, setIsResizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  useEffect(() => {
    localStorage.setItem("scholarii-msg-panel", JSON.stringify({ width: panelWidth, collapsed: panelCollapsed }));
  }, [panelWidth, panelCollapsed]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = panelWidth;

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const newWidth = Math.min(PANEL_MAX, Math.max(PANEL_MIN, startWidth + delta));
      setPanelWidth(newWidth);
    };
    const onUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [panelWidth]);

  const filtered = conversations.filter((c) => {
    if (filter === "Teachers") return c.type === "dm" && c.role === "Teacher";
    if (filter === "Students") return c.type === "dm" && !c.role && c.subject !== "Parent" && c.subject !== "Administration";
    if (filter === "Parents") return c.type === "dm" && c.subject === "Parent";
    if (filter === "Channels") return c.type === "channel";
    if (filter === "Unread") return c.unread > 0;
    return true;
  }).filter((c) => {
    if (!search.trim()) return true;
    return c.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSend = () => {
    if (!input.trim() || !selected) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      senderName: isTeacher ? "Mr. Kumar" : "Rahul Kumar",
      senderAvatar: isTeacher ? "\ud83d\udc68\u200d\ud83c\udfeb" : "\ud83d\udc64",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: input.trim(), lastTimestamp: "Just now" }
          : c
      )
    );
    setInput("");
  };

  const handleSelect = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null);
      setMobileView("list");
    } else {
      setSelectedId(id);
      setMobileView("chat");
      setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
    }
  };

  const channels = CONVERSATIONS.filter((c) => c.type === "channel");
  const recentTeachers = CONVERSATIONS.filter((c) => c.type === "dm" && c.role === "Teacher").slice(0, 3);
  const recentChannels = channels.slice(0, 3);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileView("list")} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-foreground">Messages</span>
          {selected && (
            <span className="text-sm text-muted-foreground">
              / {selected.type === "channel" ? `# ${selected.name}` : selected.name}
            </span>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search people, channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 rounded-xl border border-border/50 bg-muted/30 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-64"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Conversations */}
        <aside
          className={`${mobileView === "list" ? "flex" : "hidden"} flex-col border-r border-border/40 bg-background/95 transition-[width] duration-200 lg:flex`}
          style={{ width: panelCollapsed ? 68 : panelWidth }}
        >
          {/* Panel Toolbar */}
          <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
            {!panelCollapsed && (
              <div className="flex gap-1 overflow-x-auto scrollbar-none">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                      filter === opt ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setPanelCollapsed(!panelCollapsed)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
              title={panelCollapsed ? "Expand panel" : "Collapse panel"}
            >
              {panelCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {/* Direct Messages */}
            <div className="p-1.5">
              {!panelCollapsed && <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Direct Messages</p>}
              {filtered.filter((c) => c.type === "dm").map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl ${panelCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} text-left transition-colors ${
                    selectedId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`flex items-center justify-center rounded-full bg-muted/60 text-lg ${panelCollapsed ? "h-9 w-9" : "h-10 w-10"}`}>{conv.avatar}</div>
                    {conv.online && <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />}
                  </div>
                  {!panelCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{conv.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTimestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                  )}
                  {!panelCollapsed && conv.unread > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-[10px]">{conv.unread}</Badge>
                  )}
                  {panelCollapsed && conv.unread > 0 && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Channels */}
            <div className="border-t border-border/40 p-1.5">
              {!panelCollapsed && <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Channels</p>}
              {filtered.filter((c) => c.type === "channel").map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl ${panelCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} text-left transition-colors ${
                    selectedId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <div className={`flex shrink-0 items-center justify-center rounded-xl bg-muted/60 text-lg ${panelCollapsed ? "h-9 w-9" : "h-10 w-10"}`}>{conv.avatar}</div>
                  {!panelCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">#{conv.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTimestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                  )}
                  {!panelCollapsed && conv.unread > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-[10px]">{conv.unread}</Badge>
                  )}
                  {panelCollapsed && conv.unread > 0 && (
                    <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Resize Handle */}
        {!panelCollapsed && (
          <div
            ref={resizeRef}
            onMouseDown={handleResizeStart}
            className={`hidden w-1 cursor-col-resize bg-border/40 transition-colors hover:bg-primary/40 lg:block ${isResizing ? "bg-primary/40" : ""}`}
          />
        )}

        {/* Center Panel */}
        <main className={`${mobileView === "chat" ? "flex" : "hidden"} flex-1 flex-col lg:flex`}>
          {selected ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMobileView("list")} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-lg">{selected.avatar}</div>
                    {selected.type === "dm" && selected.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {selected.type === "channel" ? `# ${selected.name}` : selected.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selected.type === "channel" ? `${selected.members} members` : selected.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowContext(!showContext)}><Info className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-4">
                  {selected.messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === "me"} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              {!selected.readOnly ? (
                <div className="border-t border-border/40 bg-background/80 px-4 py-3 backdrop-blur-xl">
                  <div className="flex items-end gap-2">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9"><Paperclip className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9"><Smile className="h-4 w-4" /></Button>
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={`Message ${selected.type === "channel" ? "#" + selected.name : selected.name}...`}
                        className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <Button
                        size="icon"
                        className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:from-blue-600 hover:to-indigo-700"
                        onClick={handleSend}
                        disabled={!input.trim()}
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9"><Mic className="h-4 w-4" /></Button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-border/40 bg-muted/20 px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground">This channel is read-only. Only teachers and admins can post.</p>
                </div>
              )}
            </>
          ) : (
            /* Welcome Screen */
            <WelcomeScreen onSelect={handleSelect} recentTeachers={recentTeachers} recentChannels={recentChannels} channels={channels} />
          )}
        </main>

        {/* Right Panel */}
        {showContext && (
          <aside className={`${mobileView === "chat" ? "hidden" : "hidden"} w-72 shrink-0 border-l border-border/40 bg-background/95 xl:block`}>
            {selected ? (
              <ContextPanel conversation={selected} />
            ) : (
              <SuggestionsPanel recentTeachers={recentTeachers} recentChannels={recentChannels} channels={channels} onSelect={handleSelect} />
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

function WelcomeScreen({ onSelect, recentTeachers, recentChannels, channels }: {
  onSelect: (id: string) => void;
  recentTeachers: Conversation[];
  recentChannels: Conversation[];
  channels: Conversation[];
}) {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20">
            <MessageCircle className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Welcome to Scholarii Messages</h2>
          <p className="text-sm text-muted-foreground">Connect with teachers, classmates, and school communities.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: <MessageCircle className="h-5 w-5" />, label: "Start a Conversation", color: "from-blue-500 to-indigo-600" },
            { icon: <Hash className="h-5 w-5" />, label: "Browse Channels", color: "from-violet-500 to-purple-600" },
            { icon: <Megaphone className="h-5 w-5" />, label: "Announcements", color: "from-amber-500 to-orange-600" },
            { icon: <UsersRound className="h-5 w-5" />, label: "Find Classmates", color: "from-emerald-500 to-green-600" },
          ].map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-card/50 p-4 text-center transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white`}>{action.icon}</div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Suggested Channels */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Channels</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => onSelect(ch.id)}
                className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <span className="text-lg">{ch.avatar}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">#{ch.name}</p>
                  <p className="text-[10px] text-muted-foreground">{ch.members} members</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Teachers</p>
          <div className="flex gap-3">
            {recentTeachers.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className="flex flex-1 items-center gap-2 rounded-xl border border-border/40 bg-muted/30 p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="relative shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-base">{t.avatar}</div>
                  {t.online && <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{t.subject}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContextPanel({ conversation }: { conversation: Conversation }) {
  return (
    <div className="flex h-full flex-col p-4 space-y-4 overflow-y-auto">
      <div className="flex flex-col items-center space-y-3 py-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 text-3xl">{conversation.avatar}</div>
          {conversation.type === "dm" && conversation.online && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-emerald-500" />
          )}
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">
            {conversation.type === "channel" ? `# ${conversation.name}` : conversation.name}
          </p>
          {conversation.subject && <p className="text-xs text-muted-foreground">{conversation.subject}</p>}
          {conversation.role && <Badge variant="outline" className="mt-1 text-[10px]">{conversation.role}</Badge>}
          {conversation.type === "channel" && <p className="text-xs text-muted-foreground">{conversation.members} members</p>}
        </div>
      </div>
      <Separator />
      {conversation.description && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">About</p>
          <p className="text-sm text-muted-foreground">{conversation.description}</p>
        </div>
      )}
      {conversation.messages.some((m) => m.pinned) && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Pin className="h-3 w-3" /> Pinned
          </p>
          {conversation.messages.filter((m) => m.pinned).map((msg) => (
            <div key={msg.id} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
              <p className="text-xs font-medium text-foreground">{msg.senderName}</p>
              <p className="text-xs text-muted-foreground">{msg.content}</p>
            </div>
          ))}
        </div>
      )}
      {conversation.messages.some((m) => m.type === "resource") && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-3 w-3" /> Shared Resources
          </p>
          {conversation.messages.filter((m) => m.type === "resource").map((msg) => (
            <div key={msg.id} className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 p-2.5">
              <FileText className="h-4 w-4 shrink-0 text-blue-400" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{msg.resourceTitle}</p>
                <p className="text-[10px] text-muted-foreground">{msg.resourceSubject}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {conversation.type === "channel" && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Users className="h-3 w-3" /> Members
          </p>
          <div className="space-y-1.5">
            {["Mr. Sharma", "Mrs. Gupta", "Ms. Wilson", "Aarav Sharma", "Priya Patel", "Rahul Kumar"].map((name) => (
              <div key={name} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted">
                <div className="h-6 w-6 rounded-full bg-muted/60 text-xs flex items-center justify-center">{name.charAt(0)}</div>
                <span className="text-xs">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SuggestionsPanel({ recentTeachers, recentChannels, channels, onSelect }: {
  recentTeachers: Conversation[];
  recentChannels: Conversation[];
  channels: Conversation[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex h-full flex-col p-4 space-y-5 overflow-y-auto">
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent Teachers</p>
        {recentTeachers.map((t) => (
          <button key={t.id} onClick={() => onSelect(t.id)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-muted">
            <div className="relative shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-sm">{t.avatar}</div>
              {t.online && <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background bg-emerald-500" />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{t.name}</p>
              <p className="text-[10px] text-muted-foreground">{t.subject}</p>
            </div>
          </button>
        ))}
      </div>
      <Separator />
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Recent Channels</p>
        {recentChannels.map((ch) => (
          <button key={ch.id} onClick={() => onSelect(ch.id)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-muted">
            <span className="text-base">{ch.avatar}</span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">#{ch.name}</p>
              <p className="text-[10px] text-muted-foreground">{ch.members} members</p>
            </div>
          </button>
        ))}
      </div>
      <Separator />
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Pinned Resources</p>
        <div className="space-y-1.5">
          {["Algebra Notes Chapter 5", "Science Project Guide", "English Grammar Guide"].map((r) => (
            <div key={r} className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-2">
              <FileText className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              <span className="text-xs text-foreground truncate">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] space-y-1 ${isOwn ? "text-right" : ""}`}>
        {!isOwn && (
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{message.senderAvatar}</span>
            <span className="text-xs font-medium text-foreground">{message.senderName}</span>
          </div>
        )}
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted/60 text-foreground rounded-bl-md"
        }`}>
          {message.type === "resource" ? (
            <div className="flex items-center gap-2">
              <FileText className={`h-4 w-4 shrink-0 ${isOwn ? "text-primary-foreground/70" : "text-blue-400"}`} />
              <div>
                <p className="font-medium">{message.resourceTitle}</p>
                <p className={`text-xs ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{message.resourceSubject}</p>
              </div>
            </div>
          ) : message.type === "link" ? (
            <div className="flex items-center gap-2">
              <LinkIcon className={`h-4 w-4 shrink-0 ${isOwn ? "text-primary-foreground/70" : "text-cyan-400"}`} />
              <span className="underline">{message.content}</span>
            </div>
          ) : (
            message.content
          )}
        </div>
        <div className={`flex items-center gap-1 ${isOwn ? "justify-end" : ""}`}>
          <span className="text-[10px] text-muted-foreground">{message.timestamp}</span>
          {isOwn && <CheckCheck className="h-3 w-3 text-blue-400" />}
        </div>
      </div>
    </div>
  );
}
