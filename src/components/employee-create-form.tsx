"use client";

import { useActionState, useEffect, useRef } from "react";

import { createEmployee, type EmployeeActionState } from "@/app/actions/employees";

const initialState: EmployeeActionState = {
  ok: false,
  message: "",
};

export function EmployeeCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(createEmployee, initialState);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="panel grid gap-4 p-6 md:grid-cols-5">
      <input name="name" placeholder="اسم الموظف" required minLength={2} className="field" />
      <input name="title" placeholder="المسمى الوظيفي" required minLength={2} className="field" />
      <input name="email" type="email" placeholder="البريد الإلكتروني" required className="field" />
      <input name="whatsapp" placeholder="واتساب اختياري" className="field" />
      <button className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={pending}>
        {pending ? "جار الإضافة..." : "إضافة موظف"}
      </button>
      {state.message && (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-semibold md:col-span-5 ${
            state.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
