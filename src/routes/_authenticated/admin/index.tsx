import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Stethoscope, Tag, MapPin, FileText } from "lucide-react";
import { getAdminStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const fetchStats = useServerFn(getAdminStats);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => fetchStats(),
  });

  const cards = [
    {
      label: "الخدمات",
      value: data ? `${data.services.active}/${data.services.total}` : "—",
      hint: "نشطة / الإجمالي",
      icon: Stethoscope,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "العروض",
      value: data ? `${data.offers.active}/${data.offers.total}` : "—",
      hint: "نشطة / الإجمالي",
      icon: Tag,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "الفروع",
      value: data ? String(data.branches.total) : "—",
      hint: "إجمالي",
      icon: MapPin,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "نصوص الموقع",
      value: data ? String(data.content.total) : "—",
      hint: "مفاتيح المحتوى",
      icon: FileText,
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">نظرة عامة</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          ملخص حالة المحتوى الحالي للموقع
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="mt-2 text-3xl font-bold">{isLoading ? "..." : c.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold">المراحل القادمة</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>✅ المرحلة 1: إعداد لوحة التحكم + الحماية + نظرة عامة</li>
          <li>⏳ المرحلة 2: إدارة الخدمات (إضافة/تعديل/حذف)</li>
          <li>⏳ المرحلة 3: إدارة العروض</li>
          <li>⏳ المرحلة 4: إدارة الفروع</li>
          <li>⏳ المرحلة 5: تعديل نصوص كل الصفحات</li>
          <li>⏳ المرحلة 6: الإعدادات العامة + مكتبة الصور</li>
        </ul>
      </Card>
    </div>
  );
}
