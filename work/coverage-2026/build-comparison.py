"""Conservative, manually selected source coverage; not simulated exam scores."""
import json, pathlib, itertools, csv, hashlib
ROOT=pathlib.Path(__file__).resolve().parents[2]
HERE=pathlib.Path(__file__).resolve().parent
s=json.loads((HERE/'sources.json').read_text(encoding='utf-8'))
old=json.loads((ROOT/'audits/exam-2026-04-coverage.json').read_text(encoding='utf-8'))
def nums(x): return [int(n) for n in x.split()]
def pairs(x): return {int(t.split(':')[0]):t.split(':')[1].split(',') for t in x.split()}
G=[pairs('6:k25 7:k11 12:k16 14:k0 16:k6 18:k40 21:k45 27:k49 39:k50 40:k9 46:k18 47:k38 48:k3 49:k25,k26 50:k19'),
   pairs('2:k12 7:k6 16:k14 25:k3 37:k9 39:k50 41:k38 46:k35 47:k34 48:k27 50:k32'),
   pairs('19:k43 20:k28 21:k20 25:k40 26:k29 28:k8 46:k25 50:k33')]
Q=[pairs('3:q16,q19 7:q6 8:q7 11:q14 13:q26 14:q1 16:q31 18:q71 27:q62 31:q56 34:q50 40:q4 41:q46 46:q35 47:q44 49:q45'),
   pairs('1:q33 4:q20 5:q29 7:q31 11:q7 17:q11 26:q58,q59 30:q52 32:q25 33:q49 35:q53 36:q21 37:q4 41:q44 46:q41'),
   pairs('6:q27 7:q32 11:q24 12:q33 19:q60 20:q39 21:q36 22:q68 25:q71 26:q40 28:q2 29:q65 31:q55 33:q54 34:q49 35:q47 37:q64 46:q35,q45 48:q58 50:q70')]
T=[nums('3 4 6 7 8 11 12 13 14 15 16 17 18 19 20 21 25 27 29 31 34 35 37 38 39 40 41 42 44 46 47 48 49 50'),
   nums('1 2 3 4 5 7 9 10 11 14 15 16 17 18 19 22 25 26 28 30 31 32 33 35 36 37 38 39 41 42 43 46 47 48 50'),
   nums('6 7 9 11 12 15 18 19 20 21 22 23 24 25 26 27 28 29 30 31 33 34 35 37 39 40 42 43 44 46 48 49 50')]
for key,dest in [('game',G),('practice',Q)]:
    dest.append({r['number']:[e['id'] for e in r['features'][key]['evidence']] for r in old['rows'] if r['features'][key]['status']=='D'})
