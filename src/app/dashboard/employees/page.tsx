import { Copy, Mail, Power, Trash2 } from "lucide-react";

import { deleteEmployee, toggleEmployeeStatus, updateEmployee } from "@/app/actions/employees";
import { EmployeeCreateForm } from "@/components/employee-create-form";
import { EmptyState } from "@/components/ui";
import { requireManagerCompany } from "@/lib/auth";
import { appUrl } from "@/lib/email";
import { prisma } from "@/lib/db";

export default async function EmployeesPage() {
  const user = await requireManagerCompany();
  const employees = await prisma.employee.findMany({
    where: { companyId: user.companyId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">إدارة الموظفين</h1>
        <p className="mt-2 text-slate-500">أضف الموظفين واربطهم ببوابة خاصة ومهامهم فقط.</p>
      </div>

      <EmployeeCreateForm />

      <section className="panel overflow-hidden">
        {employees.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-right text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-bold">الموظف</th>
                  <th className="px-5 py-4 font-bold">التواصل</th>
                  <th className="px-5 py-4 font-bold">الحالة</th>
                  <th className="px-5 py-4 font-bold">رابط البوابة</th>
                  <th className="px-5 py-4 font-bold">تعديل</th>
                  <th className="px-5 py-4 font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((employee) => (
                  <tr key={employee.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-950">{employee.name}</p>
                      <p className="mt-1 text-slate-500">{employee.title}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <div className="flex items-center gap-2"><Mail size={15} /> {employee.email}</div>
                      {employee.whatsapp && <p className="mt-1">{employee.whatsapp}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${employee.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {employee.status === "ACTIVE" ? "نشط" : "غير نشط"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-xs items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        <Copy size={14} />
                        <span className="truncate">{appUrl(`/portal/${employee.portalToken}`)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <form action={updateEmployee} className="grid gap-2">
                        <input type="hidden" name="id" value={employee.id} />
                        <input name="name" defaultValue={employee.name} className="field py-2" />
                        <input name="title" defaultValue={employee.title} className="field py-2" />
                        <input name="email" type="email" defaultValue={employee.email} className="field py-2" />
                        <input name="whatsapp" defaultValue={employee.whatsapp ?? ""} className="field py-2" />
                        <select name="status" defaultValue={employee.status} className="field py-2">
                          <option value="ACTIVE">نشط</option>
                          <option value="INACTIVE">غير نشط</option>
                        </select>
                        <button className="btn-secondary py-2" type="submit">حفظ</button>
                      </form>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <form action={toggleEmployeeStatus}>
                          <input type="hidden" name="id" value={employee.id} />
                          <button className="btn-secondary px-3 py-2" type="submit"><Power size={15} /> تبديل</button>
                        </form>
                        <form action={deleteEmployee}>
                          <input type="hidden" name="id" value={employee.id} />
                          <button className="btn-danger" type="submit"><Trash2 size={15} /> حذف</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState title="لا يوجد موظفون بعد" body="أضف أول موظف ليحصل على رابط بوابة خاص ويستقبل المهام." />
          </div>
        )}
      </section>
    </div>
  );
}
