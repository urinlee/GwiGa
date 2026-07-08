"use client";
import { cn } from "@/lib/cn";
import { Check, Pipette } from "lucide-react";
import { useMemo, useRef, useState } from "react";

/* ---------- color math ---------- */

interface RGB {
  r: number;
  g: number;
  b: number;
}
interface HSV {
  h: number; // 0..360
  s: number; // 0..1
  v: number; // 0..1
}

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

function hsvToRgb({ h, s, v }: HSV): RGB {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => clamp(n, 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace(/^#/, "");
  const full =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  const int = parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

/* ---------- eyedropper (modern browsers) ---------- */

interface EyeDropperResult {
  sRGBHex: string;
}
interface EyeDropperConstructor {
  new (): { open: () => Promise<EyeDropperResult> };
}

/* ---------- component ---------- */

const DEFAULT_PRESETS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
  "#000000",
  "#6B7280",
  "#FFFFFF",
];

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  presets?: string[];
}

export function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
}: ColorPickerProps) {
  // HSV is the source of truth for smooth dragging.
  const [hsv, setHsv] = useState<HSV>(() => {
    const rgb = hexToRgb(value) ?? { r: 0, g: 0, b: 0 };
    return rgbToHsv(rgb);
  });
  const [hexText, setHexText] = useState(value.toUpperCase());

  const hex = useMemo(() => rgbToHex(hsvToRgb(hsv)), [hsv]);

  const satRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const commit = (next: HSV) => {
    setHsv(next);
    const nextHex = rgbToHex(hsvToRgb(next));
    setHexText(nextHex);
    onChange(nextHex);
  };

  const moveSat = (clientX: number, clientY: number) => {
    const rect = satRef.current?.getBoundingClientRect();
    if (!rect) return;
    commit({
      ...hsv,
      s: clamp((clientX - rect.left) / rect.width),
      v: 1 - clamp((clientY - rect.top) / rect.height),
    });
  };

  const moveHue = (clientX: number) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    commit({ ...hsv, h: clamp((clientX - rect.left) / rect.width) * 360 });
  };

  const handleHexChange = (raw: string) => {
    const text = raw.startsWith("#") ? raw : `#${raw}`;
    setHexText(text.toUpperCase());
    const rgb = hexToRgb(text);
    if (rgb) {
      const next = rgbToHsv(rgb);
      setHsv(next);
      onChange(rgbToHex(rgb));
    }
  };

  const pickPreset = (preset: string) => {
    const rgb = hexToRgb(preset);
    if (!rgb) return;
    commit(rgbToHsv(rgb));
  };

  const openEyeDropper = async () => {
    const Ctor = (window as unknown as { EyeDropper?: EyeDropperConstructor })
      .EyeDropper;
    if (!Ctor) return;
    try {
      const { sRGBHex } = await new Ctor().open();
      handleHexChange(sRGBHex);
    } catch {
      /* user cancelled */
    }
  };

  const hueColor = rgbToHex(hsvToRgb({ h: hsv.h, s: 1, v: 1 }));
  const hasEyeDropper =
    typeof window !== "undefined" && "EyeDropper" in window;

  return (
    <div className="flex w-72 flex-col gap-4 select-none">
      {/* saturation / value panel */}
      <div
        ref={satRef}
        className="relative h-44 w-full cursor-crosshair rounded-xl"
        style={{ backgroundColor: hueColor }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          moveSat(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            moveSat(e.clientX, e.clientY);
        }}
      >
        <div className="absolute inset-0 rounded-xl bg-[linear-gradient(to_right,#fff,transparent)]" />
        <div className="absolute inset-0 rounded-xl bg-[linear-gradient(to_top,#000,transparent)]" />
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: hex,
          }}
        />
      </div>

      {/* hue slider */}
      <div
        ref={hueRef}
        className="relative h-3.5 w-full cursor-pointer rounded-full bg-[linear-gradient(to_right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)]"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          moveHue(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            moveHue(e.clientX);
        }}
      >
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
          style={{ left: `${(hsv.h / 360) * 100}%`, backgroundColor: hueColor }}
        />
      </div>

      {/* preview + hex + eyedropper */}
      <div className="flex items-center gap-2">
        <div
          className="h-10 w-10 shrink-0 rounded-lg border border-black/10 dark:border-white/15"
          style={{ backgroundColor: hex }}
        />
        <div className="flex flex-1 items-center rounded-lg border border-zinc-300 px-2.5 focus-within:border-zinc-500 dark:border-zinc-600 dark:focus-within:border-zinc-400">
          <span className="text-sm font-semibold text-zinc-400">#</span>
          <input
            value={hexText.replace(/^#/, "")}
            onChange={(e) => handleHexChange(e.target.value)}
            maxLength={6}
            spellCheck={false}
            className="w-full bg-transparent py-2 pl-1 text-sm font-semibold tracking-wide text-zinc-800 uppercase outline-none dark:text-zinc-100"
          />
        </div>
        {hasEyeDropper && (
          <button
            type="button"
            aria-label="화면에서 색 추출"
            onClick={openEyeDropper}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-300 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
          >
            <Pipette size={18} />
          </button>
        )}
      </div>

      {/* presets */}
      <div className="grid grid-cols-8 gap-2">
        {presets.map((preset) => {
          const selected = preset.toUpperCase() === hex;
          return (
            <button
              key={preset}
              type="button"
              aria-label={preset}
              onClick={() => pickPreset(preset)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-md border border-black/10 transition-transform hover:scale-110 dark:border-white/15",
                selected && "ring-2 ring-zinc-800 ring-offset-1 dark:ring-white dark:ring-offset-zinc-900"
              )}
              style={{ backgroundColor: preset }}
            >
              {selected && (
                <Check
                  size={14}
                  strokeWidth={3}
                  className={
                    rgbToHsv(hexToRgb(preset) ?? { r: 0, g: 0, b: 0 }).v > 0.6
                      ? "text-black/70"
                      : "text-white"
                  }
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
