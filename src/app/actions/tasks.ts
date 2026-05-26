"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireManagerCompany } from "@/lib/auth";
import { appUrl, sendNotification } from "@/lib/email";
import { prisma } from "@/lib/db";
import { saveUpload } from "@/lib/storage";

export type TaskActionState = {
  ok: boolean;
  message: string;
};

const taskSchema = z.object({
  title: z.string().trim().min(3, "عنوان المهمة يجب أن يكون 3 أحرف على الأقل"),
  description: z.string().trim().min(5, "وصف المهمة يجب أن يكون 5 أحرف على الأقل"),
  instructions: z.string().trim().min(5, "تعليمات التنفيذ يجب أن تكون 5 أحرف على الأقل"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().min(8, "تاريخ التسليم مطلوب"),
  employeeId: z.string().min(1, "اختر الموظف المسؤول عن المهمة"),
});

async function saveTaskAttachments(taskId: string, files: FormDataEntryValue[], source: "MANAGER" | "EMPLOYEE") {
  for (const entry of files) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    const uploaded = await saveUpload(entry, `tasks/${taskId}`);
    if (!uploaded) continue;
    await prisma.taskAttachment.create({
      data: { ...uploaded, taskId, source },
    });
  }
}

export async function createTask(
  previousStateOrFormData: TaskActionState | FormData,
  maybeFormData?: FormData,
): Promise<TaskActionState> {
  const user = await requireManagerCompany();
  const formData = maybeFormData ?? (previousStateOrFormData as FormData);
  const result = taskSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      ok: false,
      message: result.error.issues[0]?.message ?? "تحقق من بيانات المهمة وحاول مرة أخرى",
    };
  }

  const data = result.data;
  const employee = await prisma.employee.findFirst({
    where: { id: data.employeeId, companyId: user.companyId, status: "ACTIVE" },
    include: { user: true },
  });

  if (!employee) {
    return { ok: false, message: "الموظف المحدد غير موجود أو غير نشط" };
  }

  let createdTaskId = "";

  try {
    const task = await prisma.task.create({
      data: {
        companyId: user.companyId,
        employeeId: employee.id,
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        priority: data.priority,
        dueDate: new Date(data.dueDate),
        status: "NEW",
      },
    });

    await saveTaskAttachments(task.id, formData.getAll("attachments"), "MANAGER");
    await sendNotification({
      recipient: employee.email,
      userId: employee.userId ?? undefined,
      taskId: task.id,
      subject: `مهمة جديدة: ${task.title}`,
      body: `تم إسناد مهمة جديدة لك في حافظة أعمال.\nالرابط المباشر: ${appUrl(`/portal/${employee.portalToken}`)}`,
    });

    revalidatePath("/dashboard/tasks");
    createdTaskId = task.id;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "تعذر إنشاء المهمة. حاول مرة أخرى.",
    };
  }

  redirect(`/dashboard/tasks/${createdTaskId}`);
}

export async function updateTask(formData: FormData) {
  const user = await requireManagerCompany();
  const id = String(formData.get("id") ?? "");
  const data = taskSchema.parse(Object.fromEntries(formData));
  await prisma.task.update({
    where: { id, companyId: user.companyId },
    data: {
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      priority: data.priority,
      dueDate: new Date(data.dueDate),
      employeeId: data.employeeId,
    },
  });
  await saveTaskAttachments(id, formData.getAll("attachments"), "MANAGER");
  revalidatePath(`/dashboard/tasks/${id}`);
}

export async function deleteTask(formData: FormData) {
  const user = await requireManagerCompany();
  const id = String(formData.get("id") ?? "");
  await prisma.task.delete({ where: { id, companyId: user.companyId } });
  revalidatePath("/dashboard/tasks");
  redirect("/dashboard/tasks");
}

export async function addManagerComment(formData: FormData) {
  const user = await requireManagerCompany();
  const taskId = String(formData.get("taskId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.task.findFirstOrThrow({ where: { id: taskId, companyId: user.companyId } });
  await prisma.taskComment.create({
    data: { taskId, authorId: user.id, authorName: user.name, body },
  });
  revalidatePath(`/dashboard/tasks/${taskId}`);
}

export async function reviewTask(formData: FormData) {
  const user = await requireManagerCompany();
  const taskId = String(formData.get("taskId") ?? "");
  const decision = String(formData.get("decision"));
  const note = String(formData.get("note") ?? "").trim();
  const task = await prisma.task.findFirstOrThrow({
    where: { id: taskId, companyId: user.companyId },
    include: { employee: true },
  });

  const status = decision === "APPROVED" ? "APPROVED" : "NEEDS_CHANGES";
  await prisma.task.update({
    where: { id: task.id },
    data: { status, reviewNote: note || null },
  });

  if (note) {
    await prisma.taskComment.create({
      data: { taskId, authorId: user.id, authorName: user.name, body: note },
    });
  }

  await sendNotification({
    recipient: task.employee.email,
    taskId,
    subject: status === "APPROVED" ? "تم اعتماد المهمة" : "المهمة تحتاج تعديل",
    body: `${status === "APPROVED" ? "تم اعتماد" : "تم طلب تعديل على"} المهمة: ${task.title}\n${note}`,
  });

  revalidatePath("/dashboard/reviews");
  revalidatePath(`/dashboard/tasks/${taskId}`);
}
