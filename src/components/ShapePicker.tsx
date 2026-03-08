import React from "react";
import { cn } from "@/lib/utils";

interface ShapePickerProps {
  value: "square" | "rounded" | "circle";
  onChange: (shape: "square" | "rounded" | "circle") => void;
}

const shapes: { value: "square" | "rounded" | "circle"; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
];

const ShapePicker: React.FC<ShapePickerProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
        Shape
      </label>
      <div className="flex gap-2">
        {shapes.map((s) => (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border font-mono text-[10px] uppercase tracking-widest transition-all",
              value === s.value
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 bg-current",
                s.value === "circle" && "rounded-full",
                s.value === "rounded" && "rounded-sm",
              )}
            />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShapePicker;
