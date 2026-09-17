"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronsRightIcon } from "./Icons";

const COMPLETE_AT = 0.82;

type Props = {
  label: string;
  hint: string;
  doneLabel: string;
  done: boolean;
  onComplete: () => void;
};

export default function SwipeTrack({ label, hint, doneLabel, done, onComplete }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);
  const [settling, setSettling] = useState(false);
  const dragging = useRef(false);
  const draggedFar = useRef(false);
  const travel = useRef(0);

  // Measure how far the knob may travel; re-measure on resize and font load.
  useEffect(() => {
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return;

    const measure = () => {
      const padding = 8;
      travel.current = Math.max(0, track.clientWidth - knob.offsetWidth - padding);
      track.style.setProperty("--knob-travel", `${travel.current}px`);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const complete = useCallback(() => {
    if (done) return;
    setSettling(true);
    setProgress(1);
    onComplete();
  }, [done, onComplete]);

  const reset = useCallback(() => {
    setSettling(true);
    setProgress(0);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (done) return;
    dragging.current = true;
    draggedFar.current = false;
    setSettling(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || done || travel.current === 0) return;
    const rect = trackRef.current!.getBoundingClientRect();
    const knobHalf = (knobRef.current?.offsetWidth ?? 0) / 2;
    const next = Math.min(1, Math.max(0, (e.clientX - rect.left - knobHalf) / travel.current));
    if (next > 0.06) draggedFar.current = true;
    setProgress(next);
  };

  const onPointerUp = () => {
    if (!dragging.current || done) return;
    dragging.current = false;
    if (progress >= COMPLETE_AT) complete();
    else reset();
  };

  // Tap and keyboard both complete outright — dragging is an enhancement,
  // never the only way through (WCAG 2.2 "Dragging Movements").
  const onClick = () => {
    if (draggedFar.current) {
      draggedFar.current = false;
      return;
    }
    complete();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      complete();
    }
  };

  if (done) {
    return (
      <div
        role="status"
        className="flex h-14 items-center justify-center sm:h-16 gap-2.5 border border-red/60 px-5 text-base font-semibold text-[var(--color-red-text)]"
      >
        <CheckIcon className="h-5 w-5" />
        {doneLabel}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        ref={trackRef}
        role="button"
        tabIndex={0}
        aria-label={label}
        className="track relative flex h-14 cursor-pointer items-center select-none sm:h-16"
        style={{ "--swipe": progress } as React.CSSProperties}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="track__fill" aria-hidden="true" />

        <span className="track__label pointer-events-none absolute inset-0 flex items-center justify-center pl-12 text-base font-semibold">
          {label}
        </span>

        <span
          ref={knobRef}
          aria-hidden="true"
          className={`track__knob relative ml-1.5 grid h-11 w-11 shrink-0 sm:h-[3.25rem] sm:w-[3.25rem] place-items-center bg-chalk text-ink ${
            settling ? "is-settling" : ""
          }`}
        >
          <ChevronsRightIcon className="h-6 w-6 text-red" />
        </span>
      </div>

      <p className="label text-center text-smoke [@media(max-height:700px)]:hidden">{hint}</p>
    </div>
  );
}
