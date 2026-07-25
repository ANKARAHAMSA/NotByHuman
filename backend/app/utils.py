import io
import re
from typing import str

def clean_text(text: str) -> str:
    """Normalize line endings and strip unnecessary whitespace."""
    if not text:
        return ""
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def count_words(text: str) -> int:
    """Count clean words in a text."""
    return len(re.findall(r'\b\w+\b', text))

def parse_txt_file(content: bytes) -> str:
    """Parse UTF-8 or ASCII plain text file bytes."""
    try:
        return content.decode('utf-8')
    except UnicodeDecodeError:
        return content.decode('latin-1', errors='ignore')

def parse_docx_file(content: bytes) -> str:
    """Parse Microsoft Word .docx document bytes."""
    try:
        import docx
        doc = docx.Document(io.BytesIO(content))
        full_text = []
        for para in doc.paragraphs:
            if para.text.strip():
                full_text.append(para.text.strip())
        return '\n\n'.join(full_text)
    except Exception as e:
        raise ValueError(f"Failed to parse .docx file: {e}")
