"""Split at top-level feature boundaries without changing a byte of cascade order."""
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1]
base=root/'assets/network';dest=base/'css';dest.mkdir(exist_ok=True)
groups=[('styles.css',[
 ('foundation.css',None),
 ('reference.css','.toolbar {'),
 ('assessment.css','.quiz-modes {'),
 ('progress-dialogs.css','.plan-header {'),
 ('responsive.css','@media (min-width: 1500px)'),
 ('study-layout.css','/* 시험 집중 레이아웃:'),
 ('keyword-examples.css','/* 키워드별 출제 형태 예시:'),
 ('materials.css','/* 시험 자료 보관·드래그 앤드 드롭 */'),
 ('latest-paper.css','.latest-paper {'),
]),('mobile.css',[
 ('daily-pwa.css',None),
 ('navigation-layout.css','/* 한 손으로 누르기 편한,'),
 ('keyword-disclosure.css','/* Compact disclosure on the right,'),
 ('paper-library.css','.paper-library-heading {'),
])]
manifest=[]
index=(root/'index.html').read_text(encoding='utf-8')
worker=(root/'sw.js').read_text(encoding='utf-8')
for old,parts in groups:
 text=(base/old).read_text(encoding='utf-8')
 (root/'work'/('before-split-'+old)).write_text(text,encoding='utf-8')
 offsets=[0]+[text.index(anchor) for _,anchor in parts[1:]]+[len(text)]
 assert offsets==sorted(offsets)
 files=[]
 for i,(name,_) in enumerate(parts):
  chunk=text[offsets[i]:offsets[i+1]]
  (dest/name).write_text(chunk,encoding='utf-8');files.append('assets/network/css/'+name)
 combined=''.join((root/f).read_text(encoding='utf-8') for f in files)
 assert combined==text, old
 manifest.append({'entry':old,'files':files,'originalSha256':hashlib.sha256(text.encode()).hexdigest(),'exactCascadePreserved':True})
 # Keep a compatibility entry, while index loads modules explicitly for predictable discovery.
 (base/old).write_text('/* 호환 진입점. 실제 페이지는 index.html에서 동일 순서의 모듈 CSS를 로드합니다. */\n'+''.join('@import url("css/'+Path(f).name+'");\n' for f in files),encoding='utf-8')
 index=index.replace('  <link rel="stylesheet" href="assets/network/'+old+'">','\n'.join('  <link rel="stylesheet" href="'+f+'">' for f in files))
 worker=worker.replace("'assets/network/"+old+"',","'assets/network/"+old+"',"+','.join("'"+f+"'" for f in files)+',')
(root/'index.html').write_text(index,encoding='utf-8')
(root/'sw.js').write_text(worker,encoding='utf-8')
(root/'audits/css-module-split.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Split',sum(len(g['files']) for g in manifest),'CSS modules; original cascade is byte-identical')
