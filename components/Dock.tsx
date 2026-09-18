"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { DETAILS, EVENT, UI } from "@/lib/content";
import { formatStamp, formatTime, googleCalendarUrl, mapsUrl } from "@/lib/event";
import { playChime, playTick } from "@/lib/sfx";
import { CalendarIcon, CheckIcon, PinIcon } from "./Icons";

export default function Dock() {
  const { lang, t } = useLang();
  const [shown, setShown] = useState(false);
  const [saved, setSaved] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Thanh tiến trình đỏ theo dõi toàn trang — vẫn một listener passive,
  // frame-throttled, ghi thẳng ra CSS variable để cuộn trang không kích hoạt
  // render React nào.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      barRef.current?.style.setProperty(
        "--progress",
        String(max > 0 ? Math.min(1, scrolled / max) : 0),
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Dock (lưu lịch / chỉ đường) chỉ hiện khi đang ở đúng section "Chi tiết" —
  // các section khác không cần lặp lại 2 nút này.
  useEffect(() => {
    const target = document.getElementById(DETAILS.id);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShown(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const calendarUrl = googleCalendarUrl(
    `${t(UI.calendarTitle)} · ${EVENT.graduateName}`,
    t(EVENT.venue.name),
    t(EVENT.venue.address),
  );

  const onSaveClick = () => {
    playChime();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5">
        <div ref={barRef} className="progress h-full bg-red" aria-hidden="true" />
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-gutter pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-out ${
          shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <div
          className="flex w-full max-w-lg items-center gap-2 border-2 border-[#2a2a2a] bg-ink/92 p-2 shadow-2xl backdrop-blur-md"
          // Keeps the buttons out of the tab order while the dock is off-screen.
          inert={!shown}
        >
          <p className="hidden shrink-0 pl-3 font-mono text-xs text-smoke tabular-nums sm:block">
            {formatStamp()} · {formatTime(lang)}
          </p>

          <div className="flex flex-1 items-center gap-2">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onSaveClick}
              className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 border-2 border-[#2a2a2a] px-4 text-sm font-medium text-chalk transition-colors duration-200 hover:border-red hover:text-[var(--color-red-text)]"
            >
              {saved ? <CheckIcon className="h-4 w-4" /> : <CalendarIcon className="h-4 w-4" />}
              <span className="truncate">{saved ? t(UI.calendarSaved) : t(UI.addToCalendar)}</span>
            </a>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playTick}
              className="inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 bg-red px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-[var(--color-red-deep)]"
            >
              <PinIcon className="h-4 w-4" />
              <span className="truncate">{t(UI.getDirections)}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
