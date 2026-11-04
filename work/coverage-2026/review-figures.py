import json,pathlib
from PIL import Image,ImageDraw,ImageFont
r=pathlib.Path(__file__).resolve().parents[2];h=pathlib.Path(__file__).parent
s=json.loads((h/'sources.json').read_text(encoding='utf-8'));a=json.loads((r/'audits/2026-feature-combinations.json').read_text(encoding='utf-8'))
ids={i for q in a['rows'] for i in q['features']['F']['sources']}
qs=[q for p in s['prior'] for q in p['questions'] if q['id'] in ids and q.get('images')]
font=ImageFont.truetype('C:/Windows/Fonts/malgun.ttf',17)
for start in range(0,len(qs),10):
    canvas=Image.new('RGB',(1400,2000),'#eee');d=ImageDraw.Draw(canvas)
    for j,q in enumerate(qs[start:start+10]):
        x=(j%2)*700;y=(j//2)*400;d.text((x+10,y+5),q['id'],font=font,fill='black')
        im=Image.open(r/q['images'][0]).convert('RGB');im.thumbnail((680,360));canvas.paste(im,(x+10,y+35))
    canvas.save(h/f'prior-figures-{start//10+1}.png')
print(len(qs))
