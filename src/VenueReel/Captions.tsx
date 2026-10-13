import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT, GOLD, NAVY } from "./brand";
import { KEYWORDS } from "./timeline";

export type Word = { text: string; startMs: number; endMs: number };
type Page = { startMs: number; endMs: number; words: Word[] };

// Bloques de 1–3 palabras (estilo.md §3); corta en puntuación y a los 1,1 s
const toPages = (words: Word[]): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) {
      pages.push({
        startMs: cur[0].startMs,
        endMs: cur[cur.length - 1].endMs,
        words: cur,
      });
    }
    cur = [];
  };
  for (const w of words) {
    if (cur.length && (cur.length >= 3 || w.endMs - cur[0].startMs > 1100)) {
      flush();
    }
    cur.push(w);
    if (/[.,?!]$/.test(w.text.trim())) {
      flush();
    }
  }
  flush();
  return pages;
};

const norm = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[¿?¡!.,]/g, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const KEY_NORM = new Set([...KEYWORDS].map(norm));

const CaptionPage: React.FC<{ page: Page }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = page.startMs + (frame / fps) * 1000;
  const fade = interpolate(frame, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ top: 1290, bottom: "auto", alignItems: "center", opacity: fade }}
    >
      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0 90px",
        }}
      >
        {page.words.map((w, i) => {
          const isKey = KEY_NORM.has(norm(w.text));
          const spoken = t >= w.startMs;
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontStyle: "italic",
                fontWeight: isKey ? 800 : 500,
                fontSize: 56,
                lineHeight: 1.2,
                color: isKey ? NAVY : "white",
                background: isKey ? GOLD : "transparent",
                padding: isKey ? "0 14px 4px" : 0,
                opacity: spoken ? 1 : 0.55,
                textShadow: isKey
                  ? "none"
                  : `0 0 3px ${NAVY}, 0 0 3px ${NAVY}, 0 2px 10px rgba(17,32,58,0.8)`,
              }}
            >
              {w.text.trim()}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(() => toPages(words), [words]);
  return (
    <>
      {pages.map((p, i) => {
        const from = Math.round((p.startMs / 1000) * fps);
        const next = pages[i + 1];
        const end = Math.round(
          ((next ? next.startMs : p.endMs + 400) / 1000) * fps,
        );
        const durationInFrames = Math.max(end - from, 1);
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <CaptionPage page={p} />
          </Sequence>
        );
      })}
    </>
  );
};
