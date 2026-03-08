import React, { useRef, useEffect } from "react";

interface FaviconCanvasProps {
  icon: string;
  bgColor: string;
  iconColor: string;
  shape: "square" | "rounded" | "circle";
  size: number;
  fontSize: number;
}

const FaviconCanvas: React.FC<FaviconCanvasProps> = ({
  icon,
  bgColor,
  iconColor,
  shape,
  size,
  fontSize,
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

    // Draw background shape
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

    // Draw icon/emoji
    ctx.fillStyle = iconColor;
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(icon, size / 2, size / 2 + 2);
  }, [icon, bgColor, iconColor, shape, size, fontSize]);

  return <canvas ref={canvasRef} className="block" />;
};

export default FaviconCanvas;
