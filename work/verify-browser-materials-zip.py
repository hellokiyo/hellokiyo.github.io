from pathlib import Path
import json, zipfile
archive=Path(r'C:\Users\jhpox\Downloads\network-materials-2026-11-01.zip')
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    assert len(z.namelist())==3
    script=z.read('assets/network/public-materials.js').decode('utf-8')
    records=json.loads(script.split('window.PUBLIC_MATERIALS = ',1)[1].strip().removesuffix(';'))
    assert len(records)==2
    for r in records:
        assert len(z.read(r['url']))==r['size']
    assert any(r['reviewed'] and r['notes']=='검증용 샘플 · 실제 시험문제 아님' for r in records)
    print('Browser-generated ZIP verified: 2 original files, metadata, notes, reviewed state and CRC.')
