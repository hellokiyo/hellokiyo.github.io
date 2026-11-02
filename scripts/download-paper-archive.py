"""Restore verified source PDFs from the catalog; leave unresolved sources explicit."""
from pathlib import Path
from urllib.parse import quote,urlsplit,urlunsplit,unquote
import json,urllib.request,re

root=Path(__file__).resolve().parents[1]
for row in json.loads((root/'materials/papers/catalog.json').read_text(encoding='utf-8')):
 url=row.get('pdfUrl')
 if not url:
  print('Pending:',row['url']);continue
 date=''.join(re.search(r'(\d{4})년 (\d{2})월 (\d{2})일',row['title']).groups())
 kind='student' if '학생용' in unquote(url) else 'teacher'
 dest=root/f'materials/papers/network-{date}-{kind}.pdf'
 if dest.exists() and dest.read_bytes().startswith(b'%PDF-'):continue
 parts=urlsplit(url);url=urlunsplit((parts.scheme,parts.netloc,quote(unquote(parts.path),safe='/()'),parts.query,parts.fragment))
 data=urllib.request.urlopen(url,timeout=30).read()
 if not data.startswith(b'%PDF-'):raise ValueError('Not a PDF: '+date)
 dest.write_bytes(data);print(date,len(data))
