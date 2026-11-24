"""수동 근거 대조 결과의 산술·이력 기록. 단어 존재만으로 정답 여부를 판단하지 않는다."""
import json,sys
from pathlib import Path
root=Path(__file__).resolve().parent.parent
folder=root/'audits/practical-2026-11-25/epochs'
epoch=int(sys.argv[1]);numbers=[int(value) for value in sys.argv[2].split(',')]
previous=json.loads((folder/f'epoch-{epoch-1:02}.json').read_text(encoding='utf-8'))
for item in previous['items']:
 if item['number'] in numbers:
  item.update(solved=True,evidence=sys.argv[3],decision=sys.argv[4])
previous.update(epoch=epoch,score=round(sum(item['weight'] for item in previous['items'] if item['solved']),1))
(folder/f'epoch-{epoch:02}.json').write_text(json.dumps(previous,ensure_ascii=False,indent=2),encoding='utf-8')
print(f"epoch {epoch}: {previous['score']}/100")
