import { Progress } from "@/components/ui/progress";

export function BarList({ items }) {
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
