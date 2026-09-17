"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { EVENT, ROUTE, UI } from "@/lib/content";
import { mapsEmbedUrl, mapsUrl } from "@/lib/event";
import { playTick } from "@/lib/sfx";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { ArrowRightIcon, PhoneIcon } from "./Icons";

export default function Route() {
  const { t } = useLang();

  return (
    <section
      id={ROUTE.id}
      className="band bg-route decor-host screen px-5 pt-[max(5.75rem,14svh)] sm:px-8"
    >
      <div className="decor" aria-hidden="true">
        <div className="decor__grid" />
        <FlightPath />
      </div>

      {/* Mobile: tiêu đề → bản đồ → các bước. Màn rộng: tiêu đề và các bước bên trái,
          bản đồ chiếm trọn cột phải. */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-[clamp(0.75rem,2.4svh,1.5rem)] [grid-template-areas:'head'_'map'_'steps'] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center lg:[grid-template-areas:'head_map'_'steps_map']">
        <SectionHeader
          index={2}
          eyebrow={t(ROUTE.nav)}
          title={t(ROUTE.title)}
          lead={t(ROUTE.lead)}
          className="mb-0! [grid-area:head] lg:self-end"
        />

        <Reveal className="border-2 border-[var(--band-rule)] [grid-area:map]">
          <MapFrame title={t(EVENT.venue.name)} activateLabel={t(UI.mapActivate)} />

          <div className="flex items-center justify-between gap-3 border-t-2 border-[var(--band-rule)] bg-[var(--band-surface)] px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--band-fg)] sm:text-base">
                {t(EVENT.venue.name)}
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--band-fg-dim)] sm:text-sm">
                {t(EVENT.venue.address)}
              </p>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 bg-red px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-red-deep)] sm:px-5 sm:text-base"
            >
              {t(UI.getDirections)}
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        <div className="[grid-area:steps] lg:self-start">
          <ol className="space-y-[clamp(0.4rem,1.4svh,1rem)]">
            {ROUTE.steps.map((step, i) => (
              <Reveal
                as="li"
                key={i}
                delay={i * 90}
                className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 border-t border-[var(--band-rule)] pt-[clamp(0.4rem,1.4svh,0.9rem)]"
              >
                <span className="numeral text-lg text-red sm:text-xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--band-fg)] sm:text-base">
                    {t(step.title)}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-[var(--band-fg-dim)] max-md:hidden [@media(max-height:760px)]:hidden">
                    {t(step.note)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-[clamp(0.5rem,2svh,1.25rem)] flex flex-wrap items-center gap-x-3">
            <span className="label text-[var(--band-fg-dim)]">{t(ROUTE.helpLabel)}</span>
            <a
              href={`tel:${EVENT.contact.phone.replace(/\s/g, "")}`}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-mono text-base text-[var(--band-fg)] transition-colors hover:text-[var(--band-red)]"
            >
              <PhoneIcon className="h-4 w-4 text-red" />
              {EVENT.contact.phone}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Bản đồ chỉ nhận thao tác sau khi được bấm. Nếu không, lăn chuột hay vuốt ngang
 * qua bản đồ sẽ bị iframe nuốt mất (zoom/kéo bản đồ) và trang kẹt lại giữa chừng.
 */
function MapFrame({ title, activateLabel }: { title: string; activateLabel: string }) {
  const [active, setActive] = useState(false);

  // Cảm ứng không có "rời chuột": tắt bản đồ khi người dùng cuộn trang đi chỗ khác.
  useEffect(() => {
    if (!active) return;
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 40) setActive(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  return (
    <div
      className="group relative h-[clamp(7.5rem,21svh,13rem)] lg:h-[clamp(14rem,46svh,30rem)]"
      onMouseLeave={() => setActive(false)}
    >
      <iframe
        src={mapsEmbedUrl}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={active ? 0 : -1}
        className={`map-dark absolute inset-0 h-full w-full border-0 ${
          active ? "" : "pointer-events-none"
        }`}
      />
      <span
        className="ping pointer-events-none absolute top-1/2 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red"
        aria-hidden="true"
      />
      {!active && (
        <button
          type="button"
          onClick={() => {
            playTick();
            setActive(true);
          }}
          className="absolute inset-0 flex cursor-pointer items-end justify-start p-3"
        >
          <span className="bg-ink/85 px-3 py-1.5 text-xs font-semibold text-chalk opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 max-lg:opacity-100">
            {activateLabel}
          </span>
        </button>
      )}
    </div>
  );
}

/** Đường bay chấm đỏ từ HUST tới cổng C1, máy bay đặt tại t≈0.6 trên đường cong. */
function FlightPath() {
  return (
    <svg className="decor__flight" viewBox="0 0 1000 150" fill="none" overflow="visible">
      <path
        className="flight-path"
        d="M 30 120 C 300 10, 700 10, 970 95"
        stroke="#e8112d"
        strokeOpacity="0.8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="30" cy="120" r="7" stroke="#e8112d" strokeWidth="2.5" fill="#070707" />
      <text x="30" y="148" textAnchor="middle" fill="#fff" fillOpacity="0.45" fontSize="14" fontFamily="monospace">
        {EVENT.pass.from.code}
      </text>

      <circle className="flight-dest" cx="970" cy="95" r="7" fill="#e8112d" />
      <circle cx="970" cy="95" r="7" fill="#e8112d" />
      <text x="970" y="123" textAnchor="middle" fill="#fff" fillOpacity="0.45" fontSize="14" fontFamily="monospace">
        {EVENT.pass.gate}
      </text>

      <g transform="translate(600 35) rotate(36) scale(1.7) translate(-11.5 -12.5)">
        <path d="M2 13l19-7-7 19-2.5-8.5L2 13Z" fill="#e8112d" stroke="#ff6b78" strokeWidth="1" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
