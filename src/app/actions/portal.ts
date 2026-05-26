"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { sendNotification } from "@/lib/email";
import { saveUpload } from "@/lib/storage";

export type PortalSubmitState = {
  ok: boolean;
  message: string;
};

async function getTaskForToken(token: string, taskId: string) {
  return prisma.task.findFirstOrThrow({
    where: { id: taskId, employee: { portalToken: token, status: "ACTIVE" } },
    include: { employee: true, company: { include: { users: { where: { role: "MANAGER" } } } } },
  });
}

export async function addEmployeeComment(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  const task = await getTaskForToken(token, taskId);
  await prisma.taskComment.create({
    data: { taskId, authorId: task.employee.userId, authorName: task.employee.name, body },
  });
  await prisma.task.update({
    where: { id: taskId },
    data: { status: task.status === "NEW" ? "IN_PROGRESS" : task.status },
  });

  for (const manager of task.company.users) {
    await sendNotification({
      recipient: manager.email,
      userId: manager.id,
      taskId,
      subject: "تعليق جديد من الموظف",
      body: `أضاف ${task.employee.name} تعليقاً على المهمة "${task.title}":\n${body}`,
    });
  }

  revalidatePath(`/portal/${token}`);
}

export async function submitForReview(
  previousStateOrFormData: PortalSubmitState | FormData,
  maybeFormData?: FormData,
): Promise<PortalSubmitState> {
  const formData = maybeFormData ?? (previousStateOrFormData as FormData);
  const token = String(formData.get("token") ?? "");
  const taskId = String(formData.get("taskId") ?? "");
  const comment = String(formData.get("comment") ?? "").trim();

  try {
    const task = await getTaskForToken(token, taskId);

    for (const entry of formData.getAll("attachments")) {
      if (!(entry instanceof File) || entry.size === 0) continue;
      const uploaded = await saveUpload(entry, `tasks/${taskId}`);
      if (!uploaded) continue;
      await prisma.taskAttachment.create({
        data: { ...uploaded, taskId, source: "EMPLOYEE" },
      });
    }

    if (comment) {
      await prisma.taskComment.create({
        data: { taskId, authorId: task.employee.userId, authorName: task.employee.name, body: comment },
      });
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { status: "WAITING_REVIEW" },
    });

    for (const manager of task.company.users) {
      await sendNotification({
        recipient: manager.email,
        userId: manager.id,
        taskId,
        subject: "مهمة بانتظار المراجعة",
        body: `أرسل ${task.employee.name} المهمة "${task.title}" للمراجعة.`,
      });
    }

    revalidatePath(`/portal/${token}`);
    return { ok: true, message: "تم إرسال المهمة للمراجعة بنجاح" };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "تعذر رفع المرفقات أو إرسال المهمة للمراجعة",
    };
  }
}
