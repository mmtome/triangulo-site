import { useEffect, useState } from "react";
import { getConsent } from "@/lib/analytics";

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const GTM_ID = import.meta.env.VITE_GTM_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

function loadScript(src: string, id: string, attrs: Record<string, string> = {}) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.src = src;
  s.id = id;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function initGA4() {
  if (!GA4_ID || document.getElementById("ga4-init")) return;
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`, "ga4-src");
  const init = document.createElement("script");
  init.id = "ga4-init";
  init.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${GA4_ID}', { anonymize_ip: true });
  `;
  document.head.appendChild(init);
}

function initGTM() {
  if (!GTM_ID || document.getElementById("gtm-init")) return;
  const init = document.createElement("script");
  init.id = "gtm-init";
  init.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `;
  document.head.appendChild(init);
}

function initMetaPixel() {
  if (!META_PIXEL_ID || document.getElementById("fbpx-init")) return;
  const init = document.createElement("script");
  init.id = "fbpx-init";
  init.innerHTML = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${META_PIXEL_ID}');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(init);
}

function loadAll() {
  initGTM();
  initGA4();
  initMetaPixel();
}

export function AnalyticsLoader() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getConsent() === "granted") {
      setGranted(true);
      loadAll();
    }
    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "granted") {
        setGranted(true);
        loadAll();
      }
    };
    window.addEventListener("ts:consent", onConsent);
    return () => window.removeEventListener("ts:consent", onConsent);
  }, []);

  if (!granted || !GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="gtm"
      />
    </noscript>
  );
}
