import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import {
  type Application,
  EMPTY_APPLICATION,
  isQualified,
  saveApplication,
  submitToWebhook,
} from "../application";
import { CONFIG } from "../config";
import { useRouter } from "../router";
import { track, trackCustom } from "../tracking";
import { Eyebrow, FunnelShell, Section } from "../ui";

type ChoiceOption = { value: string; label: string; hint?: string };

const ROLE_OPTIONS: ChoiceOption[] = [
  { value: "coach", label: "Coach", hint: "Business, health, life, performance…" },
  { value: "consultant", label: "Consultant", hint: "You sell expertise & outcomes" },
  { value: "agency", label: "Agency owner", hint: "You sell services to businesses" },
  { value: "other", label: "Something else" },
];

const REVENUE_OPTIONS: ChoiceOption[] = [
  { value: "under2k", label: "Under $2k / month" },
  { value: "2to5k", label: "$2k – $5k / month" },
  { value: "5to10k", label: "$5k – $10k / month" },
  { value: "10to20k", label: "$10k – $20k / month" },
  { value: "over20k", label: "$20k+ / month" },
];

const BOTTLENECK_OPTIONS: ChoiceOption[] = [
  { value: "leads", label: "Not enough leads", hint: "Inconsistent or low-quality enquiries" },
  { value: "sales", label: "Leads don't convert", hint: "Calls happen but sales don't" },
  { value: "offer", label: "My offer isn't landing", hint: "Hard to explain or price" },
  { value: "delivery", label: "No time to grow", hint: "Delivery eats every hour" },
  { value: "time", label: "All of the above" },
];

const INVEST_OPTIONS: ChoiceOption[] = [
  {
    value: "yes-now",
    label: "Yes — I'm ready to invest now",
    hint: "I have the resources set aside for growth",
  },
  {
    value: "yes-plan",
    label: "Yes — with the right plan",
    hint: "I'd invest if the strategy and guarantee make sense",
  },
  {
    value: "no",
    label: "No — I'm not in a position to invest",
  },
];

const TIMELINE_OPTIONS: ChoiceOption[] = [
  { value: "asap", label: "Immediately" },
  { value: "30days", label: "Within 30 days" },
  { value: "later", label: "Just researching for later" },
];

