import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GOLD } from "./brand";
import { IconCue, IconName } from "./timeline";

// Iconos propios (trazo grueso, dorado de marca), al estilo de los iconos planos que
// aparecen junto a la persona en la referencia del Banco Popular
const PATHS: Record<IconName, React.ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  money: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
      <circle cx="12" cy="12" r="2.8" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  ruler: (
    <>
      <rect x="2.5" y="8" width="19" height="8" rx="1" />
      <path d="M6 8v3M9.5 8v4M13 8v3M16.5 8v4" />
    </>
  ),
  hourglass: (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M7 3c0 5 10 5 10 9s-10 4-10 9" />
      <path d="M17 3c0 5-10 5-10 9s10 4 10 9" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M8.5 15l2.5 2.5 4.5-4.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
  ),
};

const IconPop: React.FC<{ cue: IconCue; durationInFrames: number }> = ({
  cue,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 160 } });
  const out = interpolate(
    frame,
    [durationInFrames - 0.15 * fps, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const size = cue.size ?? 300;
  return (
    <AbsoluteFill>
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke={GOLD}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: "absolute",
          left: cue.x,
          top: cue.y,
          transform: `scale(${pop * out}) rotate(${(1 - pop) * -12}deg)`,
          filter: "drop-shadow(0 8px 18px rgba(17,32,58,0.35))",
        }}
      >
        {PATHS[cue.icon]}
      </svg>
    </AbsoluteFill>
  );
};

export const Icons: React.FC<{ cues: IconCue[] }> = ({ cues }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map((cue, i) => {
        const from = Math.round(cue.from * fps);
        const durationInFrames = Math.round(cue.to * fps) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <IconPop cue={cue} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </>
  );
};
