import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, GripVertical, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  listServicesAdmin,
  createService,
  updateService,
  deleteService,
} from "@/lib/services-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesAdminPage,
});

type Service = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const empty = {
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  icon: "",
  image_url: "",
  sort_order: 0,
  is_active: true,
};

function ServicesAdminPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listServicesAdmin);
  const createFn = useServerFn(createService);
  const updateFn = useServerFn(updateService);
  const deleteFn = useServerFn(deleteService);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: () => fetchList(),
  });

  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "services"] });
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const createMut = useMutation({
    mutationFn: (data: typeof empty) => createFn({ data }),
    onSuccess: () => {
      invalidate();
      setCreating(false);
      toast.success("تمت إضافة الخدمة");
    },
    onError: (e: Error) => toast.error("فشل الحفظ", { description: e.message }),
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: string; patch: Partial<typeof empty> }) =>
      updateFn({ data: args }),
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("تم تحديث الخدمة");
    },
    onError: (e: Error) => toast.error("فشل التحديث", { description: e.message }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      invalidate();
      setConfirmDelete(null);
      toast.success("تم حذف الخدمة");
    },
    onError: (e: Error) => toast.error("فشل الحذف", { description: e.message }),
  });

  const toggleActive = (s: Service) =>
    updateMut.mutate({ id: s.id, patch: { is_active: !s.is_active } });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الخدمات</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            أضف، عدّل، أو احذف الخدمات الظاهرة في الموقع
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="ml-2 h-4 w-4" />
          خدمة جديدة
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            جاري التحميل...
          </div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            لا توجد خدمات بعد. ابدأ بإضافة خدمة جديدة.
          </div>
        ) : (
          <ul className="divide-y">
            {services.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 p-4 hover:bg-muted/30"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt=""
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{s.name_ar}</span>
                    {!s.is_active && (
                      <Badge variant="secondary" className="text-xs">
                        غير نشطة
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{s.name_en}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Switch
                    checked={s.is_active}
                    onCheckedChange={() => toggleActive(s)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(s)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmDelete(s)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Create dialog */}
      <ServiceFormDialog
        open={creating}
        onOpenChange={(o) => !o && setCreating(false)}
        title="إضافة خدمة جديدة"
        initial={empty}
        loading={createMut.isPending}
        onSubmit={(d) => createMut.mutate(d)}
      />

      {/* Edit dialog */}
      <ServiceFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title="تعديل الخدمة"
        initial={
          editing
            ? {
                name_ar: editing.name_ar,
                name_en: editing.name_en,
                description_ar: editing.description_ar ?? "",
                description_en: editing.description_en ?? "",
                icon: editing.icon ?? "",
                image_url: editing.image_url ?? "",
                sort_order: editing.sort_order,
                is_active: editing.is_active,
              }
            : empty
        }
        loading={updateMut.isPending}
        onSubmit={(d) =>
          editing && updateMut.mutate({ id: editing.id, patch: d })
        }
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الخدمة؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف "{confirmDelete?.name_ar}" نهائياً ولا يمكن التراجع.
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

function ServiceFormDialog({
  open,
  onOpenChange,
  title,
  initial,
  loading,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  initial: typeof empty;
  loading: boolean;
  onSubmit: (d: typeof empty) => void;
}) {
  const [form, setForm] = useState(initial);

  // Reset when reopening
  useStateReset(open, initial, setForm);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            بيانات الخدمة بالعربي والإنجليزي
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الاسم (عربي) *">
              <Input
                value={form.name_ar}
                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                required
              />
            </Field>
            <Field label="الاسم (إنجليزي) *">
              <Input
                dir="ltr"
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الوصف (عربي)">
              <Textarea
                rows={3}
                value={form.description_ar ?? ""}
                onChange={(e) =>
                  setForm({ ...form, description_ar: e.target.value })
                }
              />
            </Field>
            <Field label="الوصف (إنجليزي)">
              <Textarea
                dir="ltr"
                rows={3}
                value={form.description_en ?? ""}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الأيقونة (Lucide name)">
              <Input
                dir="ltr"
                placeholder="Stethoscope, Heart, ..."
                value={form.icon ?? ""}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </Field>
            <Field label="رابط الصورة">
              <Input
                dir="ltr"
                placeholder="https://..."
                value={form.image_url ?? ""}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ترتيب العرض">
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) || 0 })
                }
              />
            </Field>
            <Field label="الحالة">
              <div className="flex items-center gap-2 h-10">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
                <span className="text-sm text-muted-foreground">
                  {form.is_active ? "نشطة" : "غير نشطة"}
                </span>
              </div>
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={loading || !form.name_ar || !form.name_en}
          >
            {loading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// Helper: reset form state when dialog opens
import { useEffect } from "react";
function useStateReset<T>(
  open: boolean,
  initial: T,
  setter: (v: T) => void,
) {
  useEffect(() => {
    if (open) setter(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
