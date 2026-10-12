# Prompt · Editor de vídeo (Claude Code + Remotion)

Fuente: reel de Instagram de @robles.ia — https://www.instagram.com/reel/DeO4koGE9Oa/

> Actúa como mi editor de vídeo con Remotion. Trabaja paso a paso y no avances sin terminar el anterior.
>
> **1. PREPARA TODO:** comprueba que tengo Node, ffmpeg y Whisper (instala lo que falte). Crea un proyecto de Remotion vertical 1080x1920 a 30 fps e instala las skills oficiales con: `npx skills add remotion-dev/skills`
>
> **2. ANALIZA EL VÍDEO DE REFERENCIA (`referencia.mp4`):** extrae tú los fotogramas con ffmpeg (2 por segundo + cada cambio de plano) y el audio, y estudia el vídeo entero. Escribe un `estilo.md` con valores concretos, no adjetivos: ritmo de cortes, subtítulos (fuente, tamaño, posición, palabras por bloque, animación, palabra destacada), textos en pantalla, b-roll, transiciones, zooms, color y sonido. Marca lo que supongas con [SUPOSICIÓN]. Enséñame un resumen de 5 líneas antes de seguir.
>
> **3. EDITA MI VÍDEO (`mi-video.mp4`):** transcríbelo con Whisper con tiempos por palabra, corta los silencios de más de 0,3 s y edítalo siguiendo `estilo.md` con subtítulos sincronizados palabra a palabra. Renderiza un borrador y dime qué decisiones has tomado.
>
> **4.** Cuando te corrija algo que me guste, añádelo a `estilo.md` para que se quede.
