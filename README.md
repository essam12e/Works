# حافظة أعمال

منصة ويب عربية RTL لإدارة مهام الشركات والفرق، تشمل لوحة مدير، إدارة موظفين، إدارة مهام، مراجعة التسليمات، بوابة موظف، تعليقات، مرفقات، وإشعارات بريدية.

## التقنية المستخدمة

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Prisma ORM
- SQLite للتطوير المحلي السريع، ويمكن تبديله إلى PostgreSQL/Supabase عند النشر
- JWT HttpOnly Cookie للجلسات
- Nodemailer لإشعارات البريد
- Recharts للمخططات

## التشغيل المحلي

```bash
npm install
npm run db:push
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## المتغيرات البيئية

انسخ `.env.example` إلى `.env` وعدّل القيم:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-with-a-long-random-secret"
APP_URL="http://localhost:3000"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="حافظة أعمال <no-reply@example.com>"
```

إذا لم تضبط SMTP، سيتم حفظ الإشعارات في جدول `notifications` بدون إرسال فعلي، وهذا مفيد أثناء التطوير.

## سير الاستخدام

1. أنشئ حساب مدير من `/auth/register`.
2. أدخل بيانات الشركة في صفحة التهيئة.
3. أضف الموظفين من لوحة التحكم.
4. أنشئ مهاماً وأسندها للموظفين.
5. افتح رابط بوابة الموظف الموجود في صفحة الموظفين.
6. يرفع الموظف ملفات التسليم ويرسل المهمة للمراجعة.
7. يعتمد المدير المهمة أو يطلب تعديلاً من صفحة المراجعة.

## قاعدة البيانات

النماذج الأساسية موجودة في `prisma/schema.prisma`:

- `users`
- `companies`
- `employees`
- `tasks`
- `task_comments`
- `task_attachments`
- `notifications`

كل استعلام إداري مرتبط بـ `companyId`، وبوابة الموظف تعتمد على `portalToken` خاص يمنع رؤية مهام موظف آخر.

## النشر على Vercel مع PostgreSQL أو Supabase

1. أنشئ قاعدة PostgreSQL في Supabase أو Neon أو Vercel Postgres.
2. غيّر `DATABASE_URL` في Vercel إلى رابط PostgreSQL.
3. غيّر `provider` في `prisma/schema.prisma` من `sqlite` إلى `postgresql`.
4. شغّل:

```bash
npm run db:generate
npm run db:migrate
```

## ملاحظات

- رفع الملفات في التطوير يتم داخل `public/uploads`.
- في الإنتاج يفضل نقل التخزين إلى Supabase Storage أو S3 مع نفس بنية خدمة `src/lib/storage.ts`.
- واتساب مجهز كبنية مستقبلية من خلال جدول الإشعارات وقنواتها، ولم يتم ربط مزود واتساب فعلياً بعد.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Vercel Analytics

تم تفعيل Vercel Web Analytics و Vercel Speed Insights داخل جذر تطبيق Next.js.

بعد رفع المشروع على Vercel يجب تفعيل Web Analytics و Speed Insights من لوحة تحكم Vercel للمشروع حتى تظهر البيانات.
