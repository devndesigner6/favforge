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
    label: "Tech & Dev",
    icons: [
      "⚡", "💻", "🖥️", "📱", "⌨️", "🖱️", "💾", "📡", "🔌", "🛰️", "🤖", "🧠",
      "⚙️", "🔧", "🔗", "📊", "🌐", "📶", "🔋", "💡", "🖨️", "📀", "🔬", "🧪",
      "📐", "🧮", "🏗️", "⛓️", "🔩", "🛠️", "📈", "📉",
    ],
  },
  business: {
    label: "Business",
    icons: [
      "💼", "📋", "🏢", "💰", "💳", "📊", "📈", "🤝", "🏦", "📧", "✉️", "📨",
      "🗂️", "📁", "🗄️", "💵", "🪙", "📑", "🧾", "📝", "✅", "📅", "🗓️", "⏰",
      "🔔", "📣", "🎤", "🏷️", "🪪", "📞", "☎️", "📠",
    ],
  },
  creative: {
    label: "Creative",
    icons: [
      "🎨", "✏️", "🖌️", "🖍️", "📸", "🎬", "🎭", "🎵", "🎶", "🎹", "🎸", "🎺",
      "🎻", "🥁", "🎙️", "📷", "📹", "🎞️", "🖼️", "✂️", "📏", "📐", "🧵", "🪡",
      "🧶", "💅", "🎪", "🎠", "🎡", "🎢", "🫧", "✨",
    ],
  },
  nature: {
    label: "Nature",
    icons: [
      "🌿", "🌸", "🍀", "🌊", "🔥", "❄️", "🌙", "☀️", "⭐", "🌈", "🍃", "🌲",
      "🏔️", "🌻", "🦋", "🐝", "🌵", "🌴", "🍁", "🌾", "🪴", "🌺", "💐", "🌹",
      "🌷", "🪷", "🍂", "🌱", "🐚", "🪸", "🐾", "🦜",
    ],
  },
  food: {
    label: "Food & Drink",
    icons: [
      "☕", "🍕", "🍔", "🌮", "🍜", "🍣", "🧁", "🍩", "🍷", "🥐", "🍎", "🥑",
      "🍋", "🫐", "🧀", "🍪", "🍰", "🎂", "🍫", "🍬", "🍭", "🧇", "🥞", "🍳",
      "🥗", "🍱", "🥤", "🧃", "🍺", "🥂", "🫖", "🧊",
    ],
  },
  travel: {
    label: "Travel",
    icons: [
      "✈️", "🚀", "🚗", "🚢", "🏠", "🏰", "⛺", "🗺️", "🧭", "🌍", "🌎", "🌏",
      "🗼", "🗽", "🏛️", "⛩️", "🕌", "🛕", "🏖️", "🏝️", "🚂", "🚁", "⛵", "🏕️",
      "🎒", "🧳", "🛤️", "🛣️", "⛰️", "🌋", "🏜️", "🗻",
    ],
  },
  gaming: {
    label: "Gaming",
    icons: [
      "🎮", "🕹️", "👾", "🎲", "♟️", "🃏", "🀄", "🎰", "🏆", "🥇", "🥈", "🥉",
      "🎳", "🏀", "⚽", "🏈", "⚾", "🎾", "🏐", "🏓", "🥊", "🎯", "⛳", "🏹",
      "🛹", "🏄", "🚴", "🤺", "🏊", "⛷️", "🎿", "🏋️",
    ],
  },
  animals: {
    label: "Animals",
    icons: [
      "🐱", "🐶", "🦊", "🐻", "🐼", "🦁", "🐯", "🦄", "🐸", "🐙", "🦀", "🐠",
      "🐳", "🦈", "🦅", "🦉", "🐧", "🦩", "🦚", "🐺", "🦎", "🐍", "🦂", "🕷️",
      "🐝", "🐞", "🦋", "🐛", "🐌", "🐢", "🦑", "🐬",
    ],
  },
  symbols: {
    label: "Symbols",
    icons: [
      "◆", "●", "▲", "■", "◇", "○", "△", "□", "★", "♦", "♠", "♣",
      "♥", "✦", "✧", "⬡", "◉", "◎", "▼", "►", "◄", "⬢", "⬣", "⬤",
      "☆", "♤", "♡", "♢", "⊕", "⊗", "⊙", "⊛",
    ],
  },
  letters: {
    label: "Letters",
    icons: [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
      "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
      "Y", "Z", "0", "1", "2", "3", "&", "@",
    ],
  },
  health: {
    label: "Health",
    icons: [
      "❤️", "💚", "💙", "💜", "🧡", "💛", "🤍", "🖤", "💪", "🧘", "🏃", "🚶",
      "🩺", "💊", "🩹", "🏥", "🧬", "🩸", "🫀", "🫁", "🧖", "🛁", "😊", "😎",
      "🥰", "🤗", "😌", "🙏", "👁️", "👀", "🦷", "🦴",
    ],
  },
  education: {
    label: "Education",
    icons: [
      "📚", "📖", "📕", "📗", "📘", "📙", "🎓", "🏫", "📝", "✍️", "🖊️", "🖋️",
      "📓", "📒", "📔", "🗒️", "🔖", "📎", "📍", "🗑️", "🔍", "🔎", "💡", "🧩",
      "🗃️", "📂", "🗝️", "🔐", "🔒", "📜", "🪶", "📃",
    ],
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
              "px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-widest border transition-all",
              key === category
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
        {currentCategory.icons.map((icon, idx) => (
          <button
            key={`${icon}-${idx}`}
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
      <div className="mt-2 font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
        {currentCategory.icons.length} icons in {currentCategory.label}
      </div>
    </div>
  );
};

export default IconPicker;
