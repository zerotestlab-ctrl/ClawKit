import { useId } from "react";

interface InvokexLogoProps {
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

export function InvokexLogo({ size = "md", showText = true, className = "" }: InvokexLogoProps) {
  const s = sizes[size];
  const uid = useId();
  const gradId = `invokeGrad-${uid}`;
  const glowId = `invokeGlow-${uid}`;
  const waveGradId = `waveGrad-${uid}`;

  return (
    <div className={`flex items-center ${s.gap} ${className}`} aria-label="Invokex" role="img">
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
          <linearGradient id={waveGradId} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#00C3FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0090CC" stopOpacity="0.3" />
          </linearGradient>
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="4" y="4" width="56" height="56" rx="14" fill="rgba(0,0,0,0.3)" stroke="rgba(0,195,255,0.15)" strokeWidth="1.5" />

        <g filter={`url(#${glowId})`}>
          <path
            d="M12 38 Q20 18 32 32 Q44 46 52 26"
            stroke={`url(#${waveGradId})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          <path
            d="M12 32 Q22 12 32 28 Q42 44 52 20"
            stroke={`url(#${gradId})`}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          <circle cx="12" cy="32" r="3" fill={`url(#${gradId})`} opacity="0.7" />
          <circle cx="52" cy="20" r="3" fill={`url(#${gradId})`} opacity="0.7" />

          <circle cx="32" cy="28" r="2" fill="#00D4FF" opacity="0.5" />
        </g>
      </svg>
      {showText && (
        <span className={`font-display font-bold ${s.text} tracking-tight`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C3FF] to-[#00A0E0] drop-shadow-[0_0_12px_rgba(0,195,255,0.5)]">Invoke</span>
          <span className="text-white">x</span>
        </span>
      )}
    </div>
  );
}
