
export default function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-2xl animate-pulse bg-card"
        style={{ aspectRatio: "4/5"}}
      />
      <div
        className="h-2.5 w-1/3 rounded animate-pulse bg-card"
      />
      <div
        className="h-3 w-2/3 rounded animate-pulse bg-card"
      />
      <div
        className="h-3 w-1/2 rounded animate-pulse bg-card"
      />
    </div>
  );
}
