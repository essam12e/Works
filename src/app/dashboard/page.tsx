import { Bell, ClipboardList, Clock3, ListChecks, UserCheck, Users } from "lucide-react";

import { EmployeeProgressChart } from "@/components/dashboard-charts";
import { EmptyState, StatCard, StatusBadge } from "@/components/ui";
import { requireManagerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatDateTime } from "@/lib/format";

type DashboardEmployee = {
  name: string;
  tasks: Array<{ status: string }>;
};

type DashboardTask = {
  id: string;
  title: string;
  dueDate: Date;
  status: string;
  employee: { name: string };
};

type DashboardNotification = {
  id: string;
  subject: string;
  body: string;
  createdAt: Date;
};

export default async function DashboardPage() {
  const user = await requireManagerCompany();
  const [employees, tasks, waitingTasks, notifications] = await Promise.all([
    prisma.employee.findMany({ where: { companyId: user.companyId }, include: { tasks: true } }),
    prisma.task.findMany({ where: { companyId: user.companyId }, include: { employee: true }, orderBy: { createdAt: "desc" } }),
    prisma.task.count({ where: { companyId: user.companyId, status: "WAITING_REVIEW" } }),
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const dashboardEmployees = employees as DashboardEmployee[];
  const dashboardTasks = tasks as DashboardTask[];
  const dashboardNotifications = notifications as DashboardNotification[];

  const completed = dashboardTasks.filter((task: DashboardTask) => task.status === "APPROVED" || task.status === "COMPLETED").length;
  const inProgress = dashboardTasks.filter((task: DashboardTask) => task.status === "IN_PROGRESS" || task.status === "NEW").length;
  const chartData = dashboardEmployees.map((employee: DashboardEmployee) => {
    const done = employee.tasks.filter((task: { status: string }) => task.status === "APPROVED").length;
    return {
      name: employee.name.split(" ")[0] ?? employee.name,
      الإنجاز: employee.tasks.length ? Math.round((done / employee.tasks.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold text-teal-700">مرحباً {user.name}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">لوحة تحكم المدير</h1>
        <p className="mt-2 text-slate-500">نظرة سريعة على الموظفين والمهام والمراجعات داخل شركتك.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="عدد الموظفين" value={employees.length} icon={Users} />
        <StatCard title="عدد المهام" value={tasks.length} icon={ClipboardList} tone="teal" />
        <StatCard title="المكتملة" value={completed} icon={ListChecks} tone="teal" />
        <StatCard title="قيد التنفيذ" value={inProgress} icon={Clock3} tone="amber" />
        <StatCard title="بانتظار المراجعة" value={waitingTasks} icon={UserCheck} tone="rose" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">نسبة الإنجاز لكل موظف</h2>
              <p className="mt-1 text-sm text-slate-500">تحسب من المهام المعتمدة مقارنة بإجمالي مهام الموظف.</p>
            </div>
          </div>
          {chartData.length ? <EmployeeProgressChart data={chartData} /> : <EmptyState title="لا توجد بيانات بعد" body="أضف موظفين ومهاماً لعرض المخططات." />}
        </section>

        <section className="panel p-6">
          <h2 className="text-xl font-bold text-slate-950">إشعارات المدير</h2>
          <div className="mt-5 space-y-3">
            {dashboardNotifications.map((notification: DashboardNotification) => (
              <div key={notification.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
                    <Bell size={16} />
                  </span>
                  <div>
                    <p className="font-bold text-slate-950">{notification.subject}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{notification.body}</p>
                    <p className="mt-2 text-xs text-slate-400">{formatDateTime(notification.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
            {!dashboardNotifications.length && <EmptyState title="لا توجد إشعارات" body="ستظهر هنا تعليقات الموظفين والتسليمات الجديدة." />}
          </div>
        </section>
      </div>

      <section className="panel p-6">
        <h2 className="text-xl font-bold text-slate-950">آخر المهام</h2>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {dashboardTasks.slice(0, 6).map((task: DashboardTask) => (
            <div key={task.id} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{task.employee.name} · التسليم {formatDate(task.dueDate)}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
            </div>
          ))}
          {!dashboardTasks.length && <EmptyState title="لا توجد مهام" body="ابدأ بإنشاء مهمة وإسنادها لموظف." />}
        </div>
      </section>
    </div>
  );
}
