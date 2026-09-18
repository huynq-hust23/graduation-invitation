import { EVENT, type Lang } from "./content";

export const startDate = new Date(EVENT.startsAt);
export const endDate = new Date(startDate.getTime() + EVENT.durationMinutes * 60_000);

const LOCALE: Record<Lang, string> = { vi: "vi-VN", en: "en-GB" };

export function formatWeekday(lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], { weekday: "long" }).format(startDate);
}

export function formatLongDate(lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(startDate);
}

export function formatTime(lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(startDate);
}

/** Compact form for the pass and the dock, e.g. "21.11.2026". */
export function formatStamp() {
  const d = String(startDate.getDate()).padStart(2, "0");
  const m = String(startDate.getMonth() + 1).padStart(2, "0");
  return `${d}.${m}.${startDate.getFullYear()}`;
}

/** Three-letter month for the boarding pass, always Latin. */
export function formatPassDate() {
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" })
    .format(startDate)
    .slice(0, 3) // en-GB viết "Sept" — vé máy bay luôn dùng 3 chữ.
    .toUpperCase();
  return `${String(startDate.getDate()).padStart(2, "0")} ${month} ${startDate.getFullYear()}`;
}

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  EVENT.venue.mapsQuery,
)}`;

export const mapsEmbedUrl = `https://maps.google.com/maps?q=${EVENT.venue.lat},${EVENT.venue.lng}&z=16&output=embed`;

function toCalStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Link that opens Google Calendar with the event pre-filled — one click to save, no backend. */
export function googleCalendarUrl(title: string, details: string, location: string) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toCalStamp(startDate)}/${toCalStamp(endDate)}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
