import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CREAM, FONT, GOLD, NAVY } from "./brand";
import { Headline as HeadlineT } from "./timeline";

const SIZES = { xs: 44, sm: 72, lg: 132 } as const;

// Titular cinético (estilo.md §4): entra palabra a palabra de desenfocado a nítido,
// sale con desenfoque + fundido. Palabra clave en bloque dorado (marca.md).
const HeadlineInner: React.FC<{
  headline: HeadlineT;
  durationInFrames: number;
  dark: boolean;
}> = ({ headline, durationInFrames, dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exitStart = durationInFrames - Math.round(0.25 * fps);
  const exit = interpolate(frame, [exitStart, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const color = dark ? NAVY : CREAM;
  let wordIndex = 0;

  return (
    <AbsoluteFill
      style={{
        top: 150,
        bottom: "auto",
        alignItems: "center",
        padding: "0 70px",
        filter: `blur(${exit * 14}px)`,
        opacity: 1 - exit,
      }}
    >
      {headline.lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: line.size === "lg" ? 0 : 18,
            marginTop: li === 0 ? 0 : line.size === "lg" ? 10 : 2,
          }}
        >
          {(line.highlight ? [line.text] : line.text.split(" ")).map((word, wi) => {
            const delay = Math.round(wordIndex++ * 0.09 * fps);
            const p = interpolate(
              frame,
              [delay, delay + Math.round(0.2 * fps)],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );
            return (
              <span
                key={wi}
                style={{
                  fontFamily: FONT,
                  fontStyle: "italic",
                  fontWeight: line.size === "lg" ? 800 : 500,
                  fontSize: SIZES[line.size],
                  lineHeight: 1.05,
                  letterSpacing: line.size === "lg" ? -4 : -1,
                  color: line.highlight ? NAVY : color,
                  background: line.highlight ? GOLD : "transparent",
                  padding: line.highlight ? "4px 30px 14px" : 0,
                  textShadow:
                    line.highlight || dark
                      ? "none"
                      : "0 4px 24px rgba(17,32,58,0.55)",
                  filter: `blur(${(1 - p) * 12}px)`,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 18}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const HeadlineSeq: React.FC<{ headline: HeadlineT; dark: boolean }> = ({
  headline,
  dark,
}) => {
  const { fps } = useVideoConfig();
  const from = Math.round(headline.from * fps);
  const durationInFrames = Math.round(headline.to * fps) - from;
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      <HeadlineInner
        headline={headline}
        durationInFrames={durationInFrames}
        dark={dark}
      />
    </Sequence>
  );
};
