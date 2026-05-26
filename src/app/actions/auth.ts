"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSession, clearSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

function sessionRole(role: string) {
  return role === "EMPLOYEE" ? "EMPLOYEE" : "MANAGER";
}

const authSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب"),
  email: z.string().trim().email("البريد غير صحيح").toLowerCase(),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

const loginSchema = authSchema.omit({ name: true });

export async function registerManager(formData: FormData) {
  const data = authSchema.parse(Object.fromEntries(formData));
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("يوجد حساب مسجل بهذا البريد");

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: await hashPassword(data.password),
      role: "MANAGER",
    },
  });

  await createSession({ userId: user.id, role: sessionRole(user.role), companyId: user.companyId });
  redirect("/onboarding/company");
}

export async function login(formData: FormData) {
  const data = loginSchema.parse(Object.fromEntries(formData));
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user?.passwordHash) throw new Error("بيانات الدخول غير صحيحة");

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) throw new Error("بيانات الدخول غير صحيحة");

  await createSession({ userId: user.id, role: sessionRole(user.role), companyId: user.companyId });
  if (user.role === "MANAGER" && !user.companyId) redirect("/onboarding/company");
  if (user.role === "MANAGER") redirect("/dashboard");
  redirect("/");
}

export async function logout() {
  await clearSession();
  redirect("/");
}
