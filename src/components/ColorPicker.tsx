import React from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, presets }) => {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {presets.map((color) => (
            <button
              key={color}
              onClick={() => onChange(color)}
              className={cn(
                "w-7 h-7 rounded-sm border-2 transition-all hover:scale-110",
                value === color ? "border-foreground shadow-md" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 cursor-pointer rounded-sm border border-border bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
