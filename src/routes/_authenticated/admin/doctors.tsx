import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  listDoctorsAdmin,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@/lib/doctors-admin.functions";
import { listBranchesAdmin } from "@/lib/branches-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/doctors")({
  component: DoctorsAdminPage,
});

type Doctor = {
  id: string;
  branch_id: string;
  name_ar: string;
  name_en: string | null;
  title_ar: string | null;
  title_en: string | null;
  photo_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type Branch = { id: string; name_ar: string };

const empty = {
  branch_id: "",
  name_ar: "",
  name_en: "",
  title_ar: "",
  title_en: "",
  photo_url: "",
  sort_order: 0,
  is_active: true,
};

function DoctorsAdminPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listDoctorsAdmin);
  const fetchBranches = useServerFn(listBranchesAdmin);
  const createFn = useServerFn(createDoctor);
  const updateFn = useServerFn(updateDoctor);
  const deleteFn = useServerFn(deleteDoctor);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["admin", "doctors"],
    queryFn: () => fetchList(),
  });
  const { data: branches = [] } = useQuery({
    queryKey: ["admin", "branches"],
    queryFn: () => fetchBranches(),
  });

  const [editing, setEditing] = useState<Doctor | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Doctor | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "doctors"] });
    qc.invalidateQueries({ queryKey: ["doctors"] });
  };

  const createMut = useMutation({
    mutationFn: (data: typeof empty) => createFn({ data }),
    onSuccess: () => {
      invalidate();
      setCreating(false);
      toast.success("تمت إضافة الطبيب");
    },
    onError: (e: Error) => toast.error("فشل الحفظ", { description: e.message }),
  });

  const updateMut = useMutation({
    mutationFn: (args: { id: string; patch: Partial<typeof empty> }) =>
      updateFn({ data: args }),
    onSuccess: () => {
      invalidate();
      setEditing(null);
      toast.success("تم التحديث");
    },
    onError: (e: Error) => toast.error("فشل التحديث", { description: e.message }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      invalidate();
      setConfirmDelete(null);
      toast.success("تم الحذف");
    },
    onError: (e: Error) => toast.error("فشل الحذف", { description: e.message }),
  });

  const toggleActive = (d: Doctor) =>
    updateMut.mutate({ id: d.id, patch: { is_active: !d.is_active } });

  const branchName = (id: string) =>
    (branches as Branch[]).find((b) => b.id === id)?.name_ar ?? "—";

  // Group by branch
  const grouped = (branches as Branch[]).map((b) => ({
    branch: b,
    list: (doctors as Doctor[]).filter((d) => d.branch_id === b.id),
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الأطباء</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            أطباء كل فرع — يظهرون في صفحة "من نحن"
          </p>
        </div>
        <Button onClick={() => setCreating(true)} disabled={branches.length === 0}>
          <Plus className="ml-2 h-4 w-4" />
          طبيب جديد
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">جاري التحميل...</Card>
      ) : grouped.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          أضف فروعاً أولاً من قسم الفروع.
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ branch, list }) => (
            <Card key={branch.id} className="overflow-hidden">
              <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-3">
                <Badge variant="outline">{branch.name_ar}</Badge>
                <span className="text-xs text-muted-foreground">
                  {list.length} طبيب/طبيبة
                </span>
              </div>
              {list.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">
                  لا يوجد أطباء في هذا الفرع.
                </p>
              ) : (
                <ul className="divide-y">
                  {list.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 p-4 hover:bg-muted/30">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Stethoscope className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">{d.name_ar}</span>
                          {!d.is_active && (
                            <Badge variant="secondary" className="text-xs">غير نشط</Badge>
                          )}
                        </div>
                        {d.title_ar && (
                          <p className="truncate text-xs text-muted-foreground">{d.title_ar}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch checked={d.is_active} onCheckedChange={() => toggleActive(d)} />
                        <Button variant="ghost" size="icon" onClick={() => setEditing(d)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(d)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}

      <DoctorFormDialog
        open={creating}
        onOpenChange={(o) => !o && setCreating(false)}
        title="إضافة طبيب"
        branches={branches as Branch[]}
        initial={{ ...empty, branch_id: (branches[0] as Branch)?.id ?? "" }}
        loading={createMut.isPending}
        onSubmit={(d) => createMut.mutate(d)}
      />

      <DoctorFormDialog
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title="تعديل طبيب"
        branches={branches as Branch[]}
        initial={
          editing
            ? {
                branch_id: editing.branch_id,
                name_ar: editing.name_ar,
                name_en: editing.name_en ?? "",
                title_ar: editing.title_ar ?? "",
                title_en: editing.title_en ?? "",
                photo_url: editing.photo_url ?? "",
                sort_order: editing.sort_order,
                is_active: editing.is_active,
              }
            : empty
        }
        loading={updateMut.isPending}
        onSubmit={(d) => editing && updateMut.mutate({ id: editing.id, patch: d })}
      />

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الطبيب؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف "{confirmDelete?.name_ar}" من فرع {confirmDelete && branchName(confirmDelete.branch_id)}.
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

function DoctorFormDialog({
  open,
  onOpenChange,
  title,
  branches,
  initial,
  loading,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  branches: Branch[];
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>بيانات الطبيب وارتباطه بالفرع</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Field label="الفرع *">
            <Select value={form.branch_id} onValueChange={(v) => set("branch_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name_ar}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الاسم (عربي) *">
              <Input value={form.name_ar} onChange={(e) => set("name_ar", e.target.value)} />
            </Field>
            <Field label="الاسم (إنجليزي)">
              <Input dir="ltr" value={form.name_en ?? ""} onChange={(e) => set("name_en", e.target.value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="التخصص (عربي)">
              <Input placeholder="طبيب بيطري — جراحة" value={form.title_ar ?? ""} onChange={(e) => set("title_ar", e.target.value)} />
            </Field>
            <Field label="التخصص (إنجليزي)">
              <Input dir="ltr" value={form.title_en ?? ""} onChange={(e) => set("title_en", e.target.value)} />
            </Field>
          </div>

          <Field label="رابط الصورة (اختياري)">
            <Input dir="ltr" placeholder="https://..." value={form.photo_url ?? ""} onChange={(e) => set("photo_url", e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ترتيب العرض">
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="الحالة">
              <div className="flex items-center gap-2 h-10">
                <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
                <span className="text-sm text-muted-foreground">
                  {form.is_active ? "نشط" : "غير نشط"}
                </span>
              </div>
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={loading || !form.branch_id || !form.name_ar}
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
