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

function toICSStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Builds an .ics file and hands it to the browser as a download. */
export function downloadICS(title: string, location: string) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//graduation-invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${startDate.getTime()}@graduation-invitation`,
    `DTSTAMP:${toICSStamp(new Date())}`,
    `DTSTART:${toICSStamp(startDate)}`,
    `DTEND:${toICSStamp(endDate)}`,
    `SUMMARY:${escapeICS(title)}`,
    `LOCATION:${escapeICS(location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICS(title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "graduation.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function escapeICS(value: string) {
  return value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}
