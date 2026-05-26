import "server-only";

import nodemailer from "nodemailer";

import { prisma } from "./db";

type EmailInput = {
  recipient: string;
  subject: string;
  body: string;
  taskId?: string;
  userId?: string;
  channel?: "EMAIL" | "WHATSAPP";
};

export async function sendNotification(input: EmailInput) {
  let sentAt: Date | null = null;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? "حافظة أعمال <no-reply@example.com>",
      to: input.recipient,
      subject: input.subject,
      text: input.body,
    });
    sentAt = new Date();
  }

  return prisma.notification.create({
    data: {
      recipient: input.recipient,
      subject: input.subject,
      body: input.body,
      taskId: input.taskId,
      userId: input.userId,
      channel: input.channel ?? "EMAIL",
      sentAt,
    },
  });
}

export function appUrl(pathname = "") {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return `${base}${pathname}`;
}
