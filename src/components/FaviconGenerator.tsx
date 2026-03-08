import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import FaviconCanvas from "@/components/FaviconCanvas";
import IconPicker from "@/components/IconPicker";
import ColorPicker from "@/components/ColorPicker";
import ShapePicker from "@/components/ShapePicker";
import ImageUpload from "@/components/ImageUpload";
import { Download, RotateCcw, Sparkles, FileImage } from "lucide-react";
import { generateICO, renderFaviconToImageData } from "@/lib/ico-generator";

const BG_PRESETS = [
  "#1a1a2e", "#16213e", "#0f3460", "#e94560",
  "#533483", "#2b2d42", "#ef233c", "#f8f9fa",
  "#264653", "#2a9d8f", "#e9c46a", "#f4a261",
  "#000000", "#ffffff", "#1b4332", "#ff6b35",
];

const ICON_PRESETS = [
  "#ffffff", "#000000", "#e94560", "#f8f9fa",
  "#ffd166", "#06d6a0", "#118ab2", "#ef476f",
  "#2a9d8f", "#e9c46a", "#264653", "#ff6b35",
  "#8338ec", "#3a86ff", "#fb5607", "#ffbe0b",
];

const FaviconGenerator: React.FC = () => {
  const [icon, setIcon] = useState("⚡");
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [iconColor, setIconColor] = useState("#ffffff");
  const [shape, setShape] = useState<"square" | "rounded" | "circle">("rounded");
  const [category, setCategory] = useState("tech");
  const [fontSize, setFontSize] = useState(38);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const resetAll = () => {
    setIcon("⚡");
    setBgColor("#1a1a2e");
    setIconColor("#ffffff");
    setShape("rounded");
    setCategory("tech");
    setFontSize(38);
    setCustomImage(null);
  };

  const randomize = () => {
    setCustomImage(null);
    const categories = ["tech", "business", "creative", "nature", "food", "travel", "gaming", "animals", "symbols", "letters", "health", "education"];
    const allIcons = [
      "⚡","💻","🖥️","📱","🤖","🧠","⚙️","🔧","🌐","💡","📈","📉",
      "💼","📋","🏢","💰","💳","🤝","🏦","📧","✅","📅","🔔","📣",
      "🎨","✏️","🖌️","📸","🎬","🎵","🎶","🎹","🎸","📷","🖼️","✨",
      "🌿","🌸","🍀","🌊","🔥","❄️","🌙","☀️","⭐","🌈","🌲","🦋",
      "☕","🍕","🍔","🧁","🍩","🍷","🍎","🥑","🍋","🍪","🍰","🥤",
      "✈️","🚀","🚗","🏠","🏰","🗺️","🧭","🌍","🗼","🏖️","🎒","⛰️",
      "🎮","🕹️","👾","🎲","🏆","🥇","⚽","🎾","🎯","🏹","🛹","🏋️",
      "🐱","🐶","🦊","🐻","🐼","🦁","🦄","🐸","🐙","🦈","🦅","🐬",
    ];
    setIcon(allIcons[Math.floor(Math.random() * allIcons.length)]);
    setBgColor(BG_PRESETS[Math.floor(Math.random() * BG_PRESETS.length)]);
    setIconColor(ICON_PRESETS[Math.floor(Math.random() * ICON_PRESETS.length)]);
    const shapes: ("square" | "rounded" | "circle")[] = ["square", "rounded", "circle"];
    setShape(shapes[Math.floor(Math.random() * shapes.length)]);
  };

  const downloadFavicon = useCallback((exportSize: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaledFontSize = (fontSize / 64) * exportSize;

    const drawBg = () => {
      ctx.fillStyle = bgColor;
      const r = shape === "circle" ? exportSize / 2 : shape === "rounded" ? exportSize * 0.2 : 0;
      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(exportSize / 2, exportSize / 2, exportSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === "rounded") {
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.lineTo(exportSize - r, 0);
        ctx.quadraticCurveTo(exportSize, 0, exportSize, r);
        ctx.lineTo(exportSize, exportSize - r);
        ctx.quadraticCurveTo(exportSize, exportSize, exportSize - r, exportSize);
        ctx.lineTo(r, exportSize);
        ctx.quadraticCurveTo(0, exportSize, 0, exportSize - r);
        ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, exportSize, exportSize);
      }
    };

    drawBg();

    if (customImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const padding = exportSize * 0.15;
        const imgRatio = img.width / img.height;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgRatio > 1) { sx = (img.width - img.height) / 2; sw = img.height; }
        else { sy = (img.height - img.width) / 2; sh = img.width; }
        ctx.drawImage(img, sx, sy, sw, sh, padding, padding, exportSize - padding * 2, exportSize - padding * 2);
        const link = document.createElement("a");
        link.download = `favicon-${exportSize}x${exportSize}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      };
      img.src = customImage;
    } else {
      ctx.fillStyle = iconColor;
      ctx.font = `${scaledFontSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(icon, exportSize / 2, exportSize / 2 + 2);

      const link = document.createElement("a");
      link.download = `favicon-${exportSize}x${exportSize}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }, [icon, bgColor, iconColor, shape, fontSize, customImage]);

  const downloadICO = useCallback(async () => {
    const sizes = [16, 32, 48];
    const imageDataArray = await Promise.all(
      sizes.map(async (size) => ({
        size,
        imageData: await renderFaviconToImageData(icon, bgColor, iconColor, shape, fontSize, size, customImage),
      }))
    );

    const blob = generateICO(imageDataArray);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "favicon.ico";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [icon, bgColor, iconColor, shape, fontSize, customImage]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-block bg-primary/10 border border-primary/20 px-3 py-1 mb-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Favicon Generator</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] mb-4 text-foreground">
          Craft your<br />
          <span className="italic">perfect</span> favicon.
        </h1>
        <p className="text-muted-foreground max-w-lg leading-relaxed">
          Pick from 300+ handmade icons across 12 categories, upload your own image or SVG, customize everything, and export as PNG or ICO.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Controls */}
        <div className="space-y-8">
          {/* Upload Custom Image */}
          <div className="border border-border p-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-foreground mb-3">Custom Image</h2>
            <ImageUpload customImage={customImage} onImageChange={setCustomImage} />
          </div>

          {/* Icon Picker */}
          <div className="border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-foreground">Select Icon</h2>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                12 categories · 300+ icons
              </span>
            </div>
            {customImage && (
              <div className="mb-3 px-3 py-2 bg-primary/5 border border-primary/20 font-mono text-[10px] uppercase tracking-wider text-primary">
                ⓘ Custom image active — icons are hidden. Remove image to use icons.
              </div>
            )}
            <div className={customImage ? "opacity-40 pointer-events-none" : ""}>
              <IconPicker
                selectedIcon={icon}
                onSelect={(i) => { setCustomImage(null); setIcon(i); }}
                category={category}
                onCategoryChange={setCategory}
              />
            </div>
          </div>

          {/* Custom Text Input */}
          <div className="border border-border p-5">
            <h2 className="font-mono text-xs uppercase tracking-widest text-foreground mb-3">Custom Icon / Emoji</h2>
            <input
              type="text"
              value={customImage ? "" : icon}
              onChange={(e) => { setCustomImage(null); setIcon(e.target.value.slice(0, 2)); }}
              maxLength={2}
              disabled={!!customImage}
              className="w-full bg-surface-elevated border border-border px-3 py-2 font-mono text-lg text-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
              placeholder="Type emoji or letter..."
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border p-5">
              <ColorPicker
                label="Background Color"
                value={bgColor}
                onChange={setBgColor}
                presets={BG_PRESETS}
              />
            </div>
            <div className="border border-border p-5">
              <ColorPicker
                label={customImage ? "Icon Color (emoji only)" : "Icon Color"}
                value={iconColor}
                onChange={setIconColor}
                presets={ICON_PRESETS}
              />
            </div>
          </div>

          {/* Shape & Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border p-5">
              <ShapePicker value={shape} onChange={setShape} />
            </div>
            <div className="border border-border p-5">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Icon Size — {fontSize}px
              </label>
              <input
                type="range"
                min={16}
                max={56}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-primary mt-2"
              />
            </div>
          </div>
        </div>

        {/* Preview & Download Sidebar */}
        <div className="space-y-6">
          <div className="border border-border p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-xs uppercase tracking-widest text-foreground">Preview</h2>
              <div className="flex gap-2">
                <button onClick={randomize} className="p-1.5 border border-border hover:border-foreground transition-colors" title="Randomize">
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={resetAll} className="p-1.5 border border-border hover:border-foreground transition-colors" title="Reset">
                  <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Large Preview */}
            <div className="flex items-center justify-center p-8 mb-6" style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--canvas-grid)) 1px, transparent 1px)`,
              backgroundSize: '12px 12px',
            }}>
              <div className="shadow-xl">
                <FaviconCanvas icon={icon} bgColor={bgColor} iconColor={iconColor} shape={shape} size={128} fontSize={fontSize * 2} customImage={customImage} />
              </div>
            </div>

            {/* Size Previews */}
            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">Size Preview</span>
              <div className="flex items-end gap-4">
                {[16, 32, 48, 64].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1.5">
                    <FaviconCanvas icon={icon} bgColor={bgColor} iconColor={iconColor} shape={shape} size={s} fontSize={(fontSize / 64) * s} customImage={customImage} />
                    <span className="font-mono text-[9px] text-muted-foreground">{s}px</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browser Tab Mockup */}
            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">In Browser</span>
              <div className="bg-card border border-border rounded-t-lg overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 rounded px-2 py-1 flex-1 ml-2">
                    <FaviconCanvas icon={icon} bgColor={bgColor} iconColor={iconColor} shape={shape} size={16} fontSize={(fontSize / 64) * 16} customImage={customImage} />
                    <span className="text-[11px] text-muted-foreground truncate">yoursite.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download */}
            <div className="space-y-2">
              <Button variant="hero" size="lg" className="w-full" onClick={() => downloadFavicon(64)}>
                <Download className="w-4 h-4" />
                Download PNG 64×64
              </Button>
              <Button variant="hero" size="lg" className="w-full" onClick={downloadICO}>
                <FileImage className="w-4 h-4" />
                Download .ICO (16, 32, 48)
              </Button>
              <div className="grid grid-cols-3 gap-2">
                {[16, 32, 128].map((s) => (
                  <Button key={s} variant="subtle" size="sm" onClick={() => downloadFavicon(s)}>
                    {s}×{s}
                  </Button>
                ))}
              </div>
              <Button variant="subtle" size="sm" className="w-full" onClick={() => downloadFavicon(512)}>
                <Download className="w-3 h-3" />
                512×512 (App Icon)
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border pt-6 pb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground text-[8px] font-mono font-bold">F</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Favicraft — Handcrafted Favicons
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2026 — All icons are free to use
          </span>
        </div>
      </footer>
    </div>
  );
};

export default FaviconGenerator;
