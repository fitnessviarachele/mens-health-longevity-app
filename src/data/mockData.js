export const defaultSectionByRole = {
  admin: "overview",
  clinician: "overview",
  trainer: "overview",
  patient: "dashboard",
};

export const adminMetrics = [
  { label: "Total patients", value: "48", trend: "Across all clinicians and trainers" },
  { label: "Clinicians", value: "6", trend: "2 accepting new patients" },
  { label: "Trainers", value: "5", trend: "1 onboarding this week" },
];

export const clinicianMetrics = [
  { label: "Assigned patients", value: "24", trend: "Only your roster is shown" },
  { label: "Avg adherence", value: "76%", trend: "↑ 8% vs last cohort" },
  { label: "Appts today", value: "6", trend: "2 remaining" },
];

export const trainerMetrics = [
  { label: "Training clients", value: "18", trend: "Patients assigned to you" },
  { label: "Avg completion", value: "82%", trend: "Strength and cardio tasks" },
  { label: "Sessions today", value: "4", trend: "2 virtual, 2 in-clinic" },
];

export const patientMetrics = [
  { label: "Weight", value: "87", unit: "kg", trend: "↓ 3.2kg since start", positive: true },
  { label: "Blood pressure", value: "122/78", trend: "↑ Improved", positive: true },
  { label: "Sleep avg", value: "7.2", unit: "hr", trend: "↑ +0.8hr", positive: true },
];

export const weeklyGoals = [
  { text: "3× strength sessions", done: true },
  { text: "Log meals Mon–Thu", done: true },
  { text: "Complete sleep module", done: false },
  { text: "Morning walk 5 of 7 days", done: false },
];

export const nutritionBars = [
  { label: "Protein", value: 78, display: "156g" },
  { label: "Carbs", value: 55, display: "210g" },
  { label: "Fats", value: 60, display: "68g" },
  { label: "Calories", value: 85, display: "2,180" },
];

export const activityBars = [
  { label: "Steps/day", value: 72, display: "8,640" },
  { label: "Active mins", value: 66, display: "198" },
  { label: "Strength", value: 100, display: "3/3" },
];

export const modules = [
  { icon: "🧠", title: "Stress & cognitive health", desc: "HRV, mindfulness, sleep architecture", status: "Completed" },
  { icon: "🏋️", title: "Strength & muscle", desc: "Progressive overload, recovery protocols", status: "In progress" },
  { icon: "🥗", title: "Metabolic nutrition", desc: "Protein optimisation, meal timing, gut health", status: "In progress" },
  { icon: "💤", title: "Sleep optimisation", desc: "Circadian rhythm, sleep hygiene, recovery", status: "Upcoming" },
  { icon: "🩸", title: "Hormonal health", desc: "Testosterone, cortisol, thyroid markers", status: "Upcoming" },
  { icon: "❤️", title: "Cardiovascular health", desc: "Zone 2 training, lipid panel, BP targets", status: "Upcoming" },
];

export const goalProgress = [
  { label: "Weight", value: 64 },
  { label: "Activity", value: 80 },
  { label: "Sleep", value: 50 },
  { label: "Hormones", value: 30 },
];

export const labs = {
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

export const schedule = [
  { date: "Apr 24", name: "8-week review — Dr. Chen", type: "Program check-in · Video", status: "Confirmed" },
  { date: "May 6", name: "Blood draw & labs", type: "Pathology · In-clinic", status: "Scheduled" },
  { date: "May 15", name: "Nutrition coaching", type: "With Dana Walsh RD · Video", status: "Scheduled" },
  { date: "May 28", name: "12-week graduation review", type: "Full assessment · In-clinic", status: "Tentative" },
];

export const allPatients = [
  { initials: "JM", name: "James Morrison", note: "Week 8 · Clinician: Dr. Chen · Trainer: Alex", status: "On track" },
  { initials: "DK", name: "Derek Klein", note: "Week 5 · Clinician: Dr. Chen · Trainer: Maya", status: "At risk" },
  { initials: "TR", name: "Tom Reeves", note: "Week 1 · Clinician: Dr. Cole · Trainer: Alex", status: "New" },
  { initials: "MR", name: "Marcus Reid", note: "Week 6 · Clinician: Dr. Chen · Trainer: Alex", status: "On track" },
  { initials: "PH", name: "Phil Hartley", note: "Week 11 · Clinician: Dr. Cole · Trainer: Maya", status: "Excellent" },
];

export const clinicianAssignedPatients = allPatients.filter((patient) => ["JM", "DK", "MR"].includes(patient.initials));
export const trainerAssignedPatients = allPatients.filter((patient) => ["JM", "TR", "MR"].includes(patient.initials));

export const teamMembers = [
  { initials: "SC", name: "Dr. Sarah Chen", note: "Clinician · 24 assigned patients", status: "Active", role: "clinician" },
  { initials: "JC", name: "Dr. Julia Cole", note: "Clinician · 24 assigned patients", status: "Active", role: "clinician" },
  { initials: "AR", name: "Alex Rivera", note: "Trainer · 18 assigned patients", status: "Active", role: "trainer" },
  { initials: "MP", name: "Maya Patel", note: "Trainer · 16 assigned patients", status: "Active", role: "trainer" },
];

export const moduleCompletion = [
  { label: "Stress & cognition", value: 87 },
  { label: "Strength", value: 74 },
  { label: "Nutrition", value: 68 },
  { label: "Sleep", value: 45 },
  { label: "Hormonal health", value: 30 },
];

export const careTeam = [
  { initials: "SC", name: "Dr. Sarah Chen", role: "Assigned clinician", contact: "Secure message or clinic line", status: "Available" },
  { initials: "AR", name: "Alex Rivera", role: "Assigned trainer", contact: "In-app chat or session booking", status: "Available" },
];

export const patientProfiles = {
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
