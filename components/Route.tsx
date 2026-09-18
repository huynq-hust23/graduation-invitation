"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { EVENT, ROUTE, UI } from "@/lib/content";
import { mapsEmbedUrl, mapsUrl } from "@/lib/event";
import { playTick } from "@/lib/sfx";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { ArrowRightIcon, PhoneIcon, PlaneIcon } from "./Icons";

export default function Route() {
  const { t } = useLang();

  return (
    <section
      id={ROUTE.id}
      className="band decor-host screen px-5 pt-[max(5.75rem,14svh)] sm:px-8"
    >
      <div className="decor" aria-hidden="true">
        {/* object-cover phủ theo chiều cao khi màn cao/hẹp hơn tỉ lệ ảnh gốc —
            "sizes" phải tính theo chiều cao lúc đó, không chỉ theo chiều rộng,
            nếu không Next sẽ tải ảnh nhỏ hơn thực tế cần rồi phóng to bị vỡ nét. */}
        <Image
          src="/assets/section2-bg-desktop.png"
          alt=""
          fill
          quality={90}
          sizes="(max-aspect-ratio: 1.79) 185vh, 100vw"
          className="hidden object-cover md:block"
        />
        <Image
          src="/assets/section2-bg-mobile.png"
          alt=""
          fill
          quality={90}
          sizes="(max-aspect-ratio: 0.56) 60vh, 100vw"
          className="object-cover md:hidden"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-[clamp(0.4rem,1.2svh,0.75rem)]">
        <SectionHeader
          index={2}
          eyebrow={t(ROUTE.nav)}
          title={t(ROUTE.title)}
          lead={t(ROUTE.lead)}
          className="mb-0!"
        />

        {/* Khung bản đồ kiểu vé: dải đỏ đặc ở đầu, giống header vé máy bay ở Hero. */}
        <Reveal className="border-2 border-[var(--band-rule)]">
          <div className="flex items-center justify-between gap-4 bg-red px-5 py-2 text-white">
            <span className="font-display text-[0.7rem] font-semibold tracking-wide uppercase">
              {t(ROUTE.nav)}
            </span>
            <span className="flex items-center gap-2 font-mono text-xs">
              {EVENT.pass.gate}
              <PlaneIcon className="h-4 w-4" />
            </span>
          </div>

          <MapFrame title={t(EVENT.venue.name)} activateLabel={t(UI.mapActivate)} />

          <div className="flex items-center justify-between gap-3 border-t-2 border-[var(--band-rule)] bg-[var(--band-surface)] px-4 py-2 sm:px-5">
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

        {/* Ba bước + số điện thoại gộp một dòng gọn, nhường phần lớn chiều cao cho bản đồ. */}
        <Reveal className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 border-t-2 border-[var(--band-rule)] pt-[clamp(0.3rem,0.9svh,0.6rem)] text-center">
          {ROUTE.steps.map((step, i) => (
            <span key={i} className="inline-flex items-baseline gap-1.5 text-sm sm:text-base">
              <span className="numeral text-red">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-semibold text-[var(--band-fg)]">{t(step.title)}</span>
            </span>
          ))}
          <a
            href={`tel:${EVENT.contact.phone.replace(/\s/g, "")}`}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 font-mono text-sm text-[var(--band-fg)] transition-colors hover:text-[var(--band-red)] sm:text-base"
          >
            <PhoneIcon className="h-4 w-4 text-red" />
            {EVENT.contact.phone}
          </a>
        </Reveal>
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
      className="group relative h-[clamp(9rem,26svh,15rem)] lg:h-[clamp(12rem,28svh,18rem)]"
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
