"use client";

import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { GUESTBOOK } from "@/lib/content";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Bọc Cloudflare Turnstile (chống bot cho form lưu bút). Cần Site Key thật từ
 * Cloudflare Dashboard của bạn — chưa có thì hiện ô nhắc thay vì render trống.
 */
export default function TurnstileWidget({ onVerify }: { onVerify: (token: string | null) => void }) {
  const { t } = useLang();
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;

  useEffect(() => {
    if (!SITE_KEY) return;
    const host = hostRef.current;
    if (!host) return;

    const render = () => {
      if (!window.turnstile) return;
      widgetId.current = window.turnstile.render(host, {
        sitekey: SITE_KEY,
        callback: (token: string) => onVerifyRef.current(token),
        "expired-callback": () => onVerifyRef.current(null),
        "error-callback": () => onVerifyRef.current(null),
      });
    };

    if (window.turnstile) {
      render();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render, { once: true });

    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
    };
  }, []);

  if (!SITE_KEY) {
    return (
      <p className="border border-dashed border-white/25 px-3 py-2 text-xs text-smoke [@media(max-height:700px)]:hidden">
        {t(GUESTBOOK.turnstileMissing)}
      </p>
    );
  }

  return <div ref={hostRef} />;
}
