import Reveal from "./Reveal";

type Props = {
  /** Thứ tự chặng, hiện thành số đỏ lớn kiểu 01 / 02. */
  index: number;
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
};

// Cỡ chữ và khoảng cách co theo cả chiều cao màn hình (svh), vì mỗi phần phải
// vừa đúng một màn — laptop 1366×768 thấp hơn nhiều so với độ rộng của nó.
export default function SectionHeader({ index, eyebrow, title, lead, className = "" }: Props) {
  return (
    <header className={`mb-[clamp(1.25rem,4svh,2.75rem)] ${className}`}>
      <Reveal className="flex items-baseline gap-3">
        <span className="numeral text-[clamp(1.5rem,min(4vw,5svh),2.5rem)] text-[var(--band-red)]">
          {String(index).padStart(2, "0")}
        </span>
        <span className="label text-[var(--band-fg-dim)]">{eyebrow}</span>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="display mt-[clamp(0.5rem,1.6svh,1rem)] max-w-3xl text-[clamp(1.45rem,min(4.6vw,5.8svh),2.9rem)] text-[var(--band-fg)]">
          {title}
        </h2>
      </Reveal>

      {lead && (
        <Reveal delay={160}>
          {/* Màn thấp thì bỏ đoạn dẫn — đây là chữ phụ, nhường chỗ cho nội dung chính. */}
          <p className="mt-[clamp(0.5rem,1.8svh,1.25rem)] max-w-xl text-[0.9375rem] leading-relaxed text-[var(--band-fg-dim)] sm:text-base [@media(max-height:680px)]:hidden">
            {lead}
          </p>
        </Reveal>
      )}
    </header>
  );
}
