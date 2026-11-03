#!/usr/bin/env python3
"""Contrôle de fluidité caméra/mouvement sur un RENDU vidéo (obligatoire avant chaque livraison).
Usage : qc_fluidite.py video.mp4 [dossier_sortie]
Mesure image par image (échelle réduite) :
  - images dupliquées au milieu d'un mouvement (saccade / image perdue),
  - micro-coupures (saut d'image brutal hors fondu),
  - irrégularité du déplacement global (à-coups : accélération anormale d'une image à l'autre).
Niveaux : CONFORME / A CORRIGER / BLOQUANT (règles dans studio/10_qualite.md).
Écrit un JSON, des images des passages suspects (dossier_sortie/suspects/) et affiche le verdict."""
import subprocess,sys,json,os,numpy as np
v=sys.argv[1];out=sys.argv[2] if len(sys.argv)>2 else os.path.splitext(v)[0]+'_fluidite';os.makedirs(out+'/suspects',exist_ok=True)
pr=json.loads(subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,r_frame_rate,nb_frames','-of','json',v],capture_output=True,text=True).stdout)['streams'][0]
W,H=pr['width'],pr['height'];num,den=pr['r_frame_rate'].split('/');fps=float(num)/float(den)
w=320;h=int(round(w*H/W/2))*2
raw=subprocess.run(['ffmpeg','-v','error','-i',v,'-vf',f'scale={w}:{h},format=gray','-f','rawvideo','-'],capture_output=True).stdout
F=np.frombuffer(raw,dtype=np.uint8).reshape(-1,h,w).astype(np.float32);n=len(F)
# on ignore la bande des sous-titres (changement de texte = faux positif) : bas 22 % en paysage, haut 20 % en vertical
F=F[:,:int(h*.76),:] if W>=H else F[:,int(h*.22):,:]
h=F.shape[1]
d=np.array([np.mean(np.abs(F[i]-F[i-1])) for i in range(1,n)])        # différence entre images i-1 et i (indice i-1)
# déplacement global horizontal (profil des colonnes, corrélation, ±8 px)
P=F.mean(axis=1);P=P-P.mean(axis=1,keepdims=True)
def shift(a,b):
    best,bs=1e18,0
    for s in range(-8,9):
        x=a[max(0,s):w+min(0,s)];y=b[max(0,-s):w-max(0,s)]
        e=np.mean((x-y)**2)
        if e<best:best,bs=e,s
    return bs
dx=np.array([shift(P[i-1],P[i]) for i in range(1,n)],dtype=float)
t=lambda i:round((i+1)/fps,2)
med=np.median(d[d>0]) if np.any(d>0) else 0
anom=[]
# 1) images dupliquées au milieu d'un mouvement
for i in range(2,len(d)-2):
    if d[i]<0.02 and d[i-1]>0.25 and d[i+1]>0.25 and d[i-2]>0.25 and d[i+2]>0.25:
        anom.append({'t':t(i),'type':'image dupliquée','gravite':1})
# 2) micro-coupures : pic de différence > 8 x médiane et > 12 (hors fondu lent)
for i in range(1,len(d)-1):
    if d[i]>max(12,8*med) and d[i]>3*max(d[i-1],d[i+1]):
        anom.append({'t':t(i),'type':'micro-coupure / saut','gravite':2 if d[i]<30 else 3})
# 3) à-coups de caméra : le déplacement change brutalement d'une image à l'autre (accélération)
for i in range(2,len(dx)-2):
    base=np.median(dx[i-2:i+3]);
    if abs(dx[i])>=2 and abs(dx[i]-dx[i-1])>=3 and abs(dx[i]-dx[i+1])>=3 and abs(dx[i]-base)>=3:
        anom.append({'t':t(i),'type':'à-coup de déplacement ('+str(int(dx[i-1]))+'→'+str(int(dx[i]))+' px)','gravite':1})
anom.sort(key=lambda a:a['t'])
# regroupement en fenêtres de 1,5 s
win=[]
for a in anom:
    if win and a['t']-win[-1]['fin']<=1.5:win[-1]['fin']=a['t'];win[-1]['n']+=1;win[-1]['gmax']=max(win[-1]['gmax'],a['gravite']);win[-1]['types'].add(a['type'].split(' (')[0])
    else:win.append({'debut':a['t'],'fin':a['t'],'n':1,'gmax':a['gravite'],'types':{a['type'].split(' (')[0]}})
for x in win:x['types']=sorted(x['types'])
blo=[x for x in win if x['gmax']>=3 or x['n']>=4]
leg=[x for x in win if x not in blo]
niveau='BLOQUANT' if blo else ('A CORRIGER' if leg else 'CONFORME')
for x in win:
    for k,tt in enumerate([x['debut']-.15,(x['debut']+x['fin'])/2,x['fin']+.15]):
        subprocess.run(['ffmpeg','-y','-v','error','-ss',str(max(0,tt)),'-i',v,'-frames:v','1','-vf','scale=480:-1',f"{out}/suspects/t{x['debut']:07.2f}_{k}.jpg"])
res={'video':v,'fps':fps,'images':n,'niveau':niveau,'fenetres_suspectes':win,'anomalies':len(anom),
     'regle':'CONFORME : aucune anomalie ; A CORRIGER : anomalies légères isolées ; BLOQUANT : micro-coupure franche ou ≥4 anomalies dans 1,5 s'}
json.dump(res,open(out+'/fluidite.json','w'),indent=1,ensure_ascii=False)
print(json.dumps(res,indent=1,ensure_ascii=False));print('NIVEAU CAMERA :',niveau)
sys.exit({'CONFORME':0,'A CORRIGER':1,'BLOQUANT':2}[niveau])
