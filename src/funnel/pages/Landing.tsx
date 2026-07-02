import { useEffect } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  CircleDollarSign,
  ClipboardCheck,
  Cog,
  Flame,
  LineChart,
  Megaphone,
  ShieldCheck,
  Target,
  ThumbsDown,
  ThumbsUp,
  Users,
  X,
  Check,
} from "lucide-react";
import { CONFIG } from "../config";
import { track } from "../tracking";
import { CTAButton, Eyebrow, FunnelShell, Section, SectionTitle } from "../ui";

const APPLY_SUBTEXT = "Free 2-minute application · No obligation";

export default function Landing() {
  useEffect(() => {
    track("ViewContent", { content_name: "dfy-landing" });
  }, []);

  return (
    <FunnelShell>
      <Hero />
      <TrustStrip />
      <Problem />
      <Mechanism />
      <HowItWorks />
      <Proof />
      <Guarantee />
      <WhoItsFor />
      <FAQ />
      <FinalCTA />
    </FunnelShell>
  );
}

function Hero() {
  return (
    <Section className="pt-20 text-center md:pt-28">
      <div className="mb-6 flex justify-center">
        <Eyebrow>
          For coaches, consultants &amp; agency owners doing $5k+/month
        </Eyebrow>
      </div>
      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
        We Build &amp; Run Your Entire Client-Getting System{" "}
        <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
          For You
        </span>{" "}
        — So You Can Get to Consistent $20k+ Months
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
        Not another course. Not more coaching calls. Our team builds your
        offer, funnel, ads and sales process — and implements all of it with
        you over {CONFIG.offer.programLengthMonths} months. Backed by our
        results guarantee.
      </p>
      <div className="mt-10 flex justify-center">
        <CTAButton to="/apply" subtext={APPLY_SUBTEXT}>
          Apply to Work With Us
        </CTAButton>
      </div>
      <p className="mt-6 text-sm text-slate-500">
        We only take on {CONFIG.offer.spotsPerMonth} new clients per month —
        every application is personally reviewed.
      </p>
    </Section>
  );
}

