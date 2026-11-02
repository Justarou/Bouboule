"""Génère les voix de chaque épisode avec l'API ElevenLabs.

Pour chaque episodes/epXXX.json, crée audio/epXXX/lineNN.mp3.
Un fichier déjà présent n'est JAMAIS régénéré (pour garder les prises que tu aimes).
Pour refaire une réplique : supprime son mp3 puis relance le workflow.
"""
import json, os, sys, time, glob, urllib.request, urllib.error

KEY = os.environ.get("ELEVENLABS_API_KEY", "").strip()
if not KEY:
    sys.exit("ELEVENLABS_API_KEY manquante (Settings > Secrets and variables > Actions).")

def tts(voice_id, text):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128"
    body = json.dumps({"text": text, "model_id": "eleven_v4"}).encode()
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "xi-api-key": KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()

failed = 0
for path in sorted(glob.glob("episodes/*.json")):
    ep = json.load(open(path, encoding="utf8"))
    name = os.path.splitext(os.path.basename(path))[0]
    out = os.path.join("audio", name)
    os.makedirs(out, exist_ok=True)
    for i, line in enumerate(ep["lines"], 1):
        f = os.path.join(out, f"line{i:02d}.mp3")
        if not line.get("text"):
            continue          # temps mort sans voix
        if os.path.exists(f):
            print("deja la :", f); continue
        voice = ep["voices"][line["who"]]["id"]
        if voice == "TODO":
            print("voix pas encore choisie, ligne ignorée :", f); continue
        text = (line.get("tags", "") + " " + line["text"]).strip()
        for attempt in range(3):
            try:
                data = tts(voice, text)
                open(f, "wb").write(data)
                print("ok :", f, len(data), "octets"); break
            except urllib.error.HTTPError as e:
                msg = e.read().decode("utf8", "replace")[:300]
                print(f"ERREUR {e.code} sur {f} (essai {attempt+1}) : {msg}")
                if e.code in (401, 402, 403, 404, 422): failed += 1; break
                time.sleep(5 * (attempt + 1))
        else:
            failed += 1
        time.sleep(1)
if failed:
    sys.exit(f"{failed} réplique(s) en erreur — voir les messages ci-dessus.")
