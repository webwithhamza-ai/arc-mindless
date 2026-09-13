"""
Generate NFT images + metadata by randomly combining cached trait layers.

    python scripts/generate.py --count 100 --seed 42

Rarity rules (edit RULES below to tune):
  - Background: always present, uniform over all variants.
  - Base (skin): always present, weighted (gold/silver rarest).
  - Clothes / Eye wear / Ear / Face / mouth / Neck wear: optional accessories,
    each with its own chance of being present at all; uniform among variants
    when present.
  - Rare: special trait (halo etc). Exactly RARE_COUNT of the whole run gets
    one, chosen uniformly among the Rare variants; everyone else gets none.
"""
import argparse
import json
import os
import random

from PIL import Image

CACHE_DIR = r"D:\Arc Mindless\_trait_cache"
OUT_DIR = r"D:\Arc Mindless\output"
PROJECT_NAME = "Arc Mindless"

# Stack order, back to front (must match extract_traits.py's GROUP_ORDER).
GROUP_ORDER = [
    "Background",
    "Base",
    "Clothes",
    "Eye wear",
    "Ear",
    "Face",
    "mouth",
    "Neck wear",
    "Rare",
]

# Presence chance for optional categories (0..1). Background/Base are mandatory.
PRESENCE = {
    "Clothes": 0.65,
    "Eye wear": 0.35,
    "Ear": 0.30,
    "Face": 0.30,
    "mouth": 0.40,
    "Neck wear": 0.30,
}

# Weighted picks for Base skin tones (label substring match, case-insensitive).
BASE_WEIGHTS = {
    "white": 60,
    "brown": 10,
    "dark": 10,
    "black": 10,
    "silver": 5,
    "gold": 5,
}

RARE_COUNT_DEFAULT = 6


def load_manifest():
    with open(os.path.join(CACHE_DIR, "manifest.json"), encoding="utf-8") as f:
        return json.load(f)


def weighted_choice(rng, items, weight_fn):
    weights = [weight_fn(it) for it in items]
    return rng.choices(items, weights=weights, k=1)[0]


def base_weight(layer):
    label = layer["label"].lower()
    for key, w in BASE_WEIGHTS.items():
        if key in label:
            return w
    return 1  # fallback so nothing has zero chance


def build_edition_plan(manifest, count, rare_count, rng):
    """Decide, per edition index, which layer (or None) each group uses."""
    rare_layers = manifest["groups"]["Rare"]
    rare_slots = set(rng.sample(range(count), min(rare_count, count)))

    plan = []
    for i in range(count):
        pick = {}
        for gname in GROUP_ORDER:
            layers = manifest["groups"][gname]
            if gname == "Background":
                pick[gname] = rng.choice(layers)
            elif gname == "Base":
                pick[gname] = weighted_choice(rng, layers, base_weight)
            elif gname == "Rare":
                pick[gname] = rng.choice(rare_layers) if i in rare_slots else None
            else:
                chance = PRESENCE.get(gname, 0.3)
                pick[gname] = rng.choice(layers) if rng.random() < chance else None
        plan.append(pick)
    return plan


def combo_signature(pick):
    return tuple((g, pick[g]["file"] if pick[g] else None) for g in GROUP_ORDER)


def dedupe_plan(manifest, count, rare_count, rng, max_attempts=200):
    for attempt in range(max_attempts):
        plan = build_edition_plan(manifest, count, rare_count, rng)
        sigs = [combo_signature(p) for p in plan]
        if len(set(sigs)) == len(sigs):
            return plan
    raise SystemExit("Could not find a duplicate-free combination after many attempts")


def composite_edition(manifest, pick):
    w, h = manifest["canvas"]
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for gname in GROUP_ORDER:
        layer = pick[gname]
        if layer is None:
            continue
        img = Image.open(os.path.join(CACHE_DIR, layer["file"])).convert("RGBA")
        left, top, _, _ = layer["bbox"]
        canvas.alpha_composite(img, (left, top))
    return canvas.convert("RGB")


def build_attributes(pick):
    attrs = []
    for gname in GROUP_ORDER:
        layer = pick[gname]
        value = layer["label"] if layer else "None"
        attrs.append({"trait_type": gname, "value": value})
    return attrs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--count", type=int, default=100)
    ap.add_argument("--rare-count", type=int, default=RARE_COUNT_DEFAULT)
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--start-id", type=int, default=1)
    args = ap.parse_args()

    rng = random.Random(args.seed)
    manifest = load_manifest()

    img_dir = os.path.join(OUT_DIR, "images")
    meta_dir = os.path.join(OUT_DIR, "metadata")
    os.makedirs(img_dir, exist_ok=True)
    os.makedirs(meta_dir, exist_ok=True)

    plan = dedupe_plan(manifest, args.count, args.rare_count, rng)

    summary = []
    for offset, pick in enumerate(plan):
        token_id = args.start_id + offset
        img = composite_edition(manifest, pick)
        img_path = os.path.join(img_dir, f"{token_id}.png")
        img.save(img_path)

        attributes = build_attributes(pick)
        metadata = {
            "name": f"{PROJECT_NAME} #{token_id}",
            "description": f"{PROJECT_NAME} — 5555 mindless souls on ARC.",
            "image": f"{token_id}.png",
            "attributes": attributes,
        }
        with open(os.path.join(meta_dir, f"{token_id}.json"), "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        summary.append({"id": token_id, "attributes": attributes})
        if (offset + 1) % 20 == 0 or offset == len(plan) - 1:
            print(f"generated {offset + 1}/{len(plan)}")

    with open(os.path.join(OUT_DIR, "summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    rare_hits = sum(1 for s in summary if any(a["trait_type"] == "Rare" and a["value"] != "None" for a in s["attributes"]))
    print(f"\nDone. {len(plan)} images in {img_dir}")
    print(f"Rare trait present on {rare_hits}/{len(plan)} editions.")


if __name__ == "__main__":
    main()
