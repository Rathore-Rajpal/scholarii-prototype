import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AdminComingSoon } from "@/components/scholarii/AdminComingSoon";

export const Route = createFileRoute("/app/admin/ai")({
  component: () => (
    <AdminComingSoon
      title="Scholarii AI"
      subtitle="Use AI assistance across administrative workflows"
      icon={Sparkles}
    />
  ),
});
