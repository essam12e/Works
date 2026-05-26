import { saveCompany } from "@/app/actions/company";
import { requireManager } from "@/lib/auth";

export default async function CompanyOnboardingPage() {
  await requireManager();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-bold text-teal-700">الخطوة الأولى</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">أدخل بيانات الشركة</h1>
          <p className="mt-3 text-slate-500">هذه البيانات تظهر في لوحة التحكم وتربط الموظفين والمهام بشركتك فقط.</p>
        </div>
        <form action={saveCompany} className="panel grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          <label>
            <span className="label">اسم الشركة</span>
            <input name="name" required className="field" />
          </label>
          <label>
            <span className="label">المجال</span>
            <input name="industry" required className="field" />
          </label>
          <label>
            <span className="label">البريد الإلكتروني</span>
            <input name="email" type="email" required className="field" />
          </label>
          <label>
            <span className="label">رقم الجوال أو الواتساب</span>
            <input name="phone" required className="field" />
          </label>
          <label className="sm:col-span-2">
            <span className="label">الشعار</span>
            <input name="logo" type="file" accept="image/*" className="field" />
          </label>
          <label className="sm:col-span-2">
            <span className="label">وصف مختصر</span>
            <textarea name="description" required rows={5} className="field" />
          </label>
          <div className="sm:col-span-2">
            <button className="btn-primary" type="submit">
              حفظ وفتح لوحة التحكم
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
