import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { Megaphone } from "lucide-react";

export const Route = createFileRoute("/app/myclass/notices")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Notices"
        subtitle="Create class-specific notices, parent notices, and PTA notices."
        icon={Megaphone}
      />
    </RoleGuard>
  ),
});
