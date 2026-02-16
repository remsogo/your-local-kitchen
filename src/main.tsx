import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const gaDebugMode = import.meta.env.VITE_GA_DEBUG_MODE === "true";
const hasValidGaId = typeof gaMeasurementId === "string" && /^G-[A-Z0-9]+$/i.test(gaMeasurementId.trim());

if (hasValidGaId) {
  const measurementId = gaMeasurementId.trim();
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // Keep the canonical gtag shape from Google snippet.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments as unknown);
  };

  window.gtag("js", new Date());
  // We send page_view manually on each route change in PageMeta.
  window.gtag("config", measurementId, { send_page_view: false, debug_mode: gaDebugMode });
  // One explicit boot event helps verify quickly in GA4 Realtime/DebugView.
  window.gtag("event", "ga_boot_check", { debug_mode: gaDebugMode, non_interaction: true });
  console.info(`[Analytics] GA4 active (${measurementId}) debug=${gaDebugMode}`);
} else {
  console.warn("[Analytics] GA4 disabled: set a valid VITE_GA_MEASUREMENT_ID (format G-XXXXXXXXXX).");
}

createRoot(document.getElementById("root")!).render(<App />);
