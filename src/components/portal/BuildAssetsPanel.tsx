import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileUp, FolderUp, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Asset {
  id: string;
  client_id: string;
  uploader_id: string;
  file_path: string;
  original_filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  category: string;
  label: string | null;
  description: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: "logo", label: "Logo" },
  { value: "image", label: "Image / Photo" },
  { value: "document", label: "Document / PDF" },
  { value: "copy", label: "Copy / Text" },
  { value: "brand", label: "Brand kit" },
  { value: "other", label: "Other" },
];

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/svg+xml,image/gif,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const MAX_BYTES = 25 * 1024 * 1024;

interface Props {
  clientId: string;
  isAdmin?: boolean;
}

const formatSize = (n: number | null) => {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};

export const BuildAssetsPanel = ({ clientId, isAdmin = false }: Props) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [category, setCategory] = useState<string>("image");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("client_build_assets")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });
    setAssets((data as Asset[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel(`assets:${clientId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "client_build_assets", filter: `client_id=eq.${clientId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !user) return;
    setUploading(true);
    let success = 0;
    for (const file of files) {
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is over 25 MB`);
        continue;
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${clientId}/${Date.now()}_${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("build-assets")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) {
        toast.error(`${file.name}: ${upErr.message}`);
        continue;
      }
      const { error: insErr } = await supabase.from("client_build_assets").insert({
        client_id: clientId,
        uploader_id: user.id,
        file_path: path,
        original_filename: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
        category,
        label: label.trim() || null,
        description: description.trim() || null,
      });
      if (insErr) toast.error(insErr.message);
      else success += 1;
    }
    setUploading(false);
    if (fileInput.current) fileInput.current.value = "";
    setLabel("");
    setDescription("");
    if (success) toast.success(`Uploaded ${success} file${success > 1 ? "s" : ""}`);
  };

  const remove = async (a: Asset) => {
    if (!confirm(`Delete "${a.original_filename}"?`)) return;
    await supabase.storage.from("build-assets").remove([a.file_path]);
    const { error } = await supabase.from("client_build_assets").delete().eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
  };

  const download = async (a: Asset) => {
    const { data, error } = await supabase.storage
      .from("build-assets")
      .createSignedUrl(a.file_path, 60);
    if (error || !data?.signedUrl) return toast.error(error?.message || "Failed");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const filtered = filter === "all" ? assets : assets.filter((a) => a.category === filter);

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border border-border/50 p-4 bg-muted/20">
        <div className="flex items-center gap-2">
          <FolderUp className="h-4 w-4 text-primary" />
          <h3 className="font-display text-lg font-semibold">Upload build content</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Logos, images, PDFs, copy, brand assets. Max 25 MB per file.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Label (optional)</Label>
            <Input
              placeholder="e.g. Primary logo"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs">Notes (optional)</Label>
          <Textarea
            rows={2}
            maxLength={500}
            placeholder="Anything we should know about these files."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept={ACCEPT}
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          variant="hero"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
          Choose files
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">Library</h3>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No files in this category yet.
          </p>
        ) : (
          <div className="grid gap-2">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/50 p-3 bg-background/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {a.label || a.original_filename}
                    </span>
                    <Badge variant="secondary" className="text-[10px] capitalize">
                      {a.category}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {a.original_filename} · {formatSize(a.size_bytes)} ·{" "}
                    {new Date(a.created_at).toLocaleDateString()}
                  </div>
                  {a.description && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {a.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => download(a)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  {(isAdmin || a.uploader_id === user?.id) && (
                    <Button variant="ghost" size="sm" onClick={() => remove(a)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
