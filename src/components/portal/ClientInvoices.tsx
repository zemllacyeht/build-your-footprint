import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, Loader2, Plus, Receipt, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  description: string | null;
  amount_cents: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "overdue" | "void";
  issued_at: string;
  due_at: string | null;
  paid_at: string | null;
  external_url: string | null;
}

const STATUSES: Invoice["status"][] = ["draft", "sent", "paid", "overdue", "void"];

const statusVariant = (s: Invoice["status"]) => {
  switch (s) {
    case "paid":
      return "bg-primary/15 text-primary border-primary/30";
    case "overdue":
      return "bg-destructive/15 text-destructive border-destructive/30";
    case "sent":
      return "bg-accent/15 text-accent-foreground border-accent/30";
    case "void":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatMoney = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
  }).format((cents || 0) / 100);

const newInvoiceSchema = z.object({
  invoice_number: z.string().trim().min(1, "Invoice number required").max(60),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  amount: z.coerce.number().min(0, "Amount must be 0 or more").max(10_000_000),
  currency: z.string().trim().length(3, "Use a 3-letter currency code").toUpperCase(),
  status: z.enum(["draft", "sent", "paid", "overdue", "void"]),
  due_at: z.string().optional().or(z.literal("")),
  external_url: z.string().trim().url("Must be a valid URL").max(500).optional().or(z.literal("")),
});

interface Props {
  clientId: string;
  isAdmin?: boolean;
}

export const ClientInvoices = ({ clientId, isAdmin = false }: Props) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({
    invoice_number: "",
    description: "",
    amount: "",
    currency: "USD",
    status: "draft" as Invoice["status"],
    due_at: "",
    external_url: "",
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_invoices")
      .select("*")
      .eq("client_id", clientId)
      .order("issued_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Couldn't load invoices");
      return;
    }
    setInvoices((data ?? []) as Invoice[]);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const submit = async () => {
    const parsed = newInvoiceSchema.safeParse(draft);
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setAdding(true);
    const payload = {
      client_id: clientId,
      invoice_number: parsed.data.invoice_number,
      description: parsed.data.description || null,
      amount_cents: Math.round(parsed.data.amount * 100),
      currency: parsed.data.currency,
      status: parsed.data.status,
      due_at: parsed.data.due_at || null,
      paid_at: parsed.data.status === "paid" ? new Date().toISOString().slice(0, 10) : null,
      external_url: parsed.data.external_url || null,
    };
    const { error } = await supabase.from("client_invoices").insert(payload);
    setAdding(false);
    if (error) return toast.error(error.message);
    toast.success("Invoice added");
    setShowForm(false);
    setDraft({
      invoice_number: "",
      description: "",
      amount: "",
      currency: "USD",
      status: "draft",
      due_at: "",
      external_url: "",
    });
    load();
  };

  const updateStatus = async (inv: Invoice, status: Invoice["status"]) => {
    const { error } = await supabase
      .from("client_invoices")
      .update({
        status,
        paid_at:
          status === "paid"
            ? inv.paid_at ?? new Date().toISOString().slice(0, 10)
            : null,
      })
      .eq("id", inv.id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  };

  const remove = async (inv: Invoice) => {
    if (!confirm(`Delete invoice ${inv.invoice_number}?`)) return;
    const { error } = await supabase.from("client_invoices").delete().eq("id", inv.id);
    if (error) return toast.error(error.message);
    toast.success("Invoice removed");
    load();
  };

  const totalDue = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.amount_cents, 0);
  const currency = invoices[0]?.currency ?? "USD";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Billing</h3>
          {invoices.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Outstanding: <span className="font-medium text-foreground">{formatMoney(totalDue, currency)}</span>
            </span>
          )}
        </div>
        {isAdmin && (
          <Button
            variant="hero"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus className="h-4 w-4" /> New invoice
          </Button>
        )}
      </div>

      {isAdmin && showForm && (
        <div className="rounded-lg border border-border/50 p-4 bg-muted/20 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Invoice number *</Label>
              <Input
                value={draft.invoice_number}
                onChange={(e) => setDraft({ ...draft, invoice_number: e.target.value })}
                placeholder="INV-001"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Amount *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={draft.amount}
                onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                placeholder="1500.00"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Currency</Label>
              <Input
                value={draft.currency}
                onChange={(e) => setDraft({ ...draft, currency: e.target.value.toUpperCase() })}
                maxLength={3}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as Invoice["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Due date</Label>
              <Input
                type="date"
                value={draft.due_at}
                onChange={(e) => setDraft({ ...draft, due_at: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">External link</Label>
              <Input
                value={draft.external_url}
                onChange={(e) => setDraft({ ...draft, external_url: e.target.value })}
                placeholder="https://invoice.stripe.com/..."
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Input
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Discovery + design phase"
              maxLength={500}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="hero" size="sm" onClick={submit} disabled={adding}>
              {adding && <Loader2 className="h-4 w-4 animate-spin" />} Add invoice
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : invoices.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No invoices yet.
        </p>
      ) : (
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <div className="font-medium">{inv.invoice_number}</div>
                    {inv.description && (
                      <div className="text-xs text-muted-foreground">{inv.description}</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatMoney(inv.amount_cents, inv.currency)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {inv.issued_at}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {inv.due_at ?? "Not set"}
                  </TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <Select
                        value={inv.status}
                        onValueChange={(v) => updateStatus(inv, v as Invoice["status"])}
                      >
                        <SelectTrigger className="h-7 w-[110px] text-xs capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={`capitalize border ${statusVariant(inv.status)}`}>
                        {inv.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {inv.external_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(inv.external_url!, "_blank", "noopener,noreferrer")
                        }
                      >
                        <ExternalLink className="h-4 w-4" /> View
                      </Button>
                    )}
                    {isAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => remove(inv)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
