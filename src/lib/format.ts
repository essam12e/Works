export type TaskStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "WAITING_REVIEW"
  | "APPROVED"
  | "NEEDS_CHANGES";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export const statusLabels: Record<TaskStatus, string> = {
  NEW: "جديدة",
  IN_PROGRESS: "قيد التنفيذ",
  COMPLETED: "مكتملة",
  WAITING_REVIEW: "بانتظار المراجعة",
  APPROVED: "معتمدة",
  NEEDS_CHANGES: "تحتاج تعديل",
};

export const priorityLabels: Record<TaskPriority, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "عالية",
  URGENT: "عاجلة",
};

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
