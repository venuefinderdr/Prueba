# Estilo de edición

Fuente: `referencia.mp4` (grabación de pantalla de un reel de Instagram, 54 s, 1320x2868 @60 fps).
Análisis: 108 fotogramas (2/s) + 20 cambios de plano detectados (ffmpeg `scene>0.3`) + audio.
Medidas de posición/tamaño convertidas a lienzo 1080x1920 (el vídeo ocupa ~0–82 % de la pantalla grabada;
el resto es interfaz de Instagram). [SUPOSICIÓN] = inferido, no medido.

**Este archivo manda en ritmo y edición. Colores, fuentes y logo salen de `marca.md`.**

## 1. Estructura (54 s)
| Tramo | Tiempo | Contenido |
|---|---|---|
| Gancho | 0–7 s | Metáfora visual (zoom a través de una ventana → plano cinematográfico) + pregunta |
| Problema | 7–28 s | A cámara, plano entero, fondo blanco + b-roll metafórico del problema |
| Giro | 28–34 s | A cámara, plano medio, más cerca, tono más directo |
| Solución | 34–48 s | B-roll de la metáfora resuelta + capturas del producto (web) |
| Cierre | 48–54 s | A cámara sonriendo → vuelve al plano del gancho (bucle) |

- El final reutiliza el plano inicial: **vídeo en bucle** para que se vuelva a ver.

## 2. Ritmo de cortes
- 21 planos en 54 s → **duración media 2,6 s**; mínimo 0,9 s, máximo 6,1 s.
- Duraciones medidas (s): 1.1, 2.6, 1.6, 2.0, 2.2, 2.7, 1.1, 1.3, 1.7, 3.0, 3.5, 5.8, 2.8, 5.2, 1.5, 1.8, 2.4, 6.1, 2.1, 0.9, 2.7.
- Regla: **cortes cortos (1–2 s) en el gancho y en el b-roll; planos largos (5–6 s) solo a cámara**.
- Nunca más de **6 s** sin cambio de plano, zoom o texto nuevo.
- Sin silencios: el audio no tiene ningún hueco > 0,25 s en todo el vídeo (silencedetect −40 dB).

## 3. Subtítulos (voz, palabra a palabra)
- Fuente: sans-serif **cursiva**, peso regular, blanca, sin caja ni contorno; sombra suave. [SUPOSICIÓN: tipo Helvetica Neue Italic]
  → con nuestra marca: **Plus Jakarta Sans 500 italic**.
- Tamaño: **~46 px** en 1080x1920 (pequeño; no compite con los titulares).
- Posición: centrados en horizontal, **~55 % de la altura** (≈ y 1050 px), por debajo de la cara.
- Palabras por bloque: **1–3** (p. ej. "tenía ritmo.", "qué instrumento", "Tu contenido tenía").
- Duración por bloque: **~0,5–1,0 s**, al ritmo de la voz. [SUPOSICIÓN: medido a 2 fps]
- Animación: aparece/desaparece con fundido corto. [SUPOSICIÓN: ~100 ms]
- Palabra destacada: la referencia **no** destaca palabras en los subtítulos; lo hace con los titulares (sección 4).
  → con nuestra marca: la palabra clave de cada frase va en el **bloque dorado `#C9A960` con texto marino** (sello de `marca.md`).

## 4. Textos en pantalla (titulares cinéticos)
- Aparecen en **los momentos clave** de la frase (~1 cada 5–8 s), no siempre: "pero hoy tu calendario",
  "tres líneas de un email", "una campaña a medio hacer", "y cuando terminas el día...", "está más vacío", "orquesta completa".
- Composición en **2–3 líneas con jerarquía**:
  - Línea de apoyo: cursiva regular, **~70 px**.
  - Palabra clave: **negrita cursiva, ~125–140 px**, tracking negativo.
  - Remate opcional: pequeña (~45 px), alineada a la derecha, con puntos suspensivos ("el día...").
- Posición: **tercio superior, y ≈ 20–30 %** de la altura, encima de la cabeza; a veces **detrás de la persona**
  (la cabeza tapa parte del texto, efecto profundidad). [SUPOSICIÓN: requiere recorte/segmentación]
- Color: blanco. → con nuestra marca: crema `#F7F4EE`, palabra clave puede ir en dorado `#C9A960`.
- Animación: entra **palabra a palabra** con desenfoque → nítido (~200 ms) y sale con **desenfoque + fundido** (fotograma 22,5 s).
- Duración en pantalla: **1,5–3 s**.

## 5. B-roll
- **~55 % del tiempo es b-roll**, casi todo **metafórico** (una orquesta/instrumentos = estrategia de contenido;
  post-its que explotan = caos; persona con 6 brazos = multitarea). Generado con IA. [SUPOSICIÓN]
- Ilustra literalmente la frase que se está diciendo, en el mismo instante.
- 2 capturas de producto (web) al final con desplazamiento vertical suave (44–48 s).
- → para Venue Finder: b-roll real de venues (salones, jardines, montajes, detalles de boda) y capturas de la web.

## 6. Transiciones
- La mayoría: **corte seco**.
- En cambios de bloque (problema→giro→solución): **desenfoque gaussiano de salida (~0,3 s)** o **fundido a blanco**
  (34 s, 44 s, 48 s).
- Ocasional: zoom de entrada a través de un marco (ventana) en el gancho (0–1 s y 50–51 s).

## 7. Zooms y movimiento
- B-roll: **push-in lento continuo** (~5–10 % de escala por plano). [SUPOSICIÓN]
- A cámara: plano estático; el "zoom" se hace **cambiando de plano** (entero → medio) al cambiar de idea (28 s).
- Nada de zooms bruscos tipo punch-in en cada frase.

## 8. Color
- Dos ambientes alternos:
  - **Estudio blanco** muy luminoso, alto brillo, sombras suaves (partes a cámara).
  - **Cinematográfico cálido**: fondos oscuros, foco cenital, contraste alto (b-roll metafórico).
- Un **color de acento constante en la persona** (traje rojo saturado) que conecta todos los planos.
  → nuestra versión: el acento lo ponen los gráficos en marino/dorado; mantener la ropa en un color consistente si se puede.
- Saturación moderada-alta; piel cálida.

## 9. Sonido
- Voz en off/a cámara continua, **muy comprimida**: LRA 3,5 LU, integrado −17,9 LUFS (grabación de pantalla). [SUPOSICIÓN: el original estaría a ~−14 LUFS]
- Objetivo de exportación: **−14 LUFS**, picos ≤ −1 dBTP.
- Música de fondo suave bajo la voz (orquestal/cinemática, acorde con la metáfora). [SUPOSICIÓN: no separada]
- Efectos (whoosh) en algunas transiciones. [SUPOSICIÓN]

## 10. Correcciones del usuario
(Paso 4: aquí se añaden las correcciones aprobadas.)
