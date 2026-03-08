// ICO format generator - creates proper .ico files from canvas data
// ICO format spec: https://en.wikipedia.org/wiki/ICO_(file_format)

export function generateICO(canvasDataArray: { size: number; imageData: ImageData }[]): Blob {
  const images = canvasDataArray.map(({ size, imageData }) => {
    return createBMPData(imageData, size);
  });

  // ICO Header: 6 bytes
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = images.length;
  let offset = headerSize + dirEntrySize * numImages;

  const totalSize = offset + images.reduce((sum, img) => sum + img.length, 0);
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICONDIR header
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type: 1 = ICO
  view.setUint16(4, numImages, true); // Number of images

  // ICONDIRENTRY for each image
  for (let i = 0; i < numImages; i++) {
    const size = canvasDataArray[i].size;
    const entryOffset = headerSize + i * dirEntrySize;
    
    view.setUint8(entryOffset, size >= 256 ? 0 : size); // Width (0 = 256)
    view.setUint8(entryOffset + 1, size >= 256 ? 0 : size); // Height
    view.setUint8(entryOffset + 2, 0); // Color palette
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color planes
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel
    view.setUint32(entryOffset + 8, images[i].length, true); // Image size
    view.setUint32(entryOffset + 12, offset, true); // Offset

    // Copy image data
    const uint8 = new Uint8Array(buffer);
    uint8.set(images[i], offset);
    offset += images[i].length;
  }

  return new Blob([buffer], { type: "image/x-icon" });
}

function createBMPData(imageData: ImageData, size: number): Uint8Array {
  const width = size;
  const height = size;
  const bpp = 32;
  const rowSize = width * (bpp / 8);
  const pixelDataSize = rowSize * height;
  const maskRowSize = Math.ceil(width / 32) * 4;
  const maskSize = maskRowSize * height;
  const headerSize = 40;
  const totalSize = headerSize + pixelDataSize + maskSize;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // BITMAPINFOHEADER
  view.setUint32(0, 40, true); // Header size
  view.setInt32(4, width, true); // Width
  view.setInt32(8, height * 2, true); // Height (doubled for ICO)
  view.setUint16(12, 1, true); // Planes
  view.setUint16(14, bpp, true); // Bits per pixel
  view.setUint32(16, 0, true); // Compression (none)
  view.setUint32(20, pixelDataSize + maskSize, true); // Image size
  view.setInt32(24, 0, true); // X pixels per meter
  view.setInt32(28, 0, true); // Y pixels per meter
  view.setUint32(32, 0, true); // Colors used
  view.setUint32(36, 0, true); // Important colors

  // Pixel data (BGRA, bottom-up)
  const pixels = imageData.data;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = headerSize + ((height - 1 - y) * width + x) * 4;
      view.setUint8(dstIdx, pixels[srcIdx + 2]); // B
      view.setUint8(dstIdx + 1, pixels[srcIdx + 1]); // G
      view.setUint8(dstIdx + 2, pixels[srcIdx]); // R
      view.setUint8(dstIdx + 3, pixels[srcIdx + 3]); // A
    }
  }

  // AND mask (all zeros = fully opaque, transparency from alpha)
  // Already initialized to 0

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
): Promise<ImageData> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const drawBg = () => {
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

    const drawIcon = () => {
      ctx.fillStyle = iconColor;
      ctx.font = `${(fontSize / 64) * size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(icon, size / 2, size / 2 + 2);
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
      drawIcon();
      resolve(ctx.getImageData(0, 0, size, size));
    }
  });
}
