import { useId } from "react";

interface ClawKitLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-lg", gap: "gap-2" },
  md: { icon: 36, text: "text-xl", gap: "gap-2.5" },
  lg: { icon: 48, text: "text-3xl", gap: "gap-3" },
  xl: { icon: 64, text: "text-5xl", gap: "gap-4" },
};

export function ClawKitLogo({ size = "md", showText = true, className = "" }: ClawKitLogoProps) {
  const s = sizes[size];
  const uid = useId();
  const gradId = `clawGrad-${uid}`;
  const filterId = `clawGlow-${uid}`;

  return (
    <div className={`flex items-center ${s.gap} ${className}`} aria-label="ClawKit" role="img">
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C3FF" />
            <stop offset="100%" stopColor="#0090CC" />
          </linearGradient>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="2" y="2" width="60" height="60" rx="14" fill="rgba(0,195,255,0.08)" stroke="rgba(0,195,255,0.25)" strokeWidth="1.5" />

        <g filter={`url(#${filterId})`}>
          <path d="M20 18C20 18 16 28 16 34C16 38 18 40 20 40" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 14C28 14 26 26 26 34C26 38 28 42 30 42" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M36 14C36 14 38 26 38 34C38 38 36 42 34 42" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M44 18C44 18 48 28 48 34C48 38 46 40 44 40" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        <rect x="22" y="44" width="20" height="6" rx="3" fill={`url(#${gradId})`} opacity="0.5" />
      </svg>
      {showText && (
        <span className={`font-display font-bold ${s.text} tracking-tight`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C3FF] to-[#00A0E0] drop-shadow-[0_0_12px_rgba(0,195,255,0.5)]">Claw</span>
          <span className="text-white">Kit</span>
        </span>
      )}
    </div>
  );
}
