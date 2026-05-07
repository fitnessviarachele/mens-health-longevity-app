import React, { useEffect, useMemo, useState } from "react";

const mergeFieldsConfig = [
  { key: "note", label: "Summary note" },
  { key: "bio", label: "Bio / profile detail" },
  { key: "status", label: "Status" },
  { key: "week", label: "Current week" },
  { key: "clinician", label: "Clinician" },
  { key: "trainer", label: "Trainer" },
  { key: "goals", label: "Goals" },
  { key: "notes", label: "Care notes" },
  { key: "appointments", label: "Appointments" },
  { key: "metrics", label: "Metrics" },
];

export default function MergeDuplicateProfilesModal({
  open,
  duplicateGroups,
  patients,
  onClose,
  onConfirm,
}) {
  const groupOptions = useMemo(
    () =>
      duplicateGroups.map((group) => ({
        ids: group,
        label: group
          .map((id) => patients.find((patient) => patient.initials === id)?.name || id)
          .join(" · "),
      })),
    [duplicateGroups, patients]
  );

  const [groupIndex, setGroupIndex] = useState(0);
  const [primaryId, setPrimaryId] = useState("");
  const [includeIds, setIncludeIds] = useState([]);
  const [fieldSelections, setFieldSelections] = useState(
    mergeFieldsConfig.reduce((acc, field) => {
      acc[field.key] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    if (!open) return;
    if (!groupOptions.length) return;

    const ids = groupOptions[0].ids;
    setGroupIndex(0);
    setPrimaryId(ids[0]);
    setIncludeIds(ids.slice(1));
  }, [open, groupOptions]);

  useEffect(() => {
    const group = groupOptions[groupIndex];
    if (!group) return;
    setPrimaryId(group.ids[0]);
    setIncludeIds(group.ids.slice(1));
  }, [groupIndex, groupOptions]);

  if (!open || !groupOptions.length) return null;

  const group = groupOptions[groupIndex];
  const groupPatientIds = group.ids;
  const duplicateCandidates = groupPatientIds.filter((id) => id !== primaryId);

  const toggleIncludeId = (id) => {
    setIncludeIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleConfirm = () => {
    if (!primaryId) return;
    if (!includeIds.length) return alert("Select at least one duplicate profile to merge.");
    onConfirm({ primaryId, duplicateIds: includeIds, mergeFields: Object.keys(fieldSelections).filter((key) => fieldSelections[key]) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Merge duplicate profiles</h3>
              <p className="mt-1 text-sm text-slate-500">Choose the primary profile and the duplicate data to keep.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Close
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            {groupOptions.length > 1 ? (
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">Choose a duplicate group</div>
                <div className="space-y-2">
                  {groupOptions.map((option, index) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setGroupIndex(index)}
                      className={`w-full rounded-2xl px-4 py-3 text-left ${index === groupIndex ? "bg-emerald-700 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-900">Primary profile</div>
              {groupPatientIds.map((id) => {
                const patient = patients.find((p) => p.initials === id);
                return (
                  <label key={id} className="flex items-center gap-3 rounded-2xl border p-3 text-sm cursor-pointer hover:border-slate-300">
                    <input
                      type="radio"
                      name="primaryProfile"
                      value={id}
                      checked={primaryId === id}
                      onChange={() => setPrimaryId(id)}
                      className="h-4 w-4 text-emerald-600"
                    />
                    <span>{patient?.name || id} <span className="text-slate-500">({id})</span></span>
                  </label>
                );
              })}
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-900">Select duplicates to merge</div>
              {duplicateCandidates.map((id) => {
                const patient = patients.find((p) => p.initials === id);
                return (
                  <label key={id} className="flex items-center gap-3 rounded-2xl border p-3 text-sm cursor-pointer hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={includeIds.includes(id)}
                      onChange={() => toggleIncludeId(id)}
                      className="h-4 w-4 text-emerald-600"
                    />
                    <span>{patient?.name || id} <span className="text-slate-500">({id})</span></span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">Fields to merge from duplicates</div>
            <div className="grid gap-3">
              {mergeFieldsConfig.map((field) => (
                <label key={field.key} className="flex items-center gap-3 rounded-2xl border p-3 text-sm cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={fieldSelections[field.key]}
                    onChange={() => setFieldSelections((current) => ({ ...current, [field.key]: !current[field.key] }))}
                    className="h-4 w-4 text-emerald-600"
                  />
                  <span>{field.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            Merge selected profiles
          </button>
        </div>
      </div>
    </div>
  );
}
