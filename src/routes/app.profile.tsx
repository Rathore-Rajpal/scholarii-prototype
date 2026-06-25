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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCircle, Edit3, Camera, Calendar, Phone, Mail, MapPin,
  Droplets, Shield, Key, Bell, Sun, Moon, Monitor,
  Lock, LogOut, CheckCircle2, TrendingUp, ClipboardCheck,
  CalendarClock, GraduationCap, Award, BookOpen, Hash,
  Briefcase, Users, School, Building2,
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
import {
  PRINCIPAL_PROFILE, PRINCIPAL_SCHOOL_STATS,
  DEFAULT_PRINCIPAL_NOTIFICATIONS, DEFAULT_PRINCIPAL_SECURITY, DEFAULT_PRINCIPAL_APPEARANCE,
} from "@/lib/scholarii/principal-profile-mock-data";
import type { PrincipalProfileTab } from "@/lib/scholarii/principal-profile-mock-data";
import { ScrollableTabs } from "@/components/scholarii/ScrollableTabs";

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
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground shrink-0">
          {icon}
        </div>
        <span className="text-[11px] sm:text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-[11px] sm:text-sm font-medium pl-9.5 sm:pl-0">{value}</span>
    </div>
  );
}

function SettingToggle({ label, description, checked, onCheckedChange }: { label: string; description: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="shrink-0" />
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
    <div className="space-y-5 sm:space-y-6 p-4 sm:p-6 pb-20 md:p-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-slate-500/25">
            <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile</h1>
            <p className="text-[11px] sm:text-sm text-muted-foreground">
              Manage your profile and account settings.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row">
            <div className="relative">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xl sm:text-2xl font-bold text-white shadow-lg shadow-blue-500/25">
                {getInitials(profile.fullName)}
              </div>
              <button className="absolute bottom-0 right-0 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted">
                <Camera className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold">{profile.fullName}</h2>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 sm:justify-start">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">{profile.designation}</Badge>
                <span className="text-[11px] sm:text-sm text-muted-foreground">{profile.employeeId}</span>
              </div>
              <p className="mt-1 text-[11px] sm:text-sm text-muted-foreground">
                {profile.department} &middot; {profile.subjects.join(", ")}
              </p>
              {profile.isClassTeacher && (
                <Badge variant="outline" className="mt-1.5 sm:mt-2 border-blue-200 bg-blue-500/10 text-[10px] sm:text-xs text-blue-700">
                  Class Teacher - {profile.classTeacherOf}
                </Badge>
              )}
            </div>
            <div className="w-full sm:w-auto sm:ml-auto">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="w-full sm:w-auto h-8 sm:h-9 text-xs gap-1.5">
                <Edit3 className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 bg-background/80 px-4 sm:px-6 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex gap-0.5 sm:gap-1 border-b overflow-x-auto scrollbar-hide">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 border-b-2 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm font-medium transition-colors whitespace-nowrap ${
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
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-sm sm:text-lg">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
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
          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" className="flex-1 h-8 sm:h-9 text-[11px] sm:text-xs" onClick={() => setEditOpen(true)}>
              <Edit3 className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex-1 h-8 sm:h-9 text-[11px] sm:text-xs">
              <Camera className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
              Change Photo
            </Button>
          </div>
        </div>
      )}

      {activeTab === "professional" && (
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-sm sm:text-lg">Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
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
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <Key className="h-4 w-4 text-amber-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">Last changed {new Date(DEFAULT_TEACHER_SECURITY.lastPasswordChange).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Key className="mr-1.5 h-3.5 w-3.5" />
                  Change
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium">Session Management</p>
                  <p className="text-xs text-muted-foreground">{DEFAULT_TEACHER_SECURITY.activeSessions} active session{DEFAULT_TEACHER_SECURITY.activeSessions !== 1 ? "s" : ""}</p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-600">
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Sign Out All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <Bell className="h-4 w-4 text-blue-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
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
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <Sun className="h-4 w-4 text-violet-500" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium">Theme Preference</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
                </div>
                <Select value={appearance.theme} onValueChange={(v) => setAppearance((p) => ({ ...p, theme: v as "light" | "dark" | "system" }))}>
                  <SelectTrigger className="w-32 shrink-0">
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
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium">Language Preference</p>
                  <p className="text-xs text-muted-foreground">Select your preferred language</p>
                </div>
                <Select value={appearance.language} onValueChange={(v) => setAppearance((p) => ({ ...p, language: v }))}>
                  <SelectTrigger className="w-32 shrink-0">
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
        <SheetContent className="w-full max-w-[95vw] sm:max-w-lg overflow-y-auto safe-area-bottom">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Update your personal information</SheetDescription>
          </SheetHeader>
          <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Full Name</Label>
              <Input defaultValue={profile.fullName} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Email Address</Label>
              <Input defaultValue={profile.email} type="email" className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Phone Number</Label>
              <Input defaultValue={profile.phone} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Gender</Label>
              <Select defaultValue={profile.gender.toLowerCase()}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Date of Birth</Label>
              <Input type="date" defaultValue={profile.dateOfBirth} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Address</Label>
              <Input defaultValue={profile.address} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Emergency Contact</Label>
              <Input defaultValue={profile.emergencyContact} className="text-[16px] sm:text-sm" />
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 h-9 sm:h-10 text-xs sm:text-sm">
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PrincipalProfilePage() {
  const [activeTab, setActiveTab] = useState<PrincipalProfileTab>("personal");
  const [editOpen, setEditOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_PRINCIPAL_NOTIFICATIONS);

  const profile = PRINCIPAL_PROFILE;
  const schoolStats = PRINCIPAL_SCHOOL_STATS;

  const TAB_LIST: { id: PrincipalProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Personal Information", icon: <UserCircle className="h-4 w-4" /> },
    { id: "professional", label: "Professional Information", icon: <Briefcase className="h-4 w-4" /> },
    { id: "school", label: "School Overview", icon: <School className="h-4 w-4" /> },
    { id: "settings", label: "Account Settings", icon: <Shield className="h-4 w-4" /> },
  ];

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="pb-20 md:pb-0">
      <div className="flex items-center gap-3 mb-5 sm:mb-8">
        <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-violet-500/10">
          <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-[11px] sm:text-sm text-muted-foreground">Manage your profile and account settings.</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="p-3 sm:p-6 mb-5 sm:mb-8">
        <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row">
          <div className="relative">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-violet-500/10 text-xl sm:text-2xl font-bold text-violet-600">
              {getInitials(profile.fullName)}
            </div>
              <button className="absolute bottom-0 right-0 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted">
                <Camera className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold">{profile.fullName}</h2>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 sm:justify-start">
              <Badge variant="secondary" className="text-[10px] sm:text-xs">{profile.designation}</Badge>
              <span className="text-[11px] sm:text-sm text-muted-foreground">{profile.employeeId}</span>
            </div>
            <p className="mt-1 text-[11px] sm:text-sm text-muted-foreground">
              {profile.department} &middot; {profile.yearsOfExperience} years experience
            </p>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="w-full sm:w-auto h-8 sm:h-9 text-xs gap-1.5">
              <Edit3 className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PrincipalProfileTab)}>
        <Card className="p-3 sm:p-4 mb-5 sm:mb-8">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="h-10 sm:h-11 w-max min-w-full">
              {TAB_LIST.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-[11px] sm:text-sm gap-1.5 sm:gap-2 px-3 sm:px-5 whitespace-nowrap">
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Card>

        {/* ═══ PERSONAL ═══ */}
        {activeTab === "personal" && (
          <div>
            <Card className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Personal Details</h3>
              <div className="space-y-2.5 sm:space-y-3">
                <InfoRow icon={<UserCircle className="h-4 w-4" />} label="Full Name" value={profile.fullName} />
                <Separator />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={new Date(profile.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
                <Separator />
                <InfoRow icon={<UserCircle className="h-4 w-4" />} label="Gender" value={profile.gender} />
                <Separator />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Mobile Number" value={profile.phone} />
                <Separator />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Address" value={profile.email} />
                <Separator />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Address" value={profile.address} />
                <Separator />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Emergency Contact" value={profile.emergencyContact} />
                <Separator />
                <InfoRow icon={<Droplets className="h-4 w-4" />} label="Blood Group" value={profile.bloodGroup} />
              </div>
            </Card>
            <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4">
              <Button variant="outline" className="flex-1 h-8 sm:h-9 text-[11px] sm:text-xs gap-1.5" onClick={() => setEditOpen(true)}>
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
              </Button>
              <Button variant="outline" className="flex-1 h-8 sm:h-9 text-[11px] sm:text-xs gap-1.5">
                <Camera className="h-3.5 w-3.5" /> Change Photo
              </Button>
            </div>
          </div>
        )}

        {/* ═══ PROFESSIONAL ═══ */}
        {activeTab === "professional" && (
          <Card className="p-3 sm:p-6">
            <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4">Professional Details</h3>
            <div className="space-y-2.5 sm:space-y-3">
              <InfoRow icon={<Hash className="h-4 w-4" />} label="Employee ID" value={profile.employeeId} />
              <Separator />
              <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Designation" value={profile.designation} />
              <Separator />
              <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Department" value={profile.department} />
              <Separator />
              <InfoRow icon={<GraduationCap className="h-4 w-4" />} label="Qualification" value={profile.qualification} />
              <Separator />
              <InfoRow icon={<TrendingUp className="h-4 w-4" />} label="Years of Experience" value={`${profile.yearsOfExperience} years`} />
              <Separator />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="Joining Date" value={new Date(profile.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
              <Separator />
              <InfoRow icon={<School className="h-4 w-4" />} label="Previous School" value={profile.previousSchool} />
              <Separator />
              <InfoRow icon={<Users className="h-4 w-4" />} label="Reports To" value={profile.reportsTo} />
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold mb-2">Key Responsibilities</p>
              <div className="space-y-1.5">
                {profile.responsibilities.map((r) => (
                  <div key={r} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold mb-2">Direct Reports</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.directReports.map((r) => (
                  <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* ═══ SCHOOL OVERVIEW ═══ */}
        {activeTab === "school" && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-8">
              {[
                { label: "Total Students", value: schoolStats.totalStudents.toLocaleString(), icon: GraduationCap, tone: "bg-emerald-500/10 text-emerald-500" },
                { label: "Total Staff", value: String(schoolStats.totalStaff), icon: Users, tone: "bg-sky-500/10 text-sky-500" },
                { label: "Teachers", value: String(schoolStats.totalTeachers), icon: Briefcase, tone: "bg-violet-500/10 text-violet-500" },
                { label: "Classes", value: String(schoolStats.classesCount), icon: BookOpen, tone: "bg-amber-500/10 text-amber-500" },
                { label: "Attendance Rate", value: `${schoolStats.attendanceRate}%`, icon: ClipboardCheck, tone: "bg-emerald-500/10 text-emerald-500" },
                { label: "Academic Score", value: `${schoolStats.academicScore}%`, icon: TrendingUp, tone: "bg-sky-500/10 text-sky-500" },
                { label: "Compliance Score", value: `${schoolStats.complianceScore}%`, icon: Shield, tone: "bg-violet-500/10 text-violet-500" },
                { label: "Parent Engagement", value: `${schoolStats.parentEngagement}%`, icon: Users, tone: "bg-amber-500/10 text-amber-500" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="p-2.5 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className={`size-8 sm:size-10 rounded-xl grid place-items-center shrink-0 ${stat.tone}`}>
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground">{stat.label}</p>
                        <div className="text-sm sm:text-lg font-semibold">{stat.value}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <Card className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3">School at a Glance</h3>
              <p className="text-xs text-muted-foreground leading-5">
                Scholarii Modern School serves {schoolStats.totalStudents.toLocaleString()} students across {schoolStats.sectionsCount} sections
                with a dedicated staff of {schoolStats.totalStaff} members. The school maintains a {schoolStats.attendanceRate}% attendance rate
                and a {schoolStats.complianceScore}% compliance score, reflecting strong operational health.
              </p>
            </Card>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {activeTab === "settings" && (
          <div className="space-y-3 sm:space-y-4">
            <Card className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-500" />
                Security
              </h3>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Change Password</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Last changed {new Date(DEFAULT_PRINCIPAL_SECURITY.lastPasswordChange).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs gap-1 sm:gap-1.5 shrink-0">
                    <Key className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Change
                  </Button>
                </div>
                <Separator />
                <SettingToggle
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security"
                  checked={DEFAULT_PRINCIPAL_SECURITY.twoFactorEnabled}
                  onCheckedChange={() => {}}
                />
                <Separator />
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Session Management</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{DEFAULT_PRINCIPAL_SECURITY.activeSessions} active session{DEFAULT_PRINCIPAL_SECURITY.activeSessions !== 1 ? "s" : ""}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs gap-1 sm:gap-1.5 text-red-500 hover:bg-red-500/10 hover:text-red-600 shrink-0">
                    <LogOut className="h-3 sm:h-3.5 w-3 sm:w-3.5" /> Sign Out All
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-500" />
                Notification Preferences
              </h3>
              <div className="space-y-2.5 sm:space-y-3">
                <SettingToggle label="Email Notifications" description="Receive updates via email" checked={notifications.emailNotifications} onCheckedChange={(v) => setNotifications((p) => ({ ...p, emailNotifications: v }))} />
                <Separator />
                <SettingToggle label="Push Notifications" description="Get notified on your device" checked={notifications.pushNotifications} onCheckedChange={(v) => setNotifications((p) => ({ ...p, pushNotifications: v }))} />
                <Separator />
                <SettingToggle label="Staff Alerts" description="Notifications about staff updates" checked={notifications.staffAlerts} onCheckedChange={(v) => setNotifications((p) => ({ ...p, staffAlerts: v }))} />
                <Separator />
                <SettingToggle label="Compliance Alerts" description="Compliance and inspection reminders" checked={notifications.complianceAlerts} onCheckedChange={(v) => setNotifications((p) => ({ ...p, complianceAlerts: v }))} />
                <Separator />
                <SettingToggle label="Parent Messages" description="Get notified for parent messages" checked={notifications.parentMessages} onCheckedChange={(v) => setNotifications((p) => ({ ...p, parentMessages: v }))} />
                <Separator />
                <SettingToggle label="Exam Notifications" description="Exam schedule and result updates" checked={notifications.examNotifications} onCheckedChange={(v) => setNotifications((p) => ({ ...p, examNotifications: v }))} />
                <Separator />
                <SettingToggle label="Fee Notifications" description="Fee collection and default alerts" checked={notifications.feeNotifications} onCheckedChange={(v) => setNotifications((p) => ({ ...p, feeNotifications: v }))} />
              </div>
            </Card>

            <Card className="p-3 sm:p-6">
              <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <Sun className="h-4 w-4 text-violet-500" />
                Appearance
              </h3>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Theme Preference</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <Select defaultValue="light">
                    <SelectTrigger className="w-24 sm:w-32 h-8 text-[11px] sm:text-xs shrink-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light"><span className="flex items-center gap-2"><Sun className="h-3.5 w-3.5" /> Light</span></SelectItem>
                      <SelectItem value="dark"><span className="flex items-center gap-2"><Moon className="h-3.5 w-3.5" /> Dark</span></SelectItem>
                      <SelectItem value="system"><span className="flex items-center gap-2"><Monitor className="h-3.5 w-3.5" /> System</span></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Language Preference</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select defaultValue="English">
                    <SelectTrigger className="w-24 sm:w-32 h-8 text-[11px] sm:text-xs shrink-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Tabs>

      {/* Edit Profile Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="w-full max-w-[95vw] sm:max-w-lg overflow-y-auto safe-area-bottom">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Update your personal information</SheetDescription>
          </SheetHeader>
          <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Full Name</Label>
              <Input defaultValue={profile.fullName} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Email Address</Label>
              <Input defaultValue={profile.email} type="email" className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Phone Number</Label>
              <Input defaultValue={profile.phone} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Gender</Label>
              <Select defaultValue={profile.gender.toLowerCase()}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Date of Birth</Label>
              <Input type="date" defaultValue={profile.dateOfBirth} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Address</Label>
              <Input defaultValue={profile.address} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Emergency Contact</Label>
              <Input defaultValue={profile.emergencyContact} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Blood Group</Label>
              <Select defaultValue={profile.bloodGroup}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-violet-600 hover:bg-violet-700">Save Changes</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const isPrincipal = user?.role === "principal";

  if (isPrincipal) {
    return <PrincipalProfilePage />;
  }

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
    <div className="space-y-5 sm:space-y-6 p-4 sm:p-6 pb-20 md:p-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br ${getGradientByRole(user?.role || "student")} shadow-lg shadow-slate-500/25`}>
            <UserCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profile</h1>
            <p className="text-[11px] sm:text-sm text-muted-foreground">
              {isStudent ? "View your profile and academic information." : "Manage your profile and account settings."}
            </p>
          </div>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col items-center gap-3 sm:gap-4 sm:flex-row">
            <div className="relative">
              <div className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br ${getGradientByRole(user?.role || "student")} text-xl sm:text-2xl font-bold text-white shadow-lg shadow-blue-500/25`}>
                {getInitials(profile.fullName)}
              </div>
              <button className="absolute bottom-0 right-0 flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted">
                <Camera className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold">{profile.fullName}</h2>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 sm:justify-start">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">{profile.role}</Badge>
                <span className="text-[11px] sm:text-sm text-muted-foreground">{profile.id}</span>
              </div>
              {isStudent && profile.className && (
                <p className="mt-1 text-[11px] sm:text-sm text-muted-foreground">
                  Class {profile.className} &middot; Section {profile.section}
                </p>
              )}
              {!isStudent && profile.designation && (
                <p className="mt-1 text-[11px] sm:text-sm text-muted-foreground">
                  {profile.designation} &middot; {profile.department}
                </p>
              )}
            </div>
            <div className="w-full sm:w-auto sm:ml-auto">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="w-full sm:w-auto h-8 sm:h-9 text-xs gap-1.5">
                <Edit3 className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 bg-background/80 px-4 sm:px-6 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex gap-0.5 sm:gap-1 border-b overflow-x-auto scrollbar-hide">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 border-b-2 px-3 sm:px-4 py-2.5 sm:py-3 text-[11px] sm:text-sm font-medium transition-colors whitespace-nowrap ${
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
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-sm sm:text-lg">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
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
          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" className="flex-1 h-8 sm:h-9 text-[11px] sm:text-xs" onClick={() => setEditOpen(true)}>
              <Edit3 className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex-1 h-8 sm:h-9 text-[11px] sm:text-xs">
              <Camera className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
              Change Photo
            </Button>
          </div>
        </div>
      )}

      {activeTab === "academic" && isStudent && (
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="text-sm sm:text-lg">Academic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {[
              { label: "Attendance", value: `${ACADEMIC_SNAPSHOT.attendance}%`, icon: ClipboardCheck, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
              { label: "Overall %", value: `${ACADEMIC_SNAPSHOT.overallPercentage}%`, icon: TrendingUp, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
              { label: "Assignments Done", value: `${ACADEMIC_SNAPSHOT.assignmentsCompleted}`, icon: CheckCircle2, color: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20" },
              { label: "Upcoming Exams", value: `${ACADEMIC_SNAPSHOT.upcomingExams}`, icon: CalendarClock, color: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20" },
            ].map((stat) => (
              <Card key={stat.label} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow}`}>
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
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <Bell className="h-4 w-4 text-blue-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
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
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <Key className="h-4 w-4 text-amber-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Change Password</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Last changed {new Date(security.lastPasswordChange).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
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
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium">Session Management</p>
                  <p className="text-xs text-muted-foreground">{security.activeSessions} active session{security.activeSessions !== 1 ? "s" : ""}</p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-600">
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Sign Out All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                <Sun className="h-4 w-4 text-violet-500" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Theme Preference</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Choose your preferred theme</p>
                </div>
                <Select value={appearance.theme} onValueChange={(v) => setAppearance((p) => ({ ...p, theme: v as AppearanceSettings["theme"] }))}>
                  <SelectTrigger className="w-28 sm:w-32 shrink-0">
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
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">Language Preference</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Select your preferred language</p>
                </div>
                <Select value={appearance.language} onValueChange={(v) => setAppearance((p) => ({ ...p, language: v }))}>
                  <SelectTrigger className="w-28 sm:w-32 shrink-0">
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
        <SheetContent className="w-full max-w-[95vw] sm:max-w-lg overflow-y-auto safe-area-bottom">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
            <SheetDescription>Update your personal information</SheetDescription>
          </SheetHeader>
          <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Full Name</Label>
              <Input defaultValue={profile.fullName} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Date of Birth</Label>
              <Input type="date" defaultValue={profile.dateOfBirth} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Gender</Label>
              <Select defaultValue={profile.gender.toLowerCase()}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Mobile Number</Label>
              <Input defaultValue={profile.mobileNumber} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Email Address</Label>
              <Input defaultValue={profile.email} type="email" className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Address</Label>
              <Input defaultValue={profile.address} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Emergency Contact</Label>
              <Input defaultValue={profile.emergencyContact} className="text-[16px] sm:text-sm" />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Blood Group</Label>
              <Select defaultValue={profile.bloodGroup}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 h-9 sm:h-10 text-xs sm:text-sm">
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
