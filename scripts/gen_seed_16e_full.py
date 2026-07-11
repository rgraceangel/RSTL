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
        r.getrandbits(32),
        r.getrandbits(16),
        (r.getrandbits(16) & 0x0FFF) | 0x4000,
        (r.getrandbits(16) & 0x3FFF) | 0x8000,
        r.getrandbits(48),
    )

GAME_IDS = {
    "equipment_match": uuid_for("game-equipment_match"),
    "which_laboratory": uuid_for("game-which_laboratory"),
    "hazard_symbol": uuid_for("game-hazard_symbol"),
    "odd_one_out": uuid_for("game-odd_one_out"),
    "word_scramble": uuid_for("game-word_scramble"),
}

out = []
out.append("--------------------------------------------------------------------------------")
out.append("-- Section 16e seed content: Equipment Match, Which Laboratory, Hazard Symbol,")
out.append("-- Odd One Out, Word Scramble.")
out.append("--")
out.append("-- All REAL, directly-authored/fact-checked content (standard lab equipment,")
out.append("-- laboratory classification, SI/derived-unit distinctions, common science")
out.append("-- vocabulary) -- nothing flagged for review.")
out.append("--")
out.append("-- Hazard Symbol uses 9 generic, original sample icons (NOT official GHS")
out.append("-- pictograms) in public/game-assets/hazard-symbol/, watermarked 'SAMPLE ICON'")
out.append("-- -- replace with properly licensed official pictograms via Admin > Games any")
out.append("-- time, same ImageUpload/QuestionForm as every other game type.")
out.append("--------------------------------------------------------------------------------")
out.append("")
out.append("insert into public.games (id, name, slug, description, game_type, status, max_attempts_per_user)")
out.append("values")
game_rows = [
    f"  ('{GAME_IDS['equipment_match']}', 'Equipment Match', 'equipment-match', null, 'equipment_match', 'active', 3)",
    f"  ('{GAME_IDS['which_laboratory']}', 'Which Laboratory', 'which-laboratory', null, 'which_laboratory', 'active', 3)",
    f"  ('{GAME_IDS['hazard_symbol']}', 'Hazard Symbol', 'hazard-symbol', null, 'hazard_symbol', 'active', 3)",
    f"  ('{GAME_IDS['odd_one_out']}', 'Odd One Out', 'odd-one-out', null, 'odd_one_out', 'active', 3)",
    f"  ('{GAME_IDS['word_scramble']}', 'Word Scramble', 'word-scramble', null, 'word_scramble', 'active', 3)",
]
out.append(render_values(game_rows, "\non conflict (slug) do nothing;"))
out.append("")

