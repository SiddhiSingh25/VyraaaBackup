import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteVideoModal = ({ open, onClose, onDelete }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-[#FFF8F2] shadow-2xl">
        {/* Header */}

        <div className="flex flex-col items-center border-b border-[#E7D8CC] px-8 py-8">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={40} className="text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-[#3F322B]">Delete Video?</h2>

          <p className="mt-3 text-center text-sm leading-6 text-slate-500">
            Are you sure you want to delete this home video?
            <br />
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}

        <div className="flex justify-center gap-4 px-8 py-6">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#DCC9BA] px-7 py-3 font-medium text-[#5E4637] transition hover:bg-[#F6ECE5]"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="rounded-xl bg-red-600 px-7 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Delete Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVideoModal;
