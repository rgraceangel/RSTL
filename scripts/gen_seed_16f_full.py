import random, json

def esc(s):
    return s.replace("'", "''")

def render_values(rows, terminator_last=";"):
    out = []
    for i, row in enumerate(rows):
        term = "," if i < len(rows) - 1 else terminator_last
        out.append(row + term)
    return "\n  ".join(out)

def uuid_for(seed):
    r = random.Random(seed)
    return "%08x-%04x-%04x-%04x-%012x" % (
        r.getrandbits(32), r.getrandbits(16),
        (r.getrandbits(16) & 0x0FFF) | 0x4000,
        (r.getrandbits(16) & 0x3FFF) | 0x8000,
        r.getrandbits(48),
    )

GAME_IDS = {
    "emoji_science": uuid_for("game-emoji_science"),
    "picture_puzzle": uuid_for("game-picture_puzzle"),
    "memory_challenge": uuid_for("game-memory_challenge"),
    "spot_the_difference": uuid_for("game-spot_the_difference"),
    "ppe_challenge": uuid_for("game-ppe_challenge"),
}

out = []
out.append("--------------------------------------------------------------------------------")
out.append("-- Section 16f seed content: Emoji Science, Picture Puzzle, Memory Challenge,")
out.append("-- Spot the Difference, PPE Challenge.")
out.append("--")
out.append("-- All REAL, directly-authored content. Picture Puzzle/Memory Challenge/Spot the")
out.append("-- Difference/PPE Challenge images are original, simple line-drawings generated")
out.append("-- from a shared icon library (scripts/icon_lib.py) -- not photos or third-party")
out.append("-- art -- watermarked 'SAMPLE IMAGE', same replace-via-admin policy as every")
out.append("-- other sample image in this project.")
out.append("--------------------------------------------------------------------------------")
out.append("")
out.append("insert into public.games (id, name, slug, description, game_type, status, max_attempts_per_user)")
out.append("values")
game_rows = [
    f"  ('{GAME_IDS['emoji_science']}', 'Emoji Science', 'emoji-science', null, 'emoji_science', 'active', 3)",
    f"  ('{GAME_IDS['picture_puzzle']}', 'Picture Puzzle', 'picture-puzzle', null, 'picture_puzzle', 'active', 3)",
    f"  ('{GAME_IDS['memory_challenge']}', 'Memory Challenge', 'memory-challenge', null, 'memory_challenge', 'active', 3)",
    f"  ('{GAME_IDS['spot_the_difference']}', 'Spot the Difference', 'spot-the-difference', null, 'spot_the_difference', 'active', 3)",
    f"  ('{GAME_IDS['ppe_challenge']}', 'PPE Challenge', 'ppe-challenge', null, 'ppe_challenge', 'active', 3)",
]
out.append(render_values(game_rows, "\non conflict (slug) do nothing;"))
out.append("")

# ------------------------------------------------------------------
# 1. Emoji Science -- text, no image
# ------------------------------------------------------------------
emoji_science = [
    ("Which phenomenon do these emoji represent? ⚡ + \U0001F329️", "Lightning"),
    ("Which process do these emoji represent? \U0001F41B + \U0001F98B", "Metamorphosis"),
    ("Which force do these emoji represent? \U0001F34E + ⬇️", "Gravity"),
    ("Which process do these emoji represent? ☀️ + \U0001F331", "Photosynthesis"),
    ("Which state change do these emoji represent? \U0001F9CA + \U0001F525", "Melting"),
    ("Which state change do these emoji represent? \U0001F4A7 + ❄️", "Freezing"),
    ("Which state change do these emoji represent? \U0001F4A7 + \U0001F525", "Evaporation"),
    ("Which state change do these emoji represent? 💨 + ❄️", "Condensation"),
    ("Which molecule do these emoji represent? \U0001F9EC", "DNA"),
    ("Which body system do these emoji represent? \U0001FA78 + ❤️", "Circulatory System"),
    ("Which sense do these emoji represent? \U0001F441️ + \U0001F308", "Sight"),
    ("Which sense do these emoji represent? \U0001F442 + \U0001F50A", "Hearing"),
    ("Which quantity do these emoji represent? \U0001F321️ + \U0001F525", "Temperature"),
    ("Which force do these emoji represent? \U0001F9F2 + \U0001F529", "Magnetism"),
    ("Which phenomenon do these emoji represent? \U0001F30A + \U0001F319", "Tides"),
    ("Which natural event do these emoji represent? \U0001F30B + \U0001F525", "Volcanic Eruption"),
    ("Which body system do these emoji represent? \U0001F9B4 + \U0001FA7B", "Skeletal System"),
    ("Which process do these emoji represent? \U0001F95A + \U0001F423", "Hatching"),
    ("Which energy source do these emoji represent? ☀️ + \U0001F50B", "Solar Energy"),
    ("Which phenomenon do these emoji represent? ☔ + ☀️", "Rainbow"),
]
assert len(emoji_science) == 20

