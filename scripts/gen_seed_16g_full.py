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
    "calibration_challenge": uuid_for("game-calibration_challenge"),
    "science_bingo": uuid_for("game-science_bingo"),
    "science_facts": uuid_for("game-science_facts"),
    "mini_crossword": uuid_for("game-mini_crossword"),
    "wheel_of_science_facts": uuid_for("game-wheel_of_science_facts"),
}

out = []
out.append("--------------------------------------------------------------------------------")
out.append("-- Section 16g seed content: Calibration Challenge, Science Bingo, Science Facts,")
out.append("-- Mini Crossword, Wheel of Science Facts.")
out.append("--")
out.append("-- All REAL, directly-authored/fact-checked content. None of these five games")
out.append("-- use images -- pure text/multiple_choice/true_false rounds, same as True or")
out.append("-- False, Guess the Unit, and Emoji Science before them.")
out.append("--------------------------------------------------------------------------------")
out.append("")
out.append("insert into public.games (id, name, slug, description, game_type, status, max_attempts_per_user)")
out.append("values")
game_rows = [
    f"  ('{GAME_IDS['calibration_challenge']}', 'Calibration Challenge', 'calibration-challenge', null, 'calibration_challenge', 'active', 3)",
    f"  ('{GAME_IDS['science_bingo']}', 'Science Bingo', 'science-bingo', null, 'science_bingo', 'active', 3)",
    f"  ('{GAME_IDS['science_facts']}', 'Science Facts', 'science-facts', null, 'science_facts', 'active', 3)",
    f"  ('{GAME_IDS['mini_crossword']}', 'Mini Crossword', 'mini-crossword', null, 'mini_crossword', 'active', 3)",
    f"  ('{GAME_IDS['wheel_of_science_facts']}', 'Wheel of Science Facts', 'wheel-of-science-facts', null, 'wheel_of_science_facts', 'active', 3)",
]
out.append(render_values(game_rows, "\non conflict (slug) do nothing;"))
out.append("")

# ------------------------------------------------------------------
# 1. Calibration Challenge -- mixed true_false / text
# ------------------------------------------------------------------
calibration_challenge = [
    ("true_false", "Calibration compares a measuring instrument's readings against a known reference standard.", "true", "That's the core definition of calibration."),
    ("true_false", "Once an instrument is calibrated, it never needs to be recalibrated again.", "false", "Instruments drift over time and with use, so recalibration on a set interval is required."),
    ("text", "A calibration standard mass is labeled 100.00 g. The balance reads 100.05 g. What is the error, in grams? (just the number)", "0.05", None),
    ("text", "A thermometer calibration reference reads 0.0 degrees Celsius at the ice point. Your thermometer reads 0.4 degrees Celsius. What is the error, in degrees Celsius? (just the number)", "0.4", None),
    ("true_false", "A calibration certificate typically states the traceability of the reference standard used.", "true", "Traceability back to a national or international standard is a standard part of a calibration certificate."),
    ("true_false", "Calibration and verification mean exactly the same thing.", "false", "Calibration establishes the relationship to a reference; verification confirms the instrument still meets its required accuracy -- related but distinct."),
    ("text", "The acceptable tolerance for a 500 mL volumetric flask is plus or minus 0.20 mL. It measures 500.15 mL. Is it within tolerance? Answer Yes or No.", "Yes", None),
    ("text", "The acceptable tolerance for a 500 mL volumetric flask is plus or minus 0.20 mL. It measures 500.35 mL. Is it within tolerance? Answer Yes or No.", "No", None),
    ("true_false", "A pH meter should be calibrated using buffer solutions of known pH.", "true", "Standard buffer solutions (commonly pH 4, 7, and 10) are used to calibrate pH meters."),
    ("true_false", "Environmental factors like temperature and humidity have no effect on calibration accuracy.", "false", "Temperature and humidity can meaningfully affect many instruments' readings, which is why calibration is often done under controlled conditions."),
    ("text", "What do we call the smallest change a measuring instrument can detect and display?", "Resolution", None),
    ("text", "What do we call the closeness of a measured value to the true or accepted value?", "Accuracy", None),
    ("text", "What do we call the closeness of agreement between repeated measurements of the same quantity?", "Precision", None),
    ("true_false", "A calibration interval is the length of time between successive calibrations of an instrument.", "true", "That's the standard definition of a calibration interval."),
    ("text", "What term describes an unbroken chain of comparisons linking a measurement to a national or international standard?", "Traceability", None),
]
assert len(calibration_challenge) == 15