export default function Apply() {
  const { navigate } = useRouter();
  const [step, setStep] = useState(0);
  const [app, setApp] = useState<Application>(EMPTY_APPLICATION);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    trackCustom("ApplicationStarted");
  }, []);

  const set = <K extends keyof Application>(key: K, value: Application[K]) =>
    setApp((prev) => ({ ...prev, [key]: value }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email.trim());

  const steps: {
    title: string;
    subtitle?: string;
    valid: boolean;
    body: React.ReactNode;
  }[] = useMemo(
    () => [
      {
        title: "First — who are we talking to?",
        subtitle: "So we can review your application personally.",
        valid:
          app.firstName.trim().length > 1 &&
          app.lastName.trim().length > 1 &&
          emailValid &&
          app.phone.trim().length >= 6,
        body: (
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="First name" value={app.firstName} onChange={(v) => set("firstName", v)} autoFocus />
            <TextField label="Last name" value={app.lastName} onChange={(v) => set("lastName", v)} />
            <TextField label="Email" type="email" value={app.email} onChange={(v) => set("email", v)} />
            <TextField label="Phone (incl. country code)" type="tel" value={app.phone} onChange={(v) => set("phone", v)} />
          </div>
        ),
      },
      {
        title: "Which best describes your business?",
        valid: app.role !== "",
        body: (
          <ChoiceGrid options={ROLE_OPTIONS} value={app.role} onSelect={(v) => set("role", v as Application["role"])} />
        ),
      },
      {
        title: "What's your current monthly revenue?",
        subtitle: "Be honest — this decides whether the DFY system fits your stage, not whether we like you.",
        valid: app.revenue !== "",
        body: (
          <ChoiceGrid options={REVENUE_OPTIONS} value={app.revenue} onSelect={(v) => set("revenue", v as Application["revenue"])} />
        ),
      },
      {
        title: "What's the #1 thing holding your growth back?",
        valid: app.bottleneck !== "",
        body: (
          <ChoiceGrid options={BOTTLENECK_OPTIONS} value={app.bottleneck} onSelect={(v) => set("bottleneck", v as Application["bottleneck"])} />
        ),
      },
      {
        title: "If we work together, where do you want revenue to be in 6 months?",
        valid: app.goal.trim().length > 0,
        body: (
          <TextField
            label="Your 6-month monthly revenue goal (e.g. $25k/month)"
            value={app.goal}
            onChange={(v) => set("goal", v)}
            autoFocus
          />
        ),
      },
      {
        title: "This is a done-for-you service, not a course. If accepted, are you in a position to invest in your growth?",
        valid: app.readyToInvest !== "",
        body: (
          <ChoiceGrid options={INVEST_OPTIONS} value={app.readyToInvest} onSelect={(v) => set("readyToInvest", v as Application["readyToInvest"])} />
        ),
      },
      {
        title: "Last one — how soon do you want to start?",
        valid: app.startTimeline !== "",
        body: (
          <div className="space-y-6">
            <ChoiceGrid options={TIMELINE_OPTIONS} value={app.startTimeline} onSelect={(v) => set("startTimeline", v as Application["startTimeline"])} />
            <TextField
              label="Anything you'd like us to know before your review? (optional)"
              value={app.notes}
              onChange={(v) => set("notes", v)}
              textarea
            />
          </div>
        ),
      },
    ],
    [app, emailValid]
  );

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = Math.round(((step + 1) / steps.length) * 100);

  const next = () => {
    setTouched(true);
    if (!current.valid) return;
    setTouched(false);
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    const qualified = isQualified(app);
    saveApplication(app, qualified);
    submitToWebhook(app, qualified);
    track("Lead", { content_name: "dfy-application" });
    trackCustom(qualified ? "ApplicationQualified" : "ApplicationNotQualified");
    navigate(qualified ? "/qualified" : "/not-a-fit");
  };

  return (
    <FunnelShell>
      <Section className="max-w-2xl pt-16">
        <div className="mb-8 text-center">
          <Eyebrow>{CONFIG.brand.name} · DFY Application</Eyebrow>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
          <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">{current.title}</h1>
          {current.subtitle && <p className="mt-2 text-slate-400">{current.subtitle}</p>}
          <div className="mt-8">{current.body}</div>

          {touched && !current.valid && (
            <p className="mt-4 text-sm text-rose-400">
              Please complete this step before continuing.
            </p>
          )}

          <div className="mt-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => step > 0 && setStep(step - 1)}
              className={`inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white ${step === 0 ? "invisible" : ""}`}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              {isLast ? "Submit Application" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <Lock className="h-3.5 w-3.5" />
          Your answers are private and only used to review your application.
        </p>
      </Section>
    </FunnelShell>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  autoFocus,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoFocus?: boolean;
  textarea?: boolean;
}) {
  const cls =
    "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none transition focus:border-emerald-400/60 focus:bg-white/[0.08]";
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">{label}</span>
      {textarea ? (
        <textarea className={`${cls} min-h-24 resize-y`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          className={cls}
          type={type}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function ChoiceGrid({
  options,
  value,
  onSelect,
}: {
  options: ChoiceOption[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`rounded-xl border px-5 py-4 text-left transition ${
              active
                ? "border-emerald-400 bg-emerald-400/10"
                : "border-white/15 bg-white/5 hover:border-white/30"
            }`}
          >
            <span className={`block font-semibold ${active ? "text-emerald-300" : "text-white"}`}>
              {opt.label}
            </span>
            {opt.hint && <span className="mt-0.5 block text-sm text-slate-500">{opt.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}
