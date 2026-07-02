import { CONFIG } from "./config";

export type Application = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "coach" | "consultant" | "agency" | "other" | "";
  revenue: "under2k" | "2to5k" | "5to10k" | "10to20k" | "over20k" | "";
  bottleneck: "leads" | "sales" | "offer" | "delivery" | "time" | "";
  goal: string;
  readyToInvest: "yes-now" | "yes-plan" | "no" | "";
  startTimeline: "asap" | "30days" | "later" | "";
  notes: string;
};

export const EMPTY_APPLICATION: Application = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  revenue: "",
  bottleneck: "",
  goal: "",
  readyToInvest: "",
  startTimeline: "",
  notes: "",
};

const STORAGE_KEY = "p4p_application";
const QUALIFIED_KEY = "p4p_qualified";

/**
 * Qualification rules for the DFY offer:
 *  - Must be a coach, consultant or agency owner.
 *  - Must be doing $5k+/month (or $2–5k AND ready to invest right now —
 *    the "rising star" exception).
 *  - Must not have ruled out investing in a done-for-you system.
 */
export function isQualified(app: Application): boolean {
  const rightBusiness = ["coach", "consultant", "agency"].includes(app.role);
  const investOpen = app.readyToInvest === "yes-now" || app.readyToInvest === "yes-plan";
  const strongRevenue = ["5to10k", "10to20k", "over20k"].includes(app.revenue);
  const risingStar = app.revenue === "2to5k" && app.readyToInvest === "yes-now";
  return rightBusiness && investOpen && (strongRevenue || risingStar);
}

export function saveApplication(app: Application, qualified: boolean) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(app));
  sessionStorage.setItem(QUALIFIED_KEY, qualified ? "1" : "0");
}

export function loadApplication(): Application | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return { ...EMPTY_APPLICATION, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function wasQualified(): boolean {
  return sessionStorage.getItem(QUALIFIED_KEY) === "1";
}

/** Fire-and-forget POST of the application to the configured webhook/CRM. */
export function submitToWebhook(app: Application, qualified: boolean) {
  if (!CONFIG.applicationWebhookUrl) return;
  fetch(CONFIG.applicationWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...app,
      qualified,
      source: "dfy-funnel",
      submittedAt: new Date().toISOString(),
      page: window.location.href,
    }),
    keepalive: true,
  }).catch(() => {
    /* never block the funnel on tracking failures */
  });
}