# ------------------------------------------------------------------
# 2. Picture Puzzle -- text + image, compound-word icon combos
# ------------------------------------------------------------------
picture_puzzle = [
    ("watershed", "Watershed"),
    ("sunlight", "Sunlight"),
    ("earthquake", "Earthquake"),
    ("rainfall", "Rainfall"),
    ("microscope", "Microscope"),
    ("thermometer-puzzle", "Thermometer"),
    ("ecosystem", "Ecosystem"),
    ("biosphere", "Biosphere"),
    ("hydropower", "Hydropower"),
    ("geothermal", "Geothermal"),
]
assert len(picture_puzzle) == 10

# ------------------------------------------------------------------
# 3. Memory Challenge -- multiple_choice + image, "which was NOT shown"
# ------------------------------------------------------------------
ICON_LABELS = {
    "beaker": "Beaker", "flask": "Flask", "thermometer": "Thermometer", "magnet": "Magnet",
    "test_tube": "Test Tube", "petri_dish": "Petri Dish", "gear": "Gear", "leaf": "Leaf",
    "droplet": "Water Droplet", "flame": "Flame", "bulb": "Light Bulb", "ruler": "Ruler",
    "magnifying_glass": "Magnifying Glass", "cloud_drops": "Rain Cloud", "sun": "Sun",
    "moon": "Moon", "star": "Star", "battery": "Battery", "clock": "Clock",
    "scale_balance": "Balance Scale",
}
memory_rounds = [
    ("row-1", ["beaker", "flask", "thermometer", "magnet"], "test_tube"),
    ("row-2", ["test_tube", "petri_dish", "gear", "leaf"], "sun"),
    ("row-3", ["droplet", "flame", "bulb", "ruler"], "gear"),
    ("row-4", ["magnifying_glass", "cloud_drops", "sun", "moon"], "star"),
    ("row-5", ["star", "battery", "clock", "scale_balance"], "droplet"),
    ("row-6", ["beaker", "test_tube", "flame", "magnet"], "petri_dish"),
    ("row-7", ["flask", "petri_dish", "thermometer", "leaf"], "magnet"),
    ("row-8", ["droplet", "gear", "bulb", "star"], "ruler"),
    ("row-9", ["sun", "moon", "clock", "battery"], "cloud_drops"),
    ("row-10", ["magnifying_glass", "ruler", "scale_balance", "flame"], "bulb"),
    ("row-11", ["beaker", "flask", "petri_dish", "test_tube"], "thermometer"),
    ("row-12", ["gear", "magnet", "droplet", "leaf"], "flame"),
]
assert len(memory_rounds) == 12
for _, shown, distractor in memory_rounds:
    assert distractor not in shown, (shown, distractor)

