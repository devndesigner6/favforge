import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import FaviconCanvas from "@/components/FaviconCanvas";
import IconPicker from "@/components/IconPicker";
import ColorPicker from "@/components/ColorPicker";
import ShapePicker from "@/components/ShapePicker";
import ImageUpload from "@/components/ImageUpload";
import AIPalette from "@/components/AIPalette";
import GradientPicker from "@/components/GradientPicker";
import { Download, RotateCcw, Sparkles, FileImage, Package, Undo2, Redo2 } from "lucide-react";
import { generateICO, renderFaviconToImageData } from "@/lib/ico-generator";
import { generateMultiFormatPack } from "@/lib/zip-generator";
import { createBgFill } from "@/lib/gradient-utils";
import { useUndoRedo, type FaviconState, type BgType } from "@/hooks/use-undo-redo";

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

const INITIAL_STATE: FaviconState = {
  icon: "⚡",
  bgColor: "#1a1a2e",
  bgColor2: "#533483",
  bgType: "solid",
  gradientAngle: 135,
  iconColor: "#ffffff",
  shape: "rounded",
  fontSize: 38,
  customImage: null,
};

const FaviconGenerator: React.FC = () => {
  const { current, push, undo, redo, canUndo, canRedo } = useUndoRedo(INITIAL_STATE);
  const [category, setCategory] = useState("tech");
  const [isDownloadingPack, setIsDownloadingPack] = useState(false);
  const isUndoRedo = useRef(false);

  const { icon, bgColor, bgColor2, bgType, gradientAngle, iconColor, shape, fontSize, customImage } = current;

  const updateState = useCallback((partial: Partial<FaviconState>) => {
    push({ ...current, ...partial });
  }, [current, push]);

  const setIcon = (v: string) => updateState({ icon: v, customImage: null });
  const setBgColor = (v: string) => updateState({ bgColor: v });
  const setIconColor = (v: string) => updateState({ iconColor: v });
  const setShape = (v: "square" | "rounded" | "circle") => updateState({ shape: v });
  const setFontSize = (v: number) => updateState({ fontSize: v });
  const setCustomImage = (v: string | null) => updateState({ customImage: v });

  const resetAll = () => {
    push(INITIAL_STATE);
    setCategory("tech");
  };

  const randomize = () => {
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
    const bgTypes: BgType[] = ["solid", "linear", "radial"];
    push({
      icon: allIcons[Math.floor(Math.random() * allIcons.length)],
      bgColor: BG_PRESETS[Math.floor(Math.random() * BG_PRESETS.length)],
      bgColor2: BG_PRESETS[Math.floor(Math.random() * BG_PRESETS.length)],
      bgType: bgTypes[Math.floor(Math.random() * bgTypes.length)],
      gradientAngle: Math.floor(Math.random() * 8) * 45,
      iconColor: ICON_PRESETS[Math.floor(Math.random() * ICON_PRESETS.length)],
      shape: (["square", "rounded", "circle"] as const)[Math.floor(Math.random() * 3)],
      fontSize: current.fontSize,
      customImage: null,
    });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const downloadFavicon = useCallback((exportSize: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaledFontSize = (fontSize / 64) * exportSize;
    const fill = createBgFill(ctx, exportSize, bgType, bgColor, bgColor2, gradientAngle);

    const drawBg = () => {
      ctx.fillStyle = fill;
      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(exportSize / 2, exportSize / 2, exportSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape === "rounded") {
        const r = exportSize * 0.2;
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
  }, [icon, bgColor, bgColor2, bgType, gradientAngle, iconColor, shape, fontSize, customImage]);

  const downloadICO = useCallback(async () => {
    const sizes = [16, 32, 48];
    const imageDataArray = await Promise.all(
      sizes.map(async (size) => ({
        size,
        imageData: await renderFaviconToImageData(icon, bgColor, iconColor, shape, fontSize, size, customImage, bgType, bgColor2, gradientAngle),
      }))
    );
    const blob = generateICO(imageDataArray);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "favicon.ico";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [icon, bgColor, bgColor2, bgType, gradientAngle, iconColor, shape, fontSize, customImage]);

  const downloadPack = useCallback(async () => {
    setIsDownloadingPack(true);
    try {
      const blob = await generateMultiFormatPack(icon, bgColor, iconColor, shape, fontSize, customImage, bgType, bgColor2, gradientAngle);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "iconstar-pack.zip";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloadingPack(false);
    }
  }, [icon, bgColor, bgColor2, bgType, gradientAngle, iconColor, shape, fontSize, customImage]);

  const canvasProps = { icon, bgColor, bgColor2, bgType, gradientAngle, iconColor, shape, customImage };

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
          Pick from 300+ handmade icons, upload your own image, generate AI color palettes, add gradient backgrounds, and export as PNG, ICO, or a complete multi-format pack.
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
                onSelect={(i) => { updateState({ customImage: null, icon: i }); }}
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
              onChange={(e) => updateState({ customImage: null, icon: e.target.value.slice(0, 2) })}
              maxLength={2}
              disabled={!!customImage}
              className="w-full bg-surface-elevated border border-border px-3 py-2 font-mono text-lg text-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-40"
              placeholder="Type emoji or letter..."
            />
          </div>

          {/* AI Color Palette */}
          <AIPalette onApply={(bg, ic) => updateState({ bgColor: bg, iconColor: ic })} />

          {/* Gradient Picker */}
          <div className="border border-border p-5">
            <GradientPicker
              bgType={bgType}
              bgColor={bgColor}
              bgColor2={bgColor2}
              gradientAngle={gradientAngle}
              onBgTypeChange={(v) => updateState({ bgType: v })}
              onBgColor2Change={(v) => updateState({ bgColor2: v })}
              onGradientAngleChange={(v) => updateState({ gradientAngle: v })}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border p-5">
              <ColorPicker
                label={bgType === "solid" ? "Background Color" : "Gradient Start"}
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
                <button onClick={undo} disabled={!canUndo} className="p-1.5 border border-border hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Undo (Ctrl+Z)">
                  <Undo2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={redo} disabled={!canRedo} className="p-1.5 border border-border hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Redo (Ctrl+Shift+Z)">
                  <Redo2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
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
                <FaviconCanvas {...canvasProps} size={128} fontSize={fontSize * 2} />
              </div>
            </div>

            {/* Size Previews */}
            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">Size Preview</span>
              <div className="flex items-end gap-4">
                {[16, 32, 48, 64].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1.5">
                    <FaviconCanvas {...canvasProps} size={s} fontSize={(fontSize / 64) * s} />
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
                    <FaviconCanvas {...canvasProps} size={16} fontSize={(fontSize / 64) * 16} />
                    <span className="text-[11px] text-muted-foreground truncate">yoursite.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download */}
            <div className="space-y-2">
              <Button variant="hero" size="lg" className="w-full" onClick={downloadPack} disabled={isDownloadingPack}>
                <Package className="w-4 h-4" />
                {isDownloadingPack ? "Generating Pack..." : "Download Full Pack (ZIP)"}
              </Button>
              <div className="px-3 py-1.5 bg-primary/5 border border-primary/10">
                <span className="font-mono text-[9px] text-muted-foreground block">
                  Includes: ICO, PNGs (16–512), Apple Touch, Android Chrome, manifest.json & HTML snippet
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="subtle" size="sm" onClick={() => downloadFavicon(64)}>
                  <Download className="w-3 h-3" />
                  PNG 64×64
                </Button>
                <Button variant="subtle" size="sm" onClick={downloadICO}>
                  <FileImage className="w-3 h-3" />
                  .ICO File
                </Button>
              </div>
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
              <span className="text-primary-foreground text-[8px] font-mono font-bold">I</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Iconstar — Handcrafted Favicons
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Ctrl+Z / Ctrl+Shift+Z for Undo/Redo · © 2026
          </span>
        </div>
      </footer>
    </div>
  );
};

export default FaviconGenerator;
