import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/app/myclass/exams")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Exams & Results"
        subtitle="View exam schedules, enter results, and generate performance reports for your class."
        icon={GraduationCap}
      />
    </RoleGuard>
  ),
});
