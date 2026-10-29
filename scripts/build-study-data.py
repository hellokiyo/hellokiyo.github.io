"""README.md의 학습 콘텐츠를 정적 웹 데이터로 변환합니다. 외부 패키지 불필요."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
lines = (ROOT / 'README.md').read_text(encoding='utf-8-sig').splitlines()

def inline(text):
    tokens = []
    def token(value):
        tokens.append(value)
        return f'\x00{len(tokens)-1}\x00'
    text = re.sub(r'`([^`]+)`', lambda m: token('<code>'+html.escape(m[1])+'</code>'), text)
    def link(m):
        url = m[2]
        if not (url.startswith('https://') or url.startswith('#')):
            return m[1]
        return token('<a href="'+html.escape(url, quote=True)+'"'+(' target="_blank" rel="noopener noreferrer"' if url.startswith('https://') else '')+'>'+html.escape(m[1])+'</a>')
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    text = html.escape(text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    return re.sub(r'\x00(\d+)\x00', lambda m: tokens[int(m[1])], text)

def cells(line):
    return [x.strip() for x in line.strip().strip('|').split('|')]

def plain(text):
    return re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',text.replace('`','').replace('**',''))

def render(block):
    out=[]; i=0
    while i<len(block):
        line=block[i]
        if not line.strip():
            i+=1;continue
        if line.startswith('```'):
            code=[];i+=1
            while i<len(block) and not block[i].startswith('```'):
                code.append(block[i]);i+=1
            out.append('<pre><code>'+html.escape('\n'.join(code))+'</code></pre>');i+=1;continue
        heading=re.match(r'^(#{2,6})\s+(.+)',line)
        if heading:
            level=min(len(heading[1]),4)
            out.append(f'<h{level}>'+inline(heading[2])+f'</h{level}>');i+=1;continue
        if line.startswith('|'):
            table=[]
            while i<len(block) and block[i].startswith('|'):
                table.append(cells(block[i]));i+=1
            out.append('<div class="table-wrap"><table><thead><tr>'+''.join('<th scope="col">'+inline(c)+'</th>' for c in table[0])+'</tr></thead><tbody>')
            for row in table[2:]:
                out.append('<tr>'+''.join('<td>'+inline(c)+'</td>' for c in row)+'</tr>')
            out.append('</tbody></table></div>');continue
        if re.match(r'^(- |\d+\. )',line):
            ordered=bool(re.match(r'^\d+\.',line));tag='ol' if ordered else 'ul';out.append('<'+tag+'>')
            while i<len(block) and re.match(r'^(- |\d+\. )',block[i]):
                item=re.sub(r'^(- |\d+\. )','',block[i]);item=re.sub(r'^\[ \] ','□ ',item)
                out.append('<li>'+inline(item)+'</li>');i+=1
            out.append('</'+tag+'>');continue
        paragraph=[]
        while i<len(block) and block[i].strip() and not re.match(r'^(#|\||```|- |\d+\. )',block[i]):
            paragraph.append(block[i].lstrip('> '));i+=1
        if paragraph:out.append('<p>'+inline(' '.join(paragraph))+'</p>')
        else:i+=1
    return '\n'.join(out)

sections=[];keywords=[];commands=[];current='';sub='';blocks=[]
for i,line in enumerate(lines):
    if line.startswith('## ') and line!='## 목차':
        if current:sections.append({'id':str(len(sections)), 'title':current, 'html':render(blocks)})
        current=line[3:];blocks=[line];sub=''
    elif current:blocks.append(line)
    if line.startswith('### '):sub=line[4:]
    if line.startswith('|') and i+1<len(lines) and re.match(r'^\|[- :|]+\|$',lines[i+1]):
        rows=[];j=i+2
        while j<len(lines) and lines[j].startswith('|'):
            rows.append(cells(lines[j]));j+=1
        if current.startswith('2.'):
            for row in rows:
                if len(row)==3:keywords.append({'id':f'k{len(keywords)}','category':sub,'cue':plain(row[0]),'answer':plain(row[1]),'hint':plain(row[2])})
        if current.startswith('5.'):
            for row in rows:
                if len(row)>=2:
                    if cells(line)[0] in ('명령', 'vi 명령', '파일·설정'):
                        row = [row[1], row[0]] + row[2:]
                    commands.append({'id':f'c{len(commands)}','category':sub,'purpose':plain(row[0]),'command':plain(row[1]),'hint':plain(row[2]) if len(row)>2 else ''})
if current:sections.append({'id':str(len(sections)), 'title':current, 'html':render(blocks)})
plan=[
('진단부터 시작하기','50문항을 50분 동안 풀고, 약점 3개와 기준 점수를 기록해요.','quiz'),
('DNS · 포트 · 메일 · FTP','레코드와 서비스 포트를 빈 표에 채워 보세요.','keywords'),
('OSI · 장비 · NAT · VLAN · RAID','핵심 단서만 보고 용어를 말해 보세요.','keywords'),
('IPv4 · 사설 주소 · 서브넷','호스트 수, 네트워크, 브로드캐스트를 각각 5문제씩.','theory/3'),
('TCP · UDP · ICMP · IPv6','연결 순서, 헤더 차이, IPv6 축약을 확인해요.','theory/2'),
('Windows 네트워크 명령어','목적을 보고 명령어와 옵션을 직접 적어 보세요.','commands'),
('Linux 명령어 · 디렉터리 · 로그','ps와 top, df와 du, last와 lastb를 구별해요.','commands'),
('권한 · passwd · systemctl · vi','권한 계산을 재현하고 중간 모의 연습을 해요.','quiz'),
('DHCP · DNS 질의 · 라우팅','RIP, OSPF, BGP를 비교하고 DORA를 외워요.','theory/5'),
('IIS · AD · Apache · BIND','설정 목적과 도구, 지시자를 연결해요.','commands'),
('ARQ · 무선 · 클라우드 · 보안','인접 개념과 혼동되는 키워드를 정리해요.','keywords'),
('실전 연습 + 약점 복습','50분 동안 풀고 찍어서 맞힌 문제도 복습해요.','quiz'),
('실전 재점검 + 오답','목표는 40/50문항. 부족한 S영역을 보강해요.','wrong'),
('최종 체크 · 응시 준비','짧은 오답 복습 후 신분증과 입실 시간을 확인해요.','theory/9')]
data={'keywords':keywords,'commands':commands,'sections':sections,'plan':[{'day':i,'title':p[0],'description':p[1],'view':p[2]} for i,p in enumerate(plan)]}
output=ROOT/'assets/network/study-data.js'
output.write_text('/* README.md에서 생성. 갱신: python scripts/build-study-data.py */\nwindow.STUDY_DATA = '+json.dumps(data,ensure_ascii=False).replace('</','<\\/')+';\n',encoding='utf-8')
print(f'Generated {len(keywords)} keywords, {len(commands)} commands, {len(sections)} reader sections.')

