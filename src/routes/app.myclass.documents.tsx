import { createFileRoute } from "@tanstack/react-router";
import { RoleGuard, PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/app/myclass/documents")({
  component: () => (
    <RoleGuard allowedRoles={["teacher"]}>
      <PlaceholderPage
        title="Documents"
        subtitle="Manage student documents, track pending verifications, and view verified documents."
        icon={FileText}
      />
    </RoleGuard>
  ),
});
