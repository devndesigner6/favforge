import React, { useRef, useEffect } from "react";

interface FaviconCanvasProps {
  icon: string;
  bgColor: string;
  iconColor: string;
  shape: "square" | "rounded" | "circle";
  size: number;
  fontSize: number;
  customImage?: string | null;
}

const drawShape = (ctx: CanvasRenderingContext2D, size: number, shape: string, bgColor: string) => {
  ctx.fillStyle = bgColor;
  const r = shape === "circle" ? size / 2 : shape === "rounded" ? size * 0.2 : 0;
  if (shape === "circle") {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === "rounded") {
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, size, size);
  }
};

const clipShape = (ctx: CanvasRenderingContext2D, size: number, shape: string) => {
  const r = shape === "circle" ? size / 2 : shape === "rounded" ? size * 0.2 : 0;
  ctx.beginPath();
  if (shape === "circle") {
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  } else if (shape === "rounded") {
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
  } else {
    ctx.rect(0, 0, size, size);
  }
  ctx.clip();
};

const FaviconCanvas: React.FC<FaviconCanvasProps> = ({
  icon,
  bgColor,
  iconColor,
  shape,
  size,
  fontSize,
  customImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Draw background
    drawShape(ctx, size, shape, bgColor);

    if (customImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.save();
        clipShape(ctx, size, shape);
        // Draw bg again inside clip
        drawShape(ctx, size, shape, bgColor);
        // Center-crop the image
        const imgRatio = img.width / img.height;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgRatio > 1) {
          sx = (img.width - img.height) / 2;
          sw = img.height;
        } else {
          sy = (img.height - img.width) / 2;
          sh = img.width;
        }
        const padding = size * 0.15;
        ctx.drawImage(img, sx, sy, sw, sh, padding, padding, size - padding * 2, size - padding * 2);
        ctx.restore();
      };
      img.src = customImage;
    } else {
      // Draw icon/emoji
      ctx.fillStyle = iconColor;
      ctx.font = `${fontSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(icon, size / 2, size / 2 + 2);
    }
  }, [icon, bgColor, iconColor, shape, size, fontSize, customImage]);

  return <canvas ref={canvasRef} className="block" />;
};

export { drawShape, clipShape };
export default FaviconCanvas;
