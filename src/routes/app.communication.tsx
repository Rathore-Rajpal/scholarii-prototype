import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Paperclip, Phone, Video } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/communication")({ component: CommunicationPage });

const threads = [
  { id: 1, name: "Priya Sharma", role: "Parent · Aarav (8-A)", last: "Thank you for the update!", time: "2m", unread: 2, color: "#667eea" },
  { id: 2, name: "Class 9-A Group", role: "32 members", last: "Reminder: Science fair on Friday", time: "1h", unread: 0, color: "#10b981" },
  { id: 3, name: "Rahul Verma", role: "Teacher · Math", last: "Sharing the syllabus draft.", time: "3h", unread: 0, color: "#f59e0b" },
  { id: 4, name: "Admin Office", role: "Staff", last: "Please submit attendance.", time: "Yest", unread: 1, color: "#ec4899" },
  { id: 5, name: "Anita Iyer", role: "Parent · Diya (5-B)", last: "Will pay fees tomorrow.", time: "Yest", unread: 0, color: "#8b5cf6" },
];

const messages = [
  { me: false, t: "Hi! Thanks for the progress update.", at: "10:14" },
  { me: false, t: "Aarav has really improved in maths.", at: "10:14" },
  { me: true, t: "He's been doing great! Keep encouraging the daily practice.", at: "10:16" },
  { me: false, t: "Will do. Thank you for the update!", at: "10:18" },
];

function CommunicationPage() {
  const [active, setActive] = useState(1);
  const [draft, setDraft] = useState("");
  const cur = threads.find((t) => t.id === active)!;

  return (
    <div>
      <PageHeader title="Communication" subtitle="Messages, group chats and notices in one place." />
      <Card className="overflow-hidden grid md:grid-cols-[320px_1fr] h-[640px]">
        <div className="border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search messages..." /></div>
          </div>
          <div className="overflow-y-auto">
            {threads.map((t) => (
              <button key={t.id} onClick={() => setActive(t.id)} className={`w-full flex gap-3 p-3 text-left hover:bg-muted/60 transition ${active === t.id ? "bg-muted" : ""}`}>
                <Avatar className="size-10"><AvatarFallback style={{ backgroundColor: t.color, color: "white" }}>{t.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between"><div className="font-medium truncate">{t.name}</div><div className="text-[10px] text-muted-foreground">{t.time}</div></div>
                  <div className="text-xs text-muted-foreground truncate">{t.last}</div>
                </div>
                {t.unread > 0 && <Badge className="bg-brand-gradient text-white border-0 self-center h-5 px-1.5 text-[10px]">{t.unread}</Badge>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Avatar className="size-10"><AvatarFallback style={{ backgroundColor: cur.color, color: "white" }}>{cur.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
            <div className="flex-1"><div className="font-semibold">{cur.name}</div><div className="text-xs text-muted-foreground">{cur.role}</div></div>
            <Button variant="ghost" size="icon"><Phone className="size-4" /></Button>
            <Button variant="ghost" size="icon"><Video className="size-4" /></Button>
          </div>
          <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-muted/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${m.me ? "bg-brand-gradient text-white" : "bg-card border border-border"}`}>
                  <div className="text-sm">{m.t}</div>
                  <div className={`text-[10px] mt-1 ${m.me ? "text-white/70" : "text-muted-foreground"}`}>{m.at}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <Button variant="ghost" size="icon"><Paperclip className="size-4" /></Button>
            <Input placeholder="Type a message..." value={draft} onChange={(e) => setDraft(e.target.value)} />
            <Button className="bg-brand-gradient text-white border-0" onClick={() => setDraft("")}><Send className="size-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
