import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/scholarii/auth";
import { Moon, Sun, Bell, Lock, Globe, Building2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { theme, toggleTheme } = useAuth();
  const setTheme = (t: "light" | "dark") => { if (t !== theme) toggleTheme(); };
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your school and personal preferences." />
      <Tabs defaultValue="general" className="grid lg:grid-cols-[220px_1fr] gap-6">
        <TabsList className="flex lg:flex-col h-auto bg-transparent p-0 gap-1 justify-start">
          {[
            { v: "general", l: "General", i: Building2 },
            { v: "appearance", l: "Appearance", i: Sun },
            { v: "notifications", l: "Notifications", i: Bell },
            { v: "security", l: "Security", i: Lock },
            { v: "locale", l: "Locale", i: Globe },
          ].map((t) => (
            <TabsTrigger key={t.v} value={t.v} className="w-full justify-start data-[state=active]:bg-muted"><t.i className="size-4 mr-2" />{t.l}</TabsTrigger>
          ))}
        </TabsList>

        <div>
          <TabsContent value="general"><Card className="p-6 space-y-5">
            <div><h3 className="font-semibold">School information</h3><p className="text-xs text-muted-foreground">Public details shown across the app.</p></div>
            <Separator />
            <Row label="School name"><Input defaultValue="Scholarii Academy" /></Row>
            <Row label="Academic year"><Input defaultValue="2025–2026" /></Row>
            <Row label="Principal"><Input defaultValue="Dr. Rajesh Kumar" /></Row>
            <Row label="Contact email"><Input type="email" defaultValue="office@scholarii.school" /></Row>
            <div className="flex justify-end"><Button className="bg-brand-gradient text-white border-0" onClick={() => toast.success("Settings saved")}>Save changes</Button></div>
          </Card></TabsContent>

          <TabsContent value="appearance"><Card className="p-6 space-y-5">
            <div><h3 className="font-semibold">Appearance</h3><p className="text-xs text-muted-foreground">Switch theme and density.</p></div>
            <Separator />
            <div className="flex gap-3">
              <button onClick={() => setTheme("light")} className={`flex-1 p-4 rounded-xl border-2 ${theme === "light" ? "border-primary" : "border-border"}`}><Sun className="size-5 mb-2" /><div className="font-medium text-sm">Light</div></button>
              <button onClick={() => setTheme("dark")} className={`flex-1 p-4 rounded-xl border-2 ${theme === "dark" ? "border-primary" : "border-border"}`}><Moon className="size-5 mb-2" /><div className="font-medium text-sm">Dark</div></button>
            </div>
            <Row label="Accent gradient">
              <div className="flex gap-2">{["from-violet-500 to-fuchsia-500", "from-sky-500 to-indigo-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500"].map((g) => <div key={g} className={`size-9 rounded-lg bg-gradient-to-br ${g} cursor-pointer ring-offset-2 ring-2 ring-transparent hover:ring-primary`} />)}</div>
            </Row>
          </Card></TabsContent>

          <TabsContent value="notifications"><Card className="p-6 space-y-4">
            <div><h3 className="font-semibold">Notifications</h3><p className="text-xs text-muted-foreground">Channels and event preferences.</p></div>
            <Separator />
            {[
              { l: "Email notifications", d: "Daily summaries and alerts" },
              { l: "SMS for urgent only", d: "Emergencies and absences" },
              { l: "Push notifications", d: "Real-time browser & app" },
              { l: "Weekly digest", d: "Sunday 8 AM recap" },
            ].map((s) => (
              <div key={s.l} className="flex items-center justify-between">
                <div><div className="font-medium text-sm">{s.l}</div><div className="text-xs text-muted-foreground">{s.d}</div></div>
                <Switch defaultChecked />
              </div>
            ))}
          </Card></TabsContent>

          <TabsContent value="security"><Card className="p-6 space-y-5">
            <div><h3 className="font-semibold">Security</h3><p className="text-xs text-muted-foreground">Account protection.</p></div>
            <Separator />
            <Row label="Current password"><Input type="password" placeholder="••••••••" /></Row>
            <Row label="New password"><Input type="password" placeholder="At least 8 characters" /></Row>
            <Row label="Confirm new password"><Input type="password" /></Row>
            <div className="flex items-center justify-between"><div><div className="font-medium text-sm">Two-factor authentication</div><div className="text-xs text-muted-foreground">Add an extra layer at sign-in</div></div><Switch /></div>
            <div className="flex justify-end"><Button className="bg-brand-gradient text-white border-0">Update password</Button></div>
          </Card></TabsContent>

          <TabsContent value="locale"><Card className="p-6 space-y-5">
            <div><h3 className="font-semibold">Locale</h3><p className="text-xs text-muted-foreground">Language, region and date format.</p></div>
            <Separator />
            <Row label="Language"><Select defaultValue="en"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">Hindi</SelectItem></SelectContent></Select></Row>
            <Row label="Timezone"><Select defaultValue="ist"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ist">Asia/Kolkata (IST)</SelectItem><SelectItem value="utc">UTC</SelectItem></SelectContent></Select></Row>
            <Row label="Date format"><Select defaultValue="dmy"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dmy">DD/MM/YYYY</SelectItem><SelectItem value="mdy">MM/DD/YYYY</SelectItem></SelectContent></Select></Row>
          </Card></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[200px_1fr] gap-2 sm:items-center">
      <Label>{label}</Label>
      <div>{children}</div>
    </div>
  );
}
