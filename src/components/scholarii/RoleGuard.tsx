import { useAuth } from "@/lib/scholarii/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles?: string[];
  allowParentMode?: boolean;
};

export function RoleGuard({ children, allowedRoles = ["principal", "teacher", "admin"], allowParentMode = false }: RoleGuardProps) {
  const { user, parentMode } = useAuth();
  const nav = useNavigate();

  const isStudentOrParent = user?.role === "student" && (parentMode || allowParentMode === false);
  const isBlocked = user && !allowedRoles.includes(user.role) && !(user.role === "student" && allowParentMode);

  useEffect(() => {
    if (isBlocked) {
      nav({ to: "/app" });
    }
  }, [isBlocked, nav]);

  if (isBlocked) return null;
  return <>{children}</>;
}

export function PlaceholderPage({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted-foreground/20 bg-muted/20 rounded-2xl">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center mb-4">
          <Icon className="size-8" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          {subtitle} This feature is currently under development.
        </p>
      </div>
    </div>
  );
}
