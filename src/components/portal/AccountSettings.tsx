import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Save, Settings, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const AccountSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    company_name: "",
    contact_name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState({ next: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("company_name, contact_name, phone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setLoading(false);
        if (data)
          setProfile({
            company_name: data.company_name ?? "",
            contact_name: data.contact_name ?? "",
            phone: data.phone ?? "",
          });
      });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        company_name: profile.company_name || null,
        contact_name: profile.contact_name || null,
        phone: profile.phone || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  const changePassword = async () => {
    if (pwd.next.length < 8) return toast.error("Password must be at least 8 characters");
    if (pwd.next !== pwd.confirm) return toast.error("Passwords do not match");
    setPwdSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwd.next });
    setPwdSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPwd({ next: "", confirm: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Account details</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs flex items-center gap-1.5">
              <Mail className="h-3 w-3" /> Email
            </Label>
            <Input value={user?.email ?? ""} disabled />
            <p className="text-[11px] text-muted-foreground">
              Contact your project lead to change the email on file.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Company</Label>
              <Input
                value={profile.company_name}
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Contact name</Label>
              <Input
                value={profile.contact_name}
                onChange={(e) => setProfile({ ...profile, contact_name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Phone</Label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="hero" onClick={saveProfile} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save changes
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Change password</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">New password</Label>
            <Input
              type="password"
              value={pwd.next}
              onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Confirm new password</Label>
            <Input
              type="password"
              value={pwd.confirm}
              onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button variant="hero" onClick={changePassword} disabled={pwdSaving || !pwd.next}>
              {pwdSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
