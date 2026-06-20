import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  UserCircle, Edit3, Camera, Calendar, Phone, Mail, MapPin,
  Droplets, Shield, Key, Bell, Sun, Moon, Monitor,
  Lock, LogOut, CheckCircle2, TrendingUp, ClipboardCheck,
  CalendarClock, GraduationCap, Award, BookOpen, Hash,
  Briefcase, Users,
} from "lucide-react";
import { useAuth } from "@/lib/scholarii/auth";
import {
  STUDENT_PROFILE, ACADEMIC_SNAPSHOT,
  DEFAULT_NOTIFICATIONS, DEFAULT_SECURITY, DEFAULT_APPEARANCE,
} from "@/lib/scholarii/profile-mock-data";
import type {
  ProfileTab, NotificationSettings, SecuritySettings, AppearanceSettings,
} from "@/lib/scholarii/profile-mock-data";
import {
  TEACHER_PROFILE, DEFAULT_TEACHER_NOTIFICATIONS, DEFAULT_TEACHER_SECURITY, DEFAULT_TEACHER_APPEARANCE,
} from "@/lib/scholarii/teacher-profile-mock-data";
import type { TeacherProfileTab } from "@/lib/scholarii/teacher-profile-mock-data";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

interface RoleProfile {
  firstName: string;
  fullName: string;
  role: string;
  id: string;
  dateOfBirth: string;
  gender: string;
  mobileNumber: string;
  email: string;
  address: string;
  emergencyContact: string;
  bloodGroup: string;
  joinDate: string;
  department?: string;
  designation?: string;
  employeeId?: string;
  className?: string;
  section?: string;
  rollNumber?: string;
  admissionNumber?: string;
  academicYear?: string;
  board?: string;
  schoolName?: string;
  house?: string;
}

