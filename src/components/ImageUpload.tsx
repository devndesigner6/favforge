import React, { useRef } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  customImage: string | null;
  onImageChange: (image: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ customImage, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/gif", "image/svg+xml", "image/webp", "image/x-icon"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG, JPG, GIF, SVG, or WEBP image.");
      return;
    }

    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const svgText = ev.target?.result as string;
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        onImageChange(url);
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImageChange(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Reset so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">
        Upload Custom Image / SVG
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      {customImage ? (
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 border border-border bg-surface-elevated flex items-center justify-center overflow-hidden rounded-sm">
            <img src={customImage} alt="Custom icon" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-all"
            >
              Replace
            </button>
            <button
              onClick={() => onImageChange(null)}
              className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-border hover:border-primary/50 transition-all py-6 flex flex-col items-center gap-2 bg-surface-elevated/50 group cursor-pointer"
        >
          <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
            Drop image or click to upload
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/60">
            PNG, JPG, SVG, WEBP supported
          </span>
        </button>
      )}
    </div>
  );
};

export default ImageUpload;
