import { notFound } from "next/navigation";
import { Download, MessageSquare } from "lucide-react";

import { addEmployeeComment } from "@/app/actions/portal";
import { PortalSubmitForm } from "@/components/portal-submit-form";
import { PriorityBadge, StatusBadge } from "@/components/ui";
import { prisma } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/format";

type PortalTask = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: Date;
  status: string;
  priority: string;
  reviewNote: string | null;
  attachments: PortalAttachment[];
  comments: PortalComment[];
};

type PortalAttachment = {
  id: string;
  fileUrl: string;
  fileName: string;
  source: string;
};

type PortalComment = {
  id: string;
  authorName: string;
  createdAt: Date;
  body: string;
};

export default async function EmployeePortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const employee = await prisma.employee.findUnique({
    where: { portalToken: token },
    include: {
      company: true,
      tasks: {
        include: {
          attachments: true,
          comments: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!employee || employee.status !== "ACTIVE") notFound();
  const tasks = employee.tasks as PortalTask[];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-teal-700">بوابة الموظف</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">مرحباً {employee.name}</h1>
          <p className="mt-2 text-slate-500">{employee.company.name} · {employee.title}</p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {tasks.map((task: PortalTask) => {
          const managerFiles = task.attachments.filter((file: PortalAttachment) => file.source === "MANAGER");
          const employeeFiles = task.attachments.filter((file: PortalAttachment) => file.source === "EMPLOYEE");
          return (
            <article key={task.id} className="panel p-6">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">{task.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">تاريخ التسليم {formatDate(task.dueDate)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <section className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-950">الوصف والتعليمات</h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{task.description}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{task.instructions}</p>
                  {task.reviewNote && (
                    <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm leading-7 text-rose-700">
                      ملاحظة المراجعة: {task.reviewNote}
                    </div>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-100 p-4">
                  <h3 className="font-bold text-slate-950">المرفقات</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <AttachmentGroup title="مرفقات المدير" files={managerFiles} />
                    <AttachmentGroup title="ملفات التسليم" files={employeeFiles} />
                  </div>
                </section>
              </div>

              <section className="mt-6 rounded-2xl border border-slate-100 p-4">
                <h3 className="font-bold text-slate-950">التعليقات</h3>
                <div className="mt-3 space-y-3">
                  {task.comments.map((comment: PortalComment) => (
                    <div key={comment.id} className="rounded-xl bg-slate-50 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-slate-900">{comment.authorName}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</p>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{comment.body}</p>
                    </div>
                  ))}
                  {!task.comments.length && <p className="text-sm text-slate-500">لا توجد تعليقات بعد.</p>}
                </div>
                <form action={addEmployeeComment} className="mt-4 flex flex-col gap-3">
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="taskId" value={task.id} />
                  <textarea name="body" rows={3} required placeholder="اكتب تعليقاً أو استفساراً" className="field" />
                  <button className="btn-secondary self-start" type="submit"><MessageSquare size={16} /> إضافة تعليق</button>
                </form>
              </section>

              <PortalSubmitForm token={token} taskId={task.id} />
            </article>
          );
        })}

        {!tasks.length && (
          <div className="panel p-8 text-center">
            <h2 className="text-xl font-bold text-slate-950">لا توجد مهام مسندة حالياً</h2>
            <p className="mt-2 text-slate-500">ستظهر هنا المهام الجديدة عند إسنادها لك.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function AttachmentGroup({
  title,
  files,
}: {
  title: string;
  files: { id: string; fileUrl: string; fileName: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-700">{title}</p>
      <div className="mt-2 space-y-2">
        {files.map((file: { id: string; fileUrl: string; fileName: string }) => (
          <a key={file.id} href={file.fileUrl} target="_blank" className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">
            <span className="truncate">{file.fileName}</span>
            <Download size={14} />
          </a>
        ))}
        {!files.length && <p className="text-xs text-slate-400">لا توجد ملفات.</p>}
      </div>
    </div>
  );
}
