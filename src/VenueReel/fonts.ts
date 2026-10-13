import {
  continueRender,
  delayRender,
  getStaticFiles,
  staticFile,
} from "remotion";

const POPPINS = [
  { file: "poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
  { file: "poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
  { file: "poppins-latin-600-normal.woff2", weight: "600", style: "normal" },
  { file: "poppins-latin-400-italic.woff2", weight: "400", style: "italic" },
];

// Claudia (fuente del logo) tiene licencia de uso personal: no va en git;
// se usa si su archivo está en public/fonts/marca/
const findClaudia = () =>
  getStaticFiles().find((f) => f.name === "fonts/marca/Claudia.woff2");

let loaded = false;

export const loadBrandFonts = () => {
  if (loaded) {
    return;
  }
  loaded = true;
  const handle = delayRender("Cargando fuentes de marca");
  const faces = POPPINS.map(
    ({ file, weight, style }) =>
      new FontFace("Poppins", `url('${staticFile(`fonts/${file}`)}')`, {
        weight,
        style,
      }),
  );
  const claudia = findClaudia();
  if (claudia) {
    faces.push(new FontFace("Claudia", `url('${claudia.src}')`));
  } else {
    console.warn(
      "Claudia no encontrada en public/fonts/marca/: se usa Georgia como sustituta",
    );
  }
  Promise.all(
    faces.map(async (face) => {
      await face.load();
      document.fonts.add(face);
    }),
  ).then(() => continueRender(handle));
};