T.append([r['number'] for r in old['rows'] if r['features']['theory']['status']=='D'])
# Explicit prior-paper references. IDs are source questions, never 2026 targets.
F=[pairs('1:2024-04-17 3:2024-04-15 4:2023-02-12 5:2024-01-17 6:2023-04-15 7:2025-02-30,2025-03-39 8:2022-02-14 9:2023-02-14 10:2025-04-07 11:2025-01-12 12:2025-04-01 13:2025-03-11 14:2024-01-10 16:2025-04-16 17:2025-02-05 18:2025-02-20 19:2024-02-22 20:2025-04-18 21:2025-02-18 22:2025-01-18 23:2025-03-25 24:2024-04-26 27:2023-01-18 30:2024-02-40 31:2025-01-40 32:2025-03-28 33:2025-04-29 34:2024-04-39 35:2023-02-35 36:2023-04-29 37:2025-01-33 38:2023-02-44 39:2025-02-28 40:2024-04-29 41:2023-01-45 42:2024-04-36 44:2025-04-11,2025-02-30 46:2025-01-46 47:2025-03-45 48:2024-02-47'),
   pairs('1:2024-04-01 2:2025-04-11 3:2025-01-02 4:2023-02-04 5:2025-01-04 6:2024-02-04 7:2024-04-07 8:2025-03-09 9:2025-01-10 10:2023-01-11 11:2023-01-10 12:2025-03-14 13:2025-04-15 14:2025-02-10 17:2024-02-16 18:2025-01-19 19:2024-01-24 20:2025-02-22 21:2023-01-21 22:2023-04-20 23:2025-01-23 24:2025-01-26 25:2025-03-10 28:2025-03-35 29:2025-02-38 30:2025-04-31 31:2025-04-40 32:2025-01-35 33:2025-03-40 34:2024-01-31 35:2023-04-43 36:2024-01-36 37:2023-02-28 38:2023-04-45 39:2024-01-34 40:2025-03-29 41:2025-03-45 43:2025-03-38,2025-03-34 46:2024-01-46 47:2025-01-48 48:2025-02-49'),
   pairs('1:2023-01-01 2:2025-03-07 3:2024-01-06 4:2024-04-04 5:2025-01-05 6:2025-01-06 7:2025-01-07 8:2025-01-08 9:2023-02-11 10:2022-04-08 11:2024-04-10 12:2025-01-11 13:2025-02-01 18:2022-04-24 19:2025-03-24 20:2025-02-24 21:2025-04-24 23:2023-02-25 24:2025-04-22 25:2025-01-20 26:2025-03-18,2024-04-21 28:2025-04-33 29:2023-01-32 30:2024-04-31 31:2025-02-29 32:2025-01-44 33:2025-01-34 34:2023-04-38 35:2023-04-37 36:2025-03-34 37:2022-02-42 38:2022-03-31 39:2025-01-39 40:2025-04-36 44:2024-04-14 46:2025-03-50 47:2025-02-50 48:2024-04-47 50:2025-03-48'),
   pairs('1:2024-04-14 2:2023-01-17 3:2025-01-14 5:2025-04-02 6:2025-03-16 8:2024-02-47 9:2024-02-05 11:2025-02-17 12:2023-04-17 13:2025-02-02 14:2025-02-12 16:2025-01-29 18:2025-01-22 19:2023-01-18 20:2025-03-24 21:2025-01-20 22:2024-04-22 23:2024-04-21 24:2024-04-24 28:2025-02-37 29:2023-01-38 30:2025-03-43 31:2025-01-38 32:2025-02-33 33:2025-03-37 40:2025-02-35 42:2025-04-30 43:2025-02-36 44:2023-02-39 46:2025-03-48 47:2023-04-47 48:2025-04-24')]
F=[{n:['nw2-'+x for x in ids] for n,ids in m.items()} for m in F]
lookup={q['id']:q for p in s['prior'] for q in p['questions']}
for m in F:
    for ids in m.values():
        for i in ids: assert i in lookup, i
assert len(lookup)==650 and all('2026' not in i for i in lookup)
# Full keyword examples appear in daily learning; the game only shows cue/answer/hint.
Kextra=[{},pairs('43:k30 49:k25'),pairs('16:k4'),{}]
features={'D':'오늘의 학습','G':'산성비','T':'핵심정리','Q':'자체 문제풀이','F':'기출문제'}
rows=[]
for ri,p in enumerate(s['papers']):
    for q in p['questions']:
        n=q['number']; evidence={}
        for f,m in [('G',G[ri]),('Q',Q[ri]),('F',F[ri])]:
            evidence[f]={'supported':n in m,'sources':m.get(n,[])}
        evidence['T']={'supported':n in T[ri],'sources':['README.md'] if n in T[ri] else []}
        daily=any(evidence[f]['supported'] for f in ['G','Q','F']) or n in Kextra[ri]
        evidence['D']={'supported':daily,'sources':[f for f in ['G','Q','F'] if evidence[f]['supported']]+Kextra[ri].get(n,[])}
        rows.append({'id':q['id'],'round':ri+1,'number':n,'question':q['question'],'referenceAnswer':q['answer']+1,'answerText':q['options'][q['answer']],'features':evidence})
assert len(rows)==200 and len({r['id'] for r in rows})==200
combos=[]
for size in range(1,6):
    for fs in itertools.combinations(features,size):
        covered=[r for r in rows if any(r['features'][f]['supported'] for f in fs)]
        counts=[sum(r['round']==i for r in covered) for i in range(1,5)]
        combos.append({'features':list(fs),'name':' + '.join(features[f] for f in fs),'size':size,'questions':counts,'points':[n*2 for n in counts],'average':sum(counts)/2,'coveredIds':[r['id'] for r in covered]})
assert len(combos)==31
for a in combos:
    for b in combos:
        if set(a['features'])<=set(b['features']): assert set(a['coveredIds'])<=set(b['coveredIds'])
