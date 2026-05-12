import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Row {
  id: string;
  referrer_id: string;
  referred_email: string;
  referred_name: string | null;
  message: string | null;
  status: string;
  created_at: string;
  referrer_name?: string | null;
  referrer_company?: string | null;
}

const STATUSES = ["sent", "contacted", "converted", "declined"];

export const AdminReferrals = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_referrals")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    const ids = Array.from(new Set((data ?? []).map((r) => r.referrer_id)));
    const { data: profs } = ids.length
      ? await supabase
          .from("profiles")
          .select("id, contact_name, company_name")
          .in("id", ids)
      : { data: [] as any[] };
    const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
    setRows(
      (data ?? []).map((r: any) => ({
        ...r,
        referrer_name: map.get(r.referrer_id)?.contact_name ?? null,
        referrer_company: map.get(r.referrer_id)?.company_name ?? null,
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("client_referrals")
      .update({ status })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Referrals</h2>
        <Button variant="ghost" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>
      <div className="glass rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Referred</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  No referrals yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {r.referrer_company || r.referrer_name || "Client"}
                    </div>
                    {r.referrer_company && r.referrer_name && (
                      <div className="text-xs text-muted-foreground">{r.referrer_name}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{r.referred_name || "(no name)"}</div>
                    <div className="text-xs text-muted-foreground">{r.referred_email}</div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {r.message || "(no note)"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={r.status}
                      onValueChange={(v) => updateStatus(r.id, v)}
                    >
                      <SelectTrigger className="h-8 w-32">
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
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