# ------------------------------------------------------------------
# 1. Equipment Match -- multiple_choice, function -> equipment
# ------------------------------------------------------------------
equipment_match = [
    ("Which piece of equipment would you use to measure the precise volume of a liquid?", "Graduated Cylinder", ["Beaker", "Erlenmeyer Flask", "Petri Dish"]),
    ("Which piece of equipment would you use to heat a substance directly over an open flame?", "Bunsen Burner", ["Hot Plate", "Water Bath", "Autoclave"]),
    ("Which piece of equipment would you use to sterilize instruments using pressurized steam?", "Autoclave", ["Incubator", "Centrifuge", "Desiccator"]),
    ("Which piece of equipment would you use to separate components of a mixture by spinning it at high speed?", "Centrifuge", ["Vortex Mixer", "Shaker", "Rotary Evaporator"]),
    ("Which piece of equipment would you use to culture microbial samples at a controlled temperature?", "Incubator", ["Autoclave", "Refrigerator", "Oven"]),
    ("Which piece of equipment would you use to weigh a sample with high precision?", "Analytical Balance", ["Spring Scale", "Graduated Cylinder", "Thermometer"]),
    ("Which piece of equipment would you use to view microscopic structures of a specimen?", "Microscope", ["Magnifying Glass", "Spectrophotometer", "Colorimeter"]),
    ("Which piece of equipment would you use to hold and mix chemicals for a reaction that produces gas?", "Erlenmeyer Flask", ["Beaker", "Test Tube", "Petri Dish"]),
    ("Which piece of equipment would you use to transfer a small, precise volume of liquid?", "Pipette", ["Burette", "Beaker", "Graduated Cylinder"]),
    ("Which piece of equipment would you use to dispense a precise, variable volume of liquid during a titration?", "Burette", ["Pipette", "Graduated Cylinder", "Erlenmeyer Flask"]),
    ("Which piece of equipment would you use to grow bacterial colonies on solid agar medium?", "Petri Dish", ["Test Tube", "Beaker", "Incubator"]),
    ("Which piece of equipment would you use to grind and crush solid samples into a fine powder?", "Mortar and Pestle", ["Spatula", "Crucible", "Tongs"]),
    ("Which piece of equipment would you use to hold a test tube securely while heating it?", "Test Tube Holder", ["Tongs", "Clamp", "Forceps"]),
    ("Which piece of equipment would you use to filter solid particles out of a liquid?", "Funnel with Filter Paper", ["Beaker", "Sieve", "Centrifuge"]),
    ("Which piece of equipment would you use to measure the temperature of a solution?", "Thermometer", ["Barometer", "Hygrometer", "Manometer"]),
    ("Which piece of equipment would you use to keep chemicals free of moisture during storage?", "Desiccator", ["Incubator", "Refrigerator", "Fume Hood"]),
    ("Which piece of equipment would you use to protect your eyes from chemical splashes?", "Safety Goggles", ["Face Shield", "Lab Coat", "Gloves"]),
    ("Which piece of equipment would you use to work safely with volatile or toxic fumes?", "Fume Hood", ["Biosafety Cabinet", "Glove Box", "Exhaust Fan"]),
    ("Which piece of equipment would you use to evenly mix a liquid sample using rotational motion?", "Vortex Mixer", ["Centrifuge", "Shaker", "Stirrer"]),
    ("Which piece of equipment would you use to measure the pH of a solution electronically?", "pH Meter", ["Litmus Paper", "Colorimeter", "Spectrophotometer"]),
]
assert len(equipment_match) == 20

# ------------------------------------------------------------------
# 2. Which Laboratory -- multiple_choice, procedure -> lab type
# ------------------------------------------------------------------
LABS = ["Physical Testing Laboratory", "Chemical Testing Laboratory", "Microbiology Laboratory",
        "Calibration Laboratory", "Shelf-life Testing Laboratory", "Furniture Testing Laboratory"]
which_laboratory = [
    ("Testing the tensile strength of a steel sample", "Physical Testing Laboratory", ["Chemical Testing Laboratory", "Microbiology Laboratory", "Calibration Laboratory"]),
    ("Culturing bacteria from a food sample to check for contamination", "Microbiology Laboratory", ["Chemical Testing Laboratory", "Physical Testing Laboratory", "Shelf-life Testing Laboratory"]),
    ("Verifying that a weighing scale reads accurately against a certified reference mass", "Calibration Laboratory", ["Physical Testing Laboratory", "Chemical Testing Laboratory", "Microbiology Laboratory"]),
    ("Determining how long a packaged food product stays safe to eat", "Shelf-life Testing Laboratory", ["Microbiology Laboratory", "Chemical Testing Laboratory", "Physical Testing Laboratory"]),
    ("Analyzing the chemical composition of a water sample", "Chemical Testing Laboratory", ["Microbiology Laboratory", "Physical Testing Laboratory", "Calibration Laboratory"]),
    ("Testing how much weight a chair can hold before it breaks", "Furniture Testing Laboratory", ["Physical Testing Laboratory", "Shelf-life Testing Laboratory", "Chemical Testing Laboratory"]),
    ("Measuring the pH and acidity of a chemical solution", "Chemical Testing Laboratory", ["Physical Testing Laboratory", "Microbiology Laboratory", "Calibration Laboratory"]),
    ("Checking if a thermometer's readings are still accurate", "Calibration Laboratory", ["Physical Testing Laboratory", "Chemical Testing Laboratory", "Shelf-life Testing Laboratory"]),
    ("Testing the impact resistance of a safety helmet", "Physical Testing Laboratory", ["Furniture Testing Laboratory", "Chemical Testing Laboratory", "Microbiology Laboratory"]),
    ("Identifying microbial spoilage in a canned good", "Microbiology Laboratory", ["Chemical Testing Laboratory", "Shelf-life Testing Laboratory", "Physical Testing Laboratory"]),
    ("Determining the shelf life of a cosmetic product through accelerated aging tests", "Shelf-life Testing Laboratory", ["Chemical Testing Laboratory", "Microbiology Laboratory", "Physical Testing Laboratory"]),
    ("Testing the durability of a wooden table's joints", "Furniture Testing Laboratory", ["Physical Testing Laboratory", "Chemical Testing Laboratory", "Calibration Laboratory"]),
    ("Measuring the exact concentration of a chemical solution using titration", "Chemical Testing Laboratory", ["Physical Testing Laboratory", "Calibration Laboratory", "Microbiology Laboratory"]),
    ("Verifying the accuracy of a laboratory's volumetric glassware", "Calibration Laboratory", ["Chemical Testing Laboratory", "Physical Testing Laboratory", "Shelf-life Testing Laboratory"]),
    ("Testing the flammability of a fabric sample", "Physical Testing Laboratory", ["Chemical Testing Laboratory", "Furniture Testing Laboratory", "Microbiology Laboratory"]),
]
assert len(which_laboratory) == 15

