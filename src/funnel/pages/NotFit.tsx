import { Compass, Mail } from "lucide-react";
import { loadApplication } from "../application";
import { CONFIG } from "../config";
import { Eyebrow, FunnelShell, Section } from "../ui";

export default function NotFit() {
  const app = loadApplication();

  return (
    <FunnelShell>
      <Section className="max-w-2xl pt-16 text-center">
        <div className="mb-6 flex justify-center">
          <Eyebrow>Application received</Eyebrow>
        </div>
        <Compass className="mx-auto mb-6 h-14 w-14 text-sky-400" />
        <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
          Thanks{app?.firstName ? `, ${app.firstName}` : ""} — Honest Answer:
          The DFY Program Isn't the Right Move for You Yet.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
          That's not a rejection of you — it's us refusing to sell you
          something that won't pay for itself at your current stage. The
          done-for-you system works best once you're consistently at
          $5k+/month with an offer that's already selling.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-left">
          <h2 className="text-xl font-extrabold">What we'd suggest instead</h2>
          <ul className="mt-4 list-inside list-disc space-y-3 text-slate-300">
            <li>
              Focus on one offer and sell it manually (outreach, referrals,
              partnerships) until it's producing $5k/month consistently.
            </li>
            <li>
              Keep your delivery simple — don't build funnels before the offer
              is proven.
            </li>
            <li>
              When you cross that line, come back and re-apply. Several of our
              best clients were "not yet" the first time around.
            </li>
          </ul>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <p>
              Want a pointer on your next step? Email{" "}
              <a className="text-emerald-400 underline" href={`mailto:${CONFIG.brand.contactEmail}`}>
                {CONFIG.brand.contactEmail}
              </a>{" "}
              with subject line <strong>“Next step”</strong> and we'll reply
              with our honest advice.
            </p>
          </div>
        </div>
      </Section>
    </FunnelShell>
  );
}
