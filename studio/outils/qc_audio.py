#!/usr/bin/env python3
"""Contrôle audio d'un rendu MP4 : loudness, crêtes, trous. Usage: qc_audio.py video.mp4 [lignes.json]
lignes.json (facultatif) : [{"who":"B","t":0.0,"e":3.2}, ...] pour mesurer le niveau par personnage."""
import subprocess,sys,json,re,numpy as np
v=sys.argv[1]
def pcm(path):
    raw=subprocess.run(['ffmpeg','-v','error','-i',path,'-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(raw,dtype=np.int16).astype(np.float32)/32768
x=pcm(v);sr=16000
ebu=subprocess.run(['ffmpeg','-nostats','-i',v,'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True).stderr
lufs=re.findall(r'I:\s+(-?[\d.]+) LUFS',ebu);pk=re.findall(r'Peak:\s+(-?[\d.]+) dBFS',ebu)
res={'duree_s':round(len(x)/sr,1),'LUFS':float(lufs[-1]) if lufs else None,'crete_dBFS':float(pk[-1]) if pk else None}
res['LUFS_ok']=res['LUFS'] is not None and -17.5<=res['LUFS']<=-14.5
res['crete_ok']=res['crete_dBFS'] is not None and res['crete_dBFS']<-1
# trous : fenêtres de 100 ms sous -60 dBFS
w=sr//10;n=len(x)//w;rms=np.array([np.sqrt(np.mean(x[i*w:(i+1)*w]**2)+1e-12) for i in range(n)]);db=20*np.log10(rms)
holes=[];s=None
for i,d in enumerate(db):
    if d<-60:
        s=i if s is None else s
    else:
        if s is not None and (i-s)*.1>1.5: holes.append([round(s*.1,1),round(i*.1,1)])
        s=None
if s is not None and (n-s)*.1>1.5: holes.append([round(s*.1,1),round(n*.1,1)])
res['trous_>1.5s']=holes
if len(sys.argv)>2:
    L=json.load(open(sys.argv[2]));by={}
    for l in L:
        a=x[int(l['t']*sr):int(l['e']*sr)]
        if len(a)>sr//4: by.setdefault(l['who'],[]).append(20*np.log10(np.sqrt(np.mean(a**2))+1e-9))
    m={k:round(float(np.mean(v)),1) for k,v in by.items()};res['niveau_par_personnage_dB']=m
    if m: res['ecart_max_dB']=round(max(m.values())-min(m.values()),1);res['ecart_ok']=res['ecart_max_dB']<=3
print(json.dumps(res,indent=1,ensure_ascii=False))
