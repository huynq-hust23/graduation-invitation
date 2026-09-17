import { useId } from "react";

const BEAMS = [
  { x: "18%", r: "14deg", d: "0s" },
  { x: "50%", r: "0deg", d: "-4s" },
  { x: "82%", r: "-14deg", d: "-8s" },
];

/** Ba luồng đèn sân khấu chiếu từ trên xuống, kèm bóng đèn ở mép trên. */
export function StageBeams() {
  return (
    <>
      {BEAMS.map((b) => (
        <div
          key={b.x}
          className="stage__beam"
          style={{ "--x": b.x, "--r": b.r, "--d": b.d } as React.CSSProperties}
        />
      ))}
      {BEAMS.map((b) => (
        <div key={`lamp-${b.x}`} className="stage__lamp" style={{ "--x": b.x } as React.CSSProperties} />
      ))}
    </>
  );
}

const DEFAULT_PATH = "M -60 470 C 140 380, 250 110, 460 160 S 720 470, 880 250";

/** Dải lụa đỏ bóng — một nét cong dày tô gradient, thêm bóng đổ và vệt sáng mảnh. */
export function Ribbon({ className = "", d = DEFAULT_PATH }: { className?: string; d?: string }) {
  // Mỗi dải lụa cần id riêng: một trang có nhiều dải, id gradient trùng nhau sẽ
  // khiến các dải sau lấy nhầm gradient của dải đầu.
  const uid = useId().replace(/:/g, "");
  const fill = `ribbon-fill-${uid}`;
  const soft = `ribbon-soft-${uid}`;

  return (
    <svg className={className} viewBox="0 0 800 600" fill="none" overflow="visible" aria-hidden="true">
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#3d0007" />
          <stop offset="0.3" stopColor="#c20d24" />
          <stop offset="0.46" stopColor="#ff5a67" />
          <stop offset="0.54" stopColor="#e3122c" />
          <stop offset="0.78" stopColor="#8a0616" />
          <stop offset="1" stopColor="#2a0005" />
        </linearGradient>
        <filter id={soft} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path d={d} stroke="#000" strokeOpacity="0.45" strokeWidth="84" filter={`url(#${soft})`} transform="translate(0 26)" />
      <path d={d} stroke={`url(#${fill})`} strokeWidth="78" strokeLinecap="round" />
      <path
        d={d}
        stroke="#fff"
        strokeOpacity="0.45"
        strokeWidth="5"
        strokeLinecap="round"
        filter={`url(#${soft})`}
        transform="translate(0 -24)"
      />
    </svg>
  );
}
