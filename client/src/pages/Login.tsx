import { ArrowRight, Home, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Login() {
  const startOAuth = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 font-sans">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-border/60 bg-card p-8 text-center shadow-xl shadow-primary/5 md:p-10">
          <Link href="/" className="mx-auto inline-flex items-center gap-2">
            <span className="rounded-xl bg-primary/10 p-3">
              <Home className="h-6 w-6 text-primary" />
            </span>
            <span className="font-display text-2xl font-bold">
              PG<span className="text-primary">Finder</span>
            </span>
          </Link>

          <div className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Welcome back</p>
            <h1 className="mt-3 text-3xl font-display font-bold">Find your next stay</h1>
            <p className="mt-3 text-muted-foreground">
              Log in or create your free account with secure OAuth to list and manage properties.
            </p>
          </div>

          <Button onClick={startOAuth} size="lg" className="mt-8 h-12 w-full rounded-xl text-base shadow-lg shadow-primary/20">
            Continue with Replit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Secure Replit OAuth authentication
          </div>

          <Link href="/" className="mt-8 inline-block text-sm text-muted-foreground transition-colors hover:text-primary">
            Continue browsing without an account
          </Link>
        </div>
      </div>
    </div>
  );
}