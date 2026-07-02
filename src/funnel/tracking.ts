import { CONFIG } from "./config";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

let pixelLoaded = false;

/** Injects the Meta Pixel base code once, if a pixel ID is configured. */
export function initPixel() {
  if (pixelLoaded || !CONFIG.metaPixelId) return;
  pixelLoaded = true;

  const w = window as Window;
  if (!w.fbq) {
    const fbq = function (...args: unknown[]) {
      // @ts-expect-error facebook pixel queue shim
      if (fbq.callMethod) {
        // @ts-expect-error facebook pixel queue shim
        fbq.callMethod(...args);
      } else {
        fbq.queue.push(args);
      }
    } as unknown as { queue: unknown[]; loaded: boolean; version: string } & ((
      ...args: unknown[]
    ) => void);
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = "2.0";
    w.fbq = fbq;
    w._fbq = fbq;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
  w.fbq("init", CONFIG.metaPixelId);
}

export function trackPageView() {
  window.fbq?.("track", "PageView");
}

export function track(event: string, params?: Record<string, unknown>) {
  window.fbq?.("track", event, params);
}

export function trackCustom(event: string, params?: Record<string, unknown>) {
  window.fbq?.("trackCustom", event, params);
}
