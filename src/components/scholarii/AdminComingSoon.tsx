import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/scholarii/AppShell";

export function AdminComingSoon({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}) {
  return (
    <div className="-m-4 min-h-full bg-gray-50 p-4 text-gray-900 lg:-m-8 lg:p-8">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid min-h-[calc(100vh-13rem)] place-items-center">
        <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-violet-50 text-violet-600">
            <Icon className="size-8" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-gray-900">Building {title}...</h2>
          <p className="mt-2 text-sm text-gray-500">This section is being set up</p>
        </div>
      </div>
    </div>
  );
}
