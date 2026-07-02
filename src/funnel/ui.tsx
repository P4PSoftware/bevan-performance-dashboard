import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "./router";
import { CONFIG } from "./config";

export function Glow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300">
      {children}
    </div>
  );
}

export function CTAButton({
  to,
  children,
  subtext,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  subtext?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Link
        to={to}
        onClick={onClick}
        className="group inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)] transition hover:bg-emerald-400 hover:shadow-[0_0_60px_-8px_rgba(16,185,129,0.8)]"
      >
        {children}
        <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
      </Link>
      {subtext && (
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          {subtext}
        </span>
      )}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-5xl px-6 py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      {eyebrow && (
        <div className="mb-4">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}

export function FunnelShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-full overflow-x-hidden bg-[#050816] text-white">
      <Glow className="left-[-10%] top-[-5%] h-[500px] w-[500px] bg-emerald-500" />
      <Glow className="right-[-10%] top-[40%] h-[400px] w-[400px] bg-sky-600" />
      {children}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-4 text-center text-xs leading-relaxed text-slate-500">
        <p className="font-semibold text-slate-400">
          {CONFIG.brand.name} · {CONFIG.brand.contactEmail}
        </p>
        <p>
          This site is not a part of the Facebook™ website or Facebook™ Inc.
          Additionally, this site is NOT endorsed by Facebook™ in any way.
          FACEBOOK™ is a trademark of META™, Inc.
        </p>
        <p>
          Earnings Disclaimer: Results shared on this page are the experiences
          of specific clients and are not typical. Your results will depend on
          your offer, market, work ethic and many other factors. We make no
          guarantee of specific income results, and nothing on this page should
          be taken as a promise of future earnings.
        </p>
        <p>© {new Date().getFullYear()} {CONFIG.brand.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
