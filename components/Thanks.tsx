"use client";

import { useLang } from "@/lib/i18n";
import { EVENT, THANKS } from "@/lib/content";
import Reveal from "./Reveal";
import { ChevronsRightIcon } from "./Icons";
import { Ribbon, StageBeams } from "./StageDecor";

// Nền ở đây là đỏ rực, nên mọi chữ dùng trắng: chữ đỏ sẽ chìm hẳn, còn xám
// #a3a3a3 không đủ tương phản trên vùng đỏ sáng nhất.
export default function Thanks() {
  const { lang, t } = useLang();

  return (
    <section
      id={THANKS.id}
      className="band bg-thanks decor-host screen px-5 text-white sm:px-8"
    >
      <div className="decor" aria-hidden="true">
        <StageBeams />
        <Ribbon className="decor__ribbon" d="M -80 520 C 120 200, 420 120, 520 300 S 760 620, 900 180" />
      </div>

      {/* Màn rộng: tiêu đề + lời hẹn bên trái, lời cảm ơn bên phải. */}
      <div className="mx-auto grid w-full max-w-6xl gap-x-16 gap-y-[clamp(1rem,3svh,2rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="flex flex-col gap-[clamp(0.75rem,2.5svh,2rem)] lg:order-none">
          <Reveal>
            <p className="display text-[clamp(2.25rem,min(10vw,10svh),5.5rem)]">{t(THANKS.title)}</p>
          </Reveal>

          <Reveal delay={200} className="flex items-center gap-3 max-lg:hidden">
            <ChevronsRightIcon className="h-12 w-12 shrink-0" />
            <p className="display text-[clamp(1.5rem,3.2vw,2.25rem)]">{t(THANKS.signoff)}</p>
          </Reveal>

          <Reveal delay={240} className="flex flex-wrap items-center gap-x-4 gap-y-2 max-lg:hidden">
            <span className="inline-flex bg-ink px-4 py-2.5 text-base font-semibold">
              {EVENT.graduateName}
            </span>
            <a
              href={`mailto:${EVENT.contact.email}`}
              className="inline-flex min-h-11 cursor-pointer items-center font-mono text-sm text-white/75 transition-colors hover:text-white"
            >
              {EVENT.contact.email}
            </a>
          </Reveal>
        </div>

        <div className="space-y-[clamp(0.6rem,1.8svh,1.25rem)] border-l-2 border-white/40 pl-5 sm:pl-8">
          {THANKS.body[lang].map((line, i) => (
            <Reveal key={i} delay={i * 90}>
              <p className="text-[0.9375rem] leading-relaxed text-white/85 sm:text-lg [@media(max-height:700px)]:text-sm">
                {line}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Mobile: lời hẹn và tên xuống dưới cùng, sau lời cảm ơn. */}
        <div className="space-y-3 lg:hidden">
          <Reveal className="flex items-center gap-3">
            <ChevronsRightIcon className="h-9 w-9 shrink-0" />
            <p className="display text-[clamp(1.2rem,5.4vw,1.75rem)]">{t(THANKS.signoff)}</p>
          </Reveal>
          <Reveal className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex bg-ink px-3.5 py-2 text-sm font-semibold">
              {EVENT.graduateName}
            </span>
            <a
              href={`mailto:${EVENT.contact.email}`}
              className="inline-flex min-h-11 cursor-pointer items-center font-mono text-sm text-white/75 transition-colors hover:text-white"
            >
              {EVENT.contact.email}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
