import { useEffect, useMemo } from "react";
import { CalendarCheck, PartyPopper } from "lucide-react";
import { loadApplication } from "../application";
import { CONFIG } from "../config";
import { track, trackCustom } from "../tracking";
import { Eyebrow, FunnelShell, Section } from "../ui";

export default function Book() {
  const app = loadApplication();

  const calendlyUrl = useMemo(() => {
    const url = new URL(CONFIG.calendlyUrl);
    if (app) {
      url.searchParams.set("name", `${app.firstName} ${app.lastName}`.trim());
      url.searchParams.set("email", app.email);
    }
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "0b1120");
    url.searchParams.set("text_color", "ffffff");
    url.searchParams.set("primary_color", "10b981");
    return url.toString();
  }, [app]);

  useEffect(() => {
    const paid = new URLSearchParams(window.location.search).get("paid") === "1";
    if (paid) {
      track("Purchase", { content_name: "dfy-call-deposit", value: 1, currency: "USD" });
    }

    // Calendly notifies the parent page when a booking is confirmed.
    const onMessage = (e: MessageEvent) => {
      if (
        typeof e.data === "object" &&
        e.data?.event === "calendly.event_scheduled"
      ) {
        track("Schedule", { content_name: "dfy-strategy-call" });
        trackCustom("StrategyCallBooked");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <FunnelShell>
      <Section className="pt-16 text-center">
        <div className="mb-6 flex justify-center">
          <Eyebrow>Final step</Eyebrow>
        </div>
        <PartyPopper className="mx-auto mb-6 h-14 w-14 text-emerald-400" />
        <h1 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight md:text-4xl">
          You're In{app?.firstName ? `, ${app.firstName}` : ""} — Pick a Time
          for Your Strategy Call
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
          Choose a slot below. You'll get a confirmation email with everything
          you need — just bring your numbers and 45 focused minutes.
        </p>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <iframe
            title="Book your strategy call"
            src={calendlyUrl}
            className="h-[760px] w-full"
          />
        </div>

        <div className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm text-slate-400">
          <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <p>
            Can't see the calendar?{" "}
            <a className="text-emerald-400 underline" href={calendlyUrl} target="_blank" rel="noreferrer">
              Open it in a new tab
            </a>{" "}
            or email{" "}
            <a className="text-emerald-400 underline" href={`mailto:${CONFIG.brand.contactEmail}`}>
              {CONFIG.brand.contactEmail}
            </a>
            .
          </p>
        </div>
      </Section>
    </FunnelShell>
  );
}
