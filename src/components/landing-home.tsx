"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FileText,
  LockKeyhole,
  MessageCircle,
  Shield,
  Upload,
  UsersRound,
} from "lucide-react";

import { BrandMark } from "@/components/ui";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  { icon: Building2, title: "مساحة عمل للشركة", body: "بيانات الشركة والفرق والمهام في مكان واحد منظم وآمن." },
  { icon: UsersRound, title: "إدارة الموظفين", body: "إضافة وتعطيل الموظفين وربط كل موظف بمهامه فقط." },
  { icon: FileCheck2, title: "مراجعة وتسليم", body: "تسليم الملفات والتعليقات ثم اعتماد المهمة أو طلب تعديل." },
  { icon: Bell, title: "إشعارات بريدية", body: "تنبيه الموظف والمدير عند المهام والتعليقات والتسليمات." },
];

const withoutItems = [
  "فوضى في توزيع المهام",
  "صعوبة متابعة تقدم الموظفين",
  "تأخير في التسليم",
  "ضعف التواصل بين المدير والموظف",
  "ضياع الملفات والمرفقات",
  "غياب التقارير والبيانات الواضحة",
];

const withItems = [
  "توزيع مهام واضح ومنظم",
  "متابعة لحظية لحالة كل مهمة",
  "التزام أفضل بالمواعيد",
  "تواصل فعال داخل كل مهمة",
  "حفظ آمن ومنظم للملفات",
  "تقارير وإحصائيات تساعد على اتخاذ القرار",
];

const productCards = [
  { icon: FileText, title: "إدارة المهام" },
  { icon: BarChart3, title: "متابعة التقدم" },
  { icon: Upload, title: "رفع الملفات" },
  { icon: MessageCircle, title: "المراجعة والاعتماد" },
];

const aboutCards = [
  { icon: Building2, title: "خبرة في حلول الأعمال" },
  { icon: CheckCircle2, title: "تصميم سهل وبسيط" },
  { icon: Shield, title: "أمان وخصوصية" },
  { icon: BarChart3, title: "دعم للتوسع مستقبلاً" },
];

const faqs = [
  {
    question: "ما هي حافظة أعمال؟",
    answer: "منصة عربية لإدارة المهام والموظفين والتسليمات والمراجعات داخل الشركات.",
  },
  {
    question: "كيف تساعد حافظة أعمال في إدارة فريق العمل؟",
    answer: "تجمع التكليفات، الحالات، التعليقات، المرفقات، والإشعارات في مكان واحد واضح.",
  },
  {
    question: "هل يمكن للموظف الدخول بدون حساب؟",
    answer: "نعم، يدخل الموظف عبر رابط بوابة خاص يصل إليه من المدير أو البريد.",
  },
  {
    question: "هل يدعم النظام اللغة العربية؟",
    answer: "نعم، الواجهة عربية بالكامل وتدعم اتجاه RTL بشكل احترافي.",
  },
  {
    question: "هل يمكن رفع ملفات داخل المهام؟",
    answer: "نعم، يمكن رفع ملفات المدير وملفات تسليم الموظف مع فصلها داخل المهمة.",
  },
  {
    question: "كيف يتم إشعار الموظف بالمهام الجديدة؟",
    answer: "يتم تجهيز إشعار بريدي يحتوي على رابط مباشر لبوابة الموظف، مع بنية قابلة للتوسع لاحقاً.",
  },
];

