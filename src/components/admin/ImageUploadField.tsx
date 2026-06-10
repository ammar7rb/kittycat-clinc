import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload, X, Image as ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadMedia } from "@/lib/media-admin.functions";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024;

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

export function ImageUploadField({
  value,
  onChange,
  recommended,
  aspect = "video",
}: {
  value: string;
  onChange: (url: string) => void;
  /** نص توضيحي عن الأبعاد المقترحة */
  recommended: string;
  /** نسبة المعاينة: square | video | wide */
  aspect?: "square" | "video" | "wide";
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadFn = useServerFn(uploadMedia);
  const [uploading, setUploading] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
        ? "aspect-[1200/630]"
        : "aspect-video";

  async function handleFile(file: File) {
    if (!ALLOWED.includes(file.type)) {
      toast.error("نوع الملف غير مدعوم");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("الحجم أكبر من 5MB");
      return;
    }
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      const row = await uploadFn({
        data: {
          file_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          base64,
          alt_text: null,
        },
      });
      onChange((row as { public_url: string }).public_url);
      toast.success("تم رفع الصورة");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative ${aspectClass} w-full max-w-md rounded-lg border-2 border-dashed bg-muted/30 overflow-hidden`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-cover" />
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 end-2 h-7 w-7"
              onClick={() => onChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <p>جاري الرفع...</p>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 opacity-50" />
                <p>اضغط أو اسحب صورة هنا</p>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        الأبعاد المقترحة: <span className="font-medium">{recommended}</span> · حد أقصى 5MB
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="ms-2 h-3.5 w-3.5" />
          {value ? "استبدال" : "رفع صورة"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setShowUrl((v) => !v)}
        >
          <Link2 className="ms-2 h-3.5 w-3.5" />
          {showUrl ? "إخفاء" : "أو ألصق رابط"}
        </Button>
      </div>

      {showUrl && (
        <Input
          dir="ltr"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      <input
        ref={fileRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
