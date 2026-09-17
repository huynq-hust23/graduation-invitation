"use client";

import { useEffect } from "react";
import { playWhoosh } from "@/lib/sfx";

/** Bao lâu không có sự kiện wheel thì coi như một cử chỉ cuộn đã kết thúc. */
const QUIET_MS = 220;
/** Thời gian tối thiểu giữa hai lần chuyển trang — đủ cho hiệu ứng cuộn chạy xong. */
const TRAVEL_MS = 750;
/** Tổng deltaY tối thiểu mới tính là ý định chuyển trang (lọc rung tay trên trackpad). */
const THRESHOLD = 20;

/**
 * Mỗi cử chỉ lăn chuột / vuốt trackpad chuyển đúng một phần.
 *
 * Scroll snap của CSS vẫn là nền: nó lo vuốt trên cảm ứng và phím bấm. Nhưng với
 * wheel, Chromium bám về điểm snap *gần nhất*, nên một nấc lăn nhỏ lại kéo về
 * chính phần cũ. Bộ này chỉ can thiệp wheel dọc trên thiết bị có con trỏ chính xác;
 * Ctrl+lăn (zoom), cuộn ngang và phần cao hơn màn hình (cuộn tự nhiên bên trong
 * cho tới mép) đều để nguyên cho trình duyệt.
 */
export default function SectionPager() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lastWheel = 0;
    let busyUntil = 0;
    let busy = false;
    let acc = 0;

    const onWheel = (e: WheelEvent) => {
      if (document.documentElement.hasAttribute("data-board-lock")) return;
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.deltaY === 0) return;

      const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
      const y = window.scrollY;
      const vh = window.innerHeight;
      const index = sections.findIndex((s) => s.offsetTop + s.offsetHeight > y + 2);
      if (index < 0) return;

      const current = sections[index];
      const dir = e.deltaY > 0 ? 1 : -1;
      const top = current.offsetTop;
      const bottom = top + current.offsetHeight;

      // Phần này cao hơn màn hình và chưa chạm mép: để trình duyệt cuộn bên trong.
      if (!busy && ((dir > 0 && y + vh < bottom - 2) || (dir < 0 && y > top + 2))) return;

      e.preventDefault();

      const now = performance.now();
      const gestureEnded = now - lastWheel > QUIET_MS;
      lastWheel = now;

      // Đang chuyển trang: nuốt hết quán tính của cử chỉ hiện tại, chỉ nhả khi
      // cuộn đã chạy xong *và* tay đã rời trackpad đủ lâu.
      if (busy) {
        if (now < busyUntil || !gestureEnded) return;
        busy = false;
      }
      if (gestureEnded) acc = 0;

      acc += e.deltaY;
      if (Math.abs(acc) < THRESHOLD) return;

      const target = sections[index + dir];
      if (!target) return;

      // Lên một phần cao hơn màn hình thì dừng ở phần đuôi của nó, như cuộn tự nhiên.
      const to =
        dir > 0
          ? target.offsetTop
          : Math.max(target.offsetTop, target.offsetTop + target.offsetHeight - vh);

      busy = true;
      busyUntil = now + TRAVEL_MS;
      acc = 0;
      if (!reduceMotion.matches) playWhoosh();
      window.scrollTo({ top: to, behavior: reduceMotion.matches ? "instant" : "smooth" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return null;
}