export function LandingHome() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-secondary px-4 py-2">
              تسجيل الدخول
            </Link>
            <Link href="/auth/register" className="btn-primary px-4 py-2">
              إنشاء حساب
            </Link>
          </div>
        </div>
      </header>

      <section className="overflow-hidden border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800">
              <LockKeyhole size={16} />
              منصة عربية لإدارة أعمال الفرق
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.35] text-slate-950 sm:text-5xl">
              حافظة أعمال تنظّم مهام شركتك من التكليف حتى الاعتماد.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-600">
              نظام كامل للمدير والموظف: إنشاء الشركة، إضافة الموظفين، توزيع المهام، متابعة الإنجاز، استلام الملفات، التعليقات، والمراجعة النهائية.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/register" className="btn-primary transition-transform hover:-translate-y-0.5">
                ابدأ الآن
                <ArrowLeft size={18} />
              </Link>
              <Link href="/auth/login" className="btn-secondary transition-transform hover:-translate-y-0.5">
                لدي حساب
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="rounded-[2rem] border border-slate-200 bg-slate-950 p-3 shadow-2xl shadow-slate-200"
          >
            <div className="rounded-[1.4rem] bg-white p-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">لوحة المدير</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">نظرة تنفيذية</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">84% إنجاز</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {["الموظفون", "المهام", "بانتظار المراجعة", "معتمدة"].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-md">
                    <p className="text-xs font-semibold text-slate-500">{item}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">{[18, 42, 7, 29][index]}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {["إطلاق حملة الربع القادم", "مراجعة ملفات العميل", "تصميم عرض الإدارة"].map((task, index) => (
                  <div key={task} className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={index === 0 ? "text-amber-600" : "text-teal-700"} size={20} />
                      <span className="text-sm font-semibold text-slate-800">{task}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{index === 0 ? "عاجلة" : "متوسطة"}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} body={feature.body} />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-y border-slate-100 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="كيف تختلف شركتك مع حافظة أعمال؟" subtitle="فرق واضح بين إدارة مشتتة وإدارة منظمة يمكن قياسها ومراجعتها." />
          <div className="relative mt-10 grid gap-6 lg:grid-cols-2">
            <ComparisonColumn tone="red" title="بدون حافظة أعمال" items={withoutItems} />
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-500 shadow-lg lg:block">
              VS
            </div>
            <ComparisonColumn tone="green" title="مع حافظة أعمال" items={withItems} />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          title="ما هي حافظة أعمال؟"
          subtitle="حافظة أعمال هي منصة ذكية تساعد الشركات والفرق على تنظيم المهام، توزيع الأعمال، متابعة التقدم، استقبال التسليمات، مراجعة الإنجاز، وإدارة الملفات والتعليقات في مكان واحد وبطريقة سهلة واحترافية."
        />
        <IconGrid cards={productCards} />
      </AnimatedSection>

      <AnimatedSection className="border-y border-slate-100 bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            light
            title="من نحن"
            subtitle="نحن فريق متخصص في تطوير حلول رقمية تساعد الشركات على تنظيم أعمالها وتحسين إنتاجيتها. هدفنا أن نجعل إدارة المهام، متابعة الموظفين، واستلام الأعمال أكثر سهولة ووضوحاً واحترافية."
          />
          <IconGrid cards={aboutCards} dark />
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading title="الأسئلة الشائعة" subtitle="إجابات مختصرة على أكثر الأسئلة التي تهم المدير والموظف." />
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-teal-200">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right font-bold text-slate-950"
                >
                  {faq.question}
                  <ChevronDown className={`shrink-0 transition ${isOpen ? "rotate-180 text-teal-700" : "text-slate-400"}`} size={18} />
                </button>
                <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-7 text-slate-500">{faq.answer}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </AnimatedSection>
    </main>
  );
}

function AnimatedSection({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={fadeUp}
      transition={{ duration: 0.55 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({ title, subtitle, light = false }: { title: string; subtitle: string; light?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className={`text-3xl font-bold leading-tight sm:text-4xl ${light ? "text-white" : "text-slate-950"}`}>{title}</h2>
      <p className={`mt-4 text-base leading-8 ${light ? "text-slate-300" : "text-slate-500"}`}>{subtitle}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {
  return (
    <motion.div whileHover={{ y: -6 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:shadow-slate-200">
      <span className="grid size-12 place-items-center rounded-2xl bg-slate-950 text-white">
        <Icon size={21} />
      </span>
      <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500">{body}</p>
    </motion.div>
  );
}

function ComparisonColumn({ tone, title, items }: { tone: "red" | "green"; title: string; items: string[] }) {
  const isRed = tone === "red";
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-3xl border p-6 shadow-sm ${isRed ? "border-rose-100 bg-rose-50/70" : "border-emerald-100 bg-emerald-50/80"}`}
    >
      <h3 className={`text-2xl font-bold ${isRed ? "text-rose-800" : "text-emerald-800"}`}>{title}</h3>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-sm">
            <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${isRed ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
              {isRed ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            </span>
            <span className="text-sm font-semibold text-slate-700">{item}</span>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 grid size-12 place-items-center rounded-full border border-slate-200 bg-white text-sm font-black text-slate-500 lg:hidden">
        VS
      </div>
    </motion.div>
  );
}

function IconGrid({
  cards,
  dark = false,
}: {
  cards: { icon: LucideIcon; title: string }[];
  dark?: boolean;
}) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <motion.div
          key={card.title}
          whileHover={{ y: -5 }}
          className={`rounded-2xl border p-5 shadow-sm transition ${
            dark ? "border-white/10 bg-white/5 hover:bg-white/10" : "border-slate-200 bg-white hover:shadow-lg hover:shadow-slate-200"
          }`}
        >
          <span className={`grid size-11 place-items-center rounded-2xl ${dark ? "bg-teal-400/15 text-teal-300" : "bg-teal-50 text-teal-700"}`}>
            <card.icon size={20} />
          </span>
          <p className={`mt-4 font-bold ${dark ? "text-white" : "text-slate-950"}`}>{card.title}</p>
        </motion.div>
      ))}
    </div>
  );
}
