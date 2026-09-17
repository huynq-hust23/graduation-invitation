"use client";

import { useLang } from "@/lib/i18n";
import { GUESTBOOK } from "@/lib/content";
import SectionHeader from "./SectionHeader";
import GuestbookForm from "./GuestbookForm";
import GuestbookWall from "./GuestbookWall";

export default function Guestbook() {
  const { t } = useLang();

  return (
    <section id={GUESTBOOK.id} className="band screen px-5 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-x-12 gap-y-[clamp(1.5rem,4svh,2.5rem)] xl:grid-cols-2 xl:items-center">
        <div>
          <SectionHeader
            index={6}
            eyebrow={t(GUESTBOOK.eyebrow)}
            title={t(GUESTBOOK.title)}
            lead={t(GUESTBOOK.lead)}
          />
          <GuestbookForm />
        </div>

        <GuestbookWall className="hidden xl:block" />
      </div>
    </section>
  );
}
