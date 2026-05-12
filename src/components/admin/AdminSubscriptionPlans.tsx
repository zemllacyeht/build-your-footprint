import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  description: string | null;
  plan_type: string;
  amount_cents: number;
  currency: string;
  interval: string;
  stripe_price_id: string | null;
  active: boolean;
  position: number;
};

const empty: Partial<Plan> = {
  name: "",
  description: "",
  plan_type: "hosting",
  amount_cents: 0,
  currency: "usd",
  interval: "month",
  stripe_price_id: "",
  active: true,
  position: 0,
};

export const AdminSubscriptionPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Plan>>(empty);

  const load = async () => {
    const { data } = await supabase.from("subscription_plans").select("*").order("position");
    setPlans((data as Plan[]) || []);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing.name || !editing.amount_cents) {
      toast.error("Name and amount are required");
      return;
    }
    const payload = {
      name: editing.name,
      description: editing.description || null,
      plan_type: editing.plan_type || "hosting",
      amount_cents: Number(editing.amount_cents),
      currency: (editing.currency || "usd").toLowerCase(),
      interval: editing.interval || "month",
      stripe_price_id: editing.stripe_price_id || null,
      active: editing.active ?? true,
      position: Number(editing.position) || 0,
    };
    const { error } = editing.id
      ? await supabase.from("subscription_plans").update(payload).eq("id", editing.id)
      : await supabase.from("subscription_plans").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing.id ? "Plan updated" : "Plan created");
    setOpen(false);
    setEditing(empty);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    const { error } = await supabase.from("subscription_plans").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Plan deleted");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">Subscription plans</h3>
          <p className="text-sm text-muted-foreground">
            Hosting and domain offerings clients can subscribe to.
          </p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(empty); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(empty)}>
              <Plus className="h-4 w-4" /> New plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing.id ? "Edit plan" : "New plan"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={editing.plan_type} onValueChange={(v) => setEditing({ ...editing, plan_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hosting">Hosting</SelectItem>
                      <SelectItem value="domain">Domain</SelectItem>
                      <SelectItem value="bundle">Bundle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Interval</Label>
                  <Select value={editing.interval} onValueChange={(v) => setEditing({ ...editing, interval: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Amount (cents)</Label>
                  <Input type="number" value={editing.amount_cents ?? 0} onChange={(e) => setEditing({ ...editing, amount_cents: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input value={editing.currency || "usd"} onChange={(e) => setEditing({ ...editing, currency: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Stripe price ID (optional)</Label>
                <Input
                  placeholder="price_..."
                  value={editing.stripe_price_id || ""}
                  onChange={(e) => setEditing({ ...editing, stripe_price_id: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to use ad-hoc pricing from the fields above.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Position</Label>
                  <Input type="number" value={editing.position ?? 0} onChange={(e) => setEditing({ ...editing, position: Number(e.target.value) })} />
                </div>
                <div className="flex items-end gap-2">
                  <Switch checked={editing.active ?? true} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                  <Label>Active</Label>
                </div>
              </div>
              <Button onClick={save} className="w-full">
                {editing.id ? "Save changes" : "Create plan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {plans.length === 0 ? (
        <p className="text-sm text-muted-foreground">No plans yet. Create one to get started.</p>
      ) : (
        <div className="grid gap-3">
          {plans.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-4 flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{p.name}</span>
                    <Badge variant="secondary">{p.plan_type}</Badge>
                    {!p.active && <Badge variant="outline">Inactive</Badge>}
                  </div>
                  {p.description && <p className="text-sm text-muted-foreground mt-1">{p.description}</p>}
                  <p className="text-sm mt-1">
                    {(p.amount_cents / 100).toFixed(2)} {p.currency.toUpperCase()} / {p.interval}
                    {p.stripe_price_id && <span className="text-muted-foreground ml-2">({p.stripe_price_id})</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditing(p); setOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => remove(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionPlans;
