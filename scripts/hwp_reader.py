"""Read-only HWP5 compound streams and records, using Python's standard library.

Only local files are read. Macros, OLE objects, links and document scripts are never
executed. Encrypted/distribution documents are rejected rather than bypassed.
Format reference: Hancom HWP5 revision 1.3; output is an extraction, not a renderer.
"""
from pathlib import Path
import struct
import zlib


FREE, END = 0xFFFFFFFF, 0xFFFFFFFE


class CompoundFile:
    def __init__(self, path):
        self.data = Path(path).read_bytes()
        if self.data[:8] != bytes.fromhex("D0CF11E0A1B11AE1"):
            raise ValueError("Not a compound HWP5 file")
        self.sector_size = 1 << self.u16(30)
        self.mini_size = 1 << self.u16(32)
        if self.sector_size not in (512, 4096) or self.mini_size != 64:
            raise ValueError("Unsupported compound sector layout")
        difat = list(struct.unpack_from("<109I", self.data, 76))
        next_difat = self.u32(68)
        for _ in range(self.u32(72)):
            block = self.sector(next_difat)
            values = struct.unpack("<" + "I" * (self.sector_size // 4), block)
            difat.extend(values[:-1])
            next_difat = values[-1]
        self.fat = []
        for sid in [x for x in difat if x < 0xFFFFFFFA][: self.u32(44)]:
            self.fat.extend(struct.unpack("<" + "I" * (self.sector_size // 4), self.sector(sid)))
        directory = self.chain(self.u32(48), self.fat)
        self.entries = []
        for offset in range(0, len(directory), 128):
            raw = directory[offset:offset + 128]
            if len(raw) != 128:
                raise ValueError("Truncated directory")
            length = struct.unpack_from("<H", raw, 64)[0]
            name = raw[:max(0, length - 2)].decode("utf-16le", errors="strict") if length else ""
            self.entries.append({"name": name, "type": raw[66],
                "left": struct.unpack_from("<I", raw, 68)[0],
                "right": struct.unpack_from("<I", raw, 72)[0],
                "child": struct.unpack_from("<I", raw, 76)[0],
                "start": struct.unpack_from("<I", raw, 116)[0],
                "size": struct.unpack_from("<Q", raw, 120)[0]})
        root = self.entries[0]
        self.mini_stream = self.chain(root["start"], self.fat)[:root["size"]]
        mini_fat = self.chain(self.u32(60), self.fat) if self.u32(64) else b""
        self.mini_fat = list(struct.unpack("<" + "I" * (len(mini_fat) // 4), mini_fat))
        self.paths = {}
        visited = set()

        def walk(index, prefix):
            if index == FREE:
                return
            if index >= len(self.entries) or index in visited:
                raise ValueError("Invalid directory tree")
            visited.add(index)
            entry = self.entries[index]
            walk(entry["left"], prefix)
            path = prefix + entry["name"]
            if entry["type"] == 2:
                self.paths[path] = entry
            elif entry["type"] == 1:
                walk(entry["child"], path + "/")
            walk(entry["right"], prefix)

        walk(root["child"], "")

    def u16(self, offset):
        return struct.unpack_from("<H", self.data, offset)[0]

    def u32(self, offset):
        return struct.unpack_from("<I", self.data, offset)[0]

    def sector(self, sid):
        start = (sid + 1) * self.sector_size
        block = self.data[start:start + self.sector_size]
        if len(block) != self.sector_size:
            raise ValueError("Sector outside file")
        return block

    def chain(self, start, fat, mini=False):
        chunks, seen = [], set()
        while start not in (FREE, END):
            if start >= len(fat) or start in seen:
                raise ValueError("Invalid allocation chain")
            seen.add(start)
            if mini:
                chunks.append(self.mini_stream[start * self.mini_size:(start + 1) * self.mini_size])
            else:
                chunks.append(self.sector(start))
            start = fat[start]
        return b"".join(chunks)

    def read(self, name):
        entry = self.paths[name]
        return self.chain(entry["start"], self.mini_fat if entry["size"] < 4096 else self.fat,
                          mini=entry["size"] < 4096)[:entry["size"]]


def records(data):
    offset = 0
    while offset < len(data):
        if offset + 4 > len(data):
            raise ValueError("Truncated record")
        value = struct.unpack_from("<I", data, offset)[0]
        offset += 4
        tag, level, size = value & 1023, (value >> 10) & 1023, value >> 20
        if size == 4095:
            size = struct.unpack_from("<I", data, offset)[0]
            offset += 4
        if offset + size > len(data):
            raise ValueError("Record extends past stream")
        yield tag, level, data[offset:offset + size]
        offset += size


def paragraph_text(data):
    output, offset = [], 0
    extended = {1, 2, 3, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23}
    while offset + 2 <= len(data):
        code = struct.unpack_from("<H", data, offset)[0]
        if code < 32:
            output.append("\t" if code == 9 else "\n" if code in (10, 13) else "")
            offset += 16 if code in extended else 2
        else:
            output.append(chr(code))
            offset += 2
    return "".join(output).replace("\r", "").strip()


def open_hwp(path):
    compound = CompoundFile(path)
    header = compound.read("FileHeader")
    flags = struct.unpack_from("<I", header, 36)[0]
    if flags & (2 | 4):
        raise ValueError("Encrypted/distribution HWP is not supported")
    compressed = bool(flags & 1)
    sections = []
    for name in sorted(n for n in compound.paths if n.startswith("BodyText/Section")):
        data = compound.read(name)
        if compressed:
            data = zlib.decompress(data, -15)
        sections.append(list(records(data)))
    return compound, sections, compressed
