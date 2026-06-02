import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/scholarii/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  const initials = user.name.split(" ").map(s => s[0]).slice(0, 2).join("");
  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information and preferences." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 text-center lg:col-span-1">
          <Avatar className="size-24 mx-auto">
            <AvatarFallback style={{ backgroundColor: user.avatarColor, color: "white" }} className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold mt-4">{user.name}</h3>
          <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
          <Button variant="outline" size="sm" className="mt-4">Change photo</Button>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Personal Information</h3>
          <form className="grid sm:grid-cols-2 gap-3" onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }}>
            <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue={user.name} /></div>
            <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={user.email} /></div>
            <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
            <div className="space-y-1.5"><Label>Role</Label><Input defaultValue={user.role} disabled className="capitalize" /></div>
            <div className="col-span-2 flex justify-end">
              <Button type="submit" className="bg-brand-gradient text-white border-0">Save changes</Button>
            </div>
          </form>
        </Card>
      </div>
      <Card className="p-6 mt-4">
        <h3 className="font-semibold mb-4">Change password</h3>
        <form className="grid sm:grid-cols-3 gap-3 max-w-3xl" onSubmit={(e) => { e.preventDefault(); toast.success("Password updated"); }}>
          <div className="space-y-1.5"><Label>Current password</Label><Input type="password" /></div>
          <div className="space-y-1.5"><Label>New password</Label><Input type="password" /></div>
          <div className="space-y-1.5"><Label>Confirm new</Label><Input type="password" /></div>
          <div className="col-span-3 flex justify-end">
            <Button type="submit" variant="outline">Update password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
