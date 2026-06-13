import { createFileRoute } from "@tanstack/react-router";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  listProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/products-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsAdminPage,
});

type Product = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  image_url: string | null;
  category: "food" | "accessories" | "toys" | "health" | "other";
  pet_type: "cat" | "dog" | "both";
  brand: string | null;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

const empty = {
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  price: 0,
  compare_at_price: null as number | null,
  currency: "SAR",
  image_url: "",
  category: "food" as Product["category"],
  pet_type: "cat" as Product["pet_type"],
  brand: "",
  stock: 0,
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

const CATEGORY_LABELS: Record<Product["category"], string> = {
  food: "طعام",
  accessories: "إكسسوارات",
  toys: "ألعاب",
  health: "صحة",
  other: "أخرى",
};

const PET_LABELS: Record<Product["pet_type"], string> = {
  cat: "قطط",
  dog: "كلاب",
  both: "الجميع",
};

function ProductsAdminPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listProductsAdmin);
  const createFn = useServerFn(createProduct);
  const updateFn = useServerFn(updateProduct);
  const deleteFn = useServerFn(deleteProduct);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => fetchList(),
  });

  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const createMut = useMutation({
    mutationFn: (data: typeof empty) => createFn({ data }),
    onSuccess: () => {
      invalidate();
      setCreating(false);
      toast.success("تمت إضافة المنتج");
    },
    onError: (e: Error) => toast.error("فشل الحفظ", { description: e.message }),
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: string; patch: Partial<typeof empty> }) =>
      updateFn({ data: args }),
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("تم تحديث المنتج");
    },
    onError: (e: Error) => toast.error("فشل التحديث", { description: e.message }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      invalidate();
      setConfirmDelete(null);
      toast.success("تم حذف المنتج");
    },
    onError: (e: Error) => toast.error("فشل الحذف", { description: e.message }),
  });

  const toggleActive = (p: Product) =>
    updateMut.mutate({ id: p.id, patch: { is_active: !p.is_active } });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            أضف، عدّل، أو احذف منتجات المتجر
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="ml-2 h-4 w-4" />
          منتج جديد
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            جاري التحميل...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            لا توجد منتجات بعد. ابدأ بإضافة منتج جديد.
          </div>
        ) : (
          <ul className="divide-y">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 p-4 hover:bg-muted/30"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted overflow-hidden">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium">{p.name_ar}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {CATEGORY_LABELS[p.category]}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {PET_LABELS[p.pet_type]}
                    </Badge>
                    {p.is_featured && (
                      <Badge className="text-[10px]">مميز</Badge>
                    )}
                    {!p.is_active && (
                      <Badge variant="secondary" className="text-[10px]">
                        غير نشط
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {p.brand && `${p.brand} • `}
                    {p.price} {p.currency} • المخزون: {p.stock}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Switch
                    checked={p.is_active}
                    onCheckedChange={() => toggleActive(p)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(p)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setConfirmDelete(p)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ProductFormDialog
        open={creating}
        onOpenChange={(o) => !o && setCreating(false)}
        title="إضافة منتج جديد"
        initial={empty}
        loading={createMut.isPending}
        onSubmit={(d) => createMut.mutate(d)}
      />

      <ProductFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title="تعديل المنتج"
        initial={
          editing
            ? {
                name_ar: editing.name_ar,
                name_en: editing.name_en,
                description_ar: editing.description_ar ?? "",
                description_en: editing.description_en ?? "",
                price: Number(editing.price),
                compare_at_price: editing.compare_at_price
                  ? Number(editing.compare_at_price)
                  : null,
                currency: editing.currency,
                image_url: editing.image_url ?? "",
                category: editing.category,
                pet_type: editing.pet_type,
                brand: editing.brand ?? "",
                stock: editing.stock,
                is_featured: editing.is_featured,
                is_active: editing.is_active,
                sort_order: editing.sort_order,
              }
            : empty
        }
        loading={updateMut.isPending}
        onSubmit={(d) =>
          editing && updateMut.mutate({ id: editing.id, patch: d })
        }
      />

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المنتج؟</AlertDialogTitle>
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

function ProductFormDialog({
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>بيانات المنتج بالعربي والإنجليزي</DialogDescription>
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

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="السعر *">
              <Input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) || 0 })
                }
              />
            </Field>
            <Field label="السعر قبل الخصم (اختياري)">
              <Input
                type="number"
                step="0.01"
                value={form.compare_at_price ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    compare_at_price: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </Field>
            <Field label="العملة">
              <Input
                dir="ltr"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="الفئة">
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v as Product["category"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="نوع الحيوان">
              <Select
                value={form.pet_type}
                onValueChange={(v) =>
                  setForm({ ...form, pet_type: v as Product["pet_type"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PET_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="العلامة التجارية">
              <Input
                value={form.brand ?? ""}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </Field>
          </div>

          <Field label="صورة المنتج">
            <ImageUploadField
              value={form.image_url ?? ""}
              onChange={(url) => setForm({ ...form, image_url: url })}
              recommended="1024 × 1024 (مربعة)"
              aspect="square"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="المخزون">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) || 0 })
                }
              />
            </Field>
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
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                  />
                  <span className="text-xs text-muted-foreground">
                    {form.is_active ? "نشط" : "غير نشط"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_featured}
                    onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
                  />
                  <span className="text-xs text-muted-foreground">مميز</span>
                </div>
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
