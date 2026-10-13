import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import edit from "../../public/edit.json";
import { CREAM, NAVY } from "./brand";
import { BRoll } from "./BRoll";
import { loadBrandFonts } from "./fonts";
import { KineticText } from "./KineticText";
import { BROLL, END_CARD_SEC, FLASHES, FRAMINGS, REVEAL_AT } from "./timeline";

loadBrandFonts();

export const VENUE_REEL_DURATION_SEC = edit.durationSec + END_CARD_SEC;

const words = edit.captions.map((c) => ({ text: c.text, startMs: c.startMs }));
const voiceEndMs = Math.round(edit.durationSec * 1000);

const inBRoll = (t: number) => BROLL.some((c) => t >= c.from && t < c.to);
// Texto oscuro solo sobre el fondo crema (antes del cambio a marino y fuera del b-roll)
const isDark = (t: number) => t < REVEAL_AT && !inBRoll(t);

// Fondo detrás de la persona sin croma: crema (problema) → marino (solución)
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const navy = frame >= REVEAL_AT * fps;
  return (
    <AbsoluteFill
      style={{
        background: navy
          ? `radial-gradient(ellipse at 60% 45%, #1C3156 0%, ${NAVY} 70%)`
          : `radial-gradient(ellipse at 60% 45%, #FFFFFF 0%, ${CREAM} 75%)`,
      }}
    />
  );
};

// Persona recortada (public/talk.webm, VP9 con alfa) con "cambios de plano" digitales
const TalkingHead: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const f = [...FRAMINGS].reverse().find((x) => t >= x.from) ?? FRAMINGS[0];
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${f.x}px) scale(${f.scale})`,
        transformOrigin: "50% 100%",
        clipPath: `inset(0 0 0 ${f.clipLeft}%)`,
      }}
    >
      <OffthreadVideo src={staticFile("talk.webm")} transparent muted />
    </AbsoluteFill>
  );
};

// Flash/desenfoque corto en los cambios de bloque (estilo.md §6)
const Flash: React.FC<{ at: number }> = ({ at }) => {
  const { fps } = useVideoConfig();
  const len = Math.round(0.3 * fps);
  return (
    <Sequence
      from={Math.round(at * fps) - Math.round(len / 2)}
      durationInFrames={len}
    >
      <FlashInner len={len} />
    </Sequence>
  );
};

const FlashInner: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, len / 2, len], [0, 0.85, 0]);
  return <AbsoluteFill style={{ background: CREAM, opacity: o }} />;
};

// Cierre: fundido a marino con el logo
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bg = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const s = spring({
    frame: frame - Math.round(0.15 * fps),
    fps,
    config: { damping: 200 },
  });
  return (
    <AbsoluteFill
      style={{
        background: NAVY,
        opacity: bg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Img
        src={staticFile("brand/logo-venuefinder-dorado.png")}
        style={{
          width: 760,
          opacity: s,
          filter: `blur(${(1 - s) * 10}px)`,
          transform: `scale(${0.94 + s * 0.06})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const VenueReel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Background />
      <TalkingHead />
      {BROLL.map((clip, i) => (
        <BRoll key={i} clip={clip} />
      ))}
      <KineticText words={words} endMs={voiceEndMs} isDark={isDark} />
      {FLASHES.map((t) => (
        <Flash key={t} at={t} />
      ))}
      <Sequence
        from={Math.round(edit.durationSec * fps)}
        durationInFrames={Math.round(END_CARD_SEC * fps)}
      >
        <EndCard />
      </Sequence>
      <Audio src={staticFile("voz.wav")} />
    </AbsoluteFill>
  );
};
