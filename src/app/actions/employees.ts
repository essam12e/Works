"use server";

import crypto from "node:crypto";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireManagerCompany } from "@/lib/auth";
import { appUrl, sendNotification } from "@/lib/email";
import { prisma } from "@/lib/db";

export type EmployeeActionState = {
  ok: boolean;
  message: string;
};

const employeeSchema = z.object({
  name: z.string().trim().min(2, "اسم الموظف يجب أن يكون حرفين على الأقل"),
  title: z.string().trim().min(2, "المسمى الوظيفي يجب أن يكون حرفين على الأقل"),
  email: z.string().trim().email("البريد الإلكتروني غير صحيح").toLowerCase(),
  whatsapp: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export async function createEmployee(
  previousStateOrFormData: EmployeeActionState | FormData,
  maybeFormData?: FormData,
): Promise<EmployeeActionState> {
  const user = await requireManagerCompany();
  const formData = maybeFormData ?? (previousStateOrFormData as FormData);
  const result = employeeSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "تحقق من بيانات الموظف وحاول مرة أخرى",
    };
  }

  const data = result.data;
  const portalToken = crypto.randomBytes(32).toString("hex");

  try {
    const authUser = await prisma.user.upsert({
      where: { email: data.email },
      update: { name: data.name, role: "EMPLOYEE", companyId: user.companyId },
      create: { name: data.name, email: data.email, role: "EMPLOYEE", companyId: user.companyId },
    });

    const employee = await prisma.employee.create({
      data: {
        ...data,
        companyId: user.companyId,
        userId: authUser.id,
        portalToken,
      },
    });

    await sendNotification({
      recipient: employee.email,
      userId: authUser.id,
      subject: "تم إنشاء بوابة الموظف في حافظة أعمال",
      body: `مرحباً ${employee.name}\nرابط بوابتك: ${appUrl(`/portal/${portalToken}`)}`,
    });

    revalidatePath("/dashboard/employees");
    return { ok: true, message: "تمت إضافة الموظف بنجاح" };
  } catch {
    return {
      ok: false,
      message: "تعذر إضافة الموظف. تأكد أن البريد غير مستخدم لموظف آخر في نفس الشركة.",
    };
  }
}

export async function updateEmployee(formData: FormData) {
  const user = await requireManagerCompany();
  const id = String(formData.get("id") ?? "");
  const data = employeeSchema.parse(Object.fromEntries(formData));
  await prisma.employee.update({
    where: { id, companyId: user.companyId },
    data,
  });
  revalidatePath("/dashboard/employees");
}

export async function toggleEmployeeStatus(formData: FormData) {
  const user = await requireManagerCompany();
  const id = String(formData.get("id") ?? "");
  const employee = await prisma.employee.findFirstOrThrow({
    where: { id, companyId: user.companyId },
  });
  await prisma.employee.update({
    where: { id },
    data: { status: employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
  });
  revalidatePath("/dashboard/employees");
}

export async function deleteEmployee(formData: FormData) {
  const user = await requireManagerCompany();
  const id = String(formData.get("id") ?? "");
  const employee = await prisma.employee.findFirstOrThrow({
    where: { id, companyId: user.companyId },
    include: { _count: { select: { tasks: true } } },
  });

  if (employee._count.tasks > 0) {
    await prisma.employee.update({
      where: { id: employee.id },
      data: { status: "INACTIVE" },
    });
  } else {
    await prisma.employee.delete({ where: { id: employee.id } });
  }

  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard/activity");
}
