import Link from "next/link";

import { registerManager } from "@/app/actions/auth";
import { BrandMark } from "@/components/ui";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandMark />
        </div>
        <form action={registerManager} className="panel p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-950">إنشاء حساب مدير</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">بعد إنشاء الحساب ستضيف بيانات الشركة مباشرة.</p>
          <div className="mt-6 space-y-4">
            <label>
              <span className="label">اسم المدير</span>
              <input name="name" required className="field" />
            </label>
            <label>
              <span className="label">البريد الإلكتروني</span>
              <input name="email" type="email" required className="field" />
            </label>
            <label>
              <span className="label">كلمة المرور</span>
              <input name="password" type="password" required minLength={8} className="field" />
            </label>
          </div>
          <button type="submit" className="btn-primary mt-6 w-full">
            إنشاء الحساب
          </button>
          <p className="mt-5 text-center text-sm text-slate-500">
            لديك حساب؟{" "}
            <Link href="/auth/login" className="font-bold text-teal-700">
              تسجيل الدخول
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
