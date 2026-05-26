import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="panel max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-slate-950">الصفحة غير موجودة</h1>
        <p className="mt-3 text-slate-500">قد يكون الرابط غير صحيح أو لم يعد متاحاً.</p>
        <Link href="/" className="btn-primary mt-6">العودة للرئيسية</Link>
      </div>
    </main>
  );
}
