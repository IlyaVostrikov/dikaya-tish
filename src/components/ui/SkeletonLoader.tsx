"use client";

export default function SkeletonLoader({
  className = "aspect-[4/5]",
}: {
  className?: string;
}) {
  return (
    <div
      className={`${className} bg-ivory overflow-hidden relative`}
      role="status"
      aria-label="Загрузка"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite]" />
    </div>
  );
}
