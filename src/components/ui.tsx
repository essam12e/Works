import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { priorityLabels, statusLabels, type TaskPriority, type TaskStatus } from "@/lib/format";

export function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
        ح
      </span>
      <span className="text-xl font-bold text-slate-950">حافظة أعمال</span>
    </Link>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  tone = "slate",
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "slate" | "teal" | "amber" | "rose";
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
        </div>
        <span className={`grid size-12 place-items-center rounded-2xl ${tones[tone]}`}>
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const classes: Record<TaskStatus, string> = {
    NEW: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-sky-50 text-sky-700",
    COMPLETED: "bg-indigo-50 text-indigo-700",
    WAITING_REVIEW: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    NEEDS_CHANGES: "bg-rose-50 text-rose-700",
  };

  const typedStatus = status as TaskStatus;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[typedStatus] ?? "bg-slate-100 text-slate-700"}`}>
      {statusLabels[typedStatus] ?? status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const classes: Record<TaskPriority, string> = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-teal-50 text-teal-700",
    HIGH: "bg-amber-50 text-amber-700",
    URGENT: "bg-rose-50 text-rose-700",
  };

  const typedPriority = priority as TaskPriority;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes[typedPriority] ?? "bg-slate-100 text-slate-600"}`}>
      {priorityLabels[typedPriority] ?? priority}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center p-8 text-center">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">{body}</p>
    </div>
  );
}
