import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Save,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { listContent, upsertContent } from "@/lib/content-admin.functions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

type Row = {
  id: string;
  key: string;
  value_ar: string | null;
  value_en: string | null;
  group_name: string | null;
};

type SettingDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "url";
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  recommended?: string;
  aspect?: "square" | "video" | "wide";
  bilingual?: boolean;
};

const SECTIONS: { title: string; items: SettingDef[] }[] = [
  {
    title: "هوية الموقع",
    items: [
      {
        key: "settings.logo_url",
        label: "شعار الموقع",
        type: "image",
        recommended: "512 × 512 (PNG شفاف)",
        aspect: "square",
      },
      {
        key: "settings.favicon_url",
        label: "أيقونة المتصفح (Favicon)",
        type: "image",
        recommended: "64 × 64 (PNG أو ICO)",
        aspect: "square",
      },
    ],
  },
  {
    title: "بيانات التواصل",
    items: [
      {
        key: "settings.phone",
        label: "رقم الهاتف",
        type: "text",
        placeholder: "+20 100 000 0000",
        icon: Phone,
      },
      {
        key: "settings.whatsapp",
        label: "رقم الواتساب",
        type: "text",
        placeholder: "+20 100 000 0000",
        icon: MessageCircle,
      },
      {
        key: "settings.email",
        label: "البريد الإلكتروني",
        type: "text",
        placeholder: "info@example.com",
        icon: Mail,
      },
      {
        key: "settings.address",
        label: "العنوان الرئيسي",
        type: "textarea",
        icon: MapPin,
        bilingual: true,
      },
      {
        key: "settings.working_hours",
        label: "ساعات العمل",
        type: "textarea",
        icon: Clock,
        bilingual: true,
      },
    ],
  },
  {
    title: "السوشيال ميديا",
    items: [
      {
        key: "settings.social.facebook",
        label: "Facebook",
        type: "url",
        placeholder: "https://facebook.com/...",
        icon: Facebook,
      },
      {
        key: "settings.social.instagram",
        label: "Instagram",
        type: "url",
        placeholder: "https://instagram.com/...",
        icon: Instagram,
      },
      {
        key: "settings.social.tiktok",
        label: "TikTok",
        type: "url",
        placeholder: "https://tiktok.com/@...",
      },
      {
        key: "settings.social.youtube",
        label: "YouTube",
        type: "url",
        placeholder: "https://youtube.com/...",
        icon: Youtube,
      },
      {
        key: "settings.social.twitter",
        label: "X (Twitter)",
        type: "url",
        placeholder: "https://x.com/...",
        icon: Twitter,
      },
    ],
  },
  {
    title: "متغيرات الأزرار (روابط)",
    items: [
      {
        key: "settings.instagram_order_url",
        label: 'رابط زر "اطلب الآن" (رسائل إنستجرام)',
        type: "url",
        placeholder: "https://ig.me/m/your_username",
        icon: Instagram,
      },
      {
        key: "settings.instagram_learn_more_url",
        label: 'رابط زر "اعرف المزيد" (رسائل إنستجرام)',
        type: "url",
        placeholder: "https://ig.me/m/your_username",
        icon: Instagram,
      },
    ],
  },
];

function SettingsPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listContent);
  const upsertFn = useServerFn(upsertContent);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "content"],
    queryFn: () => fetchList() as Promise<Row[]>,
  });

  // local form state keyed by setting key
  const [form, setForm] = useState<
    Record<string, { ar: string; en: string }>
  >({});

  useEffect(() => {
    const next: Record<string, { ar: string; en: string }> = {};
    for (const r of rows) {
      if (r.group_name === "settings") {
        next[r.key] = { ar: r.value_ar ?? "", en: r.value_en ?? "" };
      }
    }
    // ensure all defined keys exist
    for (const sec of SECTIONS)
      for (const it of sec.items)
        if (!next[it.key]) next[it.key] = { ar: "", en: "" };
    setForm(next);
  }, [rows]);

  const saveMut = useMutation({
    mutationFn: async (key: string) => {
      const v = form[key] ?? { ar: "", en: "" };
      return upsertFn({
        data: {
          key,
          group_name: "settings",
          value_ar: v.ar || null,
          value_en: v.en || null,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveAllMut = useMutation({
    mutationFn: async () => {
      const keys = SECTIONS.flatMap((s) => s.items.map((i) => i.key));
      for (const k of keys) {
        const v = form[k] ?? { ar: "", en: "" };
        await upsertFn({
          data: {
            key: k,
            group_name: "settings",
            value_ar: v.ar || null,
            value_en: v.en || null,
          },
        });
      }
    },
    onSuccess: () => {
      toast.success("تم حفظ جميع الإعدادات");
      qc.invalidateQueries({ queryKey: ["admin", "content"] });
      qc.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function update(key: string, lang: "ar" | "en", val: string) {
    setForm((p) => ({
      ...p,
      [key]: { ...(p[key] ?? { ar: "", en: "" }), [lang]: val },
    }));
  }

  if (isLoading) {
    return <p className="text-muted-foreground">جاري التحميل...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">الإعدادات العامة</h1>
          <p className="text-sm text-muted-foreground">
            بيانات تظهر في الهيدر، الفوتر، وصفحة التواصل
          </p>
        </div>
        <Button
          onClick={() => saveAllMut.mutate()}
          disabled={saveAllMut.isPending}
        >
          <Save className="ms-2 h-4 w-4" />
          {saveAllMut.isPending ? "جاري الحفظ..." : "حفظ الكل"}
        </Button>
      </div>

      {SECTIONS.map((section) => (
        <Card key={section.title} className="p-4 sm:p-6 space-y-5">
          <h2 className="text-lg font-semibold border-b pb-2">{section.title}</h2>
          <div className="space-y-5">
            {section.items.map((item) => {
              const v = form[item.key] ?? { ar: "", en: "" };
              const Icon = item.icon;
              return (
                <div key={item.key} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    {item.label}
                  </Label>

                  {item.type === "image" ? (
                    <ImageUploadField
                      value={v.ar}
                      onChange={(url) => update(item.key, "ar", url)}
                      recommended={item.recommended ?? ""}
                      aspect={item.aspect}
                    />
                  ) : item.type === "textarea" ? (
                    <div className="grid gap-2 md:grid-cols-2">
                      <Textarea
                        placeholder="بالعربية"
                        rows={3}
                        value={v.ar}
                        onChange={(e) => update(item.key, "ar", e.target.value)}
                      />
                      <Textarea
                        dir="ltr"
                        placeholder="English"
                        rows={3}
                        value={v.en}
                        onChange={(e) => update(item.key, "en", e.target.value)}
                      />
                    </div>
                  ) : item.bilingual ? (
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        placeholder="بالعربية"
                        value={v.ar}
                        onChange={(e) => update(item.key, "ar", e.target.value)}
                      />
                      <Input
                        dir="ltr"
                        placeholder="English"
                        value={v.en}
                        onChange={(e) => update(item.key, "en", e.target.value)}
                      />
                    </div>
                  ) : (
                    <Input
                      dir="ltr"
                      placeholder={item.placeholder}
                      value={v.ar}
                      onChange={(e) => update(item.key, "ar", e.target.value)}
                    />
                  )}

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        saveMut.mutate(item.key, {
                          onSuccess: () => toast.success("تم الحفظ"),
                        });
                      }}
                      disabled={saveMut.isPending}
                    >
                      <Save className="ms-1 h-3.5 w-3.5" /> حفظ
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
