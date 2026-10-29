from pathlib import Path
p=Path('scripts/build-study-data.py')
s=p.read_text(encoding='utf-8-sig')
needle="data={'keywords':keywords"
insert="""example_rows=json.loads((ROOT/'assets/network/keyword-examples.json').read_text(encoding='utf-8-sig'))
example_map={example['keyword']:example for example in example_rows}
if len(example_map)!=len(example_rows):
    raise ValueError('Duplicate keyword example')
for keyword in keywords:
    if keyword['answer'] not in example_map:
        raise ValueError('Missing example: '+keyword['answer'])
    keyword['example']={key:value for key,value in example_map[keyword['answer']].items() if key!='keyword'}
"""
assert needle in s
s=s.replace(needle,insert+needle)
p.write_text(s,encoding='utf-8')
p=Path('assets/network/app.js');s=p.read_text(encoding='utf-8-sig')
s=s.replace("'KEYWORD FLASHCARDS':'단서를 읽고 정답을 떠올려 보세요.'","'KEYWORD FLASHCARDS':'단서를 암기하고, 문제 예시에서 어떻게 쓰이는지 확인하세요.'")
s=s.replace("function keywordResults(){", """function keywordExample(k){
 const e=k.example;if(!e)return '';
 return `<details class="keyword-example" data-example="${k.id}"><summary>문제 예시 <span>보기 4개</span></summary><div class="example-body"><div class="example-label">출제 형태를 참고한 자체 변형 예시</div><p class="example-question">${esc(e.question)}</p><ol class="example-options">${e.options.map((option,i)=>`<li><span>${i+1}</span>${esc(option)}</li>`).join('')}</ol><details class="example-solution" data-solution="${k.id}"><summary>정답 · 판별 근거</summary><div class="example-feedback"><strong>정답 ${e.answer+1}번 · ${esc(e.options[e.answer])}</strong><div class="example-clues">${e.clues.map(clue=>`<mark>${esc(clue)}</mark>`).join('')}</div><p>${esc(e.explanation)}</p><p class="example-trap"><b>구별할 점</b> ${esc(e.trap)}</p></div></details></div></details>`;
}
function keywordResults(){""")
s=s.replace("&&[k.cue,k.answer,k.hint].some(t=>t.toLowerCase().includes(query.toLowerCase())));$('#keyword-results').innerHTML", "&&[k.cue,k.answer,k.hint,k.example?.question||'',...(k.example?.options||[])].some(t=>t.toLowerCase().includes(query.toLowerCase())));const openExamples=new Set(Array.from(document.querySelectorAll('[data-example][open]'),e=>e.dataset.example)),openSolutions=new Set(Array.from(document.querySelectorAll('[data-solution][open]'),e=>e.dataset.solution));$('#keyword-results').innerHTML")
s=s.replace('<p>${esc(k.hint)}</p><div class="flash-actions">','<p>${esc(k.hint)}</p>${keywordExample(k)}<div class="flash-actions">')
needle="+(matches.length?'':empty('해당하는 카드가 없어요.','검색어나 필터를 바꿔 보세요.'));}"
replacement="+(matches.length?'':empty('해당하는 카드가 없어요.','검색어나 필터를 바꿔 보세요.'));document.querySelectorAll('[data-example]').forEach(e=>{e.open=openExamples.has(e.dataset.example);});document.querySelectorAll('[data-solution]').forEach(e=>{e.open=openSolutions.has(e.dataset.solution);});}"
assert needle in s
s=s.replace(needle,replacement)
p.write_text(s,encoding='utf-8')
