import { supabase } from "@/integrations/supabase/client";

/**
 * Fire-and-forget transactional email helper.
 * Failures are logged but never block the calling UI flow.
 */
export async function sendNotification(args: {
  templateName: string;
  recipientEmail: string;
  idempotencyKey: string;
  templateData?: Record<string, unknown>;
}) {
  try {
    const { error } = await supabase.functions.invoke("send-transactional-email", {
      body: args,
    });
    if (error) {
      console.warn("[sendNotification]", args.templateName, error.message);
    }
  } catch (err) {
    console.warn("[sendNotification] threw", args.templateName, err);
  }
}

/** Look up the admin notification email (first admin's email). */
export async function getAdminEmail(): Promise<string | null> {
  const { data } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();
  if (!data?.user_id) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", data.user_id)
    .maybeSingle();
  return profile?.email ?? null;
}

/** Look up a client's email + display name from profiles. */
export async function getClientContact(clientId: string): Promise<{
  email: string | null;
  name: string | null;
  company: string | null;
}> {
  const { data } = await supabase
    .from("profiles")
    .select("email, contact_name, company_name")
    .eq("id", clientId)
    .maybeSingle();
  return {
    email: data?.email ?? null,
    name: data?.contact_name ?? null,
    company: data?.company_name ?? null,
  };
}
