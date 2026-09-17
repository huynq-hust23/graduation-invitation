"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { EVENT, HERO, UI, DETAILS } from "@/lib/content";
import { formatPassDate, formatTime, formatWeekday, formatLongDate } from "@/lib/event";
import SwipeTrack from "./SwipeTrack";
import { ChevronDownIcon, PlaneIcon } from "./Icons";
import { Ribbon, StageBeams } from "./StageDecor";

/** Guest name arrives as ?to=Name. Trimmed and capped so long values can't break the pass. */
function readGuestName() {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("to");
  if (!raw) return null;
  const clean = raw.replace(/\s+/g, " ").trim().slice(0, 30);
  return clean.length > 0 ? clean : null;
}

export default function BoardingPass() {
  const { lang, t } = useLang();
  const [guest, setGuest] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "boarding" | "boarded">("idle");
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => setGuest(readGuestName()), []);

  // Khoá cuộn trang tới khi vuốt lên chuyến xong: không cho xem trước các
  // phần sau. `history.scrollRestoration` tắt để trình duyệt không tự kéo
  // xuống một vị trí cũ trong lúc đang khoá.
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    const html = document.documentElement;
    html.scrollTo({ top: 0, behavior: "instant" });
    html.setAttribute("data-board-lock", "true");
    return () => html.removeAttribute("data-board-lock");
  }, []);

  useEffect(() => {
    if (phase === "boarded") document.documentElement.removeAttribute("data-board-lock");
  }, [phase]);

  // Pointer tilt: pointer-precise devices only, and never against a motion preference.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = stage.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        stage.style.setProperty("--ry", `${px * 8}deg`);
        stage.style.setProperty("--rx", `${-py * 6}deg`);
      });
    };
    const onLeave = () => {
      stage.style.setProperty("--ry", "0deg");
      stage.style.setProperty("--rx", "0deg");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const board = useCallback(() => {
    setPhase("boarding");
    window.setTimeout(() => setPhase("boarded"), 900);
  }, []);

  const passengerLine = guest ?? t(HERO.defaultGuest);
  const stateClass =
    phase === "boarding" ? "is-boarding" : phase === "boarded" ? "is-boarded" : "";

  return (
    <section
      className="stage band screen px-5 pb-[max(1rem,3svh)] sm:px-8"
      aria-labelledby="pass-heading"
    >
      <div className="stage__lights" aria-hidden="true">
        <StageBeams />
        <Ribbon className="stage__ribbon" />
      </div>

      <h1 id="pass-heading" className="sr-only">
        {t(HERO.eyebrow)} — {EVENT.graduateName}, {formatLongDate(lang)}
      </h1>

      <div className="mx-auto w-full max-w-6xl">
        {/* Tiêu đề trải hết bề rộng: dòng đỏ, dòng trắng thụt vào — nhịp của ZARYA. */}
        <div aria-hidden="true">
          <span className="tag max-lg:[@media(max-height:700px)]:hidden">{t(HERO.eyebrow)}</span>
          <p className="display mt-[clamp(0.6rem,2.4svh,1.5rem)] text-[clamp(1.55rem,min(6.9vw,8.2svh),4.9rem)]">
            <span className="block text-red">{t(HERO.headlineTop)}</span>
            <span className="block pl-[8%] text-chalk">{t(HERO.headlineBottom)}</span>
          </p>
        </div>

        <div className="mt-[clamp(0.75rem,3svh,1.5rem)] grid items-center lg:mt-[clamp(1rem,4.5svh,4rem)] gap-[clamp(0.9rem,3svh,3.5rem)] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="order-1 lg:order-none">
            <p className="max-w-sm text-sm leading-relaxed text-smoke sm:text-base max-lg:[@media(max-height:880px)]:hidden">
              {t(HERO.invite)}
            </p>
            <p className="display mt-[clamp(0.25rem,1.2svh,0.75rem)] text-lg text-chalk sm:text-2xl">
              {EVENT.graduateName}
            </p>
            {/* Trên điện thoại hàng "Hạng" trong vé bị bỏ cho vừa màn — ngành học hiện ở đây. */}
            <p className="mt-0.5 text-xs text-smoke md:hidden [@media(max-height:760px)]:hidden">{t(EVENT.pass.cabin)}</p>
            <p className="mt-[clamp(0.5rem,2.4svh,1.5rem)] max-w-sm border-l-2 border-red pl-4 text-sm leading-relaxed text-chalk/80">
              <span className="capitalize">{formatWeekday(lang)}</span>, {formatLongDate(lang)} ·{" "}
              {formatTime(lang)}
              {/* Màn điện thoại rất thấp: địa điểm đã có ở phần Chi tiết và Đường đến. */}
              <span className="block max-lg:[@media(max-height:700px)]:hidden">
                {t(EVENT.venue.name)}
              </span>
            </p>
          </div>

          <div
            ref={stageRef}
            className="pass-stage order-2 w-full max-w-[36rem] justify-self-center lg:order-none lg:row-span-2"
            style={{ perspective: "1400px" }}
          >
            <Pass
              stateClass={stateClass}
              passenger={passengerLine}
              lang={lang}
              t={t}
            />
          </div>

          <div className="order-3 w-full max-w-sm lg:order-none">
            <SwipeTrack
              label={t(UI.swipeToBoard)}
              hint={t(UI.tapToBoard)}
              doneLabel={t(UI.boarded)}
              done={phase === "boarded"}
              onComplete={board}
            />
            {phase === "boarded" && (
              <a
                href={`#${DETAILS.id}`}
                className="reveal is-visible label mt-6 inline-flex items-center gap-2 text-smoke transition-colors hover:text-chalk max-lg:[@media(max-height:880px)]:hidden"
              >
                {t(UI.scrollOn)}
                <ChevronDownIcon className="h-4 w-4 animate-bounce" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Chiều cao tấm vé co theo màn hình để hero vừa đúng một màn trên điện thoại.
const V_PAD = "py-[clamp(0.7rem,2svh,1.5rem)]";
const V_GAP = "mt-[clamp(0.45rem,1.5svh,1.5rem)] pt-[clamp(0.4rem,1.2svh,1rem)]";

type PassProps = {
  stateClass: string;
  passenger: string;
  lang: "vi" | "en";
  t: (v: { vi: string; en: string }) => string;
};

function Pass({ stateClass, passenger, lang, t }: PassProps) {
  return (
    <div
      className={`pass ${stateClass} md:flex`}
      style={{
        transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        transition: "transform 380ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="pass__sheen" aria-hidden="true" />
      <div className="pass__scan" aria-hidden="true">
        <div className="scanbeam" />
      </div>

      {/* ---- Thân vé ---- */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4 rounded-tl-[10px] bg-red px-6 py-[clamp(0.6rem,1.6svh,0.875rem)] text-white max-md:rounded-tr-[10px]">
          <span className="font-display text-[0.7rem] font-semibold tracking-wide uppercase">
            Graduation Airlines
          </span>
          <span className="flex items-center gap-2 font-mono text-xs">
            {EVENT.pass.flight}
            <PlaneIcon className="h-4 w-4" />
          </span>
        </div>

        <div className={`px-6 ${V_PAD}`}>
          <div className="flex items-end gap-3">
            <div className="min-w-0">
              <p className="display text-[clamp(1.5rem,min(7vw,5svh),2.6rem)] leading-none">
                {EVENT.pass.from.code}
              </p>
              <p className="mt-1.5 truncate text-xs text-graphite">{t(EVENT.pass.from.label)}</p>
            </div>

            <div className="mb-5 flex flex-1 items-center gap-1.5 text-red" aria-hidden="true">
              <span className="h-px flex-1 border-t-2 border-dotted border-current opacity-60" />
              <PlaneIcon className="h-4 w-4" />
              <span className="h-px flex-1 border-t-2 border-dotted border-current opacity-60" />
            </div>

            <div className="min-w-0 text-right">
              <p className="display text-[clamp(1.5rem,min(7vw,5svh),2.6rem)] leading-none text-red">
                {EVENT.pass.to.code}
              </p>
              <p className="mt-1.5 truncate text-xs text-graphite">{t(EVENT.pass.to.label)}</p>
            </div>
          </div>

          <div className={`border-t border-black/10 ${V_GAP}`}>
            <p className="text-xs text-graphite">{t(UI.passenger)}</p>
            <p className="mt-0.5 truncate text-lg leading-snug font-semibold sm:text-2xl">
              {passenger}
            </p>
          </div>

          {/* Cột ngày rộng hơn để "21 NOV 2026" không gãy dòng trên điện thoại. */}
          <dl className={`grid grid-cols-[1.5fr_1fr_0.7fr] gap-4 border-t border-black/10 ${V_GAP}`}>
            <Field label={t(UI.date)} value={formatPassDate()} />
            <Field label={t(UI.boardingTime)} value={formatTime(lang)} />
            <Field label={t(UI.gate)} value={EVENT.pass.gate} />
          </dl>

          <div className={`flex items-end justify-between gap-4 border-t border-black/10 max-md:hidden ${V_GAP}`}>
            <div className="min-w-0">
              <p className="text-xs text-graphite">{t(UI.cabinClass)}</p>
              <p className="mt-0.5 truncate text-sm font-medium">{t(EVENT.pass.cabin)}</p>
            </div>
            <div className="barcode h-9 w-24 shrink-0 text-ink" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="perf" aria-hidden="true" />

      {/* ---- Cuống vé: khối đỏ đặc ---- */}
      <div className="stub pass__stub flex shrink-0 items-center justify-between gap-5 rounded-b-[10px] bg-red px-6 text-white md:flex-col md:items-stretch md:justify-between md:rounded-l-none md:rounded-r-[10px] md:rounded-bl-none md:px-5 md:py-6">
        <div>
          <p className="text-xs text-white/75">{t(UI.seat)}</p>
          <p className="numeral text-[clamp(1.5rem,4svh,1.875rem)] md:text-4xl">{EVENT.pass.seat}</p>
        </div>
        <div>
          <p className="text-xs text-white/75">{t(UI.boardingTime)}</p>
          <p className="font-mono text-sm">{formatTime(lang)}</p>
        </div>
        <div className="barcode h-11 w-16 shrink-0 text-white md:h-14 md:w-full" aria-hidden="true" />
      </div>

      <div className="stamp pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
        <span className="display border-4 border-red bg-white/70 px-5 py-2 text-2xl text-red sm:text-3xl">
          {t(UI.boarded)}
        </span>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-xs text-graphite">{label}</dt>
      <dd className="mt-0.5 font-mono text-sm font-medium whitespace-nowrap tabular-nums">{value}</dd>
    </div>
  );
}
