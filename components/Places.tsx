"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";
import { PHOTOS_READY, PLACES } from "@/lib/content";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

export default function Places() {
  const { t } = useLang();

  return (
    <section
      id={PLACES.id}
      className="band band--light bg-places decor-host screen px-5 sm:px-8 xl:pl-28"
    >
      {/* Cột đỏ dọc chỉ hiện khi lề hai bên đủ rộng; màn hẹp hơn dùng dải ngang ở đầu. */}
      <div className="decor" aria-hidden="true">
        <div className="side-bar absolute inset-x-0 top-0 flex h-11 text-xs xl:hidden">
          HUST · 2022 — 2026
        </div>
        <div className="side-bar absolute inset-y-0 left-0 hidden w-20 text-lg xl:flex">
          <span className="rotate-180 [writing-mode:vertical-rl]">HUST · 2022 — 2026</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          index={3}
          eyebrow={t(PLACES.nav)}
          title={t(PLACES.title)}
          lead={t(PLACES.lead)}
        />

        {/* Dưới 1024px: băng chuyền vuốt ngang — 5 ô xếp dọc không thể vừa một màn.
            Từ 1024px: lưới 3 cột, ô đầu chiếm 2 cột nên 5 ô lấp kín 2 hàng. */}
        <div
          role="region"
          aria-label={t(PLACES.nav)}
          tabIndex={0}
          className="carousel -mx-5 flex gap-3 overflow-x-auto scroll-px-5 px-5 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:auto-rows-[clamp(8.5rem,21svh,17rem)] lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0"
        >
          {PLACES.items.map((place, i) => (
            <Reveal
              key={place.src}
              delay={(i % 3) * 80}
              className={`h-[clamp(13rem,42svh,24rem)] w-[78%] shrink-0 sm:w-[46%] lg:h-auto lg:w-auto ${
                i === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <figure className="group relative h-full overflow-hidden bg-ink">
                <div className="relative h-full overflow-hidden">
                  {PHOTOS_READY ? (
                    <Image
                      src={place.src}
                      alt={t(place.name)}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                  ) : (
                    <Placeholder label={place.src} />
                  )}
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <figcaption className="absolute inset-x-0 bottom-0 p-[clamp(0.9rem,2.2svh,1.25rem)]">
                  <p className="text-base font-semibold text-chalk sm:text-lg">{t(place.name)}</p>
                  <p className="mt-1 text-sm leading-snug text-smoke">{t(place.note)}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="label mt-3 text-[var(--band-fg-dim)] lg:hidden" aria-hidden="true">
          {t(PLACES.swipeHint)} →
        </p>
      </div>
    </section>
  );
}

/** Đứng đúng tỷ lệ cuối cùng, nên thả ảnh thật vào không làm xê dịch bố cục. */
function Placeholder({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 grid place-items-center bg-[linear-gradient(160deg,#1e1e1e,#111)]"
      aria-hidden="true"
    >
      <span className="px-4 pb-10 text-center font-mono text-xs text-chalk/35">{label}</span>
    </div>
  );
}
