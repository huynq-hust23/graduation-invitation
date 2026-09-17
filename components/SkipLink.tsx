"use client";

import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/content";

export default function SkipLink() {
  const { t } = useLang();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:inline-flex focus:min-h-11 focus:items-center focus:bg-red focus:px-5 focus:text-sm focus:font-medium focus:text-white"
    >
      {t(UI.skipToContent)}
    </a>
  );
}
