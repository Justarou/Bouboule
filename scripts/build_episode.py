"""Assemble un épisode : episodes/epXXX.json + audio/epXXX/*.mp3 + sfx/ -> out/epXXX.html"""
import json, os, re, sys, base64, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def rd(p, mode="r"): return open(os.path.join(ROOT, p), mode, **({"encoding": "utf8"} if "b" not in mode else {})).read()
def b64(p): return base64.b64encode(open(p, "rb").read()).decode()
def dur(p): return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode()), 3)


def visemes(path):
    """Enveloppe + 6 formes de bouche (0 fermée, 1 petite, 2 E, 3 A, 4 O/U, 5 I/S) à 50 Hz, depuis le mp3."""
    import numpy as np
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"])
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    n = len(x) // 320
    if n < 2: return "0", "0"
    x = x[:n * 320].reshape(n, 320)
    rms = np.sqrt((x ** 2).mean(1)); p = max(float(np.percentile(rms, 95)), 1e-4); rn = rms / p
    sp = np.abs(np.fft.rfft(x * np.hanning(320), axis=1)); fr = np.fft.rfftfreq(320, 1 / 16000)
    cen = (sp * fr).sum(1) / (sp.sum(1) + 1e-9)
    vis, amp = "", ""
    for r, c in zip(rn, cen):
        if r < .07: v = 0
        elif r < .22: v = 1
        elif c < 650: v = 4
        elif c < 1300: v = 3
        elif c < 2300: v = 2
        else: v = 5
        vis += str(v); amp += str(min(9, int(round(float(r) * 7))))
    return vis, amp

def voice_gain(path, target=0.115):
    """Gain de normalisation d'une voix (niveau RMS sur les parties parlées -> cible), borné."""
    import numpy as np
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"])
    x = np.abs(np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768)
    act = x[x > 0.02]
    if len(act) < 200: return 1.0
    rms = float(np.sqrt((act ** 2).mean())); pk = float(x.max())
    g = target / max(rms, 1e-4)
    return round(max(0.55, min(g, 4.0, 0.98 / max(pk, 1e-4))), 3)

def voice_gain3(path, target=0.115):
    """engine >= 3 : même but, mesure plus juste pour les voix fines (Pitou) : RMS des trames parlées (> 15 % du niveau crête des trames), gain jusqu'à x6."""
    import numpy as np
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"])
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    n = len(x) // 320
    if n < 2: return 1.0
    f = np.sqrt((x[:n * 320].reshape(n, 320) ** 2).mean(1)); p = float(np.percentile(f, 95))
    act = f[f > 0.15 * p]
    if len(act) < 5: return 1.0
    rms = float(np.sqrt((act ** 2).mean())); pk = float(np.abs(x).max())
    return round(max(0.55, min(target / max(rms, 1e-4), 6.0, 0.98 / max(pk, 1e-4))), 3)

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
        if ep.get("engine", 1) >= 2: ln["vis"], ln["amp"] = visemes(f); ln["vg"] = voice_gain3(f) if ep.get("engine", 1) >= 3 else voice_gain(f)
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
if '"splashbig"' in blob: used |= {"eclabousse_eau"}
if '"ripple"' in blob: used |= {"blop"}
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
