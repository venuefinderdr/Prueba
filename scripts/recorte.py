"""Aplica los cortes de edit.json, quita el croma verde y normaliza la voz.

Uso: python3 -I scripts/recorte.py public/mi-video.mp4 public/edit.json
Salida: public/talk.webm (VP9 con alfa, sin audio) y public/voz.wav (−14 LUFS).
"""
import json, os, subprocess, sys, tempfile

KEY = "0x00A030"  # verde medido en el estudio
video, edit = sys.argv[1:3]
segs = json.load(open(edit))["segments"]
n = len(segs)

g = "".join(f"[0:v]trim={s}:{e},setpts=PTS-STARTPTS[v{i}];" for i, (s, e) in enumerate(segs))
g += "".join(f"[0:a]atrim={s}:{e},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,"
             f"afade=t=out:st={e - s - 0.01:.3f}:d=0.01[a{i}];" for i, (s, e) in enumerate(segs))
g += "".join(f"[v{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0[vc];"
g += "".join(f"[a{i}]" for i in range(n)) + \
     f"concat=n={n}:v=0:a=1,loudnorm=I=-14:TP=-1.5:LRA=7,aresample=48000[ac];"
g += f"[vc]format=rgb24,chromakey={KEY}:0.16:0.06,despill=type=green:mix=0.6:expand=0.1,format=yuva420p[vk]"

with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False) as f:
    f.write(g)
try:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-filter_complex_script", f.name,
                    "-map", "[vk]", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "6M",
                    "-deadline", "realtime", "-cpu-used", "8", "-row-mt", "1", "-auto-alt-ref", "0",
                    "-an", "public/talk.webm", "-map", "[ac]", "public/voz.wav"], check=True)
finally:
    os.unlink(f.name)
print("public/talk.webm + public/voz.wav")
