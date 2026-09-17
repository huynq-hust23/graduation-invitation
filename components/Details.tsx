"use client";

import { useLang } from "@/lib/i18n";
import { DETAILS, EVENT, UI } from "@/lib/content";
import { formatLongDate, formatStamp, formatTime, formatWeekday } from "@/lib/event";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import Countdown from "./Countdown";
import { PinIcon } from "./Icons";
import { Ribbon } from "./StageDecor";

export default function Details() {
  const { lang, t } = useLang();
  const [day, month, year] = formatStamp().split(".");

  return (
    <section
      id={DETAILS.id}
      className="band band--light bg-details decor-host screen px-5 sm:px-8"
    >
      <div className="decor" aria-hidden="true">
        <Ribbon className="decor__ribbon" />
        <span className="watermark right-[-2vw] bottom-[-2rem] text-[clamp(8rem,26vw,22rem)]">
          {day}.{month}
        </span>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          index={1}
          eyebrow={t(DETAILS.nav)}
          title={t(DETAILS.title)}
          lead={t(DETAILS.lead)}
        />

        <div className="grid gap-[clamp(0.75rem,2.4svh,1.75rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* Ngày giờ + địa điểm: một hàng ngang trên điện thoại, một cột trên màn rộng. */}
          <Reveal className="flex items-center gap-5 md:flex-col md:items-start md:justify-center md:gap-4">
            <div className="shrink-0">
              <p className="numeral text-[clamp(2.25rem,min(9vw,7svh),4rem)] text-[var(--band-fg)]">
                {day}.{month}
              </p>
              <p className="numeral mt-1 text-[clamp(1.1rem,min(3.5vw,3.4svh),1.75rem)] text-red">
                {year}
              </p>
            </div>

            <div className="min-w-0 border-l-2 border-[var(--band-rule)] pl-5 md:border-t-2 md:border-l-0 md:pt-4 md:pl-0">
              <p className="text-sm font-semibold text-[var(--band-fg)] sm:text-base">
                <span className="capitalize">{formatWeekday(lang)}</span> ·{" "}
                <span className="font-mono tabular-nums">{formatTime(lang)}</span>
              </p>
              <p className="mt-1.5 flex gap-2 text-sm leading-snug text-[var(--band-fg)]">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-red" />
                <span>
                  {t(EVENT.venue.name)}
                  <span className="mt-0.5 block text-[var(--band-fg-dim)] max-md:hidden">
                    {t(EVENT.venue.address)}
                  </span>
                </span>
              </p>
            </div>
          </Reveal>

          {/* Khối đỏ đặc — điểm nhấn mạnh nhất của dải sáng. */}
          <Reveal className="bg-red p-[clamp(1rem,3svh,2.25rem)] text-white">
            <p className="label mb-[clamp(0.6rem,2svh,1.5rem)] text-white/85 [@media(max-height:700px)]:hidden">
              {t(DETAILS.countdownLabel)}
            </p>
            <Countdown />
          </Reveal>
        </div>

        <ol className="mt-[clamp(1rem,3.5svh,2.5rem)] grid grid-cols-2 gap-x-4 gap-y-[clamp(0.6rem,1.8svh,1rem)] md:grid-cols-4 md:gap-6">
          {DETAILS.schedule.map((item, i) => (
            <Reveal
              as="li"
              key={item.time}
              delay={i * 70}
              className="border-t-2 border-[var(--band-rule)] pt-[clamp(0.5rem,1.6svh,1rem)]"
            >
              <span className="numeral text-[clamp(1.05rem,min(3vw,3.2svh),1.5rem)] text-red">
                {item.time}
              </span>
              <p className="mt-1 text-sm leading-snug font-semibold text-[var(--band-fg)] sm:text-base">
                {t(item.title)}
              </p>
              <p className="mt-1 text-sm leading-snug text-[var(--band-fg-dim)] max-md:hidden [@media(max-height:700px)]:hidden">
                {t(item.note)}
              </p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-[clamp(0.75rem,2.5svh,1.75rem)] flex flex-wrap items-baseline gap-x-3 gap-y-0.5 [@media(max-height:700px)]:hidden">
          <span className="label text-[var(--band-fg-dim)]">{t(DETAILS.dress.label)}</span>
          <span className="text-sm text-[var(--band-fg)] sm:text-base">{t(DETAILS.dress.value)}</span>
        </Reveal>

        <p className="sr-only">
          {t(UI.date)}: {formatLongDate(lang)} — {formatTime(lang)}
        </p>
      </div>
    </section>
  );
}