# ------------------------------------------------------------------
# 3. Hazard Symbol -- text + image, 9 canonical hazard classes
#    (spelling chosen to avoid AmE/BrE ambiguity: "Oxidant" not "Oxidizer/Oxidiser")
# ------------------------------------------------------------------
hazard_symbol = [
    ("flammable", "Flammable"),
    ("corrosive", "Corrosive"),
    ("toxic", "Toxic"),
    ("explosive", "Explosive"),
    ("compressed-gas", "Compressed Gas"),
    ("oxidant", "Oxidant"),
    ("irritant", "Irritant"),
    ("health-hazard", "Health Hazard"),
    ("environmental-hazard", "Environmental Hazard"),
]
assert len(hazard_symbol) == 9

# ------------------------------------------------------------------
# 4. Odd One Out -- multiple_choice, 4 items, correct_answer = the odd one
# ------------------------------------------------------------------
odd_one_out = [
    ("Beaker, Erlenmeyer Flask, Graduated Cylinder, Bunsen Burner -- which one doesn't belong?", "Bunsen Burner", ["Beaker", "Erlenmeyer Flask", "Graduated Cylinder"]),
    ("Oxygen, Nitrogen, Carbon Dioxide, Mercury -- which one doesn't belong?", "Mercury", ["Oxygen", "Nitrogen", "Carbon Dioxide"]),
    ("Meter, Second, Kilogram, Liter -- which one doesn't belong?", "Liter", ["Meter", "Second", "Kilogram"]),
    ("Microscope, Petri Dish, Incubator, Analytical Balance -- which one doesn't belong?", "Analytical Balance", ["Microscope", "Petri Dish", "Incubator"]),
    ("Flammable, Corrosive, Toxic, Fragile -- which one doesn't belong?", "Fragile", ["Flammable", "Corrosive", "Toxic"]),
    ("Thermometer, Barometer, Hygrometer, Pipette -- which one doesn't belong?", "Pipette", ["Thermometer", "Barometer", "Hygrometer"]),
    ("Gold, Silver, Copper, Oxygen -- which one doesn't belong?", "Oxygen", ["Gold", "Silver", "Copper"]),
    ("Solid, Liquid, Gas, Density -- which one doesn't belong?", "Density", ["Solid", "Liquid", "Gas"]),
    ("DOST, DTI, FDA, Autoclave -- which one doesn't belong?", "Autoclave", ["DOST", "DTI", "FDA"]),
    ("Vortex Mixer, Centrifuge, Shaker, Desiccator -- which one doesn't belong?", "Desiccator", ["Vortex Mixer", "Centrifuge", "Shaker"]),
    ("Explosive, Oxidant, Irritant, Sterile -- which one doesn't belong?", "Sterile", ["Explosive", "Oxidant", "Irritant"]),
    ("Chair, Table, Autoclave, Cabinet -- which one doesn't belong?", "Autoclave", ["Chair", "Table", "Cabinet"]),
    ("Celsius, Fahrenheit, Kelvin, Newton -- which one doesn't belong?", "Newton", ["Celsius", "Fahrenheit", "Kelvin"]),
    ("Acid, Base, Neutral, Volatile -- which one doesn't belong?", "Volatile", ["Acid", "Base", "Neutral"]),
    ("Analytical Balance, pH Meter, Spectrophotometer, Tongs -- which one doesn't belong?", "Tongs", ["Analytical Balance", "pH Meter", "Spectrophotometer"]),
]
assert len(odd_one_out) == 15

