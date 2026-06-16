import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";
import { AdminComingSoon } from "@/components/scholarii/AdminComingSoon";

export const Route = createFileRoute("/app/admin/brain")({
  component: () => (
    <AdminComingSoon
      title="School Brain"
      subtitle="Centralize school knowledge and institutional context"
      icon={BrainCircuit}
    />
  ),
});
