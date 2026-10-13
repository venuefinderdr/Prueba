"""Hoja de contactos de fotogramas en orden: python3 -I scripts/hoja.py salida.jpg img1 img2 ..."""
import sys
from PIL import Image
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert("RGB") for f in files]
w, h = ims[0].size
cols = 5
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 6), rows * (h + 6)), "gray")
for i, im in enumerate(ims):
    sheet.paste(im.resize((w, h)), ((i % cols) * (w + 6), (i // cols) * (h + 6)))
sheet.save(out, quality=88)
