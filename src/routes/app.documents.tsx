import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/app/documents")({ component: DocumentsPage });

function DocumentsPage() {
  return (
    <PlaceholderPage
      title="Documents"
      subtitle="Access your report cards, circulars, school calendar, and important documents."
      icon={FileText}
    />
  );
}
