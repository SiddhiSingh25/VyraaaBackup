import { useEffect, useMemo, useRef, useState } from "react";
import { Film, Plus, Upload, Play, Trash2, Video, Clock3 } from "lucide-react";

import AddVideoModal from "./components/AddVideoModal";
import DeleteVideoModal from "./components/DeleteVideoModal";

interface HomeVideo {
  _id: string;
  video: string;
}

const dummyVideos: HomeVideo[] = [
  {
    _id: "1",
    video:
      "https://macreelinfosoft-bucket.s3.ap-south-1.amazonaws.com/Vyraaa-Admin-Images/1784612978778.mp4",
  },
  {
    _id: "2",
    video:
      "https://macreelinfosoft-bucket.s3.ap-south-1.amazonaws.com/Vyraaa-Admin-Images/1784612978778.mp4",
  },
  {
    _id: "3",
    video:
      "https://macreelinfosoft-bucket.s3.ap-south-1.amazonaws.com/Vyraaa-Admin-Images/1784612978778.mp4",
  },
];

const AddHomeVideos = () => {
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<HomeVideo | null>(null);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    setTimeout(() => {
      setVideos(dummyVideos);
      setLoading(false);
    }, 600);
  }, []);

  const totalStorage = useMemo(() => {
    return `${videos.length * 24} MB`;
  }, [videos]);

  const handleDelete = (video: HomeVideo) => {
    setSelectedVideo(video);
    setShowDeleteModal(true);
  };

  const playVideo = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    video.currentTime = 0;
    video.play();
  };

  const stopVideo = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  };

  return (
    <div className="min-h-screen bg-[#F8F6F4]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* HERO */}

        <div className="mb-8 overflow-hidden rounded-4xl border border-[#E7D8CC] bg-linear-to-r from-[#FFF8F2] via-white to-[#F8EEE6] p-8 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#F6ECE5] px-4 py-2 text-sm font-semibold text-[#8B5E49]">
                <Film size={16} />
                Home Media Library
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-[#3F322B]">
                Home Videos
              </h1>

              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                Upload, organize and manage promotional videos displayed on your
                home page. Hover over any video to preview it instantly.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-3 rounded-2xl bg-linear-to-r from-[#7B523B] to-[#96654A] px-7 py-4 font-semibold text-white shadow-xl shadow-[#7B523B]/20 transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <Plus size={20} />
              Upload Video
            </button>
          </div>

          {/* Stats */}
        </div>
        {/* Loading */}

        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-[30px] border border-[#E7D8CC] bg-white"
              >
                <div className="aspect-video bg-[#EFE5DD]" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 rounded bg-[#EFE5DD]" />
                  <div className="h-4 w-1/2 rounded bg-[#EFE5DD]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}

        {!loading && videos.length === 0 && (
          <div className="flex min-h-112.5 flex-col items-center justify-center rounded-4xl border border-dashed border-[#D8C4B5] bg-white">
            <div className="rounded-full bg-[#F6ECE5] p-8">
              <Video size={60} className="text-[#8B5E49]" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#3F322B]">
              No Videos Yet
            </h2>

            <p className="mt-3 max-w-md text-center text-slate-500">
              Upload your first promotional video to display it on your
              homepage.
            </p>

            <button
              onClick={() => setShowAddModal(true)}
              className="mt-8 flex items-center gap-2 rounded-2xl bg-[#7B523B] px-6 py-3 font-semibold text-white transition hover:bg-[#684534]"
            >
              <Plus size={18} />
              Upload Video
            </button>
          </div>
        )}

        {/* Video Grid */}

        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((item) => (
              <div
                key={item._id}
                onMouseEnter={() => playVideo(item._id)}
                onMouseLeave={() => stopVideo(item._id)}
                className="group overflow-hidden rounded-4xl border border-[#E7D8CC] bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <video
                    ref={(el) => {
                      videoRefs.current[item._id] = el;
                    }}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  >
                    <source src={item.video} type="video/mp4" />
                  </video>

                  {/* Gradient */}

                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

                  {/* Badge */}

                  {/* Delete */}

                  <button
                    onClick={() => handleDelete(item)}
                    className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-red-500 opacity-0 shadow-lg backdrop-blur transition-all duration-300 hover:bg-red-500 hover:text-white group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>

                  {/* Play */}
                </div>
              </div>
            ))}
          </div>
        )}

        <AddVideoModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
        />

        <DeleteVideoModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={() => {
            console.log(selectedVideo);
            setShowDeleteModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default AddHomeVideos;
