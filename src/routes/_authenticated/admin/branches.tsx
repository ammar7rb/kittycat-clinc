import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
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
  listBranchesAdmin,
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/lib/branches-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/branches")({
  component: BranchesAdminPage,
});

type Branch = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  address_ar: string | null;
  address_en: string | null;
  phone: string | null;
  whatsapp: string | null;
  maps_url: string | null;
  maps_embed: string | null;
  latitude: number | null;
  longitude: number | null;
  working_hours_ar: string | null;
  working_hours_en: string | null;
  sort_order: number;
  is_active: boolean;
};

const empty = {
  slug: "",
  name_ar: "",
  name_en: "",
  address_ar: "",
  address_en: "",
  phone: "",
  whatsapp: "",
  maps_url: "",
  maps_embed: "",
  latitude: null as number | null,
  longitude: null as number | null,
  working_hours_ar: "",
  working_hours_en: "",
  sort_order: 0,
  is_active: true,
};

function BranchesAdminPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listBranchesAdmin);
  const createFn = useServerFn(createBranch);
  const updateFn = useServerFn(updateBranch);
  const deleteFn = useServerFn(deleteBranch);

  const { data: branches = [], isLoading } = useQuery({
    queryKey: ["admin", "branches"],
    queryFn: () => fetchList(),
  });

  const [editing, setEditing] = useState<Branch | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Branch | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "branches"] });
    qc.invalidateQueries({ queryKey: ["branches"] });
  };

  const createMut = useMutation({
    mutationFn: (data: typeof empty) => createFn({ data }),
    onSuccess: () => {
      invalidate();
      setCreating(false);
      toast.success("تمت إضافة الفرع");
    },
    onError: (e: Error) => toast.error("فشل الحفظ", { description: e.message }),
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: string; patch: Partial<typeof empty> }) =>
      updateFn({ data: args }),
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("تم تحديث الفرع");
    },
    onError: (e: Error) => toast.error("فشل التحديث", { description: e.message }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      invalidate();
      setConfirmDelete(null);
      toast.success("تم حذف الفرع");
    },
    onError: (e: Error) => toast.error("فشل الحذف", { description: e.message }),
  });

  const toggleActive = (b: Branch) =>
    updateMut.mutate({ id: b.id, patch: { is_active: !b.is_active } });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الفروع</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            البيانات والعناوين وساعات العمل لكل فرع
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="ml-2 h-4 w-4" />
          فرع جديد
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">جاري التحميل...</div>
        ) : branches.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            لا توجد فروع بعد.
          </div>
        ) : (
          <ul className="divide-y">
            {branches.map((b) => (
              <li key={b.id} className="flex items-center gap-3 p-4 hover:bg-muted/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{b.name_ar}</span>
                    <Badge variant="outline" className="text-xs">{b.slug}</Badge>
                    {!b.is_active && (
                      <Badge variant="secondary" className="text-xs">غير نشط</Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.address_ar || b.name_en}
                  </p>
                  {b.phone && (
                    <p className="text-xs text-muted-foreground" dir="ltr">
                      📞 {b.phone}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Switch checked={b.is_active} onCheckedChange={() => toggleActive(b)} />
                  <Button variant="ghost" size="icon" onClick={() => setEditing(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(b)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <BranchFormDialog
        open={creating}
        onOpenChange={(o) => !o && setCreating(false)}
        title="إضافة فرع جديد"
        initial={empty}
        loading={createMut.isPending}
        onSubmit={(d) => createMut.mutate(d)}
      />

      <BranchFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title="تعديل الفرع"
        initial={
          editing
            ? {
                slug: editing.slug,
                name_ar: editing.name_ar,
                name_en: editing.name_en,
                address_ar: editing.address_ar ?? "",
                address_en: editing.address_en ?? "",
                phone: editing.phone ?? "",
                whatsapp: editing.whatsapp ?? "",
                maps_url: editing.maps_url ?? "",
                maps_embed: editing.maps_embed ?? "",
                latitude: editing.latitude,
                longitude: editing.longitude,
                working_hours_ar: editing.working_hours_ar ?? "",
                working_hours_en: editing.working_hours_en ?? "",
                sort_order: editing.sort_order,
                is_active: editing.is_active,
              }
            : empty
        }
        loading={updateMut.isPending}
        onSubmit={(d) => editing && updateMut.mutate({ id: editing.id, patch: d })}
      />

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الفرع؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف "{confirmDelete?.name_ar}" نهائياً.
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

function BranchFormDialog({
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

  useEffect(() => {
    if (open) setForm(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (k: keyof typeof empty, v: any) => setForm({ ...form, [k]: v });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>بيانات الفرع كاملة</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Field label="المعرّف (slug) * — يستخدم في الروابط، إنجليزي صغير">
            <Input
              dir="ltr"
              placeholder="al-raqam"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value.toLowerCase())}
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="اسم الفرع (عربي) *">
              <Input value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} />
            </Field>
            <Field label="اسم الفرع (إنجليزي) *">
              <Input dir="ltr" value={form.name_en} onChange={(e) => set("name_en", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="العنوان (عربي)">
              <Textarea rows={2} value={form.address_ar ?? ""} onChange={(e) => set("address_ar", e.target.value)} />
            </Field>
            <Field label="العنوان (إنجليزي)">
              <Textarea dir="ltr" rows={2} value={form.address_en ?? ""} onChange={(e) => set("address_en", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="رقم التليفون">
              <Input dir="ltr" placeholder="+971..." value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="رقم واتساب">
              <Input dir="ltr" placeholder="+971..." value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ساعات العمل (عربي)">
              <Input placeholder="السبت - الخميس: 9ص - 11م" value={form.working_hours_ar ?? ""} onChange={(e) => set("working_hours_ar", e.target.value)} />
            </Field>
            <Field label="ساعات العمل (إنجليزي)">
              <Input dir="ltr" placeholder="Sat - Thu: 9am - 11pm" value={form.working_hours_en ?? ""} onChange={(e) => set("working_hours_en", e.target.value)} />
            </Field>
          </div>

          <Field label="رابط الخريطة (Google Maps URL)">
            <Input dir="ltr" placeholder="https://maps.google.com/..." value={form.maps_url ?? ""} onChange={(e) => set("maps_url", e.target.value)} />
          </Field>

          <Field label="كود الخريطة المضمنة (iframe src)">
            <Textarea
              dir="ltr"
              rows={2}
              placeholder="https://www.google.com/maps/embed?..."
              value={form.maps_embed ?? ""}
              onChange={(e) => set("maps_embed", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              من Google Maps → Share → Embed a map → انسخ الـ src من الـ iframe
            </p>
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="خط العرض (Latitude)">
              <Input
                type="number"
                step="any"
                dir="ltr"
                value={form.latitude ?? ""}
                onChange={(e) => set("latitude", e.target.value ? Number(e.target.value) : null)}
              />
            </Field>
            <Field label="خط الطول (Longitude)">
              <Input
                type="number"
                step="any"
                dir="ltr"
                value={form.longitude ?? ""}
                onChange={(e) => set("longitude", e.target.value ? Number(e.target.value) : null)}
              />
            </Field>
            <Field label="ترتيب العرض">
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
              />
            </Field>
          </div>

          <Field label="الحالة">
            <div className="flex items-center gap-2 h-10">
              <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
              <span className="text-sm text-muted-foreground">
                {form.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={loading || !form.slug || !form.name_ar || !form.name_en}
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
