import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ label, value, unit, trend, positive = true }) {
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
