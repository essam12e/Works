import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, MessageSquare, Save, Trash2 } from "lucide-react";

import { addManagerComment, deleteTask, updateTask } from "@/app/actions/tasks";
import { PriorityBadge, StatusBadge } from "@/components/ui";
import { requireManagerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/format";

export default async function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireManagerCompany();
  const { id } = await params;
  const [task, employees] = await Promise.all([
    prisma.task.findFirst({
      where: { id, companyId: user.companyId },
      include: { employee: true, comments: { orderBy: { createdAt: "asc" } }, attachments: true },
    }),
    prisma.employee.findMany({ where: { companyId: user.companyId, status: "ACTIVE" }, orderBy: { name: "asc" } }),
  ]);
  if (!task) notFound();

  const managerFiles = task.attachments.filter((file) => file.source === "MANAGER");
  const employeeFiles = task.attachments.filter((file) => file.source === "EMPLOYEE");

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <Link href="/dashboard/tasks" className="text-sm font-bold text-teal-700">العودة إلى المهام</Link>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">{task.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              التسليم {formatDate(task.dueDate)}
            </span>
          </div>
        </div>
        <form action={deleteTask}>
          <input type="hidden" name="id" value={task.id} />
          <button className="btn-danger" type="submit"><Trash2 size={16} /> حذف المهمة</button>
        </form>
      </div>

      <form action={updateTask} className="panel grid gap-5 p-6 lg:grid-cols-2">
        <input type="hidden" name="id" value={task.id} />
        <label>
          <span className="label">العنوان</span>
          <input name="title" defaultValue={task.title} className="field" />
        </label>
        <label>
          <span className="label">الموظف</span>
          <select name="employeeId" defaultValue={task.employeeId} className="field">
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">الأولوية</span>
          <select name="priority" defaultValue={task.priority} className="field">
            <option value="LOW">منخفضة</option>
            <option value="MEDIUM">متوسطة</option>
            <option value="HIGH">عالية</option>
            <option value="URGENT">عاجلة</option>
          </select>
        </label>
        <label>
          <span className="label">تاريخ التسليم</span>
          <input name="dueDate" type="date" defaultValue={task.dueDate.toISOString().slice(0, 10)} className="field" />
        </label>
        <label className="lg:col-span-2">
          <span className="label">الوصف</span>
          <textarea name="description" rows={3} defaultValue={task.description} className="field" />
        </label>
        <label className="lg:col-span-2">
          <span className="label">تعليمات التنفيذ</span>
          <textarea name="instructions" rows={4} defaultValue={task.instructions} className="field" />
        </label>
        <label className="lg:col-span-2">
          <span className="label">إضافة مرفقات للمدير</span>
          <input name="attachments" type="file" multiple className="field" />
        </label>
        <div className="lg:col-span-2">
          <button className="btn-primary" type="submit"><Save size={16} /> حفظ التعديلات</button>
        </div>
      </form>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel p-6">
          <h2 className="text-xl font-bold text-slate-950">مرفقات المدير</h2>
          <FileList files={managerFiles} />
        </section>
        <section className="panel p-6">
          <h2 className="text-xl font-bold text-slate-950">مرفقات الموظف</h2>
          <FileList files={employeeFiles} />
        </section>
      </div>

      <section className="panel p-6">
        <h2 className="text-xl font-bold text-slate-950">التعليقات والملاحظات</h2>
        <div className="mt-5 space-y-3">
          {task.comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-slate-950">{comment.authorName}</p>
                <p className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</p>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{comment.body}</p>
            </div>
          ))}
          {!task.comments.length && <p className="muted">لا توجد تعليقات بعد.</p>}
        </div>
        <form action={addManagerComment} className="mt-5 flex flex-col gap-3">
          <input type="hidden" name="taskId" value={task.id} />
          <textarea name="body" required rows={3} placeholder="اكتب ملاحظة أو تعليقاً" className="field" />
          <button className="btn-secondary self-start" type="submit"><MessageSquare size={16} /> إضافة تعليق</button>
        </form>
      </section>
    </div>
  );
}

function FileList({ files }: { files: { id: string; fileUrl: string; fileName: string; size: number }[] }) {
  if (!files.length) return <p className="mt-4 text-sm text-slate-500">لا توجد مرفقات.</p>;
  return (
    <div className="mt-4 space-y-2">
      {files.map((file) => (
        <a key={file.id} href={file.fileUrl} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" target="_blank">
          <span className="truncate">{file.fileName}</span>
          <Download size={16} />
        </a>
      ))}
    </div>
  );
}
