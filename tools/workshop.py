"""Workshop sprites (O8n): turn the raw art packs into the one sprite sheet the Code page uses.

The packs live in assets-src/workshop/ (git-ignored: most of their licenses allow USING the art
in a site but not sharing the files). This script cuts out only the sprites the room needs,
recolours them to the room's own palette so art from several artists reads as one room, and
writes four files that ARE committed:
    assets/images/workshop/sprites.png    the REPO-SAFE sprites (CC0 / CC-BY / CC-BY-SA), packed into one image
    assets/images/workshop/wall-layer.png the USE-ONLY wall tile (Whimsy Hallow), repeated over the back wall
    assets/images/workshop/room-layer.png the USE-ONLY sprites (licenses that forbid sharing the files),
                                          pasted at their places in the 384 x 216 room. A flattened scene
                                          layer, not a sheet of cut-out sprites, so the pack isn't handed out
    assets/images/workshop/sprites.json   where each sprite sits: {"name": [x, y, w, h]}, plus "layer": {name: [x, y, w, h]}
    assets/images/workshop/CREDITS.md     who made what, under which license

Run it from the repo root after changing SPRITES below:    python tools/workshop.py

Editing a sprite yourself (Aseprite, Pixelorama...): every run saves each sprite's ORIGINAL cut-out
to assets-src/workshop/export/<name>.png. Open it, change it (make gaps in a bookcase for candles,
add a sculpture), and save it as assets-src/workshop/edits/<name>.png at the SAME size. Next run,
your edit is used instead of the pack's, then recoloured and placed like any other sprite.
Needs Pillow (pip install pillow), like tools/art.py.
"""
import colorsys
import json
import os
import shutil
from PIL import Image

SRC = "assets-src/workshop"
OUT = "assets/images/workshop"

# The room's palette (the same colours as C in js/workcript.js), grouped into RAMPS: dark to light
# shades of one material. Recolouring by ramp keeps a sprite's shading (its light and dark parts)
# but swaps its colours for ours, so plum stone becomes our warm grey stone
RAMPS = {
    "stone": ["#2A2622", "#3E3A36", "#4E4A45", "#655F58", "#6F6A62", "#7A746A", "#9A9488"],
    "wood": ["#2B1E14", "#47301F", "#6E4A30", "#97683F", "#B88A55"],
    "iron": ["#1E1915", "#2C3033", "#3A3F42", "#6E7578", "#9AA2A5"],
    "brass": ["#3A2A14", "#7A5A26", "#B98B3E", "#E2C072"],
    # The Whimsy Hallow wall: cooler, greyer and lighter than "stone" (owner, 2026-11-26:
    # "slightly greyer"), so the window and forge light still read on it
    # The furnace: darker than the wall behind it, so it reads as a solid kiln, not a pale cloud
    "kiln": ["#24201D", "#34302C", "#45413C", "#56524C", "#68635C", "#7C7770"],
    "wallgrey": ["#3A3936", "#4C4A46", "#5D5B56", "#6E6B66", "#827F79", "#9A9790"],
}
# Book spines and small accents keep their variety: each colour snaps to the nearest of these
ACCENTS = ["#D9622B", "#F2C14E", "#EFE2BE", "#4E6B6E", "#A8402E", "#7A4A2B", "#3E5250", "#C98B3A",
           "#8A8A5A", "#9E3A2E", "#385850", "#4F8A7A", "#2B4F7E", "#1E1915", "#E9DAB6"]

