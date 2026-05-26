import Link from "next/link";
import { CheckCircle2, RotateCcw } from "lucide-react";

import { reviewTask } from "@/app/actions/tasks";
import { EmptyState, PriorityBadge } from "@/components/ui";
import { requireManagerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

type ReviewTask = {
  id: string;
  title: string;
  dueDate: Date;
  priority: string;
  employee: { name: string };
  attachments: Array<{ id: string }>;
  comments: Array<{
    id: string;
    authorName: string;
    body: string;
  }>;
};

export default async function ReviewsPage() {
  const user = await requireManagerCompany();
  const tasks = await prisma.task.findMany({
    where: { companyId: user.companyId, status: "WAITING_REVIEW" },
    include: { employee: true, attachments: { where: { source: "EMPLOYEE" } }, comments: { orderBy: { createdAt: "desc" }, take: 3 } },
    orderBy: { updatedAt: "desc" },
  });

  const reviewTasks = tasks as ReviewTask[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">صفحة مراجعة المهام</h1>
        <p className="mt-2 text-slate-500">اعتمد التسليم أو اطلب تعديلاً مع ملاحظة واضحة للموظف.</p>
      </div>

      {reviewTasks.length ? (
        <div className="grid gap-5">
          {reviewTasks.map((task: ReviewTask) => (
            <article key={task.id} className="panel p-6">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <Link href={`/dashboard/tasks/${task.id}`} className="text-2xl font-bold text-slate-950 hover:text-teal-700">
                    {task.title}
                  </Link>
                  <p className="mt-2 text-sm text-slate-500">
                    {task.employee.name} · تاريخ التسليم {formatDate(task.dueDate)}
                  </p>
                  <div className="mt-3"><PriorityBadge priority={task.priority} /></div>
                </div>
                <div className="text-sm text-slate-500">مرفقات الموظف: {task.attachments.length}</div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-950">آخر التعليقات</h3>
                  <div className="mt-3 space-y-2">
                    {task.comments.map((comment: ReviewTask["comments"][number]) => (
                      <p key={comment.id} className="text-sm leading-7 text-slate-600">
                        <span className="font-bold">{comment.authorName}: </span>{comment.body}
                      </p>
                    ))}
                    {!task.comments.length && <p className="text-sm text-slate-500">لا توجد تعليقات.</p>}
                  </div>
                </div>
                <form action={reviewTask} className="rounded-2xl border border-slate-100 p-4">
                  <input type="hidden" name="taskId" value={task.id} />
                  <label>
                    <span className="label">ملاحظة المراجعة</span>
                    <textarea name="note" rows={3} className="field" placeholder="اختياري عند الاعتماد، ومهم عند طلب التعديل" />
                  </label>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button name="decision" value="APPROVED" className="btn-primary" type="submit">
                      <CheckCircle2 size={16} />
                      اعتماد
                    </button>
                    <button name="decision" value="NEEDS_CHANGES" className="btn-secondary" type="submit">
                      <RotateCcw size={16} />
                      طلب تعديل
                    </button>
                  </div>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="لا توجد مهام بانتظار المراجعة" body="عند إرسال الموظف مهمة للمراجعة ستظهر هنا." />
      )}
    </div>
  );
}
