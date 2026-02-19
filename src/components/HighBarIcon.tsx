export default function HighBarIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left post */}
      <rect x="10" y="8" width="4" height="52" rx="1" fill="currentColor" />
      {/* Right post */}
      <rect x="50" y="8" width="4" height="52" rx="1" fill="currentColor" />
      {/* Bar */}
      <rect x="8" y="8" width="48" height="3" rx="1.5" fill="currentColor" />
      {/* Base left */}
      <rect x="4" y="56" width="16" height="3" rx="1" fill="currentColor" opacity="0.7" />
      {/* Base right */}
      <rect x="44" y="56" width="16" height="3" rx="1" fill="currentColor" opacity="0.7" />
      {/* Gymnast silhouette (hanging from bar) */}
      <circle cx="32" cy="15" r="3" fill="currentColor" opacity="0.9" />
      <path
        d="M32 18 L32 30 M28 22 L36 22 M32 30 L28 38 M32 30 L36 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Arms reaching up to bar */}
      <path
        d="M28 22 L26 12 M36 22 L38 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}
