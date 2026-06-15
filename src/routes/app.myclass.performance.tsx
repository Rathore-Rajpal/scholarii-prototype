import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/app/myclass/performance")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Performance"
        subtitle="Analyze subject trends, identify top performers, track weak areas, and get AI insights."
        icon={Activity}
      />
    </RoleGuard>
  ),
});
