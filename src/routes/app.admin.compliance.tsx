import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { AdminComingSoon } from "@/components/scholarii/AdminComingSoon";

export const Route = createFileRoute("/app/admin/compliance")({
  component: () => (
    <AdminComingSoon
      title="Compliance"
      subtitle="Track statutory requirements and school compliance"
      icon={ShieldCheck}
    />
  ),
});
