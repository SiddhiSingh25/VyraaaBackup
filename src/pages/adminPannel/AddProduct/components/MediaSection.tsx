import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { ImImages } from "react-icons/im";
import { RiImageAddLine, RiCloseLine } from "react-icons/ri";

const MAX_IMAGES = 5;

type MediaSectionProps = {
  images: string[];
  setImages: (images: string[]) => void;
  errorMessage?: string;
};

const MediaSection = ({ images, setImages, errorMessage }: MediaSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const remainingSlots = MAX_IMAGES - images.length;

  const addFiles = (files: FileList | null) => {
    if (!files || remainingSlots <= 0) return;
    const nextUrls = Array.from(files)
      .slice(0, remainingSlots)
      .map((file) => URL.createObjectURL(file));
    setImages([...images, ...nextUrls]);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    setImages(next);
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sticky top-6">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <ImImages className="text-primary text-xl" />
          <h3 className="text-lg text-heading font-heading font-semibold">Media</h3>
        </div>
        <span className="rounded-md bg-card px-3 py-1 text-xs font-semibold text-primary-dark border border-border">
          {images.length}/{MAX_IMAGES}
        </span>
      </div>
      {errorMessage && <p className="mb-4 text-xs text-error">{errorMessage}</p>}

      {/* Primary Image Display */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (remainingSlots > 0) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl border transition ${
          isDragging
            ? "border-primary bg-primary-light/10"
            : "border-border bg-card hover:border-primary-light"
        }`}
      >
        {images.length > 0 ? (
          <>
            <span className="absolute left-3 top-3 z-10 rounded-sm bg-dark/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-background backdrop-blur-md">
              Primary
            </span>
            <img src={images[0]} alt="Primary" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(0)}
              aria-label="Remove primary image"
              className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-2 text-error shadow-sm hover:bg-error hover:text-white transition"
            >
              <RiCloseLine size={16} />
            </button>
          </>
        ) : (
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6 text-center text-muted">
            <RiImageAddLine className="mx-auto h-10 w-10 mb-3 opacity-50" />
            <span className="block text-sm font-medium">Add primary image</span>
            <span className="mt-1 block text-xs text-muted">
              Drag & drop, or click to browse
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      {/* Grid for extra images */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {images.slice(1).map((img, idx) => (
          <div
            key={idx}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-card"
          >
            <img src={img} alt={`Extra ${idx}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx + 1)}
              aria-label={`Remove image ${idx + 2}`}
              className="absolute inset-0 flex items-center justify-center bg-dark/50 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm"
            >
              <RiCloseLine size={20} />
            </button>
          </div>
        ))}

        {remainingSlots > 0 && (
          <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-primary-light bg-card text-primary-light hover:bg-primary-light/10 hover:text-primary transition">
            <RiImageAddLine size={20} />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>

      {images.length > 0 && (
        <p className="mt-3 text-xs text-muted">
          {remainingSlots > 0
            ? `You can add ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"}.`
            : "Maximum of 5 images reached."}
        </p>
      )}
    </section>
  );
};

export default MediaSection;
