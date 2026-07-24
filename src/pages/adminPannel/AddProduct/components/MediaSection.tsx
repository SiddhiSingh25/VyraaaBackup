import { useState, useEffect } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  RiGalleryLine,
  RiImageAddLine,
  RiCloseLine,
  RiUploadCloud2Line,
  RiVideoLine,
} from "react-icons/ri";

const MAX_MEDIA = 5;

type MediaSectionProps = {
  images: string[];
  setImages: (images: string[]) => void;
  onFilesSelected?: (files: File[]) => void;
  onRemoveImage?: (index: number, removedUrl: string) => void;
  errorMessage?: string;
};

// Sub-component to safely render either image or video
const SmartMediaPreview = ({
  src,
  className,
}: {
  src: string;
  className: string;
}) => {
  const [isVideo, setIsVideo] = useState<boolean | null>(null);

  useEffect(() => {
    if (!src) return;

    // 1. Direct Extension or Data URI Check
    const isVideoExtension = /\.(mp4|webm|ogg|mov|mkv|avi|m4v)($|\?)/i.test(
      src,
    );
    const isDataVideo = src.startsWith("data:video/");

    if (isVideoExtension || isDataVideo) {
      setIsVideo(true);
      return;
    }

    const isDataImage = src.startsWith("data:image/");
    const isImageExtension = /\.(jpg|jpeg|png|gif|webp|svg)($|\?)/i.test(src);
    if (isDataImage || isImageExtension) {
      setIsVideo(false);
      return;
    }

    // 2. For Blob URLs (created from local uploads), fetch header / test via Image element
    if (src.startsWith("blob:")) {
      // Quick fallback: load via Image first. If it errors out, it's a video!
      const img = new Image();
      img.src = src;
      img.onload = () => setIsVideo(false);
      img.onerror = () => setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  }, [src]);

  if (isVideo === null) {
    // Loading skeleton while determining type
    return <div className={`bg-card animate-pulse ${className}`} />;
  }

  if (isVideo) {
    return (
      <video src={src} className={className} muted autoPlay loop playsInline />
    );
  }

  return <img src={src} alt="Uploaded Media" className={className} />;
};

const MediaSection = ({
  images: mediaItems,
  setImages: setMediaItems,
  onFilesSelected,
  onRemoveImage,
  errorMessage,
}: MediaSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const remainingSlots = MAX_MEDIA - mediaItems.length;

  const addFiles = (files: FileList | null) => {
    if (!files || remainingSlots <= 0) return;
    const fileArray = Array.from(files).slice(0, remainingSlots);

    // Standard valid Object URLs
    const nextUrls = fileArray.map((file) => URL.createObjectURL(file));

    setMediaItems([...mediaItems, ...nextUrls]);
    onFilesSelected?.(fileArray);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeMedia = (index: number) => {
    const removedUrl = mediaItems[index];

    const next = [...mediaItems];
    next.splice(index, 1);

    if (removedUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(removedUrl);
    }

    setMediaItems(next);

    onRemoveImage?.(index, removedUrl);
  };

  return (
    <section className="rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
      {/* Header Area */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <RiGalleryLine size={18} />
          </div>
          <h3 className="text-sm font-semibold tracking-tight">
            Media & Gallery
          </h3>
        </div>
        <span className="flex items-center justify-center rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] font-medium tracking-wide text-primary-dark shadow-sm">
          {mediaItems.length} / {MAX_MEDIA}
        </span>
      </div>

      {errorMessage && (
        <p className="mb-4 rounded-md bg-error/10 px-3 py-2 text-xs font-medium text-error">
          {errorMessage}
        </p>
      )}

      {/* Primary Media Display / Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (remainingSlots > 0) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border-2 transition-all duration-200 ease-in-out ${
          isDragging
            ? "scale-[1.01] border-primary border-solid bg-primary/5"
            : "border-dashed border-border bg-card/50 hover:border-primary/50 hover:bg-card"
        }`}
      >
        {mediaItems.length > 0 ? (
          <>
            <span className="absolute left-3 top-3 z-10 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md flex items-center gap-1">
              Primary
            </span>
            <SmartMediaPreview
              src={mediaItems[0]}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => removeMedia(0)}
              aria-label="Remove primary media"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-1.5 text-white/90 backdrop-blur-md transition-all hover:bg-error hover:text-white hover:scale-110"
            >
              <RiCloseLine size={16} />
            </button>
          </>
        ) : (
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary transition-transform duration-300 group-hover:-translate-y-1">
              <RiUploadCloud2Line size={24} />
            </div>
            <span className="text-sm font-medium">
              Click to upload or drag & drop
            </span>
            <span className="mt-1 text-[11px] text-muted">
              Images or Videos (MP4, WEBM, MOV)
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        )}
      </div>

      {/* Grid for Extra Media */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        {mediaItems.slice(1).map((src, idx) => (
          <div
            key={idx}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <SmartMediaPreview
              src={src}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <button
              type="button"
              onClick={() => removeMedia(idx + 1)}
              aria-label={`Remove item ${idx + 2}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1.5 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-error group-hover:opacity-100"
            >
              <RiCloseLine size={16} />
            </button>
          </div>
        ))}

        {/* Add more button (Grid) */}
        {remainingSlots > 0 && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/50 text-muted transition-all hover:border-primary/50 hover:bg-card hover:text-primary">
            <RiImageAddLine size={20} className="mb-1" />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              Add
            </span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        )}
      </div>

      {/* Footer Status */}
      {mediaItems.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-[11px] text-muted">
          <span>
            {remainingSlots > 0
              ? `${remainingSlots} slot${remainingSlots === 1 ? "" : "s"} available`
              : "Maximum media limit reached"}
          </span>
          <span className="font-medium text-primary-dark/70">
            High quality recommended
          </span>
        </div>
      )}
    </section>
  );
};

export default MediaSection;
