"use client";

import { FormEvent, useActionState, useState } from "react";
import { Plus } from "lucide-react";

import { createTask, type TaskActionState } from "@/app/actions/tasks";

type EmployeeOption = {
  id: string;
  name: string;
  title: string;
};

const initialState: TaskActionState = {
  ok: false,
  message: "",
};

export function TaskCreateForm({ employees }: { employees: EmployeeOption[] }) {
  const [localError, setLocalError] = useState("");
  const [state, formAction, pending] = useActionState(createTask, initialState);

  function validateFiles(event: FormEvent<HTMLFormElement>) {
    const files = new FormData(event.currentTarget).getAll("attachments");
    let totalSize = 0;

    for (const entry of files) {
      if (!(entry instanceof File) || entry.size === 0) continue;
      totalSize += entry.size;
      if (entry.size > 10 * 1024 * 1024) {
        event.preventDefault();
        setLocalError("حجم كل مرفق يجب أن يكون أقل من 10MB.");
        return;
      }
    }

    if (totalSize > 24 * 1024 * 1024) {
      event.preventDefault();
      setLocalError("الحجم الإجمالي للمرفقات في كل إنشاء يجب أن يكون أقل من 24MB.");
      return;
    }

    setLocalError("");
  }

  return (
    <form action={formAction} onSubmit={validateFiles} className="panel grid gap-5 p-6 lg:grid-cols-2">
      <label>
        <span className="label">عنوان المهمة</span>
        <input name="title" required minLength={3} className="field" />
      </label>
      <label>
        <span className="label">الموظف المسؤول</span>
        <select name="employeeId" required className="field">
          <option value="">اختر موظفاً</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name} - {employee.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">الأولوية</span>
        <select name="priority" defaultValue="MEDIUM" className="field">
          <option value="LOW">منخفضة</option>
          <option value="MEDIUM">متوسطة</option>
          <option value="HIGH">عالية</option>
          <option value="URGENT">عاجلة</option>
        </select>
      </label>
      <label>
        <span className="label">تاريخ التسليم</span>
        <input name="dueDate" type="date" required className="field" />
      </label>
      <label className="lg:col-span-2">
        <span className="label">وصف المهمة</span>
        <textarea name="description" required minLength={5} rows={3} className="field" />
      </label>
      <label className="lg:col-span-2">
        <span className="label">تعليمات التنفيذ</span>
        <textarea name="instructions" required minLength={5} rows={4} className="field" />
      </label>
      <label className="lg:col-span-2">
        <span className="label">مرفقات المدير</span>
        <input
          name="attachments"
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
          className="field"
        />
        <span className="mt-2 block text-xs text-slate-500">الحد الأقصى 10MB لكل ملف و24MB لكل إنشاء.</span>
      </label>
      <div className="lg:col-span-2">
        <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending}>
          <Plus size={18} />
          {pending ? "جار إنشاء المهمة..." : "إنشاء المهمة وإرسال الإشعار"}
        </button>
      </div>
      {(localError || state.message) && (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-semibold lg:col-span-2 ${
            state.ok && !localError ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {localError || state.message}
        </p>
      )}
    </form>
  );
}
