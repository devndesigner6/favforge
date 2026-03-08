import React from "react";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (icon: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
}

const ICON_CATEGORIES: Record<string, { label: string; icons: string[] }> = {
  tech: {
    label: "Tech",
    icons: ["⚡", "💻", "🖥️", "📱", "⌨️", "🖱️", "💾", "📡", "🔌", "🛰️", "🤖", "🧠", "⚙️", "🔧", "🔗", "📊"],
  },
  nature: {
    label: "Nature",
    icons: ["🌿", "🌸", "🍀", "🌊", "🔥", "❄️", "🌙", "☀️", "⭐", "🌈", "🍃", "🌲", "🏔️", "🌻", "🦋", "🐝"],
  },
  objects: {
    label: "Objects",
    icons: ["📦", "🎯", "🏷️", "📌", "✏️", "🎨", "🔮", "💎", "🏆", "🎪", "🎲", "🧩", "🔑", "🛡️", "⚓", "🧭"],
  },
  symbols: {
    label: "Symbols",
    icons: ["◆", "●", "▲", "■", "◇", "○", "△", "□", "★", "♦", "♠", "♣", "♥", "✦", "✧", "⬡"],
  },
  letters: {
    label: "Letters",
    icons: ["A", "B", "C", "D", "E", "F", "G", "H", "K", "L", "M", "N", "P", "R", "S", "X"],
  },
  food: {
    label: "Food",
    icons: ["☕", "🍕", "🍔", "🌮", "🍜", "🍣", "🧁", "🍩", "🍷", "🥐", "🍎", "🥑", "🍋", "🫐", "🧀", "🍪"],
  },
};

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect, category, onCategoryChange }) => {
  const currentCategory = ICON_CATEGORIES[category] || ICON_CATEGORIES.tech;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {Object.entries(ICON_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key)}
            className={cn(
              "px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border transition-all",
              key === category
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1.5">
        {currentCategory.icons.map((icon) => (
          <button
            key={icon}
            onClick={() => onSelect(icon)}
            className={cn(
              "w-10 h-10 flex items-center justify-center text-lg border transition-all hover:scale-110",
              icon === selectedIcon
                ? "bg-primary/10 border-primary shadow-sm"
                : "bg-surface-elevated border-border hover:border-foreground/30"
            )}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconPicker;
