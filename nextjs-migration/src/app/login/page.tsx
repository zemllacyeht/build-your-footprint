"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, role, loading } = useAuth();

  const authError = (() => {
    switch (searchParams.get('error')) {
      case 'verification_failed':
        return 'That link has expired or already been used. Please request a new one.'
      case 'missing_params':
        return 'Invalid verification link. Please use the link from your email.'
      case null:
        return null
      default:
        return 'Something went wrong. Please try again or contact support.'
    }
  })()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (loading || !user) return;
    if (role === null) return;
    router.replace(role === "admin" ? "/admin" : "/portal");
  }, [user, role, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Invalid email or password" : error.message);
      return;
    }
    toast.success("Welcome back");
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/portal`,
      },
    });
    if (error) toast.error(error.message || "Google sign-in failed.");
  };

  return (
    <main className="min-h-screen grid place-items-center px-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>

        <div className="glass rounded-2xl p-8 shadow-elegant">
          <div className="mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow mb-4">
              <span className="font-display font-bold text-primary-foreground text-xl">F</span>
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Client <span className="text-gradient-gold">Portal</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to view your previews and manage your account.
            </p>
          </div>

          {authError && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {authError}
            </div>
          )}

          <Button type="button" variant="glass" size="lg" className="w-full mb-4" onClick={handleGoogleSignIn}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1a6.2 6.2 0 1 1 0-12.4 5.5 5.5 0 0 1 3.9 1.5l2.6-2.5A9.5 9.5 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4.1 9.6-9.8 0-.7-.07-1.3-.18-2H12z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={async () => {
                    const parsed = emailSchema.safeParse(email);
                    if (!parsed.success) return toast.error("Enter your email above first");
                    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) return toast.error(error.message);
                    toast.success("Check your inbox for a reset link");
                  }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-xs text-center text-muted-foreground">
            Access is by invitation only.{" "}
            <Link href="/contact" className="text-primary hover:underline">Contact us to get started</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
