import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, MessageSquare, Paperclip } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/ui";
import { requireManagerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export default async function ActivityPage() {
  const user = await requireManagerCompany();
  const employees = await prisma.employee.findMany({
    where: { companyId: user.companyId },
    include: {
      tasks: {
        include: {
          comments: true,
          attachments: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">سجل العمليات</h1>
        <p className="mt-2 text-slate-500">ملخص أعمال الموظفين بعد التسليم والمراجعة، مع الوصول السريع للتعليقات والمرفقات.</p>
      </div>

      {employees.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {employees.map((employee) => {
            const approved = employee.tasks.filter((task) => task.status === "APPROVED").length;
            const waiting = employee.tasks.filter((task) => task.status === "WAITING_REVIEW").length;
            const comments = employee.tasks.reduce((total, task) => total + task.comments.length, 0);
            const attachments = employee.tasks.reduce((total, task) => total + task.attachments.length, 0);

            return (
              <Link
                key={employee.id}
                href={`/dashboard/activity/${employee.id}`}
                className="panel group block p-5 transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-slate-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-bold text-slate-950">{employee.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{employee.title}</p>
                    <p className="mt-2 text-xs text-slate-400">آخر تحديث {formatDateTime(employee.updatedAt)}</p>
                  </div>
                  <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                    <ArrowLeft size={18} />
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <Metric icon={Clock3} label="المهام" value={employee.tasks.length} />
                  <Metric icon={CheckCircle2} label="معتمدة" value={approved} />
                  <Metric icon={MessageSquare} label="تعليقات" value={comments + waiting} />
                  <Metric icon={Paperclip} label="مرفقات" value={attachments} />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState title="لا يوجد سجل بعد" body="سيظهر سجل عمليات الموظفين بعد إضافة مهام وتعليقات ومرفقات." />
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <Icon size={16} className="text-teal-700" />
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
    </div>
  );
}
