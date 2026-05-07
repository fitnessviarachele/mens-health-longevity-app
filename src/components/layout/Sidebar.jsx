import { ChevronRight } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleSummary } from "@/components/layout/RoleSummary";

export function Sidebar({ role, section, roleConfig, onRoleChange, onSectionChange }) {
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
