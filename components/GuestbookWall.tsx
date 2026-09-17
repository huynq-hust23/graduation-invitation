"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { GUESTBOOK, type L } from "@/lib/content";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

const SQRT_5000 = Math.sqrt(5000);

type Card = { tempId: number; text: L };
const INITIAL: Card[] = GUESTBOOK.wall.map((text, i) => ({ tempId: i, text }));

export default function GuestbookWall({ className = "" }: { className?: string }) {
  const { t } = useLang();
  const [cardSize, setCardSize] = useState(220);
  const [cards, setCards] = useState(INITIAL);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 1280px)");
      setCardSize(matches ? 220 : 190);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMove = (steps: number) => {
    setCards((list) => {
      const next = [...list];
      if (steps > 0) {
        for (let i = steps; i > 0; i--) {
          const item = next.shift();
          if (!item) return list;
          next.push({ ...item, tempId: Math.random() });
        }
      } else {
        for (let i = steps; i < 0; i++) {
          const item = next.pop();
          if (!item) return list;
          next.unshift({ ...item, tempId: Math.random() });
        }
      }
      return next;
    });
  };

  return (
    <div className={className}>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: cardSize * 1.55 }}
      >
        {cards.map((card, index) => {
          const position =
            cards.length % 2 ? index - (cards.length + 1) / 2 : index - cards.length / 2;
          return (
            <TestimonialCard
              key={card.tempId}
              card={card}
              position={position}
              cardSize={cardSize}
              onMove={handleMove}
              sampleLabel={t(GUESTBOOK.wallSampleLabel)}
            />
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="label text-smoke">{t(GUESTBOOK.wallCaption)}</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => handleMove(-1)}
            aria-label="Previous"
            className="flex h-9 w-9 cursor-pointer items-center justify-center border border-[#2a2a2a] text-chalk transition-colors hover:border-red hover:text-red"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleMove(1)}
            aria-label="Next"
            className="flex h-9 w-9 cursor-pointer items-center justify-center border border-[#2a2a2a] text-chalk transition-colors hover:border-red hover:text-red"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  card,
  position,
  cardSize,
  onMove,
  sampleLabel,
}: {
  card: Card;
  position: number;
  cardSize: number;
  onMove: (steps: number) => void;
  sampleLabel: string;
}) {
  const { t } = useLang();
  const isCenter = position === 0;
  const notch = Math.round(cardSize * 0.14);

  return (
    <div
      onClick={() => onMove(position)}
      className={`absolute top-1/2 left-1/2 cursor-pointer border p-5 transition-all duration-500 ease-in-out ${
        isCenter ? "z-10 border-red bg-red text-white" : "z-0 border-[#2a2a2a] bg-ink-soft text-chalk"
      }`}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(${notch}px 0%, calc(100% - ${notch}px) 0%, 100% ${notch}px, 100% 100%, calc(100% - ${notch}px) 100%, ${notch}px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -cardSize * 0.12 : position % 2 ? cardSize * 0.05 : -cardSize * 0.05}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-[#2a2a2a]"
        style={{ right: -1, top: notch * 0.7, width: SQRT_5000, height: 1 }}
      />
      <p className="text-sm leading-relaxed font-medium sm:text-base">“{t(card.text)}”</p>
      <p
        className={`label absolute right-5 bottom-5 left-5 mt-2 ${isCenter ? "text-white/75" : "text-smoke"}`}
      >
        — {sampleLabel}
      </p>
    </div>
  );
}
