import React from "react";

export default function ArchivePatientModal({ open, patientName, reason, onReasonChange, onClose, onArchive }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Archive patient</h3>
        <p className="mb-4 text-sm text-slate-600">Please provide a reason for archiving {patientName || "this patient"}.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              rows={4}
              placeholder="E.g. patient transferred, inactive, completed program"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">Cancel</button>
            <button type="button" onClick={onArchive} className="rounded-md bg-emerald-700 px-4 py-2 text-white">Archive patient</button>
          </div>
        </div>
      </div>
    </div>
  );
}