# Each sprite: where it comes from (pack file + box x, y, w, h), how to recolour it, and its credit.
# Options: "scale": 2 doubles a sprite pixel for pixel (the owner's call for the 16 px smithy pieces,
#          2026-11-26, though it mixes pixel sizes); "key": [r, g, b] is a background colour to clear
#          (Whimsy Hallow's sheet sits on opaque black); "erase": [[x, y, w, h], ...] clears parts of
#          the cut-out that belong to a NEIGHBOUR on the sheet; "group" moves a placed sprite with its
#          object (SHIFT above); "z" orders pasted sprites (lower = further back);
#          "place": [x, y] marks a USE-ONLY sprite,
#          pasted into room-layer.png at that spot in the room instead of the shared sheet.
# mode: "ramp:<material>" (by brightness onto a ramp), "accent" (nearest accent colour),
#       "mixed:<material>" (grey and dull pixels onto the ramp, colourful ones to the nearest accent),
#       "keep" (as drawn)
# The room (must match js/workcript.js): the whole picture is 576 x 300; the original 384 x 216
# room sits inside it at (96, 54), with the extra space around it for depth (2026-11-26).
# "place" is in that inner room's coordinates; add "full": True to place in the whole picture
ROOM_W, ROOM_H, ROOM_X, ROOM_Y = 576, 300, 96, 54
# Objects were spread out (owner, 2026-11-26): each group's shift from its first place in the room.
# MUST match SHIFT in js/workcript.js, so the pasted sprites land on their click areas
SHIFT = {"box": (-50, 0), "toolbox": (8, 34), "anvil": (0, 0)}
FURNACE = "kanmandev-blacksmith/BlacksmithDemo/DemoFurnace.png"
MANU = "manu-art-library/Llibrary Ver 1.0/PNG Files/Tileset.png"
KAN = "kanmandev-blacksmith/BlacksmithDemo/demo.png"
LANTERN = "karsiori-lanterns/Pixel Art Lantern Pack/Lanterns - Smaller Versions/Lantern 1/Bronze/Lantern 1 Small - Bronze and Orange.png"
WHIMSY = "whimsy-hallow/Whimsy_Hallow_Dungeon_Asset_Pack_V1.62.png"
# Whole pictures copied as they are, for buttons in the page (not the canvas): (pack file, output name).
# The Code page's theme switch (owner, 2026-11-27): red ribbon = Day, blue ribbon = Night
ICONS = [("idylwild-arcanum/scroll_bound_1.png", "scroll-day.png"),
         ("idylwild-arcanum/scroll_bound_2.png", "scroll-night.png")]
SPRITES = [
    {"name": "bookcase", "src": MANU, "box": [0, 96, 47, 48], "mode": "mixed:wood", "credit": "manu"},
    {"name": "bookcase-narrow", "src": MANU, "box": [48, 96, 16, 48], "mode": "mixed:wood", "credit": "manu"},
    {"name": "bookcase-low", "src": MANU, "box": [0, 144, 47, 16], "mode": "mixed:wood", "credit": "manu"},
    {"name": "bookcase-low-narrow", "src": MANU, "box": [48, 144, 16, 16], "mode": "mixed:wood", "credit": "manu"},
    {"name": "globe", "src": MANU, "box": [210, 17, 12, 15], "mode": "keep", "credit": "manu"},
    {"name": "anvil-hot", "src": KAN, "box": [33, 135, 16, 9], "mode": "mixed:iron", "credit": "kanmandev", "place": [263, 136], "scale": 2, "group": "anvil"},
    {"name": "tongs", "src": KAN, "box": [7, 114, 5, 14], "mode": "ramp:iron", "credit": "kanmandev", "place": [260, 30], "group": "toolbox"},
    {"name": "hammer", "src": KAN, "box": [6, 134, 6, 10], "mode": "mixed:iron", "credit": "kanmandev", "place": [266, 31], "group": "toolbox"},
    {"name": "bucket", "src": KAN, "box": [69, 120, 8, 8], "mode": "keep", "credit": "kanmandev", "place": [424, 212], "full": True, "scale": 2},
    {"name": "lantern", "src": LANTERN, "box": [48, 34, 24, 34], "mode": "keep", "credit": "karsiori"},
    {"name": "chest", "src": WHIMSY, "box": [1006, 581, 20, 11], "key": [0, 0, 0], "mode": "ramp:wood",
     "credit": "whimsy", "place": [26, 156], "scale": 2, "group": "box"},
    # The margins: things standing at the sides of the bigger room, and the chandelier above it
    {"name": "statue", "src": MANU, "box": [214, 97, 21, 47], "mode": "ramp:wallgrey", "credit": "manu"},
    {"name": "vase-stand", "src": MANU, "box": [208, 33, 16, 31], "mode": "mixed:wood", "credit": "manu"},
    {"name": "banner-red", "src": MANU, "box": [273, 0, 14, 47], "mode": "keep", "credit": "manu"},
    {"name": "banner-blue", "src": MANU, "box": [273, 48, 14, 47], "mode": "keep", "credit": "manu"},
    # The chandelier sits between a wall sconce and a small chandelier on the sheet: erase those two
    {"name": "chandelier", "src": MANU, "box": [211, 64, 43, 32], "erase": [[0, 0, 12, 16], [28, 0, 15, 16]],
     "mode": "ramp:iron", "credit": "manu"},
    {"name": "chandelier-small", "src": MANU, "box": [240, 64, 16, 16], "mode": "ramp:iron", "credit": "manu"},
    # The forge itself: kanmandev's furnace at 3x (owner, 2026-11-26); workcript.js lights its mouth
    {"name": "furnace", "src": FURNACE, "box": [0, 0, 32, 48], "mode": "mixed:kiln", "credit": "kanmandev",
     "place": [400, 82], "full": True, "scale": 3, "z": -1},
    # A rusted sword hung on the wall right of the forge, under the banner and the lantern
    {"name": "rusty-sword", "src": KAN, "box": [133, 80, 6, 16], "mode": "keep", "credit": "kanmandev",
     "place": [519, 140], "full": True, "scale": 2},
    {"name": "ingots", "src": KAN, "box": [146, 131, 13, 11], "mode": "ramp:iron", "credit": "kanmandev",
     "place": [500, 214], "full": True},
    {"name": "ore", "src": KAN, "box": [146, 120, 12, 8], "mode": "mixed:stone", "credit": "kanmandev",
     "place": [515, 217], "full": True},
    {"name": "wall-tile", "src": WHIMSY, "box": [736, 1120, 32, 32], "key": [0, 0, 0], "mode": "ramp:wallgrey",
     "credit": "whimsy", "wall": True},
]

