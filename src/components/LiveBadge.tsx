export default function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
      <span className="w-2 h-2 rounded-full bg-white animate-live-pulse" />
      Live
    </span>
  );
}
