import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const cloudflareBeaconToken = import.meta.env.VITE_CLOUDFLARE_BEACON_TOKEN;
if (cloudflareBeaconToken) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.setAttribute("data-cf-beacon", JSON.stringify({ token: cloudflareBeaconToken }));
  document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(<App />);
