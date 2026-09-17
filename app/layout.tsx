import type { Metadata, Viewport } from "next";
import { Unbounded, Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import { EVENT } from "@/lib/content";
import "./globals.css";

// Chữ bè ngang hình học — cùng họ với kiểu chữ trong deck ZARYA, có subset vietnamese.
const unbounded = Unbounded({
  subsets: ["latin", "vietnamese"],
  variable: "--font-unbounded",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Thiệp mời tốt nghiệp · ${EVENT.graduateName}`,
  description:
    "Mình sắp tốt nghiệp, và mình rất mong có bạn ở đó. / I am graduating, and I would love you there.",
  openGraph: {
    title: `Thiệp mời tốt nghiệp · ${EVENT.graduateName}`,
    description: "Mở tấm vé để xem lời mời.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  // Never block zoom — guests will pinch to read the address.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${unbounded.variable} ${beVietnam.variable} ${jetbrains.variable}`}>
      <head>
        {/* Nội dung mặc định ẩn rồi mới hiện dần bằng IntersectionObserver.
            Nếu JS không chạy, khối này bỏ trạng thái ẩn để chữ không bị mắc kẹt.
            Dùng <noscript> chứ không dùng script sửa class trên <html>: sửa DOM
            trước khi React hydrate sẽ gây hydration mismatch. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.spine{transform:scaleY(1)!important}.spine-x{transform:scaleX(1)!important}`}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
