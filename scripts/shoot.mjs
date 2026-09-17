// Chụp màn hình và đo bố cục của trang đang chạy ở dev server.
// Dùng: node scripts/shoot.mjs [thư-mục-ra] [tiền-tố]
//   SHOOT_SIZES="390x844,1280x720"  các kích thước màn hình (rộng x cao)
//   SHOOT_MODE=measure               chỉ đo, không chụp
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const URL = process.env.SHOOT_URL ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "shots";
const PREFIX = process.argv[3] ?? "shot";
const MODE = process.env.SHOOT_MODE ?? "full";
const SIZES = (process.env.SHOOT_SIZES ?? "390x844,768x1024,1280x720,1600x900")
  .split(",")
  .map((s) => s.split("x").map(Number));

if (MODE !== "measure") mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

for (const [width, height] of SIZES) {
  const tag = `${width}x${height}`;
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // Mỗi phần phải vừa đúng một màn hình.
  const heights = await page.$$eval("main > section", (els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().height)),
  );
  const report = heights
    .map((h, i) => `s${i}:${h}${h > height + 1 ? `(+${h - height})` : ""}`)
    .join(" ");
  const overflowX = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  console.log(`${tag}  ${report}${overflowX ? "  !! tràn ngang" : ""}`);

  // Một nấc lăn chuột phải đưa tới đúng đầu phần kế tiếp.
  const tops = await page.$$eval("main > section", (els) =>
    els.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY)),
  );
  await page.mouse.move(width / 2, height / 2);
  const landed = [];
  for (let i = 1; i < Math.min(tops.length, 4); i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(1100);
    landed.push(Math.round(await page.evaluate(() => window.scrollY)));
  }
  const expected = tops.slice(1, 1 + landed.length);
  const snapOk = landed.every((y, i) => Math.abs(y - expected[i]) <= 2);
  console.log(`${tag}  snap ${snapOk ? "OK" : "SAI"}  landed=${landed} expected=${expected}`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);

  // Bàn phím: PageDown cũng phải đi đúng từng phần.
  await page.locator("body").focus();
  const keyed = [];
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(1100);
    keyed.push(Math.round(await page.evaluate(() => window.scrollY)));
  }
  const keyOk = keyed.every((y, i) => Math.abs(y - tops[i + 1]) <= 2);
  console.log(`${tag}  pagedown ${keyOk ? "OK" : "SAI"}  landed=${keyed}`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

  if (MODE === "measure") {
    await page.close();
    continue;
  }

  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, `${PREFIX}-${width}-hero.png`) });

  // Ghé qua từng phần để IntersectionObserver hiện nội dung, rồi chụp riêng từng phần.
  // Ẩn các lớp fixed (dock, thanh tiến trình, nút ngôn ngữ, huy hiệu dev) vì khi chụp
  // theo phần tử chúng bị dính vào giữa ảnh.
  const sections = await page.locator("main > section").all();
  for (const section of sections) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(600);
  const hideFixed = await page.addStyleTag({
    content: ".fixed, nextjs-portal { visibility: hidden !important; transition: none !important; }",
  });
  for (const [i, section] of sections.entries()) {
    await section.screenshot({ path: join(OUT, `${PREFIX}-${width}-s${i}.png`) });
  }
  await hideFixed.evaluate((el) => el.remove());

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.click('[role="button"][aria-label]');
  await page.waitForTimeout(1600);
  await page.screenshot({ path: join(OUT, `${PREFIX}-${width}-boarded.png`) });

  await page.close();
}

await browser.close();
