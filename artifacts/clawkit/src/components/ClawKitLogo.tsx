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
  const glowId = `clawGlow-${uid}`;

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
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0090CC" />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Toolkit/box outline */}
        <rect x="4" y="4" width="56" height="56" rx="12" fill="rgba(0,0,0,0.3)" stroke="rgba(0,195,255,0.2)" strokeWidth="1.5" />
        <rect x="8" y="8" width="48" height="48" rx="10" fill="none" stroke="rgba(0,195,255,0.12)" strokeWidth="1" strokeDasharray="2 2" />

        {/* Robotic/eagle claw with blue neon glow */}
        <g filter={`url(#${glowId})`}>
          <path d="M18 22 C18 22 14 32 14 38 C14 42 16 44 18 44" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M26 18 C26 18 24 30 24 38 C24 42 26 46 28 46" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M38 18 C38 18 40 30 40 38 C40 42 38 46 36 46" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M46 22 C46 22 50 32 50 38 C50 42 48 44 46 44" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Base/toolkit floor */}
        <rect x="24" y="48" width="16" height="4" rx="2" fill={`url(#${gradId})`} opacity="0.6" />
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
