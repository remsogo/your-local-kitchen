import { FormEvent, useEffect, useMemo, useState } from "react";
import { Circle, CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import { Loader2, LocateFixed, Search } from "lucide-react";
import { Locale } from "@/lib/i18n";
import {
  RESTAURANT_COORDINATES,
  computeDistanceKm,
  estimateDelivery,
  geocodeAddress,
  type GeocodingMatch,
} from "@/lib/delivery";

type DeliveryCoverageMapProps = {
  locale: Locale;
};

type DeliveryCheckResult = GeocodingMatch & ReturnType<typeof estimateDelivery>;

const PRICE_FORMAT = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const MapAutoCenter = ({ point }: { point: { lat: number; lng: number } | null }) => {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.setView([point.lat, point.lng], 12, { animate: true });
    } else {
      map.setView([RESTAURANT_COORDINATES.lat, RESTAURANT_COORDINATES.lng], 11, { animate: true });
    }
  }, [map, point]);
  return null;
};

const DeliveryCoverageMap = ({ locale }: DeliveryCoverageMapProps) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeliveryCheckResult | null>(null);

  const text = useMemo(
    () =>
      locale === "fr"
        ? {
            title: "Zone de livraison interactive",
            subtitle:
              "Visualisez le rayon de 20 km et testez une adresse pour verifier l'eligibilite et les frais estimes.",
            placeholder: "Ex: 12 Rue de la Gare, Rambouillet",
            button: "Verifier une adresse",
            found: "Adresse trouvee",
            eligible: "Livraison disponible",
            notEligible: "Hors zone de livraison",
            distance: "Distance estimee",
            fee: "Frais de livraison estimes",
            minOrder: "Minimum de commande",
            errorNotFound: "Adresse introuvable. Essayez avec ville + code postal.",
            errorGeneric: "Impossible de verifier cette adresse pour le moment.",
            radiusLabel: "Rayon de livraison 20 km",
          }
        : {
            title: "Interactive delivery area map",
            subtitle:
              "See the 20 km delivery radius and check an address to estimate eligibility and delivery fees.",
            placeholder: "Example: 12 Rue de la Gare, Rambouillet",
            button: "Check address",
            found: "Address found",
            eligible: "Delivery available",
            notEligible: "Outside delivery area",
            distance: "Estimated distance",
            fee: "Estimated delivery fee",
            minOrder: "Minimum order",
            errorNotFound: "Address not found. Try city + postal code.",
            errorGeneric: "Unable to check this address right now.",
            radiusLabel: "20 km delivery radius",
          },
    [locale],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const geocoded = await geocodeAddress(address);
      if (!geocoded) {
        setResult(null);
        setError(text.errorNotFound);
        return;
      }
      const distance = computeDistanceKm(RESTAURANT_COORDINATES, geocoded);
      const estimate = estimateDelivery(distance);
      setResult({ ...geocoded, ...estimate });
    } catch (err) {
      console.error("[DeliveryCoverageMap] geocode failed", err);
      setResult(null);
      setError(text.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-shell rounded-2xl p-5 sm:p-6" aria-labelledby="delivery-map-title" data-testid="delivery-map">
      <h2 id="delivery-map-title" className="font-display text-4xl text-gradient sm:text-5xl">
        {text.title}
      </h2>
      <p className="mt-2 text-body-muted">{text.subtitle}</p>

      <div className="delivery-map mt-5">
        <MapContainer
          center={[RESTAURANT_COORDINATES.lat, RESTAURANT_COORDINATES.lng]}
          zoom={11}
          className="h-72 w-full sm:h-80"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Circle
            center={[RESTAURANT_COORDINATES.lat, RESTAURANT_COORDINATES.lng]}
            radius={20000}
            pathOptions={{ color: "#ff9800", fillColor: "#ff9800", fillOpacity: 0.12 }}
          >
            <Tooltip>{text.radiusLabel}</Tooltip>
          </Circle>
          <CircleMarker
            center={[RESTAURANT_COORDINATES.lat, RESTAURANT_COORDINATES.lng]}
            radius={8}
            pathOptions={{ color: "#ff9800", fillColor: "#ff9800", fillOpacity: 0.95 }}
          >
            <Tooltip>Pizz'Atiq - Sonchamp</Tooltip>
          </CircleMarker>
          {result && (
            <CircleMarker
              center={[result.lat, result.lng]}
              radius={7}
              pathOptions={{
                color: result.eligible ? "#22c55e" : "#ef4444",
                fillColor: result.eligible ? "#22c55e" : "#ef4444",
                fillOpacity: 0.95,
              }}
            >
              <Tooltip>{result.displayName}</Tooltip>
            </CircleMarker>
          )}
          <MapAutoCenter point={result} />
        </MapContainer>
      </div>

      <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit} data-testid="delivery-map-form">
        <label className="sr-only" htmlFor="delivery-address">
          {text.button}
        </label>
        <div className="relative flex-1">
          <LocateFixed size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            id="delivery-address"
            type="text"
            data-testid="delivery-address-input"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={text.placeholder}
            className="focus-ring w-full rounded-lg border border-border bg-card/80 py-2.5 pl-10 pr-3 text-sm text-foreground"
          />
        </div>
        <button
          type="submit"
          data-testid="delivery-address-submit"
          disabled={loading || !address.trim()}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-primary/55 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {text.button}
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg border border-destructive/45 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 rounded-xl border border-border/70 bg-card/80 p-4" data-testid="delivery-map-result">
          <p className="text-sm font-semibold text-foreground">
            {text.found}: <span className="text-primary">{result.displayName}</span>
          </p>
          <p className={`mt-2 text-sm font-semibold ${result.eligible ? "text-green-400" : "text-red-400"}`}>
            {result.eligible ? text.eligible : text.notEligible}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {text.distance}: <span className="font-semibold text-foreground">{result.distanceKm.toFixed(1)} km</span>
          </p>
          {result.eligible ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                {text.fee}: <span className="font-semibold text-foreground">{PRICE_FORMAT.format(result.feeEur || 0)}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {text.minOrder}:{" "}
                <span className="font-semibold text-foreground">{PRICE_FORMAT.format(result.minOrderEur || 0)}</span>
              </p>
            </>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default DeliveryCoverageMap;
