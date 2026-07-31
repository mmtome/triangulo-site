/**
 * Lightweight analytics layer. Safe to call even when GA4/GTM/Meta Pixel
 * are not configured (no-ops). Loaders are gated by user consent.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "ts_consent_v1";

export type ConsentState = "granted" | "denied" | null;

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  if (v === "granted" || v === "denied") return v;
  return null;
}

export function setConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("ts:consent", { detail: value }));
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // GA4 / GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  // Meta Pixel custom event (only after init)
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", name, params);
  }
}