# ------------------------------------------------------------------
# 2. Science Bingo -- multiple_choice, "Bingo call" clue -> term
# ------------------------------------------------------------------
science_bingo = [
    ("Bingo call: The study of living organisms.", "Biology", ["Chemistry", "Physics", "Geology"]),
    ("Bingo call: The study of matter and its properties and how it changes.", "Chemistry", ["Biology", "Astronomy", "Physics"]),
    ("Bingo call: The study of energy, forces, and motion.", "Physics", ["Chemistry", "Geology", "Biology"]),
    ("Bingo call: The study of celestial objects, space, and the universe.", "Astronomy", ["Geology", "Meteorology", "Physics"]),
    ("Bingo call: The study of the Earth's physical structure and substance.", "Geology", ["Astronomy", "Biology", "Meteorology"]),
    ("Bingo call: The study of weather and the atmosphere.", "Meteorology", ["Geology", "Astronomy", "Biology"]),
    ("Bingo call: The scientific method step where you form a testable explanation.", "Hypothesis", ["Theory", "Law", "Observation"]),
    ("Bingo call: A well-substantiated explanation acquired through the scientific method, repeatedly tested and confirmed.", "Theory", ["Hypothesis", "Law", "Guess"]),
    ("Bingo call: A statement that describes an observed pattern in nature, without explaining why.", "Law", ["Theory", "Hypothesis", "Rule"]),
    ("Bingo call: The smallest unit of an element that retains its chemical properties.", "Atom", ["Molecule", "Cell", "Ion"]),
    ("Bingo call: The basic structural and functional unit of all living organisms.", "Cell", ["Atom", "Tissue", "Organ"]),
    ("Bingo call: Two or more atoms bonded together.", "Molecule", ["Compound", "Atom", "Ion"]),
    ("Bingo call: A pure substance made of two or more different elements chemically bonded in a fixed ratio.", "Compound", ["Molecule", "Mixture", "Element"]),
    ("Bingo call: A substance that cannot be broken down into simpler substances by chemical means.", "Element", ["Compound", "Mixture", "Atom"]),
    ("Bingo call: A material made of two or more substances that are physically combined, not chemically bonded.", "Mixture", ["Compound", "Solution", "Element"]),
]
assert len(science_bingo) == 15

# ------------------------------------------------------------------
# 3. Science Facts -- text, fill-in-the-blank
# ------------------------------------------------------------------
science_facts = [
    ("Complete the fact: Water boils at ___ degrees Celsius at sea level. (just the number)", "100"),
    ("Complete the fact: Water freezes at ___ degrees Celsius at sea level. (just the number)", "0"),
    ("Complete the fact: The chemical formula for water is ___.", "H2O"),
    ("Complete the fact: The powerhouse of the cell is the ___.", "Mitochondria"),
    ("Complete the fact: The closest planet to the Sun is ___.", "Mercury"),
    ("Complete the fact: The largest planet in our solar system is ___.", "Jupiter"),
    ("Complete the fact: The speed of light is approximately ___ km/s. (just the number, rounded)", "300000"),
    ("Complete the fact: The process by which plants make their own food using sunlight is called ___.", "Photosynthesis"),
    ("Complete the fact: The gas that plants absorb from the air for photosynthesis is ___.", "Carbon Dioxide"),
    ("Complete the fact: The gas that humans need to breathe to survive is ___.", "Oxygen"),
    ("Complete the fact: The pH value of a neutral solution is ___. (just the number)", "7"),
    ("Complete the fact: The number of bones in an adult human body is ___. (just the number)", "206"),
    ("Complete the fact: The largest organ in the human body is the ___.", "Skin"),
    ("Complete the fact: The force that pulls objects toward the center of the Earth is called ___.", "Gravity"),
    ("Complete the fact: The basic unit of heredity that carries genetic information is called a ___.", "Gene"),
    ("Complete the fact: Sound cannot travel through a ___.", "Vacuum"),
    ("Complete the fact: The layer of gases surrounding Earth is called the ___.", "Atmosphere"),
    ("Complete the fact: The chemical symbol for gold is ___.", "Au"),
    ("Complete the fact: The study of fossils is called ___.", "Paleontology"),
    ("Complete the fact: The center of an atom, containing protons and neutrons, is called the ___.", "Nucleus"),
]
assert len(science_facts) == 20

