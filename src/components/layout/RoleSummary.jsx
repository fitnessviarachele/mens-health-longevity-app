import { Dumbbell, MessageSquare, ShieldCheck, Stethoscope } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

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

export function RoleSummary({ role }) {
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
