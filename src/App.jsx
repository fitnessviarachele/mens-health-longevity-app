import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Archive,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Phone,
  ShieldCheck,
  Stethoscope,
  Target,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewPatientModal from "@/components/NewPatientModal";
import NewTrainerModal from "@/components/NewTrainerModal";
import ArchivePatientModal from "@/components/ArchivePatientModal";
import MergeDuplicateProfilesModal from "@/components/MergeDuplicateProfilesModal";
import MergeSelectedPatientsModal from "@/components/MergeSelectedPatientsModal";
import Signup from "@/components/Signup";
import Verify from "@/components/Verify";
import storage from "@/lib/storage";

const roleConfig = {
  admin: {
    label: "Admin",
    portalLabel: "Full control",
    headerTitle: "Operations Admin",
    headerSubtitle: "Can add clinicians, patients, and trainers",
    initials: "AD",
    sections: [
      { key: "overview", label: "Overview", icon: LayoutDashboard },
      { key: "patients", label: "All patients", icon: Users },
      { key: "team", label: "Team", icon: UserCog },
      { key: "analytics", label: "Analytics", icon: LineChart },
    ],
  },
  clinician: {
    label: "Clinician",
    portalLabel: "Clinician panel",
    headerTitle: "Dr. Sarah Chen",
    headerSubtitle: "Only assigned patients are visible",
    initials: "SC",
    sections: [
      { key: "overview", label: "Overview", icon: LayoutDashboard },
      { key: "patients", label: "Assigned patients", icon: Stethoscope },
      { key: "appointments", label: "Appointments", icon: CalendarDays },
      { key: "analytics", label: "Analytics", icon: LineChart },
    ],
  },
  trainer: {
    label: "Trainer",
    portalLabel: "Trainer workspace",
    headerTitle: "Coach Alex Rivera",
    headerSubtitle: "Sees all patients assigned for training",
    initials: "AR",
    sections: [
      { key: "overview", label: "Overview", icon: LayoutDashboard },
      { key: "patients", label: "Training roster", icon: Dumbbell },
      { key: "programs", label: "Programs", icon: ClipboardList },
      { key: "messages", label: "Messages", icon: MessageSquare },
    ],
  },
  patient: {
    label: "Patient",
    portalLabel: "Patient portal",
    headerTitle: "Good morning, James",
    headerSubtitle: "Access limited to your own profile",
    initials: "JM",
    sections: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "metrics", label: "My metrics", icon: HeartPulse },
      { key: "program", label: "Program", icon: ClipboardList },
      { key: "goals", label: "Goals", icon: Target },
      { key: "labs", label: "Lab results", icon: FlaskConical },
      { key: "schedule", label: "Schedule", icon: CalendarDays },
      { key: "care-team", label: "Care team", icon: Phone },
    ],
  },
};

const defaultSectionByRole = {
  admin: "overview",
  clinician: "overview",
  trainer: "overview",
  patient: "dashboard",
};

const adminMetrics = [
  { label: "Total patients", value: "48", trend: "Across all clinicians and trainers" },
  { label: "Clinicians", value: "6", trend: "2 accepting new patients" },
  { label: "Trainers", value: "5", trend: "1 onboarding this week" },
];

const clinicianMetrics = [
  { label: "Assigned patients", value: "24", trend: "Only your roster is shown" },
  { label: "Avg adherence", value: "76%", trend: "↑ 8% vs last cohort" },
  { label: "Appts today", value: "6", trend: "2 remaining" },
];

const trainerMetrics = [
  { label: "Training clients", value: "18", trend: "Patients assigned to you" },
  { label: "Avg completion", value: "82%", trend: "Strength and cardio tasks" },
  { label: "Sessions today", value: "4", trend: "2 virtual, 2 in-clinic" },
];

const patientMetrics = [
  { label: "Weight", value: "87", unit: "kg", trend: "↓ 3.2kg since start", positive: true },
  { label: "Blood pressure", value: "122/78", trend: "↑ Improved", positive: true },
  { label: "Sleep avg", value: "7.2", unit: "hr", trend: "↑ +0.8hr", positive: true },
];

const weeklyGoals = [
  { text: "3× strength sessions", done: true },
  { text: "Log meals Mon–Thu", done: true },
  { text: "Complete sleep module", done: false },
  { text: "Morning walk 5 of 7 days", done: false },
];

const nutritionBars = [
  { label: "Protein", value: 78, display: "156g" },
  { label: "Carbs", value: 55, display: "210g" },
  { label: "Fats", value: 60, display: "68g" },
  { label: "Calories", value: 85, display: "2,180" },
];

const activityBars = [
  { label: "Steps/day", value: 72, display: "8,640" },
  { label: "Active mins", value: 66, display: "198" },
  { label: "Strength", value: 100, display: "3/3" },
];

const modules = [
  { icon: "🧠", title: "Stress & cognitive health", desc: "HRV, mindfulness, sleep architecture", status: "Completed" },
  { icon: "🏋️", title: "Strength & muscle", desc: "Progressive overload, recovery protocols", status: "In progress" },
  { icon: "🥗", title: "Metabolic nutrition", desc: "Protein optimisation, meal timing, gut health", status: "In progress" },
  { icon: "💤", title: "Sleep optimisation", desc: "Circadian rhythm, sleep hygiene, recovery", status: "Upcoming" },
  { icon: "🩸", title: "Hormonal health", desc: "Testosterone, cortisol, thyroid markers", status: "Upcoming" },
  { icon: "❤️", title: "Cardiovascular health", desc: "Zone 2 training, lipid panel, BP targets", status: "Upcoming" },
];

const goalProgress = [
  { label: "Weight", value: 64 },
  { label: "Activity", value: 80 },
  { label: "Sleep", value: 50 },
  { label: "Hormones", value: 30 },
];

const labs = {
  hormones: [
    { name: "Total testosterone", ref: "Ref: 300–1,000 ng/dL", value: "624 ng/dL", normal: true },
    { name: "Free testosterone", ref: "Ref: 9–30 ng/dL", value: "8.2 ng/dL", normal: false },
    { name: "Cortisol (AM)", ref: "Ref: 6–23 µg/dL", value: "14.3 µg/dL", normal: true },
  ],
  metabolic: [
    { name: "HbA1c", ref: "Ref: <5.7%", value: "5.3%", normal: true },
    { name: "LDL cholesterol", ref: "Ref: <100 mg/dL", value: "118 mg/dL", normal: false },
    { name: "HDL cholesterol", ref: "Ref: >40 mg/dL", value: "52 mg/dL", normal: true },
    { name: "hsCRP", ref: "Ref: <1.0 mg/L", value: "0.7 mg/L", normal: true },
  ],
};

const schedule = [
  { date: "Apr 24", name: "8-week review — Dr. Chen", type: "Program check-in · Video", status: "Confirmed" },
  { date: "May 6", name: "Blood draw & labs", type: "Pathology · In-clinic", status: "Scheduled" },
  { date: "May 15", name: "Nutrition coaching", type: "With Dana Walsh RD · Video", status: "Scheduled" },
  { date: "May 28", name: "12-week graduation review", type: "Full assessment · In-clinic", status: "Tentative" },
];

const allPatients = [
  { initials: "JM", name: "James Morrison", note: "Week 8 · Clinician: Dr. Chen · Trainer: Alex", status: "On track" },
  { initials: "DK", name: "Derek Klein", note: "Week 5 · Clinician: Dr. Chen · Trainer: Maya", status: "At risk" },
  { initials: "TR", name: "Tom Reeves", note: "Week 1 · Clinician: Dr. Cole · Trainer: Alex", status: "New" },
  { initials: "MR", name: "Marcus Reid", note: "Week 6 · Clinician: Dr. Chen · Trainer: Alex", status: "On track" },
  { initials: "PH", name: "Phil Hartley", note: "Week 11 · Clinician: Dr. Cole · Trainer: Maya", status: "Excellent" },
];

const clinicianAssignedPatients = allPatients.filter((patient) => ["JM", "DK", "MR"].includes(patient.initials));
const trainerAssignedPatients = allPatients.filter((patient) => ["JM", "TR", "MR"].includes(patient.initials));

