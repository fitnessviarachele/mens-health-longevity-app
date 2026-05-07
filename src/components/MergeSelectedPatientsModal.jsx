import React, { useMemo, useState } from "react";

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

export default function MergeSelectedPatientsModal({
  open,
  patients,
  onClose,
  onConfirm,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [primaryId, setPrimaryId] = useState("");
  const [fieldSelections, setFieldSelections] = useState(
    mergeFieldsConfig.reduce((acc, field) => {
      acc[field.key] = true;
      return acc;
    }, {})
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  const togglePatientId = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const selectedPatients = useMemo(
    () => patients.filter((p) => selectedIds.includes(p.initials)),
    [selectedIds, patients]
  );

  if (!open) return null;

  const handleMergeClick = () => {
    if (!primaryId) return alert("Please select a primary profile.");
    if (!selectedIds.length) return alert("Please select at least one patient to merge.");
    if (selectedIds.length < 2) return alert("Please select at least 2 patients to merge.");
    setShowConfirmation(true);
  };

  const handleConfirmMerge = () => {
    const duplicateIds = selectedIds.filter((id) => id !== primaryId);
    onConfirm({
      primaryId,
      duplicateIds,
      mergeFields: Object.keys(fieldSelections).filter((key) => fieldSelections[key]),
    });
    setShowConfirmation(false);
    setSelectedIds([]);
    setPrimaryId("");
  };

  if (showConfirmation) {
    const primaryPatient = patients.find((p) => p.initials === primaryId);
    const countOthers = selectedIds.length - 1;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-semibold text-slate-900">Confirm merge</h3>
          </div>
          <div className="space-y-4 px-6 py-5">
            <p className="text-sm text-slate-700">
              You are about to merge <strong>{countOthers}</strong> patient profile{countOthers !== 1 ? "s" : ""} into <strong>{primaryPatient?.name}</strong>.
            </p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">⚠️ This action cannot be undone</p>
              <p className="mt-2 text-sm text-amber-800">
                The selected duplicate profiles will be marked as deleted, and their data will be compiled into the primary profile.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-slate-500">Primary profile:</p>
              <p className="text-sm font-medium text-slate-900">{primaryPatient?.name} ({primaryId})</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-slate-500">Profiles to merge:</p>
              <div className="space-y-1">
                {selectedIds
                  .filter((id) => id !== primaryId)
                  .map((id) => {
                    const patient = patients.find((p) => p.initials === id);
                    return (
                      <p key={id} className="text-sm text-slate-700">
                        {patient?.name} ({id})
                      </p>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmMerge}
              className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
            >
              Confirm merge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Manually merge patient profiles</h3>
              <p className="mt-1 text-sm text-slate-500">Select the patients you want to merge and choose the primary profile.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              Close
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-900">Select patients</div>
                <div className="text-xs font-medium text-slate-500">{selectedIds.length} selected</div>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {patients.map((patient) => (
                  <label
                    key={patient.initials}
                    className="flex items-center gap-3 rounded-2xl border p-3 text-sm cursor-pointer hover:border-slate-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(patient.initials)}
                      onChange={() => togglePatientId(patient.initials)}
                      className="h-4 w-4 text-emerald-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900">{patient.name}</div>
                      <div className="text-xs text-slate-500">{patient.note}</div>
                    </div>
                    <div className="text-xs font-medium text-slate-400">({patient.initials})</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-900">Choose primary profile</div>
              <div className="space-y-2">
                {selectedPatients.map((patient) => (
                  <label
                    key={patient.initials}
                    className="flex items-center gap-3 rounded-2xl border p-3 text-sm cursor-pointer hover:border-slate-300"
                  >
                    <input
                      type="radio"
                      name="primaryProfile"
                      value={patient.initials}
                      checked={primaryId === patient.initials}
                      onChange={() => setPrimaryId(patient.initials)}
                      className="h-4 w-4 text-emerald-600"
                    />
                    <span className="font-medium text-slate-900">{patient.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">Fields to merge</div>
            <div className="grid gap-3">
              {mergeFieldsConfig.map((field) => (
                <label key={field.key} className="flex items-center gap-3 rounded-2xl border p-3 text-sm cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={fieldSelections[field.key]}
                    onChange={() =>
                      setFieldSelections((current) => ({
                        ...current,
                        [field.key]: !current[field.key],
                      }))
                    }
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
          <button
            type="button"
            onClick={handleMergeClick}
            disabled={selectedIds.length < 2 || !primaryId}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-emerald-800"
          >
            Merge {selectedIds.length < 2 ? "patients" : `${selectedIds.length} patients`}
          </button>
        </div>
      </div>
    </div>
  );
}
