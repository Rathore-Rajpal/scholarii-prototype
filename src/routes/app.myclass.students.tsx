import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { Users } from "lucide-react";

export const Route = createFileRoute("/app/myclass/students")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Students"
        subtitle="View student directory, track weak students, top performers, and at-risk students."
        icon={Users}
      />
    </RoleGuard>
  ),
});
