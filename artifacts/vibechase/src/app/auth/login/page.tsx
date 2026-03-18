"use client";

import { useState } from "react";
import { signInWithEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("email", email);
    const result = await signInWithEmail(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-5" />

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4 text-sm self-start">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Zap className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to VibeChase</CardTitle>
          <CardDescription>
            {sent
              ? "Check your inbox for the magic link"
              : "Sign in with your email to start chasing payments"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="text-5xl">✉️</div>
              <p className="text-muted-foreground text-sm">
                We sent a magic link to <strong className="text-foreground">{email}</strong>.
                Click the link in your email to sign in.
              </p>
              <Button
                variant="ghost"
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-4"
              >
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>
              {error && (
                <p className="text-destructive text-sm">{error}</p>
              )}
              <Button
                type="submit"
                variant="glow"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending magic link..." : "Send Magic Link"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                No password needed. We&apos;ll send you a secure login link.
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
