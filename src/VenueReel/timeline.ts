// Línea de tiempo del reel, en segundos del vídeo YA editado (sin silencios).
// Los tiempos salen de public/edit.json (scripts/cortes.py).

export type BRollClip = {
  src: string; // ruta dentro de public/
  from: number;
  to: number;
  startAt?: number; // segundo del clip original en el que empieza
};

export const BROLL: BRollClip[] = [
  // Gancho: "¿Has pasado horas buscando el lugar perfecto...?"
  { src: "broll/IMG_6062.mp4", from: 0, to: 1.5, startAt: 2 },
  { src: "broll/IMG_2868.mp4", from: 1.5, to: 3.0, startAt: 2.5 },
  { src: "broll/IMG_7433.mp4", from: 3.0, to: 4.55, startAt: 1 },
  // "...tu boda, cumpleaños o fiestas"
  { src: "broll/IMG_5279.mp4", from: 5.95, to: 6.9, startAt: 0.5 },
  { src: "broll/IMG_5350.jpg", from: 6.9, to: 7.81 },
  // "espacios curados y verificados por expertos"
  { src: "broll/IMG_6721.mp4", from: 25.59, to: 27.3, startAt: 4 },
  { src: "broll/IMG_3765.mp4", from: 27.3, to: 29.0, startAt: 4 },
  // "información detallada y fotos de cada uno"
  { src: "broll/IMG_3555.jpg", from: 29.0, to: 30.6 },
  { src: "broll/IMG_6297.jpg", from: 30.6, to: 32.26 },
  // "Filtrar... y solicitar cotización al instante" (tapa el zoom de cámara)
  { src: "broll/IMG_6702.mp4", from: 32.26, to: 34.4, startAt: 1 },
  { src: "broll/IMG_5316.mp4", from: 34.4, to: 36.65, startAt: 1.5 },
  // "buscando crecer a nivel nacional e internacional"
  { src: "broll/IMG_6062.mp4", from: 42.99, to: 45.98, startAt: 4.5 },
];

// Fondo detrás de la persona: crema en el problema, marino desde "Por eso creamos Venue Finder"
export const REVEAL_AT = 19.62;
// Cierre: fondo marino con el logo después de la última palabra
export const END_CARD_SEC = 1.5;

// Encuadres de la persona (cambios de "plano" digitales). El vídeo original hace zoom a 32,4 s.
export type Framing = {
  from: number;
  scale: number;
  x: number;
  clipLeft: number;
};
export const FRAMINGS: Framing[] = [
  { from: 0, scale: 0.86, x: -70, clipLeft: 11 }, // plano medio (borde del softbox a la izquierda)
  { from: 13.02, scale: 0.93, x: -110, clipLeft: 11 }, // más cerrado: "Cuando por fin encuentras uno"
  { from: 19.62, scale: 0.86, x: -70, clipLeft: 11 },
  { from: 21.42, scale: 0.93, x: -110, clipLeft: 11 },
  { from: 32.4, scale: 1.0, x: -120, clipLeft: 27 }, // plano americano: tapa softbox y pértiga
];

// Transiciones con desenfoque/flash en los cambios de bloque
export const FLASHES = [4.55, 19.62, 36.65];
