"""기존 favicon.svg의 N· 로고를 PNG 앱 아이콘으로 재현합니다."""
import struct,zlib,binascii
from pathlib import Path
out=Path(__file__).resolve().parents[1]/'assets/network'
for name,size,scale in [('icon-192.png',192,1),('icon-512.png',512,1),('icon-maskable.png',512,.82)]:
    poly=[(17,45),(17,19),(23,19),(41,45),(47,45),(47,19),(41,19),(41,35),(29,19),(17,19)]
    def inside(x,y):
        hit=False
        for (a,b),(c,d) in zip(poly,poly[1:]+poly[:1]):
            if (b>y)!=(d>y) and x<(c-a)*(y-b)/(d-b)+a:hit=not hit
        return hit
    rows=bytearray()
    for py in range(size):
        rows.append(0)
        for px in range(size):
            x=((px+.5)/size-.5)*64/scale+32;y=((py+.5)/size-.5)*64/scale+32
            rows.extend((212,229,157) if (x-48)**2+(y-47)**2<=16 else (246,247,239) if inside(x,y) else (37,79,61))
    def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',binascii.crc32(kind+data)&0xffffffff)
    (out/name).write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(rows))+chunk(b'IEND',b''))
