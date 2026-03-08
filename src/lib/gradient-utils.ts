import type { BgType } from "@/hooks/use-undo-redo";

/**
 * Create a canvas-compatible gradient fill for the given bg settings.
 * Returns either a CanvasGradient or a solid color string.
 */
export function createBgFill(
  ctx: CanvasRenderingContext2D,
  size: number,
  bgType: BgType,
  bgColor: string,
  bgColor2: string,
  gradientAngle: number
): string | CanvasGradient {
  if (bgType === "solid") return bgColor;

  if (bgType === "radial") {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, bgColor);
    g.addColorStop(1, bgColor2);
    return g;
  }

  // linear
  const rad = (gradientAngle * Math.PI) / 180;
  const half = size / 2;
  const x1 = half - Math.cos(rad) * half;
  const y1 = half - Math.sin(rad) * half;
  const x2 = half + Math.cos(rad) * half;
  const y2 = half + Math.sin(rad) * half;
  const g = ctx.createLinearGradient(x1, y1, x2, y2);
  g.addColorStop(0, bgColor);
  g.addColorStop(1, bgColor2);
  return g;
}
