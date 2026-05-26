import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

import { PriorityBadge, StatusBadge } from "@/components/ui";
import { requireManagerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/format";

type EmployeeActivityTask = {
  id: string;
  title: string;
  dueDate: Date;
  updatedAt: Date;
  status: string;
  priority: string;
  comments: Array<{
    id: string;
    authorName: string;
    createdAt: Date;
    body: string;
  }>;
  attachments: Array<{
    id: string;
    fileUrl: string;
    fileName: string;
    source: string;
  }>;
};

export default async function EmployeeActivityPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const user = await requireManagerCompany();
  const { employeeId } = await params;
  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, companyId: user.companyId },
    include: {
      tasks: {
        include: {
          comments: { orderBy: { createdAt: "asc" } },
          attachments: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!employee) notFound();
  const tasks = employee.tasks as EmployeeActivityTask[];

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/activity" className="text-sm font-bold text-teal-700">
          العودة إلى سجل العمليات
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">{employee.name}</h1>
        <p className="mt-2 text-slate-500">{employee.title} · {employee.email}</p>
      </div>

      <div className="space-y-5">
        {tasks.map((task: EmployeeActivityTask) => (
          <article key={task.id} className="panel p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <Link href={`/dashboard/tasks/${task.id}`} className="text-2xl font-bold text-slate-950 hover:text-teal-700">
                  {task.title}
                </Link>
                <p className="mt-2 text-sm text-slate-500">تاريخ التسليم {formatDate(task.dueDate)} · آخر تحديث {formatDateTime(task.updatedAt)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <section className="rounded-2xl bg-slate-50 p-4">
                <h2 className="font-bold text-slate-950">التعليقات</h2>
                <div className="mt-3 space-y-3">
                  {task.comments.map((comment: EmployeeActivityTask["comments"][number]) => (
                    <div key={comment.id} className="rounded-xl bg-white p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-slate-900">{comment.authorName}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</p>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{comment.body}</p>
                    </div>
                  ))}
                  {!task.comments.length && <p className="text-sm text-slate-500">لا توجد تعليقات.</p>}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 p-4">
                <h2 className="font-bold text-slate-950">المرفقات</h2>
                <div className="mt-3 space-y-2">
                  {task.attachments.map((file: EmployeeActivityTask["attachments"][number]) => (
                    <a
                      key={file.id}
                      href={file.fileUrl}
                      target="_blank"
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <span className="truncate">{file.fileName}</span>
                      <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                        {file.source === "EMPLOYEE" ? "الموظف" : "المدير"}
                        <Download size={14} />
                      </span>
                    </a>
                  ))}
                  {!task.attachments.length && <p className="text-sm text-slate-500">لا توجد مرفقات.</p>}
                </div>
              </section>
            </div>
          </article>
        ))}

        {!tasks.length && (
          <div className="panel p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">لا توجد مهام لهذا الموظف</h2>
            <p className="mt-2 text-slate-500">ستظهر هنا المهام والتعليقات والمرفقات عند إسناد الأعمال له.</p>
          </div>
        )}
      </div>
    </div>
  );
}
