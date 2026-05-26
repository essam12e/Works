"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Mail, Share2, X } from "lucide-react";

export function TaskShareMenu({
  taskTitle,
  employeeName,
  portalUrl,
}: {
  taskTitle: string;
  employeeName: string;
  portalUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const message = useMemo(
    () => `تمت مشاركة مهمة "${taskTitle}" مع ${employeeName} عبر حافظة أعمال: ${portalUrl}`,
    [employeeName, portalUrl, taskTitle],
  );
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`مهمة في حافظة أعمال: ${taskTitle}`)}&body=${encodeURIComponent(message)}`;

  async function copyLink() {
    await navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
      >
        <Share2 size={15} />
        مشاركة
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-30 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-xl shadow-slate-200/70">
          <div className="mb-1 flex items-center justify-between px-2 py-1 text-xs font-bold text-slate-500">
            خيارات المشاركة
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-slate-100" aria-label="إغلاق">
              <X size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-right font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            {copied ? "تم نسخ الرابط" : "نسخ الرابط"}
          </button>
          <a href={whatsappUrl} target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50">
            <Share2 size={16} />
            مشاركة واتساب
          </a>
          <a href={emailUrl} className="flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50">
            <Mail size={16} />
            مشاركة البريد الإلكتروني
          </a>
        </div>
      )}
    </div>
  );
}
