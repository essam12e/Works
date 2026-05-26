"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireManager } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveUpload } from "@/lib/storage";

const companySchema = z.object({
  name: z.string().trim().min(2),
  industry: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(5),
  description: z.string().trim().min(10),
});

export async function saveCompany(formData: FormData) {
  const user = await requireManager();
  const data = companySchema.parse(Object.fromEntries(formData));
  const logo = formData.get("logo");
  const uploadedLogo = logo instanceof File ? await saveUpload(logo, "companies") : null;

  if (user.companyId) {
    await prisma.company.update({
      where: { id: user.companyId },
      data: { ...data, ...(uploadedLogo ? { logoUrl: uploadedLogo.fileUrl } : {}) },
    });
    revalidatePath("/dashboard/settings");
    redirect("/dashboard");
  }

  const company = await prisma.company.create({
    data: {
      ...data,
      logoUrl: uploadedLogo?.fileUrl,
      users: { connect: { id: user.id } },
    },
  });

  await prisma.user.update({ where: { id: user.id }, data: { companyId: company.id } });
  redirect("/dashboard");
}
