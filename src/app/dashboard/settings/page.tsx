import Image from "next/image";

import { saveCompany } from "@/app/actions/company";
import { requireManagerCompany } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireManagerCompany();
  const company = user.company;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">بيانات الشركة</h1>
        <p className="mt-2 text-slate-500">حدّث بيانات الشركة وشعارها ومعلومات التواصل.</p>
      </div>

      <form action={saveCompany} className="panel grid gap-5 p-6 lg:grid-cols-2">
        {company?.logoUrl && (
          <div className="lg:col-span-2">
            <Image src={company.logoUrl} alt={company.name} width={96} height={96} className="size-24 rounded-2xl border border-slate-200 object-cover" />
          </div>
        )}
        <label>
          <span className="label">اسم الشركة</span>
          <input name="name" defaultValue={company?.name ?? ""} required className="field" />
        </label>
        <label>
          <span className="label">المجال</span>
          <input name="industry" defaultValue={company?.industry ?? ""} required className="field" />
        </label>
        <label>
          <span className="label">البريد الإلكتروني</span>
          <input name="email" type="email" defaultValue={company?.email ?? ""} required className="field" />
        </label>
        <label>
          <span className="label">رقم الجوال أو الواتساب</span>
          <input name="phone" defaultValue={company?.phone ?? ""} required className="field" />
        </label>
        <label className="lg:col-span-2">
          <span className="label">تغيير الشعار</span>
          <input name="logo" type="file" accept="image/*" className="field" />
        </label>
        <label className="lg:col-span-2">
          <span className="label">وصف مختصر</span>
          <textarea name="description" defaultValue={company?.description ?? ""} required rows={5} className="field" />
        </label>
        <div className="lg:col-span-2">
          <button className="btn-primary" type="submit">حفظ البيانات</button>
        </div>
      </form>
    </div>
  );
}
