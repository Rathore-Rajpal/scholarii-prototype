import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { ScrollText } from "lucide-react";

export const Route = createFileRoute("/app/leaves")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Leaves"
        subtitle="Apply for leave, track leave balance, and view leave history. Manage substitute teacher assignments."
        icon={ScrollText}
      />
    </RoleGuard>
  ),
});
