import Link from "next/link";
import { Building2, ClipboardCheck, History, LayoutDashboard, LogOut, Settings, UserRoundPlus, Users } from "lucide-react";

import { logout } from "@/app/actions/auth";
import { BrandMark } from "./ui";

const nav = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/dashboard/employees", label: "الموظفون", icon: Users },
  { href: "/dashboard/tasks", label: "المهام", icon: ClipboardCheck },
  { href: "/dashboard/reviews", label: "المراجعة", icon: UserRoundPlus },
  { href: "/dashboard/activity", label: "سجل العمليات", icon: History },
  { href: "/dashboard/settings", label: "بيانات الشركة", icon: Settings },
];

export function DashboardShell({
  children,
  companyName,
}: {
  children: React.ReactNode;
  companyName: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed bottom-0 right-0 top-0 hidden w-72 border-l border-slate-200 bg-white p-6 lg:block">
        <BrandMark />
        <div className="mt-8 rounded-2xl bg-slate-950 p-4 text-white">
          <div className="flex items-center gap-3">
            <Building2 size={20} />
            <p className="text-sm font-semibold">{companyName}</p>
          </div>
        </div>
        <nav className="mt-8 space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="absolute bottom-6 right-6 left-6">
          <button className="btn-secondary w-full" type="submit">
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </form>
      </aside>

      <main className="lg:mr-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <BrandMark />
            <form action={logout}>
              <button className="btn-secondary px-3 py-2" type="submit" aria-label="تسجيل الخروج">
                <LogOut size={18} />
              </button>
            </form>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
