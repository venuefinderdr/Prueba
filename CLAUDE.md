# Editor de vídeo con Remotion

Este repo es un proyecto de Remotion (plantilla TikTok) para editar vídeos verticales
1080x1920 a 30 fps con subtítulos palabra a palabra. El flujo de trabajo completo está en
`docs/PROMPT-EDITOR.md`: síguelo paso a paso y no avances sin terminar el anterior.

## Estado
- Paso 1 (preparar todo): hecho. Node 22, ffmpeg, whisper.cpp 1.6.0 (`./whisper.cpp`, gitignored,
  modelo `medium` en español; se descarga en la primera transcripción), skills oficiales en `.claude/skills/`.
- Pasos 2–4: pendientes de `referencia.mp4` y `mi-video.mp4` (ponlos en la raíz; están en .gitignore).

## Convenciones
- `marca.md` (raíz) = marca Venue Finder DR (colores, Plus Jakarta Sans, logo en `public/brand/`).
  Manda sobre `estilo.md` en colores, fuentes y logo; `estilo.md` manda en ritmo y edición.
- `estilo.md` (raíz) es la fuente de verdad del estilo: valores concretos, `[SUPOSICIÓN]` donde se infiera.
  Cada corrección que el usuario apruebe se añade ahí (paso 4).
- Fotogramas y audio de análisis van en `analisis/` (gitignored):
  `ffmpeg -i referencia.mp4 -vf fps=2 analisis/frames/f_%04d.jpg` y
  `ffmpeg -i referencia.mp4 -vf "select='gt(scene,0.3)',showinfo" -vsync vfr analisis/cortes/c_%04d.jpg`.
- Transcripción: `node sub.mjs public/<video>.mp4` → `public/<video>.json` (captions con tiempos por palabra).
- Composición principal: `src/Root.tsx` → `CaptionedVideo` (fps 30 en `calculateCaptionedVideoMetadata`).
- Antes de terminar: `npm run lint`.

## Renderizar en la nube (sandbox sin acceso a remotion.media)
```
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
npx remotion render CaptionedVideo out/borrador.mp4
```
En local no hace falta: Remotion descarga su propio navegador.
