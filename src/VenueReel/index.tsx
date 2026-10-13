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
import { CREAM, FONT, GOLD, NAVY } from "./brand";
import { BRoll } from "./BRoll";
import { Captions, Word } from "./Captions";
import { loadBrandFonts } from "./fonts";
import { HeadlineSeq } from "./Headline";
import {
  BROLL,
  CTA_FROM,
  FLASHES,
  FRAMINGS,
  HEADLINES,
  LOGO_REVEAL,
  REVEAL_AT,
} from "./timeline";

loadBrandFonts();

export const VENUE_REEL_DURATION_SEC = edit.durationSec;

const words: Word[] = edit.captions.map((c) => ({
  text: c.text,
  startMs: c.startMs,
  endMs: c.endMs,
}));

const inBRoll = (t: number) => BROLL.some((c) => t >= c.from && t < c.to);

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

const Logo: React.FC<{ width: number; top: number }> = ({ width, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.5 * fps),
  });
  return (
    <AbsoluteFill style={{ top, bottom: "auto", alignItems: "center" }}>
      <Img
        src={staticFile("brand/logo-venuefinder-dorado.png")}
        style={{
          width,
          opacity: s,
          filter: `blur(${(1 - s) * 10}px)`,
          transform: `scale(${0.92 + s * 0.08})`,
        }}
      />
    </AbsoluteFill>
  );
};

const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - Math.round(0.3 * fps),
    fps,
    config: { damping: 14 },
  });
  return (
    <>
      <Logo width={640} top={170} />
      <AbsoluteFill style={{ top: 360, bottom: "auto", alignItems: "center" }}>
        <span
          style={{
            fontFamily: FONT,
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: 96,
            letterSpacing: -3,
            color: NAVY,
            background: GOLD,
            padding: "4px 34px 14px",
            transform: `scale(${s})`,
          }}
        >
          Dale like
        </span>
      </AbsoluteFill>
    </>
  );
};

export const VenueReel: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Background />
      <TalkingHead />
      {BROLL.map((clip, i) => (
        <BRoll key={i} clip={clip} />
      ))}
      {HEADLINES.map((h, i) => (
        <HeadlineSeq
          key={i}
          headline={h}
          dark={h.from < REVEAL_AT && !inBRoll(h.from + 0.5)}
        />
      ))}
      <Sequence
        from={Math.round(LOGO_REVEAL.from * fps)}
        durationInFrames={Math.round((LOGO_REVEAL.to - LOGO_REVEAL.from) * fps)}
      >
        <Logo width={820} top={260} />
      </Sequence>
      <Sequence
        from={Math.round(CTA_FROM * fps)}
        durationInFrames={durationInFrames - Math.round(CTA_FROM * fps)}
      >
        <CallToAction />
      </Sequence>
      <Captions words={words} />
      {FLASHES.map((t) => (
        <Flash key={t} at={t} />
      ))}
      <Audio src={staticFile("voz.wav")} />
    </AbsoluteFill>
  );
};
