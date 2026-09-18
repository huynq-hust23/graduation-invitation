"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { useLang } from "@/lib/i18n";
import { GUESTBOOK } from "@/lib/content";
import TurnstileWidget from "./TurnstileWidget";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

const inputClass =
  "w-full border border-[#2a2a2a] bg-transparent px-4 py-2.5 text-sm text-chalk placeholder:text-smoke/50 transition-colors focus:border-red focus:outline-none sm:text-base";

type Status = "idle" | "sent";

export default function GuestbookForm() {
  const { t } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const tokenRef = useRef<string | null>(null);

  const onVerify = useCallback((token: string | null) => {
    tokenRef.current = token;
  }, []);

  const onPhotoChange = () => {
    const file = fileRef.current?.files?.[0];
    if (file && file.size > MAX_PHOTO_BYTES) {
      setPhotoError(t(GUESTBOOK.photoTooLarge));
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setPhotoError(null);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Chưa có nơi nhận dữ liệu — form đã đủ trường + xác minh Turnstile, chỉ
    // còn thiếu endpoint để bắn payload (FormData) tới khi có quyết định.
    setStatus("sent");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-[clamp(0.6rem,2.6svh,1.5rem)] lg:grid-cols-2"
    >
      <div className="lg:col-span-2">
        <Field label={t(GUESTBOOK.fields.name)}>
          <input type="text" name="name" required className={inputClass} />
        </Field>
      </div>

      <Field label={t(GUESTBOOK.fields.message)} className="flex flex-col">
        <textarea
          name="message"
          required
          placeholder={t(GUESTBOOK.fields.messagePlaceholder)}
          className={`${inputClass} h-14 flex-1 resize-none lg:h-auto`}
        />
      </Field>

      <div className="flex flex-col gap-[clamp(0.9rem,2.6svh,1.5rem)]">
        <Field label={t(GUESTBOOK.fields.photo)}>
          <input
            ref={fileRef}
            type="file"
            name="photo"
            accept="image/png,image/jpeg,image/webp"
            onChange={onPhotoChange}
            className="block w-full cursor-pointer text-xs text-smoke file:mr-4 file:min-h-11 file:cursor-pointer file:border file:border-[#2a2a2a] file:bg-ink-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-chalk sm:text-sm"
          />
          {photoError ? (
            <span className="mt-1.5 block text-xs text-[var(--color-red-text)]">{photoError}</span>
          ) : (
            <span className="mt-1.5 block text-xs text-smoke/70 [@media(max-height:900px)]:hidden">
              {t(GUESTBOOK.fields.photoHint)}
            </span>
          )}
        </Field>

        <TurnstileWidget onVerify={onVerify} />
      </div>

      <div className="lg:col-span-2">
        <button
          type="submit"
          className="mx-auto flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 bg-red px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-red-deep)] sm:w-auto sm:text-base"
        >
          {t(GUESTBOOK.submit)}
        </button>

        <p role="status" className="mt-2 min-h-5 text-sm text-[var(--color-red-text)]">
          {status === "sent" ? t(GUESTBOOK.sent) : null}
        </p>

        <p className="label mt-2 border-t border-[#2a2a2a] pt-3 text-smoke/70 [@media(max-height:900px)]:hidden">
          {t(GUESTBOOK.notConfigured)}
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="label mb-1.5 block text-smoke">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-smoke/70">{hint}</span>}
    </label>
  );
}
