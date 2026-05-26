import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Phone,
  Stethoscope,
  Target,
  UserCog,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewPatientModal from "@/components/NewPatientModal";
import NewTrainerModal from "@/components/NewTrainerModal";
import ArchivePatientModal from "@/components/ArchivePatientModal";
import MergeDuplicateProfilesModal from "@/components/MergeDuplicateProfilesModal";
import MergeSelectedPatientsModal from "@/components/MergeSelectedPatientsModal";
import Signup from "@/components/Signup";
import Verify from "@/components/Verify";
import storage from "@/lib/storage";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppRow } from "@/components/shared/AppRow";
import { BarList } from "@/components/shared/BarList";
import { MetricCard } from "@/components/shared/MetricCard";
import { PersonRow } from "@/components/shared/PersonRow";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  activityBars,
  allPatients,
  careTeam,
  clinicianMetrics,
  defaultSectionByRole,
  goalProgress,
  labs,
  moduleCompletion,
  modules,
  nutritionBars,
  patientMetrics,
  patientProfiles,
  schedule,
  teamMembers,
  trainerMetrics,
  weeklyGoals,
} from "@/data/mockData";

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

function PatientView({ section, patient }) {
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
      } catch {
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
          <Sidebar role={role} section={section} roleConfig={roleConfig} onRoleChange={handleRoleChange} onSectionChange={handleSectionChange} />

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
              {role === "patient" && <PatientView section={section} patient={selectedPatient || patientProfiles.JM} />}
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
