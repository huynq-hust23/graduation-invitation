"use client";

import { useLang } from "@/lib/i18n";
import { GUESTBOOK } from "@/lib/content";
import SectionHeader from "./SectionHeader";
import GuestbookForm from "./GuestbookForm";

export default function Guestbook() {
  const { t } = useLang();

  return (
    <section id={GUESTBOOK.id} className="band screen px-5 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <SectionHeader
          index={6}
          eyebrow={t(GUESTBOOK.eyebrow)}
          title={t(GUESTBOOK.title)}
          lead={t(GUESTBOOK.lead)}
        />
        <GuestbookForm />
      </div>
    </section>
  );
}
