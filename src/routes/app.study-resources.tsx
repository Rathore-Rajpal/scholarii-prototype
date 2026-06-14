import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Library, BookOpen, FileText, Link as LinkIcon, Upload, Search,
  Download, ExternalLink, Sparkles, Star, Filter, MoreVertical,
  Youtube, StickyNote, GraduationCap, Users, FolderOpen, Bookmark,
  X, Send, Loader2, Eye, ChevronDown, Plus, Trash2, Edit,
} from "lucide-react";
import {
  ALL_RESOURCES, SYLLABUS_BOOKS, TEACHER_RESOURCES, MY_RESOURCES,
  PREVIOUS_PAPERS, SAVED_AI_GUIDES, FILE_TYPE_CONFIG,
} from "@/lib/scholarii/study-resources-mock-data";
import type { Resource, ResourceType, ResourceTab } from "@/lib/scholarii/study-resources-mock-data";

export const Route = createFileRoute("/app/study-resources")({
  component: StudyResourcesPage,
});

const TAB_LIST: { id: ResourceTab; label: string; icon: React.ReactNode; count: number }[] = [
  { id: "syllabus", label: "Syllabus Books", icon: <BookOpen className="h-4 w-4" />, count: SYLLABUS_BOOKS.length },
  { id: "teacher", label: "Teacher Resources", icon: <Users className="h-4 w-4" />, count: TEACHER_RESOURCES.length },
  { id: "mine", label: "My Resources", icon: <FolderOpen className="h-4 w-4" />, count: MY_RESOURCES.length },
  { id: "papers", label: "Previous Papers", icon: <FileText className="h-4 w-4" />, count: PREVIOUS_PAPERS.length },
  { id: "saved", label: "Saved AI Guides", icon: <Sparkles className="h-4 w-4" />, count: SAVED_AI_GUIDES.length },
];

const FILTER_OPTIONS = ["All", "PDF", "Documents", "Links", "Videos", "Books", "Teacher", "My Resources"];

