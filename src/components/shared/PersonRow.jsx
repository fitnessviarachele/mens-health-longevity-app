import { Archive, ChevronRight, MessageSquare, Trash2, UserCog } from "lucide-react";

import { StatusBadge } from "@/components/shared/StatusBadge";

export function PersonRow({
  initials,
  avatar,
  name,
  note,
  status,
  onClick,
  onDelete,
  onArchive,
  onViewAsPatient,
  onViewProfile,
  onMessage,
  clickable = false,
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex w-full items-center gap-3 border-b border-slate-100 py-4 text-left last:border-b-0 ${clickable ? "transition hover:bg-slate-50" : ""}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
        {avatar ? <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" /> : initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-medium text-slate-900">{name}</div>
        <div className="text-sm text-slate-500">{note}</div>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={status} />

        {onViewProfile ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onViewProfile();
            }}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            title="View clinician or trainer profile"
          >
            <UserCog className="h-4 w-4" />
          </button>
        ) : null}

        {onMessage ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onMessage();
            }}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            title="Message"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        ) : null}

        {onViewAsPatient ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onViewAsPatient();
            }}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            title="View patient portal"
          >
            <UserCog className="h-4 w-4" />
          </button>
        ) : null}

        {onArchive ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onArchive();
            }}
            className="rounded-full p-2 text-slate-700 hover:bg-slate-100"
            title="Archive"
          >
            <Archive className="h-4 w-4" />
          </button>
        ) : null}

        {onDelete ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="rounded-full p-2 text-rose-600 hover:bg-rose-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}

        {clickable ? <ChevronRight className="h-4 w-4 text-slate-400" /> : null}
      </div>
    </div>
  );
}
