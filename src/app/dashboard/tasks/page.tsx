import Link from "next/link";

import { TaskCreateForm } from "@/components/task-create-form";
import { TaskShareMenu } from "@/components/task-share-menu";
import { EmptyState, PriorityBadge, StatusBadge } from "@/components/ui";
import { requireManagerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function TasksPage() {
  const user = await requireManagerCompany();
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  const [employees, tasks] = await Promise.all([
    prisma.employee.findMany({ where: { companyId: user.companyId, status: "ACTIVE" }, orderBy: { name: "asc" } }),
    prisma.task.findMany({ where: { companyId: user.companyId }, include: { employee: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">إدارة المهام</h1>
        <p className="mt-2 text-slate-500">أنشئ مهمة، أضف تعليماتها ومرفقاتها، ثم أسندها لموظف محدد.</p>
      </div>

      <TaskCreateForm employees={employees} />

      <section className="panel overflow-hidden">
        {tasks.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-bold">المهمة</th>
                  <th className="px-5 py-4 font-bold">الموظف</th>
                  <th className="px-5 py-4 font-bold">الأولوية</th>
                  <th className="px-5 py-4 font-bold">الحالة</th>
                  <th className="px-5 py-4 font-bold">التسليم</th>
                  <th className="px-5 py-4 font-bold">مشاركة</th>
                  <th className="px-5 py-4 font-bold">فتح</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-5 py-4 font-bold text-slate-950">{task.title}</td>
                    <td className="px-5 py-4 text-slate-600">{task.employee.name}</td>
                    <td className="px-5 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(task.dueDate)}</td>
                    <td className="px-5 py-4">
                      <TaskShareMenu
                        taskTitle={task.title}
                        employeeName={task.employee.name}
                        portalUrl={`${baseUrl}/portal/${task.employee.portalToken}`}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/tasks/${task.id}`} className="font-bold text-teal-700">
                        التفاصيل
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState title="لا توجد مهام" body="بعد إضافة موظف نشط يمكنك إنشاء أول مهمة وإرسال رابط البوابة له." />
          </div>
        )}
      </section>
    </div>
  );
}
