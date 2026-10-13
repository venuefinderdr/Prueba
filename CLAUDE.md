# Editor de vídeo con Remotion

Este repo es un proyecto de Remotion (plantilla TikTok) para editar vídeos verticales
1080x1920 a 30 fps con subtítulos palabra a palabra. El flujo de trabajo completo está en
`docs/PROMPT-EDITOR.md`: síguelo paso a paso y no avances sin terminar el anterior.

## Estado
- Paso 1 (preparar todo): hecho. Node 22, ffmpeg, whisper.cpp 1.6.0 (`./whisper.cpp`, gitignored,
  modelo `medium` en español; se descarga en la primera transcripción), skills oficiales en `.claude/skills/`.
- Paso 2: hecho → `estilo.md`.
- Paso 3: borrador v1 → composición `VenueReel` (`src/VenueReel/`), render en `out/borrador-v1.mp4`.
- Paso 4: correcciones del usuario → añadir a `estilo.md` §10.

## Pipeline del reel (VenueReel)
1. `public/mi-video.mp4`: original convertido (HDR→SDR, 1080x1920, 30 fps) desde `mi-video.mov`.
2. `node sub.mjs public/mi-video.mp4` → `public/mi-video.json` (Whisper, palabras).
3. `python3 -I scripts/cortes.py public/mi-video.mp4 public/mi-video.json public/edit.json`
   → segmentos sin silencios > 0,3 s + subtítulos re-mapeados (corrige errores de Whisper en `FIXES`).
4. `python3 -I scripts/recorte.py public/mi-video.mp4 public/edit.json` → `public/talk.webm`
   (cortes + croma verde → VP9 con alfa) y `public/voz.wav` (−14 LUFS).
5. B-roll de venues en `public/broll/` (1080x1920 SDR). Tiempos, titulares, encuadres y palabras clave en
   `src/VenueReel/timeline.ts` (segundos del vídeo editado).
Medios pesados (`public/broll`, `talk.webm`, `voz.wav`, `mi-video.*`) no van a git.

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
