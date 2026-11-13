"""Extract page responsibilities, retaining stable storage IDs and existing UI markup."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
p=root/'assets/network/app.js';s=p.read_text(encoding='utf-8')
(root/'work/app-before-module-split.js').write_text(s,encoding='utf-8')

# Home and plan renderers read current state rather than retaining an import-era object.
a=s.index('  function dday()');b=s.index('  function latestPaperCard()',a)
home=s[a:b]
for name in ['dday','todayPlan','dailyCard','dashboard','renderPlan']:
    pos=home.index('{',home.index('function '+name+'('))+1
    home=home[:pos]+'\n const state=getState();\n'+home[pos:]
(root/'assets/network/home-pages.js').write_text('''/* 홈·계획 화면: 공통 학습 상태는 getState로 읽고 저장은 앱 이벤트가 담당합니다. */
(() => {"use strict";
function create({D,P,A,R,C,W,items,main,getState,heading,esc,modeName}){
'''+home+'''
return {dashboard,renderPlan};
} window.HomePages={create};})();
''',encoding='utf-8')
s=s[:a]+s[b:]

# Quiz renderers and source-aware grading form a single page controller.
a=s.index('  function latestPaperCard()');b=s.index('  // 경로 전환 전',a)
quiz=s[a:b]
quiz=quiz.replace('value = state.session','value = getState().session')
for name in ['quizLanding','startQuiz','renderQuiz','finishQuiz','renderResult','recordQuizWrong']:
    pos=quiz.index('{',quiz.index('function '+name+'('))+1
    quiz=quiz[:pos]+'\n const state=getState();\n'+quiz[pos:]
quiz=quiz.replace('navigation.go(', 'getNavigation().go(').replace('currentView === "quiz"','getView() === "quiz"').replace('coach.refresh();','onResult();')
s=s[:a]+s[b:]
a=s.index('  document.addEventListener("change", (event) => {');b=s.index('  document.addEventListener("click"',a)
change=s[a:b];body=change[change.index('{')+1:change.rfind('});')]
s=s[:a]+s[b:]
start=s.index('    if (target.id === "find-past-papers")');end=s.index('    if (target.matches(',start)
find_action=s[start:end];s=s[:start]+s[end:]
start=s.index('    if (target.dataset.start)');end=s.index('    if (target.id === "reset-progress")',start)
actions=s[start:end];s=s[:start]+s[end:]
actions=actions.replace('wrongView();','onWrongChange();')
quiz+='''
// Filters belong to this page; route aliases only choose a preset.
function filterCurrent(){paperYear="all";currentPapersOnly=true;}
function filterAll(){paperYear="all";currentPapersOnly=false;}
function handleChange(event){
'''+body+'''
}
function handleClick(target){const state=getState();
'''+find_action+actions+'''
}
function tick(){const state=getState();if(state.session?.mode!=="exam")return;const left=remaining(state.session);if(left<=0){finishQuiz(true);return;}const timer=$("#quiz-timer");if(timer){timer.textContent=timeString(left);timer.classList.toggle("urgent",left<=300);}}
'''
exports=['renderQuiz','quizLanding','startQuiz','modeName','paperNote','questionFigures','recordQuizWrong','handleClick','handleChange','filterCurrent','filterAll','tick']
(root/'assets/network/quiz-page.js').write_text('''/* 기출/자체 문제풀이 컨트롤러: 회차 필터·답안·채점·오답 연결. 저장 스키마는 core가 검증합니다. */
(() => {"use strict";
function create({B,P,A,Q,C,R,W,main,getState,getNavigation,getView,persist,toast,heading,empty,esc,$,confirmAction,onResult,onWrongChange}){
let paperYear=String(A.years[0]),currentPapersOnly=false;
'''+quiz+'\nreturn {'+','.join(exports)+'};\n} window.QuizPage={create};})();\n',encoding='utf-8')
s=s.replace('  let navigation,\n    paperYear = String(A.years[0]),\n    currentPapersOnly = false;','  let navigation;')
s=s.replace('      paperYear = "all";\n      currentPapersOnly = true;','      quizPage.filterCurrent();')
s=s.replace('      paperYear = "all";\n      currentPapersOnly = false;','      quizPage.filterAll();')

# Settings own only their dialog, backup and import flows; reset is a callback.
a=s.index('  function openSettings()');b=s.index('  async function copyCommand',a)
settings=s[a:b].replace('$("#exam-date").value = state.examDate','$("#exam-date").value = getState().examDate')
s=s[:a]+s[b:]
a=s.index('    if (target.matches("[data-settings],#settings-button"))');b=s.index('    if (target.dataset.filter',a)
settings_actions=s[a:b];s=s[:a]+s[b:]
a=s.index('    if (target.id === "reset-progress")');b=s.index('\n  });',a)
settings_actions+=s[a:b];s=s[:a]+s[b:]
settings_actions=settings_actions.replace('          state = C.cleanState({}, D, Q);\n          coach.reset();\n          persist();','          onReset();').replace('...state, gameProgress:', '...getState(), gameProgress:')
a=s.index('    if (event.target.id === "settings-form")');b=s.index('    if (event.target.id === "subnet-form")',a)
settings_submit=s[a:b].replace('      state.examDate', '      const state=getState();\n      state.examDate').replace('["dashboard", "plan"].includes(currentView)','["dashboard", "plan"].includes(getView())')
s=s[:a]+s[b:]
a=s.index('  $("#import-progress").addEventListener(');b=s.index('  navigation = ',a)
import_event=s[a:b].replace('          state = imported;','          setState(imported);')
s=s[:a]+s[b:]
(root/'assets/network/settings-controller.js').write_text('''/* 설정과 기록 백업/복원. DOM은 공통 다이얼로그, 데이터 검증은 core/게임 모듈에 위임합니다. */
(() => {"use strict";
function create({C,D,Q,R,$,getState,setState,getView,persist,route,toast,onReset}){
'''+settings+'''
function handleClick(target){
'''+settings_actions+'''
}
function handleSubmit(event){
'''+settings_submit+'''
}
'''+import_event+'''
return {openSettings,confirmAction,handleClick,handleSubmit};
} window.SettingsController={create};})();
''',encoding='utf-8')

# App remains the stable owner of global listeners; delegates page-specific events.
s=s.replace('    if (notebookPage.handle(target)) return;', '    if (notebookPage.handle(target)) return;\n    quizPage.handleClick(target);\n    settings.handleClick(target);')
s=s.replace('  document.addEventListener("submit", (event) => {','  document.addEventListener("change", event=>quizPage.handleChange(event));\n  document.addEventListener("submit", (event) => {\n    settings.handleSubmit(event);')
a=s.index('  setInterval(() => {\n    if (state.session?.mode');b=s.index('  const coach = ',a)
s=s[:a]+'  setInterval(()=>quizPage.tick(),1000);\n'+s[b:]
needle='  // 가져오기·초기화 후에도 페이지는 getState로 최신 상태를 읽습니다.'
initialization='''  const settings=window.SettingsController.create({C,D,Q,R,$,getState:()=>state,setState:next=>{state=next;},getView:()=>currentView,persist,route,toast,onReset:()=>{state=C.cleanState({},D,Q);coach.reset();persist();}});
  const {openSettings,confirmAction}=settings;
  const quizPage=window.QuizPage.create({B,P,A,Q,C,R,W,main,getState:()=>state,getNavigation:()=>navigation,getView:()=>currentView,persist,toast,heading,empty,esc,$,confirmAction,onResult:()=>coach.refresh(),onWrongChange:()=>wrongView()});
  const {renderQuiz,quizLanding,startQuiz,modeName,paperNote,questionFigures,recordQuizWrong}=quizPage;
  const {dashboard,renderPlan}=window.HomePages.create({D,P,A,R,C,W,items,main,getState:()=>state,heading,esc,modeName});
'''
s=s.replace(needle,initialization+needle)
p.write_text(s,encoding='utf-8')

names=['home-pages.js','quiz-page.js','settings-controller.js']
p=root/'index.html';t=p.read_text(encoding='utf-8');t=t.replace('  <script defer src="assets/network/app.js">',''.join('  <script defer src="assets/network/'+n+'"></script>\n' for n in names)+'  <script defer src="assets/network/app.js">').replace('합격루틴 v19','합격루틴 v20');p.write_text(t,encoding='utf-8')
p=root/'sw.js';t=p.read_text(encoding='utf-8').replace("'assets/network/app.js',","'assets/network/app.js',"+','.join("'assets/network/"+n+"'" for n in names)+',').replace('network-notes-pwa-v19','network-notes-pwa-v20');p.write_text(t,encoding='utf-8')
print('Extracted home, quiz and settings modules')
