"""
Shared library of simple, original icon-drawing functions used across
Section 16f's image-based game types (Picture Puzzle, Memory Challenge,
Spot the Difference, PPE Challenge). Every icon is a plain geometric
line-drawing -- no photos, no third-party art, nothing trademarked --
consistent with the sample-icon policy used for Name It to Win It,
Logo Challenge, and Hazard Symbol in earlier sections.

Each function draws within a given bounding box (x0, y0, x1, y1) on a
PIL ImageDraw object, using a given fill color, so the same icon can be
composed at different sizes/positions across composite images.
"""
import math
from PIL import ImageDraw

FG_DEFAULT = (20, 20, 20)


def _box(bbox):
    x0, y0, x1, y1 = bbox
    return x0, y0, x1, y1, (x1 - x0), (y1 - y0), (x0 + x1) / 2, (y0 + y1) / 2


def droplet(draw: ImageDraw.ImageDraw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.polygon([(cx, y0), (x0 + w * 0.15, y0 + h * 0.65), (x1 - w * 0.15, y0 + h * 0.65)], fill=fill)
    draw.ellipse([x0 + w * 0.1, y0 + h * 0.4, x1 - w * 0.1, y1], fill=fill)


def shed(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.rectangle([x0, y0 + h * 0.45, x1, y1], outline=fill, width=max(3, int(w * 0.05)))
    draw.polygon([(x0, y0 + h * 0.45), (cx, y0), (x1, y0 + h * 0.45)], fill=fill)


def sun(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r = min(w, h) * 0.28
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill)
    for i in range(8):
        a = math.pi / 4 * i
        x2 = cx + math.cos(a) * r * 1.9
        y2 = cy + math.sin(a) * r * 1.9
        x3 = cx + math.cos(a) * r * 1.3
        y3 = cy + math.sin(a) * r * 1.3
        draw.line([(x3, y3), (x2, y2)], fill=fill, width=max(3, int(w * 0.04)))


def bulb(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.ellipse([cx - w * 0.28, y0, cx + w * 0.28, y0 + h * 0.6], fill=fill)
    draw.rectangle([cx - w * 0.14, y0 + h * 0.55, cx + w * 0.14, y1], fill=fill)


def globe(draw, bbox, fill=FG_DEFAULT, cross_section=False):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r = min(w, h) * 0.42
    lw = max(3, int(w * 0.035))
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fill, width=lw)
    draw.line([(cx, cy - r), (cx, cy + r)], fill=fill, width=lw)
    draw.arc([cx - r * 0.55, cy - r, cx + r * 0.55, cy + r], 0, 360, fill=fill, width=lw)
    if cross_section:
        draw.line([(cx - r, cy), (cx + r, cy)], fill=fill, width=lw)
        draw.ellipse([cx - r * 0.4, cy - r * 0.4, cx + r * 0.4, cy + r * 0.4], fill=fill)
    else:
        draw.line([(cx - r, cy), (cx + r, cy)], fill=fill, width=lw)


def zigzag_crack(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    pts = [(cx, y0), (cx - w * 0.18, y0 + h * 0.3), (cx + w * 0.12, y0 + h * 0.5),
           (cx - w * 0.15, y0 + h * 0.7), (cx, y1)]
    draw.line(pts, fill=fill, width=max(4, int(w * 0.06)), joint="curve")


def cloud_drops(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    top = y0 + h * 0.15
    draw.ellipse([x0 + w * 0.05, top, x0 + w * 0.55, top + h * 0.35], fill=fill)
    draw.ellipse([x0 + w * 0.35, top - h * 0.05, x1 - w * 0.05, top + h * 0.35], fill=fill)
    for i, dx in enumerate([0.25, 0.5, 0.75]):
        droplet(draw, (x0 + w * dx - w * 0.08, y0 + h * 0.55, x0 + w * dx + w * 0.08, y1), fill=fill)


def down_arrows(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    for dx in (0.3, 0.7):
        x = x0 + w * dx
        draw.line([(x, y0), (x, y0 + h * 0.55)], fill=fill, width=max(3, int(w * 0.05)))
        draw.polygon([(x - w * 0.1, y0 + h * 0.5), (x + w * 0.1, y0 + h * 0.5), (x, y1)], fill=fill)


def magnifying_glass(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r = min(w, h) * 0.3
    lens_cx, lens_cy = cx - w * 0.05, cy - h * 0.05
    draw.ellipse([lens_cx - r, lens_cy - r, lens_cx + r, lens_cy + r], outline=fill, width=max(4, int(w * 0.06)))
    draw.line([(lens_cx + r * 0.7, lens_cy + r * 0.7), (x1 - w * 0.05, y1 - h * 0.05)], fill=fill, width=max(5, int(w * 0.08)))


def tube_lens(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.rectangle([cx - w * 0.12, y0, cx + w * 0.12, y1 - h * 0.25], outline=fill, width=max(3, int(w * 0.05)))
    draw.ellipse([cx - w * 0.22, y1 - h * 0.35, cx + w * 0.22, y1], outline=fill, width=max(3, int(w * 0.05)))


def dial_gauge(draw, bbox, fill=FG_DEFAULT, alt=False):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r = min(w, h) * 0.35
    if alt:
        draw.arc([cx - r, cy, cx + r, cy + r * 2], 180, 360, fill=fill, width=max(4, int(w * 0.06)))
        draw.line([(cx, cy), (cx + r * 0.7, cy - r * 0.4)], fill=fill, width=max(3, int(w * 0.05)))
    else:
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fill, width=max(4, int(w * 0.06)))
        draw.line([(cx, cy), (cx + r * 0.6, cy - r * 0.6)], fill=fill, width=max(3, int(w * 0.05)))
        draw.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=fill)


def ruler(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.rectangle([x0, cy - h * 0.12, x1, cy + h * 0.12], outline=fill, width=max(3, int(w * 0.04)))
    for i in range(6):
        x = x0 + w * (i / 5.0)
        draw.line([(x, cy - h * 0.12), (x, cy)], fill=fill, width=2)


def leaf(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.polygon([(cx, y0), (x1, cy), (cx, y1), (x0, cy)], fill=fill)
    draw.line([(cx, y0), (cx, y1)], fill=(255, 255, 255), width=max(2, int(w * 0.03)))


def gear(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r_out, r_in = min(w, h) * 0.42, min(w, h) * 0.26
    pts = []
    for i in range(16):
        a = math.pi / 8 * i
        r = r_out if i % 2 == 0 else r_out * 0.82
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    draw.polygon(pts, fill=fill)
    draw.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=(255, 255, 255))


def dna_helix(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    steps = 10
    for i in range(steps):
        t = i / (steps - 1)
        y = y0 + h * t
        xa = cx + math.sin(t * math.pi * 2) * w * 0.28
        xb = cx - math.sin(t * math.pi * 2) * w * 0.28
        if i % 2 == 0:
            draw.line([(xa, y), (xb, y)], fill=fill, width=2)
        r = 4
        draw.ellipse([xa - r, y - r, xa + r, y + r], fill=fill)
        draw.ellipse([xb - r, y - r, xb + r, y + r], fill=fill)


def circle(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r = min(w, h) * 0.42
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fill, width=max(4, int(w * 0.06)))


def lightning_bolt(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.polygon([
        (cx + w * 0.1, y0), (cx - w * 0.15, cy + h * 0.05), (cx + w * 0.02, cy + h * 0.05),
        (cx - w * 0.1, y1), (cx + w * 0.2, cy - h * 0.05), (cx + w * 0.02, cy - h * 0.05),
    ], fill=fill)


def flame(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.polygon([(cx, y0), (x0 + w * 0.2, y0 + h * 0.62), (x0 + w * 0.28, y1),
                  (cx, y0 + h * 0.78), (x1 - w * 0.28, y1), (x1 - w * 0.2, y0 + h * 0.62)], fill=fill)


def beaker(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.polygon([(x0 + w * 0.25, y0), (x0 + w * 0.15, y1), (x1 - w * 0.15, y1), (x1 - w * 0.25, y0)],
                 outline=fill, width=max(3, int(w * 0.05)))
    draw.line([(x0 + w * 0.15, y0), (x1 - w * 0.15, y0)], fill=fill, width=max(3, int(w * 0.05)))
    draw.line([(x0 + w * 0.22, y1 - h * 0.35), (x1 - w * 0.22, y1 - h * 0.35)], fill=fill, width=2)


def flask(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.line([(cx - w * 0.1, y0), (cx - w * 0.1, y0 + h * 0.35)], fill=fill, width=max(3, int(w * 0.05)))
    draw.line([(cx + w * 0.1, y0), (cx + w * 0.1, y0 + h * 0.35)], fill=fill, width=max(3, int(w * 0.05)))
    draw.polygon([(cx - w * 0.1, y0 + h * 0.35), (x0 + w * 0.05, y1), (x1 - w * 0.05, y1), (cx + w * 0.1, y0 + h * 0.35)],
                 outline=fill, width=max(3, int(w * 0.05)))


def thermometer(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.rounded_rectangle([cx - w * 0.08, y0, cx + w * 0.08, y1 - h * 0.2], radius=w * 0.06, outline=fill, width=max(3, int(w * 0.04)))
    draw.ellipse([cx - w * 0.18, y1 - h * 0.2, cx + w * 0.18, y1], fill=fill)


def magnet(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r = w * 0.35
    draw.arc([cx - r, y0, cx + r, y0 + r * 2], 180, 360, fill=fill, width=max(6, int(w * 0.12)))
    draw.rectangle([cx - r, y0 + r, cx - r + w * 0.14, y1], fill=fill)
    draw.rectangle([cx + r - w * 0.14, y0 + r, cx + r, y1], fill=fill)


def test_tube(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.line([(cx - w * 0.12, y0), (cx - w * 0.12, y1 - h * 0.15)], fill=fill, width=max(3, int(w * 0.05)))
    draw.line([(cx + w * 0.12, y0), (cx + w * 0.12, y1 - h * 0.15)], fill=fill, width=max(3, int(w * 0.05)))
    draw.arc([cx - w * 0.12, y1 - h * 0.3, cx + w * 0.12, y1], 0, 180, fill=fill, width=max(3, int(w * 0.05)))
    draw.line([(cx - w * 0.14, y0 + h * 0.5), (cx + w * 0.14, y0 + h * 0.5)], fill=fill, width=2)


def petri_dish(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.ellipse([x0, cy - h * 0.16, x1, cy + h * 0.16], outline=fill, width=max(3, int(w * 0.05)))
    for dx, dy in [(-0.15, -0.02), (0.1, 0.05), (0.0, -0.08)]:
        draw.ellipse([cx + w * dx - 4, cy + h * dy - 4, cx + w * dx + 4, cy + h * dy + 4], fill=fill)


def battery(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.rectangle([x0, cy - h * 0.22, x1 - w * 0.12, cy + h * 0.22], outline=fill, width=max(3, int(w * 0.05)))
    draw.rectangle([x1 - w * 0.12, cy - h * 0.1, x1, cy + h * 0.1], fill=fill)
    draw.rectangle([x0 + w * 0.12, cy - h * 0.1, x0 + w * 0.3, cy + h * 0.1], fill=fill)


def clock(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r = min(w, h) * 0.4
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fill, width=max(4, int(w * 0.06)))
    draw.line([(cx, cy), (cx, cy - r * 0.6)], fill=fill, width=max(3, int(w * 0.05)))
    draw.line([(cx, cy), (cx + r * 0.4, cy)], fill=fill, width=max(3, int(w * 0.05)))


def star(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r_out, r_in = min(w, h) * 0.42, min(w, h) * 0.18
    pts = []
    for i in range(10):
        a = math.pi / 5 * i - math.pi / 2
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    draw.polygon(pts, fill=fill)


def moon(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    r = min(w, h) * 0.35
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill)
    draw.ellipse([cx - r + w * 0.18, cy - r, cx + r + w * 0.18, cy + r], fill=(255, 255, 255))


def scale_balance(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.line([(cx, y0), (cx, y1 - h * 0.1)], fill=fill, width=max(3, int(w * 0.04)))
    draw.line([(x0, y0 + h * 0.25), (x1, y0 + h * 0.25)], fill=fill, width=max(3, int(w * 0.04)))
    for dx in (-0.35, 0.35):
        draw.arc([cx + w * dx - w * 0.12, y0 + h * 0.25, cx + w * dx + w * 0.12, y0 + h * 0.5], 0, 180, fill=fill, width=3)
    draw.polygon([(cx - w * 0.16, y1 - h * 0.1), (cx + w * 0.16, y1 - h * 0.1), (cx, y1)], fill=fill)


def goggles(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    for dx in (-0.22, 0.22):
        draw.ellipse([cx + w * dx - w * 0.18, cy - h * 0.2, cx + w * dx + w * 0.18, cy + h * 0.2],
                     outline=fill, width=max(4, int(w * 0.05)))
    draw.line([(cx - w * 0.05, cy), (cx + w * 0.05, cy)], fill=fill, width=max(4, int(w * 0.05)))
    draw.line([(x0, y0 + h * 0.1), (cx - w * 0.35, cy)], fill=fill, width=3)
    draw.line([(x1, y0 + h * 0.1), (cx + w * 0.35, cy)], fill=fill, width=3)


def gloves(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.rounded_rectangle([cx - w * 0.22, cy - h * 0.05, cx + w * 0.22, y1], radius=w * 0.1, fill=fill)
    for i, dx in enumerate([-0.18, -0.06, 0.06, 0.18]):
        draw.rounded_rectangle([cx + w * dx - w * 0.05, y0, cx + w * dx + w * 0.05, cy], radius=w * 0.04, fill=fill)
    draw.ellipse([cx - w * 0.32, cy - h * 0.05, cx - w * 0.15, cy + h * 0.15], fill=fill)


def face_shield(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.arc([x0, y0 - h * 0.15, x1, y1 + h * 0.35], 200, 340, fill=fill, width=max(5, int(w * 0.08)))
    draw.rectangle([cx - w * 0.3, y0, cx + w * 0.3, y0 + h * 0.12], fill=fill)


def lab_coat(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.polygon([(cx - w * 0.2, y0), (cx + w * 0.2, y0), (cx + w * 0.35, y0 + h * 0.2),
                  (cx + w * 0.28, y1), (cx - w * 0.28, y1), (cx - w * 0.35, y0 + h * 0.2)],
                 outline=fill, width=max(3, int(w * 0.05)))
    draw.line([(cx, y0 + h * 0.15), (cx, y1 - h * 0.05)], fill=fill, width=2)
    for dy in (0.4, 0.55, 0.7):
        draw.ellipse([cx - 4, y0 + h * dy - 4, cx + 4, y0 + h * dy + 4], fill=fill)


def respirator(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.ellipse([cx - w * 0.32, cy - h * 0.28, cx + w * 0.32, cy + h * 0.28], outline=fill, width=max(4, int(w * 0.06)))
    draw.ellipse([cx - w * 0.1, cy - h * 0.08, cx + w * 0.1, cy + h * 0.12], fill=fill)
    draw.line([(x0, cy - h * 0.15), (cx - w * 0.32, cy)], fill=fill, width=3)
    draw.line([(x1, cy - h * 0.15), (cx + w * 0.32, cy)], fill=fill, width=3)


def ear_protection(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.arc([x0 + w * 0.15, y0, x1 - w * 0.15, y1], 180, 360, fill=fill, width=max(4, int(w * 0.06)))
    for dx in (-0.35, 0.35):
        draw.ellipse([cx + w * dx - w * 0.14, cy, cx + w * dx + w * 0.14, y1], fill=fill)


def apron(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.polygon([(cx - w * 0.12, y0), (cx + w * 0.12, y0), (cx + w * 0.12, y0 + h * 0.18),
                  (cx + w * 0.32, y0 + h * 0.3), (cx + w * 0.24, y1), (cx - w * 0.24, y1),
                  (cx - w * 0.32, y0 + h * 0.3), (cx - w * 0.12, y0 + h * 0.18)],
                 outline=fill, width=max(3, int(w * 0.05)))
    draw.line([(cx - w * 0.12, y0), (x0, y0 - h * 0.05)], fill=fill, width=2)
    draw.line([(cx + w * 0.12, y0), (x1, y0 - h * 0.05)], fill=fill, width=2)


def helmet(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.pieslice([x0, y0, x1, y0 + h], 180, 360, fill=fill)
    draw.rectangle([x0, y0 + h * 0.45, x1, y0 + h * 0.55], fill=fill)


def boots(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.rectangle([cx - w * 0.2, y0, cx + w * 0.2, y0 + h * 0.55], fill=fill)
    draw.polygon([(cx - w * 0.2, y0 + h * 0.55), (cx + w * 0.3, y0 + h * 0.55),
                  (cx + w * 0.35, y1), (cx - w * 0.3, y1)], fill=fill)


def hairnet(draw, bbox, fill=FG_DEFAULT):
    x0, y0, x1, y1, w, h, cx, cy = _box(bbox)
    draw.arc([x0, y0, x1, y1 + h * 0.3], 180, 360, fill=fill, width=max(4, int(w * 0.06)))
    for i in range(5):
        x = x0 + w * (i / 4.0)
        draw.arc([x - w * 0.15, y0 + h * 0.05, x + w * 0.15, cy + h * 0.15], 180, 360, fill=fill, width=2)


ICONS = {
    "droplet": droplet, "shed": shed, "sun": sun, "bulb": bulb,
    "globe": lambda d, b, fill=FG_DEFAULT: globe(d, b, fill),
    "globe_cross_section": lambda d, b, fill=FG_DEFAULT: globe(d, b, fill, cross_section=True),
    "zigzag_crack": zigzag_crack, "cloud_drops": cloud_drops, "down_arrows": down_arrows,
    "magnifying_glass": magnifying_glass, "tube_lens": tube_lens,
    "dial_gauge": lambda d, b, fill=FG_DEFAULT: dial_gauge(d, b, fill),
    "dial_gauge_alt": lambda d, b, fill=FG_DEFAULT: dial_gauge(d, b, fill, alt=True),
    "ruler": ruler, "leaf": leaf, "gear": gear, "dna_helix": dna_helix, "circle": circle,
    "lightning_bolt": lightning_bolt, "flame": flame, "beaker": beaker, "flask": flask,
    "thermometer": thermometer, "magnet": magnet, "test_tube": test_tube, "petri_dish": petri_dish,
    "battery": battery, "clock": clock, "star": star, "moon": moon, "scale_balance": scale_balance,
    "goggles": goggles, "gloves": gloves, "face_shield": face_shield, "lab_coat": lab_coat,
    "respirator": respirator, "ear_protection": ear_protection, "apron": apron, "helmet": helmet,
    "boots": boots, "hairnet": hairnet,
}
