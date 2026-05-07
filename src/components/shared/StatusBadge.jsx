import { Badge } from "@/components/ui/badge";

const statusStyles = {
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

export function StatusBadge({ status }) {
  return (
    <Badge className={`rounded-full px-3 py-1 font-medium ${statusStyles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </Badge>
  );
}