# ------------------------------------------------------------------
# 4. Mini Crossword -- text, single clue with a letter-count hint
# ------------------------------------------------------------------
mini_crossword = [
    ("A narrow-necked container used to mix or heat chemicals.", "FLASK"),
    ("A cylindrical container with a pour spout, used to hold liquids.", "BEAKER"),
    ("The smallest unit of an element.", "ATOM"),
    ("The basic unit of life.", "CELL"),
    ("The capacity to do work.", "ENERGY"),
    ("Anything that has mass and takes up space.", "MATTER"),
    ("Mass divided by volume.", "DENSITY"),
    ("The force that pulls objects toward Earth.", "GRAVITY"),
    ("A protein that speeds up chemical reactions in the body.", "ENZYME"),
    ("The amount of space an object occupies.", "VOLUME"),
    ("A substance with a pH less than 7.", "ACID"),
    ("A substance with a pH greater than 7.", "BASE"),
    ("The curved path an object takes around another in space.", "ORBIT"),
    ("The preserved remains or trace of an ancient organism.", "FOSSIL"),
    ("The natural environment where an organism lives.", "HABITAT"),
]
assert len(mini_crossword) == 15
for clue, answer in mini_crossword:
    assert answer.isalpha() and answer.isupper()

# ------------------------------------------------------------------
# 5. Wheel of Science Facts -- true_false, "did you know" trivia
#    (distinct facts from the 16d True or False set -- no overlap)
# ------------------------------------------------------------------
wheel_of_science_facts = [
    ("A group of crows is called a murder.", "true", "This is a real, traditional collective noun for crows."),
    ("Honey never spoils if stored properly.", "true", "Honey's low moisture and acidity make it naturally resistant to spoilage indefinitely."),
    ("The human body has more bacterial cells than human cells.", "true", "Widely cited estimates put the ratio at roughly 1:1 to 10:1 in favor of bacteria, depending on the study."),
    ("Octopuses have three hearts.", "true", "Two pump blood to the gills, and one pumps it to the rest of the body."),
    ("Bananas are berries, but strawberries are not, botanically speaking.", "true", "Botanically, a berry develops from a single ovary; bananas qualify, strawberries do not."),
    ("The Eiffel Tower can grow taller in the summer due to thermal expansion.", "true", "Heat causes the iron structure to expand, adding several centimeters to its height."),
    ("Mount Everest is the tallest mountain on Earth measured from base to peak.", "false", "Mauna Kea in Hawaii is taller measured base to peak, though Everest has the highest peak above sea level."),
    ("A jiffy is an actual unit of time in physics.", "true", "A jiffy is used informally in physics and computing to mean a very short, specific interval of time."),
    ("Humans can hear all frequencies of sound waves.", "false", "Human hearing is limited to roughly 20 Hz to 20,000 Hz; many animals hear frequencies outside this range."),
    ("The Great Barrier Reef is the largest living structure on Earth.", "true", "It's the largest structure made by living organisms, visible even from space."),
    ("All metals are magnetic.", "false", "Only a few metals, like iron, nickel, and cobalt, are strongly magnetic; most metals are not."),
    ("The human nose can distinguish over one trillion different scents.", "true", "A widely cited 2014 study estimated human scent discrimination at over a trillion odors."),
    ("Glass is a slow-flowing liquid at room temperature.", "false", "This is a persistent myth -- glass is an amorphous solid and does not flow at room temperature."),
    ("There are more possible variations of a game of chess than atoms in the observable universe.", "true", "The number of possible chess games vastly exceeds estimates of atoms in the observable universe."),
    ("A day on Venus is longer than a year on Venus.", "true", "Venus rotates so slowly that one day (one full rotation) takes longer than one Venusian year (one orbit of the Sun)."),
]
assert len(wheel_of_science_facts) == 15

# ------------------------------------------------------------------
# Render SQL
# ------------------------------------------------------------------

