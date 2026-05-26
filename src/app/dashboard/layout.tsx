import { DashboardShell } from "@/components/dashboard-shell";
import { requireManagerCompany } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireManagerCompany();
  return <DashboardShell companyName={user.company?.name ?? "الشركة"}>{children}</DashboardShell>;
}
