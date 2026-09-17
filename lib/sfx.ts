"use client";

/**
 * Hiệu ứng âm thanh cho các thao tác trên trang — tổng hợp trực tiếp bằng Web
 * Audio API, không dùng file ngoài (không lo bản quyền, không thêm dung lượng
 * tải). AudioContext chỉ được tạo trong lúc xử lý một cử chỉ thật của người
 * dùng (bấm, vuốt) để không vi phạm chính sách autoplay của trình duyệt.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  if (!ctx) {
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function getNoiseBuffer(context: AudioContext) {
  if (!noiseBuffer) {
    const length = Math.floor(context.sampleRate * 0.4);
    noiseBuffer = context.createBuffer(1, length, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function play(build: (context: AudioContext, out: GainNode) => void) {
  const context = ensureCtx();
  if (!context || !master) return;
  build(context, master);
}

/** Tick ngắn, gọn — đổi ngôn ngữ, bấm bản đồ, các nút trong dock. */
export function playTick() {
  play((context, out) => {
    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.03);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
    osc.connect(gain).connect(out);
    osc.start(now);
    osc.stop(now + 0.06);
  });
}

/** Tiếng "cạch" chắc như đóng dấu vé — hoàn tất vuốt lên chuyến. */
export function playStamp() {
  play((context, out) => {
    const now = context.currentTime;

    const osc = context.createOscillator();
    const oscGain = context.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.exponentialRampToValueAtTime(0.6, now + 0.008);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(oscGain).connect(out);
    osc.start(now);
    osc.stop(now + 0.2);

    const noise = context.createBufferSource();
    noise.buffer = getNoiseBuffer(context);
    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 1200;
    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.35, now + 0.004);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    noise.connect(noiseFilter).connect(noiseGain).connect(out);
    noise.start(now);
    noise.stop(now + 0.08);
  });
}

/** Chime hai nốt rất nhẹ — xác nhận lưu vào lịch thành công. */
export function playChime() {
  play((context, out) => {
    const now = context.currentTime;
    [660, 880].forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.09;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
      osc.connect(gain).connect(out);
      osc.start(start);
      osc.stop(start + 0.24);
    });
  });
}

/** Whoosh rất khẽ khi chuyển sang phần kế tiếp. */
export function playWhoosh() {
  play((context, out) => {
    const now = context.currentTime;
    const noise = context.createBufferSource();
    noise.buffer = getNoiseBuffer(context);
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.28);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    noise.connect(filter).connect(gain).connect(out);
    noise.start(now);
    noise.stop(now + 0.32);
  });
}
