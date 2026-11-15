from pathlib import Path
import re, os, json
root=Path.cwd()
groups={
'data':['study-data.js','questions.js','latest-paper.js','past-papers.js','paper-archive.js','keyword-examples.json','public-materials.js'],
'domain':['core.js','review-core.js','wrong-notebook.js'],
'pages':['daily-study.js','keyword-game.js','materials-page.js','reference-pages.js','wrong-notebook-page.js','home-pages.js','quiz-page.js'],
'platform':['settings-controller.js','themes.js','pwa.js','materials-store.js','navigation.js'],
'ui':['keyword-layout.js','feature-helper.js','study-coach.js'],
'icons':['favicon.svg','icon-192.png','icon-512.png','icon-maskable.png'],
'css':['feature-helper.css','study-coach.css','home.css','keyword-game.css','themes.css']}
moves={f'assets/network/{name}':f'assets/network/{folder}/{name}' for folder,names in groups.items() for name in names}
moves.update({'SITE-GUIDE.md':'docs/guides/site-guide.md','PWA-GUIDE.md':'docs/history/pwa-2026-11-03.md','UI-AUDIT.md':'docs/history/ui-audit.md','FEATURE-COVERAGE.md':'docs/history/feature-coverage.md','STUDY-PLAN-7-DAYS.md':'docs/study/study-plan-7-days.md','README.md':'docs/study/exam-guide.md','네트워크 관리사 2급 학습 가이드.show':'materials/source/네트워크 관리사 2급 학습 가이드.show'})
# Markdown relative links resolve from their original location, then follow the move map.
for folder in ['docs','scripts','assets/network']:
 for p in (root/folder).rglob('*'):
  if p.is_file() and p.suffix in ['.md','.js','.cjs','.py','.json','.css']:
   pass
files=[p for folder in ['docs','scripts','assets/network'] for p in (root/folder).rglob('*') if p.is_file() and p.suffix in ['.md','.js','.cjs','.py','.json','.css']]
files += [root/n for n in ['README.md','SITE-GUIDE.md','PWA-GUIDE.md','UI-AUDIT.md','FEATURE-COVERAGE.md','STUDY-PLAN-7-DAYS.md','AGENTS.md','index.html','sw.js','manifest.webmanifest','.prettierignore']]
for p in files:
 rel=p.relative_to(root).as_posix();s=p.read_text(encoding='utf-8-sig')
 if p.suffix=='.md':
  newrel=moves.get(rel,rel)
  def link(m):
   target=m[2]
   if re.match(r'\w+:|#|/',target):return m[0]
   clean,sep,anchor=target.partition('#')
   oldtarget=os.path.normpath(os.path.join(os.path.dirname(rel),clean)).replace('\\','/')
   newtarget=moves.get(oldtarget,oldtarget)
   target=os.path.relpath(newtarget,os.path.dirname(newrel) or '.').replace('\\','/')+(sep+anchor if sep else '')
   return m[1]+target+m[3]
  s=re.sub(r'(\]\()([^\s)]+)(\))',link,s)
 # bare module references and source paths; do not rewrite relative markdown links twice
 for old,new in sorted(moves.items(),key=lambda x:-len(x[0])):
  if old.startswith('assets/'):
   s=s.replace(old,new)
   if old.endswith('.js'):
    s=s.replace(old[:-3]+"'",new[:-3]+"'").replace(old[:-3]+'"',new[:-3]+'"')
  elif p.suffix!='.md' and old!='README.md':s=s.replace(old,new)
 if rel=='scripts/build-study-data.py':s=s.replace("ROOT / 'README.md'","ROOT / 'docs/study/exam-guide.md'").replace('README.md의 학습','docs/study/exam-guide.md의 학습')
 if rel=='scripts/audit-exam-coverage.cjs':s=s.replace("'README.md'","'docs/study/exam-guide.md'")
 p.write_text(s,encoding='utf-8')
for old,new in moves.items():
 src=root/old;dest=root/new;dest.parent.mkdir(parents=True,exist_ok=True)
 if dest.exists():raise RuntimeError('destination exists '+new)
 src.rename(dest)
# Test paths retain the same depth from the project root.
(root/'tests').mkdir(exist_ok=True)
for p in (root/'scripts').glob('test-*.cjs'):p.rename(root/'tests'/p.name)
(root/'audits/structure-migration-2026-11-13.json').write_text(json.dumps(moves,ensure_ascii=False,indent=2),encoding='utf-8')
# A moved PWA bootstrap is now three levels below the worker.
p=root/'assets/network/platform/pwa.js';s=p.read_text(encoding='utf-8').replace('../../sw.js','../../../sw.js');p.write_text(s,encoding='utf-8')
# The icon builder writes into the new icon directory.
p=root/'scripts/create-app-icons.py';s=p.read_text(encoding='utf-8').replace("/'assets/network'","/'assets/network/icons'");p.write_text(s,encoding='utf-8')
