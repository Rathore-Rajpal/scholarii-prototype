import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Megaphone } from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/app/announcements")({ component: AnnouncementsPage });

function AnnouncementsPage() {
  const data = useMemo(() => loadData(), []);
  return (
    <div>
      <PageHeader title="Announcements" subtitle="School-wide notices and updates." action={<NewAnnouncement />} />
      <div className="space-y-3 sm:space-y-4">
        {data.announcements.map((a) => (
          <Card key={a.id} className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="size-9 rounded-xl bg-brand-gradient grid place-items-center text-white shrink-0 sm:size-10">
                <Megaphone className="size-4 sm:size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{a.title}</h3>
                  <Badge variant={a.priority === "Urgent" ? "destructive" : a.priority === "Important" ? "default" : "secondary"} className={a.priority === "Important" ? "bg-brand-gradient border-0" : ""}>{a.priority}</Badge>
                  <Badge variant="outline">{a.audience}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{a.message}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                  <span>{format(new Date(a.date), "PPP")}</span>
                  <span className="flex items-center gap-1"><Eye className="size-3" />{a.reads} of {a.recipients} read</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NewAnnouncement() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-brand-gradient text-white border-0"><Plus className="size-4 mr-1" />New Announcement</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); toast.success("Announcement sent (demo)"); setOpen(false); }}>
          <div className="space-y-1.5"><Label>Title</Label><Input required /></div>
          <div className="space-y-1.5"><Label>Message</Label><Textarea rows={4} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Audience</Label>
              <Select defaultValue="All"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Students">Students</SelectItem>
                  <SelectItem value="Teachers">Teachers</SelectItem>
                  <SelectItem value="Parents">Parents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Priority</Label>
              <Select defaultValue="Normal"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Important">Important</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-brand-gradient text-white border-0">Send</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