CREDITS = {
    "manu": "Library Asset Pack by Manu_Art, https://manu-art.itch.io/library-asset-pack, CC BY-SA 4.0 "
            "(https://creativecommons.org/licenses/by-sa/4.0/). Recoloured and cut out; these edited sprites are "
            "also CC BY-SA 4.0.",
    "kanmandev": "Blacksmith assets by kanmandev, https://kanmandev.itch.io/blacksmith. Used with permission of "
                 "its license (use and edit allowed, no redistribution of the pack). Recoloured.",
    "karsiori": "FREE Pixel Art Lantern Pack by karsiori, https://karsiori.itch.io/free-pixel-art-lantern-pack, CC0.",
    "arcanum": "Idylwild's Arcanum, https://opengameart.org/content/idylwilds-arcanum: free for any use, "
               "attribution appreciated. The two bound scrolls of the theme switch (scroll-day.png, scroll-night.png).",
    "whimsy": "Whimsy Hallow: Dungeon by Crumpaloo, https://crumpaloo.itch.io/whimsy-hallow, CC0 (the author asks "
              "that the raw pack not be redistributed). Recoloured.",
}


def hex_rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def luminance(rgb):
    r, g, b = rgb
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def nearest(rgb, palette):
    # Weighted RGB distance ("redmean"): closer to how eyes judge colour than plain RGB
    def dist(p):
        rm = (rgb[0] + p[0]) / 2
        dr, dg, db = rgb[0] - p[0], rgb[1] - p[1], rgb[2] - p[2]
        return (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db
    return min(palette, key=dist)


def recolour(img, mode):
    if mode == "keep":
        return img
    kind, _, material = mode.partition(":")
    ramp = [hex_rgb(c) for c in RAMPS.get(material, [])]
    accents = [hex_rgb(c) for c in ACCENTS]
    px = img.load()
    # The sprite's own darkest and lightest colours set where the ramp starts and ends
    lums = [luminance(px[x, y][:3]) for y in range(img.height) for x in range(img.width) if px[x, y][3]]
    lo, hi = (min(lums), max(lums)) if lums else (0, 255)
    # In "mixed" mode the sprite's MOST COMMON colourful hue is its material (a bookcase's red
    # frame), so it goes onto the ramp too; only the rarer hues (the book spines) stay colourful
    def hue_bucket(r, g, b):
        h, _, _ = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        return int(h * 12) % 12          # 12 slices of 30 degrees
    counts = {}
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if a and max(r, g, b) - min(r, g, b) > 70:
                counts[hue_bucket(r, g, b)] = counts.get(hue_bucket(r, g, b), 0) + 1
    material_hue = max(counts, key=counts.get) if counts else None
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if not a:
                continue
            saturation = max(r, g, b) - min(r, g, b)
            colourful = saturation > 70 and hue_bucket(r, g, b) != material_hue
            if kind == "accent" or (kind == "mixed" and colourful):
                nr, ng, nb = nearest((r, g, b), accents)
            else:
                k = (luminance((r, g, b)) - lo) / max(1, hi - lo)
                nr, ng, nb = ramp[min(len(ramp) - 1, int(k * len(ramp)))]
            px[x, y] = (nr, ng, nb, a)
    return img


def pack(images):
    # Shelf packing: sort tallest first, fill rows left to right. Plenty for a few dozen sprites
    width, x, y, row_h, places = 256, 0, 0, 0, {}
    for name, im in sorted(images.items(), key=lambda kv: -kv[1].height):
        if x + im.width > width:
            x, y, row_h = 0, y + row_h + 1, 0
        places[name] = [x, y, im.width, im.height]
        x += im.width + 1          # a 1 px gap, so scaled-up sprites never bleed into each other
        row_h = max(row_h, im.height)
    sheet = Image.new("RGBA", (width, y + row_h), (0, 0, 0, 0))
    for name, (px, py, _, _) in places.items():
        sheet.paste(images[name], (px, py))
    return sheet, places


def main():
    os.makedirs(OUT, exist_ok=True)
    images, used = {}, set()
    for s in SPRITES:
        path = os.path.join(SRC, s["src"])
        if not os.path.exists(path):
            print("missing pack file, skipped:", s["name"], "->", path)
            continue
        x, y, w, h = s["box"]
        im = Image.open(path).convert("RGBA").crop((x, y, x + w, y + h))
        os.makedirs(os.path.join(SRC, "export"), exist_ok=True)
        im.save(os.path.join(SRC, "export", s["name"] + ".png"))      # the original, to edit
        edit = os.path.join(SRC, "edits", s["name"] + ".png")
        if os.path.exists(edit):                                      # the owner's edit wins
            im = Image.open(edit).convert("RGBA")
            print("using your edit:", edit)
        for ex, ey, ew, eh in s.get("erase", []):   # clear a neighbour's pixels
            im.paste((0, 0, 0, 0), (ex, ey, ex + ew, ey + eh))
        if "key" in s:   # clear the sheet's background colour
            px = im.load()
            for yy in range(im.height):
                for xx in range(im.width):
                    if px[xx, yy][:3] == tuple(s["key"]):
                        px[xx, yy] = (0, 0, 0, 0)
        im = recolour(im, s["mode"])
        if s.get("scale", 1) != 1:   # nearest neighbour: every pixel becomes a clean 2 x 2 block
            im = im.resize((im.width * s["scale"], im.height * s["scale"]), Image.NEAREST)
        images[s["name"]] = im
        used.add(s["credit"])
    # The wall: the use-only tile repeated over the back wall (every other row shifted half a tile),
    # flattened into its own layer because it sits BEHIND everything else
    wall = Image.new("RGBA", (ROOM_W, ROOM_H), (0, 0, 0, 0))
    tile_names = [s["name"] for s in SPRITES if s.get("wall") and s["name"] in images]
    top, bottom = ROOM_Y + 9, ROOM_Y + 168          # under the back beam, down to the floor
    for name in tile_names:
        tile = images.pop(name)
        for row, y in enumerate(range(top, bottom, tile.height)):
            for x in range(-tile.width // 2 if row % 2 else 0, ROOM_W, tile.width):
                wall.alpha_composite(tile, (max(0, x), y), (max(0, -x), 0, tile.width, min(tile.height, bottom - y)))
    wall.save(os.path.join(OUT, "wall-layer.png"), optimize=True)
    # Use-only sprites are pasted into one room-sized layer at their "place"; the rest are packed
    def where(s):
        if s.get("full"):
            return s["place"]
        dx, dy = SHIFT.get(s.get("group"), (0, 0))
        return [s["place"][0] + ROOM_X + dx, s["place"][1] + ROOM_Y + dy]
    # Pasted in "z" order (lowest first), so the bucket stands IN FRONT of the furnace, not behind it
    placed = sorted((s for s in SPRITES if "place" in s and s["name"] in images), key=lambda s: s.get("z", 0))
    # Where each one lands, with its size: workcript.js cuts its shape back out for the outline
    places_in_room = {s["name"]: where(s) + list(images[s["name"]].size) for s in placed}
    layer = Image.new("RGBA", (ROOM_W, ROOM_H), (0, 0, 0, 0))
    for name, (x, y, _, _) in places_in_room.items():
        layer.alpha_composite(images.pop(name), (x, y))
    layer.save(os.path.join(OUT, "room-layer.png"), optimize=True)
    sheet, places = pack(images)
    places["layer"] = places_in_room
    sheet.save(os.path.join(OUT, "sprites.png"), optimize=True)
    with open(os.path.join(OUT, "sprites.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(places, f, indent=1)
        f.write("\n")
    for pack_file, name in ICONS:
        path = os.path.join(SRC, pack_file)
        if os.path.exists(path):
            shutil.copyfile(path, os.path.join(OUT, name))
            used.add("arcanum")
        else:
            print("missing pack file, skipped:", name, "->", path)
    with open(os.path.join(OUT, "CREDITS.md"), "w", encoding="utf-8", newline="\n") as f:
        f.write("# Workshop art credits\n\nThe pixel art in sprites.png comes from these packs (generated by tools/workshop.py). "
                "Everything else in the workshop is drawn in code (js/workcript.js).\n\n")
        for key in sorted(used):
            f.write(f"- {CREDITS[key]}\n")
    print(f"{len(images)} sprites -> {OUT}/sprites.png ({sheet.width}x{sheet.height})")


if __name__ == "__main__":
    main()
