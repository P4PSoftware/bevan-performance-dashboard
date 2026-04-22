import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import { Separator } from "./components/ui/separator";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  Sparkles,
  Orbit,
  SlidersHorizontal,
  Lightbulb,
  Layers3,
  Info,
  Users,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

const num = (v: string | number) => {
  const n = parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const parsePct = (v: string | number) => {
  const cleaned = String(v).replace(/%/g, "").trim();
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n / 100 : 0;
};
const ceilSafe = (n: number) => (Number.isFinite(n) ? Math.ceil(n) : 0);

const DEFAULTS = {
  programPrice: 1560,
  monthlyRetainer: 3380,
  monthlyAdSpend: 1329.16,
  showRate: "90",
  closeRateQualified: "61.1",
  costPerBookedCall: "66.46",
  grossRevenueGoal: 30000,
  netProfitGoal: 20000,
  standardSales: 15,
  stretchSales: 20,
  audToNzdMultiplier: "1.213",
  usdToNzdMultiplier: "1.693",
};

function Glow({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />;
}

function HelpTip({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex items-center overflow-visible">
      <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
      <div className="pointer-events-none absolute bottom-full left-1/2 z-[80] mb-2 hidden w-64 -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/95 p-3 text-xs leading-5 text-slate-200 shadow-2xl group-hover:block group-focus-within:block">
        {text}
      </div>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
  iconClassName = "text-cyan-300",
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {Icon ? <Icon className={`h-5 w-5 ${iconClassName}`} /> : null}
      <span className="text-[1.05rem] font-semibold tracking-tight text-white">
        {children}
      </span>
    </div>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "violet",
  helpText,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "emerald" | "cyan" | "amber" | "rose" | "violet";
  helpText?: string;
}) {
  const tones = {
    emerald: "border-emerald-400/30 bg-emerald-500/10",
    cyan: "border-cyan-400/30 bg-cyan-500/10",
    amber: "border-amber-400/30 bg-amber-500/10",
    rose: "border-rose-400/30 bg-rose-500/10",
    violet: "border-violet-400/30 bg-violet-500/10",
  };

  const iconTones = {
    emerald: "bg-emerald-600",
    cyan: "bg-cyan-600",
    amber: "bg-amber-600",
    rose: "bg-rose-600",
    violet: "bg-violet-600",
  };

  return (
    <Card className={`rounded-3xl border backdrop-blur-xl shadow-[0_14px_50px_rgba(15,23,42,0.14)] overflow-visible relative ${tones[tone]}`}>
      <CardContent className="p-5 relative overflow-visible">
        <div className="pr-14">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-5 text-white">{title}</p>
            {helpText ? (
              <div className="absolute top-4 right-4">
                <HelpTip text={helpText} />
              </div>
            ) : null}
          </div>
          <p className="text-lg md:text-xl xl:text-2xl font-semibold tracking-tight tabular-nums text-white font-bold mt-2 leading-tight whitespace-nowrap">
            {value}
          </p>
          {subtitle ? <p className="text-sm leading-6 text-slate-200 mt-2">{subtitle}</p> : null}
        </div>
      </CardContent>

      <div className={`absolute bottom-4 right-4 z-20 h-10 w-10 rounded-xl text-white flex items-center justify-center shadow-lg ${iconTones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
    </Card>
  );
}

function InputField({
  label,
  value,
  onChange,
  hint,
  helpText,
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  helpText?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-slate-200">{label}</Label>
        {helpText ? <HelpTip text={helpText} /> : null}
      </div>
      <Input value={value} onChange={onChange} className="rounded-2xl bg-white/10 border-white/10 text-white placeholder:text-slate-400" />
      {hint ? <p className="text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export default function BevanMonthlyEconomicsDashboard() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const update = (key: string, value: string | number) => setInputs((p) => ({ ...p, [key]: value }));

  const metrics = useMemo(() => {
    const programPrice = num(inputs.programPrice);
    const monthlyRetainer = num(inputs.monthlyRetainer);
    const monthlyAdSpend = num(inputs.monthlyAdSpend);
    const showRate = Math.min(Math.max(parsePct(inputs.showRate), 0), 1);
    const closeRateQualified = Math.min(Math.max(parsePct(inputs.closeRateQualified), 0), 1);
    const costPerBookedCall = Math.max(num(inputs.costPerBookedCall), 1);
    const grossRevenueGoal = Math.max(0, num(inputs.grossRevenueGoal));
    const netProfitGoal = Math.max(0, num(inputs.netProfitGoal));
    const standardSales = Math.max(0, num(inputs.standardSales));
    const stretchSales = Math.max(0, num(inputs.stretchSales));
    const audToNzdMultiplier = Math.max(1, num(inputs.audToNzdMultiplier));
    const usdToNzdMultiplier = Math.max(1, num(inputs.usdToNzdMultiplier));

    const bookedCalls = monthlyAdSpend / costPerBookedCall;
    const qualifiedCalls = bookedCalls * showRate;
    const sales = qualifiedCalls * closeRateQualified;
    const closeRateBooked = bookedCalls > 0 ? sales / bookedCalls : 0;
    const costPerQualifiedCall = qualifiedCalls > 0 ? monthlyAdSpend / qualifiedCalls : 0;
    const costPerSale = sales > 0 ? monthlyAdSpend / sales : 0;

    const revenue = sales * programPrice;
    const totalSpend = monthlyAdSpend + monthlyRetainer;
    const netProfit = revenue - totalSpend;
    const roas = monthlyAdSpend > 0 ? revenue / monthlyAdSpend : 0;
    const roi = totalSpend > 0 ? revenue / totalSpend : 0;

    const breakEvenSales = programPrice > 0 ? totalSpend / programPrice : 0;
    const salesNeededForGrossGoal = programPrice > 0 ? grossRevenueGoal / programPrice : 0;
    const salesNeededForNetGoal = programPrice > 0 ? (netProfitGoal + totalSpend) / programPrice : 0;
    const bookedCallsNeededForGrossGoal = closeRateBooked > 0 ? salesNeededForGrossGoal / closeRateBooked : 0;
    const bookedCallsNeededForNetGoal = closeRateBooked > 0 ? salesNeededForNetGoal / closeRateBooked : 0;

    return {
      programPrice,
      monthlyRetainer,
      monthlyAdSpend,
      showRate,
      closeRateQualified,
      closeRateBooked,
      costPerBookedCall,
      costPerQualifiedCall,
      costPerSale,
      bookedCalls,
      qualifiedCalls,
      sales,
      revenue,
      totalSpend,
      netProfit,
      roas,
      roi,
      breakEvenSales,
      grossRevenueGoal,
      netProfitGoal,
      salesNeededForGrossGoal,
      salesNeededForNetGoal,
      bookedCallsNeededForGrossGoal,
      bookedCallsNeededForNetGoal,
      standardSales,
      stretchSales,
      audToNzdMultiplier,
      usdToNzdMultiplier,
    };
  }, [inputs]);

  const scenarioRows = useMemo(() => {
    const targets = [
      { label: "Current", sales: metrics.sales },
      { label: "Standard", sales: metrics.standardSales || 15 },
      { label: "Stretch", sales: metrics.stretchSales || 20 },
    ];

    return targets.map((t) => {
      const sales = Math.max(0, t.sales);
      const bookedCalls = metrics.closeRateBooked > 0 ? sales / metrics.closeRateBooked : 0;
      const qualifiedCalls = bookedCalls * metrics.showRate;
      const adSpend = bookedCalls * metrics.costPerBookedCall;
      const revenue = sales * metrics.programPrice;
      const totalSpend = adSpend + metrics.monthlyRetainer;
      const netProfit = revenue - totalSpend;
      const roas = adSpend > 0 ? revenue / adSpend : 0;
      return {
        scenario: t.label,
        sales: Math.round(sales),
        bookedCalls: ceilSafe(bookedCalls),
        qualifiedCalls: ceilSafe(qualifiedCalls),
        adSpend,
        revenue,
        totalSpend,
        netProfit,
        roas,
      };
    });
  }, [metrics]);

  const ladder = useMemo(() => {
    const baseSpend = Math.max(metrics.monthlyAdSpend, 1);
    const cac = Math.max(metrics.costPerSale, 1);

    return [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3].map((multiplier) => {
      const adSpend = baseSpend * multiplier;
      const sales = adSpend / cac;
      const revenue = sales * metrics.programPrice;
      const totalSpend = adSpend + metrics.monthlyRetainer;
      const netProfit = revenue - totalSpend;
      return {
        multiplierLabel: `${multiplier.toFixed(multiplier % 1 === 0 ? 0 : 2)}x`,
        adSpend,
        sales,
        revenue,
        netProfit,
      };
    });
  }, [metrics]);

  const targetSummary = useMemo(() => {
    return {
      grossGoalSales: ceilSafe(metrics.salesNeededForGrossGoal),
      netGoalSales: ceilSafe(metrics.salesNeededForNetGoal),
      grossGoalCalls: ceilSafe(metrics.bookedCallsNeededForGrossGoal),
      netGoalCalls: ceilSafe(metrics.bookedCallsNeededForNetGoal),
    };
  }, [metrics]);

  const leverageRows = useMemo(() => {
    return scenarioRows.map((row) => {
      const auRevenue = row.sales * metrics.programPrice * metrics.audToNzdMultiplier;
      const usRevenue = row.sales * metrics.programPrice * metrics.usdToNzdMultiplier;
      const auNetProfit = auRevenue - row.totalSpend;
      const usNetProfit = usRevenue - row.totalSpend;

      return {
        scenario: row.scenario,
        sales: row.sales,
        baseRevenue: row.revenue,
        baseProfit: row.netProfit,
        retainerShare: row.revenue > 0 ? metrics.monthlyRetainer / row.revenue : 0,
        adShare: row.revenue > 0 ? row.adSpend / row.revenue : 0,
        totalShare: row.revenue > 0 ? row.totalSpend / row.revenue : 0,
        auRevenue,
        usRevenue,
        auRevenueUpliftPct: row.revenue > 0 ? auRevenue / row.revenue - 1 : 0,
        usRevenueUpliftPct: row.revenue > 0 ? usRevenue / row.revenue - 1 : 0,
        auProfitLift: auNetProfit - row.netProfit,
        usProfitLift: usNetProfit - row.netProfit,
      };
    });
  }, [scenarioRows, metrics]);

  const strategicInsight = useMemo(() => {
    if (metrics.netProfit > 0 && metrics.roas >= 8) {
      return {
        title: "Healthy Base Economics",
        body: "The current model is already profitable and the ad efficiency is strong. The next upside comes from scaling volume and improving throughput, not rebuilding the model from scratch.",
      };
    }
    if (metrics.netProfit > 0 && metrics.roas >= 5) {
      return {
        title: "Profitable with Room to Optimise",
        body: "The model is working, but there is still leverage in improving call economics and volume. This is the stage where better structure and deliberate optimisation matter most.",
      };
    }
    return {
      title: "Refinement Needed",
      body: "This scenario still needs tighter economics. The clearest levers are lowering booked-call cost, improving show rate, or improving close rate before scaling harder.",
    };
  }, [metrics.netProfit, metrics.roas]);

  const scaleOutlook = useMemo(() => {
    if (metrics.roas >= 10) {
      return "At the current economics, the model can tolerate a meaningful drop in ROAS and still remain commercially attractive, which creates room to test broader audiences and a lower-touch sales process.";
    }
    if (metrics.roas >= 6) {
      return "The current numbers suggest the model still has room to absorb some efficiency loss during expansion. That matters when shifting from a local sales-call model toward a broader online funnel.";
    }
    return "This scenario has less margin for conversion slippage, so the next phase would require more careful funnel design before moving into lower-touch sales.";
  }, [metrics.roas]);

  const kpiTones = useMemo(() => {
    return {
      revenueTone: metrics.revenue > 0 ? "emerald" : "rose",
      profitTone: metrics.netProfit > 0 ? "emerald" : "rose",
      roasTone: metrics.roas >= 8 ? "emerald" : metrics.roas >= 5 ? "amber" : "rose",
      breakEvenTone: metrics.sales >= Math.ceil(metrics.breakEvenSales) ? "cyan" : "amber",
    } as const;
  }, [metrics]);

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <Glow className="h-80 w-80 bg-violet-500 top-[-60px] left-[-40px]" />
      <Glow className="h-[28rem] w-[28rem] bg-cyan-500 top-[18rem] right-[-120px]" />
      <Glow className="h-72 w-72 bg-fuchsia-500 bottom-[-40px] left-[20%]" />

      <div className="max-w-7xl mx-auto p-6 md:p-8 relative z-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Badge className="rounded-full px-3 py-1 bg-white/10 text-white border border-white/10 hover:bg-white/10">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Monthly Economics Model
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 border-cyan-400/30 text-cyan-200 bg-cyan-400/10">
                One Unified Assumption Set
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mt-4 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
              Fitness Rebirth Growth Calculator
            </h1>
            <p className="text-slate-300 mt-3 max-w-3xl text-base md:text-lg">
              A live monthly planning dashboard with one unified set of assumptions. Change the funnel inputs once and every table, KPI, and chart updates automatically.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <KpiCard
              title="Monthly Revenue"
              value={fmt(metrics.revenue)}
              subtitle={`${metrics.sales.toFixed(1)} projected sales at ${fmt(metrics.programPrice)}`}
              icon={DollarSign}
              tone={kpiTones.revenueTone}
              helpText="This is the monthly top-line revenue generated from the current unified assumptions."
            />
            <KpiCard
              title="Monthly Net Profit"
              value={fmt(metrics.netProfit)}
              subtitle={`After ${fmt(metrics.monthlyAdSpend)} ads + ${fmt(metrics.monthlyRetainer)} retainer`}
              icon={TrendingUp}
              tone={kpiTones.profitTone}
              helpText="This is the estimated monthly profit after ad spend and the fixed retainer are deducted."
            />
            <KpiCard
              title="ROAS"
              value={`${metrics.roas.toFixed(2)}x`}
              subtitle="Based on the active funnel assumptions"
              icon={BarChart3}
              tone={kpiTones.roasTone}
              helpText="Return on ad spend. This compares projected revenue to ad spend only, not total costs."
            />
            <KpiCard
              title="Client Acquisition Cost"
              value={fmt(metrics.costPerSale)}
              subtitle="Average ad spend needed to acquire one client"
              icon={Users}
              tone="cyan"
              helpText="This is the estimated ad cost to acquire one paying client based on the current funnel assumptions."
            />
            <KpiCard
              title="Break-Even Sales"
              value={`${metrics.breakEvenSales.toFixed(1)}`}
              subtitle={`≈ ${ceilSafe(metrics.breakEvenSales)} sales/month`}
              icon={Target}
              tone={kpiTones.breakEvenTone}
              helpText="The number of sales needed to cover monthly ad spend plus retainer."
            />
          </div>

          <div className="grid lg:grid-cols-[410px_1fr] gap-6 items-start">
            <Card className="rounded-[28px] border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden lg:sticky lg:top-6">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />
              <CardHeader className="relative z-10">
                <CardTitle>
                  <SectionTitle icon={SlidersHorizontal}>Inputs & Assumptions</SectionTitle>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Commercial Inputs</p>
                  <InputField
                    label="Program Price (NZD)"
                    value={inputs.programPrice}
                    onChange={(e) => update("programPrice", e.target.value)}
                    helpText="The price paid per client for the current offer."
                  />
                  <InputField
                    label="Monthly Retainer (NZD)"
                    value={inputs.monthlyRetainer}
                    onChange={(e) => update("monthlyRetainer", e.target.value)}
                    helpText="Your fixed monthly management fee expressed in NZD."
                  />
                  <InputField
                    label="Monthly Ad Spend (NZD)"
                    value={inputs.monthlyAdSpend}
                    onChange={(e) => update("monthlyAdSpend", e.target.value)}
                    helpText="The amount spent on ads in a typical month. This drives the implied volume of calls and sales."
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Funnel Assumptions</p>
                  <InputField
                    label="Show Rate (%)"
                    value={inputs.showRate}
                    onChange={(e) => update("showRate", e.target.value)}
                    helpText="Of all booked calls generated, what percentage actually attend and qualify?"
                  />
                  <InputField
                    label="Close Rate from Qualified Calls (%)"
                    value={inputs.closeRateQualified}
                    onChange={(e) => update("closeRateQualified", e.target.value)}
                    helpText="Of the qualified calls, what percentage become paying clients?"
                  />
                  <InputField
                    label="Cost per Booked Call (NZD)"
                    value={inputs.costPerBookedCall}
                    onChange={(e) => update("costPerBookedCall", e.target.value)}
                    helpText="How much ad spend is needed, on average, to generate one booked call?"
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Targets</p>
                  <InputField
                    label="Gross Revenue Goal (NZD)"
                    value={inputs.grossRevenueGoal}
                    onChange={(e) => update("grossRevenueGoal", e.target.value)}
                    helpText="The top-line revenue target you want the model to reach."
                  />
                  <InputField
                    label="Net Profit Goal (NZD)"
                    value={inputs.netProfitGoal}
                    onChange={(e) => update("netProfitGoal", e.target.value)}
                    helpText="The take-home profit target after ad spend and retainer."
                  />
                  <InputField
                    label="Standard Sales Target"
                    value={inputs.standardSales}
                    onChange={(e) => update("standardSales", e.target.value)}
                    helpText="Your realistic target scenario."
                  />
                  <InputField
                    label="Stretch Sales Target"
                    value={inputs.stretchSales}
                    onChange={(e) => update("stretchSales", e.target.value)}
                    helpText="Your more ambitious scenario for planning."
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Currency Uplift Assumptions</p>
                  <InputField
                    label="AUD to NZD Multiplier"
                    value={inputs.audToNzdMultiplier}
                    onChange={(e) => update("audToNzdMultiplier", e.target.value)}
                    hint="Used to model same nominal weekly price charged in Australia."
                    helpText="This models the uplift from charging the same nominal price in Australia."
                  />
                  <InputField
                    label="USD to NZD Multiplier"
                    value={inputs.usdToNzdMultiplier}
                    onChange={(e) => update("usdToNzdMultiplier", e.target.value)}
                    hint="Used to model same nominal weekly price charged in the US."
                    helpText="This models the uplift from charging the same nominal price in the United States."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[28px] border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
                <CardHeader>
                  <CardTitle>
                    <SectionTitle icon={Lightbulb} iconClassName="text-amber-300">
                      Strategic Insight
                    </SectionTitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="rounded-3xl bg-white/5 p-6 border border-white/10">
                    <div className="grid md:grid-cols-[1.2fr_1fr] gap-5 items-start">
                      <div>
                        <p className="text-slate-400">Current Read</p>
                        <p className="text-2xl font-semibold mt-2 text-white">{strategicInsight.title}</p>
                        <p className="text-slate-300 mt-3 leading-7 max-w-3xl">{strategicInsight.body}</p>
                      </div>
                      <div className="rounded-2xl bg-cyan-400/10 border border-cyan-400/20 p-5">
                        <p className="text-cyan-200 text-xs uppercase tracking-[0.18em]">Scale Outlook</p>
                        <p className="text-slate-200 mt-2 leading-6">{scaleOutlook}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
                <CardHeader>
                  <CardTitle>
                    <SectionTitle icon={Orbit} iconClassName="text-violet-200">
                      90-Day Growth Roadmap
                    </SectionTitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-sm">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-3xl bg-black/20 p-5 border border-white/10">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-violet-200 font-medium">Phase 1</p>
                        <Badge className="bg-violet-400/10 text-violet-100 border border-violet-400/20 hover:bg-violet-400/10">Proof of Concept</Badge>
                      </div>
                      <ul className="mt-4 space-y-2 text-slate-300 leading-6">
                        <li>• Offer + funnel validated locally</li>
                        <li>• Ads producing qualified leads</li>
                        <li>• Strong show + close rates established</li>
                      </ul>
                    </div>

                    <div className="rounded-3xl bg-black/20 p-5 border border-cyan-400/20">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-cyan-200 font-medium">Next 90 Days</p>
                        <Badge className="bg-cyan-400/10 text-cyan-100 border border-cyan-400/20 hover:bg-cyan-400/10">Sprint</Badge>
                      </div>
                      <ul className="mt-4 space-y-2 text-slate-300 leading-6">
                        <li>• Reduce reliance on sales calls</li>
                        <li>• Rebuild funnel for direct checkout</li>
                        <li>• Build objection-handling ad ecosystem</li>
                        <li>• Make lower-touch sales viable at scale</li>
                      </ul>
                    </div>

                    <div className="rounded-3xl bg-black/20 p-5 border border-emerald-400/20">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-emerald-200 font-medium">After That</p>
                        <Badge className="bg-emerald-400/10 text-emerald-100 border border-emerald-400/20 hover:bg-emerald-400/10">Expansion</Badge>
                      </div>
                      <ul className="mt-4 space-y-2 text-slate-300 leading-6">
                        <li>• Move to online delivery model</li>
                        <li>• Trial Australia first</li>
                        <li>• Then test US economics</li>
                        <li>• Increase margin without more delivery load</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-white">Scenario Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 rounded-2xl bg-white/5 border border-white/10 p-4 text-sm text-slate-200">
                    <p className="font-medium text-white">How to read this table</p>
                    <p className="mt-2 leading-6 text-slate-300">
                      <span className="font-medium text-white">Current</span> is based on the live monthly ad spend and active funnel assumptions.{" "}
                      <span className="font-medium text-white">Standard</span> and{" "}
                      <span className="font-medium text-white">Stretch</span> are target-sales scenarios that calculate the ad spend required to reach those sales volumes at the current conversion assumptions.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-white">
                      <thead>
                        <tr className="text-left border-b border-white/10 text-slate-300">
                          <th className="py-3 pr-4">Scenario</th>
                          <th className="py-3 pr-4">Sales</th>
                          <th className="py-3 pr-4">Booked Calls</th>
                          <th className="py-3 pr-4">Qualified Calls</th>
                          <th className="py-3 pr-4">Revenue</th>
                          <th className="py-3 pr-4">Ad Spend</th>
                          <th className="py-3 pr-4">Total Spend</th>
                          <th className="py-3 pr-4">Net Profit</th>
                          <th className="py-3">ROAS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenarioRows.map((row) => (
                          <tr key={row.scenario} className="border-b border-white/5 text-slate-100">
                            <td className="py-3 pr-4 font-medium">{row.scenario}</td>
                            <td className="py-3 pr-4">{row.sales}</td>
                            <td className="py-3 pr-4">{row.bookedCalls}</td>
                            <td className="py-3 pr-4">{row.qualifiedCalls}</td>
                            <td className="py-3 pr-4">{fmt(row.revenue)}</td>
                            <td className="py-3 pr-4">{fmt(row.adSpend)}</td>
                            <td className="py-3 pr-4">{fmt(row.totalSpend)}</td>
                            <td className="py-3 pr-4 font-medium text-cyan-300">{fmt(row.netProfit)}</td>
                            <td className="py-3">{row.roas.toFixed(2)}x</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid xl:grid-cols-3 gap-6">
                <Card className="rounded-[28px] border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] xl:col-span-2 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white">Ad Spend Profit Ladder</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[340px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ladder}>
                        <defs>
                          <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="multiplierLabel" stroke="rgba(255,255,255,0.55)" />
                        <YAxis stroke="rgba(255,255,255,0.55)" />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(15,23,42,0.92)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 16,
                            color: "white",
                          }}
                          formatter={(value) => fmt(value as number)}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" fill="url(#revenueFill)" strokeWidth={3} />
                        <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#06b6d4" fill="url(#profitFill)" strokeWidth={3} />
                        <Area type="monotone" dataKey="adSpend" name="Ad Spend" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 p-4 text-sm">
                      <p className="text-amber-200 font-medium">Why This Matters</p>
                      <p className="text-slate-200 mt-2 leading-6">
                        This chart scales off ad spend using the current client acquisition cost. Increase ad spend and the model estimates how many additional clients, revenue, and profit that spend can generate while the retainer stays fixed.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-[28px] border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-white">Goal Mapper</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-slate-200">
                    <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                      <p className="text-slate-400">To Hit Gross Revenue Goal</p>
                      <p className="text-2xl font-semibold mt-1">{targetSummary.grossGoalSales} sales</p>
                      <p className="text-slate-400 mt-2">Approx. {targetSummary.grossGoalCalls} booked calls needed</p>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                      <p className="text-slate-400">To Hit Net Profit Goal</p>
                      <p className="text-2xl font-semibold mt-1">{targetSummary.netGoalSales} sales</p>
                      <p className="text-slate-400 mt-2">Approx. {targetSummary.netGoalCalls} booked calls needed</p>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                      <p className="text-slate-400">Live Funnel Metrics</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between"><span className="text-slate-400">Booked Calls</span><span>{metrics.bookedCalls.toFixed(1)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Qualified Calls</span><span>{metrics.qualifiedCalls.toFixed(1)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Show Rate</span><span>{pct(metrics.showRate)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Close Rate (Qualified)</span><span>{pct(metrics.closeRateQualified)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Close Rate (Booked)</span><span>{pct(metrics.closeRateBooked)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Cost per Sale</span><span>{fmt(metrics.costPerSale)}</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="rounded-[28px] border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
                <CardHeader>
                  <CardTitle>
                    <SectionTitle icon={Layers3} iconClassName="text-violet-300">
                      Fixed-Cost Leverage & Market Uplift
                    </SectionTitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-200">
                  {leverageRows.map((row) => (
                    <div key={row.scenario} className="rounded-3xl bg-white/5 p-5 border border-white/10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <p className="text-white font-medium text-base">{row.scenario}</p>
                          <p className="text-slate-400 mt-1">{row.sales} sales scenario</p>
                        </div>
                        <Badge className="bg-white/10 text-slate-200 border border-white/10 hover:bg-white/10">
                          Retainer Share {pct(row.retainerShare)}
                        </Badge>
                      </div>

                      <div className="mt-4 grid md:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-black/20 p-4 border border-white/5">
                          <p className="text-slate-400">Base NZ Revenue</p>
                          <p className="text-xl font-semibold mt-1 text-white">{fmt(row.baseRevenue)}</p>
                          <p className="text-slate-400 mt-2">Base net profit {fmt(row.baseProfit)}</p>
                          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full bg-violet-400" style={{ width: "100%" }} />
                          </div>
                        </div>

                        <div className="rounded-2xl bg-black/20 p-4 border border-white/5">
                          <p className="text-slate-400">Same Sales in Australia</p>
                          <p className="text-xl font-semibold mt-1 text-white">{fmt(row.auRevenue)}</p>
                          <p className="text-emerald-300 mt-2">Revenue uplift {pct(row.auRevenueUpliftPct)}</p>
                          <p className="text-cyan-300 mt-1">Profit lift {fmt(row.auProfitLift)}</p>
                          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-cyan-400"
                              style={{
                                width: `${Math.min(100, (row.auRevenue / Math.max(row.usRevenue, row.auRevenue, row.baseRevenue, 1)) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="rounded-2xl bg-black/20 p-4 border border-white/5">
                          <p className="text-slate-400">Same Sales in the US</p>
                          <p className="text-xl font-semibold mt-1 text-white">{fmt(row.usRevenue)}</p>
                          <p className="text-emerald-300 mt-2">Revenue uplift {pct(row.usRevenueUpliftPct)}</p>
                          <p className="text-cyan-300 mt-1">Profit lift {fmt(row.usProfitLift)}</p>
                          <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-400"
                              style={{
                                width: `${Math.min(100, (row.usRevenue / Math.max(row.usRevenue, row.auRevenue, row.baseRevenue, 1)) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Ad Spend as % of Revenue</span><span>{pct(row.adShare)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Total Cost as % of Revenue</span><span>{pct(row.totalShare)}</span></div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-3xl bg-white/5 p-4 border border-white/10">
                    <p className="text-slate-400 leading-6">
                      This section shows two leverage effects at once: fixed management cost becomes a smaller percentage of revenue as volume grows, and higher-value currencies increase revenue and profit even if the delivery model and nominal weekly price stay the same.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}