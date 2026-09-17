"use client";

import { useLang } from "@/lib/i18n";
import { JOURNEY } from "@/lib/content";
import SectionHeader from "./SectionHeader";
import Reveal, { useRevealRef } from "./Reveal";

/** Các cột sáng dọc ở nửa phải, như vách đèn sân khấu. */
const PANELS = [
  { x: "56%", w: "7%", a: 0.14 },
  { x: "68%", w: "4%", a: 0.22 },
  { x: "78%", w: "8%", a: 0.16 },
  { x: "91%", w: "5%", a: 0.24 },
];

export default function Journey() {
  const { lang, t } = useLang();
  const spineY = useRevealRef<HTMLSpanElement>();
  const spineX = useRevealRef<HTMLSpanElement>();
  const moments = JOURNEY.marquee[lang];

  return (
    <section id={JOURNEY.id} className="band bg-journey decor-host screen">
      <div className="decor" aria-hidden="true">
        {PANELS.map((p) => (
          <div
            key={p.x}
            className="decor__panel"
            style={{ "--x": p.x, "--w": p.w, "--a": p.a } as React.CSSProperties}
          />
        ))}
        <span
          className="watermark top-1/2 right-[-3vw] -translate-y-1/2 text-[clamp(8rem,30vw,26rem)]"
          style={{ "--wm-stroke": "rgb(255 255 255 / 0.07)" } as React.CSSProperties}
        >
          {JOURNEY.years[JOURNEY.years.length - 1].year}
        </span>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeader
          index={4}
          eyebrow={t(JOURNEY.nav)}
          title={t(JOURNEY.title)}
          lead={t(JOURNEY.lead)}
        />

        {/* Mobile: trục dọc bên trái. Từ 1024px: trục ngang, 4 mốc thành 4 cột.
            Trục nằm cạnh danh sách chứ không trong <ol> — ol chỉ được chứa <li>. */}
        <div className="relative pl-8 lg:pt-9 lg:pl-0">
          <span
            ref={spineY}
            aria-hidden="true"
            className="spine absolute top-2 bottom-2 left-[3px] w-[3px] bg-red lg:hidden"
          />
          <span
            ref={spineX}
            aria-hidden="true"
            className="spine-x absolute top-[7px] right-0 left-0 hidden h-[3px] bg-red lg:block"
          />

          <ol className="space-y-[clamp(0.75rem,2.4svh,1.75rem)] lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0">
            {JOURNEY.years.map((entry, i) => (
              <Reveal as="li" key={entry.year} delay={i * 90} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 -left-8 h-[9px] w-[9px] bg-red lg:-top-9 lg:left-0 lg:h-[17px] lg:w-[17px]"
                />
                <div className="flex flex-wrap items-baseline gap-x-3 lg:block">
                  <span className="numeral text-[clamp(1.1rem,min(3vw,3.4svh),1.75rem)] text-red">
                    {entry.year}
                  </span>
                  <h3 className="display text-[clamp(0.95rem,min(2.4vw,2.8svh),1.35rem)] text-[var(--band-fg)] lg:mt-2">
                    {t(entry.title)}
                  </h3>
                </div>
                <p className="mt-1 text-sm leading-snug text-[var(--band-fg-dim)] lg:mt-2.5 lg:text-[0.9375rem] lg:leading-relaxed">
                  {t(entry.note)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <div className="marquee-host mt-[clamp(1.25rem,4.5svh,3.5rem)] space-y-3 overflow-hidden">
        <MarqueeRail items={moments} />
        <div className="max-md:hidden [@media(max-height:700px)]:hidden">
          <MarqueeRail items={[...moments].reverse()} reverse />
        </div>
      </div>
    </section>
  );
}

function MarqueeRail({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    // Danh sách được nhân đôi để vòng lặp -50% không lộ mối nối; bản sao bị ẩn
    // khỏi trình đọc màn hình để không bị đọc hai lần.
    <div className="relative flex overflow-hidden" aria-hidden={reverse ? "true" : undefined}>
      <div
        className={`marquee gap-4 ${reverse ? "marquee--reverse" : ""}`}
        style={{ "--marquee-duration": reverse ? "52s" : "44s" } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span
                key={item}
                className={`shrink-0 border px-4 py-2 text-sm whitespace-nowrap sm:px-5 sm:py-2.5 sm:text-base ${
                  reverse ? "border-transparent text-smoke/70" : "border-[var(--band-rule)] text-chalk"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
