// ICO format generator
import { createBgFill } from "./gradient-utils";
import type { BgType } from "@/hooks/use-undo-redo";

export function generateICO(canvasDataArray: { size: number; imageData: ImageData }[]): Blob {
  const images = canvasDataArray.map(({ size, imageData }) => createBMPData(imageData, size));

  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = images.length;
  let offset = headerSize + dirEntrySize * numImages;
  const totalSize = offset + images.reduce((sum, img) => sum + img.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, numImages, true);

  for (let i = 0; i < numImages; i++) {
    const size = canvasDataArray[i].size;
    const entryOffset = headerSize + i * dirEntrySize;
    view.setUint8(entryOffset, size >= 256 ? 0 : size);
    view.setUint8(entryOffset + 1, size >= 256 ? 0 : size);
    view.setUint8(entryOffset + 2, 0);
    view.setUint8(entryOffset + 3, 0);
    view.setUint16(entryOffset + 4, 1, true);
    view.setUint16(entryOffset + 6, 32, true);
    view.setUint32(entryOffset + 8, images[i].length, true);
    view.setUint32(entryOffset + 12, offset, true);
    const uint8 = new Uint8Array(buffer);
    uint8.set(images[i], offset);
    offset += images[i].length;
  }

  return new Blob([buffer], { type: "image/x-icon" });
}

function createBMPData(imageData: ImageData, size: number): Uint8Array {
  const bpp = 32;
  const rowSize = size * (bpp / 8);
  const pixelDataSize = rowSize * size;
  const maskRowSize = Math.ceil(size / 32) * 4;
  const maskSize = maskRowSize * size;
  const hSize = 40;
  const totalSize = hSize + pixelDataSize + maskSize;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  view.setUint32(0, 40, true);
  view.setInt32(4, size, true);
  view.setInt32(8, size * 2, true);
  view.setUint16(12, 1, true);
  view.setUint16(14, bpp, true);
  view.setUint32(16, 0, true);
  view.setUint32(20, pixelDataSize + maskSize, true);

  const pixels = imageData.data;
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      const srcIdx = (y * size + x) * 4;
      const dstIdx = hSize + ((size - 1 - y) * size + x) * 4;
      view.setUint8(dstIdx, pixels[srcIdx + 2]);
      view.setUint8(dstIdx + 1, pixels[srcIdx + 1]);
      view.setUint8(dstIdx + 2, pixels[srcIdx]);
      view.setUint8(dstIdx + 3, pixels[srcIdx + 3]);
    }
  }

  return new Uint8Array(buffer);
}

export function renderFaviconToImageData(
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
): Promise<ImageData> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const fill = createBgFill(ctx, size, bgType, bgColor, bgColor2, gradientAngle);

    const drawBg = () => {
      ctx.fillStyle = fill;
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
        resolve(ctx.getImageData(0, 0, size, size));
      };
      img.src = customImage;
    } else {
      ctx.fillStyle = iconColor;
      ctx.font = `${(fontSize / 64) * size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(icon, size / 2, size / 2 + 2);
      resolve(ctx.getImageData(0, 0, size, size));
    }
  });
}
