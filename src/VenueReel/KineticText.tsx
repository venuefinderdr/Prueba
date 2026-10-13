import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CREAM, GOLD, NAVY, TEXT_FONT, TITLE_FONT } from "./brand";
import { PHRASES } from "./phrases";

type Word = { text: string; startMs: number };
type Token = { text: string; big: boolean; startMs: number };
type Line = { big: boolean; tokens: Token[] };
type Phrase = { startMs: number; endMs: number; lines: Line[] };

const SMALL = 60; // Poppins 500
const BIG = 150; // Claudia
const WORD_IN = 0.15; // s: desenfocada → nítida
const PHRASE_OUT = 0.12; // s: la frase entera sale con desenfoque

// Une PHRASES (texto marcado) con los tiempos de cada palabra de la transcripción
const buildPhrases = (words: Word[], endMs: number): Phrase[] => {
  let i = 0;
  const phrases = PHRASES.map((p) => {
    const tokens: Token[] = [];
    let big = false;
    for (const raw of p.split(" ")) {
      const opens = raw.startsWith("*");
      const closes = raw.endsWith("*");
      if (opens) big = true;
      const w = words[i++];
      tokens.push({ text: w.text.trim(), big, startMs: w.startMs });
      if (closes) big = false;
    }
    const lines: Line[] = [];
    for (const t of tokens) {
      const last = lines[lines.length - 1];
      if (last && last.big === t.big) last.tokens.push(t);
      else lines.push({ big: t.big, tokens: [t] });
    }
    return { startMs: tokens[0].startMs, endMs: 0, lines };
  });
  if (i !== words.length) {
    throw new Error(
      `phrases.ts tiene ${i} palabras y la transcripción ${words.length}`,
    );
  }
  phrases.forEach((p, k) => {
    p.endMs = k + 1 < phrases.length ? phrases[k + 1].startMs : endMs;
  });
  return phrases;
};

const PhraseView: React.FC<{
  phrase: Phrase;
  durationInFrames: number;
  dark: boolean;
}> = ({ phrase, durationInFrames, dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = phrase.startMs / 1000 + frame / fps;
  const out = interpolate(
    frame,
    [durationInFrames - PHRASE_OUT * fps, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const smallColor = dark ? NAVY : CREAM;
  const shadow = dark ? "none" : "0 3px 18px rgba(17,32,58,0.65)";

  return (
    <AbsoluteFill
      style={{
        top: 200,
        left: 80,
        right: 80,
        bottom: "auto",
        filter: `blur(${out * 16}px)`,
        opacity: 1 - out,
      }}
    >
      {phrase.lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: line.big ? 0 : 16,
            rowGap: line.big ? 10 : 0,
            marginTop: li === 0 ? 0 : 12,
          }}
        >
          {line.tokens.map((tok, ti) => {
            const p = interpolate(
              t,
              [tok.startMs / 1000, tok.startMs / 1000 + WORD_IN],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );
            return (
              <span
                key={ti}
                style={{
                  fontFamily: line.big ? TITLE_FONT : TEXT_FONT,
                  fontWeight: line.big ? 400 : 500,
                  fontSize: line.big ? BIG : SMALL,
                  lineHeight: line.big ? 1.0 : 1.15,
                  // Palabra grande en bloque dorado con texto marino (sello de marca.md);
                  // bloques contiguos sin hueco para que una línea de varias palabras sea un solo bloque
                  color: line.big ? NAVY : smallColor,
                  background: line.big ? GOLD : "transparent",
                  padding: line.big ? "0 22px 12px" : 0,
                  textShadow: line.big ? "none" : shadow,
                  opacity: p,
                  filter: `blur(${(1 - p) * 10}px)`,
                }}
              >
                {tok.text}
              </span>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const KineticText: React.FC<{
  words: Word[];
  endMs: number;
  isDark: (sec: number) => boolean;
}> = ({ words, endMs, isDark }) => {
  const { fps } = useVideoConfig();
  const phrases = useMemo(() => buildPhrases(words, endMs), [words, endMs]);
  return (
    <>
      {phrases.map((p, k) => {
        const from = Math.round((p.startMs / 1000) * fps);
        const durationInFrames = Math.max(
          Math.round((p.endMs / 1000) * fps) - from,
          1,
        );
        return (
          <Sequence key={k} from={from} durationInFrames={durationInFrames}>
            <PhraseView
              phrase={p}
              durationInFrames={durationInFrames}
              dark={isDark(p.startMs / 1000 + 0.2)}
            />
          </Sequence>
        );
      })}
    </>
  );
};
