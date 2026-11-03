#!/usr/bin/env python3
"""Contrôle vidéo : durée, résolution, images noires/figées, planche-contact. Usage: qc_video.py video.mp4 [dossier_sortie]"""
import subprocess,sys,json,os,re
v=sys.argv[1];out=sys.argv[2] if len(sys.argv)>2 else os.path.splitext(v)[0]+'_qc';os.makedirs(out,exist_ok=True)
pr=json.loads(subprocess.run(['ffprobe','-v','error','-show_entries','stream=width,height,duration,r_frame_rate','-of','json',v],capture_output=True,text=True).stdout)
st=[s for s in pr['streams'] if 'width' in s][0];dur=float(st.get('duration') or subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',v],capture_output=True,text=True).stdout)
res={'resolution':f"{st['width']}x{st['height']}",'duree_s':round(dur,1),'duree_ok':210<=dur<=420}
bl=subprocess.run(['ffmpeg','-nostats','-i',v,'-vf','blackdetect=d=0.3:pix_th=0.05','-an','-f','null','-'],capture_output=True,text=True).stderr
res['noir']=re.findall(r'black_start:([\d.]+) black_end:([\d.]+)',bl)
fr=subprocess.run(['ffmpeg','-nostats','-i',v,'-vf','freezedetect=n=0.001:d=4','-an','-f','null','-'],capture_output=True,text=True).stderr
res['figes_>4s']=re.findall(r'freeze_start: ([\d.]+)',fr)
subprocess.run(['ffmpeg','-y','-v','error','-i',v,'-vf',"fps=1/3,scale=320:-1,tile=6x0:padding=4",'-frames:v','1',out+'/planche_contact.jpg'])
subprocess.run(['ffmpeg','-y','-v','error','-i',v,'-vf',"fps=1/3,scale=480:-1",out+'/f_%03d.jpg'])
res['planche']=out+'/planche_contact.jpg'
print(json.dumps(res,indent=1,ensure_ascii=False))
