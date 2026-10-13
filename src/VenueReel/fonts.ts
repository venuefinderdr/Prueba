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

// Safira March no es libre: se usa si su archivo está en public/fonts/ (SafiraMarch.otf/.ttf/.woff2/.woff)
const findSafira = () =>
  getStaticFiles().find((f) =>
    /^fonts\/safira[-_ ]?march.*\.(otf|ttf|woff2?)$/i.test(f.name),
  );

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
  const safira = findSafira();
  if (safira) {
    faces.push(new FontFace("Safira March", `url('${safira.src}')`));
  } else {
    console.warn(
      "Safira March no encontrada en public/fonts/: se usa Georgia como sustituta",
    );
  }
  Promise.all(
    faces.map(async (face) => {
      await face.load();
      document.fonts.add(face);
    }),
  ).then(() => continueRender(handle));
};
