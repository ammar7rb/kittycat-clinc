import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, KeyRound, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/account")({
  component: AccountPage,
});

function AccountPage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setCurrentEmail(data.user.email);
        setNewEmail(data.user.email);
      }
    });
  }, []);

  async function handleEmailUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail || newEmail === currentEmail) {
      toast.error("أدخل بريدًا جديدًا مختلفًا عن الحالي");
      return;
    }
    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/admin/account` },
    );
    setEmailLoading(false);
    if (error) {
      toast.error("فشل تحديث البريد", { description: error.message });
      return;
    }
    toast.success("تم إرسال رابط التأكيد", {
      description:
        "افتح البريد الجديد واضغط على رابط التأكيد لإتمام التغيير. لن يتغير البريد قبل التأكيد.",
    });
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("كلمة السر يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("كلمتا السر غير متطابقتين");
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) {
      toast.error("فشل تحديث كلمة السر", { description: error.message });
      return;
    }
    toast.success("تم تحديث كلمة السر بنجاح");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">حسابي</h1>
        <p className="text-sm text-muted-foreground">
          تغيير البريد الإلكتروني وكلمة السر الخاصة بحسابك
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <Mail className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">تغيير البريد الإلكتروني</h2>
        </div>
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label>البريد الحالي</Label>
            <Input dir="ltr" value={currentEmail} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">البريد الجديد</Label>
            <Input
              id="new-email"
              type="email"
              dir="ltr"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new@example.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              سيتم إرسال رابط تأكيد إلى البريد الجديد. لن يتم التغيير قبل الضغط
              على الرابط.
            </p>
          </div>
          <Button type="submit" disabled={emailLoading}>
            <Save className="ms-2 h-4 w-4" />
            {emailLoading ? "جاري الإرسال..." : "تحديث البريد"}
          </Button>
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 border-b pb-3">
          <KeyRound className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">تغيير كلمة السر</h2>
        </div>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">كلمة السر الجديدة</Label>
            <Input
              id="new-password"
              type="password"
              dir="ltr"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">تأكيد كلمة السر</Label>
            <Input
              id="confirm-password"
              type="password"
              dir="ltr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <Button type="submit" disabled={passwordLoading}>
            <Save className="ms-2 h-4 w-4" />
            {passwordLoading ? "جاري الحفظ..." : "تحديث كلمة السر"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
