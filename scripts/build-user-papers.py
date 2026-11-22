"""Import the user's local teacher/student HWP papers. No network or executable content.

Run from the repository root with Python 3. Source files remain in docs/test.
HWP5 picture references use HWPTAG_SHAPE_COMPONENT_PICTURE's BinDataID at byte 71.
Teacher option markers must agree with the independent trailing answer table.
"""
from pathlib import Path
from difflib import SequenceMatcher
import hashlib
import json
import re
import struct
import zlib

from hwp_reader import open_hwp, paragraph_text

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets/network/data/exam-papers.js"
IMAGES = ROOT / "assets/network/papers/imported"
EXAMS = {
    "PC정비사2급": ("pc", "pc2", "PC정비사 2급", 50),
    "리눅스마스터2급": ("linux-master-2", "lm2", "리눅스마스터 2급", 80),
    "정보처리기사": ("information-processing-engineer", "ipe", "정보처리기사", 100),
}
CHOICES = "①②③④"
CORRECT = "❶❷❸❹"
OPTION = re.compile("([" + CHOICES + CORRECT + "])")
NOISE = re.compile(r"전자문제집|www\.comcbt\.com|PC 버전 및 모바일|교사용/학생용|오답 및 오탈자|OMR 형식|필기 기출문제|과목\s*:")


def events(path, extract_images=False):
    compound, sections, compressed = open_hwp(path)
    result = []
    picture_count = 0
    for section in sections:
        for tag, level, payload in section:
            if tag == 67:
                value = paragraph_text(payload)
                if value:
                    result.append(("text", value))
            elif tag == 85:
                picture_count += 1
                binary_id = struct.unpack_from("<H", payload, 71)[0]
                stream = next((p for p in compound.paths if p.startswith(f"BinData/BIN{binary_id:04X}.")), None)
                if not stream:
                    raise ValueError(f"Missing picture {binary_id}: {path}")
                raw = compound.read(stream)
                if compressed:
                    raw = zlib.decompress(raw, -15)
                extension = ("gif" if raw.startswith(b"GIF8") else "png" if raw.startswith(b"\x89PNG") else "jpg" if raw.startswith(b"\xff\xd8") else None)
                if not extension:
                    raise ValueError(f"Unsupported picture signature: {path}: {binary_id}")
                name = hashlib.sha256(raw).hexdigest()[:24] + "." + extension
                if extract_images:
                    IMAGES.mkdir(parents=True, exist_ok=True)
                    (IMAGES / name).write_bytes(raw)
                result.append(("image", "assets/network/papers/imported/" + name))
    return result


def read_questions(path, expected, extract_images=False):
    groups = []
    current = None
    category = "기출문제"
    for kind, value in events(path, extract_images):
        if kind == "text" and re.match(r"\d+과목\s*:", value):
            category = value.split(":", 1)[1].strip()
        match = re.match(r"^(\d+)\.\s*(.+)", value) if kind == "text" else None
        if match and int(match[1]) == len(groups) + 1 and len(groups) < expected:
            current = {"number": int(match[1]), "category": category, "parts": [("text", match[2])]}
            groups.append(current)
        elif current and not (kind == "text" and NOISE.search(value)):
            current["parts"].append((kind, value))
    if len(groups) != expected:
        raise ValueError(f"{path.name}: {len(groups)}/{expected} questions")
    # The last question ends before CBT's repeated footer and answer-key grid.
    last = groups[-1]["parts"]
    for index, (kind, value) in enumerate(last):
        if index and kind == "text" and value == "1":
            groups[-1]["parts"] = last[:index]
            break
    return groups


def answer_table(path, expected):
    values = [value.strip() for kind, value in events(path) if kind == "text"]
    for start in range(len(values) - expected * 2, -1, -1):
        if values[start:start + 10] != [str(n) for n in range(1, 11)]:
            continue
        answers = []
        for base in range(0, expected, 10):
            block = values[start + base * 2:start + base * 2 + 20]
            if block[:10] != [str(n) for n in range(base + 1, base + 11)] or any(v not in CHOICES for v in block[10:]):
                break
            answers.extend(CHOICES.index(v) for v in block[10:])
        if len(answers) == expected:
            return answers
    raise ValueError(f"Answer table not found: {path.name}")


def parse_question(group, answer):
    question = []
    options = [[], [], [], []]
    selected = None
    markers = []
    images = []
    image_options = []
    for kind, value in group["parts"]:
        if kind == "image":
            images.append(value)
            target = image_options.pop(0) if image_options else selected
            (question if target is None else options[target]).append(f"[그림 {len(images)}]")
            continue
        chunks = OPTION.split(value) if OPTION.match(value) else [value]
        image_options = []
        if chunks[0].strip():
            (question if selected is None else options[selected]).append(chunks[0].strip())
        for index in range(1, len(chunks), 2):
            marker = chunks[index]
            selected = (CHOICES if marker in CHOICES else CORRECT).index(marker)
            if marker in CORRECT:
                markers.append(selected)
            options[selected].append(chunks[index + 1].strip())
            if not chunks[index + 1].strip():
                image_options.append(selected)
    if markers != [answer]:
        raise ValueError(f"Question {group['number']}: marker {markers} != key {answer}")
    options = ["\n".join(p).strip() for p in options]
    if not all(options):
        raise ValueError(f"Empty option: {group['number']}")
    return {"number": group["number"], "category": group["category"], "question": "\n".join(question), "options": options, "answer": answer, "images": images}


