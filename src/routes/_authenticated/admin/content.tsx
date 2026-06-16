import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Save, RotateCcw, Search, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  listContent,
  upsertContent,
  deleteContent,
} from "@/lib/content-admin.functions";
import {
  getAllFields,
  groupFields,
  GROUP_LABELS,
  type ContentGroupId,
  type ContentField,
} from "@/lib/i18n/content-catalog";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentAdminPage,
});

type Row = {
  id: string;
  key: string;
  value_ar: string | null;
  value_en: string | null;
  group_name: string | null;
};

function ContentAdminPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listContent);
  const upsertFn = useServerFn(upsertContent);
  const deleteFn = useServerFn(deleteContent);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "content"],
    queryFn: () => fetchList() as Promise<Row[]>,
  });

  const rowByKey = useMemo(() => {
    const m = new Map<string, Row>();
    for (const r of rows) m.set(r.key, r);
    return m;
  }, [rows]);

  const allFields = useMemo(() => getAllFields(), []);
  const grouped = useMemo(() => groupFields(allFields), [allFields]);

  const [activeGroup, setActiveGroup] = useState<ContentGroupId>(grouped[0]?.group ?? "home");
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Record<string, { ar: string; en: string }>>({});

  // hydrate drafts when rows load/change
  useEffect(() => {
    const next: Record<string, { ar: string; en: string }> = {};
    for (const f of allFields) {
      const r = rowByKey.get(f.key);
      next[f.key] = {
        ar: r?.value_ar ?? f.defaultAr,
        en: r?.value_en ?? f.defaultEn,
      };
    }
    setDrafts(next);
  }, [rowByKey, allFields]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "content"] });
    qc.invalidateQueries({ queryKey: ["content"] });
  };

  const saveMut = useMutation({
    mutationFn: async (field: ContentField) => {
      const d = drafts[field.key] ?? { ar: "", en: "" };
      return upsertFn({
        data: {
          key: field.key,
          group_name: field.group,
          value_ar: d.ar || null,
          value_en: d.en || null,
        },
      });
    },
    onSuccess: () => {
      toast.success("تم الحفظ");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetMut = useMutation({
    mutationFn: async (field: ContentField) => {
      const r = rowByKey.get(field.key);
      if (r) await deleteFn({ data: { id: r.id } });
      return field;
    },
    onSuccess: (field) => {
      setDrafts((p) => ({
        ...p,
        [field.key]: { ar: field.defaultAr, en: field.defaultEn },
      }));
      toast.success("تمت استعادة النص الافتراضي");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeFields = useMemo(() => {
    const list = grouped.find((g) => g.group === activeGroup)?.fields ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.defaultAr.toLowerCase().includes(q) ||
        f.defaultEn.toLowerCase().includes(q),
    );
  }, [grouped, activeGroup, search]);

  if (isLoading) {
    return <p className="p-6 text-muted-foreground">جاري التحميل...</p>;
  }

  const isCustomized = (key: string) => rowByKey.has(key);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">محتوى الصفحات</h1>
        <p className="text-sm text-muted-foreground mt-1">
          عدّل أي نص يظهر في الموقع. الحقول المعلّمة <CheckCircle2 className="inline h-3.5 w-3.5 text-primary" /> تم تخصيصها،
          أما <Circle className="inline h-3.5 w-3.5 text-muted-foreground" /> فهي تستخدم النص الافتراضي.
        </p>
      </div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {grouped.map((g) => {
          const customCount = g.fields.filter((f) => isCustomized(f.key)).length;
          const active = g.group === activeGroup;
          return (
            <button
              key={g.group}
              onClick={() => setActiveGroup(g.group)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/70 text-foreground"
              }`}
            >
              {GROUP_LABELS[g.group]}
              <span className="ms-2 text-xs opacity-70">
                ({g.fields.length}
                {customCount > 0 ? ` · ${customCount} مخصّص` : ""})
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ابحث داخل هذه الصفحة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pe-10"
        />
      </div>

      {activeFields.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          لا توجد نتائج مطابقة.
        </Card>
      ) : (
        <div className="space-y-3">
          {activeFields.map((f) => {
            const d = drafts[f.key] ?? { ar: f.defaultAr, en: f.defaultEn };
            const customized = isCustomized(f.key);
            const dirty =
              d.ar !== (rowByKey.get(f.key)?.value_ar ?? f.defaultAr) ||
              d.en !== (rowByKey.get(f.key)?.value_en ?? f.defaultEn);
            const isLong = f.defaultAr.length > 60 || f.defaultEn.length > 60;
            const Field = isLong ? Textarea : Input;
            return (
              <Card key={f.key} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <Label className="text-sm font-semibold">{f.label}</Label>
                    {customized ? (
                      <Badge variant="default" className="text-[10px]">
                        مخصّص
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        افتراضي
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">عربي</p>
                    <Field
                      value={d.ar}
                      onChange={(e) =>
                        setDrafts((p) => ({
                          ...p,
                          [f.key]: { ...d, ar: e.target.value },
                        }))
                      }
                      rows={isLong ? 3 : undefined}
                    />
                  </div>
                  <div dir="ltr">
                    <p className="text-xs text-muted-foreground mb-1">English</p>
                    <Field
                      value={d.en}
                      onChange={(e) =>
                        setDrafts((p) => ({
                          ...p,
                          [f.key]: { ...d, en: e.target.value },
                        }))
                      }
                      rows={isLong ? 3 : undefined}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {customized && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => resetMut.mutate(f)}
                      disabled={resetMut.isPending}
                    >
                      <RotateCcw className="ms-1 h-3.5 w-3.5" />
                      استعادة الافتراضي
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => saveMut.mutate(f)}
                    disabled={saveMut.isPending || !dirty}
                  >
                    <Save className="ms-1 h-3.5 w-3.5" />
                    حفظ
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
