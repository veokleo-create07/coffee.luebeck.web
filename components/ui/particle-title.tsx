"use client";

import { useEffect, useRef, useState } from "react";

type RGB = [number, number, number];
type Box = { x: number; y: number; w: number; h: number };
type Field = { cx: number; cy: number; rx: number; ry: number };
type Mode = "smoke" | "vortex" | "sand" | "burst" | "sweep" | "absorb";
type Blob = { rgb: RGB; a: number; fx: number; fy: number; fw: number; fh: number };
type Palette = { ink: RGB; page: RGB; blobs: Blob[] };
type Cell = {
  x: number; y: number; w: number; h: number; nx: number; ny: number;
  r1: number; r2: number; r3: number; size: number; tx: number; ty: number; color: RGB; delay: number; bend: number;
};
type Phase = "text" | "gathering";

const MODES: Mode[] = ["smoke", "vortex", "sand", "burst", "sweep", "absorb"];
const TIMING = { travel: 2500 };
const PALETTE: Palette = {
  ink: [44, 33, 28],
  page: [245, 240, 232],
  blobs: [
    { rgb: [169, 139, 93], a: 0.5, fx: 0.04, fy: 0.08, fw: 0.62, fh: 0.78 },
    { rgb: [238, 225, 205], a: 0.72, fx: 0.44, fy: 0.22, fw: 0.54, fh: 0.7 },
    { rgb: [104, 112, 90], a: 0.24, fx: 0.3, fy: 0.44, fw: 0.44, fh: 0.56 },
  ],
};

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => { const x = clamp(t); return x * x * (3 - 2 * x); };
const ease = (t: number) => { const x = clamp(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

function createRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createModeBag(seed: number) {
  const random = createRng(seed);
  let bag: Mode[] = [];
  let previous: Mode | null = null;
  return () => {
    if (!bag.length) {
      bag = MODES.slice();
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag[bag.length - 1] === previous) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    previous = bag.pop() as Mode;
    return previous;
  };
}

function glowAt(palette: Palette, area: Box, x: number, y: number) {
  let strength = 0;
  let color = [...palette.page] as RGB;
  const radius = Math.hypot((x - (area.x + area.w / 2)) / (area.w / 2), (y - (area.y + area.h / 2)) / (area.h / 2));
  const rim = radius < 0.55 ? 1 : radius >= 1 ? 0 : 1 - (radius - 0.55) / 0.45;
  for (const blob of palette.blobs) {
    const bw = blob.fw * area.w, bh = blob.fh * area.h;
    const cx = area.x + blob.fx * area.w + bw / 2, cy = area.y + blob.fy * area.h + bh / 2;
    const amount = Math.max(0, 1 - Math.hypot((x - cx) / (bw / 2), (y - cy) / (bh / 2))) * blob.a * rim;
    color = color.map((value, i) => mix(value, blob.rgb[i], amount)) as RGB;
    strength = Math.max(strength, amount);
  }
  return { color, strength };
}

function sampleFieldPoint(random: () => number, field: Field, area: Box) {
  let best = { x: field.cx, y: field.cy, color: PALETTE.page, strength: 0 };
  for (let i = 0; i < 4; i++) {
    const angle = random() * Math.PI * 2;
    const radius = Math.pow(random(), 0.6);
    const x = field.cx + Math.cos(angle) * field.rx * radius;
    const y = field.cy + Math.sin(angle) * field.ry * radius;
    const glow = glowAt(PALETTE, area, x, y);
    if (glow.strength > best.strength) best = { x, y, color: glow.color, strength: glow.strength };
  }
  return best;
}

function pathFor(mode: Mode, p: Cell, width: number, height: number) {
  switch (mode) {
    case "smoke": return { delay: (1 - p.ny) * 0.35 + p.r3 * 0.25, bend: (p.r1 - 0.5) * 150 };
    case "vortex": return { delay: (Math.hypot(p.x - width / 2, p.y - height / 2) / Math.max(1, width)) * 0.9 + p.r3 * 0.15, bend: (p.r2 > 0.5 ? 1 : -1) * (90 + p.r1 * 140) };
    case "sand": return { delay: p.nx * 0.6 + p.r3 * 0.18, bend: (p.r1 - 0.5) * 60 };
    case "burst": return { delay: p.r3 * 0.1, bend: (p.r2 - 0.5) * 26 };
    case "sweep": return { delay: (1 - p.nx) * 0.6 + p.r3 * 0.18, bend: -(60 + p.r1 * 90) };
    default: return { delay: p.r1 * 0.55, bend: (p.r2 - 0.5) * 100 };
  }
}

function curve(from: [number, number], to: [number, number], bend: number, progress: number) {
  const t = ease(progress), dx = to[0] - from[0], dy = to[1] - from[1], length = Math.hypot(dx, dy) || 1;
  const bow = Math.sin(t * Math.PI) * bend;
  return [mix(from[0], to[0], t) - (dy / length) * bow, mix(from[1], to[1], t) + (dx / length) * bow, t] as const;
}

function createEngine(canvas: HTMLCanvasElement, text: string): { destroy: () => void; setActive: (active: boolean) => void; resize: () => void } | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const textCanvas = document.createElement("canvas");
  const nextMode = createModeBag((Date.now() & 0xffff) ^ 0x5a5a);
  let width = 0, height = 0, dpr = 1, cells: Cell[] = [];
  let area: Box = { x: 0, y: 0, w: 0, h: 0 };
  let field: Field = { cx: 0, cy: 0, rx: 0, ry: 0 };
  let phase: Phase = "gathering", mode = nextMode(), started = 0, raf = 0;
  let active = false, initialized = false, destroyed = false;

  const seedField = () => {
    const random = createRng((Math.random() * 1e9) | 0);
    for (const cell of cells) {
      const point = sampleFieldPoint(random, field, area);
      cell.tx = point.x; cell.ty = point.y; cell.color = point.color;
    }
  };

  const build = () => {
    width = canvas.clientWidth; height = canvas.clientHeight;
    if (!width || !height) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(width * dpr)); canvas.height = Math.max(1, Math.round(height * dpr));
    textCanvas.width = canvas.width; textCanvas.height = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const textCtx = textCanvas.getContext("2d");
    if (!textCtx) return;
    textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    textCtx.clearRect(0, 0, width, height);
    const styles = getComputedStyle(canvas);
    const fontSize = Number.parseFloat(styles.fontSize) || 42;
    const family = styles.fontFamily || "sans-serif";
    textCtx.font = `500 ${fontSize}px ${family}`;
    textCtx.textAlign = "center"; textCtx.textBaseline = "middle"; textCtx.fillStyle = `rgba(${PALETTE.ink.join(",")},.96)`;

    const words = text.split(/\s+/);
    const maxLineWidth = width * 0.96;
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && textCtx.measureText(candidate).width > maxLineWidth) {
        lines.push(line); line = word;
      } else line = candidate;
    }
    if (line) lines.push(line);
    const lineHeight = fontSize * 0.94;
    const firstY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((value, index) => textCtx.fillText(value, width / 2, firstY + index * lineHeight, maxLineWidth));

    area = { x: 0, y: 0, w: width, h: height };
    field = { cx: width / 2, cy: height / 2, rx: Math.min(560, width * 0.4), ry: Math.min(260, height * 0.3) };
    const pixels = textCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    let step = Math.max(2, Math.round(3 * dpr));
    let points: Array<[number, number, number, number]> = [];
    const scan = () => {
      points = [];
      for (let y = 0; y < canvas.height; y += step) for (let x = 0; x < canvas.width; x += step) {
        const w = Math.min(step, canvas.width - x), h = Math.min(step, canvas.height - y);
        let visible = false;
        for (let yy = y; yy < y + h && !visible; yy++) for (let xx = x; xx < x + w; xx++) if (pixels[(yy * canvas.width + xx) * 4 + 3] > 0) { visible = true; break; }
        if (visible) points.push([x, y, w, h]);
      }
    };
    scan();
    while (points.length > 2400) { step++; scan(); }
    let minX = Infinity, maxX = -Infinity;
    for (const point of points) { const x = (point[0] + point[2] / 2) / dpr; minX = Math.min(minX, x); maxX = Math.max(maxX, x); }
    const random = createRng(7);
    cells = points.map((point) => {
      const x = (point[0] + point[2] / 2) / dpr, y = (point[1] + point[3] / 2) / dpr;
      const chance = random();
      return {
        x, y, w: point[2] / dpr, h: point[3] / dpr,
        nx: (x - minX) / Math.max(1, maxX - minX), ny: y / Math.max(1, height),
        r1: random(), r2: random(), r3: random(), size: chance < 0.62 ? 1 + random() : chance < 0.9 ? 2 + random() * 1.5 : 3.5 + random() * 2.5,
        tx: 0, ty: 0, color: PALETTE.page, delay: 0, bend: 0,
      };
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedField();
  };

  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const drawText = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(textCanvas, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const frame = (now: number) => {
    raf = 0;
    const progress = clamp((now - started) / TIMING.travel), outward = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const cell of cells) {
      const path = pathFor(mode, cell, width, height);
      cell.delay = path.delay; cell.bend = path.bend;
      const local = clamp((progress - path.delay * 0.55) / 0.45);
      const alpha = outward ? 1 - smooth(local / 0.18) : smooth((local - 0.82) / 0.18);
      if (alpha <= 0.002) continue;
      ctx.globalAlpha = alpha;
      ctx.drawImage(textCanvas, (cell.x - cell.w / 2) * dpr, (cell.y - cell.h / 2) * dpr, cell.w * dpr, cell.h * dpr, (cell.x - cell.w / 2) * dpr, (cell.y - cell.h / 2) * dpr, cell.w * dpr, cell.h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const cell of cells) {
      const local = clamp((progress - cell.delay * 0.55) / 0.45);
      if (local <= 0 || local >= 1) continue;
      const from: [number, number] = outward ? [cell.x, cell.y] : [cell.tx, cell.ty];
      const to: [number, number] = outward ? [cell.tx, cell.ty] : [cell.x, cell.y];
      const point = curve(from, to, outward ? cell.bend : -cell.bend, local);
      const fade = outward ? 1 - smooth((local - 0.85) / 0.15) : smooth(local / 0.15) * (1 - smooth((local - 0.82) / 0.18));
      const alpha = (0.12 + 0.88 * (1 - smooth((point[2] - 0.45) / 0.55))) * fade;
      if (alpha <= 0.004) continue;
      const channel = (i: number) => Math.round(mix(PALETTE.ink[i], cell.color[i], smooth(point[2] / 0.6)));
      ctx.globalAlpha = Math.min(1, alpha); ctx.fillStyle = `rgb(${channel(0)},${channel(1)},${channel(2)})`;
      ctx.beginPath(); ctx.arc(point[0], point[1], (cell.size * mix(1, 1.7, smooth(point[2]))) / 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (progress < 1) raf = requestAnimationFrame(frame);
    else { phase = "text"; drawText(); }
  };

  function enter(next: Phase) {
    phase = next; started = performance.now(); stop();
    if (!active || destroyed) return;
    if (next === "text") drawText();
    else frame(performance.now());
  }

  return {
    setActive(on) {
      if (on === active || destroyed) return;
      active = on;
      if (!on) stop();
      else {
        if (!initialized) { build(); initialized = true; }
        enter(phase);
      }
    },
    resize() {
      if (destroyed || !initialized) return;
      stop(); build();
      if (phase === "text") drawText();
      else if (active) enter(phase);
    },
    destroy() { destroyed = true; active = false; stop(); },
  };
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduce;
}

export interface ParticleTitleProps {
  text: string;
  className?: string;
  id?: string;
}

/** A responsive, brand-colored particle title that pauses off-screen and respects reduced motion. */
export function ParticleTitle({ text, className = "", id }: ParticleTitleProps) {
  const reduce = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (reduce || !canvas) return;
    const engine = createEngine(canvas, text);
    if (!engine) return;
    let visible = false;
    let size = `${canvas.clientWidth}x${canvas.clientHeight}`;
    const sync = () => engine.setActive(visible);
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1]?.isIntersecting ?? false;
      sync();
      if (visible) intersection.disconnect();
    }, { rootMargin: "0px 0px 18% 0px", threshold: 0.01 });
    intersection.observe(canvas);
    let resizeTimer = 0;
    const resize = new ResizeObserver(() => {
      const next = `${canvas.clientWidth}x${canvas.clientHeight}`;
      if (next === size) return;
      size = next;
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => engine.resize(), 200);
    });
    resize.observe(canvas);
    return () => {
      clearTimeout(resizeTimer); intersection.disconnect(); resize.disconnect(); engine.destroy();
    };
  }, [reduce, text]);

  const blobPositions = ["left-[4%] top-[8%] h-[78%] w-[62%]", "left-[44%] top-[22%] h-[70%] w-[54%]", "left-[30%] top-[44%] h-[56%] w-[44%]"];

  return (
    <div className={`particle-title relative isolate flex h-full min-h-[190px] w-full items-center justify-center overflow-hidden ${className}`}>
      {!reduce && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ WebkitMaskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)", maskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)" }}>
            {PALETTE.blobs.map((blob, index) => <div key={index} className={`absolute rounded-full ${blobPositions[index]}`} style={{ background: `radial-gradient(closest-side, rgba(${blob.rgb.join(",")},${blob.a}), rgba(${blob.rgb.join(",")},0) 100%)` }} />)}
          </div>
          <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
        </>
      )}
      <h2
        id={id}
        className={reduce ? "relative z-10 m-0 w-full px-2 text-center font-medium leading-[0.94]" : "absolute m-[-1px] h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]"}
        style={{ color: `rgb(${PALETTE.ink.join(",")})` }}
      >
        {text}
      </h2>
    </div>
  );
}

export default ParticleTitle;
