import { useEffect } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CircleDollarSign,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { loadApplication, wasQualified } from "../application";
import { CONFIG } from "../config";
import { Link, useRouter } from "../router";
import { track } from "../tracking";
import { Eyebrow, FunnelShell, Section } from "../ui";

export default function Qualified() {
  const { navigate } = useRouter();
  const app = loadApplication();

  useEffect(() => {
    // Don't let people deep-link straight to the payment step from an ad.
    if (!app || !wasQualified()) {
      navigate("/apply");
      return;
    }
    track("AddPaymentInfo", { content_name: "dfy-call-deposit", value: 1, currency: "USD" });
  }, []);

  if (!app || !wasQualified()) return null;

  const paymentConfigured = CONFIG.stripePaymentLink.startsWith("http");

  return (
    <FunnelShell>
      <Section className="max-w-2xl pt-16 text-center">
        <div className="mb-6 flex justify-center">
          <Eyebrow>Application received</Eyebrow>
        </div>
        <BadgeCheck className="mx-auto mb-6 h-16 w-16 text-emerald-400" />
        <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
          Congratulations{app.firstName ? `, ${app.firstName}` : ""} — You
          Pre-Qualify.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
          Based on your answers, your business is at the stage where the
          Done-For-You system works best. There's one small step left before
          you pick a time with us.
        </p>

        <div className="mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-400/5 p-8 text-left">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-8 w-8 shrink-0 text-emerald-400" />
            <h2 className="text-xl font-extrabold">
              Reserve your strategy call — $1
            </h2>
          </div>
          <p className="mt-4 leading-relaxed text-slate-300">
            Ads bring us hundreds of applications, and no-shows steal time from
            serious founders. The refundable $1 deposit confirms you're real
            and committed — nothing more. It guarantees your slot and a fully
            prepared session with our senior team.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              100% refundable — just ask on the call
            </li>
            <li className="flex items-start gap-3">
              <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Unlocks our live calendar immediately after payment
            </li>
            <li className="flex items-start gap-3">
              <RefreshCcw className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              No subscription, no hidden charges — a single $1 payment
            </li>
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3">
            {paymentConfigured ? (
              <a
                href={CONFIG.stripePaymentLink}
                className="group inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)] transition hover:bg-emerald-400"
              >
                Secure My Call for $1
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>
            ) : (
              // Fallback while the Stripe Payment Link isn't configured yet:
              // let qualified applicants straight through to the calendar.
              <Link
                to="/book?paid=1"
                className="group inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)] transition hover:bg-emerald-400"
              >
                Continue to Booking
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            )}
            <span className="text-xs text-slate-500">
              Secure checkout powered by Stripe
            </span>
          </div>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Questions first? Email us at{" "}
          <a className="text-emerald-400 underline" href={`mailto:${CONFIG.brand.contactEmail}`}>
            {CONFIG.brand.contactEmail}
          </a>
        </p>
      </Section>
    </FunnelShell>
  );
}
