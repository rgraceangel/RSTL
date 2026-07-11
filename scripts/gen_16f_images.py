import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from PIL import Image, ImageDraw, ImageFont
from icon_lib import ICONS

BG = (255, 255, 255)
FG = (20, 20, 20)

def watermark(draw, w, text):
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) / 2, None), text, fill=(140, 140, 140), font=font)  # placeholder, fixed below

def draw_watermark(draw, w, h, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) / 2, h - 30), text, fill=(140, 140, 140), font=font)

FONT = ImageFont.load_default()

# ------------------------------------------------------------------
# Picture Puzzle: two icons + a "+" sign, single 512x512 canvas
# ------------------------------------------------------------------
def gen_picture_puzzle(name, icon_a, icon_b, out_dir):
    W, H = 512, 512
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([8, 8, W - 8, H - 8], outline=(60, 60, 60), width=4)
    ICONS[icon_a](draw, (30, 100, 220, 290), fill=FG)
    draw.text((235, 175), "+", fill=FG, font=FONT)
    # bigger plus sign drawn manually since default font is tiny
    draw.line([(240, 195), (272, 195)], fill=FG, width=8)
    draw.line([(256, 179), (256, 211)], fill=FG, width=8)
    ICONS[icon_b](draw, (292, 100, 482, 290), fill=FG)
    draw_watermark(draw, W, H, "SAMPLE IMAGE -- replace via admin upload", FONT)
    path = f"{out_dir}/{name}.png"
    img.save(path)
    return path

# ------------------------------------------------------------------
# Memory Challenge: row of 4 icons
# ------------------------------------------------------------------
def gen_memory_row(name, icon_names, out_dir):
    W, H = 640, 300
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([8, 8, W - 8, H - 8], outline=(60, 60, 60), width=4)
    n = len(icon_names)
    slot_w = (W - 40) / n
    for i, icon_name in enumerate(icon_names):
        x0 = 20 + i * slot_w + 10
        x1 = 20 + (i + 1) * slot_w - 10
        ICONS[icon_name](draw, (x0, 60, x1, 220), fill=FG)
    draw_watermark(draw, W, H, "SAMPLE IMAGE -- replace via admin upload", FONT)
    path = f"{out_dir}/{name}.png"
    img.save(path)
    return path

# ------------------------------------------------------------------
# Spot the Difference: two panels side by side, with a text divider
# ------------------------------------------------------------------
def gen_spot_difference(name, icon_name, count_a, count_b, out_dir):
    W, H = 900, 420
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([8, 8, W - 8, H - 8], outline=(60, 60, 60), width=4)
    mid = W // 2
    draw.line([(mid, 20), (mid, H - 50)], fill=(160, 160, 160), width=3)
    draw.text((mid / 2 - 30, 25), "Image A", fill=FG, font=FONT)
    draw.text((mid + mid / 2 - 30, 25), "Image B", fill=FG, font=FONT)

    def draw_row(count, x_start, x_end):
        n = max(count, 1)
        slot_w = (x_end - x_start) / max(count, 1) if count > 0 else 0
        for i in range(count):
            x0 = x_start + i * slot_w + 10
            x1 = x_start + (i + 1) * slot_w - 10
            ICONS[icon_name](draw, (x0, 150, x1, 300), fill=FG)

    draw_row(count_a, 30, mid - 20)
    draw_row(count_b, mid + 20, W - 30)
    draw_watermark(draw, W, H, "SAMPLE IMAGE -- replace via admin upload", FONT)
    path = f"{out_dir}/{name}.png"
    img.save(path)
    return path

# ------------------------------------------------------------------
# PPE Challenge: single icon
# ------------------------------------------------------------------
def gen_single_icon(name, icon_name, out_dir):
    W, H = 512, 512
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([8, 8, W - 8, H - 8], outline=(60, 60, 60), width=4)
    ICONS[icon_name](draw, (100, 100, 412, 400), fill=FG)
    draw_watermark(draw, W, H, "SAMPLE IMAGE -- replace via admin upload", FONT)
    path = f"{out_dir}/{name}.png"
    img.save(path)
    return path


if __name__ == "__main__":
    base = "public/game-assets"

    pp_dir = f"{base}/picture-puzzle"
    os.makedirs(pp_dir, exist_ok=True)
    picture_puzzle_pairs = [
        ("watershed", "droplet", "shed"),
        ("sunlight", "sun", "bulb"),
        ("earthquake", "globe", "zigzag_crack"),
        ("rainfall", "cloud_drops", "down_arrows"),
        ("microscope", "magnifying_glass", "tube_lens"),
        ("thermometer-puzzle", "dial_gauge", "ruler"),
        ("ecosystem", "leaf", "gear"),
        ("biosphere", "dna_helix", "circle"),
        ("hydropower", "droplet", "lightning_bolt"),
        ("geothermal", "globe_cross_section", "flame"),
    ]
    for name, a, b in picture_puzzle_pairs:
        print(gen_picture_puzzle(name, a, b, pp_dir))

    mc_dir = f"{base}/memory-challenge"
    os.makedirs(mc_dir, exist_ok=True)
    memory_rows = [
        ("row-1", ["beaker", "flask", "thermometer", "magnet"]),
        ("row-2", ["test_tube", "petri_dish", "gear", "leaf"]),
        ("row-3", ["droplet", "flame", "bulb", "ruler"]),
        ("row-4", ["magnifying_glass", "cloud_drops", "sun", "moon"]),
        ("row-5", ["star", "battery", "clock", "scale_balance"]),
        ("row-6", ["beaker", "test_tube", "flame", "magnet"]),
        ("row-7", ["flask", "petri_dish", "thermometer", "leaf"]),
        ("row-8", ["droplet", "gear", "bulb", "star"]),
        ("row-9", ["sun", "moon", "clock", "battery"]),
        ("row-10", ["magnifying_glass", "ruler", "scale_balance", "flame"]),
        ("row-11", ["beaker", "flask", "petri_dish", "test_tube"]),
        ("row-12", ["gear", "magnet", "droplet", "leaf"]),
    ]
    for name, icons in memory_rows:
        print(gen_memory_row(name, icons, mc_dir))

    sd_dir = f"{base}/spot-the-difference"
    os.makedirs(sd_dir, exist_ok=True)
    spot_rounds = [
        ("round-1", "beaker", 3, 4),
        ("round-2", "flask", 4, 3),
        ("round-3", "test_tube", 3, 4),
        ("round-4", "gloves", 4, 3),
        ("round-5", "goggles", 3, 4),
        ("round-6", "magnet", 4, 3),
        ("round-7", "petri_dish", 3, 4),
        ("round-8", "beaker", 4, 3),
        ("round-9", "flask", 3, 4),
        ("round-10", "gloves", 3, 2),
    ]
    for name, icon, a, b in spot_rounds:
        print(gen_spot_difference(name, icon, a, b, sd_dir))

    ppe_dir = f"{base}/ppe-challenge"
    os.makedirs(ppe_dir, exist_ok=True)
    ppe_items = [
        ("safety-goggles", "goggles"),
        ("face-shield", "face_shield"),
        ("nitrile-gloves", "gloves"),
        ("lab-coat", "lab_coat"),
        ("respirator-mask", "respirator"),
        ("ear-protection", "ear_protection"),
        ("apron", "apron"),
        ("safety-helmet", "helmet"),
        ("safety-boots", "boots"),
        ("hairnet", "hairnet"),
    ]
    for name, icon in ppe_items:
        print(gen_single_icon(name, icon, ppe_dir))

    print("DONE")