function TrustStrip() {
  const items = [
    { icon: LineChart, label: "12+ years in lead generation & coaching" },
    { icon: Users, label: `Max ${CONFIG.offer.spotsPerMonth} new clients per month` },
    { icon: Cog, label: "Done for you AND implemented for you" },
    { icon: ShieldCheck, label: "Results guarantee on every engagement" },
  ];
  return (
    <div className="relative border-y border-white/10 bg-white/[0.03]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-sm text-slate-300">
            <Icon className="h-5 w-5 shrink-0 text-emerald-400" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Problem() {
  const pains = [
    "You're great at what you do — but your income still depends on referrals, luck and hustle.",
    "You've bought the courses and sat through the coaching programs… and you're still the one doing everything.",
    "Leads are inconsistent, so revenue is inconsistent — one great month, then two quiet ones.",
    "You know ads and funnels work. You just don't have the time (or desire) to become a media buyer, copywriter and funnel builder.",
  ];
  return (
    <Section>
      <SectionTitle
        eyebrow="Sound familiar?"
        title={
          <>
            You Don't Have a Knowledge Problem.{" "}
            <span className="text-emerald-400">You Have an Implementation Problem.</span>
          </>
        }
      />
      <div className="mx-auto grid max-w-3xl gap-4">
        {pains.map((p) => (
          <div
            key={p}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <p className="text-slate-300">{p}</p>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-2xl text-center text-lg text-slate-300">
        Every "guru" sells you another thing to <em>learn</em>. We do the
        opposite: our team <strong className="text-white">builds and runs the system with you</strong>,
        so the bottleneck — you doing everything — is finally removed.
      </p>
    </Section>
  );
}

function Mechanism() {
  const pillars = [
    {
      icon: Target,
      title: "1. Irresistible Offer",
      body: "We rebuild your offer and positioning so the right clients see it and think 'this was made for me' — before you ever get on a call.",
    },
    {
      icon: Megaphone,
      title: "2. Predictable Lead Flow",
      body: "We write, build and launch your ads and funnel for you — then manage and optimise them so qualified leads arrive every week, not every referral.",
    },
    {
      icon: CalendarCheck,
      title: "3. Booked Sales Calls",
      body: "Leads are filtered and pre-qualified before they hit your calendar, so you only talk to people who are ready to buy.",
    },
    {
      icon: CircleDollarSign,
      title: "4. Sales That Convert",
      body: "We install a simple, non-sleazy sales process (scripts, follow-up, tracking) and refine it with you until the numbers work.",
    },
  ];
  return (
    <Section>
      <SectionTitle
        eyebrow="The P4P Done-For-You System"
        title="One Team. One System. Every Piece Handled."
        subtitle={`Over ${CONFIG.offer.programLengthMonths} months we build, launch and run the four pieces every consistent $20k+/month business has:`}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/40"
          >
            <Icon className="mb-4 h-8 w-8 text-emerald-400" />
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="leading-relaxed text-slate-400">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: ClipboardCheck,
      title: "Apply (2 minutes)",
      body: "Answer a few quick questions about your business so we can see if the DFY system is genuinely a fit for where you are.",
    },
    {
      icon: CircleDollarSign,
      title: "Secure your call for $1",
      body: "If you qualify, you'll reserve your strategy session with a fully-refundable $1 deposit. It's not about the money — it filters out the tyre-kickers ads attract, so serious applicants get our full attention.",
    },
    {
      icon: CalendarCheck,
      title: "Book your strategy call",
      body: "Pick a time on our calendar. On the call we'll map out your growth plan — and if we both agree it's a fit, we'll show you exactly how the DFY program works.",
    },
  ];
  return (
    <Section>
      <SectionTitle
        eyebrow="How it works"
        title="From Ad Click to Growth Plan in 3 Steps"
      />
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/10 text-lg font-extrabold text-emerald-300">
              {i + 1}
            </div>
            <Icon className="mb-3 h-6 w-6 text-emerald-400" />
            <h3 className="mb-2 text-lg font-bold">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{body}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <CTAButton to="/apply" subtext={APPLY_SUBTEXT}>
          Start My Application
        </CTAButton>
      </div>
    </Section>
  );
}

function Proof() {
  // Replace these placeholders with real client results, names and photos.
  const cases = [
    {
      quote:
        "“Within 90 days we went from relying on referrals to a full calendar of qualified calls every week.”",
      name: "Client Name",
      detail: "Business coach · $6k → $22k/month",
    },
    {
      quote:
        "“They didn't just tell us what to do — they built the whole thing. Ads, funnel, follow-up, everything.”",
      name: "Client Name",
      detail: "Consultant · 3.1x revenue in one quarter",
    },
    {
      quote:
        "“The first agency-style service I've used that actually delivered what the sales page promised.”",
      name: "Client Name",
      detail: "Agency owner · $11k → $34k/month",
    },
  ];
  return (
    <Section>
      <SectionTitle
        eyebrow="Client results"
        title="Real Businesses. Real Systems. Real Growth."
        subtitle="A few of the coaches, consultants and agency owners we've built systems for."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {cases.map((c) => (
          <figure
            key={c.detail}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <blockquote className="text-slate-300">{c.quote}</blockquote>
            <figcaption className="mt-6">
              <div className="font-bold text-white">{c.name}</div>
              <div className="text-sm text-emerald-400">{c.detail}</div>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-slate-500">
        Individual results vary. See earnings disclaimer below.
      </p>
    </Section>
  );
}

function Guarantee() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/10 to-transparent p-8 text-center md:p-12">
        <ShieldCheck className="mx-auto mb-6 h-14 w-14 text-emerald-400" />
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold md:text-4xl">
          Hit Your Revenue Goal in {CONFIG.offer.programLengthMonths} Months —
          Or Your Money Back
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
          We agree on your monthly recurring revenue target together, up front,
          on your strategy call. If you do the work with us and we don't hit
          it, you get your money back. That's why we cap intake at{" "}
          {CONFIG.offer.spotsPerMonth} clients a month — we only take on
          businesses we're confident we can grow.
        </p>
      </div>
    </Section>
  );
}

function WhoItsFor() {
  const yes = [
    "Coaches, consultants or agency owners already making $5k+/month",
    "You have an offer that gets clients results (even if it needs sharpening)",
    "You have capacity to take on more clients right now",
    "You're ready to invest in growth — and want experts to build it, not another DIY course",
  ];
  const no = [
    "You're pre-revenue or still figuring out what you sell",
    "You want a magic button with zero involvement in your own business",
    "You're not willing to run paid traffic to your offer",
    "You need guaranteed income promises before doing any work",
  ];
  return (
    <Section>
      <SectionTitle
        eyebrow="Be honest with yourself"
        title="This Is NOT For Everyone"
        subtitle="The application exists to protect your time and ours. Here's the honest breakdown:"
      />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-6">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-300">
            <ThumbsUp className="h-5 w-5" /> A great fit if…
          </div>
          <ul className="space-y-3">
            {yes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-300">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold text-rose-300">
            <ThumbsDown className="h-5 w-5" /> Not a fit if…
          </div>
          <ul className="space-y-3">
            {no.map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-400">
                <X className="mt-1 h-4 w-4 shrink-0 text-rose-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Why do I have to pay $1 to book a call?",
      a: "Ads bring in a lot of curious people who book calls and never show up. The $1 deposit is a simple commitment filter — it keeps our calendar open for serious applicants and means you get a properly prepared strategy session, not a rushed one. It's fully refundable, and you can even ask for it back after the call.",
    },
    {
      q: "Is this coaching or done-for-you?",
      a: "Done-for-you — and implemented-for-you. Our team builds your offer positioning, funnel, ads and sales assets. You stay involved in decisions and sales conversations; we handle the building, launching and optimising.",
    },
    {
      q: "How long until I see results?",
      a: `The program runs over ${CONFIG.offer.programLengthMonths} months. Most clients have their system live within the first weeks, then we optimise toward your agreed revenue target for the remainder. Your specific timeline is mapped out on the strategy call.`,
    },
    {
      q: "What does the strategy call involve?",
      a: "It's a working session, not a hard-sell webinar in disguise. We audit your current offer and lead flow, map the gap between where you are and your revenue goal, and show you the exact system we'd build. If it's a fit for both sides, we'll discuss working together. If not, you leave with a plan either way.",
    },
    {
      q: "Why only 10 clients per month?",
      a: "Because this is genuinely done-for-you, our senior team works directly on every account. Capping intake is how we protect the results guarantee.",
    },
    {
      q: "What if I don't qualify?",
      a: "Then we'll tell you honestly — and point you to the resources that fit your current stage, so you can come back when the timing is right.",
    },
  ];
  return (
    <Section>
      <SectionTitle eyebrow="Questions" title="Frequently Asked Questions" />
      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 open:border-emerald-400/30"
          >
            <summary className="cursor-pointer list-none text-lg font-bold text-white marker:hidden">
              {q}
            </summary>
            <p className="mt-3 leading-relaxed text-slate-400">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section className="pb-24 text-center">
      <BadgeCheck className="mx-auto mb-6 h-12 w-12 text-emerald-400" />
      <h2 className="mx-auto max-w-3xl text-3xl font-extrabold md:text-5xl">
        Stop Learning How to Grow.{" "}
        <span className="text-emerald-400">Have It Built For You.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
        {CONFIG.offer.spotsPerMonth} spots per month. Every application
        personally reviewed within 24 hours.
      </p>
      <div className="mt-10 flex justify-center">
        <CTAButton to="/apply" subtext={APPLY_SUBTEXT}>
          Apply Now — It Takes 2 Minutes
        </CTAButton>
      </div>
    </Section>
  );
}
