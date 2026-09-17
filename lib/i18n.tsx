"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { L, Lang } from "./content";

const STORAGE_KEY = "grad-lang";

type Ctx = {
  lang: Lang;
  other: Lang;
  toggle: () => void;
  t: (value: L) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");

  // Read the stored choice after mount so server and client render the same first pass.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "vi" || saved === "en") setLang(saved);
    } catch {
      // Private mode / blocked storage — the default language is fine.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore: persisting the choice is a convenience, not a requirement.
    }
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === "vi" ? "en" : "vi")), []);
  const t = useCallback((value: L) => value[lang], [lang]);

  const value = useMemo<Ctx>(
    () => ({ lang, other: lang === "vi" ? "en" : "vi", toggle, t }),
    [lang, toggle, t],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}
