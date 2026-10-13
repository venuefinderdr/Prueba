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

export const BRoll: React.FC<{ clip: BRollClip }> = ({ clip }) => {
  const { fps } = useVideoConfig();
  const from = Math.round(clip.from * fps);
  const durationInFrames = Math.round(clip.to * fps) - from;
  const isImage = clip.src.endsWith(".jpg");
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
