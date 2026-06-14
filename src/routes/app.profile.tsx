import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/scholarii/RoleGuard";
import { UserCircle } from "lucide-react";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

function ProfilePage() {
  return (
    <PlaceholderPage
      title="Profile"
      subtitle="View and manage your personal information, preferences, and account settings."
      icon={UserCircle}
    />
  );
}
