"""Move existing renderers without changing their HTML or shared state ownership."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'assets/network/app.js';s=p.read_text(encoding='utf-8')
start=s.index('function searchBar(');end=s.index('function renderPlan()',start)
reference=s[start:end]
for name in ['keywords','keywordResults','commands','commandResults','theory']:
    marker='function '+name+'('
    pos=reference.index('{',reference.index(marker))+1
    reference=reference[:pos]+'\n const state=getState(); const {filter,query,onlyUnlearned}=getUI();\n'+reference[pos:]
pos=reference.index('{',reference.index('function searchBar('))+1
reference=reference[:pos]+'\n const {filter,query}=getUI();\n'+reference[pos:]
reference='''/* 閲覧ページ: shared state is read through getters so imports/resets stay current. */
(() => {
 'use strict';
 function create({D,getState,getUI,main,heading,empty,$,esc}){
 // 키워드: 공개/예시/암기 상태와 masonry 재배치를 함께 갱신합니다.
'''+reference+'''
 return {keywords,keywordResults,commands,commandResults,theory};
 }
 window.ReferencePages={create};
})();
'''
reference=reference.replace('/* 閲覧ページ:', '/* 참고 학습 화면:')
(root/'assets/network/reference-pages.js').write_text(reference,encoding='utf-8')
s=s[:start]+s[end:]
start=s.index('function wrongView(){');end=s.index('\nfunction route()',start)
wrong=s[start:end]
wrong=wrong.replace('function wrongView(){','function render(){\n const state=getState();')
handlers_start=s.index(' if(target.dataset.notebookFilter)');handlers_end=s.index(' if(target.dataset.memory)',handlers_start)
handlers=s[handlers_start:handlers_end].replace('wrongView()','render()').replace('return;}','return true;}')
wrong='''/* 기능별 오답 화면. 저장 규칙은 WrongNotebook, 화면/사용자 입력은 이 모듈이 담당합니다. */
(() => {
 'use strict';
 function create({getState,W,D,items,main,heading,empty,paperNote,questionFigures,esc,persist,toast}){
 let wrongSource='all';
'''+wrong+'''
 function handle(target){
 const state=getState();
'''+handlers+'''
 return false;
 }
 return {render,handle};
 }
 window.WrongNotebookPage={create};
})();
'''
(root/'assets/network/wrong-notebook-page.js').write_text(wrong,encoding='utf-8')
s=s[:start]+s[end:]
a=s.index(' if(target.dataset.notebookFilter)');b=s.index(' if(target.dataset.memory)',a)
s=s[:a]+' if(notebookPage.handle(target))return;\n'+s[b:]
s=s.replace("let wrongSource='all';\n",'')
s=s.replace("function bestScore(){return state.records.length?Math.max(...state.records.map(r=>r.score)):null;}\n",'')
needle='updateBadges();updateStorage();navigation.init();'
s=s.replace(needle,'''// Page renderers read the latest state via getState after reset/import.
const {keywords,keywordResults,commands,commandResults,theory}=window.ReferencePages.create({D,getState:()=>state,getUI:()=>({filter,query,onlyUnlearned}),main,heading,empty,$,esc});
const notebookPage=window.WrongNotebookPage.create({getState:()=>state,W,D,items,main,heading,empty,paperNote,questionFigures,esc,persist,toast});
const wrongView=()=>notebookPage.render();
'''+needle)
p.write_text(s,encoding='utf-8')
for filename in ['index.html','sw.js']:
 p=root/filename;t=p.read_text(encoding='utf-8')
 if filename=='index.html':t=t.replace('<script defer src="assets/network/app.js">','<script defer src="assets/network/reference-pages.js"></script>\n  <script defer src="assets/network/wrong-notebook-page.js"></script>\n  <script defer src="assets/network/app.js">').replace('합격루틴 v18','합격루틴 v19')
 else:t=t.replace("'assets/network/app.js',","'assets/network/app.js','assets/network/reference-pages.js','assets/network/wrong-notebook-page.js',").replace('network-notes-pwa-v18','network-notes-pwa-v19')
 p.write_text(t,encoding='utf-8')