def explanations(path, questions):
    # Match the complete teacher question opening, rather than numbered explanation lists.
    result = {}
    current = None
    collecting = False
    lines = []
    normalized = lambda text: re.sub(r"\s+", "", text)
    def save():
        if current and lines:
            result[current] = "\n".join(lines).strip()
    for kind, value in events(path):
        if kind != "text":
            continue
        match = re.match(r"^(\d+)\.\s+", value)
        number = int(match[1]) if match else None
        candidate = questions[number - 1] if number and number <= len(questions) else None
        opening = f"{number}. {candidate['parts'][0][1]}" if candidate else ""
        same_question = candidate and (normalized(value).startswith(normalized(opening)) or SequenceMatcher(None, normalized(value), normalized(opening)).ratio() >= 0.85)
        if same_question:
            save(); current = number; collecting = False; lines = []
        elif "<문제 해설>" in value:
            collecting = True
            remainder = value.split("<문제 해설>", 1)[1].strip()
            if remainder:
                lines.append(remainder)
        elif collecting and not NOISE.search(value):
            if value == "1" and current == len(questions):
                save(); break
            lines.append(value)
    save()
    return result


def main():
    banks = {}
    report = {"source": "사용자 제공 docs/test HWP", "papers": [], "limits": ["제공 파일의 정답표 대조이며 시행기관 최신 공식 정답 재검수는 아님", "HWP 그림은 원본 비트맵, 텍스트와 표는 문단 순서로 추출", "해설집이 없는 문항에는 해설 미제공을 명시"]}
    for folder, (exam_id, prefix, name, expected) in EXAMS.items():
        source = ROOT / "docs/test" / folder
        banks[exam_id] = []
        teachers = sorted(source.glob("*교사용*.hwp"))
        for teacher in teachers:
            stamp = re.search(r"20\d{6}", teacher.name)[0]
            date = f"{stamp[:4]}-{stamp[4:6]}-{stamp[6:]}"
            paper_id = f"{prefix}-{stamp}"
            groups = read_questions(teacher, expected, True)
            key = answer_table(teacher, expected)
            student = next(source.glob(f"*{stamp}*학생용*.hwp"))
            if answer_table(student, expected) != key:
                raise ValueError(f"Teacher/student answer table mismatch: {teacher.name}")
            student_groups = read_questions(student, expected)
            normalize = lambda parts: [(k, re.sub(r"\s+", "", v.translate(str.maketrans(CORRECT, CHOICES)))) for k, v in parts]
            for teacher_q, student_q in zip(groups, student_groups):
                if normalize(teacher_q["parts"]) != normalize(student_q["parts"]):
                    raise ValueError(f"Teacher/student body mismatch: {teacher.name} #{teacher_q['number']}")
            commentary = next(source.glob(f"*{stamp}*해설*.hwp"), None)
            notes = explanations(commentary, groups) if commentary else {}
            questions = []
            for group, answer in zip(groups, key):
                q = parse_question(group, answer)
                q.update(id=f"{paper_id}-{q['number']:03}", paperId=paper_id, sourceTitle=f"{name} {date}", explanation=notes.get(q["number"], "제공된 교사용 정답표 기준입니다. 이 문항의 상세 해설은 제공 파일에 없거나 자동 대조되지 않았습니다. 원본과 정답을 함께 확인하세요."), explanationStatus="provided" if q["number"] in notes else "answer-only")
                if exam_id == "linux-master-2" and stamp == "20210313" and q["number"] == 41:
                    q["acceptedAnswers"] = [2, 3]
                    q["explanation"] = "제공 해설집은 이 문항의 확정답을 3·4번 복수 정답으로 안내합니다. 이 연습에서도 두 답을 정답 처리합니다. 교사용 정답표에는 4번만 표시되어 있습니다.\n\n" + q["explanation"]
                questions.append(q)
            paper = {"id": paper_id, "examId": exam_id, "title": f"{name} 필기 · {date}", "date": date, "year": int(stamp[:4]), "round": None, "label": f"{int(stamp[4:6])}월 {int(stamp[6:])}일", "questions": questions, "expectedCount": expected, "pendingNumbers": [], "answerStatus": "제공 교사용 정답 표시·교사용/학생용 정답표 대조", "original": teacher.relative_to(ROOT).as_posix(), "source": student.relative_to(ROOT).as_posix(), "sourceName": "사용자 제공 CBT 자료", "standardLabel": "시험 당시 기준", "previousStandard": False}
            banks[exam_id].append(paper)
            report["papers"].append({"examId": exam_id, "date": date, "count": len(questions), "images": sum(len(q["images"]) for q in questions), "explanations": len(notes), "teacher": teacher.relative_to(ROOT).as_posix(), "student": student.relative_to(ROOT).as_posix(), "sha256": hashlib.sha256(teacher.read_bytes()).hexdigest(), "bodyMatched": True, "answersMatched": True})
        banks[exam_id].sort(key=lambda p: p["date"], reverse=True)
    OUTPUT.write_text("/* Generated by scripts/build-user-papers.py from user-provided HWP; do not edit. */\n(function(root){\n\"use strict\";\nconst banks=" + json.dumps(banks, ensure_ascii=False, separators=(",", ":")) + ";\nconst api={get:(examId)=>banks[examId]||[]};\nroot.ExamPapers=api;\nif(typeof module!==\"undefined\")module.exports=api;\n})(typeof window!==\"undefined\"?window:globalThis);\n", encoding="utf-8")
    (ROOT / "audits/user-papers-2026-11-16.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(report['papers'])} papers / {sum(p['count'] for p in report['papers'])} questions")


if __name__ == "__main__":
    main()
