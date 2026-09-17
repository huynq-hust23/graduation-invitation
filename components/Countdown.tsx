"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/content";
import { startDate } from "@/lib/event";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingFrom(now: number): Remaining | null {
  const diff = startDate.getTime() - now;
  if (diff <= 0) return null;
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export default function Countdown() {
  const { t } = useLang();
  // Starts undefined so server and first client render agree; the clock begins after mount.
  const [left, setLeft] = useState<Remaining | null | undefined>(undefined);

  useEffect(() => {
    const tick = () => setLeft(remainingFrom(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (left === null) {
    return <p className="display text-2xl text-white">{t(UI.departed)}</p>;
  }

  const units: Array<[number, string, number]> = [
    [left?.days ?? 0, t(UI.days), 2],
    [left?.hours ?? 0, t(UI.hours), 2],
    [left?.minutes ?? 0, t(UI.minutes), 2],
    [left?.seconds ?? 0, t(UI.seconds), 2],
  ];

  return (
    <div className="flex flex-wrap items-start gap-x-6 gap-y-5" role="group" aria-label={t(UI.countdownAria)}>
      {/* Reel là đồ hoạ với trình đọc màn hình — đọc từng chữ số mỗi giây thì
          không dùng được. Đây là bản tương đương đọc được. */}
      <p className="sr-only">{t(UI.daysLeft).replace("{n}", String(left?.days ?? 0))}</p>

      {units.map(([value, label, pad]) => (
        <div key={label}>
          <div className="numeral flex text-[clamp(1.75rem,min(6.5vw,6.5svh),3.25rem)] text-white">
            {String(value)
              .padStart(pad, "0")
              .split("")
              .map((d, idx) => (
                <Reel key={idx} value={Number(d)} />
              ))}
          </div>
          <p className="label mt-[clamp(0.25rem,1.2svh,0.625rem)] text-white/85">{label}</p>
        </div>
      ))}
    </div>
  );
}

// Unbounded có chữ số bè ngang — ô hẹp hơn ~0.8em sẽ làm các số đè lên nhau.
function Reel({ value }: { value: number }) {
  return (
    <span className="reel inline-block w-[0.84em] text-center" aria-hidden="true">
      <span className="reel__track block" style={{ "--digit": value } as React.CSSProperties}>
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em] leading-[1em]">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}
