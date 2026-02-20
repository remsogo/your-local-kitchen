export const RESTAURANT_COORDINATES = {
  lat: 48.575896,
  lng: 1.878415,
};
export const DELIVERY_MAX_KM = 15;
export const DELIVERY_RADIUS_METERS = DELIVERY_MAX_KM * 1000;
const OSRM_ROUTE_API_URL = "https://router.project-osrm.org";

const EARTH_RADIUS_KM = 6371;

const DELIVERY_BANDS = [
  { maxKm: 5, minOrderEur: 20, feeEur: 1.5 },
  { maxKm: 10, minOrderEur: 25, feeEur: 2 },
  { maxKm: 15, minOrderEur: 30, feeEur: 2.5 },
] as const;

const toRadians = (deg: number) => (deg * Math.PI) / 180;

export const computeDistanceKm = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): number => {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
};

export type DeliveryEstimate = {
  eligible: boolean;
  distanceKm: number;
  minOrderEur: number | null;
  feeEur: number | null;
  bandLabel: string;
};

export const estimateDelivery = (distanceKm: number): DeliveryEstimate => {
  const roundedDistance = Number(distanceKm.toFixed(1));
  const band = DELIVERY_BANDS.find((item) => roundedDistance <= item.maxKm);
  if (!band) {
    return {
      eligible: false,
      distanceKm: roundedDistance,
      minOrderEur: null,
      feeEur: null,
      bandLabel: `> ${DELIVERY_MAX_KM} km`,
    };
  }

  const bandMin = band.maxKm === 5 ? 0 : band.maxKm - 5;
  return {
    eligible: true,
    distanceKm: roundedDistance,
    minOrderEur: band.minOrderEur,
    feeEur: band.feeEur,
    bandLabel: `${bandMin}-${band.maxKm} km`,
  };
};

export type GeocodingMatch = {
  displayName: string;
  lat: number;
  lng: number;
};

export type DeliveryDistanceSource = "road" | "air";

export type DeliveryDistance = {
  distanceKm: number;
  source: DeliveryDistanceSource;
};

export const geocodeAddress = async (query: string): Promise<GeocodingMatch | null> => {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const search = new URLSearchParams({
    format: "jsonv2",
    q: trimmed,
    countrycodes: "fr",
    limit: "1",
    addressdetails: "0",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${search.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Geocoding failed");
  }

  const data = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  if (!data.length) return null;

  return {
    displayName: data[0].display_name,
    lat: Number(data[0].lat),
    lng: Number(data[0].lon),
  };
};

export const computeRouteDistanceKm = async (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Promise<number | null> => {
  const search = new URLSearchParams({
    alternatives: "true",
    overview: "false",
    steps: "false",
  });
  const route = `${from.lng},${from.lat};${to.lng},${to.lat}`;

  try {
    const response = await fetch(`${OSRM_ROUTE_API_URL}/route/v1/driving/${route}?${search.toString()}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      code?: string;
      routes?: Array<{ distance?: number }>;
    };
    if (data.code !== "Ok" || !Array.isArray(data.routes) || data.routes.length === 0) {
      return null;
    }

    const validRouteDistances = data.routes
      .map((routeInfo) => routeInfo.distance)
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

    if (!validRouteDistances.length) return null;

    return Math.min(...validRouteDistances) / 1000;
  } catch {
    return null;
  }
};

export const computeDeliveryDistance = async (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Promise<DeliveryDistance> => {
  const routeDistanceKm = await computeRouteDistanceKm(from, to);
  if (routeDistanceKm !== null) {
    return {
      distanceKm: routeDistanceKm,
      source: "road",
    };
  }

  return {
    distanceKm: computeDistanceKm(from, to),
    source: "air",
  };
};
