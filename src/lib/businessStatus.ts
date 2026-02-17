import { Locale } from "@/lib/i18n";

const OPEN_WINDOWS = [
  { start: 10 * 60 + 30, end: 14 * 60 + 30 },
  { start: 18 * 60, end: 22 * 60 },
] as const;

const DAY_INDEX: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 0,
};

type ParisClock = {
  dayIndex: number;
  minutes: number;
  hour: number;
  minute: number;
};

const getParisClock = (date: Date): ParisClock => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const hour = Number(values.hour || "0");
  const minute = Number(values.minute || "0");
  const weekday = values.weekday || "Mon";
  return {
    dayIndex: DAY_INDEX[weekday] ?? 1,
    minutes: hour * 60 + minute,
    hour,
    minute,
  };
};

const formatTime = (minutes: number, locale: Locale): string => {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");
  if (locale === "en") return `${hour}:${minute}`;
  return `${hour}h${minute}`;
};

const getNextOpeningMinutes = (currentMinutes: number): number => {
  if (currentMinutes < OPEN_WINDOWS[0].start) return OPEN_WINDOWS[0].start;
  if (currentMinutes < OPEN_WINDOWS[1].start) return OPEN_WINDOWS[1].start;
  return OPEN_WINDOWS[0].start;
};

const getCurrentWindow = (minutes: number) => OPEN_WINDOWS.find((slot) => minutes >= slot.start && minutes < slot.end);

export type BusinessStatus = {
  isOpen: boolean;
  label: string;
  detail: string;
};

export const getBusinessStatus = (locale: Locale, now = new Date()): BusinessStatus => {
  const clock = getParisClock(now);
  const currentWindow = getCurrentWindow(clock.minutes);

  if (currentWindow) {
    if (locale === "en") {
      return {
        isOpen: true,
        label: "Open",
        detail: `Open now - closes at ${formatTime(currentWindow.end, locale)} (Paris time)`,
      };
    }
    return {
      isOpen: true,
      label: "Ouvert",
      detail: `Ouvert maintenant - fermeture a ${formatTime(currentWindow.end, locale)} (heure de Paris)`,
    };
  }

  const nextOpening = getNextOpeningMinutes(clock.minutes);
  if (locale === "en") {
    return {
      isOpen: false,
      label: "Closed",
      detail:
        clock.minutes < OPEN_WINDOWS[1].end
          ? `Currently closed - opens at ${formatTime(nextOpening, locale)} (Paris time)`
          : `Currently closed - opens tomorrow at ${formatTime(nextOpening, locale)} (Paris time)`,
    };
  }
  return {
    isOpen: false,
    label: "Ferme",
    detail:
      clock.minutes < OPEN_WINDOWS[1].end
        ? `Actuellement ferme - ouverture a ${formatTime(nextOpening, locale)} (heure de Paris)`
        : `Actuellement ferme - ouverture demain a ${formatTime(nextOpening, locale)} (heure de Paris)`,
  };
};