function getRoleProfiles(user: { name: string; role: string; email: string } | null): RoleProfile {
  if (!user) {
    return {
      firstName: "User",
      fullName: "Unknown User",
      role: "Unknown",
      id: "N/A",
      dateOfBirth: "2000-01-01",
      gender: "N/A",
      mobileNumber: "N/A",
      email: "N/A",
      address: "N/A",
      emergencyContact: "N/A",
      bloodGroup: "N/A",
      joinDate: "N/A",
    };
  }

  const base: RoleProfile = {
    firstName: user.name.split(" ")[0],
    fullName: user.name,
    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    id: user.email.split("@")[0].toUpperCase(),
    dateOfBirth: "1990-05-15",
    gender: "N/A",
    mobileNumber: "+91 98765 43210",
    email: user.email,
    address: "123 School Road, Bangalore, Karnataka 560001",
    emergencyContact: "+91 98765 43211",
    bloodGroup: "O+",
    joinDate: "2023-06-15",
  };

  if (user.role === "student") {
    return {
      ...base,
      className: "8",
      section: "A",
      rollNumber: "8A07",
      admissionNumber: "ADM-2024-0142",
      academicYear: "2026-2027",
      board: "CBSE",
      schoolName: "Scholarii International School",
      house: "Green House",
    };
  }

  if (user.role === "teacher") {
    return {
      ...base,
      department: "Mathematics",
      designation: "Senior Teacher",
      employeeId: "EMP-2023-0042",
    };
  }

  if (user.role === "principal") {
    return {
      ...base,
      department: "Administration",
      designation: "Principal",
      employeeId: "EMP-2020-0001",
    };
  }

  if (user.role === "admin") {
    return {
      ...base,
      department: "Administration",
      designation: "Admin Officer",
      employeeId: "EMP-2022-0015",
    };
  }

  return base;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function SettingToggle({ label, description, checked, onCheckedChange }: { label: string; description: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function TeacherProfilePage() {
  const [activeTab, setActiveTab] = useState<TeacherProfileTab>("personal");
  const [editOpen, setEditOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_TEACHER_NOTIFICATIONS);
  const [appearance, setAppearance] = useState(DEFAULT_TEACHER_APPEARANCE);

  const profile = TEACHER_PROFILE;

  const TAB_LIST: { id: TeacherProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Personal Information", icon: <UserCircle className="h-4 w-4" /> },
    { id: "professional", label: "Professional Information", icon: <Briefcase className="h-4 w-4" /> },
    { id: "settings", label: "Account Settings", icon: <Shield className="h-4 w-4" /> },
  ];

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6 p-6 pb-20 md:p-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-slate-500/25">
            <UserCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your profile and account settings.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-blue-500/25">
                {getInitials(profile.fullName)}
              </div>
              <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="text-xs">{profile.designation}</Badge>
                <span className="text-sm text-muted-foreground">{profile.employeeId}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.department} &middot; {profile.subjects.join(", ")}
              </p>
              {profile.isClassTeacher && (
                <Badge variant="outline" className="mt-2 border-blue-200 bg-blue-500/10 text-xs text-blue-700">
                  Class Teacher - {profile.classTeacherOf}
                </Badge>
              )}
            </div>
            <div className="sm:ml-auto">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Edit3 className="mr-1.5 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky top-0 z-30 -mx-6 bg-background/80 px-6 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex gap-1 border-b">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "personal" && (
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={<UserCircle className="h-4 w-4" />} label="Full Name" value={profile.fullName} />
              <Separator />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Address" value={profile.email} />
              <Separator />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone Number" value={profile.phone} />
              <Separator />
              <InfoRow icon={<UserCircle className="h-4 w-4" />} label="Gender" value={profile.gender} />
              <Separator />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={new Date(profile.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
              <Separator />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={profile.address} />
              <Separator />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Emergency Contact" value={profile.emergencyContact} />
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setEditOpen(true)}>
              <Edit3 className="mr-1.5 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex-1">
              <Camera className="mr-1.5 h-4 w-4" />
              Change Photo
            </Button>
          </div>
        </div>
      )}

      {activeTab === "professional" && (
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={<Hash className="h-4 w-4" />} label="Employee ID" value={profile.employeeId} />
              <Separator />
              <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Designation" value={profile.designation} />
              <Separator />
              <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Department" value={profile.department} />
              <Separator />
              <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Subjects Taught" value={profile.subjects.join(", ")} />
              <Separator />
              <InfoRow icon={<Users className="h-4 w-4" />} label="Assigned Classes" value={profile.assignedClasses.join(", ")} />
              <Separator />
              {profile.isClassTeacher && (
                <>
                  <InfoRow icon={<Award className="h-4 w-4" />} label="Class Teacher Of" value={profile.classTeacherOf || "N/A"} />
                  <Separator />
                </>
              )}
              <InfoRow icon={<TrendingUp className="h-4 w-4" />} label="Years of Experience" value={`${profile.yearsOfExperience} years`} />
              <Separator />
              <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Qualification" value={profile.qualification} />
              <Separator />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Joining Date" value={new Date(profile.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4 text-amber-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Last changed {new Date(DEFAULT_TEACHER_SECURITY.lastPasswordChange).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Key className="mr-1.5 h-3.5 w-3.5" />
                  Change
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Session Management</p>
                  <p className="text-xs text-muted-foreground">{DEFAULT_TEACHER_SECURITY.activeSessions} active session{DEFAULT_TEACHER_SECURITY.activeSessions !== 1 ? "s" : ""}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10 hover:text-red-600">
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Sign Out All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-blue-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingToggle
                label="Email Notifications"
                description="Receive updates via email"
                checked={notifications.emailNotifications}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, emailNotifications: v }))}
              />
              <Separator />
              <SettingToggle
                label="Push Notifications"
                description="Get notified on your device"
                checked={notifications.pushNotifications}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, pushNotifications: v }))}
              />
              <Separator />
              <SettingToggle
                label="Assignment Reminders"
                description="Remind before assignment deadlines"
                checked={notifications.assignmentReminders}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, assignmentReminders: v }))}
              />
              <Separator />
              <SettingToggle
                label="Exam Reminders"
                description="Remind before upcoming exams"
                checked={notifications.examReminders}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, examReminders: v }))}
              />
              <Separator />
              <SettingToggle
                label="Parent Messages"
                description="Get notified for parent messages"
                checked={notifications.parentMessages}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, parentMessages: v }))}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sun className="h-4 w-4 text-violet-500" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Theme Preference</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
                </div>
                <Select value={appearance.theme} onValueChange={(v) => setAppearance((p) => ({ ...p, theme: v as "light" | "dark" | "system" }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <span className="flex items-center gap-2"><Sun className="h-3.5 w-3.5" /> Light</span>
                    </SelectItem>
                    <SelectItem value="dark">
                      <span className="flex items-center gap-2"><Moon className="h-3.5 w-3.5" /> Dark</span>
                    </SelectItem>
                    <SelectItem value="system">
                      <span className="flex items-center gap-2"><Monitor className="h-3.5 w-3.5" /> System</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Language Preference</p>
                  <p className="text-xs text-muted-foreground">Select your preferred language</p>
                </div>
                <Select value={appearance.language} onValueChange={(v) => setAppearance((p) => ({ ...p, language: v }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Update your personal information</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={profile.fullName} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input defaultValue={profile.email} type="email" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input defaultValue={profile.phone} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select defaultValue={profile.gender.toLowerCase()}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" defaultValue={profile.dateOfBirth} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input defaultValue={profile.address} />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact</Label>
              <Input defaultValue={profile.emergencyContact} />
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700">
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  if (isTeacher) {
    return <TeacherProfilePage />;
  }

  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [editOpen, setEditOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);
  const [security] = useState<SecuritySettings>(DEFAULT_SECURITY);
  const [appearance, setAppearance] = useState<AppearanceSettings>(DEFAULT_APPEARANCE);

  const profile = useMemo(() => getRoleProfiles(user), [user]);
  const isStudent = user?.role === "student";

  const TAB_LIST: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Personal Information", icon: <UserCircle className="h-4 w-4" /> },
    ...(isStudent ? [{ id: "academic" as ProfileTab, label: "Academic Information", icon: <GraduationCap className="h-4 w-4" /> }] : []),
    { id: "settings", label: "Account Settings", icon: <Shield className="h-4 w-4" /> },
  ];

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getGradientByRole = (role: string) => {
    switch (role) {
      case "student": return "from-emerald-500 to-teal-600";
      case "teacher": return "from-blue-500 to-indigo-600";
      case "principal": return "from-violet-500 to-purple-600";
      case "admin": return "from-amber-500 to-orange-600";
      default: return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="space-y-6 p-6 pb-20 md:p-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${getGradientByRole(user?.role || "student")} shadow-lg shadow-slate-500/25`}>
            <UserCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground">
              {isStudent ? "View your profile and academic information." : "Manage your profile and account settings."}
            </p>
          </div>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${getGradientByRole(user?.role || "student")} text-2xl font-bold text-white shadow-lg shadow-blue-500/25`}>
                {getInitials(profile.fullName)}
              </div>
              <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="text-xs">{profile.role}</Badge>
                <span className="text-sm text-muted-foreground">{profile.id}</span>
              </div>
              {isStudent && profile.className && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Class {profile.className} &middot; Section {profile.section}
                </p>
              )}
              {!isStudent && profile.designation && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.designation} &middot; {profile.department}
                </p>
              )}
            </div>
            <div className="sm:ml-auto">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Edit3 className="mr-1.5 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky top-0 z-30 -mx-6 bg-background/80 px-6 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex gap-1 border-b">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "personal" && (
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={<UserCircle className="h-4 w-4" />} label="Full Name" value={profile.fullName} />
              <Separator />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={new Date(profile.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
              <Separator />
              <InfoRow icon={<UserCircle className="h-4 w-4" />} label="Gender" value={profile.gender} />
              <Separator />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Mobile Number" value={profile.mobileNumber} />
              <Separator />
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Address" value={profile.email} />
              <Separator />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={profile.address} />
              <Separator />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Emergency Contact" value={profile.emergencyContact} />
              <Separator />
              <InfoRow icon={<Droplets className="h-4 w-4" />} label="Blood Group" value={profile.bloodGroup} />
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setEditOpen(true)}>
              <Edit3 className="mr-1.5 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex-1">
              <Camera className="mr-1.5 h-4 w-4" />
              Change Photo
            </Button>
          </div>
        </div>
      )}

      {activeTab === "academic" && isStudent && (
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base">Academic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={<Hash className="h-4 w-4" />} label="Admission Number" value={profile.admissionNumber || "N/A"} />
              <Separator />
              <InfoRow icon={<Hash className="h-4 w-4" />} label="Roll Number" value={profile.rollNumber || "N/A"} />
              <Separator />
              <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Class" value={profile.className || "N/A"} />
              <Separator />
              <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Section" value={profile.section || "N/A"} />
              <Separator />
              <InfoRow icon={<CalendarClock className="h-4 w-4" />} label="Academic Year" value={profile.academicYear || "N/A"} />
              <Separator />
              <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Board" value={profile.board || "N/A"} />
              <Separator />
              <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="School Name" value={profile.schoolName || "N/A"} />
              <Separator />
              <InfoRow icon={<Award className="h-4 w-4" />} label="House" value={profile.house || "N/A"} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Attendance", value: `${ACADEMIC_SNAPSHOT.attendance}%`, icon: ClipboardCheck, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
              { label: "Overall %", value: `${ACADEMIC_SNAPSHOT.overallPercentage}%`, icon: TrendingUp, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
              { label: "Assignments Done", value: `${ACADEMIC_SNAPSHOT.assignmentsCompleted}`, icon: CheckCircle2, color: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20" },
              { label: "Upcoming Exams", value: `${ACADEMIC_SNAPSHOT.upcomingExams}`, icon: CalendarClock, color: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20" },
            ].map((stat) => (
              <Card key={stat.label} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow}`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-blue-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SettingToggle
                label="Email Notifications"
                description="Receive updates via email"
                checked={notifications.emailNotifications}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, emailNotifications: v }))}
              />
              <Separator />
              <SettingToggle
                label="Push Notifications"
                description="Get notified on your device"
                checked={notifications.pushNotifications}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, pushNotifications: v }))}
              />
              <Separator />
              <SettingToggle
                label="Assignment Reminders"
                description="Remind before assignment deadlines"
                checked={notifications.assignmentReminders}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, assignmentReminders: v }))}
              />
              <Separator />
              <SettingToggle
                label="Exam Reminders"
                description="Remind before upcoming exams"
                checked={notifications.examReminders}
                onCheckedChange={(v) => setNotifications((p) => ({ ...p, examReminders: v }))}
              />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Key className="h-4 w-4 text-amber-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Last changed {new Date(security.lastPasswordChange).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Key className="mr-1.5 h-3.5 w-3.5" />
                  Change
                </Button>
              </div>
              <Separator />
              <SettingToggle
                label="Two-Factor Authentication"
                description="Add an extra layer of security"
                checked={security.twoFactorEnabled}
                onCheckedChange={() => {}}
              />
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Session Management</p>
                  <p className="text-xs text-muted-foreground">{security.activeSessions} active session{security.activeSessions !== 1 ? "s" : ""}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10 hover:text-red-600">
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Sign Out All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sun className="h-4 w-4 text-violet-500" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Theme Preference</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
                </div>
                <Select value={appearance.theme} onValueChange={(v) => setAppearance((p) => ({ ...p, theme: v as AppearanceSettings["theme"] }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <span className="flex items-center gap-2"><Sun className="h-3.5 w-3.5" /> Light</span>
                    </SelectItem>
                    <SelectItem value="dark">
                      <span className="flex items-center gap-2"><Moon className="h-3.5 w-3.5" /> Dark</span>
                    </SelectItem>
                    <SelectItem value="system">
                      <span className="flex items-center gap-2"><Monitor className="h-3.5 w-3.5" /> System</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Language Preference</p>
                  <p className="text-xs text-muted-foreground">Select your preferred language</p>
                </div>
                <Select value={appearance.language} onValueChange={(v) => setAppearance((p) => ({ ...p, language: v }))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Update your personal information</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={profile.fullName} />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" defaultValue={profile.dateOfBirth} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select defaultValue={profile.gender.toLowerCase()}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mobile Number</Label>
              <Input defaultValue={profile.mobileNumber} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input defaultValue={profile.email} type="email" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input defaultValue={profile.address} />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact</Label>
              <Input defaultValue={profile.emergencyContact} />
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select defaultValue={profile.bloodGroup}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700">
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
