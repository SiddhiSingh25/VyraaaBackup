import { useRef, useState } from "react";
import { UploadCloud, Video, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddVideoModal = ({ open, onClose }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [video, setVideo] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  if (!open) return null;

  const onChooseVideo = () => {
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideo(file);

    setPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideo(null);
    setPreview("");
  };

  const handleSubmit = () => {
    console.log(video);

    // upload api here

    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-[#FFF8F2] shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-[#E7D8CC] px-7 py-5">
          <div>
            <h2 className="text-2xl font-bold text-[#3F322B]">
              Add Home Video
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload a video that will appear on the home page.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-[#F1E3D8]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="p-7">
          {!video && (
            <button
              onClick={onChooseVideo}
              className="flex h-80 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#D9C8BA] bg-[#FFFDFB] transition hover:border-[#8B5E49] hover:bg-[#FFF8F2]"
            >
              <UploadCloud size={60} className="mb-5 text-[#8B5E49]" />

              <h3 className="text-xl font-semibold text-[#4F4037]">
                Upload Video
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Click here to choose a video
              </p>
            </button>
          )}

          {video && (
            <div className="space-y-5">
              <div className="overflow-hidden rounded-3xl border border-[#E7D8CC]">
                <video
                  src={preview}
                  controls
                  className="h-80 w-full bg-black object-cover"
                />
              </div>

              <div className="rounded-2xl border border-[#E7D8CC] bg-white p-5">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-[#F6ECE5] p-4">
                    <Video size={24} className="text-[#8B5E49]" />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-semibold text-[#3F322B]">
                      {video.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {(video.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    onClick={removeVideo}
                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            hidden
            type="file"
            accept="video/*"
            onChange={onFileChange}
          />
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-[#E7D8CC] px-7 py-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#DCC9BA] px-6 py-3 font-medium text-[#5A4538] transition hover:bg-[#F8EFE9]"
          >
            Cancel
          </button>

          <button
            disabled={!video}
            onClick={handleSubmit}
            className="rounded-xl bg-[#7B523B] px-6 py-3 font-semibold text-white transition hover:bg-[#65402d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Upload Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;