out={'date':'2026-11-05','method':'수동 자료 근거 충족도. 실제 응시·점수 예측 아님. 2026 전체 회차를 학습 원천에서 제외. 충분으로 판정한 문항만 2점, 미확인·부분 근거·찍기 0점. 조합은 문항 합집합. 전체 자료를 검토한 범위로 학습 시간과 기억률은 반영하지 않음.', 'limitations':['독립 평가자가 재채점한 검증 결과가 아닌 단일 수동 판정이다.','미충족은 내용 부재 확정이 아니라 이번 검토에서 충분한 근거를 확인하지 못했다는 뜻이다.','이전 기출의 보기·도표도 근거에 포함한다. 오답 보기를 참인 사실로 학습하지 않는다.','4회차 정답은 사이트 학습용 기준이며 공식 정답 대조 미완료.','실제 오늘의 학습에는 2026 기출도 포함되며, 이 분석의 연도 제외는 분석용 처리다.'], 'sourceCounts':{'game':54,'practice':72,'priorQuestions':650,'dailyHoldout':776,'dailyActual':976},'sourceHashes':{p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in ['README.md','assets/network/study-data.js','assets/network/questions.js','assets/network/latest-paper.js','assets/network/past-papers.js']},'features':features,'combinations':combos,'rows':rows}
# Preserve the actual source text beside each selected source ID for review.
source_lookup={**lookup,**{q['id']:q for q in s['keywords']},**{q['id']:q for q in s['practice']}}
used={i for r in rows for v in r['features'].values() for i in v['sources'] if i in source_lookup}
out['evidenceSources']={i:source_lookup[i] for i in sorted(used)}
out['theorySource']='README.md 전체(키워드·명령어·계산표 포함). 제6장만 평가한 값이 아님.'
ad=ROOT/'audits';ad.mkdir(exist_ok=True)
(ad/'2026-feature-combinations.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
with (ad/'2026-feature-combinations.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f);w.writerow(['기능수','조합','1회','2회','3회','4회','평균']);w.writerows([[x['size'],x['name'],*x['points'],x['average']] for x in combos])
with (ad/'2026-feature-evidence.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.writer(f);w.writerow(['회차','문항','문제','참조정답',*features]);w.writerows([[r['round'],r['number'],r['question'],r['referenceAnswer'],*[('충족: '+','.join(r['features'][k]['sources'])) if r['features'][k]['supported'] else '미확인/불충분' for k in features]] for r in rows])
print(json.dumps([{k:v for k,v in x.items() if k!='coveredIds'} for x in combos],ensure_ascii=False,indent=2))
report='''# 2026년 1~4회 기능별 자료 충족도와 시험 7일 전 계획

작성일: 2026-11-05. 결론은 **기출을 풀고, 틀린 이유에 해당하는 핵심정리만 찾아 외운다. 산성비는 짧은 복습으로 쓴다.**

이 문서의 점수는 사람이나 AI가 실제로 시험을 치른 성적이 아니다. 사이트 자료에 정답을 판단할 충분한 근거가 있는 문항에 2점을 부여한 **자료 충족도 환산점**이다. 따라서 ‘이 기능을 일주일 쓰면 이 점수를 받는다’거나 합격 확률로 해석할 수 없다.

## 지난번 결과와 달라진 이유

이전에 남긴 FEATURE-COVERAGE.md는 2026년 **4회차만** 평가했다. 당시 오늘의 학습 30점, 산성비 20점, 핵심정리 66점, 자체 문제풀이 24점이었다. 1~3회차 성적 기록은 없었다. 그때도 실제 응시 성적이 아닌 자료 판정이었다.

현재 오늘의 학습에는 기출문제까지 들어가므로 그때의 30점과 직접 비교할 수 없다. 이번에는 2026년 4개 회차 200문항을 대상으로 범위를 넓혔다. 4회차의 산성비·자체문제·핵심정리 판정은 기존 기록을 유지했다.

## 비교 기준

| 기호 | 기능 | 이번 평가에서 사용하는 내용 |
|---|---|---|
| D | 오늘의 학습 | 키워드 전체 예시 54개 + 자체 72문항 + 2022~2025 기출 650문항, 총 776개 |
| G | 산성비 | 54개 키워드의 단서·정답·짧은 힌트만. 펼친 문제 예시 설명 제외 |
| T | 핵심정리 | README 전체의 키워드표·숫자표·계산·명령어·이론. 제6장만 의미하지 않음 |
| Q | 자체 문제풀이 | 자체 제작 72문항과 해설. 기출과 중복 집계하지 않도록 별도 정의 |
| F | 기출문제 | 사이트에 수록한 2022~2025년 13개 회차, 650문항과 정답·도표 |

실제 사이트 오늘의 학습은 976개 풀이고 기출에는 2026년 평가 대상 200문항도 들어 있다. **동일 시험 문제와 정답을 모두 학습하고 그대로 기억했다면 해당 시험의 재현 점수는 100점**이다. 이는 전이 능력 평가가 아니므로 아래 표는 2026년 전체를 학습 원천에서 제외했다. 이 연도 제외는 분석용 처리이며 현재 앱 설정을 바꾸지 않았다.

충분한 근거를 확인한 문항만 2점, 부분 근거·미확인·찍기는 0점이다. 여러 기능을 합칠 때 같은 문항은 한 번만 센다. 전체 자료를 검토한 범위로, 오늘의 학습 1회나 게임 한 판으로 얻는 점수가 아니다. 관련 사실들을 조합하면 추가로 풀 수 있는 경우도 있지만, 기능 간 부분 근거 결합은 가산하지 않았다.

원천 기출의 ‘옳지 않은 설명’ 정답 문장은 거짓이다. 이를 참인 사실로 사용하지 않고, 같은 오답 패턴 또는 참인 나머지 보기의 내용만 근거로 썼다. 2026년 4회차는 사이트의 학습용 정답 기준이며 공식 정답 대조가 끝나지 않았다. 단일 검토자의 수동 판정이므로 경계 문항에 따라 집계가 바뀔 수 있다. 미확인은 내용 부재의 확정이 아니다.

## 단독 사용

| 기능 | 1회 | 2회 | 3회 | 4회 | 평균 |
|---|---:|---:|---:|---:|---:|
'''
def table_row(x): return '| '+x['name']+' | '+' | '.join(str(v) for v in [*x['points'],x['average']])+' |\n'
report+=''.join(table_row(x) for x in combos if x['size']==1)
report+='''
핵심정리 단독의 최저 66점은 33문항 분량이다. 그중 4문항을 잊으면 58점이므로 ‘단독으로 합격 가능’이라고 단정할 수 없다. 산성비+자체 문제풀이도 30~44점 범위여서 주력 학습으로 부족하다.

## 2·3·4·5개 조합 전체

기능이 5개이므로 단독 5개, 2개 조합 10개, 3개 조합 10개, 4개 조합 5개, 5개 조합 1개다. 아래 26개와 단독 5개를 합쳐 31개다.

| 조합 | 1회 | 2회 | 3회 | 4회 | 평균 |
|---|---:|---:|---:|---:|---:|
'''
report+=''.join(table_row(x) for x in combos if x['size']>1)
report+='''
오늘의 학습이 산성비·자체문제·기출의 내용을 포함하므로 D+G, D+Q, D+F는 범위가 늘지 않는다. 다만 출제 방식과 반복 간격은 달라 기억에 도움을 줄 수 있으며, 그 효과는 이 표가 측정하지 않는다. 핵심정리도 G와 Q의 이번 충족 문항을 모두 포함하므로 T+G+Q의 범위는 T와 같다.

## 일주일에 무엇이 효율적인가

자료 범위와 학습 효율은 다르다. 이용 시간·실제 오답·지연 재시험 기록이 없어 ‘점수/시간’의 실측 순위는 계산할 수 없다. D의 80.5점은 776개 전체를 살펴본 결과여서, 무작위 오늘의 학습만 일주일 한다는 전략의 예상 점수가 아니다.

선택할 주력은 **F+T, 즉 기출 반복 + 오답에 해당하는 핵심정리**다. 전체 F의 평균 76점에 T를 더하면 평균 88점, 평균 6문항의 근거가 추가된다. 반면 F에 G를 더하면 평균 2.5점, Q를 더하면 평균 1.5점 증가한다. F+T에서 다섯 기능 전체로 늘려도 평균 1점만 추가된다. 이는 기능 자체의 가치가 아니라 이 200문항에 대한 추가 범위 차이다.

| 추가 선택 | 4개 회차 환산점 증가 | 평균 증가 |
|---|---|---:|
| 기출에 핵심정리 추가 | +10 / +10 / +12 / +16 | +12 |
| 기출에 산성비 추가 | +4 / +4 / +0 / +2 | +2.5 |
| 기출에 자체문제 추가 | +2 / +2 / +2 / +0 | +1.5 |
| 기출+핵심정리에서 전체 기능으로 | +0 / +2 / +2 / +0 | +1 |

650문항을 일주일에 전부 외우려 하지 않는다. 아래 6개 회차 300문항을 먼저 보고 반복한다. 위 F+T 점수를 이 300문항만 공부했을 때의 점수로 바꾸어 해석하면 안 된다. 이 제한 회차 학습의 점수는 별도 평가하지 않았다.

## 60점 목표의 수치

필기는 50문항·50분, 합격 기준은 100점 만점 60점이다. 따라서 30문항 정답이 필요하다. 근거: [ICQA 검정 안내](https://exam.icqa.or.kr/cn/page/network).

학습 목표는 30문항에 맞추기보다 **이유를 설명할 수 있는 36~40문항(72~80점)**으로 잡는다. 36개를 확실히 익혔다면 6개를 놓쳐도 30개다. 이 숫자는 여유분을 정한 운영 목표이지 합격 보장이 아니다.

같은 문항 구성이라고 가정한 단순 산술 예시는 다음과 같다. 산성비 단독은 최대 15문항으로 30문항 목표에 못 미친다. 핵심정리의 최저 범위 33문항 중 30개를 맞히려면 약 90.9%, 기출+핵심정리의 최저 범위 40문항 중 30개라면 75%를 정답으로 연결해야 한다. 미래 시험 출제 범위와 개인 기억률이 같다는 보장은 없으며 이 비율은 합격 확률이 아니다.

‘정답 번호가 기억난다’는 성공으로 세지 않는다. 정답을 가리고 답의 뜻과 틀린 보기 하나의 이유를 말한 뒤, 다음 날 다시 맞혔을 때 확보 문항으로 센다. 틀리거나 찍어 맞힌 문제는 모두 복습한다. 읽기만 반복하기보다 기억에서 꺼내 답하는 연습을 권하는 근거는 [Roediger·Karpicke의 인출 연습 실험](https://pubmed.ncbi.nlm.nih.gov/16507066/)이며, 이 연구로 우리 서비스의 점수 증가량을 추정한 것은 아니다.

## 7일 계획: 하루 2시간, 총 14시간

매일 기본 배분: 어제 오답 재시험 10분 + 회차 풀이 50분 + 오답 판별 이유 정리 30분 + 해당 핵심정리 20분 + 오늘의 학습/산성비 합계 10분 = 120분. 첫날의 재시험 시간은 기본 포트·계층 점검에 쓴다. 짧은 복습 기능은 두 개를 꼭 다 할 필요 없이 하나만 골라도 된다.

| 남은 날 | 주력 회차 | 핵심정리·추가학습 | 완료 기준 |
|---|---|---|---|
| D-7 | 2026년 4회 | 현재 실력 진단. 포트·계층·명령어 오답 분류 | 찍은 정답까지 복습 목록에 넣기 |
| D-6 | 2026년 3회 | DNS, OSI/PDU, TCP·UDP, 라우팅 | 전날 오답을 가리고 재시험 |
| D-5 | 2026년 2회 | Windows Server 2022, AD·IIS·DHCP·Hyper-V | 도구/기능/명령어를 연결 |
| D-4 | 2026년 1회 | /26~ /30 서브넷, chmod, Linux 계정 | 계산·권한 문제를 직접 풀이 |
| D-3 | 2025년 4회 | 반복 출제되는 지문 판별 기준 정리 | 최신 4회차 공통 오답 우선 해결 |
| D-2 | 2025년 3회 | 남은 공통 오답과 아래 보충 항목 | 학습한 회차 중 2개에서 36개 이상을 이유와 함께 설명하는지 점검 |
| D-1 | 2026년 4회 재시험 | 새 자료 확장보다 남은 오답·명령어 복습 | 시간 내 30개 이상, 목표 36~40개. 반복 점수는 실력 예측과 구별 |

2025년 3회차 이후를 먼저 공부한다는 기존 원칙을 유지했다. Windows Server 출제 기준 변경은 [ICQA 공지](https://exam.icqa.or.kr/cn/board/notice/463)를 참고한다. 이전 연도는 부족한 영역의 반복 패턴을 찾을 때만 확장한다. 이미 위 회차를 충분히 외웠다면 회차 읽기를 반복하기보다 보기 순서를 바꾸고 오답 이유를 설명한다.

하루 1시간밖에 없다면 50문항 실전 풀이는 이틀로 나누고, 하루 25문항 25분 + 오답 재시험 20분 + 필요한 핵심정리 10분 + 산성비 5분으로 축소한다. 회차 수보다 오답을 다음 날 맞히는 데 우선순위를 둔다.

## 어느 내용을 더 공부할까

먼저 F+T에서 추가되는 분야를 보충한다. 사설 IP 전체 대역, OSI 순서·PDU, IPv6 축약, IMAP/POP3, BGP 정책, DHCP MCLT, 클라우드 서비스 모델, `ss`·`ip addr`·권한 해석이다. 기출 오답에 나온 것부터 20분 핵심정리 시간에 공부한다.

그 뒤 아래는 전체 기능을 합쳐도 이번 판정에서 충분한 근거를 확인하지 못한 항목이다. **출제 빈도 순위가 아니라 이번 200문항에서 확인된 보충 목록**이다. 먼저 두 번 등장하는 Hyper-V 검사점과 여러 Windows 관리 문제, 기본 명령어 공백부터 보완한다.

| 보충 묶음 | 공부할 판별 기준 | 해당 2026 문항 |
|---|---|---|
| Hyper-V | 검사점(Checkpoint)의 시점 상태 복원. 백업과 구별 | 2회45, 3회45 |
| Windows 관리 | AD 유니버설 그룹 범위, IIS 로그 위치 변경·FTP 역할 설치·수동 FTP 포트/외부 IP | 1회43·45, 2회44, 4회36 |
| Linux 기본 해석 | `chmod -R`, `mkdir → rm -rf → mv`, ps 출력 PID/PPID, RHEL9 GRUB2 | 1회28, 3회41, 4회39·45 |
| Windows 보안 | WinRM의 Remote Management Users, SAM의 해시 저장 | 4회34·37 |
| 네트워크 동작 | MTU와 DF=0 단편화, CRC 생성 다항식, 루프와 MAC flooding 구별 | 4회7·27·50 |
| 프로토콜 분류·절차 | NTP 응용 계층, TLS1.3 ClientHello, SSH는 Windows에서도 사용 가능 | 4회10·15, 1회2 |
| 추가 개념 | VTP 3모드, 무선 AP 채널, IPv4/IPv6 전환 방식, DHCP 할당 방식 | 1회26, 2회27, 3회14·17 |

이 항목들을 추가했다고 환산점에 그대로 가산하지 않았다. 보충 학습 자료를 만들고 다시 평가하기 전에는 점수 향상량을 알 수 없다. 첫 진단에서 60점 미만이면 새 기능보다 반복 오답 중 쉬운 정의·명령어부터 확보하고, 60~70점이면 계산·조건 보기 실수를 줄인다. 72점 이상을 반복해서 기록하면 범위를 무작정 늘리기보다 지연 재시험과 최신 Windows 문제를 점검한다. 같은 문제 반복 점수와 처음 보는 문제 점수는 따로 기록한다.

## 원자료와 재계산

- 조합 표: [CSV](audits/2026-feature-combinations.csv)
- 200문항별 충족 여부와 근거 ID: [CSV](audits/2026-feature-evidence.csv)
- 선택한 원천 문항·보기·해설, 원본 파일 해시, 조합별 문항 ID: [JSON](audits/2026-feature-combinations.json)
- 수동 판정표·집계 프로그램: `work/coverage-2026/build-comparison.py`
- 분석용 원천 스냅숏: `work/coverage-2026/sources.json`

재계산: 프로젝트 루트에서 `python -X utf8 work/coverage-2026/build-comparison.py` 실행. 200개 대상 ID 중복, 근거 문항 존재, 이전 기출 650문항·2026 제외, 조합 31개, 기능 추가 시 충족 문항 감소 여부를 검사한다. 이는 집계 일관성 검사이며 수동 내용 판정의 정확도를 증명하는 테스트는 아니다. 사이트 UI나 학습 데이터는 이 분석으로 변경하지 않았다.
'''
(ROOT/'STUDY-PLAN-7-DAYS.md').write_text(report,encoding='utf-8')
