import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GOLD, NAVY } from "./brand";
import { BRollClip } from "./timeline";

// Push-in lento y continuo (estilo.md §7): ~8 % de escala por plano
const PushIn: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.08]);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

// Grabación de la web (horizontal): tarjeta con esquinas redondeadas sobre marino, bajo el texto
const ScreenRecording: React.FC<{ src: string; durationInFrames: number }> = ({
  src,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, 0.35 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.04]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 60%, #1C3156 0%, ${NAVY} 70%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 640,
          width: 1000,
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          border: `3px solid ${GOLD}`,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 60}px) scale(${scale})`,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{ width: "100%", display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const BRoll: React.FC<{ clip: BRollClip }> = ({ clip }) => {
  const { fps } = useVideoConfig();
  const from = Math.round(clip.from * fps);
  const durationInFrames = Math.round(clip.to * fps) - from;
  const isImage = clip.src.endsWith(".jpg");
  if (clip.screen) {
    return (
      <Sequence
        from={from}
        durationInFrames={durationInFrames}
        premountFor={fps}
      >
        <ScreenRecording src={clip.src} durationInFrames={durationInFrames} />
      </Sequence>
    );
  }
  return (
    <Sequence from={from} durationInFrames={durationInFrames} premountFor={fps}>
      <PushIn durationInFrames={durationInFrames}>
        {isImage ? (
          <Img
            src={staticFile(clip.src)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <OffthreadVideo
            src={staticFile(clip.src)}
            muted
            trimBefore={Math.round((clip.startAt ?? 0) * fps)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
      </PushIn>
      {/* Degradado marino arriba para que el texto se lea sobre b-roll luminoso */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(17,32,58,0.75) 0%, rgba(17,32,58,0.35) 22%, rgba(17,32,58,0) 38%)",
        }}
      />
    </Sequence>
  );
};
