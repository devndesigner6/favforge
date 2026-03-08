import React from "react";
import { cn } from "@/lib/utils";
import type { BgType } from "@/hooks/use-undo-redo";

interface GradientPickerProps {
  bgType: BgType;
  bgColor: string;
  bgColor2: string;
  gradientAngle: number;
  onBgTypeChange: (type: BgType) => void;
  onBgColor2Change: (color: string) => void;
  onGradientAngleChange: (angle: number) => void;
}

const COLOR2_PRESETS = [
  "#e94560", "#533483", "#2a9d8f", "#f4a261",
  "#ef233c", "#06d6a0", "#118ab2", "#ffd166",
  "#8338ec", "#3a86ff", "#fb5607", "#ffbe0b",
];

const ANGLE_PRESETS = [0, 45, 90, 135, 180, 225, 270, 315];

const GradientPicker: React.FC<GradientPickerProps> = ({
  bgType,
  bgColor,
  bgColor2,
  gradientAngle,
  onBgTypeChange,
  onBgColor2Change,
  onGradientAngleChange,
}) => {
  const types: { value: BgType; label: string }[] = [
    { value: "solid", label: "Solid" },
    { value: "linear", label: "Linear" },
    { value: "radial", label: "Radial" },
  ];

  const previewGradient = (type: BgType) => {
    if (type === "solid") return bgColor;
    if (type === "linear") return `linear-gradient(${gradientAngle}deg, ${bgColor}, ${bgColor2})`;
    return `radial-gradient(circle, ${bgColor}, ${bgColor2})`;
  };

  return (
    <div>
      <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
        Background Type
      </h2>

      {/* Type selector */}
      <div className="flex gap-2 mb-4">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => onBgTypeChange(t.value)}
            className={cn(
              "flex-1 py-2 px-3 border font-mono text-[10px] uppercase tracking-widest transition-all",
              bgType === t.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/30"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Gradient preview strip */}
      {bgType !== "solid" && (
        <>
          <div
            className="w-full h-8 rounded-sm border border-border mb-4"
            style={{ background: previewGradient(bgType) }}
          />

          {/* Second color */}
          <div className="mb-4">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
              Second Color
            </label>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 flex-wrap">
                {COLOR2_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onBgColor2Change(color)}
                    className={cn(
                      "w-7 h-7 rounded-sm border-2 transition-all hover:scale-110",
                      bgColor2 === color ? "border-foreground shadow-md" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={bgColor2}
                onChange={(e) => onBgColor2Change(e.target.value)}
                className="w-8 h-8 cursor-pointer rounded-sm border border-border bg-transparent"
              />
            </div>
          </div>

          {/* Angle (linear only) */}
          {bgType === "linear" && (
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Angle — {gradientAngle}°
              </label>
              <div className="flex gap-1.5 flex-wrap mb-2">
                {ANGLE_PRESETS.map((a) => (
                  <button
                    key={a}
                    onClick={() => onGradientAngleChange(a)}
                    className={cn(
                      "w-9 h-7 rounded-sm border font-mono text-[9px] transition-all",
                      gradientAngle === a
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    )}
                  >
                    {a}°
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={gradientAngle}
                onChange={(e) => onGradientAngleChange(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GradientPicker;
