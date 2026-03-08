import React, { useState } from "react";
import { Palette, Wand2 } from "lucide-react";

interface AIPaletteProps {
  onApply: (bgColor: string, iconColor: string) => void;
}

const CURATED_PALETTES: { name: string; keywords: string[]; bg: string; icon: string }[] = [
  // Tech
  { name: "Midnight Dev", keywords: ["tech", "dev", "code", "software", "startup", "app"], bg: "#0f172a", icon: "#38bdf8" },
  { name: "Neon Terminal", keywords: ["tech", "hacker", "terminal", "cyber"], bg: "#000000", icon: "#00ff41" },
  { name: "Deep Purple Tech", keywords: ["tech", "ai", "machine", "future", "saas"], bg: "#1e1b4b", icon: "#a78bfa" },
  { name: "Electric Blue", keywords: ["tech", "cloud", "data", "digital"], bg: "#172554", icon: "#60a5fa" },
  // Creative
  { name: "Sunset Studio", keywords: ["creative", "design", "art", "studio", "agency"], bg: "#7c2d12", icon: "#fdba74" },
  { name: "Rose Canvas", keywords: ["creative", "beauty", "fashion", "pink"], bg: "#4c0519", icon: "#fb7185" },
  { name: "Lavender Dream", keywords: ["creative", "dream", "soft", "calm", "wellness"], bg: "#581c87", icon: "#e9d5ff" },
  { name: "Coral Pop", keywords: ["creative", "bold", "fun", "pop", "vibrant"], bg: "#fff1f2", icon: "#f43f5e" },
  // Nature / Green
  { name: "Forest Deep", keywords: ["nature", "eco", "green", "organic", "plant", "garden"], bg: "#14532d", icon: "#86efac" },
  { name: "Ocean Depth", keywords: ["ocean", "sea", "water", "marine", "blue", "aqua"], bg: "#0c4a6e", icon: "#7dd3fc" },
  { name: "Earth Tone", keywords: ["earth", "natural", "organic", "brown", "rustic"], bg: "#44403c", icon: "#d6d3d1" },
  { name: "Mint Fresh", keywords: ["fresh", "clean", "health", "mint", "medical"], bg: "#ecfdf5", icon: "#059669" },
  // Food / Warm
  { name: "Coffee Roast", keywords: ["coffee", "cafe", "food", "restaurant", "bakery", "warm"], bg: "#451a03", icon: "#fbbf24" },
  { name: "Tomato Kitchen", keywords: ["food", "restaurant", "italian", "pizza", "red"], bg: "#7f1d1d", icon: "#fca5a5" },
  { name: "Honey Gold", keywords: ["food", "honey", "sweet", "luxury", "premium", "gold"], bg: "#1c1917", icon: "#f59e0b" },
  // Business / Corporate
  { name: "Corporate Navy", keywords: ["business", "corporate", "finance", "bank", "legal", "consulting"], bg: "#1e3a5f", icon: "#ffffff" },
  { name: "Slate Professional", keywords: ["business", "professional", "enterprise", "formal"], bg: "#334155", icon: "#e2e8f0" },
  { name: "Trust Blue", keywords: ["trust", "security", "insurance", "reliable"], bg: "#1e40af", icon: "#bfdbfe" },
  // Bold / Minimal
  { name: "Pure Contrast", keywords: ["minimal", "clean", "simple", "black", "white", "mono"], bg: "#000000", icon: "#ffffff" },
  { name: "Inverted Mono", keywords: ["minimal", "light", "white", "bright"], bg: "#ffffff", icon: "#000000" },
  { name: "Brutalist Red", keywords: ["bold", "brutalist", "strong", "loud", "rebel"], bg: "#dc2626", icon: "#ffffff" },
  { name: "Acid Neon", keywords: ["neon", "rave", "music", "party", "club", "gaming"], bg: "#18181b", icon: "#a3e635" },
  // Playful
  { name: "Candy Shop", keywords: ["kids", "playful", "fun", "toy", "game", "colorful"], bg: "#ec4899", icon: "#fef08a" },
  { name: "Bubblegum", keywords: ["cute", "sweet", "kawaii", "pastel"], bg: "#fce7f3", icon: "#be185d" },
  // Education
  { name: "Scholar Blue", keywords: ["education", "school", "university", "learn", "study", "book"], bg: "#1e3a5f", icon: "#93c5fd" },
  { name: "Chalkboard", keywords: ["education", "teacher", "class", "school"], bg: "#1a2e1a", icon: "#f0fdf4" },
];

const matchPalettes = (query: string): typeof CURATED_PALETTES => {
  const q = query.toLowerCase().trim();
  if (!q) return CURATED_PALETTES.slice(0, 6);

  const scored = CURATED_PALETTES.map((p) => {
    let score = 0;
    const words = q.split(/\s+/);
    for (const word of words) {
      if (p.name.toLowerCase().includes(word)) score += 3;
      for (const kw of p.keywords) {
        if (kw.includes(word) || word.includes(kw)) score += 2;
      }
    }
    return { ...p, score };
  }).filter((p) => p.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.length > 0 ? scored.slice(0, 6) : CURATED_PALETTES.slice(0, 6);
};

const AIPalette: React.FC<AIPaletteProps> = ({ onApply }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof CURATED_PALETTES>([]);
  const [showResults, setShowResults] = useState(false);

  const generate = () => {
    setResults(matchPalettes(query));
    setShowResults(true);
  };

  return (
    <div className="border border-border p-5">
      <h2 className="font-mono text-xs uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">
        <Palette className="w-3.5 h-3.5" />
        AI Color Palette
      </h2>
      <p className="font-mono text-[10px] text-muted-foreground mb-3">
        Describe your brand or vibe to get matching color palettes
      </p>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="e.g. minimal coffee shop, tech startup, nature blog..."
          className="flex-1 bg-surface-elevated border border-border px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={generate}
          className="px-3 py-2 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center gap-1.5"
        >
          <Wand2 className="w-3 h-3" />
          Generate
        </button>
      </div>

      {showResults && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {results.map((p, i) => (
            <button
              key={i}
              onClick={() => onApply(p.bg, p.icon)}
              className="group border border-border hover:border-primary/50 p-3 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-sm border border-border/50 flex items-center justify-center" style={{ backgroundColor: p.bg }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.icon }} />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-foreground group-hover:text-primary transition-colors truncate">
                  {p.name}
                </span>
              </div>
              <div className="flex gap-1">
                <div className="flex-1 h-2 rounded-sm" style={{ backgroundColor: p.bg }} />
                <div className="flex-1 h-2 rounded-sm" style={{ backgroundColor: p.icon }} />
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && (
        <p className="font-mono text-[10px] text-muted-foreground text-center py-4">
          No matching palettes found. Try different keywords.
        </p>
      )}
    </div>
  );
};

export default AIPalette;
