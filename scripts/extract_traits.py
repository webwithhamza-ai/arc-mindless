"""
Extract every trait layer out of the master PSD into flat PNGs + a manifest.json,
so the generator script never has to re-open/re-decode the 600MB+ PSD.

Run once (or whenever the PSD's traits change):
    python scripts/extract_traits.py
"""
import json
import os
import re
import time

from psd_tools import PSDImage

PSD_PATH = r"D:\Arc Mindless\Main file.psd"
CACHE_DIR = r"D:\Arc Mindless\_trait_cache"

# Top-level group order == stack order, back to front (verified empirically
# against the PSD: later group in this iteration order draws OVER earlier ones).
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


def safe_name(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9_.-]+", "_", name).strip("_") or "layer"


# Some groups only have raw export filenames ("ChatGPT Image ...") or bare
# numbers as layer names — give those a clean display label instead.
FRIENDLY_SINGULAR = {
    "Background": "Background",
    "Ear": "Earring",
    "Face": "Beard",
    "Clothes": "Clothes",
    "Rare": "Rare",
}


def is_raw_name(name: str) -> bool:
    return name.strip().startswith("ChatGPT") or name.strip().isdigit()


def friendly_label(gname: str, layer_name: str, idx: int) -> str:
    if is_raw_name(layer_name) and gname in FRIENDLY_SINGULAR:
        return f"{FRIENDLY_SINGULAR[gname]} {idx + 1:02d}"
    return layer_name


def main():
    t0 = time.time()
    psd = PSDImage.open(PSD_PATH)
    print(f"opened PSD in {time.time() - t0:.2f}s, canvas={psd.size}")

    groups = {l.name: l for l in psd if l.is_group()}
    missing = [g for g in GROUP_ORDER if g not in groups]
    if missing:
        raise SystemExit(f"Expected groups not found in PSD: {missing}")

    manifest = {"canvas": list(psd.size), "group_order": GROUP_ORDER, "groups": {}}

    for gname in GROUP_ORDER:
        group = groups[gname]
        gdir = os.path.join(CACHE_DIR, safe_name(gname))
        os.makedirs(gdir, exist_ok=True)

        seen_names = {}
        layers_meta = []
        for idx, layer in enumerate(group):
            base = safe_name(layer.name)
            n = seen_names.get(base, 0)
            seen_names[base] = n + 1
            fname = f"{idx:02d}_{base}{'' if n == 0 else f'_{n+1}'}.png"

            img = layer.topil()
            if img is None:
                print(f"  !! no pixels for {gname}/{layer.name!r}, skipping")
                continue
            if img.mode != "RGBA":
                img = img.convert("RGBA")
            img.save(os.path.join(gdir, fname))

            left, top, right, bottom = layer.bbox
            # Display label: friendly name for raw export filenames, and
            # disambiguate duplicate layer names for metadata.
            label = friendly_label(gname, layer.name, idx)
            if n > 0:
                label = f"{label} ({n + 1})"
            layers_meta.append(
                {
                    "index": idx,
                    "layer_name": layer.name,
                    "label": label,
                    "file": f"{safe_name(gname)}/{fname}",
                    "bbox": [left, top, right, bottom],
                }
            )

        manifest["groups"][gname] = layers_meta
        print(f"{gname}: extracted {len(layers_meta)} layers -> {gdir}")

    with open(os.path.join(CACHE_DIR, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"done in {time.time() - t0:.2f}s total")


if __name__ == "__main__":
    main()
