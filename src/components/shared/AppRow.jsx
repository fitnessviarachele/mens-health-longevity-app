import { StatusBadge } from "@/components/shared/StatusBadge";

export function AppRow({ left, title, subtitle, badge }) {
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
