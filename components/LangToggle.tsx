"use client";

import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/content";
import { GlobeIcon } from "./Icons";

export default function LangToggle() {
  const { lang, other, toggle, t } = useLang();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t(UI.switchLang)}
      className="fixed top-4 right-4 z-50 inline-flex min-h-11 cursor-pointer items-center gap-2 border border-[#2a2a2a] bg-ink/85 px-4 text-sm font-semibold text-chalk backdrop-blur-md transition-colors duration-200 hover:border-red"
    >
      <GlobeIcon className="h-4 w-4 text-red" />
      <span aria-hidden="true">{lang === "vi" ? "VI" : "EN"}</span>
      <span className="text-smoke" aria-hidden="true">
        /
      </span>
      <span className="text-smoke" aria-hidden="true">
        {other === "vi" ? "VI" : "EN"}
      </span>
    </button>
  );
}