function StudyResourcesPage() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("syllabus");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [bookmarks, setBookmarks] = useState<Set<string>>(
    new Set(ALL_RESOURCES.filter((r) => r.bookmarked).map((r) => r.id))
  );
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [aiSidebarResource, setAiSidebarResource] = useState<Resource | null>(null);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getTabResources = (): Resource[] => {
    switch (activeTab) {
      case "syllabus": return SYLLABUS_BOOKS;
      case "teacher": return TEACHER_RESOURCES;
      case "mine": return MY_RESOURCES;
      case "papers": return PREVIOUS_PAPERS;
      case "saved": return SAVED_AI_GUIDES;
    }
  };

  const filtered = useMemo(() => {
    let resources = getTabResources();
    if (showBookmarksOnly) resources = resources.filter((r) => bookmarks.has(r.id));
    if (filter !== "All") {
      if (filter === "PDF") resources = resources.filter((r) => r.type === "pdf");
      else if (filter === "Documents") resources = resources.filter((r) => r.type === "pdf" || r.type === "docx" || r.type === "ppt");
      else if (filter === "Links") resources = resources.filter((r) => r.type === "link");
      else if (filter === "Videos") resources = resources.filter((r) => r.type === "video");
      else if (filter === "Books") resources = resources.filter((r) => r.type === "pdf" && r.board);
      else if (filter === "Teacher") resources = resources.filter((r) => r.uploadedBy !== "Me" && r.uploadedBy !== "AI Assistant" && r.uploadedBy !== "School Administration");
      else if (filter === "My Resources") resources = resources.filter((r) => r.uploadedBy === "Me");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      resources = resources.filter(
        (r) => r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) ||
          r.uploadedBy.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return resources;
  }, [activeTab, search, filter, bookmarks, showBookmarksOnly]);

  const metrics = useMemo(() => ({
    total: ALL_RESOURCES.length,
    books: SYLLABUS_BOOKS.length,
    teacher: TEACHER_RESOURCES.length,
    mine: MY_RESOURCES.length,
  }), []);

  return (
    <div className="space-y-6 p-6 pb-20 md:p-8">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
            <Library className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Study Resources</h1>
            <p className="text-sm text-muted-foreground">Access books, notes, learning materials, and AI-powered study assistance.</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <MetricCard icon={<Library className="h-5 w-5 text-blue-400" />} label="Total Resources" value={metrics.total} accent="from-blue-500 to-indigo-600" />
        <MetricCard icon={<BookOpen className="h-5 w-5 text-emerald-400" />} label="Books Available" value={metrics.books} accent="from-emerald-500 to-green-600" />
        <MetricCard icon={<Users className="h-5 w-5 text-violet-400" />} label="Teacher Resources" value={metrics.teacher} accent="from-violet-500 to-purple-600" />
        <MetricCard icon={<FolderOpen className="h-5 w-5 text-amber-400" />} label="My Resources" value={metrics.mine} accent="from-amber-500 to-orange-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {TAB_LIST.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(""); setFilter("All"); setShowBookmarksOnly(false); }}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
            <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === tab.id ? "bg-primary-foreground/20" : "bg-muted"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              showBookmarksOnly ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Star className={`h-3 w-3 ${showBookmarksOnly ? "fill-amber-400" : ""}`} /> Bookmarked
          </button>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                filter === opt ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border/50 bg-muted/30 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-72"
          />
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <Card className="col-span-full border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
                <Library className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium text-foreground/80">No resources found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              bookmarked={bookmarks.has(resource.id)}
              onToggleBookmark={() => toggleBookmark(resource.id)}
              onSelect={() => setSelectedResource(resource)}
              onOpenAi={() => setAiSidebarResource(resource)}
            />
          ))
        )}
      </div>

      {/* Resource Detail Sheet */}
      <Sheet open={!!selectedResource} onOpenChange={(o) => !o && setSelectedResource(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedResource && (
            <ResourceDetail
              resource={selectedResource}
              bookmarked={bookmarks.has(selectedResource.id)}
              onToggleBookmark={() => toggleBookmark(selectedResource.id)}
              onOpenAi={() => { setAiSidebarResource(selectedResource); setSelectedResource(null); }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* AI Sidebar */}
      <Sheet open={!!aiSidebarResource} onOpenChange={(o) => !o && setAiSidebarResource(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {aiSidebarResource && <AiSidebar resource={aiSidebarResource} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MetricCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: string }) {
  return (
    <Card className="relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-xl`} />
        <div className="relative flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accent} shadow-lg`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceCard({ resource, bookmarked, onToggleBookmark, onSelect, onOpenAi }: {
  resource: Resource; bookmarked: boolean; onToggleBookmark: () => void; onSelect: () => void; onOpenAi: () => void;
}) {
  const ft = FILE_TYPE_CONFIG[resource.type];
  return (
    <Card className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ft.bg} text-lg`}>{ft.icon}</div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{resource.subject}</p>
              <Badge variant="outline" className={`mt-0.5 ${ft.bg} ${ft.color} border text-[10px]`}>{ft.label}</Badge>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }} className="text-muted-foreground hover:text-amber-400 transition-colors">
            <Star className={`h-4 w-4 ${bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{resource.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{resource.uploadedBy}</span>
          <span>{resource.uploadDate}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={onSelect}>
            <Eye className="h-3.5 w-3.5" /> Open
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={(e) => e.stopPropagation()}>
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10" onClick={(e) => { e.stopPropagation(); onOpenAi(); }}>
            <Sparkles className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ResourceDetail({ resource, bookmarked, onToggleBookmark, onOpenAi }: {
  resource: Resource; bookmarked: boolean; onToggleBookmark: () => void; onOpenAi: () => void;
}) {
  const ft = FILE_TYPE_CONFIG[resource.type];
  return (
    <div className="space-y-6">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2 text-lg">
          <span className="text-xl">{ft.icon}</span>
          Resource Details
        </SheetTitle>
        <SheetDescription>Preview and manage this resource</SheetDescription>
      </SheetHeader>

      <div className="space-y-5">
        <div className="rounded-xl border border-border/40 bg-muted/30 p-5 text-center space-y-2">
          <div className="text-4xl">{ft.icon}</div>
          <Badge variant="outline" className={`${ft.bg} ${ft.color} border`}>{ft.label}</Badge>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">{resource.title}</h2>
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Subject</p>
            <p className="text-sm text-foreground">{resource.subject}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Uploaded By</p>
            <p className="text-sm text-foreground">{resource.uploadedBy}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</p>
            <p className="text-sm text-foreground">{resource.uploadDate}</p>
          </div>
          {resource.size && (
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Size</p>
              <p className="text-sm text-foreground">{resource.size}</p>
            </div>
          )}
          {resource.class && (
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Class</p>
              <p className="text-sm text-foreground">{resource.class}</p>
            </div>
          )}
          {resource.board && (
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Board</p>
              <p className="text-sm text-foreground">{resource.board}</p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <Button className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700">
            <Download className="h-4 w-4" /> Download Resource
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={onToggleBookmark}>
            <Star className={`h-4 w-4 ${bookmarked ? "fill-amber-400 text-amber-400" : ""}`} />
            {bookmarked ? "Bookmarked" : "Bookmark Resource"}
          </Button>
          <Button variant="outline" className="w-full gap-2 border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300" onClick={onOpenAi}>
            <Sparkles className="h-4 w-4" /> Open with AI
          </Button>
        </div>
      </div>
    </div>
  );
}

function AiSidebar({ resource }: { resource: Resource }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: `I can help you study "${resource.title}". What would you like to do?` },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const AI_ACTIONS = [
    "Summarize Resource",
    "Generate Notes",
    "Create Flashcards",
    "Create Quiz",
    "Important Questions",
    "Explain Concepts",
    "Create Study Plan",
    "Extract Key Points",
  ];

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = msg.toLowerCase();
      let response = "";

      if (lower.includes("summarize") || lower.includes("summary")) {
        response = `Summary of "${resource.title}":\n\nThis resource covers key concepts in ${resource.subject}. It includes foundational theory, practical examples, and application-based problems. Focus on understanding the core principles rather than memorizing formulas.`;
      } else if (lower.includes("notes") || lower.includes("note")) {
        response = `Study Notes for "${resource.title}":\n\n1. Key Definitions\n2. Core Concepts\n3. Important Formulas/Theorems\n4. Solved Examples\n5. Practice Problems\n6. Quick Revision Points\n\nThese notes are optimized for ${resource.subject} exam preparation.`;
      } else if (lower.includes("flashcard") || lower.includes("flash")) {
        response = `Flashcards created for "${resource.title}":\n\nCard 1: Key Term → Definition\nCard 2: Formula → Application\nCard 3: Concept → Real-world Example\nCard 4: Theorem → Proof Summary\nCard 5: Important Date → Event\n\nTotal: 20 flashcards generated across all topics.`;
      } else if (lower.includes("quiz") || lower.includes("test")) {
        response = `Quiz generated from "${resource.title}":\n\nQ1: Multiple Choice (Easy)\nQ2: Short Answer (Medium)\nQ3: Long Answer (Hard)\nQ4: True/False (Easy)\nQ5: Application-based (Medium)\n\nTotal: 15 questions covering all topics.`;
      } else if (lower.includes("important") || lower.includes("exam")) {
        response = `Important questions from "${resource.title}":\n\n1. Define and explain key concept (5 marks)\n2. Derive the formula with proof (4 marks)\n3. Application-based problem (3 marks)\n4. Compare and contrast (4 marks)\n5. Real-world application (5 marks)\n\nThese are frequently asked in board exams.`;
      } else if (lower.includes("explain") || lower.includes("concept")) {
        response = `Explanation for "${resource.title}":\n\nLet me break this down simply:\n\nThe core concept involves understanding how ${resource.subject} principles apply in practice. Start with the basics, build understanding progressively, and connect theory to real examples.`;
      } else if (lower.includes("study plan") || lower.includes("plan")) {
        response = `Study Plan for "${resource.title}":\n\nDay 1-2: Read and understand basics\nDay 3-4: Practice solved examples\nDay 5-6: Solve exercise problems\nDay 7: Revision and self-test\nDay 8: Focus on weak areas\nDay 9: Mock test\nDay 10: Final review`;
      } else {
        response = `I can help you with "${resource.title}" in ${resource.subject}. Try asking me to:\n\n- Summarize the content\n- Generate study notes\n- Create flashcards\n- Make a practice quiz\n- List important questions\n- Create a study plan`;
      }

      setMessages((prev) => [...prev, { role: "ai", text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          AI Study Assistant
        </SheetTitle>
        <SheetDescription>AI-powered learning for this resource</SheetDescription>
      </SheetHeader>

      <div className="mt-4 flex-1 overflow-y-auto space-y-4">
        {/* Resource Context */}
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">{resource.title}</p>
          <p className="text-xs text-muted-foreground">{resource.subject} — {resource.uploadedBy}</p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {AI_ACTIONS.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="rounded-xl border border-border/40 bg-muted/30 px-3 py-2 text-left text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Chat Messages */}
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground"
              }`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
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
          placeholder="Ask about this resource..."
          className="flex-1 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button
          size="icon"
          className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-600 hover:to-purple-700"
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
