export const RESTAURANT_COORDINATES = {
  lat: 48.575896,
  lng: 1.878415,
};

const EARTH_RADIUS_KM = 6371;

const DELIVERY_BANDS = [
  { maxKm: 5, minOrderEur: 20, feeEur: 1.5 },
  { maxKm: 10, minOrderEur: 25, feeEur: 2 },
  { maxKm: 15, minOrderEur: 30, feeEur: 2.5 },
  { maxKm: 20, minOrderEur: 35, feeEur: 3.5 },
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
      bandLabel: "> 20 km",
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
