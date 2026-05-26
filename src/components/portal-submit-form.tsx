"use client";

import { FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { submitForReview, type PortalSubmitState } from "@/app/actions/portal";

const initialState: PortalSubmitState = {
  ok: false,
  message: "",
};

export function PortalSubmitForm({ token, taskId }: { token: string; taskId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [localError, setLocalError] = useState("");
  const [state, formAction, pending] = useActionState(submitForReview, initialState);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  function validateFiles(event: FormEvent<HTMLFormElement>) {
    const files = new FormData(event.currentTarget).getAll("attachments");
    let totalSize = 0;

    for (const entry of files) {
      if (!(entry instanceof File) || entry.size === 0) continue;
      totalSize += entry.size;
      if (entry.size > 10 * 1024 * 1024) {
        event.preventDefault();
        setLocalError("حجم كل ملف يجب أن يكون أقل من 10MB.");
        return;
      }
    }

    if (totalSize > 24 * 1024 * 1024) {
      event.preventDefault();
      setLocalError("الحجم الإجمالي للمرفقات في كل إرسال يجب أن يكون أقل من 24MB.");
      return;
    }

    setLocalError("");
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={validateFiles} className="mt-6 rounded-2xl bg-slate-950 p-4 text-white">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="taskId" value={taskId} />
      <label>
        <span className="mb-2 block text-sm font-bold text-slate-200">تعليق التسليم</span>
        <textarea
          name="comment"
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
          placeholder="اكتب ما تم إنجازه أو أي ملاحظة للمدير"
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-bold text-slate-200">رفع ملفات التسليم</span>
        <input
          name="attachments"
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white"
        />
        <span className="mt-2 block text-xs text-slate-400">الحد الأقصى 10MB لكل ملف و24MB لكل إرسال.</span>
      </label>
      <button
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        <Send size={16} />
        {pending ? "جار الإرسال..." : "إرسال للمراجعة"}
      </button>
      {(localError || state.message) && (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            state.ok && !localError ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {localError || state.message}
        </p>
      )}
    </form>
  );
}
