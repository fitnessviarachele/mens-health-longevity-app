export function SectionHeader({ title, subtitle, initials }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 font-semibold text-emerald-700">
        {initials}
      </div>
    </div>
  );
}
