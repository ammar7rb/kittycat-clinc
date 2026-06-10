import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  listContent,
  upsertContent,
  updateContent,
  deleteContent,
} from "@/lib/content-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentAdminPage,
});

type ContentRow = {
  id: string;
  key: string;
  value_ar: string | null;
  value_en: string | null;
  group_name: string | null;
};

const emptyNew = { key: "", value_ar: "", value_en: "", group_name: "" };

function ContentAdminPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listContent);
  const upsertFn = useServerFn(upsertContent);
  const updateFn = useServerFn(updateContent);
  const deleteFn = useServerFn(deleteContent);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "content"],
    queryFn: () => fetchList() as Promise<ContentRow[]>,
  });

  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ContentRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ContentRow | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "content"] });
    qc.invalidateQueries({ queryKey: ["content"] });
  };

  const createMut = useMutation({
    mutationFn: (data: typeof emptyNew) =>
      upsertFn({
        data: {
          key: data.key.trim(),
          value_ar: data.value_ar || null,
          value_en: data.value_en || null,
          group_name: data.group_name?.trim() || null,
        },
      }),
    onSuccess: () => {
      toast.success("تمت الإضافة");
      setCreating(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: (row: ContentRow) =>
      updateFn({
        data: {
          id: row.id,
          patch: {
            value_ar: row.value_ar || null,
            value_en: row.value_en || null,
            group_name: row.group_name?.trim() || null,
          },
        },
      }),
    onSuccess: () => {
      toast.success("تم الحفظ");
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("تم الحذف");
      setConfirmDelete(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.key.toLowerCase().includes(q) ||
        (r.value_ar ?? "").toLowerCase().includes(q) ||
        (r.value_en ?? "").toLowerCase().includes(q) ||
        (r.group_name ?? "").toLowerCase().includes(q),
    );
  }, [rows, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, ContentRow[]>();
    for (const r of filtered) {
      const g = r.group_name?.trim() || "عام";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(r);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">محتوى الصفحات</h1>
          <p className="text-sm text-muted-foreground">
            عدّل أي نص يظهر على الموقع من مكان واحد
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="ms-2 h-4 w-4" /> نص جديد
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="بحث بالمفتاح أو النص..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pe-10"
        />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : grouped.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          لا توجد نصوص بعد. ابدأ بإضافة أول نص.
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([group, items]) => (
            <div key={group}>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                {group} <span className="opacity-60">({items.length})</span>
              </h2>
              <div className="space-y-2">
                {items.map((r) => (
                  <Card key={r.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {r.key}
                        </code>
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              عربي
                            </p>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {r.value_ar || (
                                <span className="text-muted-foreground italic">
                                  —
                                </span>
                              )}
                            </p>
                          </div>
                          <div dir="ltr">
                            <p className="text-xs text-muted-foreground mb-1">
                              English
                            </p>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {r.value_en || (
                                <span className="text-muted-foreground italic">
                                  —
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditing(r)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setConfirmDelete(r)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateDialog
        open={creating}
        onOpenChange={setCreating}
        onSubmit={(d) => createMut.mutate(d)}
        loading={createMut.isPending}
      />

      <EditDialog
        row={editing}
        onClose={() => setEditing(null)}
        onSubmit={(r) => updateMut.mutate(r)}
        loading={updateMut.isPending}
      />

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف النص نهائياً. لا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && deleteMut.mutate(confirmDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CreateDialog({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (d: typeof emptyNew) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState(emptyNew);
  useEffect(() => {
    if (open) setForm(emptyNew);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>نص جديد</DialogTitle>
          <DialogDescription>
            المفتاح هو معرّف فريد يستخدمه الموقع لعرض النص (مثلاً: home.hero.title)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>المفتاح (key) *</Label>
              <Input
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                placeholder="home.hero.title"
                dir="ltr"
              />
            </div>
            <div>
              <Label>المجموعة (اختياري)</Label>
              <Input
                value={form.group_name}
                onChange={(e) => setForm({ ...form, group_name: e.target.value })}
                placeholder="home"
              />
            </div>
          </div>
          <div>
            <Label>النص بالعربية</Label>
            <Textarea
              value={form.value_ar}
              onChange={(e) => setForm({ ...form, value_ar: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label>النص بالإنجليزية</Label>
            <Textarea
              dir="ltr"
              value={form.value_en}
              onChange={(e) => setForm({ ...form, value_en: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={!form.key.trim() || loading}
          >
            <Save className="ms-2 h-4 w-4" /> حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({
  row,
  onClose,
  onSubmit,
  loading,
}: {
  row: ContentRow | null;
  onClose: () => void;
  onSubmit: (r: ContentRow) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<ContentRow | null>(row);
  useEffect(() => {
    setForm(row);
  }, [row]);

  if (!form) return null;

  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>تعديل النص</DialogTitle>
          <DialogDescription>
            <code className="text-xs">{form.key}</code>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>المجموعة</Label>
            <Input
              value={form.group_name ?? ""}
              onChange={(e) => setForm({ ...form, group_name: e.target.value })}
            />
          </div>
          <div>
            <Label>النص بالعربية</Label>
            <Textarea
              value={form.value_ar ?? ""}
              onChange={(e) => setForm({ ...form, value_ar: e.target.value })}
              rows={4}
            />
          </div>
          <div>
            <Label>النص بالإنجليزية</Label>
            <Textarea
              dir="ltr"
              value={form.value_en ?? ""}
              onChange={(e) => setForm({ ...form, value_en: e.target.value })}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={() => onSubmit(form)} disabled={loading}>
            <Save className="ms-2 h-4 w-4" /> حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
