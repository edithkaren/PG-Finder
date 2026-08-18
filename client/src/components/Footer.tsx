import { Link } from "wouter";
import { Home, Mail, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <span className="rounded-lg bg-primary/15 p-2">
              <Home className="h-5 w-5 text-primary" />
            </span>
            <span className="font-display text-xl font-bold">
              PG<span className="text-primary">Finder</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Find comfortable, verified stays with live availability from our growing listing network.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Secure OAuth sign-in
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-white">Explore</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/pgs" className="transition-colors hover:text-primary">Browse listings</Link>
            <Link href="/login" className="transition-colors hover:text-primary">Log in or sign up</Link>
            <Link href="/list-property" className="transition-colors hover:text-primary">List your property</Link>
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-white">Need help?</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Have a question about a stay or want to partner with us?
          </p>
          <a href="mailto:hello@pgfinder.example" className="mt-4 inline-flex items-center gap-2 text-sm text-slate-200 transition-colors hover:text-primary">
            <Mail className="h-4 w-4 text-primary" />
            hello@pgfinder.example
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} PGFinder. Built for better stays.</span>
          <span>Listings refresh automatically every 30 seconds.</span>
        </div>
      </div>
    </footer>
  );
}