def mc_options_json(correct_text, distractor_texts):
    opts = [{"id": "a", "text": correct_text}] + [{"id": chr(ord("b") + i), "text": t} for i, t in enumerate(distractor_texts)]
    r = random.Random(correct_text + "".join(distractor_texts))
    r.shuffle(opts)
    correct_id = next(o["id"] for o in opts if o["text"] == correct_text)
    return json.dumps(opts), correct_id

def calibration_block(game_key, items, points=10):
    out_lines = ["-- Calibration Challenge: 15 rounds (real metrology/calibration concepts, mixed true_false/text)."]
    out_lines.append("insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, explanation, points, order_index, time_limit_seconds, category)")
    out_lines.append("values")
    rows = []
    for i, (qtype, qtext, correct, explanation) in enumerate(items, start=1):
        qid = uuid_for(f"{game_key}-q{i}")
        time_limit = 15 if qtype == "true_false" else 25
        expl_sql = f"'{esc(explanation)}'" if explanation else "null"
        rows.append(f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', '{qtype}', '{esc(correct)}', {expl_sql}, {points}, {i}, {time_limit}, null)")
    out_lines.append(render_values(rows))
    return "\n".join(out_lines)

def bingo_block(game_key, items, points=10, time_limit=20):
    out_lines = ["-- Science Bingo: 15 rounds (real science-vocabulary clue-to-term matching)."]
    out_lines.append("insert into public.game_questions (id, game_id, question_text, question_type, options, correct_answer, points, order_index, time_limit_seconds, category)")
    out_lines.append("values")
    rows = []
    for i, (qtext, correct, distractors) in enumerate(items, start=1):
        qid = uuid_for(f"{game_key}-q{i}")
        options_json, correct_id = mc_options_json(correct, distractors)
        rows.append(f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', 'multiple_choice', '{esc(options_json)}'::jsonb, '{correct_id}', {points}, {i}, {time_limit}, null)")
    out_lines.append(render_values(rows))
    return "\n".join(out_lines)

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

def crossword_block(game_key, items, points=10, time_limit=25):
    out_lines = ["-- Mini Crossword: 15 rounds (single crossword-style clue + letter-count hint, real vocabulary)."]
    out_lines.append("insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, points, order_index, time_limit_seconds, category)")
    out_lines.append("values")
    rows = []
    for i, (clue, answer) in enumerate(items, start=1):
        qtext = f"{len(answer)} letters: {clue}"
        qid = uuid_for(f"{game_key}-q{i}")
        rows.append(f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', 'text', '{esc(answer.capitalize())}', {points}, {i}, {time_limit}, null)")
    out_lines.append(render_values(rows))
    return "\n".join(out_lines)

def truefalse_block(comment, game_key, items, points=10, time_limit=15):
    out_lines = [f"-- {comment}"]
    out_lines.append("insert into public.game_questions (id, game_id, question_text, question_type, correct_answer, explanation, points, order_index, time_limit_seconds, category)")
    out_lines.append("values")
    rows = []
    for i, (qtext, correct, explanation) in enumerate(items, start=1):
        qid = uuid_for(f"{game_key}-q{i}")
        rows.append(f"  ('{qid}', '{GAME_IDS[game_key]}', '{esc(qtext)}', 'true_false', '{esc(correct)}', '{esc(explanation)}', {points}, {i}, {time_limit}, null)")
    out_lines.append(render_values(rows))
    return "\n".join(out_lines)


out.append(calibration_block("calibration_challenge", calibration_challenge))
out.append("")
out.append(bingo_block("science_bingo", science_bingo))
out.append("")
out.append(text_block("Science Facts: 20 rounds (real, fill-in-the-blank science facts).", "science_facts", science_facts, points=10, time_limit=20))
out.append("")
out.append(crossword_block("mini_crossword", mini_crossword))
out.append("")
out.append(truefalse_block("Wheel of Science Facts: 15 rounds (real \"did you know\" science trivia, distinct from the 16d True or False set).", "wheel_of_science_facts", wheel_of_science_facts))
out.append("")

sql = "\n".join(out)
with open("supabase/migrations/20260715020000_seed_more_puzzle_games_4.sql", "w") as f:
    f.write(sql)

print("WROTE", len(sql), "bytes")
print("GAME_IDS", GAME_IDS)
