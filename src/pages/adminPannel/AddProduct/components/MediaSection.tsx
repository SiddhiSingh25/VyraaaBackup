// import { useState } from "react";
// import type { ChangeEvent, DragEvent } from "react";
// import { ImImages } from "react-icons/im";
// import { RiImageAddLine, RiCloseLine } from "react-icons/ri";

// const MAX_IMAGES = 5;

// type MediaSectionProps = {
//   images: string[];
//   setImages: (images: string[]) => void;
//   onFilesSelected?: (files: File[]) => void;
//   onRemoveImage?: (index: number) => void;
//   errorMessage?: string;
// };

// const MediaSection = ({
//   images,
//   setImages,
//   onFilesSelected,
//   onRemoveImage,
//   errorMessage,
// }: MediaSectionProps) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const remainingSlots = MAX_IMAGES - images.length;

//   const addFiles = (files: FileList | null) => {
//     if (!files || remainingSlots <= 0) return;
//     const fileArray = Array.from(files).slice(0, remainingSlots);
//     const nextUrls = fileArray.map((file) => URL.createObjectURL(file));
//     setImages([...images, ...nextUrls]);
//     onFilesSelected?.(fileArray);
//   };

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     addFiles(e.target.files);
//     e.target.value = "";
//   };

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     addFiles(e.dataTransfer.files);
//   };

//   return (
//     <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sticky top-6">
//       <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
//         <div className="flex items-center gap-3">
//           <ImImages className="text-primary text-xl" />
//           <h3 className="text-lg  text-sm font-semibold tracking-tight  font-semibold">Product Images</h3>
//         </div>
//         <span className="rounded-md bg-card px-3 py-1 text-xs font-semibold text-primary-dark border border-border">
//           {images.length}/{MAX_IMAGES}
//         </span>
//       </div>
//       {errorMessage && <p className="mb-4 text-xs text-error">{errorMessage}</p>}

//       {/* Primary Image Display */}
//       <div
//         onDragOver={(e) => {
//           e.preventDefault();
//           if (remainingSlots > 0) setIsDragging(true);
//         }}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={handleDrop}
//         className={`group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl border transition ${
//           isDragging
//             ? "border-primary bg-primary-light/10"
//             : "border-border bg-card hover:border-primary-light"
//         }`}
//       >
//         {images.length > 0 ? (
//           <>
//             <span className="absolute left-3 top-3 z-10 rounded-sm bg-dark/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-background backdrop-blur-md">
//               Primary
//             </span>
//             <img src={images[0]} alt="Primary" className="h-full w-full object-cover" />
//             <button
//               type="button"
//               onClick={() => onRemoveImage?.(0)}
//               aria-label="Remove primary image"
//               className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-2 text-error shadow-sm hover:bg-error hover:text-white transition"
//             >
//               <RiCloseLine size={16} />
//             </button>
//           </>
//         ) : (
//           <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-6 text-center text-muted">
//             <RiImageAddLine className="mx-auto h-10 w-10 mb-3 opacity-50" />
//             <span className="block text-sm font-medium">Add primary image</span>
//             <span className="mt-1 block text-xs text-muted">
//               Drag & drop, or click to browse
//             </span>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={handleImageUpload}
//             />
//           </label>
//         )}
//       </div>

//       {/* Grid for extra images */}
//       <div className="mt-4 grid grid-cols-4 gap-2">
//         {images.slice(1).map((img, idx) => (
//           <div
//             key={idx}
//             className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-card"
//           >
//             <img src={img} alt={`Extra ${idx}`} className="h-full w-full object-cover" />
//             <button
//               type="button"
//               onClick={() => onRemoveImage?.(idx + 1)}
//               aria-label={`Remove image ${idx + 2}`}
//               className="absolute inset-0 flex items-center justify-center bg-dark/50 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm"
//             >
//               <RiCloseLine size={20} />
//             </button>
//           </div>
//         ))}

//         {remainingSlots > 0 && (
//           <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-primary-light bg-card text-primary-light hover:bg-primary-light/10 hover:text-primary transition">
//             <RiImageAddLine size={20} />
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               className="hidden"
//               onChange={handleImageUpload}
//             />
//           </label>
//         )}
//       </div>

//       {images.length > 0 && (
//         <p className="mt-3 text-xs text-muted">
//           {remainingSlots > 0
//             ? `You can add ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"}.`
//             : "Maximum of 5 images reached."}
//         </p>
//       )}
//     </section>
//   );
// };

// export default MediaSection;
import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { 
  RiGalleryLine, 
  RiImageAddLine, 
  RiCloseLine, 
  RiUploadCloud2Line 
} from "react-icons/ri";

const MAX_IMAGES = 5;

type MediaSectionProps = {
  images: string[];
  setImages: (images: string[]) => void;
  errorMessage?: string;
};

const MediaSection = ({ images, setImages, errorMessage }: MediaSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const remainingSlots = MAX_IMAGES - images.length;

  // --- Logic (Unchanged) ---
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
  // -------------------------

  const removeImage = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    setImages(next);
  };

  return (
    <section className="sticky top-6 rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
      {/* Header Area */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <RiGalleryLine size={18} />
          </div>
          <h3 className=" text-sm font-semibold tracking-tight ">
            Media & Gallery
          </h3>
        </div>
        <span className="flex items-center justify-center rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] font-medium tracking-wide text-primary-dark shadow-sm">
          {images.length} / {MAX_IMAGES}
        </span>
      </div>

      {errorMessage && (
        <p className="mb-4 rounded-md bg-error/10 px-3 py-2 text-xs font-medium text-error">
          {errorMessage}
        </p>
      )}

      {/* Primary Image Display / Dropzone */}
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
        {images.length > 0 ? (
          <>
            <span className="absolute left-3 top-3 z-10 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
              Primary
            </span>
            <img 
              src={images[0]} 
              alt="Primary" 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <button
              type="button"
              onClick={() => removeImage(0)}
              aria-label="Remove primary image"
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
            <span className="text-sm font-medium ">
              Click to upload or drag & drop
            </span>
            <span className="mt-1 text-[11px] text-muted">
              SVG, PNG, JPG or GIF (max. 800x400px)
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

      {/* Grid for Extra Images */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.slice(1).map((img, idx) => (
          <div
            key={idx}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <img 
              src={img} 
              alt={`Extra ${idx}`} 
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <button
              type="button"
              onClick={() => removeImage(idx + 1)}
              aria-label={`Remove image ${idx + 2}`}
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
            <span className="text-[10px] font-medium uppercase tracking-wider">Add</span>
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

      {/* Footer Status */}
      {images.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-[11px] text-muted">
          <span>
            {remainingSlots > 0
              ? `${remainingSlots} slot${remainingSlots === 1 ? "" : "s"} available`
              : "Maximum images reached"}
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