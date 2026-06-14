import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle, Search, Send, Paperclip, Smile, Mic, Hash,
  Users, Pin, BookOpen, FileText, Link as LinkIcon, Phone,
  MoreVertical, Check, CheckCheck, Star, Bell, BellOff, Info,
  ArrowLeft, Plus, ChevronDown, PinIcon,
} from "lucide-react";
import { CONVERSATIONS } from "@/lib/scholarii/messages-mock-data";
import type { Conversation, Message } from "@/lib/scholarii/messages-mock-data";

export const Route = createFileRoute("/app/messages")({ component: MessagesPage });

const FILTER_OPTIONS = ["All", "Teachers", "Students", "Channels", "Unread"];

function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>(CONVERSATIONS[0].id);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showContext, setShowContext] = useState(true);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selected = conversations.find((c) => c.id === selectedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages]);

  const filtered = conversations.filter((c) => {
    if (filter === "Teachers") return c.type === "dm" && c.role === "Teacher";
    if (filter === "Students") return c.type === "dm" && !c.role;
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
      senderName: "Rahul Kumar",
      senderAvatar: "\ud83d\udc64",
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
    setSelectedId(id);
    setMobileView("chat");
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unread: 0 } : c));
  };

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
        <aside className={`${mobileView === "list" ? "flex" : "hidden"} w-full flex-col border-r border-border/40 bg-background/95 lg:flex lg:w-72 xl:w-80`}>
          {/* Filters */}
          <div className="flex gap-1 overflow-x-auto border-b border-border/40 p-2 scrollbar-none">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  filter === opt ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {/* Direct Messages */}
            <div className="p-2">
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Direct Messages</p>
              {filtered.filter((c) => c.type === "dm").map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    selectedId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-lg">{conv.avatar}</div>
                    {conv.online && <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">{conv.name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTimestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-[10px]">{conv.unread}</Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Channels */}
            <div className="border-t border-border/40 p-2">
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Channels</p>
              {filtered.filter((c) => c.type === "channel").map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelect(conv.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    selectedId === conv.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-lg">{conv.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">#{conv.name}</p>
                      <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTimestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-[10px]">{conv.unread}</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Panel - Chat */}
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
              {!selected.readOnly && (
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
              )}
              {selected.readOnly && (
                <div className="border-t border-border/40 bg-muted/20 px-4 py-3 text-center">
                  <p className="text-xs text-muted-foreground">This channel is read-only. Only teachers and admins can post.</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center space-y-3">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">Select a conversation</p>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Context */}
        {showContext && selected && (
          <aside className={`${mobileView === "chat" ? "hidden" : "hidden"} w-72 shrink-0 border-l border-border/40 bg-background/95 xl:block`}>
            <div className="flex h-full flex-col p-4 space-y-4 overflow-y-auto">
              {/* Profile */}
              <div className="flex flex-col items-center space-y-3 py-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60 text-3xl">{selected.avatar}</div>
                  {selected.type === "dm" && selected.online && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-emerald-500" />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {selected.type === "channel" ? `# ${selected.name}` : selected.name}
                  </p>
                  {selected.subject && <p className="text-xs text-muted-foreground">{selected.subject}</p>}
                  {selected.role && <Badge variant="outline" className="mt-1 text-[10px]">{selected.role}</Badge>}
                  {selected.type === "channel" && <p className="text-xs text-muted-foreground">{selected.members} members</p>}
                </div>
              </div>

              <Separator />

              {/* Description */}
              {selected.description && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">About</p>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                </div>
              )}

              {/* Pinned Messages */}
              {selected.messages.some((m) => m.pinned) && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <PinIcon className="h-3 w-3" /> Pinned
                  </p>
                  {selected.messages.filter((m) => m.pinned).map((msg) => (
                    <div key={msg.id} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5">
                      <p className="text-xs font-medium text-foreground">{msg.senderName}</p>
                      <p className="text-xs text-muted-foreground">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Shared Resources */}
              {selected.messages.some((m) => m.type === "resource") && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="h-3 w-3" /> Shared Resources
                  </p>
                  {selected.messages.filter((m) => m.type === "resource").map((msg) => (
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

              {/* Members (for channels) */}
              {selected.type === "channel" && (
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Users className="h-3 w-3" /> Members
                  </p>
                  <div className="space-y-1.5">
                    {["Mr. Sharma", "Mrs. Gupta", "Ms. Wilson", "Aarav Sharma", "Priya Patel", "Rahul Kumar"].map((name) => (
                      <div key={name} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted">
                        <div className="h-6 w-6 rounded-full bg-muted/60 text-xs flex items-center justify-center">
                          {name.charAt(0)}
                        </div>
                        <span className="text-xs">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
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
