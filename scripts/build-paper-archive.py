"""Extract original questions, marked answers and diagram images from source PDFs.
Run with the bundled Python runtime (pypdf, pdfplumber, pypdfium2).
No OCR or generated answer keys are used.
"""
from pathlib import Path
import re,json,hashlib
from pypdf import PdfReader
import pdfplumber

ROOT=Path(__file__).resolve().parents[1]
MARKS='①②③④❶❷❸❹'
def tidy(s):
 return re.sub(r'\s+',' ',s).strip()
def build(row):
 m=re.search(r'(\d{4})년 (\d{2})월 (\d{2})일\((\d)회\)',row['title']);year,month,day,round_=m.groups();date=year+month+day
 source=ROOT/f'materials/papers/network-{date}-teacher.pdf'
 if not source.exists():source=ROOT/f'materials/papers/network-{date}-student.pdf'
 if not source.exists():return None
 teacher=source.name.endswith('-teacher.pdf')
 reader=PdfReader(source)
 pages=[]
 for page in reader.pages:
  text=page.extract_text()
  text=re.sub(r'네트워크관리사 2급\s*◐.*?www\.comcbt\.com','',text)
  text=re.sub(r'최강 자격증 기출문제 전자문제집 CBT\s*:\s*www\.comcbt\.com','',text)
  text=re.sub(r'\d과목\s*:\s*(?:네트워크 운용기기|네트워크 일반|TCP/IP|NOS)' ,'',text)
  pages.append(text)
 tail=re.sub(r'\s+','',pages[-1]);table=tail[tail.rfind('12345678910'):]
 table_answers=re.findall('[①②③④]',table)
 assert len(table_answers)==50,(date,'answer table',len(table_answers))
 text='\n'.join(pages)
 # Ignore the repeated promotion and the separate answer table at the end.
 text=text.split('전자문제집 CBT 홈페이지')[0]
 starts=[];offset=0
 for n in range(1,51):
  match=re.search(str(n)+r'\.\s',text[offset:])
  if not match:raise ValueError((date,'missing number',n))
  start=offset+match.start();offset=offset+match.end();starts.append((start,offset))
 questions=[]
 pid=f'nw2-{year}-{int(round_):02d}'
 for i,(start,body_start) in enumerate(starts):
  body=text[body_start:starts[i+1][0] if i<49 else len(text)]
  markers=list(re.finditer('['+MARKS+']',body))
  if len(markers)!=4:raise ValueError((date,i+1,'option count',len(markers),body[-100:]))
  assert [MARKS.index(x[0])%4 for x in markers]==list(range(4)),(date,i+1,'order')
  answers=[j for j,x in enumerate(markers) if x[0] in '❶❷❸❹']
  assert len(answers)==(1 if teacher else 0),(date,i+1,'answer',answers)
  table_answer=MARKS.index(table_answers[i]);answer=answers[0] if teacher else table_answer
  assert answer==table_answer,(date,i+1,'answer mismatch')
  options=[tidy(body[x.end():markers[j+1].start() if j<3 else len(body)]) for j,x in enumerate(markers)]
  questions.append(dict(id=f'{pid}-{i+1:02d}',number=i+1,paperId=pid,category='TCP/IP' if i<17 else '네트워크 일반' if i<27 else 'NOS' if i<45 else '네트워크 운용기기',question=tidy(body[:markers[0].start()]),options=options,answer=answer,explanation=f'COMCBT 문제지의 정답표 기준: {answer+1}번. 별도 상세 해설은 원문 자료실을 참고하세요.',images=[]))
 # Embedded diagrams are attached by their position in the two-column paper.
 image_audit=[]
 with pdfplumber.open(source) as pdf:
  last_by_col={0:None,1:None}
  for pnum,page in enumerate(pdf.pages):
   words=page.extract_words()
   starts_by_col={0:[],1:[]}
   for w in words:
    if re.fullmatch(r'\d{1,2}\.',w['text']) and (w['x0']<30 or abs(w['x0']-page.width/2)<15):
     n=int(w['text'][:-1])
     if 1<=n<=50:starts_by_col[int(w['x0']>page.width/2)].append((w['top'],n))
   for col in [0,1]:
    starts_by_col[col].sort()
    for im in page.images:
     if int(im['x0']>page.width/2)!=col:continue
     preceding=[(y,n) for y,n in starts_by_col[col] if y<im['top']]
     # A question may continue from the preceding column or preceding page.
     n=preceding[-1][1] if preceding else (last_by_col[0] if col==1 else last_by_col[1])
     if n is None:raise ValueError((date,pnum,'unmapped diagram'))
     raw=reader.pages[pnum].images['/'+im['name']].image
     dest=ROOT/f'assets/network/papers/{date}-{n:02d}-{len(questions[n-1]["images"])+1}.png';dest.parent.mkdir(parents=True,exist_ok=True);raw.save(dest)
     rel=dest.relative_to(ROOT).as_posix();questions[n-1]['images'].append(rel)
     image_audit.append(dict(number=n,page=pnum+1,path=rel,top=im['top']))
    if starts_by_col[col]:last_by_col[col]=starts_by_col[col][-1][1]
 # Independent check: the final answer table must match all inline markers.
 tail=re.sub(r'\s+','',pages[-1]);table=tail[tail.rfind('12345678910'):]
 table_answers=re.findall('[①②③④]',table)
 assert len(table_answers)==50,(date,'answer table',len(table_answers))
 assert [MARKS.index(c) for c in table_answers]==[q['answer'] for q in questions],(date,'answer mismatch')
 return dict(id=pid,title=f'{year}년 {int(round_)}회 네트워크관리사 2급 필기',year=int(year),round=int(round_),date=f'{year}-{month}-{day}',source=row['url'].split('?')[0],sourceName='COMCBT',answerStatus='COMCBT 정답표 기준 · 상세 해설 별도',previousStandard=f'{year}-{month}-{day}'<'2025-08-01',pendingNumbers=[],original=source.relative_to(ROOT).as_posix(),questions=questions),dict(date=date,sha256=hashlib.sha256(source.read_bytes()).hexdigest(),sourceFile=source.relative_to(ROOT).as_posix(),inlineAnswersMatched=teacher,questions=len(questions),answerTableMatched=True,diagrams=image_audit)