const teamMembers = [
  { initials: "SC", name: "Dr. Sarah Chen", note: "Clinician · 24 assigned patients", status: "Active", role: "clinician" },
  { initials: "JC", name: "Dr. Julia Cole", note: "Clinician · 24 assigned patients", status: "Active", role: "clinician" },
  { initials: "AR", name: "Alex Rivera", note: "Trainer · 18 assigned patients", status: "Active", role: "trainer" },
  { initials: "MP", name: "Maya Patel", note: "Trainer · 16 assigned patients", status: "Active", role: "trainer" },
];

const moduleCompletion = [
  { label: "Stress & cognition", value: 87 },
  { label: "Strength", value: 74 },
  { label: "Nutrition", value: 68 },
  { label: "Sleep", value: 45 },
  { label: "Hormonal health", value: 30 },
];

const careTeam = [
  { initials: "SC", name: "Dr. Sarah Chen", role: "Assigned clinician", contact: "Secure message or clinic line", status: "Available" },
  { initials: "AR", name: "Alex Rivera", role: "Assigned trainer", contact: "In-app chat or session booking", status: "Available" },
];

const patientProfiles = {
  JM: {
    initials: "JM",
    name: "James Morrison",
    status: "On track",
    week: "Week 8",
    clinician: "Dr. Sarah Chen",
    trainer: "Alex Rivera",
    age: 46,
    program: "12-week longevity program",
    adherence: 88,
    metrics: [
      { label: "Weight", value: "87", unit: "kg", trend: "↓ 3.2kg since start", positive: true },
      { label: "Blood pressure", value: "122/78", trend: "↑ Improved", positive: true },
      { label: "Sleep avg", value: "7.2", unit: "hr", trend: "↑ +0.8hr", positive: true },
    ],
    goals: ["3× strength sessions", "Lower LDL cholesterol", "Sleep 7.5+ hrs/night", "Complete week 9 training block"],
    notes: [
      "Responding well to current strength progression.",
      "Needs minor increase in zone 2 cardio volume.",
      "Continue nutrition adherence and sleep routine work.",
    ],
    appointments: [
      { left: "Apr 24", title: "8-week review — Dr. Chen", subtitle: "Program check-in · Video", badge: "Confirmed" },
      { left: "May 6", title: "Blood draw & labs", subtitle: "Pathology · In-clinic", badge: "Scheduled" },
    ],
  },
  DK: {
    initials: "DK",
    name: "Derek Klein",
    status: "At risk",
    week: "Week 5",
    clinician: "Dr. Sarah Chen",
    trainer: "Maya Patel",
    age: 52,
    program: "12-week longevity program",
    adherence: 52,
    metrics: [
      { label: "Weight", value: "94", unit: "kg", trend: "↔ No change this week", positive: true },
      { label: "Blood pressure", value: "134/84", trend: "Needs follow-up", positive: false },
      { label: "Sleep avg", value: "6.1", unit: "hr", trend: "↓ Below target", positive: false },
    ],
    goals: ["Resume weekly check-ins", "Improve sleep consistency", "Complete missed nutrition logs", "Rebook clinician review"],
    notes: [
      "Missed two recent check-ins.",
      "Would benefit from simpler weekly action plan.",
      "Lab review should be prioritized next visit.",
    ],
    appointments: [{ left: "Apr 25", title: "Check-in consult", subtitle: "Video follow-up", badge: "Scheduled" }],
  },
  TR: {
    initials: "TR",
    name: "Tom Reeves",
    status: "New",
    week: "Week 1",
    clinician: "Dr. Julia Cole",
    trainer: "Alex Rivera",
    age: 39,
    program: "12-week longevity program",
    adherence: 100,
    metrics: [
      { label: "Weight", value: "91", unit: "kg", trend: "Baseline captured", positive: true },
      { label: "Blood pressure", value: "128/80", trend: "Baseline", positive: true },
      { label: "Sleep avg", value: "6.8", unit: "hr", trend: "Initial baseline", positive: true },
    ],
    goals: ["Complete onboarding", "Movement screen", "Baseline meal logging", "Set first monthly targets"],
    notes: ["New patient onboarding in progress.", "Trainer-led movement screen scheduled."],
    appointments: [{ left: "Apr 23", title: "Intro consult", subtitle: "In-clinic", badge: "Today" }],
  },
  MR: {
    initials: "MR",
    name: "Marcus Reid",
    status: "On track",
    week: "Week 6",
    clinician: "Dr. Sarah Chen",
    trainer: "Alex Rivera",
    age: 49,
    program: "12-week longevity program",
    adherence: 74,
    metrics: [
      { label: "Weight", value: "89", unit: "kg", trend: "↓ 1.8kg since start", positive: true },
      { label: "Blood pressure", value: "126/79", trend: "Improving", positive: true },
      { label: "Sleep avg", value: "7.0", unit: "hr", trend: "↑ Better recovery", positive: true },
    ],
    goals: ["Improve lower body training compliance", "Review labs", "Increase weekly steps", "Tighten nutrition consistency"],
    notes: ["Requested lower body program update.", "Lab review upcoming."],
    appointments: [{ left: "Apr 26", title: "Lab results review", subtitle: "Video", badge: "Tomorrow" }],
  },
  PH: {
    initials: "PH",
    name: "Phil Hartley",
    status: "Excellent",
    week: "Week 11",
    clinician: "Dr. Julia Cole",
    trainer: "Maya Patel",
    age: 55,
    program: "12-week longevity program",
    adherence: 91,
    metrics: [
      { label: "Weight", value: "83", unit: "kg", trend: "↓ 5.1kg since start", positive: true },
      { label: "Blood pressure", value: "118/76", trend: "At goal", positive: true },
      { label: "Sleep avg", value: "7.6", unit: "hr", trend: "Consistent target met", positive: true },
    ],
    goals: ["Maintain current plan", "Graduation review prep", "Long-term maintenance plan", "Repeat key labs"],
    notes: ["Excellent engagement and adherence.", "Approaching final review and maintenance transition."],
    appointments: [{ left: "May 1", title: "Graduation review prep", subtitle: "In-clinic", badge: "Scheduled" }],
  },
};

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Tentative: "bg-slate-100 text-slate-700",
    Completed: "bg-emerald-100 text-emerald-700",
    "In progress": "bg-amber-100 text-amber-700",
    Upcoming: "bg-slate-100 text-slate-700",
    "On track": "bg-emerald-100 text-emerald-700",
    Excellent: "bg-emerald-100 text-emerald-700",
    "At risk": "bg-amber-100 text-amber-700",
    New: "bg-blue-100 text-blue-700",
    Today: "bg-emerald-100 text-emerald-700",
    Tomorrow: "bg-blue-100 text-blue-700",
    "Up next": "bg-amber-100 text-amber-700",
    Active: "bg-emerald-100 text-emerald-700",
    Available: "bg-emerald-100 text-emerald-700",
  };

  return <Badge className={`rounded-full px-3 py-1 font-medium ${styles[status] || "bg-slate-100 text-slate-700"}`}>{status}</Badge>;
}

function MetricCard({ label, value, unit, trend, positive = true }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="text-sm text-slate-500">{label}</div>
        <div className="mt-2 text-3xl font-semibold text-slate-900">
          {value}
          {unit ? <span className="ml-1 text-base font-normal text-slate-500">{unit}</span> : null}
        </div>
        {trend ? <div className={`mt-2 text-sm ${positive ? "text-emerald-700" : "text-rose-700"}`}>{trend}</div> : null}
      </CardContent>
    </Card>
  );
}

function BarList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[110px_1fr_56px] items-center gap-3">
          <div className="text-sm text-slate-500">{item.label}</div>
          <Progress value={item.value} className="h-2" />
          <div className="text-right text-sm font-medium text-slate-800">{item.display || `${item.value}%`}</div>
        </div>
      ))}
    </div>
  );
}

function AppRow({ left, title, subtitle, badge }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-b-0">
      <div className="w-20 shrink-0 text-sm text-slate-500">{left}</div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-slate-900">{title}</div>
        <div className="text-sm text-slate-500">{subtitle}</div>
      </div>
      <StatusBadge status={badge} />
    </div>
  );
}

