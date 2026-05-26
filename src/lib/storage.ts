import "server-only";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const allowedTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "text/plain",
]);

export async function saveUpload(file: File, folder: string) {
  if (!file || file.size === 0) return null;
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("حجم الملف يجب أن يكون أقل من 10MB");
  }
  if (file.type && !allowedTypes.has(file.type)) {
    throw new Error("نوع الملف غير مدعوم");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || ".bin";
  const safeName = `${crypto.randomUUID()}${extension}`;
  const relativeDir = path.join("uploads", folder);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);
  await mkdir(absoluteDir, { recursive: true });
  await writeFile(path.join(absoluteDir, safeName), bytes);

  return {
    fileName: file.name,
    fileUrl: `/${relativeDir.replaceAll(path.sep, "/")}/${safeName}`,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
  };
}