# ------------------------------------------------------------------
# 5. Word Scramble -- text answer, scrambled science vocabulary
# ------------------------------------------------------------------
words = ["BEAKER", "PIPETTE", "BURNER", "FLASK", "CENTRIFUGE", "MICROSCOPE", "THERMOMETER",
         "INCUBATOR", "AUTOCLAVE", "CATALYST", "MOLECULE", "ELEMENT", "COMPOUND", "SOLUTION",
         "REACTION", "PRESSURE", "DENSITY", "VOLUME", "ENZYME", "BACTERIA"]
assert len(words) == 20

def scramble(word, seed):
    r = random.Random(seed)
    letters = list(word)
    tries = 0
    while True:
        shuffled = letters[:]
        r.shuffle(shuffled)
        s = "".join(shuffled)
        tries += 1
        if s != word or tries > 20:
            return s

word_scramble = []
for w in words:
    s = scramble(w, f"scramble-{w}")
    word_scramble.append((s, w))

# ------------------------------------------------------------------
# Render SQL
# ------------------------------------------------------------------

def mc_options_json(correct, distractors):
    opts = [{"id": "a", "text": correct}] + [{"id": chr(ord("b") + i), "text": d} for i, d in enumerate(distractors)]
    r = random.Random(correct)
    r.shuffle(opts)
    correct_id = next(o["id"] for o in opts if o["text"] == correct)
    return json.dumps(opts), correct_id

def mc_block(comment, game_key, items, points=10, time_limit=20):
    out = [f"-- {comment}"]
    out.append("insert into public.game_questions (id, game_id, question_text, question_type, options, correct_answer, points, order_index, time_limit_seconds, category)")
    out.append("values")
    rows = []
    for i, (qtext, correct, distractors) in enumerate(items, start=1):
        options_json, correct_id = mc_options_json(correct, distractors)
        qid = uuid_for(f"{game_key}-q{i}")
        rows.append(
            f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', 'multiple_choice', "
            f"'{esc(options_json)}'::jsonb, '{correct_id}', {points}, {i}, {time_limit}, null)"
        )
    out.append(render_values(rows))
    return "\n".join(out)

def text_block(comment, game_key, items, points=10, time_limit=20):
    out = [f"-- {comment}"]
    out.append("insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)")
    out.append("values")
    rows = []
    for i, (qtext, correct) in enumerate(items, start=1):
        qid = uuid_for(f"{game_key}-q{i}")
        rows.append(f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', 'text', '{esc(correct)}', {points}, {i}, {time_limit}, null)")
    out.append(render_values(rows))
    return "\n".join(out)

out.append("")
out.append(mc_block("Equipment Match: 20 rounds (real lab-equipment/function pairs).", "equipment_match", equipment_match, points=10, time_limit=20))
out.append("")
out.append(mc_block("Which Laboratory: 15 rounds (real laboratory-type classifications).", "which_laboratory", which_laboratory, points=10, time_limit=20))
out.append("")

# Hazard Symbol: text + image
hazard_items = [(f"What hazard class does this symbol represent?", label) for _, label in hazard_symbol]
out.append(text_block("Hazard Symbol: 9 rounds (canonical hazard classes; sample icons -- see header).", "hazard_symbol", hazard_items, points=10, time_limit=15))
hazard_image_rows = []
hazard_qids = [uuid_for(f"hazard_symbol-q{i}") for i in range(1, 10)]
for i, ((slug, label), qid) in enumerate(zip(hazard_symbol, hazard_qids)):
    hazard_image_rows.append(f"  ('{GAME_IDS['hazard_symbol']}', '{qid}', '/game-assets/hazard-symbol/{slug}.png', 'question')")
out.append("")
out.append("insert into public.game_images (game_id, question_id, image_url, image_type)")
out.append("values")
out.append(render_values(hazard_image_rows))
out.append("")

out.append(mc_block("Odd One Out: 15 rounds (real categorical groupings).", "odd_one_out", odd_one_out, points=10, time_limit=20))
out.append("")
out.append(text_block("Word Scramble: 20 rounds (real science vocabulary, unscramble the term).", "word_scramble", word_scramble, points=10, time_limit=25))
out.append("")

sql = "\n".join(out)
with open("supabase/migrations/20260713020000_seed_more_puzzle_games_2.sql", "w") as f:
    f.write(sql)

print("WROTE", len(sql), "bytes")
print("GAME_IDS", GAME_IDS)
print("word_scramble sample:", word_scramble[:5])