function PersonRow({ initials, avatar, name, note, status, onClick, onDelete, onArchive, onViewAsPatient, onViewProfile, onMessage, clickable = false }) {
  const Wrapper = "div";

  return (
    <Wrapper
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex w-full items-center gap-3 border-b border-slate-100 py-4 text-left last:border-b-0 ${clickable ? "transition hover:bg-slate-50" : ""}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
        {avatar ? (
          <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-slate-900">{name}</div>
        <div className="text-sm text-slate-500">{note}</div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {onViewProfile ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onViewProfile();
            }}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            title="View clinician or trainer profile"
          >
            <UserCog className="h-4 w-4" />
          </button>
        ) : null}
        {onMessage ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMessage();
            }}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            title="Message"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        ) : null}
        {onViewAsPatient ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onViewAsPatient();
            }}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            title="View patient portal"
          >
            <UserCog className="h-4 w-4" />
          </button>
        ) : null}
        {onArchive ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onArchive();
            }}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
          >
            <Archive className="h-4 w-4" />
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="rounded-full p-2 text-rose-600 hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
        {clickable ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
      </div>
    </Wrapper>
  );
}

function RoleSummary({ role }) {
  const summaries = {
    admin: {
      icon: ShieldCheck,
      title: "Admin permissions",
      text: "Full control over the platform. Can add clinicians, patients, and trainers and see the full patient list.",
    },
    clinician: {
      icon: Stethoscope,
      title: "Clinician permissions",
      text: "Can only view patients assigned to them, along with their own appointments and analytics.",
    },
    trainer: {
      icon: Dumbbell,
      title: "Trainer permissions",
      text: "Can view all patients who work with them and manage training-focused programs, notes, and communication.",
    },
    patient: {
      icon: MessageSquare,
      title: "Patient permissions",
      text: "Can only access their own profile, but can contact both their assigned trainer and clinician.",
    },
  };

  const item = summaries[role];
  const Icon = item.icon;

  return (
    <Card className="mx-4 mt-4 rounded-2xl border-emerald-100 bg-emerald-50/60 shadow-sm">
      <CardContent className="flex items-start gap-3 p-4">
        <div className="rounded-xl bg-white p-2 text-emerald-700 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{item.title}</div>
          <div className="mt-1 text-xs leading-5 text-slate-600">{item.text}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Sidebar({ role, section, onRoleChange, onSectionChange }) {
  const items = roleConfig[role].sections;

  return (
    <aside className="flex h-full w-full max-w-[290px] flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="text-lg font-semibold text-slate-900">
          Apex<span className="text-emerald-700">Longevity</span>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={role} onValueChange={onRoleChange}>
          <TabsList className="grid w-full grid-cols-4 gap-2 rounded-2xl bg-slate-100 p-1">
            <TabsTrigger value="admin" className="rounded-xl text-xs">Admin</TabsTrigger>
            <TabsTrigger value="clinician" className="rounded-xl text-xs">Clinician</TabsTrigger>
            <TabsTrigger value="trainer" className="rounded-xl text-xs">Trainer</TabsTrigger>
            <TabsTrigger value="patient" className="rounded-xl text-xs">Patient</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <RoleSummary role={role} />

      <nav className="flex-1 px-3 py-3">
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = section === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSectionChange(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${active ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
                {active ? <ChevronRight className="ml-auto h-4 w-4" /> : null}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

function SectionHeader({ title, subtitle, initials }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 font-semibold text-emerald-700">{initials}</div>
    </div>
  );
}

function PatientProfile({ patient, onBack, role }) {
  if (!patient) return null;

  return (
    <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" className="rounded-xl" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
              </Button>
              <StatusBadge status={patient.status} />
            </div>
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-lg font-semibold text-emerald-700">{patient.initials}</div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-900">{patient.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{patient.week} · {patient.program} · Age {patient.age}</div>
                    <div className="mt-1 text-sm text-slate-500">Clinician: {patient.clinician} · Trainer: {patient.trainer}</div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px]">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">Adherence</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">{patient.adherence}%</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">Week</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-900">{patient.week.replace("Week ", "")}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-400">Access</div>
                    <div className="mt-1 text-sm font-semibold capitalize text-slate-900">{role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-3">
              {patient.metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader><CardTitle>Current goals</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {patient.goals.map((goal) => (
                    <div key={goal} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      {goal}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader><CardTitle>Care notes</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {patient.notes.map((note) => (
                    <div key={note} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">{note}</div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader><CardTitle>Upcoming appointments</CardTitle></CardHeader>
                <CardContent>
                  {patient.appointments.map((item) => (
                    <AppRow key={`${item.left}-${item.title}`} left={item.left} title={item.title} subtitle={item.subtitle} badge={item.badge} />
                  ))}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800">Add note</Button>
                  <Button variant="outline" className="w-full rounded-xl">Message patient</Button>
                  <Button variant="outline" className="w-full rounded-xl">Adjust program</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
}

function AdminView({ section, onSelectPatient, selectedPatient, onBackToList, patients = [], team = [], archivedPatients = [], archivedReasons = {}, adminMetrics = [], onOpenNewPatient, onOpenNewTrainer, onOpenNewClinician, onOpenManageAssignments, onViewTeamMember, onMessageTeamMember, onDeletePatient, onArchivePatient, onOpenMergeDuplicateProfiles, onOpenMergeSelectedPatients, duplicateGroups = [], onViewAsPatient }) {
  if (section === "overview") {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {adminMetrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} trend={metric.trend} />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Platform controls</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button onClick={onOpenNewClinician} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">Add clinician</Button>
              <Button onClick={onOpenNewTrainer} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">Add trainer</Button>
              <Button onClick={onOpenNewPatient} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">Add patient</Button>
              <Button onClick={onOpenManageAssignments} variant="outline" className="rounded-xl">Manage assignments</Button>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Access model</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <p>Admins see every patient, clinician, and trainer record across the platform.</p>
              <p>Clinicians are restricted to their assigned patients only.</p>
              <p>Trainers only see patients who train with them.</p>
              <p>Patients see only their own profile and care team contact tools.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (section === "patients") {
    if (selectedPatient) return <PatientView section="dashboard" patient={selectedPatient} onBack={onBackToList} />;

    return (
        <>
          <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>All patients</CardTitle>
                  {duplicateGroups.length ? (
                    <div className="text-xs text-slate-500">{duplicateGroups.length} duplicate group(s) detected</div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={onOpenNewPatient} className="rounded-xl bg-emerald-700 hover:bg-emerald-800">Add patient</Button>
                  <Button onClick={onOpenMergeDuplicateProfiles} variant="outline" className="rounded-xl">
                    Merge duplicates
                  </Button>
                  <Button onClick={onOpenMergeSelectedPatients} variant="outline" className="rounded-xl">
                    Manual merge
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {patients.map((patient) => (
                <PersonRow
                  key={patient.initials}
                  {...patient}
                  onClick={() => onSelectPatient(patient.initials)}
                  onDelete={() => onDeletePatient(patient.initials)}
                  onArchive={() => onArchivePatient(patient.initials)}
                  onViewAsPatient={() => onViewAsPatient(patient.initials)}
                  clickable
                />
              ))}
            </CardContent>
          </Card>
          {archivedPatients.length > 0 && (
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <div>
                  <CardTitle>Archived patients</CardTitle>
                  <div className="text-xs text-slate-500">These patients have been moved to the archive.</div>
                </div>
              </CardHeader>
              <CardContent>
                {archivedPatients.map((patient) => (
                  <PersonRow
                    key={patient.initials}
                    {...patient}
                    onClick={() => onSelectPatient(patient.initials)}
                    note={`Archived: ${archivedReasons[patient.initials] || "No reason provided"}`}
                    clickable
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </>
      );
  }

    if (section === "team") {
      const clinicians = team.filter((member) => member.role === "clinician");
      const trainers = team.filter((member) => member.role === "trainer");
      return (
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Clinicians</CardTitle></CardHeader>
            <CardContent>
              {clinicians.map((member) => (
                <PersonRow
                  key={member.initials}
                  {...member}
                  onClick={() => onViewTeamMember(member)}
                  clickable
                  onViewProfile={() => onViewTeamMember(member)}
                  onMessage={() => onMessageTeamMember(member)}
                />
              ))}
              {!clinicians.length && <div className="text-sm text-slate-500">No clinicians currently available.</div>}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Trainers</CardTitle></CardHeader>
            <CardContent>
              {trainers.map((member) => (
                <PersonRow
                  key={member.initials}
                  {...member}
                  onClick={() => onViewTeamMember(member)}
                  clickable
                  onViewProfile={() => onViewTeamMember(member)}
                  onMessage={() => onMessageTeamMember(member)}
                />
              ))}
              {!trainers.length && <div className="text-sm text-slate-500">No trainers currently available.</div>}
            </CardContent>
          </Card>
        </div>
      );
    }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
        <MetricCard label="Avg weight loss" value="4.1" unit="kg" />
        <MetricCard label="BP improvement" value="68" unit="%" />
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader><CardTitle>Module completion rates</CardTitle></CardHeader>
        <CardContent>
          <BarList items={moduleCompletion.map((item) => ({ ...item, display: `${item.value}%` }))} />
        </CardContent>
      </Card>
    </div>
  );
}

function ManageAssignmentsModal({ open, onClose, patients = [], clinicians = [], trainers = [], onUpdatePatient, onBulkUpdate }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [clinicianFilter, setClinicianFilter] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("");
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [bulkClinician, setBulkClinician] = useState("");
  const [bulkTrainer, setBulkTrainer] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedIds(new Set());
      setSearch("");
      setClinicianFilter("");
      setTrainerFilter("");
      setShowUnassigned(false);
      setBulkClinician("");
      setBulkTrainer("");
    }
  }, [open]);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const text = `${patient.name} ${patient.initials}`.toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;
      if (clinicianFilter && patient.clinician !== clinicianFilter) return false;
      if (trainerFilter && patient.trainer !== trainerFilter) return false;
      if (showUnassigned && patient.clinician && patient.trainer) return false;
      return true;
    });
  }, [patients, search, clinicianFilter, trainerFilter, showUnassigned]);

  const toggleSelection = (patientId) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(patientId)) {
        next.delete(patientId);
      } else {
        next.add(patientId);
      }
      return next;
    });
  };

  const applyBulkUpdate = () => {
    const updates = {};
    if (bulkClinician) updates.clinician = bulkClinician;
    if (bulkTrainer) updates.trainer = bulkTrainer;
    if (!Object.keys(updates).length) return;
    onBulkUpdate(Array.from(selectedIds), updates);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Manage assignments</h2>
            <p className="text-sm text-slate-600">Assign clinicians and trainers across your active patient roster.</p>
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patients"
              className="rounded-2xl border border-slate-200 p-3 text-sm shadow-sm"
            />
            <select
              value={clinicianFilter}
              onChange={(event) => setClinicianFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 p-3 text-sm shadow-sm"
            >
              <option value="">All clinicians</option>
              {clinicians.map((clinician) => (
                <option key={clinician.initials} value={clinician.name}>{clinician.name}</option>
              ))}
            </select>
            <select
              value={trainerFilter}
              onChange={(event) => setTrainerFilter(event.target.value)}
              className="rounded-2xl border border-slate-200 p-3 text-sm shadow-sm"
            >
              <option value="">All trainers</option>
              {trainers.map((trainer) => (
                <option key={trainer.initials} value={trainer.name}>{trainer.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUnassigned}
                onChange={(event) => setShowUnassigned(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-700"
              />
              Show unassigned patients
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                value={bulkClinician}
                onChange={(event) => setBulkClinician(event.target.value)}
                className="rounded-2xl border border-slate-200 p-3 text-sm shadow-sm"
              >
                <option value="">Bulk assign clinician</option>
                {clinicians.map((clinician) => (
                  <option key={clinician.initials} value={clinician.name}>{clinician.name}</option>
                ))}
              </select>
              <select
                value={bulkTrainer}
                onChange={(event) => setBulkTrainer(event.target.value)}
                className="rounded-2xl border border-slate-200 p-3 text-sm shadow-sm"
              >
                <option value="">Bulk assign trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer.initials} value={trainer.name}>{trainer.name}</option>
                ))}
              </select>
            </div>
            <Button onClick={applyBulkUpdate} disabled={!selectedIds.size || (!bulkClinician && !bulkTrainer)}>
              Apply to {selectedIds.size} selected
            </Button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <div className="grid grid-cols-[48px_1.5fr_1fr_1fr] gap-0 border-b border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
            <span />
            <span>Patient</span>
            <span>Clinician</span>
            <span>Trainer</span>
          </div>
          <div className="max-h-[52vh] overflow-y-auto">
            {filteredPatients.map((patient) => (
              <div key={patient.initials} className="grid grid-cols-[48px_1.5fr_1fr_1fr] gap-0 border-b border-slate-200 px-4 py-4 items-center text-sm">
                <label className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(patient.initials)}
                    onChange={() => toggleSelection(patient.initials)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-700"
                  />
                </label>
                <div>
                  <div className="font-medium text-slate-900">{patient.name}</div>
                  <div className="text-xs text-slate-500">{patient.initials} · {patient.status}</div>
                </div>
                <select
                  value={patient.clinician || ""}
                  onChange={(event) => onUpdatePatient(patient.initials, { clinician: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm"
                >
                  <option value="">Unassigned</option>
                  {clinicians.map((clinician) => (
                    <option key={clinician.initials} value={clinician.name}>{clinician.name}</option>
                  ))}
                </select>
                <select
                  value={patient.trainer || ""}
                  onChange={(event) => onUpdatePatient(patient.initials, { trainer: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm"
                >
                  <option value="">Unassigned</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.initials} value={trainer.name}>{trainer.name}</option>
                  ))}
                </select>
              </div>
            ))}
            {!filteredPatients.length && (
              <div className="px-4 py-8 text-center text-sm text-slate-500">No patients match the current filters.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamMemberProfileModal({ open, onClose, member, assignments = [], onMessage }) {
  const [messageText, setMessageText] = useState("");

  if (!open || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{member.name}</h2>
            <p className="text-sm text-slate-600">{member.note} · {member.status}</p>
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader><CardTitle>Assigned patients</CardTitle></CardHeader>
              <CardContent>
                {assignments.length ? (
                  <div className="space-y-3">
                    {assignments.map((patient) => (
                      <div key={patient.initials} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="font-medium text-slate-900">{patient.name}</div>
                        <div className="text-sm text-slate-500">{patient.initials} · {patient.status}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">No patients are currently assigned to this team member.</div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  rows={4}
                  placeholder={`Write a message to ${member.name}`}
                  className="w-full rounded-3xl border border-slate-200 p-4 text-sm shadow-sm"
                />
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      onMessage();
                      setMessageText("");
                    }}
                    className="rounded-xl bg-emerald-700 hover:bg-emerald-800"
                  >
                    Send message
                  </Button>
                  <Button variant="outline" onClick={onClose} className="rounded-xl">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-3xl border-slate-200 bg-slate-50 shadow-sm p-5">
            <div className="text-sm text-slate-600">Role</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{member.role?.charAt(0).toUpperCase() + member.role?.slice(1)}</div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>{member.email ? `Email: ${member.email}` : "Email not available"}</p>
              <p>{member.phone ? `Phone: ${member.phone}` : "Phone not available"}</p>
              <p>{member.status === "Active" ? "Currently active" : member.status}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ClinicianView({ section, onSelectPatient, selectedPatient, onBackToList, patients = [] }) {
  if (section === "overview") {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {clinicianMetrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} trend={metric.trend} />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Today&apos;s appointments</CardTitle></CardHeader>
            <CardContent>
              <AppRow left="2:00 PM" title="James Morrison" subtitle="8-week review · Week 8" badge="Up next" />
              <AppRow left="3:30 PM" title="Derek Klein" subtitle="Check-in consult · Week 5" badge="Scheduled" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Patients needing attention</CardTitle></CardHeader>
            <CardContent>
              {patients.filter(p => p.clinician === "Dr. Sarah Chen").slice(0, 2).map((patient) => (
                <PersonRow key={patient.initials} {...patient} onClick={() => onSelectPatient(patient.initials)} clickable />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (section === "patients") {
    if (selectedPatient) return <PatientProfile patient={selectedPatient} onBack={onBackToList} role="clinician" />;

    return (
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader><CardTitle>Assigned patients only</CardTitle></CardHeader>
        <CardContent>
          {patients.filter(p => p.clinician === "Dr. Sarah Chen").map((patient) => (
            <PersonRow key={patient.initials} {...patient} onClick={() => onSelectPatient(patient.initials)} clickable />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (section === "appointments") {
    return (
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader><CardTitle>Your assigned appointments</CardTitle></CardHeader>
        <CardContent>
          <AppRow left="Thu 2pm" title="James Morrison" subtitle="8-week review · Video" badge="Today" />
          <AppRow left="Thu 3:30pm" title="Derek Klein" subtitle="Check-in consult · Video" badge="Today" />
          <AppRow left="Fri 1pm" title="Marcus Reid" subtitle="Lab results review · Video" badge="Tomorrow" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader><CardTitle>Assigned patient analytics</CardTitle></CardHeader>
      <CardContent>
        <BarList items={moduleCompletion.map((item) => ({ ...item, display: `${item.value}%` }))} />
      </CardContent>
    </Card>
  );
}

function TrainerView({ section, onSelectPatient, selectedPatient, onBackToList, patients = [] }) {
  if (section === "overview") {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {trainerMetrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} trend={metric.trend} />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Today&apos;s training sessions</CardTitle></CardHeader>
            <CardContent>
              <AppRow left="11:00 AM" title="James Morrison" subtitle="Strength progression review" badge="Today" />
              <AppRow left="1:30 PM" title="Tom Reeves" subtitle="Onboarding movement screen" badge="Today" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Training reminders</CardTitle></CardHeader>
            <CardContent>
              <PersonRow initials="MR" name="Marcus Reid" note="Program update requested · Lower body emphasis" status="Active" onClick={() => onSelectPatient("MR")} clickable />
              <PersonRow initials="JM" name="James Morrison" note="Needs revised cardio block for week 9" status="Active" onClick={() => onSelectPatient("JM")} clickable />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (section === "patients") {
    if (selectedPatient) return <PatientProfile patient={selectedPatient} onBack={onBackToList} role="trainer" />;

    return (
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader><CardTitle>Patients who work with you</CardTitle></CardHeader>
        <CardContent>
          {patients.filter(p => p.trainer === "Alex Rivera").map((patient) => (
            <PersonRow key={patient.initials} {...patient} onClick={() => onSelectPatient(patient.initials)} clickable />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (section === "programs") {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <motion.div key={module.title} whileHover={{ y: -4 }}>
            <Card className="h-full rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="text-3xl">{module.icon}</div>
                <div className="mt-4 text-lg font-semibold text-slate-900">{module.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">{module.desc}</div>
                <div className="mt-4">
                  <StatusBadge status={module.status} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader><CardTitle>Messages from assigned patients</CardTitle></CardHeader>
      <CardContent>
        <AppRow left="9:10 AM" title="James Morrison" subtitle="Can we adjust tomorrow's session time?" badge="Today" />
        <AppRow left="Yesterday" title="Marcus Reid" subtitle="Need help with exercise video form" badge="Scheduled" />
      </CardContent>
    </Card>
  );
}

function PatientView({ section, patient, onBack }) {
  if (section === "dashboard") {
    const metrics = patient ? patient.metrics : patientMetrics;
    const goals = patient ? patient.goals.map(text => ({ text, done: false })) : weeklyGoals;
    const nextAppointment = patient ? patient.appointments[0] : { left: "Thu, Apr 24 · 10:00 AM", title: "Dr. Sarah Chen", subtitle: "8-week program review", badge: "Confirmed" };

    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>This week&apos;s goals</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.text} className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${goal.done ? "border-emerald-600 bg-emerald-600 text-white" : "border-emerald-300 text-transparent"}`}>
                    ✓
                  </div>
                  <span className={goal.done ? "text-slate-400 line-through" : "text-slate-800"}>{goal.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Next appointment</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">{nextAppointment.title}</div>
                <div className="mt-1 text-sm text-slate-500">{nextAppointment.left}</div>
                <div className="text-sm text-slate-500">{nextAppointment.subtitle}</div>
              </div>
              <StatusBadge status={nextAppointment.badge} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Clinician view</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-500">Assigned clinician</div>
              <div className="text-lg font-semibold text-slate-900">{patient?.clinician || "Unassigned"}</div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {patient?.name} is on {patient?.week || "an active program"} with status {patient?.status || "Unknown"}. Clinicians can review the care plan and update the medical oversight for this patient.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-medium text-slate-900">Clinician action</div>
                <div>Confirm the next review, check clinical notes, and update the patient’s assigned care team as needed.</div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Trainer view</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-500">Assigned trainer</div>
              <div className="text-lg font-semibold text-slate-900">{patient?.trainer || "Unassigned"}</div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                {patient?.name} is working on {patient?.program || "their current program"} with {patient?.adherence ?? 0}% adherence. Trainers can see progress, session notes, and program next steps.
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="font-medium text-slate-900">Trainer action</div>
                <div>Review the latest workout progress, adjust the training load, and coordinate follow-up sessions.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (section === "metrics") {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard label="Resting heart rate" value="58" unit="bpm" trend="↓ 6bpm since start" />
            <MetricCard label="VO2 max (est.)" value="44" unit="ml/kg" trend="↑ +3 since start" />
          </div>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader><CardTitle>Nutrition breakdown</CardTitle></CardHeader>
            <CardContent>
              <BarList items={nutritionBars} />
            </CardContent>
          </Card>
        </div>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Activity this week</CardTitle></CardHeader>
          <CardContent>
            <BarList items={activityBars} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (section === "program") {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <motion.div key={module.title} whileHover={{ y: -4 }}>
            <Card className="h-full rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="text-3xl">{module.icon}</div>
                <div className="mt-4 text-lg font-semibold text-slate-900">{module.title}</div>
                <div className="mt-2 text-sm leading-6 text-slate-500">{module.desc}</div>
                <div className="mt-4">
                  <StatusBadge status={module.status} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  }

  if (section === "goals") {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Active goals</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { text: "Lose 5kg by end of program", done: true },
              { text: "Reach 8,000 avg daily steps", done: false },
              { text: "Bring testosterone to optimal range", done: false },
              { text: "Sleep 7.5+ hrs/night consistently", done: false },
              { text: "Reduce systolic BP below 120", done: false },
            ].map((goal) => (
              <div key={goal.text} className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${goal.done ? "border-emerald-600 bg-emerald-600 text-white" : "border-emerald-300 text-transparent"}`}>
                  ✓
                </div>
                <span className={goal.done ? "text-slate-400 line-through" : "text-slate-800"}>{goal.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Progress overview</CardTitle></CardHeader>
          <CardContent>
            <BarList items={goalProgress.map((item) => ({ ...item, display: `${item.value}%` }))} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (section === "labs") {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Hormones</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {labs.hormones.map((lab) => (
              <div key={lab.name} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                <div>
                  <div className="font-medium text-slate-900">{lab.name}</div>
                  <div className="text-sm text-slate-500">{lab.ref}</div>
                </div>
                <div className={`font-semibold ${lab.normal ? "text-emerald-700" : "text-amber-700"}`}>{lab.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader><CardTitle>Metabolic & cardiovascular</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {labs.metabolic.map((lab) => (
              <div key={lab.name} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                <div>
                  <div className="font-medium text-slate-900">{lab.name}</div>
                  <div className="text-sm text-slate-500">{lab.ref}</div>
                </div>
                <div className={`font-semibold ${lab.normal ? "text-emerald-700" : "text-amber-700"}`}>{lab.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (section === "schedule") {
    return (
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader><CardTitle>Upcoming appointments</CardTitle></CardHeader>
        <CardContent>
          {schedule.map((item) => (
            <AppRow key={`${item.date}-${item.name}`} left={item.date} title={item.name} subtitle={item.type} badge={item.status} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader><CardTitle>Your care team</CardTitle></CardHeader>
        <CardContent>
          {careTeam.map((member) => (
            <PersonRow key={member.initials} initials={member.initials} name={member.name} note={`${member.role} · ${member.contact}`} status={member.status} />
          ))}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader><CardTitle>Contact options</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800">Message clinician</Button>
          <Button className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800">Message trainer</Button>
          <Button variant="outline" className="w-full rounded-xl">Request callback</Button>
          <p className="text-sm leading-6 text-slate-500">Patients only see their own profile, but they can contact both their trainer and clinician directly from this view.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MensHealthLongevityApp() {
  const [role, setRole] = useState("patient");
  const [section, setSection] = useState(defaultSectionByRole.patient);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [previousRole, setPreviousRole] = useState(null);
  const [previousSection, setPreviousSection] = useState(null);
  const [newPatients, setNewPatients] = useState([]);
  const [newProfiles, setNewProfiles] = useState({});
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newTrainers, setNewTrainers] = useState([]);
  const [newClinicians, setNewClinicians] = useState([]);
  const [showNewTrainerModal, setShowNewTrainerModal] = useState(false);
  const [showNewClinicianModal, setShowNewClinicianModal] = useState(false);
  const [showManageAssignments, setShowManageAssignments] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [showTeamMemberProfile, setShowTeamMemberProfile] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [signupPatientId, setSignupPatientId] = useState(null);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyToken, setVerifyToken] = useState(null);
  const [deletedPatientIds, setDeletedPatientIds] = useState([]);
  const [archivedPatients, setArchivedPatients] = useState([]);
  const [archivePatientId, setArchivePatientId] = useState(null);
  const [archiveReason, setArchiveReason] = useState("");
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showMergeSelectedModal, setShowMergeSelectedModal] = useState(false);
  const [mockSignupLink, setMockSignupLink] = useState(null);

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setSection(defaultSectionByRole[nextRole]);
    if (nextRole !== "patient") {
      setSelectedPatientId(null);
      setPreviousRole(null);
      setPreviousSection(null);
    }
  };

  const handleSectionChange = (nextSection) => {
    setSection(nextSection);
    setSelectedPatientId(null);
  };

  const handleSelectPatient = (patientId) => {
    setSelectedPatientId(patientId);
    setSection("patients");
  };

  const handleBackToList = () => {
    if (previousRole && role === "patient") {
      setRole(previousRole);
      setSection(previousSection || defaultSectionByRole[previousRole]);
      setPreviousRole(null);
      setPreviousSection(null);
      setSelectedPatientId(null);
      return;
    }

    setSelectedPatientId(null);
  };

  const handleViewAsPatient = (patientId) => {
    if (role !== "patient") {
      setPreviousRole(role);
      setPreviousSection(section);
    }
    setSelectedPatientId(patientId);
    setRole("patient");
    setSection(defaultSectionByRole.patient);
  };

  const handleDeletePatient = (patientId) => {
    setDeletedPatientIds((ids) => [...ids, patientId]);
    setNewProfiles((profiles) => {
      const next = { ...profiles };
      delete next[patientId];
      return next;
    });
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null);
    }
    // Remove from localStorage
    const persisted = JSON.parse(localStorage.getItem("mh_patients_v1") || "[]");
    const updated = persisted.filter(p => p.initials !== patientId);
    localStorage.setItem("mh_patients_v1", JSON.stringify(updated));
    alert(`Patient ${patientId} removed.`);
  };

  const handleArchivePatient = (patientId) => {
    setArchivePatientId(patientId);
    setArchiveReason("");
    setShowArchiveModal(true);
  };

  const handleConfirmArchivePatient = () => {
    const reason = archiveReason.trim();
    if (!reason) {
      return alert("Please provide a reason before archiving this patient.");
    }

    setArchivedPatients((current) => [
      ...current,
      { initials: archivePatientId, reason, archivedAt: new Date().toISOString() },
    ]);

    setShowArchiveModal(false);
    setArchivePatientId(null);
    setArchiveReason("");

    if (selectedPatientId === archivePatientId) {
      setSelectedPatientId(null);
    }
    alert(`Patient ${archivePatientId} archived.`);
  };

  const handleOpenMergeDuplicateProfiles = () => {
    if (!duplicatePatientGroups.length) {
      return alert("No obvious duplicate patient names found.");
    }
    setShowMergeModal(true);
  };

  const handleOpenMergeSelectedPatients = () => {
    setShowMergeSelectedModal(true);
  };

  const handleConfirmMergeDuplicateProfiles = ({ primaryId, duplicateIds, mergeFields }) => {
    if (!duplicateIds.length) {
      return alert("Select at least one duplicate profile to merge.");
    }

    const mergeArrays = (base = [], extra = []) => {
      const seen = new Set(base.map((item) => JSON.stringify(item)));
      return [...base, ...extra.filter((item) => !seen.has(JSON.stringify(item)))];
    };

    const primary = mergedAllPatients.find((patient) => patient.initials === primaryId);
    if (!primary) {
      return alert("Primary profile not found.");
    }

    const merged = { ...primary };
    duplicateIds.forEach((duplicateId) => {
      const dup = mergedAllPatients.find((patient) => patient.initials === duplicateId);
      if (!dup) return;

      mergeFields.forEach((field) => {
        const currentValue = merged[field];
        const incomingValue = dup[field];
        if (incomingValue == null || incomingValue === "") return;

        if (Array.isArray(currentValue) || Array.isArray(incomingValue)) {
          merged[field] = mergeArrays(
            Array.isArray(currentValue) ? currentValue : [],
            Array.isArray(incomingValue) ? incomingValue : []
          );
          return;
        }

        if (typeof currentValue === "object" && typeof incomingValue === "object") {
          merged[field] = { ...currentValue, ...incomingValue };
          return;
        }

        if (typeof currentValue === "string" && typeof incomingValue === "string") {
          if (!currentValue.trim()) {
            merged[field] = incomingValue;
            return;
          }
          if (currentValue === incomingValue || currentValue.includes(incomingValue)) return;
          merged[field] = [currentValue, incomingValue].filter(Boolean).join(" · ");
          return;
        }

        if (currentValue == null || currentValue === "") {
          merged[field] = incomingValue;
        }
      });
    });

    setNewProfiles((profiles) => ({
      ...profiles,
      [primaryId]: {
        ...mergedProfiles[primaryId],
        ...merged,
        initials: primaryId,
      },
    }));

    setDeletedPatientIds((ids) => [...ids, ...duplicateIds]);
    if (duplicateIds.includes(selectedPatientId)) setSelectedPatientId(primaryId);
    setShowMergeModal(false);

    alert("Selected duplicate profiles were merged into the primary profile.");
  };

  const handleConfirmMergeSelectedPatients = ({ primaryId, duplicateIds, mergeFields }) => {
    if (!duplicateIds.length) {
      return alert("Select at least one patient to merge.");
    }

    const mergeArrays = (base = [], extra = []) => {
      const seen = new Set(base.map((item) => JSON.stringify(item)));
      return [...base, ...extra.filter((item) => !seen.has(JSON.stringify(item)))];
    };

    const primary = mergedAllPatients.find((patient) => patient.initials === primaryId);
    if (!primary) {
      return alert("Primary profile not found.");
    }

    const merged = { ...primary };
    duplicateIds.forEach((duplicateId) => {
      const dup = mergedAllPatients.find((patient) => patient.initials === duplicateId);
      if (!dup) return;

      mergeFields.forEach((field) => {
        const currentValue = merged[field];
        const incomingValue = dup[field];
        if (incomingValue == null || incomingValue === "") return;

        if (Array.isArray(currentValue) || Array.isArray(incomingValue)) {
          merged[field] = mergeArrays(
            Array.isArray(currentValue) ? currentValue : [],
            Array.isArray(incomingValue) ? incomingValue : []
          );
          return;
        }

        if (typeof currentValue === "object" && typeof incomingValue === "object") {
          merged[field] = { ...currentValue, ...incomingValue };
          return;
        }

        if (typeof currentValue === "string" && typeof incomingValue === "string") {
          if (!currentValue.trim()) {
            merged[field] = incomingValue;
            return;
          }
          if (currentValue === incomingValue || currentValue.includes(incomingValue)) return;
          merged[field] = [currentValue, incomingValue].filter(Boolean).join(" · ");
          return;
        }

        if (currentValue == null || currentValue === "") {
          merged[field] = incomingValue;
        }
      });
    });

    setNewProfiles((profiles) => ({
      ...profiles,
      [primaryId]: {
        ...mergedProfiles[primaryId],
        ...merged,
        initials: primaryId,
      },
    }));

    setDeletedPatientIds((ids) => [...ids, ...duplicateIds]);
    if (duplicateIds.includes(selectedPatientId)) setSelectedPatientId(primaryId);
    setShowMergeSelectedModal(false);

    alert(`Successfully merged ${duplicateIds.length} patient profile(s) into ${primary.name}.`);
  };

  const archivedPatientIds = useMemo(() => archivedPatients.map((item) => item.initials), [archivedPatients]);
  const archivedPatientReasons = useMemo(
    () => archivedPatients.reduce((acc, item) => ({ ...acc, [item.initials]: item.reason }), {}),
    [archivedPatients]
  );
  const mergedProfiles = useMemo(() => ({ ...patientProfiles, ...newProfiles }), [newProfiles]);

  const selectedPatient = useMemo(
    () => (selectedPatientId ? mergedProfiles[selectedPatientId] : null),
    [selectedPatientId, mergedProfiles]
  );

  const header = useMemo(() => {
    const config = roleConfig[role];
    const title = role === "patient" && selectedPatient
      ? `Hello, ${selectedPatient.name}`
      : config.headerTitle;
    return {
      title,
      subtitle: config.headerSubtitle,
      initials: config.initials,
    };
  }, [role, selectedPatient]);

  const currentSectionLabel = roleConfig[role].sections.find((item) => item.key === section)?.label ?? "";

  const mergedAllPatients = useMemo(
    () => [...newPatients, ...allPatients].filter((patient) => !deletedPatientIds.includes(patient.initials)),
    [newPatients, deletedPatientIds]
  );
  const activePatients = useMemo(
    () => mergedAllPatients.filter((patient) => !archivedPatientIds.includes(patient.initials)),
    [mergedAllPatients, archivedPatientIds]
  );
  const archivedPatientList = useMemo(
    () => mergedAllPatients.filter((patient) => archivedPatientIds.includes(patient.initials)),
    [mergedAllPatients, archivedPatientIds]
  );
  const archivePatientName = archivePatientId ? mergedProfiles[archivePatientId]?.name || archivePatientId : "";
  const duplicatePatientGroups = useMemo(() => {
    const grouped = {};
    activePatients.forEach((patient) => {
      const key = patient.name.trim().toLowerCase();
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(patient.initials);
    });
    return Object.values(grouped).filter((group) => group.length > 1);
  }, [activePatients]);
  const mergedTeam = useMemo(() => [...newClinicians, ...newTrainers, ...teamMembers], [newClinicians, newTrainers]);
  const clinicianList = useMemo(() => mergedTeam.filter((member) => member.role === "clinician"), [mergedTeam]);
  const trainerList = useMemo(() => mergedTeam.filter((member) => member.role === "trainer"), [mergedTeam]);
  const assignmentPatients = useMemo(
    () => activePatients.map((patient) => ({
      ...patient,
      clinician: mergedProfiles[patient.initials]?.clinician || "",
      trainer: mergedProfiles[patient.initials]?.trainer || "",
    })),
    [activePatients, mergedProfiles]
  );
  const teamAssignments = useMemo(() => {
    const assignments = {};
    assignmentPatients.forEach((patient) => {
      if (patient.clinician) {
        assignments[patient.clinician] = assignments[patient.clinician] || [];
        assignments[patient.clinician].push(patient);
      }
      if (patient.trainer) {
        assignments[patient.trainer] = assignments[patient.trainer] || [];
        assignments[patient.trainer].push(patient);
      }
    });
    return assignments;
  }, [assignmentPatients]);
  const unassignedPatientCount = useMemo(
    () => assignmentPatients.filter((patient) => !patient.clinician || !patient.trainer).length,
    [assignmentPatients]
  );
  const adminOverviewMetrics = useMemo(
    () => [
      { label: "Total patients", value: `${activePatients.length}`, trend: "Across all clinicians and trainers" },
      { label: "Clinicians", value: `${clinicianList.length}`, trend: "Active clinician accounts" },
      { label: "Trainers", value: `${trainerList.length}`, trend: "Active trainer accounts" },
      { label: "Awaiting assignment", value: `${unassignedPatientCount}`, trend: "Patients missing clinician or trainer" },
    ],
    [activePatients.length, clinicianList.length, trainerList.length, unassignedPatientCount]
  );

  useEffect(() => {
    (async () => {
      try {
        const persisted = await storage.getPatients();
        if (persisted && persisted.length) setNewPatients((p) => [...persisted, ...p]);
        const persistedT = await storage.getTrainers();
        if (persistedT && persistedT.length) setNewTrainers((t) => [...persistedT, ...t]);
      } catch (e) {
        // ignore load errors
      }
    })();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patientId');
    const token = urlParams.get('token');
    if (patientId && token) {
      setSignupPatientId(patientId);
      setVerifyToken(token);
      setShowVerify(true);
    } else if (patientId) {
      setSignupPatientId(patientId);
      setShowSignup(true);
    }
  }, []);

  const openNewPatient = () => setShowNewPatientModal(true);
  const closeNewPatient = () => setShowNewPatientModal(false);
  const openNewTrainer = () => setShowNewTrainerModal(true);
  const closeNewTrainer = () => setShowNewTrainerModal(false);
  const openNewClinician = () => setShowNewClinicianModal(true);
  const closeNewClinician = () => setShowNewClinicianModal(false);
  const openManageAssignments = () => setShowManageAssignments(true);
  const closeManageAssignments = () => setShowManageAssignments(false);
  const openTeamMemberProfile = (member) => {
    setSelectedTeamMember(member);
    setShowTeamMemberProfile(true);
  };
  const closeTeamMemberProfile = () => {
    setShowTeamMemberProfile(false);
    setSelectedTeamMember(null);
  };
  const handleMessageTeamMember = (member) => {
    alert(`Message flow for ${member.name} is not yet connected in this demo.`);
  };

  const handleCreateStaff = ({ name, phone, email, method, action, role }) => {
    const parts = name.split(" ").filter(Boolean);
    let initials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[1][0]).toUpperCase();
    let suffix = 1;
    const exists = (id) => mergedProfiles[id] || mergedTeam.find((t) => t.initials === id);
    const base = initials;
    while (exists(initials)) {
      initials = `${base}${suffix}`;
      suffix += 1;
    }

    const newStaff = {
      initials,
      name,
      note: role === "clinician" ? "Clinician" : "Trainer",
      status: "Active",
      phone,
      email,
      role,
    };

    if (role === "trainer") {
      setNewTrainers((t) => [newStaff, ...t]);
      storage.addTrainer({ ...newStaff, createdAt: new Date().toISOString() }).catch(() => {});
    } else {
      setNewClinicians((c) => [newStaff, ...c]);
      localStorage.setItem(
        "mh_clinicians_v1",
        JSON.stringify([...(JSON.parse(localStorage.getItem("mh_clinicians_v1") || "[]") || []), { ...newStaff, createdAt: new Date().toISOString() }])
      );
    }

    const inviteUrl = `${window.location.origin}/signup?patientId=${initials}&role=${role}`;
    const dest = method === "email" ? email || phone : phone || email;
    setMockSignupLink(null);
    if (dest) {
      const bodyText = action === "credentials"
        ? `Your login credentials are ready. Access your ${role} profile here: ${inviteUrl}`
        : `Invite link to set up your ${role} profile: ${inviteUrl}`;

      fetch('http://localhost:3001/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: dest,
          body: bodyText,
        }),
      }).then(async response => {
        if (response.ok) {
          const data = await response.json();
          if (data.mock) {
            setMockSignupLink(inviteUrl);
            alert(`Mock invite sent to ${dest}. Use the link shown in the app or server console.`);
          } else {
            setMockSignupLink(null);
            alert(`Invite sent to ${dest}`);
          }
        } else {
          alert("Failed to send invite");
        }
      }).catch(err => alert("Error: " + err.message));
    } else {
      alert("No contact provided for invite");
    }

    setShowNewTrainerModal(false);
    setShowNewClinicianModal(false);
  };

  const handleUpdatePatientAssignment = (patientId, updates) => {
    setNewProfiles((profiles) => {
      const existing = mergedProfiles[patientId] || { initials: patientId };
      return {
        ...profiles,
        [patientId]: {
          ...existing,
          ...updates,
        },
      };
    });
  };

  const handleBulkPatientAssignment = (patientIds, updates) => {
    if (!patientIds.length || !Object.keys(updates).length) return;
    setNewProfiles((profiles) => {
      const next = { ...profiles };
      patientIds.forEach((patientId) => {
        const existing = mergedProfiles[patientId] || { initials: patientId };
        next[patientId] = {
          ...existing,
          ...updates,
        };
      });
      return next;
    });
  };

  const handleSignup = (patientId) => {
    setSignupPatientId(patientId);
    setShowSignup(true);
  };

  const handleVerify = (token, patientId) => {
    setVerifyToken(token);
    setSignupPatientId(patientId);
    setShowSignup(false);
    setShowVerify(true);
  };

  const handleLogin = (patientId) => {
    setRole("patient");
    setSection(defaultSectionByRole.patient);
    setSelectedPatientId(patientId);
    setShowSignup(false);
    setShowVerify(false);
  };

  const handleCreatePatient = ({ name, phone, email, method, action }) => {
    const parts = name.split(" ").filter(Boolean);
    let initials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[1][0]).toUpperCase();
    let suffix = 1;
    let base = initials;
    while (mergedProfiles[initials]) {
      initials = `${base}${suffix}`;
      suffix += 1;
    }

    const contact = [phone, email].filter(Boolean).join(" · ");
    const newPatient = {
      initials,
      name,
      note: contact || "New patient",
      status: "New",
    };

    const profile = {
      initials,
      name,
      status: "New",
      week: "",
      clinician: "",
      trainer: "",
      age: "",
      program: "",
      adherence: 0,
      metrics: [],
      goals: [],
      notes: [],
      appointments: [],
      contact: { phone, email },
      dob: "",
    };

    setNewPatients((p) => [newPatient, ...p]);
    setNewProfiles((p) => ({ ...p, [initials]: profile }));
    storage.addPatient({ ...profile, createdAt: new Date().toISOString() }).catch(() => {});
    setShowNewPatientModal(false);

    const signupUrl = `${window.location.origin}/signup?patientId=${initials}`;
    const dest = method === "email" ? email : phone;
    setMockSignupLink(null);
    if (dest) {
      const bodyText = action === "credentials"
        ? `Your login credentials are ready. Access your patient profile here: ${signupUrl}`
        : `Sign up for your health profile: ${signupUrl}`;

      fetch('http://localhost:3001/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: dest,
          body: bodyText,
        }),
      }).then(async response => {
        if (response.ok) {
          const data = await response.json();
          if (data.mock) {
            setMockSignupLink(signupUrl);
            alert(`Mock invite sent to ${dest}. Use the link shown in the app or server console.`);
          } else {
            setMockSignupLink(null);
            alert(`Invite sent to ${dest}`);
          }
        } else {
          alert("Failed to send invite");
        }
      }).catch(err => alert("Error: " + err.message));
    } else {
      alert("No contact provided for invite");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {showSignup ? (
        <Signup patientId={signupPatientId} onVerify={handleVerify} />
      ) : showVerify ? (
        <Verify token={verifyToken} patientId={signupPatientId} onLogin={handleLogin} />
      ) : (
        <>
          {mockSignupLink && (
            <div className="mx-auto mb-4 max-w-7xl rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-slate-800 shadow-sm">
              <div className="font-semibold text-emerald-900">Test invite link</div>
              <p className="mt-1 text-slate-700">This is a mock invite flow. Open the link below to complete setup or check the server console for details.</p>
              <a href={mockSignupLink} className="break-words font-medium text-emerald-700 underline">
                {mockSignupLink}
              </a>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto grid min-h-[88vh] max-w-7xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[290px_1fr]"
          >
          <Sidebar role={role} section={section} onRoleChange={handleRoleChange} onSectionChange={handleSectionChange} />

          <main className="flex min-w-0 flex-col bg-slate-50">
            <SectionHeader {...header} />

            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{roleConfig[role].portalLabel}</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{selectedPatient ? `${currentSectionLabel} · ${selectedPatient.name}` : currentSectionLabel}</div>
                </div>
                <Button className="rounded-xl bg-emerald-700 hover:bg-emerald-800">
                  {role === "admin" ? (
                    <>
                      <UserCog className="mr-2 h-4 w-4" /> Manage access
                    </>
                  ) : role === "clinician" ? (
                    <>
                      <Activity className="mr-2 h-4 w-4" /> Add note
                    </>
                  ) : role === "trainer" ? (
                    <>
                      <Dumbbell className="mr-2 h-4 w-4" /> Update program
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" /> Contact care team
                    </>
                  )}
                </Button>
              </div>

              {role === "admin" && (
                <AdminView
                  section={section}
                  onSelectPatient={handleSelectPatient}
                  selectedPatient={selectedPatient}
                  onBackToList={handleBackToList}
                  patients={activePatients}
                  archivedPatients={archivedPatientList}
                  archivedReasons={archivedPatientReasons}
                  adminMetrics={adminOverviewMetrics}
                  onOpenNewPatient={openNewPatient}
                  team={mergedTeam}
                  onOpenNewTrainer={openNewTrainer}
                  onOpenNewClinician={openNewClinician}
                  onOpenManageAssignments={openManageAssignments}
                  onViewTeamMember={openTeamMemberProfile}
                  onMessageTeamMember={handleMessageTeamMember}
                  onDeletePatient={handleDeletePatient}
                  onArchivePatient={handleArchivePatient}
                  onOpenMergeDuplicateProfiles={handleOpenMergeDuplicateProfiles}
                  onOpenMergeSelectedPatients={handleOpenMergeSelectedPatients}
                  duplicateGroups={duplicatePatientGroups}
                  onViewAsPatient={handleViewAsPatient}
                />
              )}
              {role === "clinician" && (
                <ClinicianView section={section} onSelectPatient={handleSelectPatient} selectedPatient={selectedPatient} onBackToList={handleBackToList} patients={activePatients} />
              )}
              {role === "trainer" && (
                <TrainerView section={section} onSelectPatient={handleSelectPatient} selectedPatient={selectedPatient} onBackToList={handleBackToList} patients={activePatients} />
              )}
              {role === "patient" && <PatientView section={section} patient={selectedPatient || patientProfiles.JM} onBack={handleBackToList} />}
            </div>
          </main>
        </motion.div>
        </>
      )}
      <NewPatientModal open={showNewPatientModal} onClose={closeNewPatient} onCreate={handleCreatePatient} />
      <NewTrainerModal open={showNewTrainerModal} onClose={closeNewTrainer} onCreate={(payload) => handleCreateStaff({ ...payload, role: "trainer" })} role="trainer" />
      <NewTrainerModal open={showNewClinicianModal} onClose={closeNewClinician} onCreate={(payload) => handleCreateStaff({ ...payload, role: "clinician" })} role="clinician" />
      <ManageAssignmentsModal
        open={showManageAssignments}
        onClose={closeManageAssignments}
        patients={assignmentPatients}
        clinicians={clinicianList}
        trainers={trainerList}
        onUpdatePatient={handleUpdatePatientAssignment}
        onBulkUpdate={handleBulkPatientAssignment}
      />
      <TeamMemberProfileModal
        open={showTeamMemberProfile}
        onClose={closeTeamMemberProfile}
        member={selectedTeamMember}
        assignments={selectedTeamMember ? teamAssignments[selectedTeamMember.name] || [] : []}
        onMessage={() => selectedTeamMember && handleMessageTeamMember(selectedTeamMember)}
      />
      <ArchivePatientModal
        open={showArchiveModal}
        patientName={archivePatientName}
        reason={archiveReason}
        onReasonChange={setArchiveReason}
        onClose={() => {
          setShowArchiveModal(false);
          setArchivePatientId(null);
        }}
        onArchive={handleConfirmArchivePatient}
      />
      <MergeDuplicateProfilesModal
        open={showMergeModal}
        duplicateGroups={duplicatePatientGroups}
        patients={activePatients}
        onClose={() => setShowMergeModal(false)}
        onConfirm={handleConfirmMergeDuplicateProfiles}
      />
      <MergeSelectedPatientsModal
        open={showMergeSelectedModal}
        patients={activePatients}
        onClose={() => setShowMergeSelectedModal(false)}
        onConfirm={handleConfirmMergeSelectedPatients}
      />
    </div>
  );
}