# ------------------------------------------------------------------
# 4. Spot the Difference -- multiple_choice + image
# ------------------------------------------------------------------
ITEM_INFO = {
    "beaker": {"count": "beaker", "plural": "beakers"},
    "flask": {"count": "flask", "plural": "flasks"},
    "test_tube": {"count": "test tube", "plural": "test tubes"},
    "gloves": {"count": "pair of gloves", "plural": "gloves"},
    "goggles": {"count": "pair of goggles", "plural": "goggles"},
    "magnet": {"count": "magnet", "plural": "magnets"},
    "petri_dish": {"count": "petri dish", "plural": "petri dishes"},
}
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
assert len(spot_rounds) == 10

# ------------------------------------------------------------------
# 5. PPE Challenge -- text + image
# ------------------------------------------------------------------
ppe_challenge = [
    ("safety-goggles", "Safety Goggles"),
    ("face-shield", "Face Shield"),
    ("nitrile-gloves", "Nitrile Gloves"),
    ("lab-coat", "Lab Coat"),
    ("respirator-mask", "Respirator Mask"),
    ("ear-protection", "Ear Protection"),
    ("apron", "Apron"),
    ("safety-helmet", "Safety Helmet"),
    ("safety-boots", "Safety Boots"),
    ("hairnet", "Hairnet"),
]
assert len(ppe_challenge) == 10

# ------------------------------------------------------------------
# Render SQL
# ------------------------------------------------------------------

def mc_options_json(correct_text, distractor_texts):
    opts = [{"id": "a", "text": correct_text}] + [{"id": chr(ord("b") + i), "text": t} for i, t in enumerate(distractor_texts)]
    r = random.Random(correct_text + "".join(distractor_texts))
    r.shuffle(opts)
    correct_id = next(o["id"] for o in opts if o["text"] == correct_text)
    return json.dumps(opts), correct_id

