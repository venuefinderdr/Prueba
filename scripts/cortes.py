"""Corta silencios > 0,3 s y re-mapea los subtítulos al tiempo editado.

Silencios: ffmpeg silencedetect (-35 dB, >= 0,3 s) sobre el audio.
Texto/tiempos: transcripción de Whisper (public/<video>.json).

Uso: python3 -I scripts/cortes.py public/mi-video.mp4 public/mi-video.json public/edit.json
"""
import json, re, subprocess, sys

MIN_SIL = 0.30      # silencios a cortar (s)
KEEP = 0.10         # aire que se deja a cada lado del corte (s)
START = 1.95        # quita "Ok. Comenzamos."
FIXES = {"tanda": "tarda", "Impulsanos": "Impúlsanos"}

video, src, dst = sys.argv[1:4]
log = subprocess.run(["ffmpeg", "-i", video, "-vn", "-af",
                      f"silencedetect=n=-35dB:d={MIN_SIL}", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]

def in_long_silence(t):
    # Whisper "alucina" frases (p. ej. "¡Gracias por ver el vídeo!") sobre silencios largos
    return any(s + 0.5 <= t <= e and e - s > 1.0 for s, e in zip(starts, ends))

words = [w for w in json.load(open(src))
         if w["startMs"] / 1000 >= START and not in_long_silence(w["startMs"] / 1000 + 0.05)]
for w in words:
    for a, b in FIXES.items():
        w["text"] = w["text"].replace(a, b)
end = words[-1]["endMs"] / 1000 + 0.3

# segmentos que se conservan = [START, end] menos los silencios (con aire)
segs, cur = [], START
for s, e in zip(starts, ends):
    cs, ce = s + KEEP, e - KEEP
    if ce <= cur or cs >= end:
        continue
    if cs > cur:
        segs.append([cur, cs])
    cur = max(cur, ce)
segs.append([cur, end])
segs = [[s, e] for s, e in segs if e - s > 0.05]

def remap(t):
    acc = 0.0
    for s, e in segs:
        if t < s:
            return acc
        if t <= e:
            return acc + t - s
        acc += e - s
    return acc

caps = []
for w in words:
    st = remap(w["startMs"] / 1000)
    caps.append({"text": w["text"], "startMs": round(st * 1000),
                 "endMs": round(remap(w["endMs"] / 1000) * 1000),
                 "timestampMs": None, "confidence": w.get("confidence")})
total = sum(e - s for s, e in segs)
# los tiempos de Whisper son aproximados: cada palabra dura al menos 150 ms y cabe en el vídeo
for i, c in enumerate(caps):
    c["startMs"] = min(c["startMs"], round(total * 1000) - 150 * (len(caps) - i))
    if i:
        c["startMs"] = max(c["startMs"], caps[i - 1]["startMs"] + 100)
for i, c in enumerate(caps):
    nxt = caps[i + 1]["startMs"] if i + 1 < len(caps) else round(total * 1000)
    c["endMs"] = max(min(c["endMs"], nxt), c["startMs"] + 100)
json.dump({"segments": [[round(s, 3), round(e, 3)] for s, e in segs],
           "durationSec": round(total, 3), "captions": caps},
          open(dst, "w"), ensure_ascii=False, indent=1)
print(f"{len(segs)} segmentos; {total:.2f} s editados (antes {end - START:.2f} s)")
