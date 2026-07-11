"""
Generates 9 generic, abstract hazard-class sample icons for the
'hazard_symbol' game (Section 16e).

Deliberately NOT a reproduction of the official GHS pictogram design
(red diamond border + specific black glyph) -- these are simplified,
original line-drawings of the underlying concept (flame, skull, burst,
etc.) on a plain square, watermarked as sample/placeholder content the
admin should replace with properly licensed official pictograms before
using this for real compliance training.
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "public/game-assets/hazard-symbol"
os.makedirs(OUT_DIR, exist_ok=True)

SIZE = 512
BG = (255, 255, 255)
FG = (20, 20, 20)


def base_canvas():
    img = Image.new("RGB", (SIZE, SIZE), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([8, 8, SIZE - 8, SIZE - 8], outline=(60, 60, 60), width=6)
    return img, draw


def watermark(draw):
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    text = "SAMPLE ICON -- replace via admin upload"
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    draw.text(((SIZE - w) / 2, SIZE - 34), text, fill=(140, 140, 140), font=font)


def save(name, draw_fn):
    img, draw = base_canvas()
    draw_fn(draw)
    watermark(draw)
    img.save(f"{OUT_DIR}/{name}.png")
    print("wrote", name)


def flammable(draw):
    draw.polygon(
        [(256, 100), (200, 260), (220, 340), (256, 380), (292, 340), (312, 260)],
        fill=FG,
    )
    draw.ellipse([226, 260, 286, 340], fill=BG)
    draw.polygon(
        [(256, 200), (232, 300), (256, 340), (280, 300)],
        fill=FG,
    )


def corrosive(draw):
    draw.polygon([(180, 120), (160, 200), (200, 200)], fill=FG)
    draw.polygon([(300, 140), (280, 210), (320, 210)], fill=FG)
    draw.rectangle([120, 260, 392, 300], fill=FG)
    for x in range(140, 380, 40):
        draw.line([(x, 300), (x - 10, 340)], fill=FG, width=6)


def toxic(draw):
    draw.ellipse([176, 120, 336, 280], outline=FG, width=10)
    draw.ellipse([206, 175, 236, 205], fill=FG)
    draw.ellipse([276, 175, 306, 205], fill=FG)
    draw.rectangle([236, 230, 276, 260], fill=FG)
    draw.line([(160, 340), (352, 400)], fill=FG, width=14)
    draw.line([(352, 340), (160, 400)], fill=FG, width=14)


def explosive(draw):
    cx, cy, r_out, r_in = 256, 250, 160, 70
    import math
    pts = []
    for i in range(16):
        angle = math.pi / 8 * i
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.sin(angle), cy - r * math.cos(angle)))
    draw.polygon(pts, fill=FG)


def compressed_gas(draw):
    draw.rounded_rectangle([196, 140, 316, 380], radius=30, outline=FG, width=10)
    draw.rectangle([226, 100, 286, 150], fill=FG)
    draw.ellipse([236, 80, 276, 110], fill=FG)


def oxidant(draw):
    draw.ellipse([196, 100, 316, 220], outline=FG, width=12)
    draw.polygon(
        [(256, 240), (216, 340), (236, 380), (256, 400), (276, 380), (296, 340)],
        fill=FG,
    )


def irritant(draw):
    draw.rounded_rectangle([160, 100, 352, 400], radius=24, outline=FG, width=10)
    draw.rectangle([242, 150, 270, 290], fill=FG)
    draw.ellipse([242, 320, 270, 348], fill=FG)


def health_hazard(draw):
    draw.ellipse([226, 100, 286, 160], fill=FG)
    draw.polygon([(196, 340), (226, 190), (286, 190), (316, 340)], fill=FG)
    import math
    cx, cy, r_out, r_in = 256, 230, 46, 20
    pts = []
    for i in range(12):
        angle = math.pi / 6 * i
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.sin(angle), cy - r * math.cos(angle)))
    draw.polygon(pts, fill=BG)


def environmental_hazard(draw):
    draw.ellipse([180, 180, 320, 260], outline=FG, width=10)
    draw.polygon([(320, 220), (360, 190), (360, 250)], fill=FG)
    draw.ellipse([200, 205, 216, 221], fill=FG)
    for y in (300, 330, 360):
        draw.line([(150, y), (200, y - 15), (250, y), (300, y - 15), (362, y)], fill=FG, width=8)


ICONS = {
    "flammable": flammable,
    "corrosive": corrosive,
    "toxic": toxic,
    "explosive": explosive,
    "compressed-gas": compressed_gas,
    "oxidant": oxidant,
    "irritant": irritant,
    "health-hazard": health_hazard,
    "environmental-hazard": environmental_hazard,
}

for name, fn in ICONS.items():
    save(name, fn)

print("done:", len(ICONS), "icons in", OUT_DIR)
