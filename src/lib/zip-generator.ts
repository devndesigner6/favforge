import JSZip from "jszip";
import { renderFaviconToImageData, generateICO } from "./ico-generator";
import { createBgFill } from "./gradient-utils";
import type { BgType } from "@/hooks/use-undo-redo";

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

async function renderToCanvas(
  icon: string,
  bgColor: string,
  iconColor: string,
  shape: "square" | "rounded" | "circle",
  fontSize: number,
  size: number,
  customImage?: string | null,
  bgType: BgType = "solid",
  bgColor2: string = "#000000",
  gradientAngle: number = 135,
): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const fill = createBgFill(ctx, size, bgType, bgColor, bgColor2, gradientAngle);
    const r = shape === "circle" ? size / 2 : shape === "rounded" ? size * 0.2 : 0;

    const drawBg = () => {
      ctx.fillStyle = fill;
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

    drawBg();

    if (customImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const padding = size * 0.15;
        const imgRatio = img.width / img.height;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgRatio > 1) { sx = (img.width - img.height) / 2; sw = img.height; }
        else { sy = (img.height - img.width) / 2; sh = img.width; }
        ctx.drawImage(img, sx, sy, sw, sh, padding, padding, size - padding * 2, size - padding * 2);
        resolve(canvas);
      };
      img.src = customImage;
    } else {
      ctx.fillStyle = iconColor;
      ctx.font = `${(fontSize / 64) * size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(icon, size / 2, size / 2 + 2);
      resolve(canvas);
    }
  });
}

export async function generateMultiFormatPack(
  icon: string,
  bgColor: string,
  iconColor: string,
  shape: "square" | "rounded" | "circle",
  fontSize: number,
  customImage?: string | null,
  bgType: BgType = "solid",
  bgColor2: string = "#000000",
  gradientAngle: number = 135,
): Promise<Blob> {
  const zip = new JSZip();
  const sizes = [16, 32, 48, 64, 128, 192, 512];

  for (const size of sizes) {
    const canvas = await renderToCanvas(icon, bgColor, iconColor, shape, fontSize, size, customImage, bgType, bgColor2, gradientAngle);
    const blob = await canvasToBlob(canvas);
    zip.file(`favicon-${size}x${size}.png`, blob);
  }

  const icoSizes = [16, 32, 48];
  const imageDataArray = await Promise.all(
    icoSizes.map(async (size) => ({
      size,
      imageData: await renderFaviconToImageData(icon, bgColor, iconColor, shape, fontSize, size, customImage, bgType, bgColor2, gradientAngle),
    }))
  );
  const icoBlob = generateICO(imageDataArray);
  zip.file("favicon.ico", icoBlob);

  const appleCanvas = await renderToCanvas(icon, bgColor, iconColor, shape, fontSize, 180, customImage, bgType, bgColor2, gradientAngle);
  zip.file("apple-touch-icon.png", await canvasToBlob(appleCanvas));

  const android192 = await renderToCanvas(icon, bgColor, iconColor, shape, fontSize, 192, customImage, bgType, bgColor2, gradientAngle);
  const android512 = await renderToCanvas(icon, bgColor, iconColor, shape, fontSize, 512, customImage, bgType, bgColor2, gradientAngle);
  zip.file("android-chrome-192x192.png", await canvasToBlob(android192));
  zip.file("android-chrome-512x512.png", await canvasToBlob(android512));

  const manifest = {
    name: "My App",
    short_name: "App",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: bgColor,
    background_color: bgColor,
    display: "standalone",
  };
  zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

  const htmlSnippet = `<!-- Favicon HTML - Copy and paste into your <head> -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${bgColor}">
`;
  zip.file("favicon-snippet.html", htmlSnippet);

  const readme = `# Favicon Pack — Generated by FavForge

## Files Included
- favicon.ico (16, 32, 48px combined)
- favicon-16x16.png through favicon-512x512.png
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png & 512x512.png
- site.webmanifest
- favicon-snippet.html

## Quick Setup
1. Copy all files to your website root
2. Paste favicon-snippet.html code into your HTML <head>
3. Done!
`;
  zip.file("README.md", readme);

  return await zip.generateAsync({ type: "blob" });
}
