import { createFileRoute } from "@tanstack/react-router";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ImageIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  listOffersAdmin,
  createOffer,
  updateOffer,
  deleteOffer,
} from "@/lib/offers-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/offers")({
  component: OffersAdminPage,
});

type Offer = {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  sort_order: number;
  is_active: boolean;
  layout: "wide" | "portrait";
};

const empty = {
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  image_url: "",
  start_date: null as string | null,
  end_date: null as string | null,
  sort_order: 0,
  is_active: true,
  layout: "wide" as "wide" | "portrait",
};

function OffersAdminPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listOffersAdmin);
  const createFn = useServerFn(createOffer);
  const updateFn = useServerFn(updateOffer);
  const deleteFn = useServerFn(deleteOffer);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["admin", "offers"],
    queryFn: () => fetchList(),
  });

  const [editing, setEditing] = useState<Offer | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Offer | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "offers"] });
    qc.invalidateQueries({ queryKey: ["offers"] });
  };

  const createMut = useMutation({
    mutationFn: (data: typeof empty) => createFn({ data }),
    onSuccess: () => {
      invalidate();
      setCreating(false);
      toast.success("تمت إضافة العرض");
    },
    onError: (e: Error) => toast.error("فشل الحفظ", { description: e.message }),
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: string; patch: Partial<typeof empty> }) =>
      updateFn({ data: args }),
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("تم تحديث العرض");
    },
    onError: (e: Error) => toast.error("فشل التحديث", { description: e.message }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      invalidate();
      setConfirmDelete(null);
      toast.success("تم حذف العرض");
    },
    onError: (e: Error) => toast.error("فشل الحذف", { description: e.message }),
  });

  const toggleActive = (o: Offer) =>
    updateMut.mutate({ id: o.id, patch: { is_active: !o.is_active } });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة العروض</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            العروض المميزة الظاهرة في الصفحة الرئيسية
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="ml-2 h-4 w-4" />
          عرض جديد
        </Button>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            جاري التحميل...
          </div>
        ) : offers.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            لا توجد عروض بعد. ابدأ بإضافة عرض جديد.
          </div>
        ) : (
          <ul className="divide-y">
            {(offers as Offer[]).map((o) => (
              <li key={o.id} className="flex items-center gap-3 p-4 hover:bg-muted/30">
                <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  {o.image_url ? (
                    <img src={o.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">{o.title_ar}</span>
                    {!o.is_active && (
                      <Badge variant="secondary" className="text-xs">
                        غير نشط
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{o.title_en}</p>
                  {o.end_date && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      ينتهي: {format(new Date(o.end_date), "yyyy/MM/dd")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Switch checked={o.is_active} onCheckedChange={() => toggleActive(o)} />
                  <Button variant="ghost" size="icon" onClick={() => setEditing(o)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(o)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <OfferFormDialog
        open={creating}
        onOpenChange={(o) => !o && setCreating(false)}
        title="إضافة عرض جديد"
        initial={empty}
        loading={createMut.isPending}
        onSubmit={(d) => createMut.mutate(d)}
      />

      <OfferFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title="تعديل العرض"
        initial={
          editing
            ? {
                title_ar: editing.title_ar,
                title_en: editing.title_en,
                description_ar: editing.description_ar ?? "",
                description_en: editing.description_en ?? "",
                image_url: editing.image_url ?? "",
                start_date: editing.start_date,
                end_date: editing.end_date,
                sort_order: editing.sort_order,
                is_active: editing.is_active,
                layout: editing.layout ?? "wide",
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
            <AlertDialogTitle>حذف العرض؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف "{confirmDelete?.title_ar}" نهائياً.
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

function OfferFormDialog({
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>بيانات العرض بالعربي والإنجليزي</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="العنوان (عربي) *">
              <Input
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                required
              />
            </Field>
            <Field label="العنوان (إنجليزي) *">
              <Input
                dir="ltr"
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                required
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الوصف (عربي)">
              <Textarea
                rows={3}
                value={form.description_ar ?? ""}
                onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
              />
            </Field>
            <Field label="الوصف (إنجليزي)">
              <Textarea
                dir="ltr"
                rows={3}
                value={form.description_en ?? ""}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              />
            </Field>
          </div>

          <Field label="صورة العرض">
            <ImageUploadField
              value={form.image_url ?? ""}
              onChange={(url) => setForm({ ...form, image_url: url })}
              recommended="1200 × 630 (عريضة)"
              aspect="wide"
            />
          </Field>


          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="تاريخ البداية">
              <DateField
                value={form.start_date}
                onChange={(v) => setForm({ ...form, start_date: v })}
              />
            </Field>
            <Field label="تاريخ الانتهاء (للعداد)">
              <DateField
                value={form.end_date}
                onChange={(v) => setForm({ ...form, end_date: v })}
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
                  {form.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>
            </Field>
          </div>

          <Field label="شكل العرض في الصفحة الرئيسية">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, layout: "wide" })}
                className={`rounded-xl border-2 p-3 text-right transition-all ${
                  form.layout === "wide"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="mx-auto mb-2 h-12 w-full rounded-md bg-muted" />
                <p className="text-sm font-bold">عريض 16:9</p>
                <p className="text-xs text-muted-foreground">صورة بجانب النص</p>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, layout: "portrait" })}
                className={`rounded-xl border-2 p-3 text-right transition-all ${
                  form.layout === "portrait"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="mx-auto mb-2 h-16 w-12 rounded-md bg-muted" />
                <p className="text-sm font-bold">طولي</p>
                <p className="text-xs text-muted-foreground">صورة تحت النص</p>
              </button>
            </div>
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={loading || !form.title_ar || !form.title_en}
          >
            {loading ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DateField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const date = value ? new Date(value) : undefined;
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start text-right font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {date ? format(date, "yyyy/MM/dd") : "اختر تاريخ"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d ? d.toISOString().slice(0, 10) : null)}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
      {value && (
        <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
          مسح
        </Button>
      )}
    </div>
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
