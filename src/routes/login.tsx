import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type ComponentProps, type ComponentType, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useAuth, DEMO_PASSWORD, DEMO_USERS } from "@/lib/scholarii/auth";
import type { Role } from "@/lib/scholarii/types";
import { toast } from "sonner";
import {
  ArrowRight,
  Bot,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import scholariiLogoUrl from "../../Logo-2/Logo-2(WhiteBgBlackColor)-bgremoved.png?url";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login - Scholarii" }] }),
  component: LoginPage,
});

const featurePills = ["AI-native workflows", "Parent communication", "Attendance intelligence"];

function LoginPage() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("principal");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [spotlight, setSpotlight] = useState({ x: "70%", y: "36%" });

  useEffect(() => {
    if (user) nav({ to: "/app" });
  }, [user, nav]);

  const fillDemo = (selectedRole: Role) => {
    setRole(selectedRole);
    setEmail(DEMO_USERS[selectedRole].email);
    setPassword(DEMO_PASSWORD);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password, role);
      setLoading(false);
      if (!res.ok) {
        toast.error(res.error || "Login failed");
        return;
      }
      toast.success(`Welcome, ${DEMO_USERS[role].name.split(" ")[0]}!`);
      nav({ to: "/app" });
    }, 450);
  };

  return (
    <div
      className="relative h-screen overflow-hidden bg-background"
      style={
        {
          "--spotlight-x": spotlight.x,
          "--spotlight-y": spotlight.y,
        } as CSSProperties
      }
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSpotlight({
          x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
          y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
        });
      }}
    >
      <div className="absolute inset-0 bg-mesh-soft" />
      <div className="absolute inset-0 bg-noise-soft" />
      <div className="absolute inset-0 spotlight opacity-70" />
      <div className="absolute inset-0 bg-hero-grid opacity-35" />
      <div className="absolute -left-28 top-10 size-[26rem] rounded-full bg-brand-gradient opacity-12 blur-3xl float-slow" />
      <div className="absolute left-[18%] top-[20%] size-[18rem] rounded-full bg-primary/10 blur-3xl float-slower" />
      <div className="absolute right-[-6rem] top-[-4rem] size-[22rem] rounded-full bg-brand-gradient opacity-12 blur-3xl float-slower" />
      <div className="absolute bottom-[-6rem] left-[38%] size-[20rem] rounded-full bg-info/14 blur-3xl float-slow" />

      <div className="relative mx-auto flex h-full w-full max-w-[1500px] items-center px-4 py-0 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid w-full items-center gap-0 grid-cols-1 xl:grid-cols-2 xl:gap-0">
          <section className="hidden xl:flex items-center justify-start h-screen">
            <div className="relative flex max-w-[520px] flex-col items-start text-left">
              <div className="pointer-events-none absolute -left-16 top-12 h-48 w-48 rounded-full bg-brand-gradient opacity-10 blur-3xl" />
              <div className="pointer-events-none absolute left-16 top-32 h-32 w-32 rounded-full bg-info/12 blur-3xl" />
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-brand-gradient opacity-30 blur-2xl pulse-glow" />
                <img src={scholariiLogoUrl} alt="Scholarii logo" className="relative h-24 w-auto object-contain" />
              </div>

              <div className="mt-7 flex flex-nowrap gap-2">
                {featurePills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/45 bg-white/48 px-4 py-2 text-sm font-semibold tracking-[0.15em] text-foreground/70 uppercase shadow-[0_10px_30px_-22px_rgba(40,24,90,0.35)] backdrop-blur-md dark:border-white/10 dark:bg-white/8"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="relative mt-8">
                <p className="text-lg font-semibold tracking-[0.22em] text-primary uppercase">School Operating System</p>
                <h1 className="mt-3 max-w-[11ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-foreground">
                  Run your entire school with clarity.
                </h1>
                <p className="mt-4 max-w-[34rem] text-lg leading-6 text-muted-foreground/95">
                  Scholarii brings operations, communication, attendance, and AI assistance into one workspace.
                </p>
              </div>

              <div className="mt-8 grid w-full max-w-[38rem] gap-3 sm:grid-cols-3">
                <StatTile value="50+" label="connected workflows" />
                <StatTile value="24/7" label="AI support layer" />
                <StatTile value="99.9%" label="reliable uptime" />
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center h-screen">
            <div className="w-full max-w-[500px]">
              <div className="mb-4 flex justify-center lg:hidden">
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-full bg-brand-gradient opacity-30 blur-2xl pulse-glow" />
                  <img src={scholariiLogoUrl} alt="Scholarii logo" className="relative h-12 w-auto object-contain" />
                </div>
              </div>

      {/* Right form */}
      <Card>
        <div className="flex items-center justify-center p-3 lg:p-8 bg-background">
          <div className="w-full max-w-md">
            <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="size-8 rounded-lg bg-brand-gradient grid place-items-center text-white font-bold">S</div>
            <span className="font-semibold">Scholarii</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1.5">Sign in to continue to your dashboard.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input className="pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.com" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input className="pl-9" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Password reset is demo-only."); }} className="text-primary hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-brand-gradient text-white border-0 hover:opacity-90 shadow-glow">
              {loading ? "Signing in..." : (<>Sign in <ArrowRight className="size-4 ml-1" /></>)}
            </Button>
          </form>

                  <div className="my-3 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Instant demo access
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>

                  <div className="rounded-[20px] border border-white/50 bg-white/48 p-3 shadow-[0_16px_40px_-28px_rgba(40,24,90,0.26)] backdrop-blur-sm dark:border-white/10 dark:bg-white/6">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Demo credentials</div>
                        <p className="mt-1 text-xs leading-4 text-muted-foreground">
                          Password: <span className="font-mono font-semibold text-foreground">{DEMO_PASSWORD}</span>
                        </p>
                      </div>
                      <div className="hidden items-center gap-1.5 rounded-full border border-white/45 bg-white/65 px-2 py-0.5 text-[10px] text-foreground/80 shadow-soft sm:inline-flex dark:border-white/10 dark:bg-white/10">
                        <Bot className="size-3 text-primary" />
                        <span className="text-[9px]">AI ready</span>
                      </div>
                    </div>

                    <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                      {(Object.keys(DEMO_USERS) as Role[]).map((demoRole) => (
                        <button
                          key={demoRole}
                          type="button"
                          onClick={() => fillDemo(demoRole)}
                          className="group flex items-center justify-between rounded-[12px] border border-white/55 bg-white/72 px-3 py-2 text-left transition-all duration-200 hover:border-primary/35 hover:shadow-[0_6px_12px_-10px_rgba(40,24,90,0.24)] dark:border-white/10 dark:bg-white/10"
                        >
                          <div className="min-w-0">
                            <div className="text-sm font-semibold capitalize text-foreground">{demoRole}</div>
                          </div>
                          <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function FloatingInput({
  id,
  label,
  icon: Icon,
  trailingButton,
  className,
  ...props
}: ComponentProps<typeof Input> & {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  trailingButton?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="group relative">
        <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-brand-gradient opacity-0 blur-xl transition-opacity duration-300 group-focus-within:opacity-18" />
        <div className="relative">
          <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
          <Input
            id={id}
            placeholder=" "
            className={[
              "peer h-10 rounded-[16px] border-white/55 bg-white/75 pl-10 pr-10 text-sm shadow-[0_10px_26px_-20px_rgba(30,20,70,0.28)] backdrop-blur-sm transition-all duration-200 hover:border-primary/25 focus-visible:border-primary/40 focus-visible:ring-0 dark:border-white/10 dark:bg-white/8",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          <span className="pointer-events-none absolute left-12 top-1/2 z-10 -translate-y-1/2 px-1 text-sm text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-1/2 peer-focus:top-3 peer-focus:text-xs peer-focus:font-semibold peer-focus:tracking-[0.12em] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:tracking-[0.12em]">
            {label}
          </span>
          {trailingButton ? <div className="absolute right-2 top-1/2 -translate-y-1/2">{trailingButton}</div> : null}
        </div>
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[18px] border border-white/45 bg-white/42 px-4 py-3 shadow-[0_12px_28px_-24px_rgba(40,24,90,0.26)] backdrop-blur-md dark:border-white/10 dark:bg-white/8">
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