def text_block(comment, game_key, items, points=10, time_limit=20):
    out_lines = [f"-- {comment}"]
    out_lines.append("insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)")
    out_lines.append("values")
    rows = []
    for i, (qtext, correct) in enumerate(items, start=1):
        qid = uuid_for(f"{game_key}-q{i}")
        rows.append(f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', 'text', '{esc(correct)}', {points}, {i}, {time_limit}, null)")
    out_lines.append(render_values(rows))
    return "\n".join(out_lines)

def text_image_block(comment, game_key, items, image_dir, points=10, time_limit=20):
    """items: list of (image_slug, correct_answer)"""
    out_lines = [f"-- {comment}"]
    out_lines.append("insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)")
    out_lines.append("values")
    rows = []
    qids = []
    for i, (slug, correct) in enumerate(items, start=1):
        qid = uuid_for(f"{game_key}-q{i}")
        qids.append(qid)
        rows.append(f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(QUESTION_TEXT[game_key])}', 'text', '{esc(correct)}', {points}, {i}, {time_limit}, null)")
    out_lines.append(render_values(rows))
    img_rows = []
    for (slug, _correct), qid in zip(items, qids):
        img_rows.append(f"  ('{GAME_IDS[game_key]}', '{qid}', '/game-assets/{image_dir}/{slug}.png', 'question')")
    out_lines.append("")
    out_lines.append("insert into public.game_images (game_id, question_id, image_url, image_type)")
    out_lines.append("values")
    out_lines.append(render_values(img_rows))
    return "\n".join(out_lines)

QUESTION_TEXT = {
    "picture_puzzle": "Combine these two pictures to form a single science term. What is it?",
    "ppe_challenge": "What personal protective equipment (PPE) is shown?",
}

def memory_block(comment, game_key, rounds, image_dir, points=10, time_limit=20):
    out_lines = [f"-- {comment}"]
    out_lines.append("insert into public.game_questions (id, game_id, question_text, question_type, options, correct_answer, points, order_index, time_limit_seconds, category)")
    out_lines.append("values")
    rows = []
    qids = []
    for i, (slug, shown, distractor) in enumerate(rounds, start=1):
        qid = uuid_for(f"{game_key}-q{i}")
        qids.append(qid)
        correct_text = ICON_LABELS[distractor]
        distractor_texts = [ICON_LABELS[s] for s in shown]
        options_json, correct_id = mc_options_json(correct_text, distractor_texts)
        qtext = "Look carefully at the image. Which of these items was NOT shown?"
        rows.append(
            f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', 'multiple_choice', "
            f"'{esc(options_json)}'::jsonb, '{correct_id}', {points}, {i}, {time_limit}, null)"
        )
    out_lines.append(render_values(rows))
    img_rows = []
    for (slug, _shown, _distractor), qid in zip(rounds, qids):
        img_rows.append(f"  ('{GAME_IDS[game_key]}', '{qid}', '/game-assets/{image_dir}/{slug}.png', 'question')")
    out_lines.append("")
    out_lines.append("insert into public.game_images (game_id, question_id, image_url, image_type)")
    out_lines.append("values")
    out_lines.append(render_values(img_rows))
    return "\n".join(out_lines)

def spot_block(comment, game_key, rounds, image_dir, points=10, time_limit=20):
    out_lines = [f"-- {comment}"]
    out_lines.append("insert into public.game_questions (id, game_id, question_text, question_type, options, correct_answer, points, order_index, time_limit_seconds, category)")
    out_lines.append("values")
    rows = []
    qids = []
    for i, (slug, icon, count_a, count_b) in enumerate(rounds, start=1):
        qid = uuid_for(f"{game_key}-q{i}")
        qids.append(qid)
        info = ITEM_INFO[icon]
        extra_text = f"There is one extra {info['count']} in Image B"
        missing_text = f"There is one {info['count']} missing in Image B"
        size_text = f"The {info['plural']} in Image B are a different size"
        pattern_text = f"The {info['plural']} in Image B are arranged in a different pattern"
        if count_b > count_a:
            correct_text = extra_text
            distractors = [missing_text, size_text, pattern_text]
        else:
            correct_text = missing_text
            distractors = [extra_text, size_text, pattern_text]
        options_json, correct_id = mc_options_json(correct_text, distractors)
        qtext = "Compare Image A and Image B. What is different between them?"
        rows.append(
            f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', 'multiple_choice', "
            f"'{esc(options_json)}'::jsonb, '{correct_id}', {points}, {i}, {time_limit}, null)"
        )
    out_lines.append(render_values(rows))
    img_rows = []
    for (slug, _icon, _a, _b), qid in zip(rounds, qids):
        img_rows.append(f"  ('{GAME_IDS[game_key]}', '{qid}', '/game-assets/{image_dir}/{slug}.png', 'question')")
    out_lines.append("")
    out_lines.append("insert into public.game_images (game_id, question_id, image_url, image_type)")
    out_lines.append("values")
    out_lines.append(render_values(img_rows))
    return "\n".join(out_lines)


out.append("")
out.append(text_block("Emoji Science: 20 rounds (real science concepts decoded from emoji sequences).", "emoji_science", emoji_science, points=10, time_limit=25))
out.append("")
out.append(text_image_block("Picture Puzzle: 10 rounds (two pictured word-parts combine into a compound science term).", "picture_puzzle", picture_puzzle, "picture-puzzle", points=10, time_limit=25))
out.append("")
out.append(memory_block("Memory Challenge: 12 rounds (glance at 4 pictured items, recall which one was NOT shown).", "memory_challenge", memory_rounds, "memory-challenge", points=10, time_limit=20))
out.append("")
out.append(spot_block("Spot the Difference: 10 rounds (compare two panels, identify the true difference).", "spot_the_difference", spot_rounds, "spot-the-difference", points=10, time_limit=20))
out.append("")
out.append(text_image_block("PPE Challenge: 10 rounds (name the personal protective equipment shown).", "ppe_challenge", ppe_challenge, "ppe-challenge", points=10, time_limit=20))
out.append("")

sql = "\n".join(out)
with open("supabase/migrations/20260714020000_seed_more_puzzle_games_3.sql", "w") as f:
    f.write(sql)

print("WROTE", len(sql), "bytes")
print("GAME_IDS", GAME_IDS)
