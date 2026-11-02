"""Assemble un épisode : episodes/epXXX.json + audio/epXXX/*.mp3 + sfx/ -> out/epXXX.html"""
import json, os, re, sys, base64, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p, mode="r"): return open(os.path.join(ROOT, p), mode, **({"encoding": "utf8"} if "b" not in mode else {})).read()
def b64(p): return base64.b64encode(open(p, "rb").read()).decode()
def dur(p): return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode()), 3)

name = sys.argv[1]  # ep002
FAKE = "--fake" in sys.argv
ep = json.load(open(os.path.join(ROOT, "episodes", name + ".json"), encoding="utf8"))
voices = []
for i, ln in enumerate(ep["lines"], 1):
    f = os.path.join(ROOT, "audio", name, f"line{i:02d}.mp3")
    if FAKE:
        ln["dur"] = round(max(1.0, len(ln.get("text", "")) * .062 + .4), 2) if ln.get("text") else ln.get("silent", 1.0); voices.append(None); ln.pop("tags", None); continue
    if ln.get("text") and os.path.exists(f):
        ln["dur"] = dur(f); voices.append(b64(f))
    else:
        ln.setdefault("dur", ln.get("silent", 1.0)); voices.append(None)
        if ln.get("text"): sys.exit(f"audio manquant : {f}")
    ln.pop("tags", None)
ep.pop("voices", None)
ep["fileBase"] = name

# bruitages utilisés
idx = json.load(open(os.path.join(ROOT, "sfx", "index.json"), encoding="utf8"))
blob = json.dumps(ep, ensure_ascii=False)
used = set(re.findall(r'"sfx",\s*"([a-z_0-9]+)"', blob)) | set(re.findall(r'"amb",\s*"([a-z_0-9]+)"', blob))
used |= {"pop", "boing", "tombe", "tourne", "tremble", "couine", "feu_artifice", "impact_c", "petite_explosion"}
sfx = {}
for k in sorted(used):
    if k not in idx: print("sfx inconnu :", k); continue
    for n, v in enumerate(idx[k], 1): sfx[f"{k}_{n}"] = b64(os.path.join(ROOT, "sfx", v["f"]))

font = base64.b64encode(open("" + os.path.join(ROOT, "engine/vendor/baloo-2-latin-800-normal.woff2") + "", "rb").read()).decode()
muxer = open("" + os.path.join(ROOT, "engine/vendor/mp4-muxer.js") + "", encoding="utf8").read().replace("</script", "<\\/script")
t = rd("engine/template.html")
rep = {"{{TITLE}}": ep["title"], "{{SERIES}}": ep.get("series", "Bouboule"), "{{NO}}": str(ep.get("episodeNo", "")), "{{LEAD}}": ep.get("lead_text", ""),
       "{{ALT}}": ep.get("alt", ep["title"]), "{{FONT}}": font, "{{MUXER}}": muxer, "{{EP}}": json.dumps(ep, ensure_ascii=False).replace("</", "<\\/"),
       "{{VOICES}}": json.dumps(voices), "{{SFX}}": json.dumps(sfx),
       "{{CHARS}}": rd("engine/chars.js"), "{{SETS}}": rd("engine/sets.js"), "{{ENGINE}}": rd("engine/engine.js"), "{{AUDIO}}": rd("engine/audio.js"), "{{UI}}": rd("engine/ui.js")}
for k, v in rep.items(): t = t.replace(k, v)
os.makedirs(os.path.join(ROOT, "out"), exist_ok=True)
out = os.path.join(ROOT, "out", name + ".html")
open(out, "w", encoding="utf8").write(t)
print(out, round(os.path.getsize(out) / 1e6, 2), "Mo", "| sfx:", len(sfx), "| voix:", sum(1 for v in voices if v))
