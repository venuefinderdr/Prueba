import { continueRender, delayRender, staticFile } from "remotion";
import { FONT } from "./brand";

const FACES = [
  {
    file: "plus-jakarta-sans-latin-500-normal.woff2",
    weight: "500",
    style: "normal",
  },
  {
    file: "plus-jakarta-sans-latin-800-normal.woff2",
    weight: "800",
    style: "normal",
  },
  {
    file: "plus-jakarta-sans-latin-500-italic.woff2",
    weight: "500",
    style: "italic",
  },
  {
    file: "plus-jakarta-sans-latin-800-italic.woff2",
    weight: "800",
    style: "italic",
  },
];

let loaded = false;

export const loadBrandFonts = () => {
  if (loaded) {
    return;
  }
  loaded = true;
  const handle = delayRender("Cargando Plus Jakarta Sans");
  Promise.all(
    FACES.map(async ({ file, weight, style }) => {
      const face = new FontFace(
        FONT,
        `url('${staticFile(`fonts/${file}`)}') format('woff2')`,
        {
          weight,
          style,
        },
      );
      await face.load();
      document.fonts.add(face);
    }),
  ).then(() => continueRender(handle));
};
