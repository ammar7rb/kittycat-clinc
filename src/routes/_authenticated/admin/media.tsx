import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Upload, Trash2, Copy, Check, ImageIcon, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  listMedia,
  uploadMedia,
  updateMediaAlt,
  deleteMedia,
} from "@/lib/media-admin.functions";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaAdminPage,
});

type MediaRow = {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  created_at: string;
};

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatSize(b: number | null) {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

function MediaAdminPage() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listMedia);
  const uploadFn = useServerFn(uploadMedia);
  const updateAltFn = useServerFn(updateMediaAlt);
  const deleteFn = useServerFn(deleteMedia);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => fetchList() as Promise<MediaRow[]>,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<MediaRow | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MediaRow | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "media"] });

  const uploadMut = useMutation({
    mutationFn: async (file: File) => {
      if (!ALLOWED.includes(file.type)) throw new Error("نوع الملف غير مدعوم");
      if (file.size > MAX_SIZE) throw new Error("الحجم أكبر من 5MB");
      const base64 = await fileToBase64(file);
      return uploadFn({
        data: {
          file_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          base64,
          alt_text: null,
        },
      });
    },
    onSuccess: () => {
      toast.success("تم الرفع");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: (r: MediaRow) =>
      updateAltFn({ data: { id: r.id, alt_text: r.alt_text } }),
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

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const f of Array.from(files)) {
      await uploadMut.mutateAsync(f).catch(() => {});
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function copyUrl(r: MediaRow) {
    navigator.clipboard.writeText(r.public_url);
    setCopiedId(r.id);
    toast.success("تم نسخ الرابط");
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">مكتبة الصور</h1>
          <p className="text-sm text-muted-foreground">
            ارفع الصور ثم انسخ الرابط واستخدمه في الخدمات/العروض/الفروع
          </p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMut.isPending}>
          <Upload className="ms-2 h-4 w-4" />
          {uploadMut.isPending ? "جاري الرفع..." : "رفع صور"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <Card
        className="border-dashed border-2 p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          اسحب الصور هنا أو اضغط للاختيار · حد أقصى 5MB · JPG/PNG/WEBP/GIF/SVG
        </p>
      </Card>

      {isLoading ? (
        <p className="text-muted-foreground">جاري التحميل...</p>
      ) : items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <ImageIcon className="mx-auto h-12 w-12 mb-2 opacity-50" />
          لا توجد صور بعد. ابدأ بالرفع.
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((r) => (
            <Card key={r.id} className="overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                <img
                  src={r.public_url}
                  alt={r.alt_text ?? r.file_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2 space-y-1">
                <p className="text-xs truncate" title={r.file_name}>
                  {r.file_name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {formatSize(r.size_bytes)}
                </p>
                <div className="flex gap-1 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                    onClick={() => copyUrl(r)}
                  >
                    {copiedId === r.id ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    onClick={() => setEditing(r)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    onClick={() => setConfirmDelete(r)}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الصورة</DialogTitle>
            <DialogDescription>{editing?.file_name}</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <img
                src={editing.public_url}
                alt=""
                className="w-full max-h-64 object-contain rounded border"
              />
              <div>
                <Label>النص البديل (Alt Text)</Label>
                <Input
                  value={editing.alt_text ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, alt_text: e.target.value })
                  }
                  placeholder="وصف الصورة لمحركات البحث وقارئات الشاشة"
                />
              </div>
              <div>
                <Label>الرابط العام</Label>
                <div className="flex gap-2">
                  <Input value={editing.public_url} readOnly dir="ltr" className="text-xs" />
                  <Button variant="outline" onClick={() => copyUrl(editing)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              إلغاء
            </Button>
            <Button
              onClick={() => editing && updateMut.mutate(editing)}
              disabled={updateMut.isPending}
            >
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الصورة نهائياً من التخزين. تأكد أنها غير مستخدمة في الموقع.
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