if __name__=='__main__':
 rows=json.loads((ROOT/'materials/papers/catalog.json').read_text(encoding='utf-8'))
 papers=[];audits=[];pending=[]
 for row in rows:
  result=build(row)
  if result:
   paper,audit=result;papers.append(paper);audits.append(audit);print(paper['id'],len(paper['questions']),len(audit['diagrams']))
  else:pending.append(row)
 (ROOT/'assets/network/past-papers.js').write_text('/* Source: COMCBT public teacher PDFs. Generated by scripts/build-paper-archive.py. */\nwindow.PAST_PAPERS = '+json.dumps(papers,ensure_ascii=False,indent=2)+';\nwindow.PENDING_PAPERS = '+json.dumps(pending,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
 (ROOT/'audits/paper-import.json').write_text(json.dumps(audits,ensure_ascii=False,indent=2),encoding='utf-8')

 assets=['assets/network/past-papers.js','assets/network/paper-archive.js']+[p['original'] for p in papers]+[im for p in papers for q in p['questions'] for im in q['images']]
 sw=ROOT/'sw.js';worker=sw.read_text(encoding='utf-8')
 block='/* PAPER_ASSETS_START */\nconst PAPER_FILES='+json.dumps(assets,ensure_ascii=False)+';\n/* PAPER_ASSETS_END */'
 if '/* PAPER_ASSETS_START */' in worker:worker=re.sub(r'/\* PAPER_ASSETS_START \*/.*?/\* PAPER_ASSETS_END \*/',lambda m:block,worker,flags=re.S)
 else:worker=worker.replace("const BASE=",block+'\nconst BASE=')
 worker=worker.replace("'materials/files/network-2026-04-a.hwp'];","'materials/files/network-2026-04-a.hwp',...PAPER_FILES];")
 sw.write_text(worker,encoding='utf-8')
